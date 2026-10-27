/* Aura Digital · Live View Supabase v9 · PRUEBAS
   La invitación (HTML) y sus recursos se guardan en Supabase Storage.
   Realtime Broadcast notifica al visor; latest.json ofrece recuperación.
   Nunca utilizar service_role ni claves secret en el navegador.
*/
(function(){
'use strict';
const $=id=>document.getElementById(id),BUCKET='aura-live',KEY='aura-live-supabase-config-v1',VERS='aura-live-supabase-v14';
const btn=$('aura-live-toggle'),panel=$('aura-live-panel'),input=$('aura-live-link'),copy=$('aura-live-copy'),stop=$('aura-live-stop'),status=$('aura-live-status');
const extras=$('aura-live-extras'),extrasToggle=$('aura-live-extras-toggle');
if(!btn||!panel||!input||!copy||!stop||!status||!extras||!extrasToggle)return;
let sb=null,owner='',room='',channel=null,sending=false,queued=false,timer=0,revision=0,syncedRevision=0;
let assets=new WeakMap(),assetFingerprints=new Map(),serial=0,config=null,paths=[],lastError='',activePointer=null,heartbeatTimer=null;
const settings=document.createElement('div');
settings.id='aura-sb-settings';
settings.innerHTML='<div style="border-top:1px solid #e5d9cf;padding-top:12px;margin-top:11px">'+
 '<strong style="font-size:12px">Conectar proyecto Supabase</strong>'+
 '<p style="font:11px/1.5 system-ui;color:#74675e">El proyecto <b>visoraura</b> ya está vinculado. Pulsa <b>Compartir Live View</b>. Si aparece un error de acceso, revisa que estén activados los Anonymous Sign-Ins en Supabase. Los campos siguientes son solo para configuración avanzada.</p>'+
 '<label style="font:11px system-ui;display:block;margin:8px 0">Project URL<input type="url" id="aura-sb-url" autocomplete="off" placeholder="https://xxxx.supabase.co" style="box-sizing:border-box;width:100%;padding:8px;margin-top:4px"></label>'+
 '<label style="font:11px system-ui;display:block;margin:8px 0">Publishable key<input type="password" id="aura-sb-key" autocomplete="off" placeholder="sb_publishable_..." style="box-sizing:border-box;width:100%;padding:8px;margin-top:4px"></label>'+
 '<button type="button" id="aura-sb-connect" style="width:100%;border:1px solid #705847;background:#705847;color:white;border-radius:8px;padding:10px;cursor:pointer">Guardar y conectar</button>'+
 '<small style="display:block;margin-top:8px;color:#82756b">No pegues claves secret/service_role. Este Live View de pruebas usa un bucket público: comparte solo archivos de demostración.</small></div>';
panel.appendChild(settings);
const urlEl=$('aura-sb-url'),keyEl=$('aura-sb-key'),connect=$('aura-sb-connect');
function tell(t,err=false){lastError=t;status.textContent=t;status.style.color=err?'#a32635':'';}
function hex(n){let a=new Uint8Array(n);crypto.getRandomValues(a);return Array.from(a,k=>k.toString(16).padStart(2,'0')).join('');}
function valid(u,k){
 try{const x=new URL(u);
 return x.protocol==='https:'&&/^[a-z0-9-]+\.supabase\.co$/i.test(x.hostname)&&x.pathname==='/'&&
   ((k.startsWith('sb_publishable_')&&k.length>35)||(k.startsWith('eyJ')&&k.length>60))&&!/service_role|sb_secret_/i.test(k);
 }catch(_){return false;}
}
function settingsLoad(){
 try{const c=JSON.parse(localStorage.getItem(KEY)||'null');if(c&&valid(c.url,c.key))return c;}catch(_){}
 return null;
}
config={url:'https://rcstxomjsmvqtpxoekyk.supabase.co/',key:'sb_publishable_SjoI6W6WmBqCTjDDdYgVJA_oKMgxVzO'};
if(config){urlEl.value=config.url;keyEl.value=config.key;}
function showExtras(open){
 extras.hidden=!open;
 extrasToggle.setAttribute('aria-expanded',open?'true':'false');
 extrasToggle.textContent=open?'Ocultar detalles':'Ver detalles';
}
function setOpen(open){
 panel.hidden=false;
 settings.hidden=!open;
 input.hidden=open;copy.hidden=open;stop.hidden=open;
 extrasToggle.hidden=open;
 showExtras(false);
 const directLabel=panel.querySelector('label[for="aura-live-link"]');
 if(directLabel)directLabel.hidden=open;
}
function closeChannel(){
 if(channel&&sb)sb.removeChannel(channel).catch(()=>{});
 channel=null;
}
function client(){
 if(!window.supabase?.createClient)throw Error('No se cargó la biblioteca de Supabase. Revisa la conexión a Internet.');
 return window.supabase.createClient(config.url,config.key,{
  auth:{persistSession:true,detectSessionInUrl:false,autoRefreshToken:true,storageKey:'aura-live-editor-auth-'+new URL(config.url).hostname}
 });
}
function contentType(file){
 const ext=String(file.name||'').split('.').pop().toLowerCase();
 const names={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif',mp3:'audio/mpeg',m4a:'audio/mp4',wav:'audio/wav',ogg:'audio/ogg',webm:'audio/webm',aac:'audio/aac',flac:'audio/flac',mp4:'video/mp4'};
 return names[ext]||file.type||'application/octet-stream';
}
function extension(mime){
 return ({'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/gif':'.gif','audio/mpeg':'.mp3','audio/mp4':'.m4a','audio/wav':'.wav','audio/ogg':'.ogg','audio/webm':'.webm','audio/aac':'.aac','audio/flac':'.flac','video/mp4':'.mp4'})[mime]||'.bin';
}
function publicUrl(path){return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;}
async function put(path,file,mime,overwrite=false){
 if(file.size>6*1024*1024&&!overwrite){
  if(!window.tus?.Upload)throw Error('No se cargó TUS para subir archivos mayores de 6 MB. Revisa tu conexión.');
  const session=await sb.auth.getSession();
  const token=session.data?.session?.access_token;
  if(!token)throw Error('La sesión de Supabase caducó; vuelve a conectar Live View.');
  const host=config.url.replace('.supabase.co/','.storage.supabase.co');
  await new Promise(function(resolve,reject){
   const upload=new window.tus.Upload(file,{
    endpoint:host+'/storage/v1/upload/resumable',
    retryDelays:[0,3000,5000,10000,20000],
    uploadDataDuringCreation:true,
    removeFingerprintOnSuccess:true,
    chunkSize:6*1024*1024,
    headers:{authorization:'Bearer '+token},
    metadata:{bucketName:BUCKET,objectName:path,contentType:mime,cacheControl:'3600'},
    onError:error=>reject(Error('Carga grande: '+error.message)),
    onSuccess:()=>resolve(),
    onProgress:(uploaded,total)=>{
     if(total>0)tell('Subiendo archivo grande '+Math.floor(uploaded/total*100)+' %…');
    }
   });
   upload.findPreviousUploads().then(prior=>{
    if(prior.length)upload.resumeFromPreviousUpload(prior[0]);
    upload.start();
   }).catch(reject);
  });
 }else{
  const {error}=await sb.storage.from(BUCKET).upload(path,file,{
   cacheControl:overwrite?'0':'3600',upsert:overwrite,contentType:mime
  });
  if(error)throw new Error('Supabase Storage: '+error.message);
 }
 if(!overwrite)paths.push(path);
 return publicUrl(path);
}
/* La compresión se aplica SOLO al archivo temporal del Live View:
   los originales del editor y la publicación final conservan su calidad.
   Un teléfono muestra bien fotos de 1800–2400 px; evitar bajar a miniaturas. */
/* Copia ligera para Live View: objetivo 500 KB, margen 800 KB.
   La invitación publicada y el archivo original NUNCA se modifican.
   Animaciones GIF se mantienen intactas para no perder movimiento. */
async function prepareAsset(file){
 const mime=contentType(file);
 if(!/^(image\/(jpeg|png|webp|gif)|audio\/(mpeg|mp4|wav|ogg|webm|aac|flac)|video\/mp4)$/.test(mime)){
  throw Error('Formato no admitido: '+file.name+'. Usa JPG, PNG, WebP, MP3 o M4A.');
 }
 if(file.size>40*1024*1024)throw Error('El archivo '+file.name+' supera 40 MB.');
 const TARGET=500*1024,SOFT_MAX=800*1024;
 if(!mime.startsWith('image/')||mime==='image/gif'||file.size<=TARGET)return {blob:file,mime};
 let decoded=null;
 try{
  if(typeof createImageBitmap==='function'){
   try{
    const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
    decoded={src:bitmap,width:bitmap.width,height:bitmap.height,release:()=>bitmap.close?.()};
   }catch(_){}
  }
  if(!decoded){
   decoded=await new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url);resolve({src:img,width:img.naturalWidth,height:img.naturalHeight,release:()=>{img.src='';}});};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('No se pudo leer la fotografía '+file.name));};
    img.src=url;
   });
  }
  const width=decoded.width,height=decoded.height,largest=Math.max(width,height);
  if(!largest)throw Error('La fotografía no tiene dimensiones válidas.');
  // Empieza con 2000px: suficiente nitidez para el Live View móvil.
  // Reducir progresivamente hasta llegar a ~500 KB conservando detalle.
  const candidates=[[2000,.9],[2000,.85],[1900,.83],[1850,.8],
    [1750,.79],[1650,.77],[1600,.74],[1500,.73],[1450,.7]];
  let bestSoft=null,smallest=null;
  for(const [side,quality] of candidates){
   const scale=Math.min(1,side/largest);
   const can=document.createElement('canvas');
   can.width=Math.max(1,Math.round(width*scale));can.height=Math.max(1,Math.round(height*scale));
   const ctx=can.getContext('2d');
   if(!ctx)throw Error('No se pudo preparar una versión ligera de la foto.');
   ctx.drawImage(decoded.src,0,0,can.width,can.height);
   const blob=await new Promise(resolve=>can.toBlob(resolve,'image/webp',quality));
   can.width=1;can.height=1;
   if(!blob||blob.size>=file.size)continue;
   const actualMime=/^image\/(webp|png|jpeg)$/.test(blob.type||'')?blob.type:'image/webp';
   const result={blob,mime:actualMime};
   if(!smallest||blob.size<smallest.blob.size)smallest=result;
   if(blob.size<=TARGET)return result;
   // La primera copia <=800 KB conserva mayor resolución/calidad.
   if(blob.size<=SOFT_MAX&&!bestSoft)bestSoft=result;
  }
  if(bestSoft)return bestSoft;
  // Sin resultado ideal: evita perder calidad innecesariamente.
  return smallest||{blob:file,mime};
 }finally{decoded?.release?.();}
}
async function uploadAsset(file,label){
 if(!file)return '';
 let cached=assets.get(file);if(cached)return cached;
 const fingerprint=[file.name,file.type,file.size,file.lastModified||0].join('|');
 if(assetFingerprints.has(fingerprint))return assetFingerprints.get(fingerprint);
 tell('Subiendo '+label+' a Supabase ('+(file.size/1048576).toFixed(1)+' MB)…');
 const payload=await prepareAsset(file);
 const path=owner+'/'+room+'/assets/'+(++serial)+'-'+hex(5)+extension(payload.mime);
 let url=await put(path,payload.blob,payload.mime);
 assets.set(file,url);assetFingerprints.set(fingerprint,url);
 return url;
}
async function snapshot(){
 const p=getFormParams(),a=previewAssets(p);
 const fields={cover:p.portadaFile,banner:p.bannerFile,extra:p.bannerExtraFile,extra2:p.bannerExtra2File,bg:p.bgFile,
  poster:p.videoPosterFile,transferPhoto:p.transferPhotoFile,music:p.musicFile};
 for(const [key,file] of Object.entries(fields))a[key]=file?await uploadAsset(file,key==='music'?'música':'fotografía '+key):'';
 a.gallery=[];
 for(let i=0;i<(p.galleryFiles||[]).length;i++)a.gallery.push(await uploadAsset(p.galleryFiles[i],'galería '+(i+1)));
 if(a.sharePreview?.startsWith('blob:'))a.sharePreview='';
 return buildInvitation(p,a);
}
/* Limpieza segura: solo sesiones del mismo usuario Supabase, nunca Pro.
   Se ejecuta al empezar una nueva sesión; evita borrar una prueba abierta.
   Una sesión activa renueva latest.json cada 5 min. */
