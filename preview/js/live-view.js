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
  /* Fotografías Live View HQ:
     Una imagen NO se debe dividir entre todas las fotos en un HTML gigante.
     Se envía una vez como adjunto temporal; el HTML solo guarda su URL.
     Para una nueva edición se reutiliza la URL previa del mismo File. */
  var photoCache = new WeakMap();
  function progress(message){ if(room) say(message,false); }
  function photoBudget(total){
    // ntfy.sh limita la cuota total por visitante; reservar espacio para HTML,
    // audio y sustituciones de fotografías dentro de una misma sesión.
    return Math.min(1750000,Math.max(185000,Math.floor(11*1024*1024/Math.max(1,total))));
  }
  async function decodeImage(file){
    if(typeof createImageBitmap==='function'){
      try{
        var bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
        return {source:bitmap,width:bitmap.width,height:bitmap.height,close:function(){bitmap.close?.();}};
      }catch(_){}
      try{
        var plain=await createImageBitmap(file);
        return {source:plain,width:plain.width,height:plain.height,close:function(){plain.close?.();}};
      }catch(_){}
    }
    return await new Promise(function(resolve,reject){
      var temp=URL.createObjectURL(file),image=new Image();
      image.onload=function(){
        URL.revokeObjectURL(temp);
        resolve({source:image,width:image.naturalWidth,height:image.naturalHeight,close:function(){image.src='';}});
      };
      image.onerror=function(){
        URL.revokeObjectURL(temp);
        reject(new Error('No se puede abrir la imagen; prueba con JPG, PNG o WebP.'));
      };
      image.src=temp;
    });
  }
  async function prepareImage(file,budget){
    var cached=photoCache.get(file);
    if(cached&&cached.blob&&cached.blob.size<=budget)return cached;
    var mime=String(file.type||'').toLowerCase();
    if(mime==='image/gif'&&file.size<=budget){
      var animated={blob:file,ext:'.gif'};
      photoCache.set(file,animated);
      return animated;
    }
    var decoded=await decodeImage(file);
    try{
      var sizes=[2600,2400,2200,2000,1850,1700,1550,1400,1250,1150];
      var qualities=[.94,.93,.92,.91,.90,.88,.87,.86,.85,.84];
      for(var attempt=0;attempt<sizes.length;attempt++){
        var scale=Math.min(1,sizes[attempt]/Math.max(decoded.width,decoded.height));
        var width=Math.max(1,Math.round(decoded.width*scale));
        var height=Math.max(1,Math.round(decoded.height*scale));
        var canvas=document.createElement('canvas');
        canvas.width=width;canvas.height=height;
        var ctx=canvas.getContext('2d');
        if(!ctx)throw new Error('No se pudo preparar el lienzo.');
        ctx.drawImage(decoded.source,0,0,width,height);
        var blob=await new Promise(function(resolve){
          canvas.toBlob(resolve,'image/webp',qualities[attempt]);
        });
        canvas.width=1;canvas.height=1;
        if(blob&&blob.size<=budget){
          var ext=blob.type==='image/png'?'.png':blob.type==='image/jpeg'?'.jpg':'.webp';
          var result={blob:blob,ext:ext};
          photoCache.set(file,result);
          return result;
        }
      }
      // No enviar una foto diminuta / borrosa; solicitar otro formato.
      throw new Error('La foto necesita más espacio. Usa una versión JPG de tamaño normal o reduce la cantidad de fotografías de esta sesión.');
    }finally{decoded.close();}
  }
  async function livePhoto(file,label,problems,activeRoom,budget){
    if(!file)return '';
    var hit=mediaCache.get(file);
    if(hit&&hit.room===activeRoom&&hit.type==='photo'&&Date.now()-hit.time<85*60*1000)return hit.url;
    var payload=await prepareImage(file,budget);
    var photoUrl=await publishFile(activeRoom,payload.blob,'aura-photo-'+label+payload.ext);
    mediaCache.set(file,{room:activeRoom,type:'photo',url:photoUrl,time:Date.now()});
    return photoUrl;
  }
  async function liveAsset(file,label,problems,activeRoom){
    if(!file)return '';
    var hit=mediaCache.get(file);
    if(hit&&hit.room===activeRoom&&Date.now()-hit.time<85*60*1000)return hit.url;
    try{
      if(file.size>MAX_UPLOAD){
        problems.push('Música o video muy grande: '+file.name+' (no se transmitirá).');
        return '';
      }
      var url=await publishFile(activeRoom,file,'aura-asset-'+fileLabel(file,label));
      mediaCache.set(file,{room:activeRoom,type:'media',url:url,time:Date.now()});
      return url;
    }catch(error){
      problems.push('No se pudo enviar la música '+file.name+': '+error.message);
      return '';
    }
  }
  async function makeSnapshot(activeRoom){
    var p=getFormParams();
    var assets=previewAssets(p);
    var notes=[];
    var byKey={cover:p.portadaFile,banner:p.bannerFile,extra:p.bannerExtraFile,extra2:p.bannerExtra2File,bg:p.bgFile,poster:p.videoPosterFile,transferPhoto:p.transferPhotoFile};
    var names=Object.keys(byKey);
    var gallery=p.galleryFiles||[];
    var photoCount=gallery.length+names.filter(function(key){return Boolean(byKey[key]);}).length;
    var budget=photoBudget(photoCount);
    var transferred=0;
    for(var i=0;i<names.length;i++){
      var key=names[i];
      if(!byKey[key])continue;
      progress('Enviando fotografía '+(transferred+1)+' de '+photoCount+' en alta calidad…');
      try{assets[key]=await livePhoto(byKey[key],key,notes,activeRoom,budget);}
      catch(error){throw new Error('Foto "'+key+'": '+error.message);}
      transferred++;
    }
    assets.gallery=[];
    for(var k=0;k<gallery.length;k++){
      progress('Enviando fotografía '+(transferred+1)+' de '+photoCount+' en alta calidad…');
      try{assets.gallery.push(await livePhoto(gallery[k],'gallery-'+k,notes,activeRoom,budget));}
      catch(error){throw new Error('Foto de galería '+(k+1)+': '+error.message);}
      transferred++;
    }
    if(assets.sharePreview&&/^blob:/.test(assets.sharePreview))assets.sharePreview='';
    assets.music=p.musicFile?await liveAsset(p.musicFile,'music',notes,activeRoom):'';
    var html=buildInvitation(p,assets);
    if(/(?:src|href)=["']blob:/i.test(html)){
      notes.push('Hay elementos locales que no se pueden compartir en vivo.');
    }
    return {html:html,notes:notes,photoTotal:transferred};
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
    say('Preparando invitación en alta calidad…');
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
        say(snapshot.notes.length ? 'Actualizado, con avisos: '+snapshot.notes.slice(0,2).join(' · ') : 'Vista actualizada ✓ · '+snapshot.photoTotal+' foto(s) en alta calidad', snapshot.notes.length>0);
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