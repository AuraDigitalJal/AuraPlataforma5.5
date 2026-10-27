/* Aura Digital · Live View P2P · experimento v8
   ntfy.sh transporta UNICAMENTE señalización WebRTC (<2 KB/mensaje).
   HTML, fotografías y música viajan directamente por el canal cifrado.
*/
(function(){
'use strict';
const SIGNAL='https://ntfy.sh/';
const ICE={iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']}]};
const VERSION='aura-live-p2p-v8';
const $=id=>document.getElementById(id);
const button=$('aura-live-toggle'),panel=$('aura-live-panel'),link=$('aura-live-link');
const copy=$('aura-live-copy'),stop=$('aura-live-stop'),status=$('aura-live-status');
if(!button||!panel||!link||!copy||!stop||!status)return;
let room='',source=null,peers=new Map(),revision=0,timer=0,mediaIds=new WeakMap(),nextId=0,latest=null;
const encode=new TextEncoder(),MAX=12000;
function message(text,problem){status.textContent=text;status.style.color=problem?'#a52c37':'';}
function newHex(bytes){const b=new Uint8Array(bytes);crypto.getRandomValues(b);return Array.from(b,n=>n.toString(16).padStart(2,'0')).join('');}
function linkTo(room){const u=new URL('live.html',window.location.href);u.searchParams.set('v',VERSION);u.hash=room;return u.toString();}
async function signal(to,action,payload={}){
 if(!room)return;
 const data={type:'aura-peer',room,from:'studio',to,action,...payload};
 const response=await fetch(SIGNAL+room,{method:'POST',body:JSON.stringify(data),cache:'no-store'});
 if(!response.ok)throw Error('Señalización HTTP '+response.status);
}
function signalMessage(packet){
 if(!room||packet.event!=='message')return;
 let m;try{m=JSON.parse(packet.message);}catch(_){return;}
 if(m.type!=='aura-peer'||m.room!==room||m.from!=='viewer'||!/^[a-f0-9]{24}$/.test(m.viewer))return;
 if(m.action==='hello'){onHello(m.viewer);return;}
 if(m.to!=='studio')return;
 const p=peers.get(m.viewer);if(!p)return;
 if(m.action==='sdp')collectSDP(p,m);
}
function collectSDP(peer,m){
 if(m.batch!==peer.batch||m.kind!=='answer'||!Number.isInteger(m.i)||!Number.isInteger(m.n)||m.n>20||m.n<1||m.i<0||m.i>=m.n||typeof m.chunk!=='string')return;
 if(!peer.chunks)peer.chunks={};
 const key='answer-'+m.batch;
 let item=peer.chunks[key];
 if(!item||item.n!==m.n)item=peer.chunks[key]={n:m.n,parts:new Array(m.n).fill(null)};
 item.parts[m.i]=m.chunk;
 if(item.parts.every(x=>typeof x==='string')){
   delete peer.chunks[key];
   try{peer.pc.setRemoteDescription(JSON.parse(item.parts.join(''))).catch(e=>message('Error de conexión: '+e.message,true));}
   catch(e){message('Error en respuesta del celular: '+e.message,true);}
 }
}
async function sendSDP(to,batch,kind,desc){
 const text=JSON.stringify({type:desc.type,sdp:desc.sdp});
 const step=1250,total=Math.ceil(text.length/step);
 for(let i=0;i<total;i++)await signal(to,'sdp',{batch,kind,i,n:total,chunk:text.slice(i*step,(i+1)*step)});
}
async function gather(pc){
 if(pc.iceGatheringState==='complete')return;
 await new Promise(resolve=>{
   let done=false;
   function finish(){if(done)return;done=true;clearTimeout(timeout);pc.removeEventListener('icegatheringstatechange',listener);resolve();}
   function listener(){if(pc.iceGatheringState==='complete')finish();}
   const timeout=setTimeout(finish,12000);
   pc.addEventListener('icegatheringstatechange',listener);
   listener();
 });
}
function onHello(id){
 let prior=peers.get(id);
 if(prior&&prior.dc.readyState==='open')return;
 if(prior&&prior.pc.connectionState!=='failed'&&prior.pc.connectionState!=='closed'&&Date.now()-prior.created<45000)return;
 if(prior)closePeer(prior);
 if(typeof RTCPeerConnection!=='function'){message('Este navegador no admite conexión directa WebRTC.',true);return;}
 const pc=new RTCPeerConnection(ICE),dc=pc.createDataChannel('aura-invitacion',{ordered:true});
 const peer={id,pc,dc,batch:newHex(6),chunks:null,created:Date.now(),sent:new Set(),busy:false,needs:true};
 peers.set(id,peer);
 dc.binaryType='arraybuffer';
 dc.bufferedAmountLowThreshold=256*1024;
 dc.onopen=()=>{message('Cliente conectado · transmitiendo directamente');sendLatest(peer);};
 dc.onclose=()=>{if(room)message('Cliente desconectado. Esperando reconexión…');};
 dc.onerror=()=>{if(room)message('Error en canal directo. Reabre el enlace del cliente.',true);};
 pc.onconnectionstatechange=()=>{
   if(pc.connectionState==='failed'){message('No se pudo establecer conexión directa en estas redes. Revisa Wi-Fi o datos móviles.',true);closePeer(peer);}
 };
 (async()=>{
  try{
    await pc.setLocalDescription(await pc.createOffer());
    await gather(pc);
    if(!room||peers.get(id)!==peer)return;
    await sendSDP(id,peer.batch,'offer',pc.localDescription);
  }catch(e){if(room)message('Falló conexión directa: '+e.message,true);closePeer(peer);}
 })();
}
function closePeer(p){if(peers.get(p.id)===p)peers.delete(p.id);try{p.dc.close();}catch(_){}try{p.pc.close();}catch(_){}}
function markChange(){
 if(!room)return;
 ++revision;
 clearTimeout(timer);
 timer=setTimeout(async()=>{
   if(!room)return;
   try{
     const sequence=revision;
     latest=makeSnapshot();
     if(sequence!==revision)return;
     for(const peer of peers.values()){peer.needs=true;if(peer.dc.readyState==='open')sendLatest(peer);}
   }catch(e){message('No se pudo preparar la invitación: '+e.message,true);}
 },550);
}
function assetId(file){
 let id=mediaIds.get(file);if(!id){id='f'+(++nextId);mediaIds.set(file,id);}
 return id;
}
function makeSnapshot(){
 const p=getFormParams(),a=previewAssets(p),files=[],seen=new Set();
 function attach(file){
   if(!file)return '';
   const id=assetId(file);
   if(!seen.has(id)){
     seen.add(id);
     files.push({id,file,mime:file.type||'application/octet-stream',size:file.size});
   }
   return '__AURA_PEER_ASSET_'+id+'__';
 }
 const fields={cover:p.portadaFile,banner:p.bannerFile,extra:p.bannerExtraFile,extra2:p.bannerExtra2File,
               bg:p.bgFile,poster:p.videoPosterFile,transferPhoto:p.transferPhotoFile,music:p.musicFile};
 Object.entries(fields).forEach(([k,file])=>{a[k]=attach(file);});
 a.gallery=(p.galleryFiles||[]).map(attach);
 if(a.sharePreview&&a.sharePreview.startsWith('blob:'))a.sharePreview='';
 return {html:buildInvitation(p,a),files,version:revision};
}
function pause(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function sendData(dc,payload){
 const blob=payload instanceof Blob?payload:new Blob([payload]);
 for(let i=0;i<blob.size;i+=MAX){
   if(dc.readyState!=='open')throw Error('Se desconectó el cliente.');
   let retries=0;
   while(dc.bufferedAmount>512*1024){
     if(dc.readyState!=='open')throw Error('Se desconectó el cliente.');
     if(++retries>500)throw Error('Tiempo de envío agotado.');
     await pause(25);
   }
   const bytes=await blob.slice(i,Math.min(i+MAX,blob.size)).arrayBuffer();
   dc.send(bytes);
 }
}
async function sendPacket(peer,kind,id,mime,blob){
 const dc=peer.dc;
 if(dc.readyState!=='open')throw Error('Canal cerrado.');
 dc.send(JSON.stringify({op:'begin',kind,id,mime,size:blob.size}));
 await sendData(dc,blob);
 dc.send(JSON.stringify({op:'end'}));
}
async function sendLatest(peer){
 if(peer.busy){peer.needs=true;return;}
 peer.busy=true;
 try{
   do{
     peer.needs=false;
     const snapshot=latest||makeSnapshot();
     for(const asset of snapshot.files){
       if(peer.sent.has(asset.id))continue;
       if(peer.dc.readyState!=='open')throw Error('Cliente desconectado.');
       message('Enviando '+(asset.mime.startsWith('audio/')?'música':'fotografía')+' en calidad original…');
       await sendPacket(peer,'file',asset.id,asset.mime,asset.file);
       peer.sent.add(asset.id);
     }
     const html=encode.encode(snapshot.html);
     await sendPacket(peer,'preview',String(snapshot.version),'text/html',new Blob([html],{type:'text/html'}));
     message('Live View conectado · '+snapshot.files.length+' archivo(s) sincronizados');
   }while(peer.needs&&peer.dc.readyState==='open');
 }catch(e){if(room)message('Error de transmisión directa: '+e.message,true);}
 finally{peer.busy=false;}
}
function start(){
 if(room){panel.hidden=false;return;}
 if(!window.RTCPeerConnection||!window.EventSource){panel.hidden=false;message('El navegador no admite WebRTC o mensajes en vivo.',true);return;}
 room='aura-live-'+newHex(20);
 peers=new Map();mediaIds=new WeakMap();nextId=0;latest=null;revision=0;
 link.value=linkTo(room);
 panel.hidden=false;
 button.setAttribute('aria-pressed','true');
 button.textContent='Live View activo';
 message('Enlace listo. Esperando a que el cliente lo abra…');
 source=new EventSource(SIGNAL+room+'/sse?since=now');
 source.onmessage=e=>{try{signalMessage(JSON.parse(e.data));}catch(_){}};
 source.onerror=()=>{if(room)message('Reconectando canal de señales…');};
 markChange();
}
function finish(){
 const old=room;
 room='';clearTimeout(timer);
 source?.close();source=null;
 for(const peer of peers.values())closePeer(peer);
 peers.clear();latest=null;link.value='';panel.hidden=true;
 button.setAttribute('aria-pressed','false');button.textContent='Compartir Live View';
 if(old)fetch(SIGNAL+old,{method:'POST',body:JSON.stringify({type:'aura-peer',room:old,from:'studio',action:'stop'})}).catch(()=>{});
}
button.addEventListener('click',start);stop.addEventListener('click',finish);
copy.addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(link.value);message('Enlace copiado. Compártelo por WhatsApp.');}
 catch(_){link.select();message('Copia manualmente el enlace seleccionado.');}
});
if(typeof updatePreview==='function'){
 const original=updatePreview;
 updatePreview=function(){const result=original.apply(this,arguments);markChange();return result;};
}
window.addEventListener('pagehide',()=>{source?.close();for(const p of peers.values())closePeer(p);});
})();
