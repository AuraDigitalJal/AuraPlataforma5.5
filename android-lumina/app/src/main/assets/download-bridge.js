/* Lúmina Studio · puente de descarga: elige el archivo y envíalo al almacén Android por bloques. */
(function(){
  "use strict";
  if(window.__luminaAndroidDownloads)return;
  if(!window.LuminaAndroid||typeof window.LuminaAndroid.postMessage!=="function")return;
  window.__luminaAndroidDownloads=true;
  var pwaInstall=document.querySelector(".lu-tablet-install");if(pwaInstall)pwaInstall.hidden=true;
  function post(data){window.LuminaAndroid.postMessage(JSON.stringify(data))}
  function safeName(name){return String(name||"Lumina-invitacion.zip").replace(/[\\/:*?"<>|]/g,"_").slice(0,100)}
  document.addEventListener("click",function(event){
    var element=event.target && event.target.closest && event.target.closest("a[download]");
    if(!element)return;
    var url=element.href||"";
    if(!url.startsWith("blob:")&&!url.startsWith("data:"))return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    var fileName=safeName(element.getAttribute("download")||"Lumina-invitacion.zip");
    var id="lumina_"+Date.now()+"_"+Math.floor(Math.random()*1e7);
    (async function(){
      try{
        var response=await fetch(url);
        if(!response.ok)throw new Error("No se pudo abrir el archivo generado");
        var file=await response.blob();
        if(file.size===0 || file.size>450*1024*1024)throw new Error("Archivo vacío o demasiado grande");
        post({kind:"begin",id:id,name:fileName,size:file.size});
        var BLOCK=24000;
        for(var start=0;start<file.size;start+=BLOCK){
          var block=new Uint8Array(await file.slice(start,start+BLOCK).arrayBuffer());
          var chars="";
          for(var i=0;i<block.length;i++)chars+=String.fromCharCode(block[i]);
          post({kind:"chunk",id:id,base64:btoa(chars)});
          if(start!==0 && start%(BLOCK*100)===0)await new Promise(resolve=>setTimeout(resolve,0));
        }
        post({kind:"end",id:id});
      }catch(error){
        try{post({kind:"error",id:id,reason:String(error.message||error)})}catch(_){}
        alert("No se pudo guardar el archivo. Vuelve a generar la invitación.");
      }
    })();
  },true);
})();