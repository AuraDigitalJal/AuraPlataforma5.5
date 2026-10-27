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
global.AuraLiveDelta=Object.freeze({parse,diff,prepare,commit,applyBoth});
})(window);
