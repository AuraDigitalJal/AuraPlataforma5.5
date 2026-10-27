/* Aura Digital · Live View experimental · solo /preview/ */
(function () {
  'use strict';
  var CHANNEL_HOST = 'https://ntfy.sh/';
  var MAX_UPLOAD = 1900000;
  var ROOM_PREFIX = 'aura-live-';
  var room = '';
  var sending = false;
  var timer = null;
  var revision = 0;
  var lastSentAt = 0;
  var sequence = 0;
  var mediaCache = new WeakMap();
  var liveButton = document.getElementById('aura-live-toggle');
  var panel = document.getElementById('aura-live-panel');
  var status = document.getElementById('aura-live-status');
  var link = document.getElementById('aura-live-link');
  var copyButton = document.getElementById('aura-live-copy');
  var stopButton = document.getElementById('aura-live-stop');
  if (!liveButton || !panel || !status || !link || !copyButton || !stopButton) return;

  function say(message, problem) {
    status.textContent = message;
    status.style.color = problem ? '#a52c37' : '';
  }
  function makeRoom() {
    var bits = new Uint8Array(20);
    crypto.getRandomValues(bits);
    return ROOM_PREFIX + Array.from(bits, function (v) { return v.toString(16).padStart(2, '0'); }).join('');
  }
  function viewerLink(channel) {
    return new URL('live.html', window.location.href).origin +
      new URL('live.html', window.location.href).pathname + '#'+ channel;
  }
  function schedule(delay) {
    if (!room) return;
    revision++;
    clearTimeout(timer);
    var wait = typeof delay === 'number' ? delay : 1350;
    wait = Math.max(wait, 3700 - (Date.now() - lastSentAt));
    timer = setTimeout(sendCurrent, wait);
  }
  function fileLabel(file, fallback) {
    var extension = ((file && file.name) || '').match(/\.[a-z0-9]{2,5}$/i);
    return fallback + (extension ? extension[0].toLowerCase() : '.bin');
  }
  async function publishFile(topic, blob, filename) {
    if (blob.size > MAX_UPLOAD) throw new Error('Archivo de Live View supera el límite de tamaño (' + Math.round(blob.size / 1024) + ' KB).');
    var address = CHANNEL_HOST + encodeURIComponent(topic) + '?f=' + encodeURIComponent(filename);
    var response = await fetch(address, {method:'POST', body:blob, cache:'no-store'});
    if (!response.ok) throw new Error('Servicio Live View: HTTP ' + response.status);
    var data = await response.json();
    if (!data.attachment || !/^https:\/\/ntfy\.sh\//.test(data.attachment.url || '')) {
      throw new Error('No se recibió el enlace del archivo compartido.');
    }
    return data.attachment.url;
  }
  async function shrinkImage(file) {
    if (file.size <= MAX_UPLOAD) return file;
    var bitmap;
    try { bitmap = await createImageBitmap(file); }
    catch (_) { return file; }
    try {
      var limit = 1900;
      for (var attempt=0; attempt<5; attempt++) {
        var ratio = Math.min(1, limit / Math.max(bitmap.width,bitmap.height));
        var canvas = document.createElement('canvas');
        canvas.width = Math.max(1,Math.round(bitmap.width*ratio));
        canvas.height = Math.max(1,Math.round(bitmap.height*ratio));
        canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
        var output = await new Promise(function(resolve) {
          canvas.toBlob(resolve, 'image/webp', Math.max(.55,.85-attempt*.075));
        });
        canvas.width=1; canvas.height=1;
        if (output && output.size<=MAX_UPLOAD) return output;
        limit=Math.round(limit*.80);
      }
      throw new Error('Fotografía demasiado grande para la vista remota.');
    } finally { if (bitmap.close) bitmap.close(); }
  }
  async function liveAsset(file, label, problems, activeRoom) {
    if (!file) return '';
    var hit=mediaCache.get(file);
    if(hit && hit.room===activeRoom && Date.now()-hit.time < 85*60*1000) return hit.url;
    try {
      var payload=file;
      var name=fileLabel(file,label);
      if (/^image\//.test(file.type)) {
        payload=await shrinkImage(file);
        if(payload!==file) name=label+'.webp';
      }
      if (payload.size > MAX_UPLOAD) {
        problems.push((file.type.startsWith('audio/')?'Música':file.type.startsWith('video/')?'Video':'Archivo') + ' demasiado grande: '+file.name);
        return '';
      }
      var url=await publishFile(activeRoom,payload,'aura-asset-'+name);
      mediaCache.set(file,{room:activeRoom,url:url,time:Date.now()});
      return url;
    } catch(error) {
      problems.push('No se pudo enviar '+file.name+': '+error.message);
      return '';
    }
  }
  async function makeSnapshot(activeRoom) {
    var p=getFormParams();
    var assets=previewAssets(p);
    var notes=[];
    var fileByKey={cover:p.portadaFile,banner:p.bannerFile,extra:p.bannerExtraFile,extra2:p.bannerExtra2File,bg:p.bgFile,music:p.musicFile,poster:p.videoPosterFile,transferPhoto:p.transferPhotoFile};
    var names=Object.keys(fileByKey);
    for(var i=0;i<names.length;i++) {
      var key=names[i];
      if(fileByKey[key]) assets[key]=await liveAsset(fileByKey[key],key,notes,activeRoom);
    }
    assets.gallery=[];
    var images=p.galleryFiles || [];
    for(var k=0;k<images.length;k++) {
      assets.gallery.push(await liveAsset(images[k],'gallery-'+k,notes,activeRoom));
    }
    var html=buildInvitation(p,assets);
    return {html:html, notes:notes};
  }
  async function compressHtml(html) {
    var bytes = new TextEncoder().encode(html);
    if (typeof CompressionStream !== 'function') return {file:new Blob([bytes],{type:'text/html'}),ext:'.html'};
    var stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
    return {file:await new Response(stream).blob(),ext:'.html.gz'};
  }
  async function sendCurrent() {
    if (!room || sending) return;
    sending=true;
    var activeRoom=room;
    var myRevision=revision;
    var serial=++sequence;
    say('Sincronizando la invitación con el cliente…');
    try {
      var snapshot=await makeSnapshot(activeRoom);
      if(room!==activeRoom || myRevision!==revision) return;
      var compressed=await compressHtml(snapshot.html);
      if(room!==activeRoom || myRevision!==revision) return;
      await publishFile(activeRoom, compressed.file, 'aura-live-'+String(serial).padStart(6,'0')+compressed.ext);
      if(room===activeRoom){
        lastSentAt=Date.now();
        say(snapshot.notes.length ? 'Actualizado, con avisos: '+snapshot.notes.slice(0,2).join(' · ') : 'Vista del cliente actualizada ✓', snapshot.notes.length>0);
      }
    } catch(error) {
      if(room===activeRoom) say('No se pudo sincronizar: '+error.message,true);
    } finally {
      sending=false;
      if(room && (room!==activeRoom || myRevision!==revision)) schedule(800);
    }
  }
  function toggle() {
    if(room){panel.hidden=false;return;}
    if(!window.crypto || !crypto.getRandomValues){say('Este navegador no admite enlace seguro.',true);panel.hidden=false;return;}
    room=makeRoom();sequence=0;lastSentAt=0;mediaCache=new WeakMap();
    link.value=viewerLink(room);
    panel.hidden=false;
    liveButton.setAttribute('aria-pressed','true');
    liveButton.textContent='Live View activo';
    say('Preparando primera vista…');
    schedule(0);
  }
  async function stop() {
    var previous=room;
    room='';revision++;clearTimeout(timer);
    panel.hidden=true;link.value='';
    liveButton.textContent='Compartir Live View';
    liveButton.setAttribute('aria-pressed','false');
    if(previous){
      try{await fetch(CHANNEL_HOST+previous,{method:'POST',body:JSON.stringify({type:'aura-live-ended'})});}
      catch(_){/* Desconexión local de todos modos */ }
    }
  }
  liveButton.addEventListener('click',toggle);
  stopButton.addEventListener('click',stop);
  copyButton.addEventListener('click',async function(){
    if(!room) return;
    try{await navigator.clipboard.writeText(link.value);say('Enlace copiado. Envíalo por WhatsApp.');}
    catch(_){link.focus();link.select();say('Selecciona y copia el enlace.');}
  });
  if (typeof updatePreview === 'function') {
    var previousUpdate=updatePreview;
    updatePreview=function(){var result=previousUpdate.apply(this,arguments);schedule();return result;};
  }
  window.addEventListener('pagehide',function(){clearTimeout(timer);});
})();