
/* Lúmina V4: nueva interfaz de trabajo; el motor original no se modifica. */
(function(){
"use strict";
const src=id=>document.getElementById(id);
const make=(tag,cls,text)=>{const v=document.createElement(tag);if(cls)v.className=cls;if(text!==undefined)v.textContent=text;return v};
const events=[["boda","Boda","♡"],["xv","XV años","✧"],["bautizo","Bautizo","❀"],["cumple","Cumpleaños","◌"],["graduacion","Graduación","◇"],["escolar","Escolar","✦"]];
const tabs=[["datos","Información y textos","Aa","Datos y frases"],["media","Fotografías y música","▧","Fotos y canción"],["look","Apariencia","◈","Colores y fuentes"],["extras","Extras","＋","Opciones y orden"]];
const paletteFields=[["primaryColor","Botones y acentos"],["headingColor","Títulos"],["textColor","Textos"],["bgBodyColor","Fondo general"],["bgContentColor","Fondo de secciones"],["mutedColor","Textos secundarios"],["heroTextColor","Letras de portada"]];
function init(){
 const form=src("config-form"),pane=document.querySelector(".editor-pane"),template=src("lumina-v4-template");
 if(!form||!pane||!template)return;
 document.body.classList.add("lu4");
 const sections=Array.from(form.querySelectorAll("details.form-section"));
 const section3=sections.find(x=>x.querySelector("summary b")?.textContent.trim()==="03");
 if(section3&&!section3.id)section3.id="sec-apariencia";
 const app=make("div","lu4-app");app.appendChild(template.content.cloneNode(true));pane.insertBefore(app,form);
 const q=id=>app.querySelector("#"+id);
 const pages=[["design","Diseños"],["datos","Datos y textos"],["media","Fotos y música"],["look","Colores y estilo"],["extras","Extras"],["delivery","Entrega"]];
 const nav=app.querySelector(".lu4-nav");
 nav.replaceChildren();
 pages.forEach(([id,label])=>{
   const b=make("button","lu4-page",label);
   b.type="button";b.dataset.lu4Page=id;
   b.addEventListener("click",()=>openPage(id,true));
   nav.appendChild(b);
 });
 const instructions=app.querySelector("h1 + p");
 if(instructions)instructions.textContent="Abre directamente el apartado que necesites. No hay pasos obligatorios.";
 q("lu4-stage-0").querySelector(".lu4-eyebrow").textContent="DISEÑOS";
 q("lu4-stage-1").querySelector(".lu4-eyebrow").textContent="PERSONALIZAR";
 q("lu4-stage-2").querySelector(".lu4-eyebrow").textContent="ENTREGA";
 const state={step:0,tab:"datos",catalog:"all",textKey:"",search:"",edited:false,lastPalette:"",defaults:new Map()};
 const proxies=new Map();
 const groups={datos:["sec-portada","sec-evento","sec-ubicaciones","sec-familia","sec-cierre","sec-aura-fixed-copy"],media:["sec-media"],look:["sec-identidad","sec-portada","sec-apariencia","sec-movimiento"],extras:["sec-familia","sec-transferencia","sec-video","sec-orden"]};
 function register(id,thing){if(!proxies.has(id))proxies.set(id,[]);proxies.get(id).push(thing)}
 function send(id,value){
  const x=src(id);if(!x)return;
  if(x.type==="checkbox")x.checked=!!value;else x.value=value;
  if(paletteFields.some(p=>p[0]===id)&&src("colorPalette"))src("colorPalette").value="custom";
  x.dispatchEvent(new Event("input",{bubbles:true}));
  x.dispatchEvent(new Event("change",{bubbles:true}));
  state.edited=true;queueSync();
 }
 function field(id,title,wide){
  const original=src(id);if(!original)return null;
  const wrap=make("div","lu4-field"+(wide?" lu4-span":""));wrap.dataset.sourceId=id;
  const name=make("label","",title);
  if(original.type==="file"){
   wrap.appendChild(name);const upload=make("div","lu4-upload");
   const info=make("span","","Sin archivo"),button=make("button","lu4-button","Elegir archivo");
   button.type="button";button.addEventListener("click",()=>original.click());upload.appendChild(info);upload.appendChild(button);wrap.appendChild(upload);
   register(id,{kind:"file",src:original,info});return wrap;
  }
  let input;
  if(original.tagName==="SELECT")input=document.createElement("select");
  else if(original.tagName==="TEXTAREA"){input=document.createElement("textarea");input.rows=Math.min(original.rows||2,4)}
  else{input=document.createElement("input");input.type=["checkbox","datetime-local","url","color","number","range"].includes(original.type)?original.type:"text"}
  if(original.type==="checkbox"){wrap.classList.add("lu4-check");input.id="lu4-"+id;name.htmlFor=input.id;wrap.appendChild(input);wrap.appendChild(name)}
  else{name.htmlFor="lu4-"+id;input.id="lu4-"+id;wrap.appendChild(name);wrap.appendChild(input)}
  if(original.placeholder)input.placeholder=original.placeholder;
  if(original.min)input.min=original.min;if(original.max)input.max=original.max;if(original.step)input.step=original.step;
  input.disabled=original.disabled;
  input.addEventListener("input",()=>send(id,input.type==="checkbox"?input.checked:input.value));
  input.addEventListener("change",()=>send(id,input.type==="checkbox"?input.checked:input.value));
  register(id,{kind:"value",src:original,input});return wrap;
 }
 function fields(parent,items){items.forEach(([id,label,wide])=>{const x=field(id,label,wide);if(x)parent.appendChild(x)})}
 function syncInputs(){
  proxies.forEach(entries=>entries.forEach(x=>{
   if(x.kind==="file"){if(x.info.isConnected){const all=Array.from(x.src.files||[]);x.info.textContent=all.length===1?all[0].name:all.length?all.length+" archivos seleccionados":"Sin archivo"}return}
   const input=x.input,orig=x.src;if(!input.isConnected)return;
   if(input.tagName==="SELECT"){if(input.innerHTML!==orig.innerHTML)input.innerHTML=orig.innerHTML;if(input.value!==orig.value)input.value=orig.value}
   else if(input.type==="checkbox")input.checked=orig.checked;
   else if(document.activeElement!==input&&input.value!==orig.value)input.value=orig.value;
   input.disabled=orig.disabled;
  }));
  q("lu4-events").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.event===src("preset")?.value)));
  q("lu4-themes").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.theme===src("themeVisual")?.value)));
  const pal=src("colorPalette")?.value;
  if(pal&&pal!=="custom")state.lastPalette=pal;
  q("lu4-palettes").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.palette===pal)));
  const coverName=String(src("title")?.value||"Una celebración").replace(/\n/g," ").slice(0,26);
  q("lu4-palettes").querySelectorAll(".lu4-palette-mock strong").forEach(e=>{if(e.textContent!==coverName)e.textContent=coverName});
  q("lu4-themes").querySelectorAll(".lu4-theme-fallback strong").forEach(e=>{if(e.textContent!==coverName)e.textContent=coverName});
  q("lu4-text-list").querySelectorAll("[data-text]").forEach(b=>{
   b.setAttribute("aria-pressed",String(b.dataset.text===state.textKey));
   if(b.dataset.text.startsWith("field:")){
    const original=src(b.dataset.text.slice(6)),description=b.querySelector("small");
    if(original&&description)description.textContent=String(original.value||"Sin texto").slice(0,85);
   }
  });
  const visibility=[["showCeremony",["ceremonyUrl"]],["showReception",["receptionUrl"]],["showTransfer",["transferText","transferNumber"]]];
  visibility.forEach(([flag,ids])=>ids.forEach(id=>{
   const node=app.querySelector('[data-source-id="'+id+'"]');
   if(node)node.hidden=!src(flag)?.checked;
  }));
 }
 let t;function queueSync(){clearTimeout(t);t=setTimeout(syncInputs,60)}
 function renderEvents(){
  events.forEach(([id,name,icon])=>{
   const b=make("button","lu4-event");b.type="button";b.dataset.event=id;
   b.appendChild(make("span","",icon));b.appendChild(document.createTextNode(name));
   b.addEventListener("click",()=>{
    if(src("preset")?.value===id)return;
    const modified=allTextFields().some(x=>x.original&&state.defaults.has(x.key)&&x.original.value!==state.defaults.get(x.key));
    if(modified&&!confirm("Cambiar de celebración puede actualizar algunos textos de ejemplo. ¿Continuar?"))return;
    send("preset",id);
    allTextFields().forEach(x=>{if(x.original)state.defaults.set(x.key,x.original.value)});
    setFilter(state.catalog);syncInputs();
   });q("lu4-events").appendChild(b);
  });
 }
 function setFilter(mode){
  state.catalog=mode==="event"?"event":"all";
  const original=src("designCollection");if(original){original.value=state.catalog;original.dispatchEvent(new Event("change",{bubbles:true}))}
  if(typeof renderThemeStrip==="function")renderThemeStrip();
  if(typeof renderPaletteStrip==="function")renderPaletteStrip();
  renderPalettes();
  q("lu4-filter").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lu4Filter===state.catalog)));
  renderThemes();
 }
 function safeGradient(value){
  const s=String(value||"");
  return /^linear-gradient\([#a-zA-Z0-9(),.%\s+-]+\)$/.test(s)?s:"linear-gradient(135deg,#bd9aaf,#f5eee7)";
 }
 function renderThemes(){
  const original=src("theme-strip"),root=q("lu4-themes");if(!root||!original)return;
  root.replaceChildren();
  const all=Array.from(original.querySelectorAll("button.theme-chip"));
  all.forEach(nativeButton=>{
   const id=nativeButton.dataset.theme;if(!id)return;
   let theme=null;try{theme=typeof THEMES!=="undefined"?THEMES[id]:null}catch(_){}
   const name=theme?.label||nativeButton.textContent.trim()||id;
   const b=make("button","lu4-theme");b.type="button";b.dataset.theme=id;b.setAttribute("aria-pressed",String(id===src("themeVisual")?.value));
   const frame=make("div","lu4-theme-image"),image=nativeButton.querySelector("img");
   if(image){
    const img=document.createElement("img");img.src=image.getAttribute("src");img.alt="Muestra visual del diseño "+name;img.loading="lazy";frame.appendChild(img);
   }else{
    const sample=make("div","lu4-theme-fallback");
    sample.style.background=safeGradient(theme?.swatch);sample.style.color="#332831";
    sample.appendChild(make("small","","INVITACIÓN DIGITAL"));sample.appendChild(make("strong","",String(src("title")?.value||"Una celebración").replace(/\n/g," ").slice(0,26)));sample.appendChild(make("em","","Una celebración especial"));frame.appendChild(sample);
   }
   b.appendChild(frame);b.appendChild(make("div","lu4-theme-caption",name));b.appendChild(make("div","lu4-theme-sub","Toca para verlo en el teléfono"));
   b.addEventListener("click",()=>{
    const real=Array.from(original.querySelectorAll("button.theme-chip")).find(x=>x.dataset.theme===id);
    if(real)real.click();else send("themeVisual",id);
    state.edited=true;syncInputs();
   });root.appendChild(b);
  });
  q("lu4-theme-notice").textContent=all.length?all.length+" diseños disponibles. La vista del teléfono muestra el resultado real del modelo.":"Cargando catálogo…";
 }
 function refreshNavigation(){
  const selected=state.step===0?"design":state.step===2?"delivery":state.tab;
  nav.querySelectorAll("[data-lu4-page]").forEach(b=>{
   if(b.dataset.lu4Page===selected)b.setAttribute("aria-current","page");
   else b.removeAttribute("aria-current");
  });
 }
 function openPage(id,scroll=true){
  if(id==="design")showStage(0,false);
  else if(id==="delivery")showStage(2,false);
  else{
   showStage(1,false);
   selectPanel(id,false);
  }
  refreshNavigation();
  if(scroll)nav.scrollIntoView({behavior:"smooth",block:"start"});
 }
 function showStage(n,scroll=true){
  state.step=Math.max(0,Math.min(2,n));
  [0,1,2].forEach(i=>q("lu4-stage-"+i).hidden=i!==state.step);
  app.querySelectorAll("[data-lu4-stage]").forEach(b=>{if(Number(b.dataset.lu4Stage)===state.step)b.setAttribute("aria-current","step");else b.removeAttribute("aria-current")});
  q("lu4-prev").disabled=state.step===0;
  q("lu4-next").textContent=state.step===2?"Ver invitación ↗":"Continuar →";
  q("lu4-advanced").hidden=state.step===2;
  hideAdvanced();
  if(state.step===0)renderThemes();
  refreshNavigation();
  if(scroll)nav.scrollIntoView({behavior:"smooth",block:"start"});
 }
 function makeTabs(){
  tabs.forEach(([id,title,icon,note])=>{
   const b=make("button","lu4-tab");b.type="button";b.dataset.panel=id;
   const ico=make("span","lu4-tab-icon",icon),words=make("span"),heading=make("strong","",title),small=make("small","",note);
   words.appendChild(heading);words.appendChild(small);b.appendChild(ico);b.appendChild(words);
   b.addEventListener("click",()=>selectPanel(id,true));q("lu4-tabs").appendChild(b);
  });
 }
 function selectPanel(id,scroll){
  state.tab=id;
  tabs.forEach(([key])=>q("lu4-panel-"+key).hidden=key!==id);
  q("lu4-tabs").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.panel===id)));
  hideAdvanced();
  refreshNavigation();
  if(scroll)nav.scrollIntoView({behavior:"smooth",block:"start"});
 }
 function isTextField(input){
  if(!input||!input.id||input.disabled||!form.contains(input)||input.closest("#sec-github,#sec-system,#sec-exportar,#auraFixedControls"))return false;
  return input.tagName==="TEXTAREA"||(input.tagName==="INPUT"&&["text","search","tel"].includes(input.type||"text"));
 }
 function allTextFields(){
  const standard=Array.from(form.querySelectorAll("input[id],textarea[id]")).filter(isTextField).map(s=>{
   const label=s.closest("label"),clone=label?.cloneNode(true);
   if(clone)clone.querySelectorAll("input,select,textarea,small,span,button").forEach(n=>n.remove());
   const title=clone?.textContent.replace(/\s+/g," ").trim()||s.getAttribute("aria-label")||s.id;
   const group=(s.closest("details.form-section")?.querySelector("summary span")?.textContent||"Otros textos").replace(/^\s*(?:\d+|TXT)\s*/,"").trim();
   return{key:"field:"+s.id,id:s.id,title,group,original:s};
  });
  const select=src("auraFixedChoose");
  if(select)Array.from(select.options).forEach(opt=>{if(opt.value)standard.push({key:"fixed:"+opt.value,id:opt.value,title:opt.textContent.trim(),group:"Frases especiales del diseño",fixed:true})});
  return standard;
 }
 function renderTextList(){
  const root=q("lu4-text-list"),needle=state.search.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  root.replaceChildren();let last="",count=0;
  allTextFields().filter(it=>(it.title+" "+it.group).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(needle)).forEach(it=>{
   if(it.group!==last){last=it.group;root.appendChild(make("div","lu4-text-group",it.group))}
   const b=make("button","lu4-text-row");b.type="button";b.dataset.text=it.key;
   b.setAttribute("aria-pressed",String(it.key===state.textKey));
   b.appendChild(make("strong","",it.title));b.appendChild(make("small","",it.original?String(it.original.value||"Sin texto").slice(0,80):"Frase especial · Selecciona para editar"));
   b.addEventListener("click",()=>selectText(it.key,true));root.appendChild(b);count++;
  });
  if(!count)root.appendChild(make("div","lu4-note","No encontré textos con ese nombre."));
 }
 function selectText(key,scroll=false){
  state.textKey=key;renderTextList();
  const area=q("lu4-text-detail");area.replaceChildren();
  const it=allTextFields().find(x=>x.key===key);
  if(!it){area.hidden=true;return}
  area.hidden=false;area.appendChild(make("div","lu4-card-title","Editando: "+it.title));
  if(it.fixed){
   const select=src("auraFixedChoose");
   if(select){select.value=it.id;select.dispatchEvent(new Event("change",{bubbles:true}))}
   fields(area,[["auraFixedText","Escribe la frase",true],["auraFixedSize","Tamaño"],["auraFixedFont","Tipografía"],["auraFixedAlign","Alineación"]]);
   area.appendChild(make("p","lu4-note","Deja la frase vacía para conservar el original. Los valores automáticos no se pueden sustituir."));
  }else{
   fields(area,[[it.id,"Escribe aquí el texto",true]]);
   const mapped={parentsText:"familyTextSize",godparentsText:"familyTextSize",heroLabelText:"heroLabelSize"};
   const sz=mapped[it.id]||it.id+"Size";
   if(src(sz))fields(area,[[sz,"Tamaño del texto"]]);
   if(["title","subtitle","buttonText"].includes(it.id))fields(area,[["heroAlignment","Alineación"]]);
  }
  const reset=make("button","lu4-button","Restaurar texto original");reset.type="button";
  reset.addEventListener("click",()=>{
   if(it.fixed){src("auraFixedReset")?.click();selectText(key,false);return}
   if(state.defaults.has(key))send(it.id,state.defaults.get(key));
   selectText(key,false);
  });area.appendChild(reset);
  syncInputs();
  if(scroll)area.scrollIntoView({behavior:"smooth",block:"start"});
 }
 function setupData(){
  fields(q("lu4-event-fields"),[
   ["eventDate","Fecha y hora del evento",true],["showCeremony","Mostrar ceremonia"],["showReception","Mostrar recepción"],
   ["ceremonyUrl","Google Maps de la ceremonia",true],["receptionUrl","Google Maps de la recepción",true],
   ["whatsappNumber","Número para confirmaciones por WhatsApp",true]
  ]);
  q("lu4-text-search").addEventListener("input",e=>{state.search=e.target.value;renderTextList()});
  const all=allTextFields();all.forEach(it=>{if(it.original)state.defaults.set(it.key,it.original.value)});
  if(all[0])selectText(all[0].key,false);
 }
 function setupMedia(){
  fields(q("lu4-media-files"),[
   ["portadaFile","Foto de portada",true],["galleryFiles","Galería de fotografías",true],["bannerFile","Banner principal"],["bannerExtraFile","Banner adicional"]
  ]);
  fields(q("lu4-media-music"),[
   ["musicFile","Canción",true],["musicTitle","Título de canción"],["musicArtist","Artista"],["musicPlacement","Ubicación del reproductor",true]
  ]);
  fields(q("lu4-media-more"),[["bgFile","Imagen de fondo",true],["galleryStyle","Acomodo de la galería"],["bannerMode","Formato del banner"]]);
 }
 function paletteData(k){
  try{if(typeof PALETTES!=="undefined"&&Array.isArray(PALETTES[k]))return PALETTES[k]}catch(_){}
  return["#ab8c9f","#524250","#725b6b","#978994","#eee5eb","#faf9fb"];
 }
 function renderPalettes(){
  const root=q("lu4-palettes"),base=src("palette-strip");if(!root||!base)return;
  root.replaceChildren();
  Array.from(base.querySelectorAll("button.palette-chip")).forEach(real=>{
   const key=real.dataset.palette;if(!key)return;
   const c=paletteData(key),label=real.querySelector(".palette-name")?.textContent.trim()||key.replace(/_/g," ");
   const b=make("button","lu4-palette");b.type="button";b.dataset.palette=key;
   const mock=make("div","lu4-palette-mock");mock.style.background=c[5]||"#fff";mock.style.color=c[2]||"#3d3040";
   mock.appendChild(make("small","","UN MOMENTO ESPECIAL"));mock.appendChild(make("strong","",String(src("title")?.value||"Una celebración").replace(/\n/g," ").slice(0,26)));mock.appendChild(make("em","","Una celebración inolvidable"));
   b.appendChild(mock);
   const colors=make("div","lu4-palette-swatch");[c[4],c[5],c[0],c[2]].forEach(hex=>{const sw=make("span");sw.style.background=hex||"#eee";colors.appendChild(sw)});
   b.appendChild(colors);b.appendChild(make("div","lu4-palette-name",label));
   b.addEventListener("click",()=>{
    const realNow=Array.from(base.querySelectorAll("button.palette-chip")).find(x=>x.dataset.palette===key);
    if(realNow)realNow.click();else send("colorPalette",key);
    state.lastPalette=key;state.edited=true;syncInputs();
   });root.appendChild(b);
  });
  syncInputs();
 }
 function setupLook(){
  fields(q("lu4-color-fields"),paletteFields);
  fields(q("lu4-appearance-fields"),[["fontPreset","Tipografía general"],["heroLayout","Diseño de portada",true]]);
  fields(q("lu4-appearance-more"),[["motionPreset","Movimiento"],["motionIntensity","Intensidad"],["heroAlignment","Alineación de portada"],["titleSize","Tamaño del título"]]);
  q("lu4-reset-colors").addEventListener("click",()=>{
   const selected=state.lastPalette||src("colorPalette")?.value;
   const matching=Array.from(q("lu4-palettes").querySelectorAll("button")).find(b=>b.dataset.palette===selected);
   if(matching)matching.click();
  });
  renderPalettes();
 }
 function setupExtras(){
  fields(q("lu4-extra-fields"),[["showFamily","Mostrar familia"],["showTransfer","Mostrar regalos"],["transferText","Mensaje del regalo",true],["transferNumber","Cuenta o CLABE",true],["videoUrl","Enlace del video",true]]);
  fields(q("lu4-order"),[
   ["orderLocations","Ubicaciones"],["orderFamily","Familia"],["orderConfirm","Confirmación"],["orderCountdown","Cuenta regresiva"],["orderGallery","Galería"],["orderMusic","Música"],["orderBannerExtra","Banner"],["orderMessage","Mensaje final"],["orderVideo","Video"],["orderTransfer","Regalo"]
  ]);
 }
 function hideAdvanced(){
  document.body.classList.remove("lu4-advanced");
  sections.forEach(d=>{d.classList.remove("editor-filtered");d.classList.add("lu4-hidden-original");d.open=false});
 }
 function showAdvanced(ids){
  document.body.classList.add("lu4-advanced");
  sections.forEach(d=>{const on=ids.includes(d.id)&&d.id!=="sec-system";d.classList.toggle("lu4-hidden-original",!on);d.classList.remove("editor-filtered");d.open=on});
  form.scrollIntoView({behavior:"smooth",block:"start"});
 }
 function activeAdvanced(){
  if(state.step===0)return["sec-identidad","sec-portada"];
  return groups[state.tab]||[];
 }
 function save(){
  try{
   const data=configObject(getFormParams()),blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
   const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="lumina-datos.json";
   link.hidden=true;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1300);
   q("lu4-status").textContent="Datos guardados. Para volver a abrir la invitación necesitarás seleccionar nuevamente las fotografías y música.";
  }catch(e){q("lu4-status").textContent="No se pudo guardar: "+(e.message||"error desconocido")}
 }
 // Protección de los repositorios principales, incluso entrando al publicador avanzado.
 document.addEventListener("click",e=>{
  if(!e.target.closest("#githubPublish"))return;
  const name=String(src("githubRepo")?.value||"").trim().toLowerCase();
  if(!name||name==="auraplataforma5.5"||name==="auradigitaljal.github.io"||name.endsWith("/auraplataforma5.5")||name.endsWith("/auradigitaljal.github.io")){
   e.preventDefault();e.stopImmediatePropagation();alert("No se permite publicar desde estas pruebas sobre los repositorios oficiales de Aura. Utiliza uno independiente.");
  }
 },true);
 // Tocar texto del teléfono abre la lista unificada.
 const oldFocus=typeof focusEditorField52==="function"?focusEditorField52:null;
 if(oldFocus)focusEditorField52=function(id){
  const original=src(id);
  if(original&&isTextField(original)){showStage(1,false);selectPanel("datos",false);selectText("field:"+id,true);return}
  if(original){showStage(1,false);showAdvanced([original.closest("details.form-section")?.id]);oldFocus(id)}
 };
 // Las frases automáticas tienen un listener propio: capturarlas antes que el editor antiguo.
 if(typeof bindPreviewEditing52==="function"){
  const old=bindPreviewEditing52;
  bindPreviewEditing52=function(doc){
   if(doc&&doc.documentElement.dataset.lu4Capture!=="1"){
    doc.documentElement.dataset.lu4Capture="1";
    doc.defaultView?.addEventListener("click",e=>{
     if(!src("previewEditMode")?.checked)return;
     const item=e.target.closest?.("[data-aura-fixed-key]");if(!item)return;
     e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
     showStage(1,false);selectPanel("datos",false);selectText("fixed:"+item.dataset.auraFixedKey,true);
    },true);
   }
   old(doc);
  };
 }
 makeTabs();renderEvents();setupData();setupMedia();setupLook();setupExtras();
 setFilter("all");selectPanel("datos",false);showStage(0,false);syncInputs();
 q("lu4-filter").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>setFilter(b.dataset.lu4Filter)));
 app.querySelectorAll("[data-lu4-stage]").forEach(b=>b.addEventListener("click",()=>showStage(Number(b.dataset.lu4Stage),true)));
 q("lu4-prev").addEventListener("click",()=>showStage(state.step-1,true));
 q("lu4-next").addEventListener("click",()=>state.step===2?src("open-preview-window")?.click():showStage(state.step+1,true));
 q("lu4-full-preview").addEventListener("click",()=>src("open-preview-window")?.click());
 q("lu4-export").addEventListener("click",()=>src("generate-zip")?.click());
 q("lu4-save").addEventListener("click",save);q("lu4-load").addEventListener("click",()=>src("localConfig")?.click());
 q("lu4-manual-publish").addEventListener("click",()=>showAdvanced(["sec-github"]));
 q("lu4-advanced-open").addEventListener("click",()=>showAdvanced(activeAdvanced()));
 q("lu4-advanced-close").addEventListener("click",()=>{hideAdvanced();app.querySelector(".lu4-nav").scrollIntoView({behavior:"smooth",block:"start"})});
 src("open-preview-window").textContent="Ver invitación ↗";
 form.addEventListener("input",()=>queueSync(),true);
 form.addEventListener("change",()=>{queueSync();setTimeout(syncInputs,250)},true);
 const nativeThemes=src("theme-strip"),nativePalettes=src("palette-strip");
 if(nativeThemes&&typeof MutationObserver==="function")new MutationObserver(renderThemes).observe(nativeThemes,{childList:true});
 if(nativePalettes&&typeof MutationObserver==="function")new MutationObserver(renderPalettes).observe(nativePalettes,{childList:true});
 src("localConfig")?.addEventListener("change",()=>setTimeout(()=>{renderThemes();renderPalettes();renderTextList();syncInputs()},550));
 const mobile=make("button","lu4-preview-jump","Ver invitación ↗");mobile.type="button";mobile.addEventListener("click",()=>document.querySelector(".preview-pane")?.scrollIntoView({behavior:"smooth",block:"start"}));document.body.appendChild(mobile);
 const back=make("button","lu4-return","← Volver a editar");back.type="button";back.addEventListener("click",()=>pane.scrollIntoView({behavior:"smooth",block:"start"}));document.querySelector(".preview-pane")?.appendChild(back);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
