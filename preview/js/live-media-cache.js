/* Aura Digital · V18 · caché temporal de fotografías SOLO en Live View.
   Almacena una vez cada foto de ESTA sesión como blob del navegador.
   No modifica originales, publicación ZIP/GitHub ni Supabase Storage. */
(function(global){
'use strict';
const MAX_TOTAL=64*1024*1024,MAX_ITEMS=90,CONCURRENCY=4;
const cached=new Map(),inflight=new Map(),failed=new Map();
let total=0,closed=false;
const urlPattern=/https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/aura-live\/[0-9a-f-]{36}\/aura-live-[a-f0-9]{40}\/assets\/[a-z0-9._-]+\.(?:jpg|jpeg|png|webp|gif)/gi;
let sessionPrefix='';
function configure(project,owner,room){
 try{
  const root=new URL(project);
  if(root.protocol!=='https:'||!root.hostname.endsWith('.supabase.co'))return false;
  if(!/^[a-f0-9-]{36}$/i.test(owner)||!/^aura-live-[a-f0-9]{40}$/.test(room))return false;
  sessionPrefix=root.origin+'/storage/v1/object/public/aura-live/'+owner+'/'+room+'/assets/';
  return true;
 }catch(_){return false;}
}
function allowed(raw){
 try{
  const url=new URL(raw);
  return !!sessionPrefix&&raw.startsWith(sessionPrefix)&&url.origin===new URL(sessionPrefix).origin&&
   url.search===''&&url.hash===''&&/^\/[a-z0-9._/-]+$/i.test(url.pathname)&&
   /\.(?:jpe?g|png|webp|gif)$/i.test(url.pathname);
 }catch(_){return false;}
}
async function load(raw){
 if(closed||!allowed(raw))return '';
 if(cached.has(raw))return cached.get(raw);
 const previous=failed.get(raw);
 if(previous&&Date.now()-previous<60000)return '';
 if(inflight.has(raw))return inflight.get(raw);
 if(cached.size+inflight.size>=MAX_ITEMS||total>=MAX_TOTAL)return '';
 const work=(async()=>{
  try{
   const response=await fetch(raw,{mode:'cors',cache:'force-cache'});
   if(!response.ok)throw Error('HTTP '+response.status);
   const blob=await response.blob();
   if(!blob.size||blob.size>20*1024*1024||total+blob.size>MAX_TOTAL||
      !/^image\/(jpeg|png|webp|gif)$/.test(blob.type||''))return '';
   if(closed)return '';
   const local=URL.createObjectURL(blob);
   cached.set(raw,local);total+=blob.size;
   return local;
  }catch(error){
   failed.set(raw,Date.now());
   console.warn('Live View: no fue posible guardar una fotografía temporalmente en memoria.',error);
   return '';
  }finally{inflight.delete(raw);}
 })();
 inflight.set(raw,work);
 return work;
}
async function rewrite(html){
 if(closed||!sessionPrefix||typeof html!=='string')return html;
 const urls=[...new Set(html.match(urlPattern)||[])].filter(allowed);
 let next=0;
 const tasks=Array.from({length:Math.min(CONCURRENCY,urls.length)},async()=>{
  while(next<urls.length){const url=urls[next++];await load(url);}
 });
 await Promise.all(tasks);
 let result=html;
 for(const url of urls){
  const local=cached.get(url);
  if(local)result=result.split(url).join(local);
 }
 return result;
}
function clear(){
 closed=true;
 for(const blobUrl of cached.values())try{URL.revokeObjectURL(blobUrl);}catch(_){}
 cached.clear();inflight.clear();failed.clear();total=0;
}
global.AuraLiveMedia=Object.freeze({configure,rewrite,clear,stats:()=>({photos:cached.size,bytes:total})});
})(window);
