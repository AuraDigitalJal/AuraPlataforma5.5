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
let sb=null,channel=null,timer=0,ended=false,lastVersion=-1,loading=false,queued=null,failures=0,first=false;
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
async function openPreview(pointer){
 if(ended||!pointer)return;
 if(pointer.ended){end();return;}
 if(!Number.isInteger(pointer.version)||pointer.version<=lastVersion||!trustedPreview(pointer.url))return;
 if(loading){if(!queued||pointer.version>queued.version)queued=pointer;return;}
 loading=true;
 const revision=pointer.version;
 state('Recibiendo cambios del diseñador…');
 try{
  const response=await fetch(pointer.url,{cache:'no-store'});
  if(!response.ok)throw Error('No se pudo recuperar la invitación (HTTP '+response.status+').');
  const html=await response.text();
  if(ended||revision<=lastVersion)return;
  let position=0;try{if(first)position=frame.contentWindow.scrollY||0;}catch(_){}
  frame.onload=function(){try{frame.contentWindow.scrollTo(0,position);}catch(_){}};
  frame.srcdoc=html;frame.classList.add('ready');placeholder.style.display='none';
  first=true;lastVersion=revision;failures=0;
  state('En vivo · actualizado','live');
 }catch(error){
  failures++;
  state('Reconectando…','offline');
  if(!first&&failures>=3)alertScreen('No se pudo cargar Live View.',error.message);
 }finally{
  loading=false;
  if(queued&&queued.version>lastVersion){const next=queued;queued=null;openPreview(next);}
  else queued=null;
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
 if(channel&&sb)sb.removeChannel(channel).catch(()=>{});
 state('Sesión finalizada','offline');
 if(!first)alertScreen('Sesión terminada.','Pide al diseñador un nuevo enlace.');
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
 clearInterval(timer);
 if(channel&&sb)sb.removeChannel(channel).catch(()=>{});
});
})();