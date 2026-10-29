/* Lúmina Tablet: capa táctil y PWA de la V4. No modifica el motor Aura. */
(function(){
"use strict";
const VERSION="20261028-tablet-v1";
const STORAGE_KEY="lumina-tablet-draft-v1";
const isTablet=()=>window.matchMedia("(pointer: coarse)").matches||window.matchMedia("(display-mode: standalone)").matches||/Android/i.test(navigator.userAgent);
let installPrompt=null;
window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();installPrompt=event;window.dispatchEvent(new Event("lumina-tablet-install-ready"))});
function setup(){
 if(!document.body.classList.contains("lu4"))return;
 if(!isTablet())return;
 document.body.classList.add("lu-tablet");
 document.body.dataset.luTabletView="edit";
 const top=document.querySelector(".topbar"),pane=document.querySelector(".editor-pane"),preview=document.querySelector(".preview-pane"),app=document.querySelector(".lu4-app"),form=document.getElementById("config-form");
 if(!top||!pane||!preview||!app||!form)return;
 const bar=document.createElement("div");bar.className="lu-tablet-bar";
 bar.setAttribute("role","toolbar");bar.setAttribute("aria-label","Herramientas de tablet");

 // Reproduce exactamente la geometría del teléfono de Aura Pro.
 // El WebView/iframe mantiene 390x844; únicamente reducimos visualmente su marco completo.
 const phone=preview.querySelector(".device-shell");
 if(phone&&!preview.querySelector(".lu-preview-fit-holder")){
  const holder=document.createElement("div");
  holder.className="lu-preview-fit-holder";
  phone.parentNode.insertBefore(holder,phone);
  holder.appendChild(phone);
  function fitPhone(){
   // No fijar un tamaño mínimo que desborde pantallas bajas (o Chrome con barras visibles).
   // Se mantiene intacto el iframe nativo de 390 x 844; escala uniforme de su marco.
   const style=getComputedStyle(preview);
   const padX=(parseFloat(style.paddingLeft)||0)+(parseFloat(style.paddingRight)||0);
   const padY=(parseFloat(style.paddingTop)||0)+(parseFloat(style.paddingBottom)||0);
   const usableWidth=Math.max(1,preview.clientWidth-padX-12);
   const split=window.matchMedia("(min-width:860px) and (orientation:landscape)").matches;
   const heading=preview.querySelector(".preview-head");
   const headingStyle=heading?getComputedStyle(heading):null;
   const headingHeight=heading?heading.getBoundingClientRect().height+(parseFloat(headingStyle.marginBottom)||0):0;
   const usableHeight=split?Math.max(1,preview.clientHeight-padY-headingHeight-10):864;
   const scale=Math.max(.1,Math.min(1,usableWidth/410,split?usableHeight/864:1));
   preview.style.setProperty("--lu-preview-scale",String(scale));
   preview.style.setProperty("--lu-preview-width",(410*scale)+"px");
   preview.style.setProperty("--lu-preview-height",(864*scale)+"px");
  }
  fitPhone();
  if(typeof ResizeObserver==="function")new ResizeObserver(fitPhone).observe(preview);
  else window.addEventListener("resize",fitPhone,{passive:true});
  window.addEventListener("orientationchange",()=>requestAnimationFrame(fitPhone));
 }

 const brand=document.createElement("div");brand.className="lu-tablet-brand";
 const dot=document.createElement("span");dot.className="lu-tablet-dot";
 const brandText=document.createElement("span");brandText.textContent="Editor para tablet";
 brand.append(dot,brandText);
 const right=document.createElement("div");right.className="lu-tablet-right";
 const toggle=document.createElement("div");toggle.className="lu-tablet-view";
 toggle.setAttribute("role","group");toggle.setAttribute("aria-label","Cambiar vista");
 const editButton=document.createElement("button");editButton.type="button";editButton.textContent="Editar";editButton.setAttribute("aria-pressed","true");
 const previewButton=document.createElement("button");previewButton.type="button";previewButton.textContent="Vista previa";previewButton.setAttribute("aria-pressed","false");
 toggle.append(editButton,previewButton);
 const install=document.createElement("button");install.className="lu-tablet-install";install.type="button";install.textContent="Instalar app";
 const standalone=()=>window.matchMedia("(display-mode: standalone)").matches||!!navigator.standalone;
 install.hidden=standalone();
 right.append(toggle,install);bar.append(brand,right);
 top.insertAdjacentElement("afterend",bar);
 const alertBox=document.createElement("div");alertBox.className="lu-tablet-message";alertBox.hidden=true;alertBox.setAttribute("role","status");pane.insertBefore(alertBox,app);
 const resume=document.createElement("div");resume.className="lu-tablet-resume";resume.hidden=true;
 const message=document.createElement("div");message.className="lu-tablet-resume-copy";
 const accept=document.createElement("button");accept.type="button";accept.className="lu-tablet-resume-yes";accept.textContent="Recuperar mi trabajo";
 const reject=document.createElement("button");reject.type="button";reject.textContent="Empezar nuevo";
 resume.append(message,accept,reject);pane.insertBefore(resume,app);
 function notice(text){alertBox.textContent=text;alertBox.hidden=false}
 function portrait(){return window.matchMedia("(max-width: 899px), (orientation: portrait)").matches}
 function view(next,scroll=true){
  const mode=next==="preview"?"preview":"edit";
  document.body.dataset.luTabletView=mode;
  editButton.setAttribute("aria-pressed",String(mode==="edit"));
  previewButton.setAttribute("aria-pressed",String(mode==="preview"));
  if(scroll){
   const destination=mode==="preview"?preview:pane;
   destination.scrollIntoView({behavior:"smooth",block:"start"});
  }
 }
 editButton.addEventListener("click",()=>view("edit"));
 previewButton.addEventListener("click",()=>{
  // La vista original conserva su motor y los controles para tocar textos.
  view("preview");
 });
 function onSize(){
  // Mantener un único modo activo también en horizontal:
  // nunca comprimir el iframe para mostrar editor y teléfono juntos.
  const previewMode=document.body.dataset.luTabletView==="preview";
  editButton.setAttribute("aria-pressed",String(!previewMode));
  previewButton.setAttribute("aria-pressed",String(previewMode));
 }
 window.addEventListener("resize",onSize,{passive:true});onSize();
 // Al tocar nombres dentro de la vista previa, devolver la pantalla al editor.
 const originalFocus=window.focusEditorField52;
 if(typeof originalFocus==="function"){
  window.focusEditorField52=function(id){
   originalFocus(id);
   if(portrait())view("edit",false);
  };
 }
 const selection=document.getElementById("lu4-text-detail");
 if(selection&&typeof MutationObserver==="function"){
  new MutationObserver(()=>{
   if(portrait()&&document.body.dataset.luTabletView==="preview")view("edit",false);
  }).observe(selection,{childList:true});
 }
 function installInfo(){
  if(standalone()){install.hidden=true;return}
  install.hidden=false;install.textContent=installPrompt?"Instalar app":"Añadir a inicio";
 }
 window.addEventListener("lumina-tablet-install-ready",installInfo);installInfo();
 install.addEventListener("click",async()=>{
  if(installPrompt){
   const prompt=installPrompt;installPrompt=null;
   try{await prompt.prompt();const result=await prompt.userChoice;if(result?.outcome==="accepted")notice("Lúmina se está instalando. Busca su ícono en la pantalla de inicio.");else notice("Puedes instalar Lúmina más adelante desde el menú de Chrome.")}catch(_){notice("En Chrome, toca ⋮ y selecciona «Instalar aplicación» o «Añadir a pantalla de inicio».")}
   installInfo();
  }else notice("Para poner Lúmina en esta tablet: abre el menú ⋮ de Chrome y elige «Instalar aplicación» o «Añadir a pantalla de inicio».");
  if(portrait())view("edit",false);
 });
 window.addEventListener("appinstalled",()=>{installPrompt=null;install.hidden=true;notice("Lúmina ya está instalada en tu tablet.")});
 // Guardado local de ajustes, no de archivos. El navegador conserva el borrador en esta tablet.
 let pending=null;
 try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const data=JSON.parse(raw);if(data&&data.version===1&&data.config&&Date.now()-data.savedAt<90*24*60*60*1000)pending=data}}catch(_){}
 let ready=!pending,restoring=false,timer=null,lastNotice=0;
 function saveDraft(){
  if(!ready||restoring)return;
  if(typeof configObject!=="function"||typeof getFormParams!=="function")return;
  try{
   const config=configObject(getFormParams());
   const data={version:1,savedAt:Date.now(),config};
   const content=JSON.stringify(data);
   if(content.length>1800000){if(Date.now()-lastNotice>30000){notice("Este proyecto es demasiado grande para guardarse automáticamente. Guarda un archivo JSON desde Entrega.");lastNotice=Date.now()}return}
   localStorage.setItem(STORAGE_KEY,content);
   const status=bar.querySelector(".lu-tablet-save-note");
   if(status)status.textContent="Textos y ajustes guardados";
  }catch(_){if(Date.now()-lastNotice>30000){notice("No se pudo guardar el borrador en esta tablet. Usa «Guardar datos JSON» en Entrega.");lastNotice=Date.now()}}
 }
 function laterSave(e){
  if(!ready||restoring||e.target?.id?.startsWith("github"))return;
  if(e.target?.type==="file"||e.target?.id==="localConfig"||e.target?.id==="previewEditMode")return;
  clearTimeout(timer);timer=setTimeout(saveDraft,1100);
 }
 form.addEventListener("input",laterSave,true);form.addEventListener("change",laterSave,true);
 const saveNote=document.createElement("div");saveNote.className="lu-tablet-save-note";
 saveNote.textContent="Se guardan textos y ajustes";
 if(window.innerWidth>=1100)bar.insertBefore(saveNote,right);
 const explaining=document.createElement("p");explaining.className="lu4-note";
 explaining.textContent="En esta tablet se guardan automáticamente textos y ajustes. Las fotografías y la música NO se guardan: tendrás que seleccionarlas otra vez al abrir un borrador.";
 const delivery=document.getElementById("lu4-stage-2");
 const deliveryCard=delivery?.querySelector(".lu4-card");
 if(deliveryCard)deliveryCard.appendChild(explaining);
 function hideResume(){resume.hidden=true;pending=null}
 if(pending){
  const date=new Date(pending.savedAt).toLocaleString("es-MX",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"});
  message.textContent="Hay un borrador de esta tablet ("+date+"). Puedes recuperar sus textos y ajustes. Las fotos y la música deberán volver a seleccionarse.";
  resume.hidden=false;
 }else{resume.hidden=true}
 accept.addEventListener("click",()=>{
  if(!pending)return;
  restoring=true;
  try{
   if(typeof applyConfig!=="function")throw Error("No se pudo abrir el editor original.");
   applyConfig(pending.config);
   // Reutilizar el mismo motor que carga los proyectos JSON.
   form.dispatchEvent(new Event("change",{bubbles:true}));
   hideResume();ready=true;notice("Borrador recuperado. Vuelve a seleccionar las fotografías y la canción.");view("edit",false);
  }catch(error){notice("No pude recuperar el borrador: "+(error.message||"error"))}
  finally{restoring=false}
 });
 reject.addEventListener("click",()=>{try{localStorage.removeItem(STORAGE_KEY)}catch(_){}hideResume();ready=true;notice("Proyecto nuevo. Los textos y ajustes se guardarán mientras trabajas.")});
 // Controlar las pérdidas accidentales. Aviso solo cuando hay fotografías temporales.
 window.addEventListener("beforeunload",event=>{
  const files=Array.from(form.querySelectorAll("input[type=file]")).some(x=>x.files&&x.files.length);
  if(!files)return;
  event.preventDefault();event.returnValue="";
 });
 // El worker no altera los documentos originales y no cachea medios ni datos privados.
 if("serviceWorker" in navigator&&location.protocol==="https:"){
  const base=document.baseURI;
  const url=new URL("preview/lumina-tablet-sw.js",base);
  const scope=new URL("preview/",base);
  navigator.serviceWorker.register(url.href,{scope:scope.href}).catch(()=>{});
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
})();
