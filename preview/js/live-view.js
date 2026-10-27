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
      new URL('live.html', window.location.href).pathname + '?v=aura-live-musica-v5#'+ channel;
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
    if(!response.ok){
      var diagnostic='';
      try{diagnostic=String((await response.text()).slice(0,220)).replace(/[\r\n]+/g,' ');}catch(_){}
      if(response.status===429)throw new Error('HTTP 429: límite de transferencias temporal de ntfy.sh agotado. '+diagnostic);
      if(response.status===413||response.status===507)throw new Error('HTTP '+response.status+': cuota de archivos agotada. '+diagnostic);
      throw new Error('Servicio Live View HTTP '+response.status+(diagnostic?': '+diagnostic:''));
    }
    var data = await response.json();
    if (!data.attachment || !/^https:\/\/ntfy\.sh\//.test(data.attachment.url || '')) {
      throw new Error('No se recibió el enlace del archivo compartido.');
    }
    return data.attachment.url;
  }
  /* Las fotos se transmiten como partes binarias independientes (<2MB).
     El visor del cliente reconstruye la imagen completa antes de mostrarla.
     No se usan URLs blob: del editor ni imágenes JPEG minúsculas. */
  var photoCache=new WeakMap();
  var PHOTO_CHUNK_BYTES=1450000;
  function progress(message){if(room)say(message,false);}
  function photoBudget(p,total){
    var audio=p.musicFile?Math.min(p.musicFile.size||0,12*1024*1024):0;
    // ntfy.sh: 20 MB acumulados por visitante; dejar margen para HTML.
    var available=Math.max(3000000,16*1024*1024-audio);
    return Math.min(8000000,Math.max(900000,Math.floor(available/Math.max(1,total))));
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
      image.onload=function(){URL.revokeObjectURL(temp);resolve({source:image,width:image.naturalWidth,height:image.naturalHeight,close:function(){image.src='';}});};
      image.onerror=function(){URL.revokeObjectURL(temp);reject(new Error('No se pudo abrir la foto. Usa JPG, PNG o WebP.'));};
      image.src=temp;
    });
  }
  async function prepareImage(file,budget){
    var cached=photoCache.get(file);
    if(cached&&cached.blob&&cached.blob.size<=budget)return cached;
    var mime=String(file.type||'').toLowerCase();
    var ext=String(file.name||'').split('.').pop().toLowerCase();
    var types={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif'};
    var known=/^image\/(jpeg|png|webp|gif)$/.test(mime)||(!mime&&Boolean(types[ext]));
    if(known&&file.size<=budget){
      var original={blob:file,mime:mime||types[ext]};
      photoCache.set(file,original);
      return original;
    }
    var decoded=await decodeImage(file);
    try{
      var sizes=[3200,3000,2800,2600,2400,2200,2000,1850,1700,1550,1400,1250,1150,1050];
      var quality=[.95,.94,.93,.92,.91,.90,.89,.88,.87,.86,.85,.84,.82,.80];
      for(var attempt=0;attempt<sizes.length;attempt++){
        var ratio=Math.min(1,sizes[attempt]/Math.max(decoded.width,decoded.height));
        var w=Math.max(1,Math.round(decoded.width*ratio));
        var h=Math.max(1,Math.round(decoded.height*ratio));
        var canvas=document.createElement('canvas');
        canvas.width=w;canvas.height=h;
        var ctx=canvas.getContext('2d');
        if(!ctx)throw new Error('No se pudo procesar la fotografía.');
        ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
        ctx.drawImage(decoded.source,0,0,w,h);
        var output=await new Promise(function(resolve){canvas.toBlob(resolve,'image/jpeg',quality[attempt]);});
        canvas.width=1;canvas.height=1;
        if(output&&output.size<=budget){
          var prepared={blob:output,mime:'image/jpeg'};
          photoCache.set(file,prepared);
          return prepared;
        }
      }
      throw new Error('La foto no entra en el presupuesto de la sesión; intenta JPG de 2 a 5 MB.');
    }finally{decoded.close();}
  }
  async function livePhoto(file,label,activeRoom,budget){
    if(!file)return null;
    var hit=mediaCache.get(file);
    if(hit&&hit.room===activeRoom&&hit.type==='photo'&&Date.now()-hit.time<85*60*1000)return hit.manifest;
    var media=await prepareImage(file,budget);
    var blob=media.blob,partCount=Math.ceil(blob.size/PHOTO_CHUNK_BYTES);
    if(!partCount||partCount>10)throw new Error('Fotografía demasiado grande para la transmisión.');
    var urls=[];
    for(var i=0;i<partCount;i++){
      if(room!==activeRoom)throw new Error('La sesión se cerró.');
      progress('Enviando '+label+' · parte '+(i+1)+' de '+partCount+'…');
      var part=blob.slice(i*PHOTO_CHUNK_BYTES,Math.min(blob.size,(i+1)*PHOTO_CHUNK_BYTES),'application/octet-stream');
      try{
        urls.push(await publishFile(activeRoom,part,'aura-foto-'+label+'-'+(i+1)+'-'+partCount+'.bin'));
      }catch(error){throw new Error('Parte '+(i+1)+' de '+partCount+': '+error.message);}
    }
    var manifest={urls:urls,mime:media.mime,size:blob.size};
    mediaCache.set(file,{room:activeRoom,type:'photo',manifest:manifest,time:Date.now()});
    return manifest;
  }
  /* Audio Live View: las canciones grandes se envían en fragmentos de menos
     de 2 MB. En el teléfono se reconstruye un Blob sin recomprimir el audio. */
  var AUDIO_CHUNK_BYTES=1500000;
  var AUDIO_MAX_BYTES=12*1024*1024;
  function musicMime(file){
    var mime=String(file.type||'').toLowerCase();
    if(/^audio\/[a-z0-9.+-]+$/.test(mime))return mime;
    var ext=(file.name||'').split('.').pop().toLowerCase();
    return ({mp3:'audio/mpeg',m4a:'audio/mp4',aac:'audio/aac',wav:'audio/wav',ogg:'audio/ogg',webm:'audio/webm',flac:'audio/flac'})[ext]||'audio/mpeg';
  }
  async function liveMusic(file,problems,activeRoom){
    if(!file)return null;
    var hit=mediaCache.get(file);
    if(hit&&hit.room===activeRoom&&hit.type==='music'&&Date.now()-hit.time<85*60*1000){
      return hit.manifest;
    }
    if(file.size>AUDIO_MAX_BYTES){
      problems.push('La canción pesa '+(file.size/1048576).toFixed(1)+' MB; el máximo temporal de Live View es 12 MB. Para verla en vivo usa MP3 o M4A de menor tamaño. Tu original no se modificó.');
      return null;
    }
    var n=Math.ceil(file.size/AUDIO_CHUNK_BYTES);
    if(!n)return null;
    var urls=[];
    for(var i=0;i<n;i++){
      progress('Enviando música sin pérdida de calidad · parte '+(i+1)+' de '+n+'…');
      var start=i*AUDIO_CHUNK_BYTES;
      var part=file.slice(start,Math.min(file.size,start+AUDIO_CHUNK_BYTES),'application/octet-stream');
      // Un nuevo cambio puede cancelar la sesión mientras se envían partes.
      if(room!==activeRoom)throw new Error('La sesión de Live View terminó.');
      var url=await publishFile(activeRoom,part,'aura-audio-'+String(i+1).padStart(3,'0')+'-'+n+'.bin');
      urls.push(url);
    }
    var manifest={version:1,urls:urls,mime:musicMime(file),size:file.size};
    mediaCache.set(file,{room:activeRoom,type:'music',manifest:manifest,time:Date.now()});
    return manifest;
  }
  async function makeSnapshot(activeRoom){
    var p=getFormParams(),assets=previewAssets(p),notes=[];
    var byKey={cover:p.portadaFile,banner:p.bannerFile,extra:p.bannerExtraFile,extra2:p.bannerExtra2File,bg:p.bgFile,poster:p.videoPosterFile,transferPhoto:p.transferPhotoFile};
    var names=Object.keys(byKey),gallery=p.galleryFiles||[];
    var photoCount=gallery.length+names.filter(function(key){return Boolean(byKey[key]);}).length;
    var budget=photoBudget(p,photoCount),photoManifests=[],transferred=0,serial=0;
    async function insert(file,label){
      var token='__AURA_LIVE_PHOTO_'+(serial++)+'__';
      var m=await livePhoto(file,label,activeRoom,budget);
      photoManifests.push({token:token,urls:m.urls,mime:m.mime,size:m.size});
      transferred++;
      return token;
    }
    for(var i=0;i<names.length;i++){
      var key=names[i];
      if(byKey[key]){
        try{assets[key]=await insert(byKey[key],key);}
        catch(error){throw new Error('Foto "'+key+'": '+error.message);}
      }
    }
    assets.gallery=[];
    for(var k=0;k<gallery.length;k++){
      try{assets.gallery.push(await insert(gallery[k],'gallery-'+k));}
      catch(error){throw new Error('Galería, foto '+(k+1)+': '+error.message);}
    }
    if(assets.sharePreview&&/^blob:/.test(assets.sharePreview))assets.sharePreview='';
    var musicManifest=null;
    if(p.musicFile){
      try{musicManifest=await liveMusic(p.musicFile,notes,activeRoom);}
      catch(error){notes.push('Música no transmitida: '+error.message);}
    }
    assets.music=musicManifest?'__AURA_LIVE_MUSIC_PENDING__':'';
    var html=buildInvitation(p,assets);
    if(musicManifest)html=html.replace('</head>','<script id="aura-live-audio-manifest" type="application/json">'+JSON.stringify(musicManifest)+'</script></head>');
    if(photoManifests.length)html=html.replace('</head>','<script id="aura-live-photo-manifest" type="application/json">'+JSON.stringify({version:1,photos:photoManifests})+'</script></head>');
    if(/(?:src|href)=["']blob:/i.test(html))notes.push('Algunos recursos locales aún no se pueden transmitir.');
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