/* Aura Digital · Live View · visor WebRTC P2P v8
   El servicio de señalización solo transmite ofertas WebRTC.
   Las imágenes, música y HTML cruzan directamente el canal cifrado. */
(function(){
'use strict';
const $=id=>document.getElementById(id),SIGNAL='https://ntfy.sh/';
const ICE={iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']}]};
const room=decodeURIComponent((location.hash||'').slice(1));
const valid=/^aura-live-[a-f0-9]{40}$/.test(room);
const status=$('status'),dot=$('dot'),frame=$('invitation'),placeholder=$('placeholder'),spinner=$('spin'),heading=$('heading'),description=$('description');
const id=hex(12);
let source=null,pc=null,dc=null,batch='',helloTimer=0,ended=false,received=false,pending=null,queue=Promise.resolve();
const assetUrls=new Map(),offerChunks=new Map();
function hex(n){const a=new Uint8Array(n);crypto.getRandomValues(a);return Array.from(a,v=>v.toString(16).padStart(2,'0')).join('');}
function say(text,state){status.textContent=text;dot.className='dot '+(state||'');}
function showIssue(title,body){spinner.style.display='none';placeholder.style.display='flex';heading.textContent=title;description.textContent=body;}
async function signal(action,extra={}){
 if(ended)return;
 const packet={type:'aura-peer',room,from:'viewer',to:'studio',viewer:id,action,...extra};
 const r=await fetch(SIGNAL+room,{method:'POST',body:JSON.stringify(packet),cache:'no-store'});
 if(!r.ok)throw Error('Servicio de conexión HTTP '+r.status);
}
async function sendDescription(d){
 const msg=JSON.stringify({type:d.type,sdp:d.sdp});
 const length=1250,parts=Math.ceil(msg.length/length);
 for(let i=0;i<parts;i++){
   await signal('sdp',{batch,kind:'answer',i,n:parts,chunk:msg.slice(i*length,(i+1)*length)});
 }
}
async function gather(connection){
 if(connection.iceGatheringState==='complete')return;
 await new Promise(resolve=>{
   let done=false;
   function finish(){if(done)return;done=true;clearTimeout(t);connection.removeEventListener('icegatheringstatechange',listener);resolve();}
   function listener(){if(connection.iceGatheringState==='complete')finish();}
   const t=setTimeout(finish,12000);
   connection.addEventListener('icegatheringstatechange',listener);listener();
 });
}
function acceptSignal(packet){
 if(!packet||packet.event!=='message'||ended)return;
 let m;try{m=JSON.parse(packet.message);}catch(_){return;}
 if(m.type!=='aura-peer'||m.room!==room||m.from!=='studio')return;
 if(m.action==='stop'){finishSession();return;}
 if(m.to!==id||m.action!=='sdp'||m.kind!=='offer')return;
 if(typeof m.batch!=='string'||!Number.isInteger(m.n)||m.n<1||m.n>20||!Number.isInteger(m.i)||m.i<0||m.i>=m.n||typeof m.chunk!=='string')return;
 let result=offerChunks.get(m.batch);
 if(!result||result.n!==m.n){result={n:m.n,chunks:new Array(m.n).fill(null)};offerChunks.set(m.batch,result);}
 result.chunks[m.i]=m.chunk;
 if(result.chunks.every(s=>typeof s==='string')){
   offerChunks.delete(m.batch);
   let desc;try{desc=JSON.parse(result.chunks.join(''));}catch(_){return;}
   connect(desc,m.batch);
 }
}
async function connect(offer,key){
 if(ended||typeof RTCPeerConnection!=='function'){showIssue('Conexión no compatible.','Abre este enlace con Safari o Chrome actualizado.');return;}
 batch=key;
 try{dc?.close();pc?.close();}catch(_){}
 assetUrls.forEach(url=>{try{URL.revokeObjectURL(url);}catch(_){}});
 assetUrls.clear();pending=null;queue=Promise.resolve();
 pc=new RTCPeerConnection(ICE);
 const connection=pc;
 pc.ondatachannel=e=>{
   if(ended||connection!==pc)return;
   dc=e.channel;dc.binaryType='arraybuffer';
   dc.onopen=()=>{clearInterval(helloTimer);say('En vivo · conectado','live');};
   dc.onmessage=e=>{
     queue=queue.then(()=>acceptData(e.data)).catch(error=>{
       console.warn('Aura Live View:',error);say('Error al recibir datos','offline');
       if(!received)showIssue('Error de transmisión.',error.message);
     });
   };
   dc.onclose=()=>{
     if(ended)return;
     say('Reconectando…','offline');
     clearInterval(helloTimer);helloTimer=setInterval(hello,10000);hello();
   };
 };
 pc.onconnectionstatechange=()=>{
   if(connection===pc&&(pc.connectionState==='failed'||pc.connectionState==='disconnected')){
     say('Conexión directa interrumpida','offline');
     if(!helloTimer){helloTimer=setInterval(hello,10000);hello();}
   }
 };
 try{
   say('Estableciendo conexión directa…','');
   await pc.setRemoteDescription(offer);
   await pc.setLocalDescription(await pc.createAnswer());
   await gather(pc);
   if(ended||connection!==pc)return;
   await sendDescription(pc.localDescription);
 }catch(error){
   say('No se pudo conectar','offline');
   if(!received)showIssue('No se pudo establecer Live View.','Esta red podría bloquear conexiones directas. Prueba conectarte con otra red o Wi-Fi. '+error.message);
 }
}
async function acceptData(data){
 if(typeof data==='string'){
   let m;try{m=JSON.parse(data);}catch(_){return;}
   if(m.op==='begin'){
     if(pending)throw Error('La transmisión anterior no terminó.');
     if(!Number.isFinite(m.size)||m.size<0||m.size>180*1024*1024||!['file','preview'].includes(m.kind))throw Error('Tamaño de archivo no admitido.');
     pending={kind:m.kind,id:m.id,mime:m.mime,size:m.size,received:0,parts:[]};
     say(m.kind==='file'?'Recibiendo fotografía o música…':'Actualizando la invitación…','');
   }else if(m.op==='end'){
     if(!pending)throw Error('Fragmentos incompletos.');
     const item=pending;pending=null;
     if(item.received!==item.size)throw Error('Un archivo llegó incompleto.');
     const blob=new Blob(item.parts,{type:item.mime||'application/octet-stream'});
     if(item.kind==='file'){
       if(!assetUrls.has(item.id))assetUrls.set(item.id,URL.createObjectURL(blob));
     }else await showPreview(blob);
   }
 }else if(pending){
   const bytes=data instanceof ArrayBuffer?data:await data.arrayBuffer();
   pending.received+=bytes.byteLength;
   if(pending.received>pending.size)throw Error('Se recibió más información de la esperada.');
   pending.parts.push(bytes);
 }
}
async function showPreview(blob){
 let html=await blob.text();
 html=html.replace(/__AURA_PEER_ASSET_(f\d+)__/g,(token,id)=>assetUrls.get(id)||'');
 let scroll=0;try{if(received)scroll=frame.contentWindow.scrollY||0;}catch(_){}
 frame.onload=()=>{try{frame.contentWindow.scrollTo(0,scroll);}catch(_){}};
 frame.srcdoc=html;frame.classList.add('ready');placeholder.style.display='none';received=true;
 say('En vivo · actualizado','live');
}
function hello(){
 if(ended||(dc&&dc.readyState==='open'))return;
 signal('hello').catch(error=>{if(!received)say('Reconectando señales…','offline');});
}
function finishSession(){
 ended=true;clearInterval(helloTimer);source?.close();
 try{dc?.close();pc?.close();}catch(_){}
 say('Sesión finalizada','offline');
 if(!received)showIssue('Sesión finalizada.','Solicita un enlace nuevo al diseñador.');
}
if(!valid){showIssue('Enlace incorrecto.','Pide al diseñador un enlace actualizado de Live View.');say('Enlace incorrecto','offline');return;}
if(typeof RTCPeerConnection!=='function'||typeof EventSource!=='function'){
 showIssue('Navegador incompatible.','Abre el enlace en Safari o Chrome actualizado.');
 return;
}
source=new EventSource(SIGNAL+room+'/sse?since=now');
source.onmessage=e=>{try{acceptSignal(JSON.parse(e.data));}catch(_){}};
source.onopen=()=>{say('Buscando al diseñador…','');hello();};
source.onerror=()=>{if(!received&&!ended)say('Reconectando servicio de señales…','');};
helloTimer=setInterval(hello,14000);
window.addEventListener('pagehide',()=>{source?.close();try{pc?.close();}catch(_){}});
})();
