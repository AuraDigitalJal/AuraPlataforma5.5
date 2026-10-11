/* Aura Digital · Bautizo en capas · PRUEBAS. No afecta otros diseños. */
(function(){
'use strict';
const KEY='baptism_layers';
THEMES[KEY]={label:'Bautizo · Capas interactivas',palette:'baptism_beige',swatch:'linear-gradient(135deg,#faf8f3 0%,#e7d9c8 47%,#b9cdda 100%)',display:"'Cormorant Garamond',serif",body:"'Manrope',sans-serif",radius:'20px',hero:'soft',ornament:'line',section:'airy'};
PALETTES.baptism_beige=['#b49c84','#46423e','#54493f','#89817b','#e8ddd0','#fcfaf6'];
PALETTES.baptism_rose=['#bd919d','#4a3e42','#765963','#9e858a','#f1e3e5','#fdf8f8'];
PALETTE_LABELS.baptism_beige='Bautizo · Beige cálido';
PALETTE_LABELS.baptism_rose='Bautizo · Rosa empolvado';
if(COLLECTIONS.bautizo){
 const col=COLLECTIONS.bautizo;
 if(!col.themes.includes(KEY))col.themes.push(KEY);
 for(const key of ['baptism_beige','baptism_rose'])if(!col.palettes.includes(key))col.palettes.push(key);
}
const safe=s=>esc(String(s??''));
const icon=(name)=>{
 const shapes={
 date:'<rect x="4.5" y="6.7" width="15" height="13" rx="1.2"/><path d="M7.8 4.2v4.8M16.2 4.2v4.8M4.5 10.3h15M8 14h2M13 14h2M8 17h2"/>',
 ceremony:'<path d="M4 20h16M6.5 20V10.5L12 6.5l5.5 4V20M10 20v-5.8h4V20M12 2.7v4.1M9.5 4.6h5M9.2 11.7h5.6"/>',
 reception:'<path d="M4 4.5h7l-1 6.5a2.7 2.7 0 0 1-5.2 0L4 4.5ZM7.5 13.5v6M4.7 20h5.6M13 4.5h7l-1 6.5a2.7 2.7 0 0 1-5.2 0L13 4.5ZM16.5 13.5v6M13.7 20h5.6"/>',
 confirm:'<path d="M12 20s-7-4.6-8.4-8.8C2.2 7 7.3 4 12 8.1 16.7 4 21.8 7 20.4 11.2 19 15.4 12 20Z"/><path d="m8.8 12 2.1 2.1 4.4-4.3"/>'
 };
 return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shapes[name]+'</svg>';
};
const toMenu='<span aria-hidden="true">‹</span><span>Menú</span>';
function back(target,label){return '<button class="bl-back" type="button" data-bl-go="'+target+'"><span aria-hidden="true">‹</span><span>'+label+'</span></button>';}
function go(label,key,symbol,sub){return '<button class="bl-menu-row" type="button" data-bl-go="'+key+'"><span class="bl-icon">'+icon(symbol)+'</span><span class="bl-row-copy"><strong>'+label+'</strong><small>'+sub+'</small></span><span class="bl-row-arrow" aria-hidden="true">›</span></button>';}

function shell(id,caption,title,body,footer,editable){
 const edit=editable||{};
 const mark=(key)=>key?' data-edit="'+key+'"':'';
 return '<section class="bl-screen" data-bl-screen="'+id+'" hidden aria-label="'+safe(title)+'"><div class="bl-inner">'+back('menu','Menú')+'<div class="bl-panel"><span class="bl-kicker"'+mark(edit.kicker)+'>'+safe(caption)+'</span><h1 class="bl-heading"'+mark(edit.title)+'>'+safe(title)+'</h1>'+body+'</div><div class="bl-screen-footer"'+mark(edit.footer)+'>'+safe(footer??'UN MOMENTO PARA RECORDAR')+' <span aria-hidden="true">✦</span></div></div></section>';
}
function dateContent(p){
 const d=eventDateParts(p.eventDate);
 if(!d)return '<div class="bl-empty">Agrega la fecha del evento desde el editor para mostrarla aquí.</div>';
 // El valor "auto" conserva la fecha editorial de esta plantilla;
 // las variantes utilizan el mismo componente y CSS que el resto de Aura.
 const kind=String(p.dateCardStyle||'auto');
 const calendar=kind==='none'?'':kind==='auto'?
  '<div class="bl-date-area"><div class="bl-date-ornament" aria-hidden="true">✧</div><div class="bl-date-main" data-bl-day-visual="1"'+sizeAttr(p.dateTextSize,'dateDay')+'>'+safe(d.day)+'</div><div class="bl-date-month">'+safe(d.month)+' · '+safe(d.year)+'</div><div class="bl-date-weekday">'+safe(d.weekday)+' · '+safe(d.time)+'</div></div>':
  '<div class="bl-date-native">'+auraDateLockupHtml(p,d).replace('<strong class="aura-date-day"','<strong class="aura-date-day" data-bl-day-visual="1"')+'</div>';
 return calendar+'<p class="bl-date-label" data-edit="countdownLabel"'+sizeAttr(p.countdownLabelSize,'sectionTitle')+'>'+safe(p.countdownLabel||'Falta para nuestro gran día')+'</p><div class="countdown bl-countdown '+countdownStyleClass(p)+'" data-date="'+safe(p.eventDate)+'"><div class="count-item"><b data-d'+sizeAttr(p.countdownNumbersSize,'countNumber')+'>00</b><span>Días</span></div><div class="count-item"><b data-h'+sizeAttr(p.countdownNumbersSize,'countNumber')+'>00</b><span>Horas</span></div><div class="count-item"><b data-m'+sizeAttr(p.countdownNumbersSize,'countNumber')+'>00</b><span>Min</span></div><div class="count-item"><b data-s'+sizeAttr(p.countdownNumbersSize,'countNumber')+'>00</b><span>Seg</span></div></div>';
}
function menuDate(p){
 const d=eventDateParts(p.eventDate);
 return d?d.day+' de '+d.month.toLowerCase()+' de '+d.year:'Fecha por definir';
}
function menuPlace(p,type){
 const isCer=type==='ceremony',raw=isCer?p.ceremonyText:p.receptionText;
 const explicit=String((isCer?p.blCeremonyAddress:p.blReceptionAddress)||'').trim();
 const segments=String(raw||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 const first=splitPlace(segments[0]||'');
 const address=explicit||segments.slice(1).join(' · ');
 // No inventar direcciones: mostrar el nombre del lugar hasta que se configure la dirección.
 return address||first.name||'Ubicación por definir';
}
function locationContent(p,type){
 const isCer=type==='ceremony',text=isCer?p.ceremonyText:p.receptionText,url=isCer?p.ceremonyUrl:p.receptionUrl,coords=isCer?p.ceremonyCoords:p.receptionCoords;
 const enabled=isCer?p.showCeremony:p.showReception;
 if(!enabled||!String(text||'').trim())return '<p class="bl-empty">Activa y completa los datos de esta ubicación en el editor.</p>';
 const place=splitPlace(text),external=safeMapLink(url),embed=mapEmbedUrl(url,coords),mode=p.mapDisplayMode||'toggle';
 let maps='';
 if(mode!=='hidden'&&embed){
   maps='<div class="bl-map-box"'+(mode==='visible'?'':' hidden')+'><iframe title="Mapa de '+safe(place.name)+'" '+(mode==='visible'?'src':'data-src')+'="'+safe(embed)+'" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>';
 }
 const control=mode==='toggle'&&embed?'<button class="bl-map-toggle" type="button" aria-expanded="false">Ver mapa <span aria-hidden="true">＋</span></button>':'';
 const mapsLink=external?'<a class="bl-map-external" href="'+safe(external)+'" target="_blank" rel="noopener">Abrir ubicación en Google Maps <span aria-hidden="true">↗</span></a>':'';
 return '<div class="bl-place"><span class="bl-place-symbol">'+icon(isCer?'ceremony':'reception')+'</span><div class="bl-place-type">'+safe(place.kind)+'</div><h2 data-edit="'+(isCer?'ceremonyText':'receptionText')+'">'+safe(place.name||text)+'</h2><div class="bl-rule"></div><p>Nos encantará compartir este momento contigo.</p>'+control+maps+mapsLink+'</div>';
}
function confirmContent(p){
 const n=String(p.whatsappNumber||'').replace(/\D/g,'');
 const link=n?'<a class="bl-confirm-cta" href="https://wa.me/'+encodeURIComponent(n)+'?text='+encodeURIComponent(p.whatsappMessage||'Hola, confirmo mi asistencia.')+'" target="_blank" rel="noopener">Confirmar por WhatsApp <span aria-hidden="true">↗</span></a>':'<p class="bl-empty">Agrega el número de WhatsApp en el editor para activar la confirmación.</p>';
 return '<div class="bl-confirm-body"><div class="bl-confirm-symbol">'+icon('confirm')+'</div><h2>¿Nos acompañas?</h2><p>Tu presencia hará este momento aún más especial. Confirma tu asistencia para ayudarnos a preparar cada detalle.</p>'+link+'</div>';
}
function galleryContent(p,a){
 if(!a.gallery?.length)return '<div class="bl-empty">Selecciona fotografías en el apartado de galería del editor.</div>';
 const g={...p,orderLocations:0,orderFamily:0,orderConfirm:0,orderCountdown:0,orderGallery:1,orderMusic:0,orderBannerExtra:0,orderBannerExtra2:0,orderMessage:0,orderVideo:0,orderTransfer:0};
 return '<div class="bl-gallery-native">'+buildSections(g,a)+'</div>';
}
function layersMarkup(p,a){
 const buttons=go('Fecha','date','date',safe(menuDate(p)))+go('Ceremonia','ceremony','ceremony',safe(menuPlace(p,'ceremony')))+go('Recepción','reception','reception',safe(menuPlace(p,'reception')))+go('Confirmar asistencia','confirm','confirm','Te esperamos');
 const cover='<header class="hero bl-cover" data-bl-cover><div class="bl-cover-image"></div><div class="bl-cover-shade"></div><div class="bl-cover-controls"><button class="enter-btn bl-enter" type="button" data-bl-go="menu"'+sizeAttr(p.buttonTextSize,'button')+'>'+safe(p.buttonText||'Entrar')+'</button></div></header>';
 const menu='<section class="bl-screen bl-menu" data-bl-screen="menu" hidden><div class="bl-inner">'+back('cover','Portada')+'<div class="bl-panel"><div class="bl-menu-top"><span class="bl-top-rule"></span><span class="bl-menu-title">DETALLES</span><span class="bl-top-heart" aria-hidden="true">♡</span></div><div class="bl-rows">'+buttons+'</div><button type="button" class="bl-gallery-button" data-bl-go="gallery">Ver galería <span aria-hidden="true">↗</span></button></div><div class="bl-screen-footer">CON CARIÑO, PARA TI <span aria-hidden="true">✦</span></div></div></section>';
 const gallery='<section class="bl-screen bl-gallery-screen" data-bl-screen="gallery" hidden><div class="bl-gallery-head">'+back('menu','Menú')+'<span class="bl-gallery-heading">NUESTROS RECUERDOS</span></div>'+galleryContent(p,a)+'</section>';
 const stage='<main class="page bl-stage" data-bl-stage hidden>'+menu+shell('date',p.blDateKicker??'CUENTA REGRESIVA',p.blDateTitle??'Nuestra fecha',dateContent(p),p.blDateFooter??'UN MOMENTO PARA RECORDAR',{kicker:'blDateKicker',title:'blDateTitle',footer:'blDateFooter'})+shell('ceremony','CEREMONIA','Dónde será',locationContent(p,'ceremony'))+shell('reception','RECEPCIÓN','Nos vemos aquí',locationContent(p,'reception'))+shell('confirm','CONFIRMACIÓN','Te esperamos',confirmContent(p))+gallery+(a.music?'<button class="bl-audio" type="button" aria-label="Reproducir música" aria-pressed="false">♪</button>':'')+'</main>';
 return {cover,stage};
}
function layerCss(p,a){
 const base=rgba(p.bgContentColor||'#ffffff',bounded(p.contentBgOpacity,.94,0,1));
 const accent=rgba(p.primaryColor||'#b49c84',.42);
 const img=a.cover?'url('+JSON.stringify(a.cover)+')':'linear-gradient(160deg,var(--bg),var(--card))';
 const vertical={start:'flex-start',center:'center',end:'flex-end'}[p.heroPosition]||'flex-end';
 const horizontal={start:'flex-start',center:'center',end:'flex-end'}[p.heroBlockPosition]||'center';
 const offset=bounded(p.heroOffset,0,-200,200);
 // La cifra siempre se deriva del evento; estos ajustes son exclusivamente visuales.
 const dayFonts={manrope:"'Manrope',sans-serif",cormorant:"'Cormorant Garamond',serif",georgia:"Georgia,serif",system:"system-ui,sans-serif"};
 const dayFont=dayFonts[p.blDayFont]||dayFonts.manrope;
 const dayWeight=['300','400','500','600','700'].includes(String(p.blDayWeight))?String(p.blDayWeight):'400';
 const daySize=p.blDaySize!==''&&p.blDaySize!=null?bounded(p.blDaySize,0,48,160):0;
 const dayTracking=p.blDayTracking!==''&&p.blDayTracking!=null?bounded(p.blDayTracking,0,-8,8):null;
 const dayColor=p.blDayColorMode==='custom'&&/^#[0-9a-f]{6}$/i.test(p.blDayColor||'')?p.blDayColor:'var(--heading)';
 const dayVisualCss='font-family:'+dayFont+'!important;font-weight:'+dayWeight+'!important;color:'+dayColor+'!important;'+(daySize?'font-size:'+daySize+'px!important;':'')+(dayTracking!==null?'letter-spacing:'+dayTracking+'px!important;':'');
 return [
 '/* Bautizo en capas: aislado bajo .theme-baptism_layers */',
 'body.theme-baptism_layers{overflow:hidden!important;height:100dvh!important}',
 'body.theme-baptism_layers .bl-cover,body.theme-baptism_layers .bl-stage{position:fixed!important;inset:0!important;width:100%!important;height:100vh!important;height:100dvh!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}',
 'body.theme-baptism_layers .bl-cover{z-index:4!important;display:flex!important;flex-direction:column!important;align-items:'+horizontal+'!important;justify-content:'+vertical+'!important;background:var(--bg)!important;isolation:isolate}',
 'body.theme-baptism_layers .bl-cover[hidden],body.theme-baptism_layers .bl-stage[hidden],body.theme-baptism_layers .bl-screen[hidden]{display:none!important}',
 'body.theme-baptism_layers .bl-cover-image{position:absolute;inset:0;background-image:'+img+';background-position:center;background-size:cover;background-repeat:no-repeat;z-index:-2}',
 'body.theme-baptism_layers .bl-cover-shade{position:absolute;inset:0;z-index:-1;background:transparent!important;pointer-events:none}',
 'body.theme-baptism_layers .bl-cover-controls{position:relative;z-index:2;margin:clamp(28px,8vh,76px) 7%!important;transform:translateY('+offset+'px);width:auto!important;max-width:86%;padding:0!important;display:flex;justify-content:center}',
 'body.theme-baptism_layers .bl-enter{position:relative;min-width:116px;max-width:100%;width:max-content!important;margin:0!important;cursor:pointer}',
 'body.theme-baptism_layers .bl-stage{z-index:5!important;display:block!important;max-width:none!important;background:transparent!important}',
 'body.theme-baptism_layers .bl-screen{position:absolute!important;inset:0!important;overflow-y:auto!important;overscroll-behavior:contain;background:transparent!important;scrollbar-width:thin}',
 'body.theme-baptism_layers .bl-screen::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:'+base+';backdrop-filter:blur('+({'light':'5px','strong':'11px'}[p.contentBlur]||'0px')+')}',
 'body.theme-baptism_layers .bl-inner{position:relative;z-index:1;min-height:100vh;min-height:100dvh;max-width:600px;margin:0 auto;display:flex;flex-direction:column;padding:max(21px,env(safe-area-inset-top)) clamp(25px,7vw,54px) max(25px,env(safe-area-inset-bottom))}',
 'body.theme-baptism_layers .bl-back{position:relative;align-self:flex-start;display:inline-flex;align-items:center;gap:8px;padding:7px 2px;color:var(--heading);font:500 12px/1.4 var(--body);letter-spacing:.12em;border:0;background:none;cursor:pointer;z-index:3}',
 'body.theme-baptism_layers .bl-back>span:first-child{font-size:22px;line-height:14px;color:var(--accent);font-weight:300}',
 'body.theme-baptism_layers .bl-panel{display:flex;flex-direction:column;justify-content:center;flex:1;min-height:0}',
 'body.theme-baptism_layers .bl-menu-top{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;margin:0 0 clamp(24px,4vh,42px)}',
 'body.theme-baptism_layers .bl-menu-title{font:500 clamp(12px,3.4vw,15px)/1.4 var(--body);letter-spacing:.3em;color:var(--heading)}',
 'body.theme-baptism_layers .bl-top-rule{width:100%;height:1px;background:'+accent+'}',
 'body.theme-baptism_layers .bl-top-heart{text-align:right;color:var(--accent);font:300 27px/1 var(--display)}',
 'body.theme-baptism_layers .bl-menu{--bl-gap:clamp(14px,2.9vh,25px)}',
 'body.theme-baptism_layers .bl-rows{display:grid;gap:var(--bl-gap)}',
 'body.theme-baptism_layers .bl-menu-row{appearance:none;display:grid;grid-template-columns:clamp(54px,15vw,72px) minmax(0,1fr) 15px;gap:clamp(14px,4vw,22px);align-items:center;text-align:left;width:100%;border:0!important;outline-offset:4px;background:none!important;box-shadow:none!important;padding:0!important;color:var(--heading);cursor:pointer}',
 'body.theme-baptism_layers .bl-icon{width:clamp(54px,15vw,72px);height:clamp(54px,15vw,72px);border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 11%,var(--card));border:1px solid '+accent+';color:var(--accent)}',
 'body.theme-baptism_layers .bl-icon svg{width:49%;height:49%}',
 'body.theme-baptism_layers .bl-row-copy{display:grid;gap:4px}',
 'body.theme-baptism_layers .bl-row-copy strong{font:400 clamp(20px,5.5vw,27px)/1.1 var(--display);letter-spacing:.01em;color:var(--heading)}',
 'body.theme-baptism_layers .bl-row-copy small{font:400 10px/1.3 var(--body);letter-spacing:.08em;color:var(--muted)}',
 'body.theme-baptism_layers .bl-row-arrow{font:300 24px/1 var(--display);color:var(--accent);opacity:.65}',
 'body.theme-baptism_layers .bl-gallery-button,body.theme-baptism_layers .bl-confirm-cta{margin:clamp(31px,6vh,48px) auto 0;display:flex;align-items:center;justify-content:center;gap:16px;min-height:48px;width:min(100%,285px);padding:13px 21px;border:1px solid '+accent+';border-radius:999px;background:color-mix(in srgb,var(--accent) 68%,white);color:var(--bg);font:600 11px/1.3 var(--body);letter-spacing:.11em;text-transform:uppercase;cursor:pointer;text-decoration:none}',
 'body.theme-baptism_layers .bl-screen-footer{text-align:center;margin-top:18px;color:var(--muted);font:500 8px/1.4 var(--body);letter-spacing:.22em}',
 'body.theme-baptism_layers .bl-screen-footer span{color:var(--accent);margin-left:8px}',
 'body.theme-baptism_layers .bl-kicker{text-align:center;font:500 10px/1.5 var(--body);letter-spacing:.23em;color:var(--accent)}',
 'body.theme-baptism_layers .bl-heading{text-align:center;font:400 clamp(33px,10vw,54px)/1.07 var(--display);letter-spacing:.005em;color:var(--heading);margin:16px 0 30px}',
 'body.theme-baptism_layers .bl-empty{text-align:center;font:400 14px/1.8 var(--body);max-width:32ch;margin:30px auto;color:var(--text)}',
 'body.theme-baptism_layers .bl-date-area{text-align:center;display:flex;flex-direction:column;align-items:center}',
 'body.theme-baptism_layers .bl-date-ornament{font:300 34px/1 var(--display);color:var(--accent)}',
 'body.theme-baptism_layers .bl-date-main{font:400 clamp(84px,25vw,130px)/1.04 var(--body)!important;font-variant-numeric:lining-nums tabular-nums;color:var(--heading);letter-spacing:-.055em}',
 'body.theme-baptism_layers .bl-date-native .aura-date-day{font-family:var(--body)!important;font-weight:400!important;font-variant-numeric:lining-nums tabular-nums!important;letter-spacing:-.055em!important;line-height:1.06!important}',
 'body.theme-baptism_layers .bl-date-month{font:500 clamp(11px,3vw,13px)/1.55 var(--body);letter-spacing:.12em;color:var(--accent);max-width:100%;overflow-wrap:break-word;text-wrap:balance}',
 'body.theme-baptism_layers .bl-date-native .aura-date-monthyear{min-width:0;max-width:100%;letter-spacing:.11em!important;font-size:clamp(9px,2.8vw,11px)!important;line-height:1.6!important;overflow-wrap:break-word;text-wrap:balance}',
 'body.theme-baptism_layers .bl-date-native .aura-date-lockup.date-vertical{grid-template-columns:minmax(0,auto) minmax(0,1fr)!important;column-gap:clamp(8px,3vw,18px)!important}',
 'body.theme-baptism_layers .bl-date-weekday{margin-top:9px;font:400 11px/1.5 var(--body);letter-spacing:.08em;color:var(--muted)}',
 'body.theme-baptism_layers .bl-date-native{display:flex;justify-content:center;align-items:center;width:100%;max-width:100%;margin:4px auto 0}',
  'body.theme-baptism_layers .bl-date-native .aura-date-lockup{max-width:100%;margin-inline:auto}',
 'body.theme-baptism_layers .bl-date-main,body.theme-baptism_layers .bl-date-native .aura-date-day{'+dayVisualCss+'}',
 'body.theme-baptism_layers .bl-date-label{font:400 clamp(19px,5vw,23px)/1.3 var(--display);color:var(--heading);text-align:center;margin:23px auto 18px}',
 'body.theme-baptism_layers .bl-countdown{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;max-width:430px;width:100%;margin:0 auto 12px;padding:0;background:none;border:0;box-shadow:none}',
  'body.theme-baptism_layers .bl-countdown.countdown-super_minimal{gap:8px!important}',
 'body.theme-baptism_layers .bl-countdown .count-item{min-width:0;display:flex;flex-direction:column;align-items:center;gap:8px}',
  'body.theme-baptism_layers .bl-countdown.countdown-super_minimal .count-item{background:color-mix(in srgb,var(--accent) 7%,transparent);border:1px solid '+accent+';padding:11px 3px;border-radius:13px}',
 'body.theme-baptism_layers .bl-countdown b{font-family:var(--display);font-weight:400;color:var(--heading)}',
  'body.theme-baptism_layers .bl-countdown.countdown-super_minimal b{font-size:clamp(21px,6.8vw,32px);line-height:1}',
 'body.theme-baptism_layers .bl-countdown span{font:500 9px/1 var(--body);letter-spacing:.08em;color:var(--muted)}',
  'body.theme-baptism_layers .bl-row-copy small{overflow-wrap:anywhere;line-height:1.5}',
 'body.theme-baptism_layers .bl-place{text-align:center;display:flex;flex-direction:column;align-items:center;max-width:470px;margin:0 auto}',
 'body.theme-baptism_layers .bl-place-symbol,body.theme-baptism_layers .bl-confirm-symbol{display:grid;place-items:center;width:100px;height:100px;border:1px solid '+accent+';border-radius:50%;color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,transparent);margin-bottom:30px}',
 'body.theme-baptism_layers .bl-place-symbol svg,body.theme-baptism_layers .bl-confirm-symbol svg{width:51px;height:51px}',
 'body.theme-baptism_layers .bl-place-type{font:500 10px/1.5 var(--body);letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}',
 'body.theme-baptism_layers .bl-place h2,body.theme-baptism_layers .bl-confirm-body h2{font:400 clamp(25px,7.5vw,38px)/1.15 var(--display);color:var(--heading);margin:12px 0}',
 'body.theme-baptism_layers .bl-place p,body.theme-baptism_layers .bl-confirm-body p{font:400 13px/1.75 var(--body);color:var(--text);max-width:31ch;margin:18px auto}',
 'body.theme-baptism_layers .bl-rule{width:68px;height:1px;margin:12px auto;background:var(--accent);opacity:.58}',
 'body.theme-baptism_layers .bl-map-box{width:100%;height:clamp(170px,27vh,230px);border-radius:18px;overflow:hidden;margin:14px auto;background:var(--card);border:1px solid '+accent+'}',
 'body.theme-baptism_layers .bl-map-box[hidden]{display:none!important}',
 'body.theme-baptism_layers .bl-map-box iframe{border:0;width:100%;height:100%}',
 'body.theme-baptism_layers .bl-map-toggle{border:0;border-bottom:1px solid '+accent+';padding:11px 8px;background:none;color:var(--heading);font:500 11px var(--body);letter-spacing:.1em;cursor:pointer}',
 'body.theme-baptism_layers .bl-map-external{display:inline-flex;gap:12px;text-decoration:none;color:var(--heading);border-bottom:1px solid '+accent+';margin-top:16px;padding-bottom:8px;font:600 10px/1.3 var(--body);letter-spacing:.07em}',
 'body.theme-baptism_layers .bl-confirm-body{display:flex;flex-direction:column;align-items:center;text-align:center;margin:auto}',
 'body.theme-baptism_layers .bl-confirm-cta{margin-top:27px;background:var(--accent);color:white}',
 'body.theme-baptism_layers .bl-gallery-screen{padding:max(22px,env(safe-area-inset-top)) 0 max(36px,env(safe-area-inset-bottom))}',
 'body.theme-baptism_layers .bl-gallery-head{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;max-width:650px;margin:0 auto;padding:0 25px 12px}',
 'body.theme-baptism_layers .bl-gallery-heading{font:500 9px/1.3 var(--body);letter-spacing:.17em;color:var(--muted)}',
 'body.theme-baptism_layers .bl-gallery-native{position:relative;z-index:1;max-width:650px;margin:0 auto;padding:14px 12px 40px}',
 'body.theme-baptism_layers .bl-gallery-native>.section,body.theme-baptism_layers .bl-gallery-native .gallery-section{position:relative;display:block!important;min-height:0!important;height:auto!important;margin:0!important;padding:15px!important;background:transparent!important;box-shadow:none!important}',
 'body.theme-baptism_layers .bl-gallery-native .gallery{max-width:100%;}',
 'body.theme-baptism_layers .bl-audio{position:fixed;z-index:20;top:max(16px,env(safe-area-inset-top));right:clamp(20px,6vw,42px);width:39px;height:39px;border-radius:50%;border:1px solid '+accent+';color:var(--heading);background:var(--card);cursor:pointer;font-size:19px}',
 'body.theme-baptism_layers .music-toggle{display:none!important}',
 '@media(max-height:650px){body.theme-baptism_layers .bl-inner{padding-top:12px;padding-bottom:12px}body.theme-baptism_layers .bl-rows{gap:9px}body.theme-baptism_layers .bl-icon{width:46px;height:46px}body.theme-baptism_layers .bl-menu-row{grid-template-columns:46px minmax(0,1fr) 15px}body.theme-baptism_layers .bl-gallery-button{margin-top:15px}body.theme-baptism_layers .bl-heading{margin-bottom:13px}}',
 '@media(prefers-reduced-motion:no-preference){body.theme-baptism_layers .bl-screen:not([hidden]) .bl-panel{animation:bl-fade .3s ease both}@keyframes bl-fade{from{opacity:.45;transform:translateY(7px)}to{opacity:1;transform:none}}}'
 ].join('\n');
}
function layerRuntime(){
 const init=()=>{
  const hero=document.querySelector('[data-bl-cover]'),stage=document.querySelector('[data-bl-stage]');
  if(!hero||!stage)return;
  const screens=[...stage.querySelectorAll('[data-bl-screen]')];
  const audio=document.querySelector('audio'),toggle=stage.querySelector('.bl-audio');
  const syncMusic=()=>{if(!toggle||!audio)return;toggle.textContent=audio.paused?'♪':'Ⅱ';toggle.setAttribute('aria-label',audio.paused?'Reproducir música':'Pausar música');toggle.setAttribute('aria-pressed',String(!audio.paused))};
  if(audio)['play','pause','ended'].forEach(name=>audio.addEventListener(name,syncMusic));
  const navigate=target=>{
   if(target==='cover'){stage.hidden=true;hero.hidden=false;audio?.pause();if(audio){try{audio.currentTime=0}catch(_){}}syncMusic();return;}
   const fromCover=!hero.hidden;
   hero.hidden=true;stage.hidden=false;
   screens.forEach(s=>{const show=s.dataset.blScreen===target;s.hidden=!show;if(show)s.scrollTop=0});
   if(target==='menu'&&fromCover&&audio&&audio.paused)audio.play().catch(()=>{});
   syncMusic();
  };
  document.addEventListener('click',e=>{
   const button=e.target.closest('[data-bl-go]');
   if(button){e.preventDefault();e.stopImmediatePropagation();navigate(button.dataset.blGo);return;}
   const mapButton=e.target.closest('.bl-map-toggle');
   if(mapButton){
    const box=mapButton.parentElement?.querySelector('.bl-map-box');if(!box)return;
    const open=box.hidden;box.hidden=!open;mapButton.setAttribute('aria-expanded',String(open));mapButton.firstChild.textContent=open?'Ocultar mapa ':'Ver mapa ';
    const iframe=box.querySelector('iframe[data-src]');if(open&&iframe&&!iframe.src)iframe.src=iframe.dataset.src;
   }
   if(e.target.closest('.bl-audio')&&audio){if(audio.paused)audio.play().catch(()=>{});else audio.pause();}
  },true);
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!stage.hidden&&!document.querySelector('.gallery-lightbox.open'))navigate('menu')});
  syncMusic();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
}

/* Controles propios de la plantilla; se guardan en el JSON y en las invitaciones exportadas. */
const BL_FIELDS={
 blDateKicker:'CUENTA REGRESIVA',
 blDateTitle:'Nuestra fecha',
 blDateFooter:'UN MOMENTO PARA RECORDAR',
 blCeremonyAddress:'',
 blReceptionAddress:'',
 blDayFont:'manrope',
 blDaySize:'',
 blDayWeight:'400',
 blDayTracking:'',
 blDayColorMode:'theme',
 blDayColor:'#54493f'
};
const _blFormParams=getFormParams;
getFormParams=function(){
 const p=_blFormParams();
 Object.keys(BL_FIELDS).forEach(id=>{p[id]=document.getElementById(id)?.value??BL_FIELDS[id]});
 const controls=document.getElementById('bl-text-editor');
 if(controls)controls.hidden=p.themeVisual!==KEY;
 const dayEditor=document.getElementById('bl-day-editor');
 if(dayEditor)dayEditor.hidden=p.themeVisual!==KEY;
 const colorWrap=document.getElementById('blDayColorWrap');
 if(colorWrap)colorWrap.hidden=p.blDayColorMode!=='custom';
 return p;
};
function installBlEditor(){
 const eventSection=document.querySelector('#sec-evento .section-body');
 const locationsSection=document.querySelector('#sec-ubicaciones .section-body');
 if(!eventSection||!locationsSection||document.getElementById('bl-text-editor'))return;
 const box=document.createElement('div');
 box.id='bl-text-editor';box.className='background-controls';
 box.style.cssText='margin-top:14px;padding:14px;border:1px solid #e4d8cb;border-radius:12px';
 box.innerHTML='<p class="helper"><strong>Bautizo · Capas interactivas</strong> — personaliza los textos de la pantalla de fecha. También puedes tocarlos en la vista previa.</p>'+
  '<label>Texto superior de fecha<input type="text" id="blDateKicker" value="CUENTA REGRESIVA"></label>'+
  '<label>Título de la pantalla de fecha<input type="text" id="blDateTitle" value="Nuestra fecha"></label>'+
  '<label>Texto al pie de la pantalla de fecha<input type="text" id="blDateFooter" value="UN MOMENTO PARA RECORDAR"></label>'+
  '<p class="helper">El calendario y la cuenta regresiva se cambian con los selectores de arriba. El título del contador se cambia en «Título de cuenta regresiva».</p>';
 eventSection.appendChild(box);
 // Este bloque no incluye campo para modificar el valor numérico del día.
 const dayBox=document.createElement('div');
 dayBox.id='bl-day-editor';dayBox.className='background-controls';
 dayBox.style.cssText='margin-top:14px;padding:14px;border:1px solid #e4d8cb;border-radius:12px';
 dayBox.innerHTML='<p class="helper"><strong>Apariencia del número del día</strong> — toca el número en la vista previa para abrir estos controles. La cifra se calcula de «Fecha y hora» y no se puede sustituir aquí.</p>'+
  '<div class="field-grid"><label>Tipografía<select id="blDayFont"><option value="manrope">Manrope · limpio</option><option value="cormorant">Cormorant Garamond · editorial</option><option value="georgia">Georgia · clásica</option><option value="system">Sistema · minimalista</option></select></label>'+
  '<label>Grosor<select id="blDayWeight"><option value="300">Delgado</option><option value="400" selected>Regular</option><option value="500">Medio</option><option value="600">Seminegrita</option><option value="700">Negrita</option></select></label></div>'+
  '<div class="field-grid"><label>Tamaño (px)<input id="blDaySize" type="number" min="48" max="160" step="1" placeholder="Automático"></label>'+
  '<label>Espacio entre cifras (px)<input id="blDayTracking" type="number" min="-8" max="8" step=".5" placeholder="Original"></label></div>'+
  '<div class="field-grid"><label>Color<select id="blDayColorMode"><option value="theme">De la paleta</option><option value="custom">Personalizado</option></select></label>'+
  '<label id="blDayColorWrap" hidden>Elegir color<input type="color" id="blDayColor" value="#54493f"></label></div>'+
  '<p class="helper">Para cambiar la fecha real utiliza exclusivamente el campo «Fecha y hora».</p>';
 eventSection.appendChild(dayBox);
 document.getElementById('blDayColorMode')?.addEventListener('change',e=>{
  const host=document.getElementById('blDayColorWrap');if(host)host.hidden=e.target.value!=='custom';
 });
 const ceremony=document.getElementById('ceremonyText'),reception=document.getElementById('receptionText');
 function addressField(id,label,after){
  if(!after)return;
  const wrap=document.createElement('label');
  wrap.className='bl-address-editor';
  wrap.innerHTML=label+' <small>(opcional, se muestra bajo el lugar en el menú)</small><textarea rows="2" id="'+id+'" placeholder="Calle, número, colonia y ciudad"></textarea>';
  after.closest('label')?.after(wrap);
 }
 addressField('blCeremonyAddress','Dirección de la ceremonia',ceremony);
 addressField('blReceptionAddress','Dirección de la recepción',reception);
 document.getElementById('themeVisual')?.addEventListener('change',()=>{
  const hide=document.getElementById('themeVisual').value!==KEY;box.hidden=hide;dayBox.hidden=hide;
 });
 box.hidden=document.getElementById('themeVisual')?.value!==KEY;
 dayBox.hidden=box.hidden;
 queuePreview();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installBlEditor,{once:true});else installBlEditor();

// Solo el editor tiene un comportamiento táctil; la invitación exportada no.
const _blPreviewEditing=bindPreviewEditing52;
bindPreviewEditing52=function(doc){
 _blPreviewEditing(doc);
 if(!doc||doc.documentElement.dataset.blDayVisualBound==='1')return;
 doc.documentElement.dataset.blDayVisualBound='1';
 const style=doc.createElement('style');
 style.textContent='@media(hover:hover){[data-bl-day-visual]:hover{outline:1px dashed rgba(150,120,90,.75);outline-offset:5px;cursor:pointer}}';
 doc.head.appendChild(style);
 doc.addEventListener('click',e=>{
  if(!document.getElementById('previewEditMode')?.checked)return;
  const number=e.target.closest?.('[data-bl-day-visual]');
  if(!number)return;
  e.preventDefault();e.stopImmediatePropagation();
  const panel=document.getElementById('bl-day-editor');
  if(!panel)return;
  const section=panel.closest('details.form-section');
  if(section)section.open=true;
  panel.hidden=false;
  panel.scrollIntoView({behavior:'smooth',block:'center'});
  setTimeout(()=>{try{document.getElementById('blDayFont')?.focus({preventScroll:true})}catch(_){}},230);
 },true);
};

const original=buildInvitation;
buildInvitation=function(p,a){
 if(p?.themeVisual!==KEY)return original(p,a);
 let result=original(p,a);
 const layer=layersMarkup(p,a);
 // Use the existing renderer, asset pipeline, gallery and runtime; replace only its visual shell.
 result=result.replace(/<header class="hero[\s\S]*?<\/header>/,layer.cover);
 result=result.replace(/<main class="page">[\s\S]*?<\/main>/,layer.stage);
 result=result.replace('</style>',layerCss(p,a)+'</style>');
 // Existing music player and gallery handlers remain; add layer navigation logic once.
 result=result.replace('</body>','<script>('+layerRuntime.toString()+')();<\/script></body>');
 return result;
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{if(typeof renderThemeStrip==='function')renderThemeStrip();if(typeof renderPaletteStrip==='function')renderPaletteStrip()},{once:true});
else {if(typeof renderThemeStrip==='function')renderThemeStrip();if(typeof renderPaletteStrip==='function')renderPaletteStrip();}
})();