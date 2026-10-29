
/* Lúmina V2: vista sencilla sobre el motor Aura sin copiar lógica de publicación. */
(function(){
"use strict";
var byId=function(id){return document.getElementById(id)};
var EVENTS=[["boda","Boda","♡"],["xv","XV años","✧"],["bautizo","Bautizo","❀"],["cumple","Cumpleaños","◌"],["graduacion","Graduación","◇"],["escolar","Evento escolar","✦"]];
var CATS=[
 {id:"textos",icon:"Aa",title:"Textos",subtitle:"Todo en una ventana",desc:"Selecciona el texto que deseas editar. Aquí están reunidos todos los campos y las frases especiales.",fields:[],sections:["sec-portada","sec-familia","sec-cierre","sec-aura-fixed-copy"]},
 {id:"colores",icon:"◉",title:"Colores",subtitle:"Paletas y tonos",desc:"Elige una combinación completa o cambia cada color de tu invitación por separado.",fields:[],sections:["sec-apariencia","sec-portada"]},
 {id:"evento",icon:"◷",title:"Evento y lugares",subtitle:"Fecha, horarios y mapas",desc:"Completa los datos, los lugares y el contacto para confirmar.",fields:[["eventDate","Fecha y hora",1],["showCeremony","Mostrar ceremonia",0],["ceremonyText","Lugar de la ceremonia",1],["ceremonyUrl","Enlace de Maps de la ceremonia",1],["showReception","Mostrar recepción",0],["receptionText","Lugar de la recepción",1],["receptionUrl","Enlace de Maps de la recepción",1],["whatsappNumber","Número para confirmaciones",1],["whatsappMessage","Mensaje para WhatsApp",1]],sections:["sec-evento","sec-ubicaciones","sec-cierre"]},
 {id:"fotos",icon:"▧",title:"Fotografías",subtitle:"Portada y galería",desc:"Selecciona las fotografías desde tu computadora.",fields:[["portadaFile","Fotografía de portada",1],["galleryFiles","Galería de fotografías",1],["bannerFile","Banner principal",1],["bannerExtraFile","Banner adicional",1],["bgFile","Imagen de fondo",1]],sections:["sec-media"]},
 {id:"musica",icon:"♫",title:"Música",subtitle:"Canción y reproductor",desc:"Sube tu canción y elige dónde aparece el reproductor.",fields:[["musicFile","Archivo de música",1],["musicTitle","Título de la canción",1],["musicArtist","Artista",1],["musicPlacement","Ubicación del reproductor",1]],sections:["sec-media"]},
 {id:"apariencia",icon:"◇",title:"Apariencia",subtitle:"Portada y efectos",desc:"Ajusta la composición, tipografía o animaciones solo si lo deseas.",fields:[["heroLayout","Diseño de portada",1],["fontPreset","Tipografía",1],["motionPreset","Movimiento",1],["motionIntensity","Intensidad de movimiento",1],["heroAlignment","Alineación de portada",1]],sections:["sec-identidad","sec-portada","sec-apariencia","sec-movimiento"]},
 {id:"extras",icon:"＋",title:"Elementos extra",subtitle:"Regalos y video",desc:"Activa solo las secciones opcionales que necesites.",fields:[["showFamily","Mostrar familia",0],["showTransfer","Mostrar regalo o transferencia",0],["transferText","Mensaje del regalo",1],["transferNumber","Cuenta o CLABE",1],["transferPhotoFile","Fotografía de regalo",1],["videoUrl","Enlace de video",1]],sections:["sec-familia","sec-transferencia","sec-video"]},
 {id:"orden",icon:"≡",title:"Orden",subtitle:"Acomodo de secciones",desc:"Reorganiza las secciones o escribe 0 para ocultar aquellas que lo permiten.",fields:[["orderLocations","Ubicaciones",1],["orderFamily","Familia",1],["orderConfirm","Confirmación",1],["orderCountdown","Cuenta regresiva",1],["orderGallery","Galería",1],["orderBannerExtra","Banner adicional",1],["orderMessage","Mensaje final",1],["orderVideo","Video",1],["orderTransfer","Regalo",1]],sections:["sec-orden"]}
];
var FIELD_CAT={preset:"design",themeVisual:"design",designCollection:"design",colorPalette:"colores",fontPreset:"apariencia"};
CATS.forEach(function(c){c.fields.forEach(function(f){if(!(f[0] in FIELD_CAT))FIELD_CAT[f[0]]=c.id})});
function mk(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function init(){
 var form=byId("config-form"),pane=document.querySelector(".editor-pane");if(!form||!pane)return;
 document.body.classList.add("lumina-v2");
 var sections=Array.from(form.querySelectorAll("details.form-section"));
 var appearance=sections.find(function(d){return d.querySelector("summary b")?.textContent.trim()==="03"});if(appearance&&!appearance.id)appearance.id="sec-apariencia";
 var shell=mk("div","lu-shell");shell.innerHTML="\n<div class=\"lu-kicker\">Lúmina · Estudio de invitaciones</div>\n<h1>Invitaciones hechas a tu estilo.</h1>\n<p>Elige cualquier diseño, cambia los textos y colores, y prepara tu invitación.</p>\n<div class=\"lu-steps\" aria-label=\"Etapas de la invitación\">\n<button type=\"button\" class=\"lu-step\" data-lu-step=\"0\"><i>1</i> Diseño</button>\n<button type=\"button\" class=\"lu-step\" data-lu-step=\"1\"><i>2</i> Personaliza</button>\n<button type=\"button\" class=\"lu-step\" data-lu-step=\"2\"><i>3</i> Entrega</button>\n</div>\n<section class=\"lu-stage\" id=\"lu-stage-design\">\n<div class=\"lu-hero\"><span class=\"lu-kicker\">Primer paso</span><h2>¿Qué vamos a celebrar?</h2><p>Selecciona el tipo de invitación y luego el modelo que más te guste.</p></div>\n<div class=\"lu-panel\"><div class=\"lu-label\">Tipo de evento</div><div class=\"lu-event-grid\" id=\"lu-event-grid\"></div></div>\n<div class=\"lu-panel\"><h3>Elige tu diseño</h3><p style=\"margin:8px 0 15px\">Prueba distintos estilos. La vista del teléfono se actualiza para ayudarte a elegir.</p>\n<div class=\"lu-catalog-filter\" role=\"group\" aria-label=\"Qué diseños mostrar\"><button type=\"button\" data-lu-filter=\"all\" aria-pressed=\"true\">Todos los diseños</button><button type=\"button\" data-lu-filter=\"event\" aria-pressed=\"false\">Sugeridos</button></div><div class=\"lu-theme-grid\" id=\"lu-theme-grid\" aria-label=\"Modelos disponibles\"></div><div class=\"lu-note\" id=\"lu-catalog-note\">Puedes elegir cualquier modelo sin importar el tipo de celebración. Los estilos exclusivos pueden conservar elementos de su evento original.</div>\n<div id=\"lu-theme-fallback\" class=\"lu-note\" hidden>Los modelos también se pueden elegir desde Ajustes especiales.</div>\n<div style=\"margin-top:17px\" id=\"lu-design-extra\"></div></div>\n</section>\n<section class=\"lu-stage\" id=\"lu-stage-personal\" hidden>\n<div class=\"lu-hero\"><span class=\"lu-kicker\">Segundo paso</span><h2>Hazla tuya.</h2><p>Elige qué quieres cambiar. Solo aparecerán los controles que necesitas.</p></div>\n<div class=\"lu-category-grid\" id=\"lu-category-grid\"></div>\n<div class=\"lu-category-panel\" id=\"lu-category-panel\">\n<div class=\"lu-category-panel-head\"><h3 id=\"lu-category-title\">Textos</h3><button type=\"button\" id=\"lu-category-close\">Cerrar</button></div>\n<p id=\"lu-category-desc\"></p><div class=\"lu-fields\" id=\"lu-fields\"></div>\n<div class=\"lu-more\"><span style=\"font-size:11px;color:#897985\">¿Quieres modificar más detalles?</span><button type=\"button\" data-lu-advanced=\"category\">Ajustes especiales</button></div>\n</div>\n<div class=\"lu-note\">Todos los textos están en una sola ventana. Si tocas uno en la vista previa, lo encontrarás seleccionado aquí.</div>\n</section>\n<section class=\"lu-stage\" id=\"lu-stage-delivery\" hidden>\n<div class=\"lu-hero\"><span class=\"lu-kicker\">Tercer paso</span><h2>Revisa y comparte.</h2><p>Abre la invitación como la verán tus invitados. Cuando esté lista, prepara su entrega.</p></div>\n<div class=\"lu-panel\"><div class=\"lu-action-grid\">\n<button class=\"lu-btn lu-action-main\" id=\"lu-preview\" type=\"button\"><span><strong>Ver invitación completa</strong><small>Abre la vista previa en otra ventana</small></span><b>↗</b></button>\n<button class=\"lu-btn primary lu-action-main\" id=\"lu-download\" type=\"button\"><span><strong>Preparar invitación</strong><small>Generar el archivo ZIP de entrega</small></span><b>↓</b></button>\n<button class=\"lu-btn lu-action-main\" id=\"lu-publish\" type=\"button\"><span><strong>Publicar en GitHub</strong><small>Solo en un repositorio de prueba independiente</small></span><b>↗</b></button>\n</div><div class=\"lu-actions-secondary\">\n<button class=\"lu-btn\" id=\"lu-save\" type=\"button\">Guardar datos (JSON)</button>\n<button class=\"lu-btn\" id=\"lu-load\" type=\"button\">Abrir datos (JSON)</button>\n</div>\n<div class=\"lu-disclaimer\">Guardar datos conserva textos y ajustes, pero no fotografías ni música. Para recuperarlos tendrás que seleccionarlos otra vez. Publicar requiere una cuenta y un repositorio independiente.</div>\n</div></section>\n<div class=\"lu-bottom\"><button type=\"button\" class=\"lu-btn\" id=\"lu-prev\">← Volver</button><button type=\"button\" class=\"lu-btn primary\" id=\"lu-next\">Continuar →</button></div>\n<div class=\"lu-more\" id=\"lu-advanced-footer\"><span style=\"font-size:10px;color:#998a97\">Las funciones originales siguen disponibles.</span><button type=\"button\" id=\"lu-advanced-toggle\">Ajustes especiales</button></div>\n<div id=\"lu-project-help\" class=\"lu-project-help\" hidden role=\"status\"></div>";pane.insertBefore(shell,form);
 var qs=function(s){return shell.querySelector(s)};
 var get=function(id){return qs("#"+id)};
 var mobileJump=mk("button","lu-mobile-jump","Ver invitación ↗");mobileJump.type="button";document.body.appendChild(mobileJump);
 var previewPane=document.querySelector(".preview-pane");
 var mobileBack=mk("button","lu-preview-return","← Volver a editar");mobileBack.type="button";if(previewPane)previewPane.appendChild(mobileBack);
 /* La entrega simple muestra dos acciones. El resto queda disponible al expandirlo. */
 var deliver=get("lu-stage-delivery"),actionGrid=deliver.querySelector(".lu-action-grid");
 var disclosure=mk("details","lu-disclosure"),sum=mk("summary","","Más opciones: publicar o guardar avances");
 disclosure.appendChild(sum);
 disclosure.appendChild(get("lu-publish"));
 var extras=deliver.querySelector(".lu-actions-secondary");if(extras)disclosure.appendChild(extras);
 actionGrid.after(disclosure);
 var githubSection=byId("sec-github");
 if(githubSection){var ghBody=githubSection.querySelector(".section-body");if(ghBody){var notice=mk("p","helper","VERSIÓN DE PRUEBA: el publicador sigue utilizando la configuración de Aura. No uses sus repositorios oficiales ni compartas esta versión con clientes como Lúmina hasta configurar publicación independiente.");notice.style.cssText="padding:12px;border:1px solid #d7b8c8;border-radius:10px;background:#fff8fb;color:#79465e;font-weight:600";ghBody.prepend(notice)}}
 var state={step:0,cat:"textos",extra:false,filter:"all"},copies=new Map(),textSelected="",textSearch="",textBaseline=new Map();
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
  if(COLOR_IDS.includes(id)){var p=byId("colorPalette");if(p){p.value="custom";p.dispatchEvent(new Event("change",{bubbles:true}))}}
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
  if(src.min)el.min=src.min;if(src.max)el.max=src.max;if(src.step)el.step=src.step;if(src.disabled)el.disabled=true;
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
 
 /* V3: el evento y el diseño son independientes. */
 function setCatalog(mode){
  state.filter=mode==="event"?"event":"all";
  sourceChange("designCollection",state.filter);
  shell.querySelectorAll("[data-lu-filter]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.luFilter===state.filter))});
  get("lu-catalog-note").textContent=state.filter==="all"?"Se muestran todos los diseños, aunque hayas seleccionado otro tipo de celebración. Los estilos especiales pueden conservar secciones propias.":"Se muestran los modelos sugeridos. Pulsa «Todos los diseños» para explorar el catálogo completo.";
  renderThemes();
 }
 /* V3: los controles de color son exactamente los que utiliza el motor original. */
 var COLOR_FIELDS=[["primaryColor","Color principal y botones"],["headingColor","Color de los títulos"],["textColor","Color de los textos"],["bgBodyColor","Fondo general"],["bgContentColor","Fondo de las secciones"],["mutedColor","Texto secundario"],["heroTextColor","Texto de portada"]];
 var COLOR_IDS=COLOR_FIELDS.map(function(f){return f[0]});
 function renderColors(){
  var root=get("lu-fields");root.appendChild(mk("div","lu-color-heading","Paletas existentes"));
  var swatches=mk("div","lu-color-palettes");swatches.id="lu-color-palettes";root.appendChild(swatches);
  root.appendChild(mk("div","lu-color-heading","Personaliza cada color"));
  COLOR_FIELDS.forEach(function(f){var el=field(f[0],f[1],0);if(el)root.appendChild(el)});
  var reset=mk("button","lu-btn","Restaurar colores de la paleta");reset.type="button";
  reset.addEventListener("click",function(){
   var sel=byId("colorPalette"),k=sel?.value==="custom"?sel.dataset.lastRealPalette:sel?.value;
   var chip=Array.from(byId("palette-strip")?.querySelectorAll(".palette-chip")||[]).find(function(b){return b.dataset.palette===k});
   if(chip)chip.click();else if(k&&typeof applyPalette==="function"){sel.value=k;applyPalette(k)}
   renderSwatches();queueSync();
  });root.appendChild(reset);renderSwatches();
 }
 function renderSwatches(){
  var original=byId("palette-strip"),target=get("lu-color-palettes");if(!original||!target)return;
  target.replaceChildren();
  Array.from(original.querySelectorAll(".palette-chip")).forEach(function(b){
   var el=mk("button","lu-color-chip");el.type="button";el.dataset.luPalette=b.dataset.palette;el.innerHTML=b.innerHTML;
   el.addEventListener("click",function(){b.click();byId("colorPalette").dataset.lastRealPalette=b.dataset.palette;queueSync()});target.appendChild(el);
  });syncSwatches();
 }
 function syncSwatches(){
  var target=get("lu-color-palettes"),sel=byId("colorPalette");if(!target||!sel)return;
  if(sel.value&&sel.value!=="custom")sel.dataset.lastRealPalette=sel.value;
  target.querySelectorAll("[data-lu-palette]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.luPalette===sel.value))});
 }
 function updateConditional(){
  [["showCeremony",["ceremonyText","ceremonyUrl"]],["showReception",["receptionText","receptionUrl"]],["showTransfer",["transferText","transferNumber","transferPhotoFile"]]].forEach(function(rule){
   var shown=!!byId(rule[0])?.checked;rule[1].forEach(function(id){var target=get("lu-fields")?.querySelector('[data-lu-field="'+id+'"]');if(target)target.hidden=!shown});
  });
 }
 /* V3: listado completo de textos editables y frases especiales del módulo Aura. */
 function isTextField(src){
  if(!src||!src.id||!form.contains(src)||src.disabled)return false;
  if(src.closest("#sec-github,#sec-system,#sec-exportar,#auraFixedControls"))return false;
  return src.tagName==="TEXTAREA"||(src.tagName==="INPUT"&&["text","search","tel"].includes(src.type||"text"));
 }
 function groupOf(src){
  var label=src.closest("details.form-section")?.querySelector("summary span")?.textContent||"Otros textos";
  return label.replace(/^\s*(?:\d+|TXT)\s*/,"").trim();
 }
 function titleOf(src){
  var label=src.closest("label");if(!label)return src.getAttribute("aria-label")||src.id;
  var clone=label.cloneNode(true);clone.querySelectorAll("input,textarea,select,small,span,button").forEach(function(n){n.remove()});
  return clone.textContent.replace(/\s+/g," ").trim()||src.id;
 }
 function allTexts(){
  var a=Array.from(form.querySelectorAll("textarea[id],input[id]")).filter(isTextField).map(function(src){return{key:"normal:"+src.id,title:titleOf(src),group:groupOf(src),source:src}});
  var select=byId("auraFixedChoose");
  if(select)Array.from(select.options).forEach(function(opt){if(opt.value)a.push({key:"fixed:"+opt.value,title:opt.textContent.trim(),group:"Frases fijas de los diseños",fixed:opt.value})});
  return a;
 }
 function renderAllTexts(){
  var root=get("lu-fields");
  root.appendChild(mk("p","lu-text-intro","Selecciona el texto que quieres modificar. Aquí también encontrarás las frases especiales que añade cada diseño."));
  var search=mk("input","lu-text-search");search.id="lu-text-search";search.type="search";search.placeholder="Buscar un texto...";search.value=textSearch;search.setAttribute("aria-label","Buscar textos");
  search.addEventListener("input",function(){textSearch=search.value;renderTextList()});root.appendChild(search);
  var list=mk("div","lu-text-list");list.id="lu-text-list";root.appendChild(list);
  var edit=mk("div","lu-text-editor");edit.id="lu-text-editor";root.appendChild(edit);
  var entries=allTexts();if(!entries.some(function(x){return x.key===textSelected}))textSelected=entries[0]?.key||"";
  renderTextList();renderTextEdit();
 }
 function renderTextList(){
  var root=get("lu-text-list");if(!root)return;root.replaceChildren();
  var normalize=function(x){return String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()};
  var q=normalize(textSearch),current="";
  allTexts().filter(function(x){return normalize(x.title+" "+x.group).includes(q)}).forEach(function(item){
   if(item.group!==current){current=item.group;root.appendChild(mk("div","lu-text-group",current))}
   var b=mk("button","lu-text-row");b.type="button";b.dataset.luText=item.key;b.setAttribute("aria-pressed",String(item.key===textSelected));
   b.appendChild(mk("strong","",item.title));b.appendChild(mk("small","",item.source?(item.source.value||"Sin texto").slice(0,75):"Frase especial · elige para editar"));root.appendChild(b);
  });
  if(!root.childElementCount)root.appendChild(mk("div","lu-note","No hay resultados."));
 }
 function selectText(key,scroll){
  textSelected=key;renderTextList();renderTextEdit();if(scroll)get("lu-text-editor")?.scrollIntoView({behavior:"smooth",block:"start"});
 }
 function renderTextEdit(){
  var root=get("lu-text-editor");if(!root)return;root.replaceChildren();
  var item=allTexts().find(function(x){return x.key===textSelected});if(!item)return;
  root.appendChild(mk("div","lu-text-current","Estás editando: "+item.title));
  if(item.fixed){
   var sel=byId("auraFixedChoose");
   if(sel&&sel.value!==item.fixed){sel.value=item.fixed;sel.dispatchEvent(new Event("change",{bubbles:true}))}
   [["auraFixedText","Escribe la frase personalizada",1],["auraFixedSize","Tamaño (px)",0],["auraFixedFont","Tipografía",0],["auraFixedAlign","Alineación",0]].forEach(function(f){var c=field(f[0],f[1],f[2]);if(c)root.appendChild(c)});
   root.appendChild(mk("p","lu-text-intro","Si el campo queda vacío, se usa el texto original del diseño. Las cifras automáticas no se pueden sustituir."));
  }else{
   var fieldEl=field(item.source.id,"Escribe aquí el texto",1);if(fieldEl)root.appendChild(fieldEl);
   var size=({parentsText:"familyTextSize",godparentsText:"familyTextSize",heroLabelText:"heroLabelSize",closingSignature:"closingSignatureFont"})[item.source.id]||item.source.id+"Size";
   if(byId(size)){var sizeEl=field(size,size==="closingSignatureFont"?"Estilo de firma":"Tamaño de texto",0);if(sizeEl)root.appendChild(sizeEl)}
   if(["title","subtitle","buttonText"].includes(item.source.id)&&byId("heroAlignment")){var al=field("heroAlignment","Alineación",0);if(al)root.appendChild(al)}
  }
  var bottom=mk("div","lu-text-footer"),small=mk("small","","Los cambios se reflejan en la vista previa."),btn=mk("button","lu-btn","Restaurar texto");btn.id="lu-text-reset";btn.type="button";
  bottom.appendChild(small);bottom.appendChild(btn);root.appendChild(bottom);syncQuick();
 }
 function resetText(){
  var item=allTexts().find(function(x){return x.key===textSelected});if(!item)return;
  if(item.fixed){byId("auraFixedReset")?.click();renderTextEdit();return}
  if(textBaseline.has(item.key))sourceChange(item.source.id,textBaseline.get(item.key));
  renderTextEdit();
 }
 function syncTextList(){
  var root=get("lu-text-list");if(!root)return;
  root.querySelectorAll("[data-lu-text]").forEach(function(b){
   b.setAttribute("aria-pressed",String(b.dataset.luText===textSelected));
   var k=b.dataset.luText;if(!k.startsWith("normal:"))return;
   var field=byId(k.slice(7)),caption=b.querySelector("small");if(field&&caption)caption.textContent=(field.value||"Sin texto").slice(0,75);
  });
 }

 function setCategory(id,scroll){
  var c=CATS.find(function(x){return x.id===id});if(!c)return;state.cat=id;
  shell.querySelectorAll("[data-lu-cat]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.luCat===id))});
  get("lu-category-panel").hidden=false;get("lu-category-title").textContent=c.title;get("lu-category-desc").textContent=c.desc;
  var root=get("lu-fields");root.replaceChildren();root.classList.toggle("lu-text-root",id==="textos");
  if(id==="textos")renderAllTexts();
  else if(id==="colores")renderColors();
  else c.fields.forEach(function(f){var el=field(f[0],f[1],f[2]);if(el){el.dataset.luField=f[0];root.appendChild(el)}});
  syncQuick();updateConditional();if(scroll)get("lu-category-panel").scrollIntoView({behavior:"smooth",block:"start"});
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
  get("lu-theme-grid").querySelectorAll("[data-lu-theme]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.luTheme===byId("themeVisual")?.value))});syncSwatches();updateConditional();syncTextList();
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
  if(src&&isTextField(src)){setStep(1,false);setCategory("textos",false);selectText("normal:"+id,true);return}
  if(cat){
   setStep(1,false);setCategory(cat,false);
   var target=(copies.get(id)||[]).find(function(x){return x.kind==="control"})?.el;
   if(target){get("lu-category-panel").scrollIntoView({behavior:"smooth",block:"start"});setTimeout(function(){target.focus({preventScroll:true})},100);return}
  }
  if(src){setStep(1,false);var sec=src.closest("details.form-section");if(sec){showExtra([sec.id]);sec.open=true}if(previous)previous(id)}
 }
 if(previous)focusEditorField52=focusFromPreview;
 /* Tocar una frase fija en la vista abre el mismo editor. */
 if(typeof bindPreviewEditing52==="function"){
  var oldBinder=bindPreviewEditing52;
  bindPreviewEditing52=function(doc){
   if(doc&&doc.documentElement.dataset.luFixedV3!=="1"){
    doc.documentElement.dataset.luFixedV3="1";
    doc.defaultView?.addEventListener("click",function(e){
     if(!byId("previewEditMode")?.checked)return;
     var target=e.target.closest?.("[data-aura-fixed-key]");if(!target)return;
     e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
     setStep(1,false);setCategory("textos",false);selectText("fixed:"+target.dataset.auraFixedKey,true);
    },true);
   }
   oldBinder(doc);
  };
 }

 document.addEventListener("input",function(e){if(form.contains(e.target))queueSync()},true);
 document.addEventListener("change",function(e){if(form.contains(e.target)){queueSync();setTimeout(syncQuick,450)}},true);
 allTexts().forEach(function(x){if(x.source)textBaseline.set(x.key,x.source.value)});
 renderEvents();renderCategories();designSettings();setCategory("textos",false);
 if(byId("designCollection"))sourceChange("designCollection","all");
 var selectedPalette=byId("colorPalette");if(selectedPalette&&selectedPalette.value!=="custom")selectedPalette.dataset.lastRealPalette=selectedPalette.value;
 var themeSource=byId("theme-strip");if(themeSource&&typeof MutationObserver==="function"){new MutationObserver(renderThemes).observe(themeSource,{childList:true})}
 setStep(0,false);syncQuick();
 shell.addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b)return;
  if(b.dataset.luFilter){setCatalog(b.dataset.luFilter);return}
  if(b.dataset.luText){selectText(b.dataset.luText,true);return}
  if(b.id==="lu-text-reset"){resetText();return}
  if(b.dataset.luStep!==undefined){setStep(+b.dataset.luStep,true);return}
  if(b.dataset.luCat){setCategory(b.dataset.luCat,true);return}
  if(b.dataset.luPreset){
   if(byId("preset")?.value!==b.dataset.luPreset&&allTexts().some(function(x){return x.source&&textBaseline.has(x.key)&&x.source.value!==textBaseline.get(x.key)})){
    if(!confirm("Cambiar el evento puede actualizar algunos textos de ejemplo. Antes de continuar, ¿quieres conservar esta selección y continuar?"))return;
   }
   sourceChange("preset",b.dataset.luPreset);
   allTexts().forEach(function(x){if(x.source)textBaseline.set(x.key,x.source.value)});if(byId("designCollection"))sourceChange("designCollection",state.filter);renderThemes();return}
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
