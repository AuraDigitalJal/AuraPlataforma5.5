
/* Lúmina V2: vista sencilla sobre el motor Aura sin copiar lógica de publicación. */
(function(){
"use strict";
var byId=function(id){return document.getElementById(id)};
var EVENTS=[["boda","Boda","♡"],["xv","XV años","✧"],["bautizo","Bautizo","❀"],["cumple","Cumpleaños","◌"],["graduacion","Graduación","◇"],["escolar","Evento escolar","✦"]];
var CATS=[
 {id:"textos",icon:"Aa",title:"Textos",subtitle:"Nombres y frases",desc:"Cambia nombres y mensajes sin buscar entre muchos ajustes.",fields:[["title","Nombres o título principal",1],["subtitle","Frase de la portada",1],["mainMessage","Mensaje al final",1],["parentsText","Nombres de los padres",1],["godparentsText","Nombres de los padrinos",1],["closingSignature","Firma de cierre",1]],sections:["sec-portada","sec-familia","sec-cierre"]},
 {id:"evento",icon:"◷",title:"Evento",subtitle:"Fecha y lugares",desc:"Agrega la fecha, los lugares y el contacto para confirmaciones.",fields:[["eventDate","Fecha y hora",1],["showCeremony","Mostrar ceremonia",0],["ceremonyText","Lugar de la ceremonia",1],["ceremonyUrl","Enlace de Maps de la ceremonia",1],["showReception","Mostrar recepción",0],["receptionText","Lugar de la recepción",1],["receptionUrl","Enlace de Maps de la recepción",1],["whatsappNumber","Número para confirmaciones",1],["whatsappMessage","Mensaje de WhatsApp",1]],sections:["sec-evento","sec-ubicaciones","sec-cierre"]},
 {id:"fotos",icon:"▧",title:"Fotografías",subtitle:"Portada y galería",desc:"Selecciona las fotografías desde tu computadora.",fields:[["portadaFile","Fotografía de portada",1],["galleryFiles","Galería de fotografías",1],["bannerFile","Banner o fotografía adicional",1],["bgFile","Imagen de fondo (opcional)",1]],sections:["sec-media"]},
 {id:"musica",icon:"♫",title:"Música",subtitle:"Canción del evento",desc:"Sube la canción y, si quieres, cambia su título.",fields:[["musicFile","Archivo de música",1],["musicTitle","Título de la canción",1],["musicArtist","Artista",1],["musicPlacement","Ubicación del reproductor",1]],sections:["sec-media"]},
 {id:"extras",icon:"＋",title:"Extras",subtitle:"Familia, regalos y video",desc:"Activa solo las secciones especiales que necesitas.",fields:[["showFamily","Mostrar familia",0],["showTransfer","Mostrar regalo o transferencia",0],["transferText","Mensaje del regalo",1],["transferNumber","Cuenta o CLABE (opcional)",1],["transferPhotoFile","Fotografía de regalo",1],["videoUrl","Enlace del video",1]],sections:["sec-familia","sec-transferencia","sec-video","sec-orden"]},
 {id:"estilo",icon:"◈",title:"Diseño",subtitle:"Colores y efectos",desc:"Son ajustes opcionales: el modelo ya tiene una composición preparada.",fields:[["heroLayout","Tipo de portada",1],["colorPalette","Paleta de colores",1],["fontPreset","Tipografía",1],["motionPreset","Movimiento",1],["titleSize","Tamaño del título",1]],sections:["sec-identidad","sec-portada","sec-apariencia","sec-movimiento"]}
];
var FIELD_CAT={preset:"design",themeVisual:"design",designCollection:"design",colorPalette:"estilo",fontPreset:"estilo"};
CATS.forEach(function(c){c.fields.forEach(function(f){if(!(f[0] in FIELD_CAT))FIELD_CAT[f[0]]=c.id})});
function mk(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function init(){
 var form=byId("config-form"),pane=document.querySelector(".editor-pane");if(!form||!pane)return;
 document.body.classList.add("lumina-v2");
 var sections=Array.from(form.querySelectorAll("details.form-section"));
 var appearance=sections.find(function(d){return d.querySelector("summary b")?.textContent.trim()==="03"});if(appearance&&!appearance.id)appearance.id="sec-apariencia";
 var shell=mk("div","lu-shell");shell.innerHTML="\n<div class=\"lu-kicker\">Lúmina · Estudio de invitaciones</div>\n<h1>Invitaciones hechas a tu estilo.</h1>\n<p>Elige un diseño, personaliza los detalles y prepara tu invitación. Lo demás lo hacemos sencillo.</p>\n<div class=\"lu-steps\" aria-label=\"Etapas de la invitación\">\n<button type=\"button\" class=\"lu-step\" data-lu-step=\"0\"><i>1</i> Diseño</button>\n<button type=\"button\" class=\"lu-step\" data-lu-step=\"1\"><i>2</i> Personaliza</button>\n<button type=\"button\" class=\"lu-step\" data-lu-step=\"2\"><i>3</i> Entrega</button>\n</div>\n<section class=\"lu-stage\" id=\"lu-stage-design\">\n<div class=\"lu-hero\"><span class=\"lu-kicker\">Primer paso</span><h2>¿Qué vamos a celebrar?</h2><p>Selecciona el tipo de invitación y luego el modelo que más te guste.</p></div>\n<div class=\"lu-panel\"><div class=\"lu-label\">Tipo de evento</div><div class=\"lu-event-grid\" id=\"lu-event-grid\"></div></div>\n<div class=\"lu-panel\"><h3>Elige tu diseño</h3><p style=\"margin:8px 0 15px\">Prueba distintos estilos. La vista del teléfono se actualiza para ayudarte a elegir.</p>\n<div class=\"lu-theme-grid\" id=\"lu-theme-grid\" aria-label=\"Modelos disponibles\"></div>\n<div id=\"lu-theme-fallback\" class=\"lu-note\" hidden>Los modelos también se pueden elegir desde Ajustes especiales.</div>\n<div style=\"margin-top:17px\" id=\"lu-design-extra\"></div></div>\n</section>\n<section class=\"lu-stage\" id=\"lu-stage-personal\" hidden>\n<div class=\"lu-hero\"><span class=\"lu-kicker\">Segundo paso</span><h2>Hazla tuya.</h2><p>Elige qué quieres cambiar. Solo aparecerán los controles que necesitas.</p></div>\n<div class=\"lu-category-grid\" id=\"lu-category-grid\"></div>\n<div class=\"lu-category-panel\" id=\"lu-category-panel\">\n<div class=\"lu-category-panel-head\"><h3 id=\"lu-category-title\">Textos</h3><button type=\"button\" id=\"lu-category-close\">Cerrar</button></div>\n<p id=\"lu-category-desc\"></p><div class=\"lu-fields\" id=\"lu-fields\"></div>\n<div class=\"lu-more\"><span style=\"font-size:11px;color:#897985\">¿Quieres modificar más detalles?</span><button type=\"button\" data-lu-advanced=\"category\">Ajustes especiales</button></div>\n</div>\n<div class=\"lu-note\">Toca los textos del teléfono para editarlos. Para sustituir fotografías, usa la tarjeta «Fotografías».</div>\n</section>\n<section class=\"lu-stage\" id=\"lu-stage-delivery\" hidden>\n<div class=\"lu-hero\"><span class=\"lu-kicker\">Tercer paso</span><h2>Revisa y comparte.</h2><p>Abre la invitación como la verán tus invitados. Cuando esté lista, prepara su entrega.</p></div>\n<div class=\"lu-panel\"><div class=\"lu-action-grid\">\n<button class=\"lu-btn lu-action-main\" id=\"lu-preview\" type=\"button\"><span><strong>Ver invitación completa</strong><small>Abre la vista previa en otra ventana</small></span><b>↗</b></button>\n<button class=\"lu-btn primary lu-action-main\" id=\"lu-download\" type=\"button\"><span><strong>Preparar invitación</strong><small>Generar el archivo ZIP de entrega</small></span><b>↓</b></button>\n<button class=\"lu-btn lu-action-main\" id=\"lu-publish\" type=\"button\"><span><strong>Publicar en GitHub</strong><small>Solo en un repositorio de prueba independiente</small></span><b>↗</b></button>\n</div><div class=\"lu-actions-secondary\">\n<button class=\"lu-btn\" id=\"lu-save\" type=\"button\">Guardar datos (JSON)</button>\n<button class=\"lu-btn\" id=\"lu-load\" type=\"button\">Abrir datos (JSON)</button>\n</div>\n<div class=\"lu-disclaimer\">Guardar datos conserva textos y ajustes, pero no fotografías ni música. Para recuperarlos tendrás que seleccionarlos otra vez. Publicar requiere una cuenta y un repositorio independiente.</div>\n</div></section>\n<div class=\"lu-bottom\"><button type=\"button\" class=\"lu-btn\" id=\"lu-prev\">← Volver</button><button type=\"button\" class=\"lu-btn primary\" id=\"lu-next\">Continuar →</button></div>\n<div class=\"lu-more\" id=\"lu-advanced-footer\"><span style=\"font-size:10px;color:#998a97\">Las funciones originales siguen disponibles.</span><button type=\"button\" id=\"lu-advanced-toggle\">Ajustes especiales</button></div>\n<div id=\"lu-project-help\" class=\"lu-project-help\" hidden role=\"status\"></div>";pane.insertBefore(shell,form);
 var qs=function(s){return shell.querySelector(s)};
 var get=function(id){return qs("#"+id)};
 var mobileJump=mk("button","lu-mobile-jump","Ver invitación ↗");mobileJump.type="button";document.body.appendChild(mobileJump);
 var previewPane=document.querySelector(".preview-pane");
 var mobileBack=mk("button","lu-preview-return","← Volver a editar");mobileBack.type="button";if(previewPane)previewPane.appendChild(mobileBack);
 var state={step:0,cat:"textos",extra:false},copies=new Map();
 function top(){qs(".lu-steps").scrollIntoView({behavior:"smooth",block:"start"})}
 function hideExtra(){state.extra=false;document.body.classList.remove("lumina-extra");get("lu-advanced-toggle").textContent="Ajustes especiales";}
 function showExtra(ids){
  state.extra=true;document.body.classList.add("lumina-extra");
  get("lu-advanced-toggle").textContent="Volver al editor sencillo";
  sections.forEach(function(d){var show=ids.includes(d.id)&&d.id!=="sec-system";d.classList.remove("editor-filtered");d.classList.toggle("lumina-hide-section",!show);d.open=show});
  form.scrollIntoView({behavior:"smooth",block:"start"});
 }
 function currentSections(){return state.step===0?["sec-identidad","sec-portada","sec-apariencia"]:state.step===2?["sec-exportar","sec-github"]:CATS.find(function(c){return c.id===state.cat})?.sections||[]}
 function sourceChange(id,val){
  var el=byId(id);if(!el)return;
  if(el.type==="checkbox")el.checked=!!val;else el.value=val;
  el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));
  queueSync();
 }
 function renderEvents(){
  var root=get("lu-event-grid");root.replaceChildren();
  EVENTS.forEach(function(item){var btn=mk("button","lu-event");btn.type="button";btn.dataset.luPreset=item[0];btn.innerHTML='<span style="font-size:23px">'+item[2]+'</span><span>'+item[1]+'</span>';root.appendChild(btn)});
  syncEvent();
 }
 function syncEvent(){shell.querySelectorAll("[data-lu-preset]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.luPreset===byId("preset")?.value))})}
 function renderThemes(){
  var src=byId("theme-strip"),root=get("lu-theme-grid");if(!src||!root)return;
  var originals=Array.from(src.querySelectorAll("button.theme-chip"));
  root.replaceChildren();originals.forEach(function(b){
   var btn=mk("button","lu-theme");btn.type="button";btn.dataset.luTheme=b.dataset.theme||"";
   btn.innerHTML=b.innerHTML;btn.style.setProperty("--swatch",b.style.getPropertyValue("--swatch")||"#e9dce3");
   btn.setAttribute("aria-pressed",String(btn.dataset.luTheme===byId("themeVisual")?.value));
   btn.addEventListener("click",function(){
    var real=Array.from(src.querySelectorAll("button.theme-chip")).find(function(x){return x.dataset.theme===btn.dataset.luTheme});
    if(real)real.click();else sourceChange("themeVisual",btn.dataset.luTheme);
    queueSync();
   });root.appendChild(btn);
  });
  get("lu-theme-fallback").hidden=originals.length>0;
 }
 function register(id,entry){if(!copies.has(id))copies.set(id,[]);copies.get(id).push(entry)}
 function field(id,label,wide){
  var src=byId(id);if(!src)return null;
  var wrap=mk("div","lu-field"+(wide?" lu-field-wide":"")),caption=mk("span","lu-field-label",label);wrap.appendChild(caption);
  if(src.type==="file"){
   var box=mk("div","lu-upload"),note=mk("span","","Ningún archivo seleccionado"),btn=mk("button","lu-btn","Elegir archivo");
   btn.type="button";btn.addEventListener("click",function(){src.click()});box.appendChild(note);box.appendChild(btn);wrap.appendChild(box);
   register(id,{kind:"file",note:note,src:src});return wrap;
  }
  var t=src.type,el;
  if(src.tagName==="SELECT"){el=document.createElement("select")}
  else if(src.tagName==="TEXTAREA"){el=document.createElement("textarea");el.rows=Math.min(Math.max(src.rows||2,2),4)}
  else{el=document.createElement("input");el.type=["checkbox","url","datetime-local","color","number","range"].includes(t)?t:"text"}
  if(t==="checkbox"){
   wrap.classList.add("lu-field-check");caption.remove();el.id="lu-proxy-"+id;
   var lab=mk("label","",label);lab.htmlFor=el.id;wrap.appendChild(el);wrap.appendChild(lab);
  }else{el.setAttribute("aria-label",label);wrap.appendChild(el)}
  if(src.placeholder)el.placeholder=src.placeholder;
  if(src.min)el.min=src.min;if(src.max)el.max=src.max;if(src.step)el.step=src.step;
  el.addEventListener("input",function(){sourceChange(id,t==="checkbox"?el.checked:el.value)});
  el.addEventListener("change",function(){sourceChange(id,t==="checkbox"?el.checked:el.value)});
  register(id,{kind:"control",el:el,src:src});return wrap;
 }
 function designSettings(){
  var area=get("lu-design-extra"),grid=mk("div","lu-fields");
  [["fontPreset","Tipografía",1],["colorPalette","Colores",1]].forEach(function(f){var el=field(f[0],f[1],f[2]);if(el)grid.appendChild(el)});
  area.appendChild(grid);
  var more=mk("div","lu-more"),lbl=mk("span","","¿Necesitas más opciones de diseño?"),btn=mk("button","","Ajustes especiales");
  lbl.style.cssText="font-size:11px;color:#8f7d8b";btn.type="button";
  btn.addEventListener("click",function(){showExtra(["sec-identidad","sec-portada","sec-apariencia","sec-movimiento"])});
  more.appendChild(lbl);more.appendChild(btn);area.appendChild(more);
 }
 function renderCategories(){
  var root=get("lu-category-grid");
  CATS.forEach(function(c){
   var btn=mk("button","lu-category");btn.type="button";btn.dataset.luCat=c.id;
   btn.innerHTML='<span class="lu-category-icon" aria-hidden="true">'+c.icon+'</span><span><strong>'+c.title+'</strong><small>'+c.subtitle+'</small></span>';
   root.appendChild(btn);
  });
 }
 function setCategory(id,scroll){
  var c=CATS.find(function(x){return x.id===id});if(!c)return;state.cat=id;
  shell.querySelectorAll("[data-lu-cat]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.luCat===id))});
  get("lu-category-panel").hidden=false;get("lu-category-title").textContent=c.title;get("lu-category-desc").textContent=c.desc;
  var root=get("lu-fields");root.replaceChildren();
  c.fields.forEach(function(f){var el=field(f[0],f[1],f[2]);if(el)root.appendChild(el)});
  syncQuick();if(scroll)get("lu-category-panel").scrollIntoView({behavior:"smooth",block:"start"});
 }
 function setStep(n,scroll){
  state.step=Math.max(0,Math.min(2,n));hideExtra();
  ["design","personal","delivery"].forEach(function(s,i){get("lu-stage-"+s).hidden=state.step!==i});
  shell.querySelectorAll("[data-lu-step]").forEach(function(b){if(+b.dataset.luStep===state.step)b.setAttribute("aria-current","step");else b.removeAttribute("aria-current")});
  get("lu-prev").disabled=state.step===0;get("lu-next").textContent=state.step===2?"Ver invitación ↗":"Continuar →";
  get("lu-advanced-footer").style.display=state.step===2?"none":"flex";
  if(state.step===1)setCategory(state.cat,false);
  if(state.step===0)renderThemes();
  if(scroll)top();
 }
 function syncQuick(){
  syncEvent();copies.forEach(function(list){list.forEach(function(v){
   if(v.kind==="file"){var files=Array.from(v.src.files||[]);v.note.textContent=files.length?(files.length===1?files[0].name:files.length+" archivos seleccionados"):"Ningún archivo seleccionado";return}
   var el=v.el,src=v.src;
   if(document.activeElement===el&&el.tagName!=="SELECT"&&el.type!=="checkbox")return;
   if(el.tagName==="SELECT"){if(el.innerHTML!==src.innerHTML)el.innerHTML=src.innerHTML;if(el.value!==src.value)el.value=src.value}
   else if(el.type==="checkbox")el.checked=src.checked;
   else if(el.value!==src.value)el.value=src.value;
  })});
  get("lu-theme-grid").querySelectorAll("[data-lu-theme]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.luTheme===byId("themeVisual")?.value))});
 }
 var synctimer;function queueSync(){clearTimeout(synctimer);synctimer=setTimeout(syncQuick,60)}
 function notice(msg){var el=get("lu-project-help");el.hidden=false;el.className="lu-note";el.textContent=msg;el.scrollIntoView({behavior:"smooth",block:"nearest"})}
 function saveData(){
  if(typeof configObject!=="function"||typeof getFormParams!=="function"){notice("No se pudo crear el archivo de datos.");return}
  try{
   var data=configObject(getFormParams()),blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
   a.href=url;a.download="lumina-datos-invitacion.json";a.style.display="none";document.body.appendChild(a);a.click();a.remove();
   setTimeout(function(){URL.revokeObjectURL(url)},1000);
   notice("Datos guardados. Las fotos y la música deben seleccionarse otra vez al abrir el archivo.");
  }catch(err){notice("No se pudieron guardar los datos: "+(err.message||"error"))}
 }
 document.addEventListener("click",function(e){
  if(!e.target.closest("#githubPublish"))return;
  var repo=String(byId("githubRepo")?.value||"").trim().toLowerCase();
  if(!repo||repo==="auraplataforma5.5"||repo==="auradigitaljal.github.io"||repo.endsWith("/auraplataforma5.5")||repo.endsWith("/auradigitaljal.github.io")){
   e.preventDefault();e.stopImmediatePropagation();alert("Esta versión de pruebas no permite publicar sobre los repositorios principales de Aura. Elige un repositorio de prueba distinto.");
  }
 },true);
 var previous=(typeof focusEditorField52==="function")?focusEditorField52:null;
 function focusFromPreview(id){
  var cat=FIELD_CAT[id],src=byId(id);
  if(cat==="design"){setStep(0,true);return}
  if(cat){
   setStep(1,false);setCategory(cat,false);
   var target=(copies.get(id)||[]).find(function(x){return x.kind==="control"})?.el;
   if(target){get("lu-category-panel").scrollIntoView({behavior:"smooth",block:"start"});setTimeout(function(){target.focus({preventScroll:true})},100);return}
  }
  if(src){setStep(1,false);var sec=src.closest("details.form-section");if(sec){showExtra([sec.id]);sec.open=true}if(previous)previous(id)}
 }
 if(previous)focusEditorField52=focusFromPreview;
 document.addEventListener("input",function(e){if(form.contains(e.target))queueSync()},true);
 document.addEventListener("change",function(e){if(form.contains(e.target)){queueSync();setTimeout(syncQuick,450)}},true);
 renderEvents();renderCategories();designSettings();setCategory("textos",false);
 var themeSource=byId("theme-strip");if(themeSource&&typeof MutationObserver==="function"){new MutationObserver(renderThemes).observe(themeSource,{childList:true})}
 setStep(0,false);syncQuick();
 shell.addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b)return;
  if(b.dataset.luStep!==undefined){setStep(+b.dataset.luStep,true);return}
  if(b.dataset.luCat){setCategory(b.dataset.luCat,true);return}
  if(b.dataset.luPreset){sourceChange("preset",b.dataset.luPreset);if(byId("designCollection"))sourceChange("designCollection","event");renderThemes();return}
  if(b.id==="lu-category-close"){get("lu-category-panel").hidden=true;return}
  if(b.id==="lu-prev"){setStep(state.step-1,true);return}
  if(b.id==="lu-next"){if(state.step===2)byId("open-preview-window")?.click();else setStep(state.step+1,true);return}
  if(b.id==="lu-advanced-toggle"){if(state.extra){hideExtra();top()}else showExtra(currentSections());return}
  if(b.dataset.luAdvanced==="category"){showExtra(currentSections());return}
  if(b.id==="lu-preview"){byId("open-preview-window")?.click();return}
  if(b.id==="lu-download"){byId("generate-zip")?.click();return}
  if(b.id==="lu-publish"){showExtra(["sec-github"]);return}
  if(b.id==="lu-save"){saveData();return}
  if(b.id==="lu-load"){byId("localConfig")?.click();return}
 });
 if(byId("open-preview-window"))byId("open-preview-window").textContent="Ver invitación ↗";
 mobileJump.addEventListener("click",function(){previewPane?.scrollIntoView({behavior:"smooth",block:"start"})});
 mobileBack.addEventListener("click",function(){pane.scrollIntoView({behavior:"smooth",block:"start"})});
 byId("localConfig")?.addEventListener("change",function(){setTimeout(function(){syncQuick();renderThemes()},500)});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
