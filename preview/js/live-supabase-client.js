/* Aura Digital · Visor Live View Supabase v9
   Se suscribe a Realtime y consulta latest.json como respaldo.
   Solo recupera HTML alojado en el bucket aura-live de la sesión indicada.
*/
(function(){
'use strict';
const $=id=>document.getElementById(id),s=$('status'),dot=$('dot'),frame=$('invitation'),placeholder=$('placeholder'),
 heading=$('heading'),desc=$('description'),spinner=$('spin');
const qs=new URLSearchParams(location.search);
const project=qs.get('sb')||'',key=qs.get('pk')||'',owner=qs.get('owner')||'',
 room=decodeURIComponent((location.hash||'').slice(1));
let sb=null,channel=null,timer=0,ended=false,lastVersion=-1,loading=false,queued=null,failures=0,first=false,frameReady=false,baseline=null;
function state(message,cls=''){s.textContent=message;dot.className='dot '+cls;}
function alertScreen(title,message){
 placeholder.style.display='flex';spinner.style.display='none';heading.textContent=title;desc.textContent=message;
}
function valid(){
 try{
  let u=new URL(project);
  return u.protocol==='https:'&&/^[a-z0-9-]+\.supabase\.co$/i.test(u.hostname)&&u.pathname==='/'&&
   /^(sb_publishable_.{20,}|eyJ.{55,})$/.test(key)&&/^[a-f0-9-]{36}$/.test(owner)&&
   /^aura-live-[a-f0-9]{40}$/.test(room);
 }catch(_){return false;}
}
function expectedPrefix(){
 return new URL('/storage/v1/object/public/aura-live/'+owner+'/'+room+'/previews/',project).toString();
}
function trustedPreview(url){
 try{
  const item=new URL(url);
  // Sólo aceptar la vista activa de la sesión, con ?v=num para evadir caché.
  return item.protocol==='https:'&&item.pathname===new URL(expectedPrefix()).pathname+'current.html'&&
    item.origin===new URL(project).origin&&/^\?v=\d+$/.test(item.search)&&item.hash.length===0;
 }catch(_){return false;}
}
function latestUrl(){
 return new URL('/storage/v1/object/public/aura-live/'+owner+'/'+room+'/latest.json',project).toString();
}
/* Audio en Live View: sólo obtenerlo cuando el cliente reproduce la música.
   La invitación final publicada no pasa por este visor. */
function lazyAudio(html){
 return html.replace(/<audio\b[^>]*>/gi,tag=>{
  if(/\bpreload\s*=/i.test(tag))
   return tag.replace(/\bpreload\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,'preload="none"');
  return tag.replace(/>$/,' preload="none">');
 });
}
function afterFrameLoad(position){
 frameReady=true;
 try{frame.contentWindow.scrollTo(0,position);}catch(_){}
 if(queued&&queued.version>lastVersion){
  const next=queued;queued=null;openPreview(next);
 }
}
function fullFrame(normalized,version){
 // DOMParser NO ejecuta los scripts de la invitación. La primera carga sí los inicia.
 baseline=window.AuraLiveDelta?.parse(normalized)||null;
 let position=0;
 try{if(first)position=frame.contentWindow.scrollY||0;}catch(_){}
 frameReady=false;
 frame.onload=()=>afterFrameLoad(position);
 frame.srcdoc=normalized;
 frame.classList.add('ready');placeholder.style.display='none';
 first=true;lastVersion=version;failures=0;
}
/* Actualizar reordenamientos manteniendo las mismas fotos y sus controladores. */
function tryReconcile(next){
 if(!frameReady||!baseline||!window.AuraLiveDelta?.reconcile)return false;
 try{
  const live=frame.contentDocument;
  if(!live||!window.AuraLiveDelta.reconcile(live,baseline,next))return false;
  baseline=next;
  return true;
 }catch(error){
  console.warn('Live View: el reacomodo necesita reconstrucción segura:',error);
  return false;
 }
}
function tryChanges(ops){
 if(!frameReady||!baseline||!window.AuraLiveDelta)return false;
 try{
  const live=frame.contentDocument;
  // Validar todo antes de modificar un solo elemento; si falta algo,
  // recargar el HTML de respaldo para no dejar la invitación a medias.
  return !!live&&window.AuraLiveDelta.applyBoth(live,baseline,ops);
 }catch(error){
  console.warn('Live View: el cambio incremental requiere actualización de respaldo:',error);
  return false;
 }
}
async function openPreview(pointer){
 if(ended||!pointer)return;
 if(pointer.ended){end();return;}
 if(!Number.isInteger(pointer.version)||pointer.version<=lastVersion||!trustedPreview(pointer.url))return;
 if(loading||first&&!frameReady){
  if(!queued||pointer.version>queued.version)queued=pointer;
  return;
 }
 loading=true;
 const version=pointer.version;
 state('Recibiendo cambios del diseñador…');
 try{
  const patch=pointer.patch;
  if(first&&frameReady&&patch&&patch.baseVersion===lastVersion&&
     Array.isArray(patch.ops)&&JSON.stringify(patch).length<=20000&&
     tryChanges(patch.ops)){
   lastVersion=version;failures=0;
   state('En vivo · actualizado','live');
   return;
  }
  // Respaldo: obtener sólo el HTML. Si la estructura sigue igual,
  // reconciliar nodos en el iframe existente, sin recrear audio, fotos ni JS.
  const response=await fetch(pointer.url,{cache:'no-store'});
  if(!response.ok)throw Error('No se pudo recuperar la invitación (HTTP '+response.status+').');
  const html=await response.text();
  if(ended||version<=lastVersion)return;
  // Fotografía ya recibida: convertirla en un blob estable del navegador.
  // Incluso si un cambio estructural obliga a regenerar el iframe,
  // esa foto se reutiliza de memoria sin pedirla de nuevo a Supabase.
  const normalized=window.AuraLiveMedia?
   await window.AuraLiveMedia.rewrite(lazyAudio(html)):lazyAudio(html);
  if(ended||version<=lastVersion)return;
  if(first&&frameReady&&baseline&&window.AuraLiveDelta){
   const next=window.AuraLiveDelta.parse(normalized);
   const changes=window.AuraLiveDelta.diff(baseline,next);
   if(changes!==null&&tryChanges(changes)){
    lastVersion=version;failures=0;
    state('En vivo · actualizado','live');
    return;
   }
   // La estructura pudo cambiar sin cambiar las fotos: mover sus nodos.
   if(tryReconcile(next)){
    lastVersion=version;failures=0;
    state('En vivo · actualizado','live');
    return;
   }
  }
  // Respaldo seguro: las imágenes siguen apuntando a los mismos blobs
  // locales aunque el HTML tenga que reconstruirse.
  fullFrame(normalized,version);
  state('En vivo · actualizado','live');
 }catch(error){
  failures++;
  state('Reconectando…','offline');
  if(!first&&failures>=3)alertScreen('No se pudo cargar Live View.',error.message);
 }finally{
  loading=false;
  if(queued&&queued.version>lastVersion&&frameReady){
   const next=queued;queued=null;openPreview(next);
  }else if(queued&&queued.version<=lastVersion)queued=null;
 }
}
async function poll(){
 if(ended)return;
 try{
  const response=await fetch(latestUrl()+'?cacheNonce='+Date.now(),{cache:'no-store'});
  if(response.status===404){state('Esperando primera actualización…');return;}
  if(!response.ok)throw Error('HTTP '+response.status);
  const pointer=await response.json();
  openPreview(pointer);
 }catch(error){
  failures++;
  if(failures>2)state('Conexión inestable · reintentando…','offline');
 }
}
function end(){
 ended=true;clearInterval(timer);
 window.AuraLiveMedia?.clear();
 if(channel&&sb)sb.removeChannel(channel).catch(()=>{});
 state('Sesión finalizada','offline');
 frame.classList.remove('ready');
 frame.style.display='none';
 alertScreen('Sesión finalizada.','La vista temporal ha terminado. Solicita un enlace nuevo al diseñador.');
}
if(!valid()){
 state('Enlace incompleto','offline');
 alertScreen('Enlace de Live View incorrecto.','Pide al diseñador un nuevo enlace generado desde Aura Digital.');
 return;
}
if(!window.supabase?.createClient){
 state('No se cargó Supabase','offline');
 alertScreen('No se pudo abrir Live View.','Revisa tu conexión y actualiza el navegador.');
 return;
}
try{
 // Sólo acepta las fotografías públicas bajo el propietario y sesión de
 // este enlace; nunca conserva otros archivos de Supabase.
 window.AuraLiveMedia?.configure(project,owner,room);
 sb=window.supabase.createClient(project,key,{
  auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}
 });
 channel=sb.channel('aura:'+room,{config:{private:false,broadcast:{self:false}}});
 channel.on('broadcast',{event:'update'},({payload})=>{
  openPreview(payload);
 }).subscribe(st=>{
  if(st==='SUBSCRIBED'){
   state(first?'En vivo · conectado':'Conectado · esperando invitación…',first?'live':'');
   poll();
  }
 });
 timer=setInterval(poll,3000);
 poll();
}catch(error){
 state('Error de conexión','offline');
 alertScreen('No se pudo conectar Supabase.',error.message);
}
window.addEventListener('pagehide',()=>{
 window.AuraLiveMedia?.clear();
 clearInterval(timer);
 if(channel&&sb)sb.removeChannel(channel).catch(()=>{});
});
})();