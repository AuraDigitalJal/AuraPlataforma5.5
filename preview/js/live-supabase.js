/* Aura Digital · Live View Supabase v9 · PRUEBAS
   La invitación (HTML) y sus recursos se guardan en Supabase Storage.
   Realtime Broadcast notifica al visor; latest.json ofrece recuperación.
   Nunca utilizar service_role ni claves secret en el navegador.
*/
(function(){
'use strict';
const $=id=>document.getElementById(id),BUCKET='aura-live',KEY='aura-live-supabase-config-v1',VERS='aura-live-supabase-v9';
const btn=$('aura-live-toggle'),panel=$('aura-live-panel'),input=$('aura-live-link'),copy=$('aura-live-copy'),stop=$('aura-live-stop'),status=$('aura-live-status');
if(!btn||!panel||!input||!copy||!stop||!status)return;
let sb=null,owner='',room='',channel=null,sending=false,queued=false,timer=0,revision=0,syncedRevision=0;
let assets=new WeakMap(),serial=0,config=null,paths=[],lastError='';
const settings=document.createElement('div');
settings.id='aura-sb-settings';
settings.innerHTML='<div style="border-top:1px solid #e5d9cf;padding-top:12px;margin-top:11px">'+
 '<strong style="font-size:12px">Conectar proyecto Supabase</strong>'+
 '<p style="font:11px/1.5 system-ui;color:#74675e">Una sola vez: pega los datos públicos del proyecto Supabase configurado con el SQL de Aura Live View.</p>'+
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
config=settingsLoad();
if(config){urlEl.value=config.url;keyEl.value=config.key;}
function setOpen(open){
 panel.hidden=false;
 settings.hidden=!open;
 input.hidden=open;copy.hidden=open;stop.hidden=open;
 if(input.closest('label'))input.closest('label').hidden=open;
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
 const {error}=await sb.storage.from(BUCKET).upload(path,file,{
  cacheControl:overwrite?'0':'3600',upsert:overwrite,contentType:mime
 });
 if(error)throw new Error('Supabase Storage: '+error.message);
 if(!overwrite)paths.push(path);
 return publicUrl(path);
}
async function prepareAsset(file){
 const mime=contentType(file);
 if(!/^(image\/(jpeg|png|webp|gif)|audio\/(mpeg|mp4|wav|ogg|webm|aac|flac)|video\/mp4)$/.test(mime)){
  throw Error('Formato no admitido: '+file.name+'. Usa JPG, PNG, WebP, MP3 o M4A.');
 }
 if(file.size>40*1024*1024)throw Error('El archivo '+file.name+' supera 40 MB.');
 if(file.size<=6*1024*1024||!mime.startsWith('image/'))return {blob:file,mime};
 // Reducir únicamente la copia temporal para Live View, sin modificar original.
 let bitmap;
 try{bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});}
 catch(_){throw Error('No se pudo abrir '+file.name+'. Guarda una versión JPG y vuelve a intentar.');}
 try{
  const max=Math.max(bitmap.width,bitmap.height);
  for(const [side,quality] of [[3200,.94],[2800,.92],[2500,.9],[2200,.87],[1900,.85]]){
   const scale=Math.min(1,side/max),can=document.createElement('canvas');
   can.width=Math.round(bitmap.width*scale);can.height=Math.round(bitmap.height*scale);
   can.getContext('2d').drawImage(bitmap,0,0,can.width,can.height);
   const result=await new Promise(resolve=>can.toBlob(resolve,'image/jpeg',quality));
   can.width=1;can.height=1;
   if(result&&result.size<=6*1024*1024)return {blob:result,mime:'image/jpeg'};
  }
  throw Error('La foto no pudo optimizarse; usa JPG de menos de 6 MB.');
 }finally{bitmap.close?.();}
}
async function uploadAsset(file,label){
 if(!file)return '';
 let cached=assets.get(file);if(cached)return cached;
 tell('Subiendo '+label+' a Supabase ('+(file.size/1048576).toFixed(1)+' MB)…');
 const payload=await prepareAsset(file);
 const path=owner+'/'+room+'/assets/'+(++serial)+'-'+hex(5)+extension(payload.mime);
 let url=await put(path,payload.blob,payload.mime);
 assets.set(file,url);
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
  const filename='previews/revision-'+String(seq).padStart(7,'0')+'-'+hex(5)+'.html';
  const path=owner+'/'+activeRoom+'/'+filename;
  const publicHtml=await put(path,new Blob([html],{type:'text/html;charset=utf-8'}),'text/html');
  const pointer={version:seq,url:publicHtml,updatedAt:Date.now(),ended:false};
  const latestPath=owner+'/'+activeRoom+'/latest.json';
  await put(latestPath,new Blob([JSON.stringify(pointer)],{type:'application/json'}),'application/json',true);
  if(room!==activeRoom)return;
  syncedRevision=seq;
  if(channel){
   try{await channel.send({type:'broadcast',event:'update',payload:pointer});}
   catch(error){console.warn('Supabase Broadcast no disponible; el visor recuperará las actualizaciones.',error);}
  }
  tell('Live View actualizado ✓ · Fotos y música en Supabase');
 }catch(error){tell('Error: '+error.message,true);console.warn('Aura Live View Supabase:',error);}
 finally{
  sending=false;
  if(room===activeRoom&&(queued||revision!==startedAtRevision)){queued=false;clearTimeout(timer);timer=setTimeout(sync,650);}
 }
}
async function begin(){
 if(room){setOpen(false);return;}
 setOpen(true);
 if(!config){tell('Configura primero el proyecto de Supabase.');return;}
 if(!valid(config.url,config.key)){tell('URL o clave pública no válidas.',true);return;}
 btn.disabled=true;
 try{
  sb=client();
  let session=await sb.auth.getSession();
  let user=session.data?.session?.user;
  if(!user){
   tell('Iniciando sesión anónima de pruebas en Supabase…');
   const result=await sb.auth.signInAnonymously();
   if(result.error)throw Error('Activa Anonymous Sign-Ins en Supabase Auth: '+result.error.message);
   user=result.data.user;
  }
  if(!user?.id)throw Error('No se pudo obtener identidad de Supabase.');
  owner=user.id;room='aura-live-'+hex(20);assets=new WeakMap();serial=0;revision=0;syncedRevision=0;paths=[];
  const u=new URL('live.html',location.href);
  u.searchParams.set('v',VERS);u.searchParams.set('sb',config.url);u.searchParams.set('pk',config.key);
  u.searchParams.set('owner',owner);u.hash=room;
  input.value=u.toString();
  const broadcast='aura:'+room;
  channel=sb.channel(broadcast,{config:{private:false,broadcast:{ack:true}}});
  channel.subscribe(st=>{if(st==='SUBSCRIBED')tell('Conectado a Supabase. Sincronizando invitación…');});
  btn.textContent='Live View activo';btn.setAttribute('aria-pressed','true');
  setOpen(false);schedule(50);
 }catch(error){
  tell('No se pudo activar: '+error.message,true);
  room='';setOpen(true);
 }finally{btn.disabled=false;}
}
async function finish(){
 if(!room){panel.hidden=true;return;}
 let old=room,formerChannel=channel;
 clearTimeout(timer);room='';revision++;closeChannel();
 btn.textContent='Compartir Live View';btn.setAttribute('aria-pressed','false');
 input.value='';panel.hidden=true;stop.hidden=true;copy.hidden=true;
 try{
  // No borra fotografías automáticamente para evitar cortes instantáneos.
  const path=owner+'/'+old+'/latest.json',payload={version:revision,ended:true,updatedAt:Date.now()};
  await sb.storage.from(BUCKET).upload(path,new Blob([JSON.stringify(payload)],{type:'application/json'}),{upsert:true,contentType:'application/json',cacheControl:'0'});
  if(formerChannel)await formerChannel.send({type:'broadcast',event:'update',payload});
 }catch(error){console.warn('No se pudo avisar fin de sesión:',error);}
}
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
 catch(_){input.focus();input.select();tell('Copia manualmente el enlace seleccionado.');}
});
if(typeof updatePreview==='function'){
 const old=updatePreview;
 updatePreview=function(){const output=old.apply(this,arguments);schedule();return output;};
}
window.addEventListener('pagehide',()=>{clearTimeout(timer);closeChannel();});
})();
