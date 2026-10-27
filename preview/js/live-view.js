/* Aura Digital · Live View experimental · solo /preview/ */
(function () {
  'use strict';
  var CHANNEL_HOST = 'https://ntfy.sh/';
  var MAX_UPLOAD = 1900000;
  var MAX_IMAGE_UPLOAD = 650000;
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
  // Las fotos viajan dentro de la vista HTML. Las URL blob: del editor
  // SOLO funcionan en esta computadora y los enlaces a fotos externas
  // pueden caducar o bloquearse en un teléfono diferente.
  var photoCache = new WeakMap();

  function dataUrl(blob) {
    return new Promise(function(resolve,reject){
      var reader=new FileReader();
      reader.onload=function(){resolve(String(reader.result||''));};
      reader.onerror=function(){reject(new Error('No se pudo leer la fotografía.'));};
      reader.readAsDataURL(blob);
    });
  }
  async function decodeImage(file){
    if(typeof createImageBitmap==='function'){
      try{
        var bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
        return {source:bitmap,width:bitmap.width,height:bitmap.height,close:function(){bitmap.close?.();}};
      }catch(_){}
    }
    return await new Promise(function(resolve,reject){
      var tmp=URL.createObjectURL(file);
      var image=new Image();
      image.onload=function(){URL.revokeObjectURL(tmp);resolve({source:image,width:image.naturalWidth,height:image.naturalHeight,close:function(){image.src='';}});};
      image.onerror=function(){URL.revokeObjectURL(tmp);reject(new Error('El navegador no puede abrir este formato de foto. Convierte a JPG o PNG.'));};
      image.src=tmp;
    });
  }
  async function encodePhoto(file,label,budget,problems){
    if(!file)return '';
    var mime=String(file.type||'').toLowerCase();
    var hit=photoCache.get(file);
    if(hit && hit.budget<=budget && hit.url)return hit.url;
    if(file.size<=budget && /^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(mime)){
      var original=await dataUrl(file);
      photoCache.set(file,{budget:file.size,url:original});
      return original;
    }
    var decoded=await decodeImage(file);
    try {
      var maxSide=budget>=150000?1600:budget>=70000?1200:850;
      var best=null;
      for(var attempt=0;attempt<9;attempt++){
        var dimension=maxSide*Math.pow(.83,attempt);
        var factor=Math.min(1,dimension/Math.max(decoded.width,decoded.height));
        var w=Math.max(1,Math.round(decoded.width*factor));
        var h=Math.max(1,Math.round(decoded.height*factor));
        var canvas=document.createElement('canvas');
        canvas.width=w;canvas.height=h;
        var ctx=canvas.getContext('2d');
        if(!ctx)throw new Error('No fue posible preparar la fotografía.');
        ctx.drawImage(decoded.source,0,0,w,h);
        var quality=Math.max(.38,.84-attempt*.057);
        var out=await new Promise(function(resolve){
          canvas.toBlob(resolve,'image/webp',quality);
        });
        canvas.width=1;canvas.height=1;
        if(out){
          if(!best||out.size<best.size)best=out;
          if(out.size<=budget){
            var value=await dataUrl(out);
            photoCache.set(file,{budget:out.size,url:value});
            return value;
          }
        }
      }
      if(best && best.size<=MAX_UPLOAD/2){
        problems.push('Foto "'+label+'" de alta resolución: se muestra con calidad reducida.');
        var fallback=await dataUrl(best);
        photoCache.set(file,{budget:best.size,url:fallback});
        return fallback;
      }
      throw new Error('La imagen excede el tamaño posible para esta sesión. Usa JPG o PNG.');
    }finally{decoded.close();}
  }
  async function liveAsset(file,label,problems,activeRoom) {
    if (!file) return '';
    var hit=mediaCache.get(file);
    if(hit && hit.room===activeRoom && Date.now()-hit.time < 85*60*1000) return hit.url;
    try{
      if(file.size>MAX_UPLOAD){
        problems.push('Música o video muy grande: '+file.name+' (no se transmitirá).');
        return '';
      }
      var url=await publishFile(activeRoom,file,'aura-asset-'+fileLabel(file,label));
      mediaCache.set(file,{room:activeRoom,url:url,time:Date.now()});
      return url;
    }catch(error){
      problems.push('No se pudo enviar el audio '+file.name+': '+error.message);
      return '';
    }
  }
  async function makeSnapshot(activeRoom) {
    var p=getFormParams();
    var assets=previewAssets(p);
    var notes=[];
    var fileByKey={cover:p.portadaFile,banner:p.bannerFile,extra:p.bannerExtraFile,extra2:p.bannerExtra2File,bg:p.bgFile,poster:p.videoPosterFile,transferPhoto:p.transferPhotoFile};
    var names=Object.keys(fileByKey);
    var gallery=p.galleryFiles||[];
    var photoCount=gallery.length+names.filter(function(key){return Boolean(fileByKey[key]);}).length;
    var budget=Math.min(300000,Math.max(10000,Math.floor(1100000/Math.max(1,photoCount))));
    for(var i=0;i<names.length;i++){
      var key=names[i];
      if(fileByKey[key]){
        try{assets[key]=await encodePhoto(fileByKey[key],key,budget,notes);}
        catch(error){assets[key]='';notes.push('Foto "'+key+'": '+error.message);}
      }
    }
    assets.gallery=[];
    for(var k=0;k<gallery.length;k++){
      try{assets.gallery.push(await encodePhoto(gallery[k],'galería '+(k+1),budget,notes));}
      catch(error){assets.gallery.push('');notes.push('Foto de galería '+(k+1)+': '+error.message);}
    }
    // No se requiere el arte de miniatura de WhatsApp en la vista del invitado.
    // Asegurar que no quede ninguna URL blob: interna en el HTML remoto.
    if(assets.sharePreview && /^blob:/.test(assets.sharePreview))assets.sharePreview='';
    assets.music=p.musicFile?await liveAsset(p.musicFile,'music',notes,activeRoom):'';
    var html=buildInvitation(p,assets);
    if(/(?:src|href)=["']blob:/i.test(html))notes.push('Algunos elementos del editor usan archivos locales no transferibles.');
    return {html:html,notes:notes};
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
      if(compressed.file.size>MAX_UPLOAD){
        throw new Error('Esta invitación tiene demasiadas fotos para una sola transmisión. Reduce la cantidad de fotos o usa imágenes más ligeras. (Archivo: '+Math.round(compressed.file.size/1024)+' KB)');
      }
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
    room=makeRoom();sequence=0;lastSentAt=0;mediaCache=new WeakMap();photoCache=new WeakMap();
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