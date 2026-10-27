/* Aura Digital · Live View incremental · SOLO PRUEBAS
   Compara dos documentos estáticos y cambia únicamente texto/atributos/estilos.
   Sin librerías externas. Si cambia la estructura o un script, devuelve null
   para que el visor conserve la opción de actualización completa. */
(function(global){
'use strict';
const MAX_OPS=3000;
function parse(html){return new DOMParser().parseFromString(html,'text/html');}
function diff(before,after){
 if(!before?.documentElement||!after?.documentElement)return null;
 const changes=[];
 function walk(a,b,path){
  if(a.nodeType!==b.nodeType||a.nodeName!==b.nodeName)return false;
  if(a.nodeType===1){
   if(a.tagName==='SCRIPT'){
    // Cambiar scripts requiere arrancar de nuevo sus controladores.
    return a.outerHTML===b.outerHTML;
   }
   const keys=new Set([...Array.from(a.attributes,attr=>attr.name),...Array.from(b.attributes,attr=>attr.name)]);
   for(const name of keys){
    const oldValue=a.getAttribute(name),newValue=b.getAttribute(name);
    if(oldValue!==newValue)changes.push(['a',path,name,oldValue,newValue,a.tagName]);
    if(changes.length>MAX_OPS)return false;
   }
  }else if(a.nodeType===3||a.nodeType===8){
   if(a.nodeValue!==b.nodeValue)changes.push(['t',path,null,a.nodeValue,b.nodeValue,a.nodeName]);
   if(changes.length>MAX_OPS)return false;
  }
  if(a.childNodes.length!==b.childNodes.length)return false;
  for(let i=0;i<a.childNodes.length;i++){
   if(!walk(a.childNodes[i],b.childNodes[i],path.concat(i)))return false;
  }
  return true;
 }
 return walk(before.documentElement,after.documentElement,[])?changes:null;
}
function target(doc,path){
 if(!doc?.documentElement||!Array.isArray(path)||path.length>40)return null;
 let node=doc.documentElement;
 for(const idx of path){
  if(!Number.isInteger(idx)||idx<0||idx>=node.childNodes.length)return null;
  node=node.childNodes[idx];
 }
 return node;
}
function prepare(doc,changes){
 if(!doc?.documentElement||!Array.isArray(changes)||changes.length>MAX_OPS)return null;
 const pending=[];
 for(const change of changes){
  if(!Array.isArray(change)||change.length!==6)return null;
  const [kind,path,name,oldValue,newValue,nodeName]=change;
  const node=target(doc,path);
  if(!node||node.nodeName!==nodeName)return null;
  if(kind==='a'){
   if(node.nodeType!==1||typeof name!=='string'||name.length>120||
      !(oldValue===null||typeof oldValue==='string')||
      !(newValue===null||typeof newValue==='string')||
      node.getAttribute(name)!==oldValue)return null;
  }else if(kind==='t'){
   if((node.nodeType!==3&&node.nodeType!==8)||name!==null||
      typeof oldValue!=='string'||typeof newValue!=='string'||
      node.nodeValue!==oldValue)return null;
  }else return null;
  pending.push({node,kind,name,newValue});
 }
 return pending;
}
function commit(pending){
 for(const change of pending){
  if(change.kind==='t')change.node.nodeValue=change.newValue;
  else if(change.newValue===null)change.node.removeAttribute(change.name);
  else change.node.setAttribute(change.name,change.newValue);
 }
}
function applyBoth(live,baseline,changes){
 const livePending=prepare(live,changes),basePending=prepare(baseline,changes);
 if(!livePending||!basePending)return false;
 commit(livePending);commit(basePending);
 return true;
}
/* V18: cuando se reordenan secciones/fotos, conservar los nodos existentes.
   Un img con el mismo src se MUEVE; nunca se destruye para recrearlo.
   Los scripts deben seguir siendo idénticos para no perder controladores. */
function compatibleScripts(before,after){
 const a=[...before.querySelectorAll('script')],b=[...after.querySelectorAll('script')];
 return a.length===b.length&&a.every((script,i)=>script.outerHTML===b[i].outerHTML);
}
function nodeKey(node){
 if(node?.nodeType!==1)return '';
 const tag=node.tagName;
 const id=node.getAttribute('id');
 if(id&&/^[\w:-]{1,120}$/.test(id))return 'id:'+id;
 if((tag==='IMG'||tag==='AUDIO'||tag==='VIDEO'||tag==='SOURCE')&&node.getAttribute('src'))
  return 'media:'+tag+':'+node.getAttribute('src');
 if(tag==='FIGURE'||(node.getAttribute('class')||'').match(/gallery-item|gallery-photo|photo-card|image-card|galeria-item|gallery-card|foto-item/)){
  const images=node.querySelectorAll('img[src]');
  if(images.length===1)return 'card:'+tag+':'+images[0].getAttribute('src');
 }
 return '';
}
function reconcile(live,baseline,next){
 if(!live?.documentElement||!baseline?.documentElement||!next?.documentElement||
    !compatibleScripts(baseline,next))return false;
 const roots=[baseline.documentElement,next.documentElement];
 if(roots.some(root=>root.querySelectorAll('*').length>7500))return false;
 const available=new Map(),used=new WeakSet(),doc=live;
 const oldNodes=[live.documentElement,...live.documentElement.querySelectorAll('*')];
 for(const node of oldNodes){
  const key=nodeKey(node);
  if(key){if(!available.has(key))available.set(key,[]);available.get(key).push(node);}
 }
 const targetCounts=new Map();
 for(const node of [next.documentElement,...next.documentElement.querySelectorAll('*')]){
  const key=nodeKey(node);
  if(key)targetCounts.set(key,(targetCounts.get(key)||0)+1);
 }
 // Reusar por clave sólo si la identidad es inequívoca.
 function matchGlobal(wanted,parent){
  const key=nodeKey(wanted),options=available.get(key)||[];
  if(!key||options.length!==1||targetCounts.get(key)!==1)return null;
  const found=options[0];
  return !used.has(found)&&found!==parent&&!found.contains(parent)?found:null;
 }
 function matches(a,b){return a?.nodeType===b?.nodeType&&a?.nodeName===b?.nodeName;}
 function reconcileChildren(parent,target){
  let anchor=parent.firstChild;
  for(const wanted of [...target.childNodes]){
   let current=matchGlobal(wanted,parent);
   if(!current){
    // No reciclar el nodo de una foto distinta ni el de una sección
    // con ID distinto: esos pueden aparecer más adelante en otro lugar.
    const acceptable=n=>!used.has(n)&&matches(n,wanted)&&
      (!nodeKey(n)||!nodeKey(wanted)||nodeKey(n)===nodeKey(wanted))&&
      !(nodeKey(n)&&targetCounts.get(nodeKey(n))===1&&nodeKey(n)!==nodeKey(wanted));
    if(acceptable(anchor))current=anchor;
    else for(let scan=anchor;scan;scan=scan.nextSibling){
     if(acceptable(scan)){current=scan;break;}
    }
   }
   if(!current){
    if(wanted.nodeType===1&&wanted.tagName==='SCRIPT')return false;
    current=doc.importNode(wanted,false);
   }
   if(current!==anchor)parent.insertBefore(current,anchor);
   used.add(current);
   if(!morph(current,wanted))return false;
   anchor=current.nextSibling;
  }
  // Lo que ya no pertenece al diseño se elimina; los recursos guardados
  // en el mapa de caché permanecen disponibles para futuras correcciones.
  while(anchor){const nextSibling=anchor.nextSibling;parent.removeChild(anchor);anchor=nextSibling;}
  return true;
 }
 function morph(current,wanted){
  if(!matches(current,wanted))return false;
  if(current.nodeType===3||current.nodeType===8){
   if(current.nodeValue!==wanted.nodeValue)current.nodeValue=wanted.nodeValue;
   return true;
  }
  if(current.nodeType!==1)return current.nodeValue===wanted.nodeValue;
  if(current.tagName==='SCRIPT')return current.outerHTML===wanted.outerHTML;
  const desired=new Map([...wanted.attributes].map(attr=>[attr.name,attr.value]));
  for(const attr of [...current.attributes]){
   if(!desired.has(attr.name))current.removeAttribute(attr.name);
  }
  for(const [name,value] of desired){
   if(current.getAttribute(name)!==value)current.setAttribute(name,value);
  }
  // Conservar el audio reproducido sin reinicializar su nodo si no cambió.
  return reconcileChildren(current,wanted);
 }
 try{
  // HEAD primero: conserva las reglas CSS de la invitación actual.
  if(!morph(live.documentElement,next.documentElement))return false;
  return true;
 }catch(error){
  console.warn('Live View: no se pudo reorganizar el DOM sin recarga:',error);
  return false;
 }
}

global.AuraLiveDelta=Object.freeze({parse,diff,prepare,commit,applyBoth,reconcile});
})(window);