async function listFolder(prefix){
 const storage=sb.storage.from(BUCKET),all=[];
 for(let offset=0;offset<1000;offset+=100){
  const {data,error}=await storage.list(prefix,{limit:100,offset});
  if(error)throw error;
  all.push(...(data||[]));
  if(!data||data.length<100)break;
 }
 return all;
}
async function cleanAbandonedSessions(myRoom){
 const storage=sb.storage.from(BUCKET);
 const folders=await listFolder(owner);
 for(const folder of folders){
  const other=folder?.name||'';
  if(!/^aura-live-[a-f0-9]{40}$/.test(other)||other===myRoom)continue;
  const prefix=owner+'/'+other;
  const root=await listFolder(prefix);
  const latest=root.find(f=>f.name==='latest.json'&&f.id);
  // No eliminar carpetas sin una marca de tiempo verificable.
  if(!latest)continue;
  const lastTouched=latest.updated_at||latest.created_at;
  if(!lastTouched)continue;
  const age=Date.now()-new Date(lastTouched).getTime();
  if(!Number.isFinite(age)||age<24*60*60*1000)continue;
  const all=[prefix+'/latest.json'];
  for(const dir of ['assets','previews']){
   const items=await listFolder(prefix+'/'+dir);
   for(const entry of items){
    // Borrar solo archivos reconocibles bajo esa sesión.
    if(entry.id&&entry.name&&!entry.name.includes('/'))all.push(prefix+'/'+dir+'/'+entry.name);
   }
  }
  for(let i=0;i<all.length;i+=100){
   const {error}=await storage.remove(all.slice(i,i+100));
   if(error)throw error;
  }
 }
}
async function heartbeat(){
 if(!room||!activePointer||sending||activePointer.room!==room)return;
 const currentRoom=room,pointer={...activePointer,updatedAt:Date.now()};
 try{
  const path=owner+'/'+currentRoom+'/latest.json';
  await put(path,new Blob([JSON.stringify(pointer)],{type:'application/json'}),'application/json',true);
  if(room===currentRoom)activePointer=pointer;
 }catch(error){console.warn('No se pudo renovar la vigencia de la sesión Live View:',error);}
}
function schedule(delay=750){
 if(!room)return;
 revision++;queued=true;clearTimeout(timer);
 timer=setTimeout(sync,delay);
}
async function sync(){
 if(!room||sending)return;
 sending=true;
 const activeRoom=room,startedAtRevision=revision;queued=false;
 try{
  const seq=revision;
  let html=await snapshot();
  if(room!==activeRoom)return;
  if(seq!==revision){queued=true;return;}
  // Sólo existe una vista HTML por sesión. La query ?v impide
  // caché del navegador/CDN al sobrescribirla.
  const path=owner+'/'+activeRoom+'/previews/current.html';
  const publicHtml=await put(path,new Blob([html],{type:'text/html;charset=utf-8'}),'text/html',true);
  if(room!==activeRoom)return;
  const pointer={version:seq,url:publicHtml+'?v='+seq,room:activeRoom,updatedAt:Date.now(),ended:false};
  const latestPath=owner+'/'+activeRoom+'/latest.json';
  await put(latestPath,new Blob([JSON.stringify(pointer)],{type:'application/json'}),'application/json',true);
  if(room!==activeRoom)return;
  syncedRevision=seq;activePointer=pointer;
  if(channel){
   try{await channel.send({type:'broadcast',event:'update',payload:pointer});}
   catch(error){console.warn('Supabase Broadcast no disponible; el visor recuperará las actualizaciones.',error);}
  }
  tell('En vivo · invitación actualizada ✓');
 }catch(error){tell('Error: '+error.message,true);console.warn('Aura Live View Supabase:',error);}
 finally{
  sending=false;
  if(room===activeRoom&&(queued||revision!==startedAtRevision)){queued=false;clearTimeout(timer);timer=setTimeout(sync,650);}
 }
}
async function begin(){
 if(room){setOpen(false);return;}
 setOpen(!config);
 if(!config){tell('No se pudieron cargar los datos públicos del proyecto Supabase.',true);return;}
 if(!valid(config.url,config.key)){tell('URL o clave pública no válidas.',true);return;}
 btn.disabled=true;
 try{
  sb=client();
  let session=await sb.auth.getSession();
  let user=session.data?.session?.user;
  if(!user){
   tell('Conectando con Supabase visoraura…');
   const result=await sb.auth.signInAnonymously();
   if(result.error)throw Error('Supabase Auth rechazó el acceso ('+result.error.message+'). En Supabase abre Authentication → Sign In / Providers y activa Anonymous Sign-Ins.');
   user=result.data.user;
  }
  if(!user?.id)throw Error('No se pudo obtener identidad de Supabase.');
  owner=user.id;room='aura-live-'+hex(20);assets=new WeakMap();assetFingerprints=new Map();serial=0;revision=0;syncedRevision=0;paths=[];activePointer=null;clearInterval(heartbeatTimer);heartbeatTimer=setInterval(heartbeat,5*60*1000);
  const u=new URL('live.html',location.href);
  u.searchParams.set('v',VERS);u.searchParams.set('sb',config.url);u.searchParams.set('pk',config.key);
  u.searchParams.set('owner',owner);u.hash=room;
  input.value=u.toString();
  const broadcast='aura:'+room;
  channel=sb.channel(broadcast,{config:{private:false,broadcast:{ack:true}}});
  channel.subscribe(st=>{if(st==='SUBSCRIBED')tell('Conectado · sincronizando invitación…');});
  btn.textContent='Live View activo';btn.setAttribute('aria-pressed','true');
  setOpen(false);schedule(50);
  cleanAbandonedSessions(room).catch(error=>console.warn('Limpieza de sesiones antiguas no completada:',error));
 }catch(error){
  tell('No se pudo activar: '+error.message,true);
  room='';setOpen(true);
 }finally{btn.disabled=false;}
}
async function finish(){
 if(!room){panel.hidden=true;return;}
 const old=room,formerChannel=channel,oldRevision=revision+1;
 const sessionFiles=Array.from(new Set([...paths,owner+'/'+old+'/previews/current.html']));
 clearInterval(heartbeatTimer);heartbeatTimer=null;activePointer=null;
 clearTimeout(timer);room='';revision=oldRevision;
 btn.textContent='Compartir Live View';btn.setAttribute('aria-pressed','false');
 input.value='';panel.hidden=true;stop.hidden=true;copy.hidden=true;
 try{
  const path=owner+'/'+old+'/latest.json';
  const payload={version:oldRevision,ended:true,updatedAt:Date.now()};
  const result=await sb.storage.from(BUCKET).upload(path,new Blob([JSON.stringify(payload)],{type:'application/json'}),{upsert:true,contentType:'application/json',cacheControl:'0'});
  if(result.error)throw result.error;
  if(formerChannel)await formerChannel.send({type:'broadcast',event:'update',payload});
 }catch(error){console.warn('No se pudo avisar fin de sesión:',error);}
 finally{closeChannel();}
 // Este Live View es temporal: al pulsar terminar, liberar fotos, música
 // y vista de esta sesión. Conservar solo latest.json (fin de sesión).
 try{
  for(let i=0;i<sessionFiles.length;i+=100){
   const result=await sb.storage.from(BUCKET).remove(sessionFiles.slice(i,i+100));
   if(result.error)throw result.error;
  }
  paths=[];
 }catch(error){console.warn('No se pudo liberar toda la sesión temporal:',error);}
}
extrasToggle.addEventListener('click',()=>showExtras(extras.hidden));
btn.addEventListener('click',()=>{begin();});
connect.addEventListener('click',async()=>{
 const url=urlEl.value.trim().replace(/\/+$/,'')+'/',key=keyEl.value.trim();
 if(!valid(url,key)){tell('Revisa la URL y utiliza solo una clave publishable/anon de Supabase.',true);return;}
 config={url,key};
 try{localStorage.setItem(KEY,JSON.stringify(config));}catch(_){}
 tell('Datos guardados. Inicia Live View para probar el proyecto.');
 await begin();
});
stop.addEventListener('click',finish);
copy.addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(input.value);tell('Enlace del cliente copiado.');}
 catch(_){showExtras(true);input.hidden=false;input.focus();input.select();tell('Copia manualmente el enlace seleccionado.');}
});
if(typeof updatePreview==='function'){
 const old=updatePreview;
 updatePreview=function(){const output=old.apply(this,arguments);schedule();return output;};
}
window.addEventListener('pagehide',()=>{clearTimeout(timer);clearInterval(heartbeatTimer);closeChannel();});
})();
