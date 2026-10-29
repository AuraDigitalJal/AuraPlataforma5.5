/* Lúmina: guía de navegación de pruebas, sin modificar el motor Aura. */
(function(){
"use strict";
var STEPS=[
 {name:"Diseño",title:"Elige el diseño",help:"Selecciona el tipo de celebración y el estilo que más te guste. Puedes cambiarlo después.",note:"Consejo: empieza eligiendo boda, XV años, bautizo o cumpleaños.",ids:["sec-identidad"]},
 {name:"Portada",title:"Personaliza la portada",help:"Escribe los nombres, elige colores y ajusta la presentación inicial. Los controles de animación están aquí mismo.",note:"La vista del teléfono cambia con tus ajustes. Toca un texto dentro de ella para editarlo.",ids:["sec-portada","sec-apariencia","sec-movimiento"]},
 {name:"Evento",title:"Completa los datos del evento",help:"Agrega fecha, ceremonia, recepción, familia y el mensaje de confirmación.",note:"Abre cada apartado para completar solo lo que necesites.",ids:["sec-evento","sec-ubicaciones","sec-familia","sec-cierre"]},
 {name:"Multimedia",title:"Añade fotografías y música",help:"Carga imágenes, agrega tu canción y, si lo deseas, incorpora video o datos de regalo.",note:"Las fotografías, el video y el regalo son opcionales.",ids:["sec-media","sec-video","sec-transferencia"]},
 {name:"Orden",title:"Organiza la invitación",help:"Decide el orden de cada bloque y oculta las secciones que no quieras mostrar.",note:"Este paso es opcional: puedes mantener el orden predeterminado.",ids:["sec-orden"]},
 {name:"Entrega",title:"Revisa y prepara la entrega",help:"Comprueba la vista previa, genera el ZIP o publica en un repositorio de pruebas propio.",note:"Importante: nunca publiques usando el repositorio principal de Aura. Esta es una versión de evaluación.",ids:["sec-exportar","sec-github"]}
];
function init(){
 var body=document.body,pane=document.querySelector(".editor-pane"),form=document.getElementById("config-form");if(!pane||!form)return;
 body.classList.add("lumina-easy","lumina-home-active");
 var sections=Array.from(form.querySelectorAll("details.form-section"));
 var appearance=sections.find(function(d){return d.querySelector("summary b")?.textContent.trim()==="03";});if(appearance&&!appearance.id)appearance.id="sec-apariencia";
 var welcome=document.createElement("section");welcome.className="lumina-welcome";welcome.setAttribute("aria-label","Inicio de Lúmina");
 welcome.innerHTML='<span class="lumina-overline">LÚMINA · ESTUDIO DE INVITACIONES</span><h1>Tu próxima invitación empieza aquí.</h1><p>Diseña paso a paso. No necesitas conocer todas las herramientas para crear una invitación especial.</p><div class="lumina-welcome-actions"><button class="lumina-btn primary" type="button" id="lumina-start">Crear invitación · Empezar</button><button class="lumina-btn" type="button" id="lumina-resume">Entrar directamente al editor</button><button class="lumina-btn" type="button" id="lumina-know" aria-expanded="false">¿Cómo funciona?</button></div><div class="lumina-help" id="lumina-help" hidden><strong>Trabajarás en seis pasos:</strong> elegir diseño, preparar portada, agregar información, subir imágenes y música, organizar y entregar.<br>En cualquier momento puedes regresar a un paso anterior. Los controles avanzados siguen disponibles.</div><div class="lumina-welcome-tip">Versión de prueba · No compartas las credenciales ni repositorios de Aura al evaluar esta interfaz.</div>';
 var wizard=document.createElement("div");wizard.className="lumina-wizard";wizard.setAttribute("aria-label","Navegación por pasos");wizard.innerHTML='<div class="lumina-wizard-top"><strong id="lumina-counter">Paso 1 de 6</strong><button type="button" id="lumina-back-home">Ir al inicio</button></div><div class="lumina-progress" aria-hidden="true"><span id="lumina-progress-fill"></span></div><div class="lumina-steps" role="navigation" aria-label="Pasos de creación">'+STEPS.map(function(s,i){return '<button class="lumina-step" type="button" data-lumina-step="'+i+'"><b>'+(i+1)+'</b><span>'+s.name+'</span></button>';}).join("")+'</div>';
 var stage=document.createElement("div");stage.className="lumina-stage";stage.innerHTML='<h2 id="lumina-stage-title"></h2><p id="lumina-stage-help"></p><div class="lumina-note" id="lumina-stage-note"></div><div class="lumina-advanced-banner">Estás viendo todas las herramientas del editor. Cuando termines, vuelve a la navegación guiada.</div><div style="margin-top:12px"><button class="lumina-btn" type="button" id="lumina-advanced" aria-pressed="false">Ver todas las herramientas</button></div>';
 var actions=document.createElement("div");actions.className="lumina-actions";actions.innerHTML='<button class="lumina-btn" type="button" id="lumina-prev">← Anterior</button><small id="lumina-actions-label">Paso 1 de 6</small><button class="lumina-btn primary" type="button" id="lumina-next">Siguiente →</button>';
 pane.insertBefore(welcome,form);pane.insertBefore(wizard,form);pane.insertBefore(stage,form);form.after(actions);
 var state={step:0,advanced:false};
 function id(x){return document.getElementById(x)}
 function displayStep(n,scroll){
  state.step=Math.max(0,Math.min(STEPS.length-1,n));state.advanced=false;body.classList.remove("lumina-advanced","lumina-home-active");welcome.hidden=true;
  sections.forEach(function(d){d.classList.remove("editor-filtered");var visible=STEPS[state.step].ids.includes(d.id);d.classList.toggle("lumina-section-hidden",!visible);if(!visible)d.open=false;});
  var first=sections.find(function(d){return d.id===STEPS[state.step].ids[0];});if(first)first.open=true;
  id("lumina-counter").textContent="Paso "+(state.step+1)+" de 6";
  id("lumina-actions-label").textContent="Paso "+(state.step+1)+" de 6";
  id("lumina-progress-fill").style.width=((state.step+1)/STEPS.length*100)+"%";
  id("lumina-stage-title").textContent=STEPS[state.step].title;
  id("lumina-stage-help").textContent=STEPS[state.step].help;
  id("lumina-stage-note").textContent=STEPS[state.step].note;
  id("lumina-advanced").textContent="Ver todas las herramientas";id("lumina-advanced").setAttribute("aria-pressed","false");
  wizard.querySelectorAll("[data-lumina-step]").forEach(function(b){if(+b.dataset.luminaStep===state.step)b.setAttribute("aria-current","step");else b.removeAttribute("aria-current")});
  id("lumina-prev").disabled=state.step===0;id("lumina-prev").style.opacity=state.step===0?".45":"1";
  id("lumina-next").textContent=state.step===STEPS.length-1?"Revisar vista previa ↗":"Siguiente →";
  try{sessionStorage.setItem("lumina-guide-step",String(state.step))}catch(_){}
  if(scroll!==false){wizard.scrollIntoView({behavior:"smooth",block:"start"});}
 }
 function allTools(){
  body.classList.remove("lumina-home-active");welcome.hidden=true;state.advanced=!state.advanced;
  body.classList.toggle("lumina-advanced",state.advanced);
  sections.forEach(function(d){d.classList.remove("editor-filtered");var visible=state.advanced?d.id!=="sec-system":STEPS[state.step].ids.includes(d.id);d.classList.toggle("lumina-section-hidden",!visible);if(!visible)d.open=false;});
  id("lumina-advanced").textContent=state.advanced?"Volver a la guía":"Ver todas las herramientas";
  id("lumina-advanced").setAttribute("aria-pressed",String(state.advanced));
  if(state.advanced){id("lumina-stage-title").textContent="Todas las herramientas";id("lumina-stage-help").textContent="Puedes acceder a los ajustes especiales. La herramienta de actualización del sistema permanece reservada a Aura.";id("lumina-stage-note").textContent="No es necesario modificar estas opciones para crear una invitación."}
  else displayStep(state.step,false);
 }
 id("lumina-start").addEventListener("click",function(){displayStep(0,true)});
 id("lumina-resume").addEventListener("click",function(){var saved=0;try{saved=Number(sessionStorage.getItem("lumina-guide-step")||0)}catch(_){}displayStep(saved,true)});
 id("lumina-know").addEventListener("click",function(){var h=id("lumina-help");h.hidden=!h.hidden;this.setAttribute("aria-expanded",String(!h.hidden))});
 id("lumina-back-home").addEventListener("click",function(){welcome.hidden=false;body.classList.add("lumina-home-active");welcome.scrollIntoView({behavior:"smooth",block:"start"})});
 id("lumina-prev").addEventListener("click",function(){displayStep(state.step-1,true)});
 id("lumina-next").addEventListener("click",function(){if(state.step===STEPS.length-1){document.querySelector(".preview-pane")?.scrollIntoView({behavior:"smooth",block:"start"});}else displayStep(state.step+1,true)});
 id("lumina-advanced").addEventListener("click",allTools);
 wizard.querySelectorAll("[data-lumina-step]").forEach(function(b){b.addEventListener("click",function(){displayStep(+b.dataset.luminaStep,true)})});
 var originalNav=document.querySelector(".editor-groupnav");
 if(originalNav)originalNav.addEventListener("click",function(e){var b=e.target.closest("[data-editor-group]");if(!b)return;var groups={design:1,content:2,media:3,order:4,file:5};var n=groups[b.dataset.editorGroup];if(Number.isInteger(n)){setTimeout(function(){displayStep(n,false)},0)}});
 var openGithub=id("open-github");if(openGithub)openGithub.addEventListener("click",function(){displayStep(5,false);id("sec-github").open=true},true);
 document.addEventListener("click",function(e){
  var b=e.target.closest("#githubPublish,#auraSystemInstall");if(!b)return;
  if(b.id==="auraSystemInstall"){e.preventDefault();e.stopImmediatePropagation();alert("La actualización del sistema se hace únicamente en Aura. Esta versión es para probar la interfaz.");return}
  var name=String(id("githubRepo")?.value||"").toLowerCase().trim();
  if(!name||name.includes("auraplataforma5.5")||name.includes("auradigitaljal.github.io")){
   e.preventDefault();e.stopImmediatePropagation();alert("Por seguridad, Lúmina de pruebas no puede publicar en la plataforma oficial de Aura. Selecciona un repositorio de prueba diferente.");}
 },true);
 var publishHead=id("sec-github")?.querySelector(".section-body");
 if(publishHead){var info=document.createElement("p");info.className="helper";info.textContent="Lúmina (pruebas): utiliza un repositorio de prueba independiente. Nunca conectes el repositorio de la plataforma oficial Aura.";publishHead.prepend(info);}
 sections.forEach(function(d){d.classList.add("lumina-section-hidden");d.open=false});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();