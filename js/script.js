const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const rgba=(hex,a)=>{let h=String(hex||"#ffffff").replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`};
const fileExt=n=>{const m=String(n||'').match(/(\.[^.]+)$/);return m?m[1].toLowerCase():''};
const assetName=(prefix,file)=>file?`assets/${prefix}${fileExt(file.name)}`:'';
const fileUrls=new Map();
const fileUrl=file=>{if(!file)return '';if(!fileUrls.has(file))fileUrls.set(file,URL.createObjectURL(file));return fileUrls.get(file)};
function releaseUnusedFiles(p){const active=new Set([p.portadaFile,p.bannerFile,p.bannerExtraFile,p.bannerExtra2File,p.bgFile,p.musicFile,p.videoPosterFile,...p.galleryFiles]);for(const [f,u] of fileUrls){if(!active.has(f)){URL.revokeObjectURL(u);fileUrls.delete(f)}}}

const THEMES={
 editorial_cream:{label:'Editorial Cream',palette:'ivory_champagne',swatch:'linear-gradient(135deg,#e9dfd0,#fcf9f3 55%,#9d8765)',display:"'Playfair Display',serif",body:"'Manrope',sans-serif",radius:'4px',hero:'center',ornament:'line',section:'airy'},
 old_money:{label:'Heritage',palette:'forest_gold',swatch:'linear-gradient(135deg,#1f3328,#e6dcc9 55%,#a68b59)',display:"'Italiana',serif",body:"'Manrope',sans-serif",radius:'2px',hero:'framed',ornament:'monogram',section:'classic'},
 monochrome:{label:'Noir & Ivory',palette:'black_ivory',swatch:'linear-gradient(135deg,#111 0 49%,#f3efe8 50%)',display:"'Italiana',serif",body:"'DM Sans',sans-serif",radius:'0px',hero:'bottom',ornament:'line',section:'graphic'},
 garden:{label:'Garden Atelier',palette:'sage_stone',swatch:'linear-gradient(135deg,#4e644d,#e9ead9 55%,#d7b8ac)',display:"'Playfair Display',serif",body:"'Manrope',sans-serif",radius:'28px',hero:'soft',ornament:'leaf',section:'organic'},
 dark_romance:{label:'Dark Romance',palette:'dark_velvet',swatch:'linear-gradient(135deg,#170f13,#5b2637 55%,#b18a61)',display:"'Playfair Display',serif",body:"'Manrope',sans-serif",radius:'5px',hero:'dramatic',ornament:'line',section:'dark'},
 contemporary:{label:'Contemporary Curve',palette:'blush_cocoa',swatch:'linear-gradient(135deg,#cf8777,#eedccc 50%,#536d71)',display:"'DM Sans',sans-serif",body:"'DM Sans',sans-serif",radius:'32px',hero:'curve',ornament:'dot',section:'modern'},
 photo_story:{label:'Photo Story',palette:'terracotta_linen',swatch:'linear-gradient(135deg,#3d332b,#b59e89 50%,#f6f1e9)',display:"'Playfair Display',serif",body:"'DM Sans',sans-serif",radius:'10px',hero:'photo',ornament:'none',section:'photo'},
 xv_couture:{label:'XV Couture',palette:'lavender_pearl',swatch:'linear-gradient(135deg,#9a668e,#ead8e8 55%,#ceb36c)',display:"'Italiana',serif",body:"'Manrope',sans-serif",radius:'12px',hero:'fashion',ornament:'star',section:'couture'},
 baptism_air:{label:'Pure Air',palette:'powder_blue',swatch:'linear-gradient(135deg,#bed2da,#f8f4ec 55%,#d8d3bf)',display:"'Playfair Display',serif",body:"'Manrope',sans-serif",radius:'26px',hero:'soft',ornament:'cross',section:'air'}
};
const PALETTES={
 ivory_champagne:['#a88a58','#2b2824','#1f1c19','#777068','#eee8df','#fbf8f3'],
 sage_stone:['#72806b','#30352f','#273026','#798074','#e7e7df','#f8f7f2'],
 black_ivory:['#171717','#24211e','#111111','#716d67','#ebe7df','#faf8f4'],
 burgundy_rose:['#783b4a','#38282d','#52202d','#8b6d73','#eadbdd','#fbf4f3'],
 midnight_silver:['#9da8b5','#e8e8e8','#ffffff','#b9bdc4','#111722','#1b2330'],
 lavender_pearl:['#9d7aa8','#3f3543','#57425e','#8e7b93','#ebe4ee','#faf7fb'],
 powder_blue:['#7297a8','#36434a','#2c3c43','#74858d','#e4edf0','#f7faf9'],
 terracotta_linen:['#b66c4e','#43322a','#673b2b','#8d7165','#ebe0d5','#fbf7f1'],
 forest_gold:['#a78a58','#eef0e7','#f8f5e8','#bfc4b7','#1c2e26','#263d33'],
 blush_cocoa:['#b8787a','#4b3532','#673f41','#927875','#eadcda','#fbf5f2'],
 dark_velvet:['#b58a68','#ede5df','#fff7f3','#c2aeb3','#161116','#21181e'],
 rose_taupe:['#c28c97','#49363b','#5b444a','#9b878d','#f2e7e8','#fcf8f7'],
 olive_ivory:['#7c8660','#393b31','#272a22','#8e917f','#efeee6','#fcfbf6'],
 blue_sand:['#7e92a8','#37414d','#25313c','#86909a','#ece7dd','#fcfaf5'],
 mocha_blush:['#a98177','#463530','#342825','#8e7671','#efe2dc','#fbf5f1'],
 noir_wine:['#7d4a5f','#f2e9e7','#fffaf7','#c7b0b7','#151215','#20181d'],
 copper_nude:['#b97b59','#4b3931','#603f33','#9f7e72','#efe1d8','#fbf6f2'],
 lilac_gold:['#a78abd','#43384c','#574661','#9787a5','#eee6f2','#fbf8fc'],
 ballet_silver:['#d8a8b8','#4a4146','#5a4f56','#a49099','#f3ebee','#fcf9fb'],
 plum_blush:['#8f617f','#43313e','#5a3e51','#937d8b','#efe1e8','#fbf6f9'],
 night_lavender:['#7b84b6','#eef0f7','#ffffff','#b8bbd2','#1d2237','#262c49'],
 emerald_beige:['#5b846e','#313e37','#24312a','#7e8d84','#ece5d8','#fbf8f2'],
 sky_pearl:['#8bb7c7','#38454b','#2c3a40','#83959d','#eaf1f3','#fbfdfd'],
 linen_gold:['#b9a171','#494239','#3b352e','#8c8379','#f2ede3','#fcfaf6'],
 soft_lavender:['#b6a3c9','#4a4450','#5d5465','#938d98','#f1edf5','#fcfbfd'],
 pistachio_cream:['#98ae8d','#41463c','#34392f','#878d82','#edf0e6','#fbfcf8'],
 steel_charcoal:['#768690','#e7eaec','#ffffff','#afb7bd','#20262b','#2b3339'],
 sand_ink:['#b49f87','#3f3832','#302925','#8e8275','#efe8df','#fbf8f4'],
 cocoa_mist:['#8f786d','#ece9e6','#ffffff','#b4aaa4','#2e2623','#3b322f'],
 clay_ash:['#bb8b77','#493a34','#372b27','#9f8478','#efe6e1','#fbf8f6'],
 ruby_champagne:['#9b1c31','#3a292b','#601624','#927a7b','#f1e5da','#fff9f4'],
 crimson_pearl:['#b3263e','#3d3132','#781b2d','#9b8184','#f2e7e5','#fcf9f7'],
 cherry_blush:['#c13d4d','#4a3133','#7b2232','#a88488','#f3dedf','#fff7f7'],
 scarlet_gold:['#a9252c','#40302b','#6f171d','#8d7368','#efe3d1','#fcf8f0'],
 garnet_ivory:['#7c1528','#382b2d','#4f1020','#88777a','#eee7e0','#fbf8f2'],
 red_noir:['#b52a3a','#f3e9e7','#fff8f5','#c8aeb1','#171214','#24191c']
};

Object.assign(THEMES,{
 xv_ballet:{label:'Ballet · romántico',palette:'ballet_silver',swatch:'linear-gradient(135deg,#b98d9b,#f5e9ee)',display:"'Cormorant Garamond',serif",body:"'Manrope',sans-serif",radius:'6px'},
 xv_nocturne:{label:'Nocturne · noche',palette:'night_lavender',swatch:'linear-gradient(135deg,#1d2237,#7b84b6)',display:"'Italiana',serif",body:"'DM Sans',sans-serif",radius:'0px'},
 baptism_linen:{label:'Lino · ceremonia',palette:'linen_gold',swatch:'linear-gradient(135deg,#b9a171,#fcfaf6)',display:"'Cormorant Garamond',serif",body:"'Manrope',sans-serif",radius:'3px'},
 party_studio:{label:'Studio · celebración',palette:'copper_nude',swatch:'linear-gradient(135deg,#b97b59,#efe1d8)',display:"'DM Sans',sans-serif",body:"'DM Sans',sans-serif",radius:'24px'},
 grad_edition:{label:'Edición · graduación',palette:'steel_charcoal',swatch:'linear-gradient(135deg,#20262b,#768690)',display:"'DM Sans',sans-serif",body:"'Manrope',sans-serif",radius:'0px'},
 school_atelier:{label:'Comunidad · encuentro',palette:'sky_pearl',swatch:'linear-gradient(135deg,#8bb7c7,#fbfdfd)',display:"'DM Sans',sans-serif",body:"'Manrope',sans-serif",radius:'18px'}
});
const COLLECTIONS={
 boda:{label:'Bodas',note:'Composición editorial, marcos clásicos y tonos de ceremonia.',themes:['editorial_cream','old_money','garden','dark_romance','photo_story'],palettes:['ivory_champagne','sage_stone','black_ivory','burgundy_rose','terracotta_linen','forest_gold','dark_velvet','rose_taupe','olive_ivory','blue_sand','mocha_blush','noir_wine'],gallery:'editorial'},
 xv:{label:'XV años',note:'Portadas de moda, arcos románticos y ediciones de noche.',themes:['xv_couture','xv_ballet','xv_nocturne'],palettes:['lavender_pearl','lilac_gold','ballet_silver','plum_blush','night_lavender','emerald_beige','ruby_champagne','crimson_pearl','cherry_blush','scarlet_gold','garnet_ivory','red_noir'],gallery:'filmstrip'},
 bautizo:{label:'Bautizos',note:'Luz, tipografía delicada y composiciones de ceremonia.',themes:['baptism_air','baptism_linen'],palettes:['powder_blue','sky_pearl','linen_gold','soft_lavender','pistachio_cream'],gallery:'story'},
 cumple:{label:'Cumpleaños',note:'Tipografía expresiva, curvas y color contemporáneo.',themes:['party_studio','contemporary'],palettes:['blush_cocoa','copper_nude','plum_blush','clay_ash'],gallery:'filmstrip'},
 graduacion:{label:'Graduaciones',note:'Una edición conmemorativa, gráfica y sobria.',themes:['grad_edition','monochrome'],palettes:['steel_charcoal','midnight_silver','sand_ink','cocoa_mist','black_ivory'],gallery:'editorial'},
 escolar:{label:'Eventos escolares',note:'Lectura clara y una presentación para compartir en comunidad.',themes:['school_atelier','contemporary'],palettes:['sky_pearl','powder_blue','pistachio_cream','sand_ink'],gallery:'story'}
};
const PALETTE_LABELS={};
function eventCollection(){const choice=$('designCollection')?.value||'event';return COLLECTIONS[choice==='event'?$('preset')?.value:choice]||{label:'Colección completa',note:'Todos los diseños y combinaciones de color.',themes:Object.keys(THEMES),palettes:Object.keys(PALETTES),gallery:'editorial'}}
function syncCollectionOptions(){
 const c=eventCollection(),ts=$('themeVisual'),ps=$('colorPalette'),tk=ts.value,pk=ps.value;
 if(!Object.keys(PALETTE_LABELS).length)Array.from(ps.options).forEach(o=>PALETTE_LABELS[o.value]=o.textContent.trim());
 const fill=(sel,keys,current,label)=>{sel.replaceChildren();if(sel===ps)sel.add(new Option('Personalizada','custom'));for(const k of keys)sel.add(new Option(label(k),k));if(current&&current!=='custom'&&!keys.includes(current)&&(sel===ts?THEMES[current]:PALETTES[current])){const g=document.createElement('optgroup');g.label='Selección conservada';g.appendChild(new Option(label(current),current));sel.appendChild(g)}if(Array.from(sel.options).some(o=>o.value===current))sel.value=current};
 fill(ts,c.themes,tk,k=>THEMES[k].label);fill(ps,c.palettes,pk,k=>PALETTE_LABELS[k]||k);
 $('collection-name').textContent=c.label;$('collection-note').textContent=c.note;
}

const FONT_MAP={default:'',elegant_playfair:"'Playfair Display',serif",garamond_cormorant:"'Cormorant Garamond',serif",classic_serif:"'Libre Baskerville',serif",modern_sans:"'Manrope',sans-serif",editorial_sans:"'Montserrat',sans-serif",clean_inter:"'Inter',sans-serif",script_greatvibes:"'Great Vibes',cursive"};

function applyPalette(k){const p=PALETTES[k];if(!p)return;const previous=$('bgContentColor').value;if($('locationsBgColor').value===previous||$('locationsBgColor').value==='#ffffff')$('locationsBgColor').value=p[5];['primaryColor','textColor','headingColor','mutedColor','bgBodyColor','bgContentColor'].forEach((id,i)=>$(id).value=p[i]);updatePreview()}
function applyPreset(type){const presets={
 boda:['Ana & Carlos','Nos llena de alegría compartir este día contigo.','Falta para nuestro gran día','Hola, quiero confirmar mi asistencia a su boda.','Gracias por acompañarnos en el inicio de esta nueva historia.','editorial_cream','ivory_champagne'],
 xv:['XV · Valentina','Una noche para celebrar todo lo que soy y todo lo que viene.','Falta para mi gran noche','Hola, quiero confirmar mi asistencia a tus XV años.','Hay momentos que se sueñan durante años. Gracias por vivir este conmigo.','xv_couture','lavender_pearl'],
 bautizo:['Bautizo de Mateo','Con mucha alegría queremos compartir contigo este día especial.','Falta para este día tan especial','Hola, quiero confirmar mi asistencia al bautizo.','Gracias por acompañarnos y ser parte de esta bendición.','baptism_air','powder_blue'],
 cumple:['Celebremos juntos','La vida se disfruta más cuando se comparte.','Falta para celebrar','Hola, quiero confirmar mi asistencia.','Qué alegría compartir contigo un año más de historias.','party_studio','copper_nude'],
 graduacion:['Class of 2026','Un capítulo termina. Todo lo demás apenas comienza.','Falta para la celebración','Hola, quiero confirmar mi asistencia a la graduación.','Gracias por acompañarme a celebrar este logro.','grad_edition','steel_charcoal'],
 escolar:['Nuestra celebración','Te esperamos para compartir este momento con nuestra comunidad.','Falta para nuestro evento','Hola, confirmo mi asistencia al evento.','Gracias por ser parte de nuestra comunidad.','school_atelier','sky_pearl']
};const v=presets[type];if(!v){renderThemeStrip();renderPaletteStrip();updatePreview();return}
 ['title','subtitle','countdownLabel','whatsappMessage','mainMessage'].forEach((id,i)=>{const old=$(id).value;if(!old||Object.values(presets).some(a=>a[i]===old)||['Tu presencia hará este momento aún más especial.','Hola, quiero confirmar mi asistencia.'].includes(old))$(id).value=v[i]});
 renderThemeStrip();renderPaletteStrip();updatePreview()}


function getFormParams(){const ids=['designCollection','heroLayout','heroLabelText','heroLabelSize','heroTitleFont','heroTextColor','heroPosition','heroAlignment','heroBlockPosition','heroWidth','heroSpacing','heroTitleLeading','heroTitleTracking','heroOrder','preset','themeVisual','fontPreset','motionPreset','motionIntensity','title','subtitle','buttonText','heroOffset','buttonStyle','overlayColor','overlayOpacity','colorPalette','primaryColor','textColor','headingColor','mutedColor','bgBodyColor','bgContentColor','contentBgOpacity','contentBlur','buttonOpacity','eventDate','countdownLabel','countdownStyle','dateCardStyle','heartStyle','locationsBgColor','locationsBgOpacity','ceremonyText','ceremonyUrl','ceremonyCoords','receptionText','receptionUrl','receptionCoords','videoLabel','videoText','videoUrl','whatsappNumber','whatsappMessage','mainMessage','orderLocations','orderConfirm','orderCountdown','orderGallery','orderBannerExtra','orderBannerExtra2','orderMessage','orderVideo','galleryStyle','galleryLabel','galleryTitle','galleryFocusY','galleryOffsets','titleSize','subtitleSize','buttonTextSize','countdownLabelSize','dateTextSize','countdownNumbersSize','locationsHeadingSize','ceremonyTextSize','receptionTextSize','rsvpHeadingSize','rsvpCopySize','rsvpButtonSize','bgFit','bgFocusX','bgFocusY','bgOverlayOpacity','mainMessageSize','videoLabelSize','videoTextSize','galleryLabelSize','galleryTitleSize'];const o={};ids.forEach(id=>o[id]=$(id)?.value??'');for(const id of ['showHeroLabel','showHeroButton','showHeroScroll'])o[id]=$(id)?.checked??true;o.showCeremony=$('showCeremony')?.checked??false;o.showReception=$('showReception')?.checked??false;o.portadaFile=$('portadaFile')?.files?.[0]||null;o.bannerFile=$('bannerFile')?.files?.[0]||null;o.bannerExtraFile=$('bannerExtraFile')?.files?.[0]||null;o.bannerExtra2File=$('bannerExtra2File')?.files?.[0]||null;o.bgFile=$('bgFile')?.files?.[0]||null;o.galleryFiles=Array.from($('galleryFiles')?.files||[]);o.musicFile=$('musicFile')?.files?.[0]||null;o.videoPosterFile=$('videoPosterFile')?.files?.[0]||null;return o}
function previewAssets(p){return{cover:fileUrl(p.portadaFile),banner:fileUrl(p.bannerFile),extra:fileUrl(p.bannerExtraFile),extra2:fileUrl(p.bannerExtra2File),bg:fileUrl(p.bgFile),gallery:p.galleryFiles.map(fileUrl),music:fileUrl(p.musicFile),poster:fileUrl(p.videoPosterFile)}}
function zipAssets(p){return{fontBase:'assets/fonts/',cover:assetName('portada',p.portadaFile),banner:assetName('banner',p.bannerFile),extra:assetName('banner-extra',p.bannerExtraFile),extra2:assetName('banner-extra-2',p.bannerExtra2File),bg:assetName('fondo',p.bgFile),gallery:p.galleryFiles.map((f,i)=>assetName(`foto-${i+1}`,f)),music:assetName('musica',p.musicFile),poster:assetName('video-poster',p.videoPosterFile)}}
function splitPlace(text){const s=String(text||'').split(/\s*[·\-–]\s*/);return{kind:s[0]||'Ubicación',name:s.slice(1).join(' · ')||s[0]||''}}
function textSizeCss(value,role){const v=['xs','s','m','l','xl'].includes(String(value))?String(value):'auto';if(v==='auto')return'';const scales={
 heroTitle:{xs:'clamp(30px,8vw,46px)',s:'clamp(38px,10vw,60px)',m:'clamp(48px,13vw,92px)',l:'clamp(56px,15vw,105px)',xl:'clamp(64px,17vw,118px)'},
 heroSubtitle:{xs:'11px',s:'12px',m:'14px',l:'16px',xl:'19px'},button:{xs:'9px',s:'10px',m:'11px',l:'12px',xl:'14px'},
 sectionTitle:{xs:'clamp(22px,5.5vw,32px)',s:'clamp(27px,6.5vw,40px)',m:'clamp(31px,8vw,52px)',l:'clamp(38px,9vw,60px)',xl:'clamp(44px,10vw,70px)'},
 sectionLabel:{xs:'7px',s:'8px',m:'9px',l:'10.5px',xl:'12px'},body:{xs:'12px',s:'13px',m:'15px',l:'17px',xl:'19px'},
 locationName:{xs:'16px',s:'19px',m:'22px',l:'26px',xl:'30px'},locationLabel:{xs:'7px',s:'8px',m:'9px',l:'10px',xl:'11px'},
 finalMessage:{xs:'clamp(20px,5vw,28px)',s:'clamp(25px,6vw,36px)',m:'clamp(30px,8vw,48px)',l:'clamp(36px,9vw,58px)',xl:'clamp(42px,10vw,68px)'},
 dateDay:{xs:'48px',s:'58px',m:'68px',l:'78px',xl:'90px'},dateMinor:{xs:'7px',s:'8px',m:'9px',l:'10px',xl:'12px'},countNumber:{xs:'22px',s:'27px',m:'32px',l:'38px',xl:'46px'}
};return scales[role]?.[v]||''}
function sizeAttr(value,role){const css=textSizeCss(value,role);return css?` style="font-size:${css}"`:''}
function normalizedVideo(url){let u=String(url||'').trim();if(!u)return'';const yt=u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&/]+)/);if(yt)return`https://www.youtube.com/embed/${yt[1]}?rel=0`;return u}

function invitationCss(p,t,a){const font=FONT_MAP[p.fontPreset]||t.body;const blur=p.contentBlur==='strong'?'18px':p.contentBlur==='light'?'9px':'0px';const duration=p.motionIntensity==='high'?'1.1s':p.motionIntensity==='low'?'.55s':'.8s';return `
${fontCss(p,t,a)}
:root{--accent:${p.primaryColor};--text:${p.textColor};--heading:${p.headingColor};--muted:${p.mutedColor};--bg:${p.bgBodyColor};--card:${rgba(p.bgContentColor,p.contentBgOpacity)};--loc:${rgba(p.locationsBgColor,(+p.locationsBgOpacity||0)/100)};--display:${t.display};--body:${font};--radius:${t.radius};--motion:${duration}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:var(--body);font-size:15px;line-height:1.7;}a{color:inherit}.hero{height:100svh;min-height:680px;position:relative;display:grid;place-items:center;overflow:hidden;background:${p.bgBodyColor}}.hero-media{position:absolute;inset:0;background:${a.cover?`url('${a.cover}') center/cover no-repeat`:`radial-gradient(circle at 30% 10%,${rgba(p.primaryColor,.34)},transparent 36%),linear-gradient(145deg,${p.bgBodyColor},${p.bgContentColor})`};transform:scale(1.01)}.hero-overlay{position:absolute;inset:0;background:${rgba(p.overlayColor,+p.overlayOpacity||0)}}.hero-inner{position:relative;z-index:2;width:min(86%,720px);text-align:center;color:white;transform:translateY(${+p.heroOffset||0}px)}.hero-kicker{font-size:10px;letter-spacing:.28em;text-transform:uppercase;margin-bottom:24px;opacity:.9}.hero h1{font-family:var(--display);font-weight:500;font-size:clamp(48px,13vw,92px);line-height:.94;letter-spacing:-.04em;margin:0;text-wrap:balance}.hero p{max-width:520px;margin:24px auto 0;font-size:14px;letter-spacing:.02em;opacity:.9}.enter-btn,.cta{display:inline-flex;align-items:center;justify-content:center;gap:12px;margin-top:34px;text-decoration:none;border:1px solid ${rgba(p.primaryColor,.9)};background:${rgba(p.primaryColor,bounded(p.buttonOpacity,.92,0,1))};color:white;padding:13px 22px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:.25s;${p.buttonStyle==='pill'?'border-radius:999px;':p.buttonStyle==='rounded'?'border-radius:12px;':p.buttonStyle==='outline_thin'?'background:transparent;border-color:rgba(255,255,255,.65);':p.buttonStyle==='glass_soft'?'border-radius:999px;background:rgba(255,255,255,${bounded(p.buttonOpacity,.92,0,1)});backdrop-filter:blur(12px);':p.buttonStyle==='text_only'?'background:transparent;border:0;border-bottom:1px solid currentColor;padding-left:2px;padding-right:2px;':'border-radius:2px;'}}.enter-btn:hover,.cta:hover{transform:translateY(-2px)}.scroll-note{position:absolute;z-index:2;bottom:24px;left:50%;transform:translateX(-50%);color:white;font-size:9px;letter-spacing:.2em;text-transform:uppercase;opacity:.68}.page{position:relative;overflow:hidden}.content{width:min(100% - 36px,760px);margin:0 auto;padding:72px 0}.section{margin:0 0 26px;padding:clamp(34px,7vw,62px);background:var(--card);backdrop-filter:blur(${blur});border-radius:var(--radius);position:relative;border:1px solid ${rgba(p.headingColor,.09)};box-shadow:0 24px 70px ${rgba(p.headingColor,.055)}}.section-label{font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:var(--muted);margin-bottom:16px}.section h2{font-family:var(--display);font-weight:500;color:var(--heading);font-size:clamp(31px,8vw,52px);line-height:1.05;letter-spacing:-.025em;margin:0 0 18px}.section-copy{color:var(--muted);max-width:560px;margin:0 auto}.center{text-align:center}.banner{width:100%;height:min(56vw,430px);min-height:250px;background-size:cover;background-position:center;margin:0;position:relative}.banner::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,${rgba(p.headingColor,.18)},transparent 55%)}.locations{display:grid;gap:18px}.location-card{background:var(--loc);padding:18px;border:1px solid ${rgba(p.headingColor,.1)};border-radius:calc(var(--radius) * .8);overflow:hidden}.location-head{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;padding:5px}.location-card small{display:block;color:var(--muted);font-size:9px;letter-spacing:.18em;text-transform:uppercase}.location-card strong{display:block;font-family:var(--display);font-size:22px;font-weight:500;line-height:1.25;color:var(--heading)}.map-toggle{appearance:none;border:0;background:transparent;color:var(--muted);font:500 9px/1 var(--body);letter-spacing:.16em;text-transform:uppercase;padding:10px 2px 10px 14px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:.25s}.map-toggle:hover{color:var(--heading)}.map-toggle-icon{font-size:15px;line-height:1;font-weight:400;transition:transform .35s ease}.map-toggle[aria-expanded="true"] .map-toggle-icon{transform:rotate(45deg)}.map-disclosure{display:none;margin-top:14px}.map-disclosure.open{display:block}.map-disclosure-inner{min-height:0;overflow:visible}.map-preview{aspect-ratio:16/9;min-height:170px;overflow:hidden;border-radius:calc(var(--radius)*.55);border:1px solid ${rgba(p.headingColor,.08)};background:${rgba(p.headingColor,.05)}}.map-preview iframe{width:100%;height:100%;display:block;border:0;filter:saturate(.82) contrast(.96)}.map-external{display:inline-flex;align-items:center;gap:8px;margin:12px 2px 0;text-decoration:none;color:var(--muted);font-size:9px;letter-spacing:.14em;text-transform:uppercase}.map-external:hover{color:var(--heading)}.video-shell{margin-top:24px}.video-toggle{appearance:none;border:0;background:transparent;color:var(--muted);font:500 9px/1 var(--body);letter-spacing:.16em;text-transform:uppercase;padding:10px 2px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:.25s}.video-toggle:hover{color:var(--heading)}.video-toggle-icon{font-size:15px;line-height:1;font-weight:400;transition:transform .35s ease}.video-toggle[aria-expanded="true"] .video-toggle-icon{transform:rotate(45deg)}.video-disclosure{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .42s ease,opacity .3s ease,margin-top .42s ease;margin-top:0}.video-disclosure.open{grid-template-rows:1fr;opacity:1;margin-top:14px}.video-disclosure-inner{min-height:0;overflow:hidden}.date-card{width:min(100%,340px);margin:30px auto 8px;padding:25px 24px 22px;position:relative;border:1px solid ${rgba(p.headingColor,.15)};background:${rgba(p.bgContentColor,.55)};color:var(--heading)}.date-weekday,.date-time{font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}.date-main{display:grid;grid-template-columns:1fr auto 1fr;gap:15px;align-items:center;margin:10px 0}.date-month,.date-year{font-size:10px;letter-spacing:.16em;text-transform:uppercase}.date-month{text-align:right}.date-year{text-align:left}.date-day{font-family:var(--display);font-size:68px;font-weight:500;line-height:.88;letter-spacing:-.04em}.theme-editorial_cream .date-card.date-auto{background:transparent;border-width:1px 0;border-radius:0;padding:20px 8px}.theme-old_money .date-card.date-auto{border:1px solid ${rgba(p.primaryColor,.65)};outline:1px solid ${rgba(p.primaryColor,.28)};outline-offset:5px;border-radius:0;background:${rgba(p.primaryColor,.045)};padding:30px 26px}.theme-old_money .date-card.date-auto .date-day{font-family:'Italiana',serif}.theme-monochrome .date-card.date-auto{background:var(--heading);border-color:var(--heading);color:var(--bg);border-radius:0}.theme-monochrome .date-card.date-auto .date-weekday,.theme-monochrome .date-card.date-auto .date-time{color:${rgba(p.bgBodyColor,.72)}}.theme-monochrome .date-card.date-auto .date-day{color:var(--bg)}.theme-garden .date-card.date-auto{border-radius:150px 150px 28px 28px;padding:44px 26px 24px;background:${rgba(p.primaryColor,.07)};border-color:${rgba(p.primaryColor,.18)}}.theme-dark_romance .date-card.date-auto{background:linear-gradient(145deg,${rgba(p.headingColor,.8)},${rgba(p.primaryColor,.24)});border-color:${rgba(p.primaryColor,.4)};box-shadow:0 20px 50px rgba(0,0,0,.12)}.theme-dark_romance .date-card.date-auto .date-day{color:${p.textColor}}.theme-contemporary .date-card.date-auto{border-radius:72px 14px 72px 14px;background:${rgba(p.primaryColor,.08)};border-color:${rgba(p.primaryColor,.18)}}.theme-photo_story .date-card.date-auto{background:transparent;border:0;border-left:1px solid ${rgba(p.primaryColor,.55)};border-right:1px solid ${rgba(p.primaryColor,.18)};padding-top:12px;padding-bottom:12px}.theme-xv_couture .date-card.date-auto{border-radius:4px;background:${rgba(p.primaryColor,.055)};border:1px solid ${rgba(p.primaryColor,.42)};box-shadow:inset 0 0 0 7px ${rgba(p.bgContentColor,.5)},0 18px 50px ${rgba(p.primaryColor,.08)};padding:32px 27px}.theme-xv_couture .date-card.date-auto .date-day{font-family:'Italiana',serif;font-size:74px}.theme-baptism_air .date-card.date-auto{border-radius:999px;background:${rgba(p.primaryColor,.055)};border-color:${rgba(p.primaryColor,.14)};padding:24px 30px}.date-card.date-editorial{background:transparent!important;border-width:1px 0!important;border-radius:0!important;padding:20px 8px!important;outline:0!important;box-shadow:none!important}.date-card.date-heritage{border:1px solid ${rgba(p.primaryColor,.65)}!important;outline:1px solid ${rgba(p.primaryColor,.28)}!important;outline-offset:5px!important;border-radius:0!important;background:${rgba(p.primaryColor,.045)}!important;padding:30px 26px!important}.date-card.date-arch{border-radius:150px 150px 28px 28px!important;padding:44px 26px 24px!important;background:${rgba(p.primaryColor,.07)}!important;border-color:${rgba(p.primaryColor,.18)}!important;outline:0!important}.date-card.date-couture{border-radius:4px!important;background:${rgba(p.primaryColor,.055)}!important;border:1px solid ${rgba(p.primaryColor,.42)}!important;box-shadow:inset 0 0 0 7px ${rgba(p.bgContentColor,.5)},0 18px 50px ${rgba(p.primaryColor,.08)}!important;padding:32px 27px!important;outline:0!important}.date-card.date-minimal{background:transparent!important;border:0!important;border-top:1px solid ${rgba(p.headingColor,.16)}!important;border-bottom:1px solid ${rgba(p.headingColor,.16)}!important;border-radius:0!important;box-shadow:none!important;outline:0!important;padding:14px 5px!important}.countdown{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:26px}.count-item{text-align:center;padding:16px 5px;border-radius:calc(var(--radius)*.65);background:transparent;border:0}.count-item b{font-family:'DM Sans',sans-serif;font-variant-numeric:lining-nums tabular-nums;font-size:32px;font-weight:500;line-height:1;color:var(--heading)}.count-item span{display:block;margin-top:7px;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}.gallery{display:grid;gap:8px;margin-top:24px}.gallery-only .gallery{margin-top:0}.gallery-only{padding-top:clamp(18px,4vw,34px);padding-bottom:clamp(18px,4vw,34px)}.gallery.square{grid-template-columns:repeat(2,1fr)}.gallery.rectangular{grid-template-columns:1fr}.gallery.masonry{columns:2;display:block}.gallery.masonry figure{break-inside:avoid;margin:0 0 8px}.gallery.editorial{grid-template-columns:repeat(6,1fr);grid-auto-rows:110px}.gallery.editorial figure:nth-child(6n+1){grid-column:span 4;grid-row:span 3}.gallery.editorial figure:nth-child(6n+2){grid-column:span 2;grid-row:span 2}.gallery.editorial figure:nth-child(6n+3){grid-column:span 2;grid-row:span 2}.gallery.editorial figure:nth-child(n+4){grid-column:span 3;grid-row:span 2}.gallery.collage{grid-template-columns:repeat(2,1fr);grid-auto-rows:150px}.gallery.collage figure:nth-child(3n+1){grid-row:span 2}.gallery.polaroid_pro{grid-template-columns:repeat(2,1fr);gap:16px}.gallery.polaroid_pro figure{padding:8px 8px 28px;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.08);transform:rotate(-1.4deg)}.gallery.polaroid_pro figure:nth-child(even){transform:rotate(1.3deg)}.gallery figure{margin:0;overflow:hidden;border-radius:calc(var(--radius)*.55);min-height:180px}.gallery img{width:100%;height:100%;display:block;object-fit:cover;object-position:center ${bounded(p.galleryFocusY,50,0,100)}%;cursor:zoom-in}.gallery-lightbox{position:fixed;inset:0;z-index:1000;background:rgba(10,10,10,.96);display:grid;grid-template-rows:auto 1fr auto;opacity:0;visibility:hidden;transition:opacity .28s ease,visibility .28s ease}.gallery-lightbox.open{opacity:1;visibility:visible}.gallery-lightbox-top{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;color:#fff}.gallery-lightbox-count{font:500 10px/1 var(--body);letter-spacing:.16em;text-transform:uppercase;opacity:.72}.gallery-lightbox-close,.gallery-lightbox-nav{appearance:none;border:0;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;display:grid;place-items:center;backdrop-filter:blur(10px)}.gallery-lightbox-close{width:42px;height:42px;border-radius:50%;font-size:24px;font-weight:300}.gallery-lightbox-stage{position:relative;min-height:0;display:grid;place-items:center;padding:8px 54px}.gallery-lightbox-image{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;user-select:none;-webkit-user-drag:none}.gallery-lightbox-nav{position:absolute;top:50%;transform:translateY(-50%);width:42px;height:58px;border-radius:999px;font-size:24px}.gallery-lightbox-prev{left:8px}.gallery-lightbox-next{right:8px}.gallery-lightbox-caption{padding:14px 20px 22px;text-align:center;color:rgba(255,255,255,.65);font:500 9px/1.4 var(--body);letter-spacing:.12em;text-transform:uppercase}.gallery-lightbox[hidden]{display:none!important}@media(max-width:480px){.gallery-lightbox-stage{padding:6px 38px}.gallery-lightbox-nav{width:36px;height:52px}.gallery-lightbox-top{padding:12px}.gallery-lightbox-close{width:38px;height:38px}}.video-wrap{aspect-ratio:16/9;border-radius:calc(var(--radius)*.7);overflow:hidden;background:${rgba(p.headingColor,.08)};margin-top:0}.video-wrap iframe,.video-wrap video{width:100%;height:100%;border:0}.video-poster{width:100%;height:100%;border:0;background-size:cover;background-position:center;cursor:pointer;display:block;position:relative;padding:0;overflow:hidden}.video-play-chip{position:absolute;left:50%;bottom:18px;z-index:3;transform:translateX(-50%);display:inline-flex;align-items:center;justify-content:center;gap:10px;min-width:126px;padding:11px 16px;border:1px solid ${rgba(p.primaryColor,.42)};border-radius:999px;background:${rgba(p.bgContentColor,.76)};color:var(--heading);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 12px 28px ${rgba(p.headingColor,.14)};transition:transform .2s ease,background .2s ease}.video-poster:hover .video-play-chip{transform:translateX(-50%) translateY(-2px);background:${rgba(p.bgContentColor,.9)}}.video-play-chip i{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:${rgba(p.primaryColor,.16)};color:var(--heading);font:600 10px/1 var(--body);font-style:normal;padding-left:1px}.video-play-chip em{font:600 9px/1 var(--body);font-style:normal;letter-spacing:.13em;text-transform:uppercase;white-space:nowrap}.final-message{font-family:var(--display);font-size:clamp(30px,8vw,48px);line-height:1.18;color:var(--heading);text-align:center}.rsvp .cta{color:white}.music-toggle{position:fixed;right:18px;bottom:18px;z-index:20;width:44px;height:44px;border:0;border-radius:50%;background:${rgba(p.headingColor,.86)};color:white;box-shadow:0 10px 30px rgba(0,0,0,.18)}.reveal{opacity:0;transform:translateY(28px);transition:opacity var(--motion) ease,transform var(--motion) ease}.reveal.in{opacity:1;transform:none}.ornament{width:54px;height:1px;background:var(--accent);margin:18px auto 22px}.theme-old_money .hero-inner{border:1px solid rgba(255,255,255,.45);padding:58px 22px}.theme-monochrome .section{box-shadow:none;border-color:${rgba(p.headingColor,.18)}}.theme-monochrome .hero h1{text-transform:uppercase}.theme-garden .section::before{content:'';position:absolute;right:18px;top:12px;color:${rgba(p.primaryColor,.45)};font-size:20px}.theme-dark_romance .section{box-shadow:0 25px 70px rgba(0,0,0,.14)}.theme-contemporary .section:nth-child(even){border-radius:70px 12px 70px 12px}.theme-xv_couture .hero-kicker::before,.theme-xv_couture .hero-kicker::after{content:'';margin:0 12px}.theme-baptism_air .section{box-shadow:0 24px 70px rgba(77,99,110,.07)}@media(max-width:480px){.content{width:min(100% - 24px,760px);padding:50px 0}.section{padding:36px 24px}.location-card{grid-template-columns:1fr auto;padding:20px}.count-item b{font-size:27px}.gallery.editorial{grid-auto-rows:82px}.hero{min-height:640px}}
`;}

function galleryOffsets(p){try{const x=typeof p.galleryOffsets==='string'?JSON.parse(p.galleryOffsets):p.galleryOffsets;return Array.isArray(x)?x:[]}catch(e){return[]}}
function eventDateParts(value){if(!value)return null;const d=new Date(value);if(Number.isNaN(d.getTime()))return null;const days=['DOMINGO','LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO'];const months=['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];return{weekday:days[d.getDay()],day:String(d.getDate()).padStart(2,'0'),month:months[d.getMonth()],year:String(d.getFullYear()),time:d.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:true}).replace(/\s/g,' ').toUpperCase()}}
function dateCardHtml(p){if(p.dateCardStyle==='none')return'';const d=eventDateParts(p.eventDate);if(!d)return'';const cls=p.dateCardStyle&&p.dateCardStyle!=='auto'?` date-${esc(p.dateCardStyle)}`:' date-auto';return `<div class="date-card${cls}"><div class="date-weekday"${sizeAttr(p.dateTextSize,'dateMinor')}>${d.weekday}</div><div class="date-main"><span class="date-month"${sizeAttr(p.dateTextSize,'dateMinor')}>${d.month}</span><strong class="date-day"${sizeAttr(p.dateTextSize,'dateDay')}>${d.day}</strong><span class="date-year"${sizeAttr(p.dateTextSize,'dateMinor')}>${d.year}</span></div><div class="date-time"${sizeAttr(p.dateTextSize,'dateMinor')}>${d.time}</div></div>`}
function countdownStyleClass(p){const v=String(p?.countdownStyle||'super_minimal').replace(/[^a-z0-9_-]/gi,'');return `countdown-${v||'super_minimal'}`}
function dateStyleClass(p){const v=String(p?.dateCardStyle||'auto').replace(/[^a-z0-9_-]/gi,'');return `date-${v||'auto'}`}
function auraDateLockupHtml(p,d){if(!d||p.dateCardStyle==='none')return'';return `<div class="aura-date-lockup ${dateStyleClass(p)}"><span class="aura-date-weekday">${esc(d.weekday)}</span><strong class="aura-date-day"${sizeAttr(p.dateTextSize,'dateDay')}>${esc(d.day)}</strong><span class="aura-date-monthyear"${sizeAttr(p.dateTextSize,'dateMinor')}>${esc(d.month)} · ${esc(d.year)}</span><em class="aura-date-time"${sizeAttr(p.dateTextSize,'dateMinor')}>${esc(d.time)}</em></div>`}
function normalizeMapText(value){let s=String(value||'').trim().replace(/&amp;/gi,'&');for(let i=0;i<4;i++){try{const n=decodeURIComponent(s);if(n===s)break;s=n}catch(e){break}}return s.replace(/\+/g,' ')}
function validCoords(lat,lng){lat=Number(lat);lng=Number(lng);return Number.isFinite(lat)&&Number.isFinite(lng)&&lat>=-90&&lat<=90&&lng>=-180&&lng<=180?[lat,lng]:null}
function extractMapCoords(value){const s=normalizeMapText(value);if(!s)return null;const patterns=[
 /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i,
 /[?&#](?:q|query|destination|center|ll)=\s*(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)/i,
 /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:,|\/|$)/,
 /(?:geo:|^|\s)(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)(?:\s|$)/i,
 /\/dir\/(?:[^/]*\/)*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:\/|\?|$)/i
 ];
 for(const re of patterns){const m=s.match(re);if(!m)continue;const c=validCoords(m[1],m[2]);if(c)return c}
 return null}
function mapEmbedUrl(url,explicitCoords){const c=extractMapCoords(explicitCoords)||extractMapCoords(url);if(!c)return'';const lat=Number(c[0]).toFixed(7).replace(/0+$/,'').replace(/\.$/,'');const lng=Number(c[1]).toFixed(7).replace(/0+$/,'').replace(/\.$/,'');const pair=`${lat},${lng}`;return `https://www.google.com/maps?q=${encodeURIComponent(pair)}&hl=es&t=k&z=16&output=embed`}
function coordsText(c){if(!c)return'';return `${Number(c[0]).toFixed(7).replace(/0+$/,'').replace(/\.$/, '')}, ${Number(c[1]).toFixed(7).replace(/0+$/,'').replace(/\.$/, '')}`}
function googleMapUrlKind(value){try{const u=new URL(String(value||'').trim());const h=u.hostname.toLowerCase();if(h==='maps.app.goo.gl')return'short';if(h==='goo.gl'&&u.pathname.startsWith('/maps'))return'short';if((h==='www.google.com'||h==='google.com'||h==='maps.google.com'||h.endsWith('.google.com'))&&u.pathname.includes('/maps'))return'google';return''}catch(e){return''}}
async function mapFetch(url,options={}){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4500);try{return await fetch(url,{...options,signal:controller.signal})}finally{clearTimeout(timer)}}
async function expandGoogleMapUrl(url){const raw=String(url||'').trim();if(!raw||!googleMapUrlKind(raw))return'';const direct=extractMapCoords(raw);if(direct)return raw;
 const providers=[
  async()=>{const r=await mapFetch(`https://api.domainee.dev/v1/tools/redirect-checker?url=${encodeURIComponent(raw)}`,{cache:'no-store'});if(!r.ok)throw Error(`domainee ${r.status}`);const j=await r.json();return j?.data?.finalUrl||j?.data?.final_url||''},
  async()=>{const r=await mapFetch('https://www.redirectcheck.org/api/check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:raw,method:'GET',followMetaRefresh:true}),cache:'no-store'});if(!r.ok)throw Error(`redirectcheck ${r.status}`);const j=await r.json();return j?.final_result?.final_url||j?.finalResult?.finalUrl||j?.data?.finalUrl||''}
 ];
 for(const get of providers){try{const out=await get();if(out&&extractMapCoords(out))return out}catch(e){console.warn('No se pudo expandir Maps con un proveedor',e)}}return''}
function setMapStatus(prefix,msg,state=''){const el=$(`${prefix}MapStatus`);if(!el)return;el.textContent=msg||'';el.dataset.state=state}
const mapResolveSeq={ceremony:0,reception:0};
async function resolveMapField(prefix,{force=false}={}){const urlEl=$(`${prefix}Url`),coordsEl=$(`${prefix}Coords`);if(!urlEl||!coordsEl)return null;const raw=String(urlEl.value||'').trim();const seq=++mapResolveSeq[prefix];
 if(!raw){if(coordsEl.dataset.auto==='1'){coordsEl.value='';delete coordsEl.dataset.auto;delete coordsEl.dataset.sourceUrl}setMapStatus(prefix,'');updatePreview();return null}
 const direct=extractMapCoords(raw);if(direct){if(!coordsEl.value||coordsEl.dataset.auto==='1'){coordsEl.value=coordsText(direct);coordsEl.dataset.auto='1';coordsEl.dataset.sourceUrl=raw}setMapStatus(prefix,'Coordenadas exactas detectadas en el enlace.','ok');updatePreview();return direct}
 const manual=extractMapCoords(coordsEl.value);if(manual&&coordsEl.dataset.auto!=='1'&&!force){setMapStatus(prefix,'Usando las coordenadas exactas escritas.','ok');updatePreview();return manual}
 if(coordsEl.dataset.auto==='1'&&coordsEl.dataset.sourceUrl!==raw){coordsEl.value='';delete coordsEl.dataset.auto;delete coordsEl.dataset.sourceUrl}
 const kind=googleMapUrlKind(raw);if(!kind){setMapStatus(prefix,'El enlace no parece ser de Google Maps.','error');updatePreview();return null}
 setMapStatus(prefix,kind==='short'?'Resolviendo el enlace compartido de Google Maps…':'Obteniendo las coordenadas del enlace de Google Maps…','loading');
 const expanded=await expandGoogleMapUrl(raw);if(seq!==mapResolveSeq[prefix])return null;const c=extractMapCoords(expanded);if(c){coordsEl.value=coordsText(c);coordsEl.dataset.auto='1';coordsEl.dataset.sourceUrl=raw;setMapStatus(prefix,'Ubicación exacta detectada. El mapa usará este pin.','ok');updatePreview();return c}
 setMapStatus(prefix,'No pude leer el pin de este enlace. Puedes pegar una URL completa de Google Maps o escribir las coordenadas.','error');updatePreview();return null}
function bindMapResolver(prefix){const urlEl=$(`${prefix}Url`),coordsEl=$(`${prefix}Coords`);if(!urlEl||!coordsEl)return;let t;const run=()=>{clearTimeout(t);t=setTimeout(()=>resolveMapField(prefix),120)};urlEl.addEventListener('change',run);urlEl.addEventListener('blur',run);urlEl.addEventListener('paste',()=>{clearTimeout(t);t=setTimeout(()=>resolveMapField(prefix),220)});coordsEl.addEventListener('input',()=>{delete coordsEl.dataset.auto;delete coordsEl.dataset.sourceUrl;const c=extractMapCoords(coordsEl.value);setMapStatus(prefix,c?'Usando las coordenadas exactas escritas.':'','ok')})}
function resolveAllMapUrls(){return Promise.allSettled(['ceremony','reception'].map(prefix=>resolveMapField(prefix)))}
function buildSections(p,a){const offsets=galleryOffsets(p);const locs=[];const locationCard=(text,url,coords,id,textSize)=>{const x=splitPlace(text),map=mapEmbedUrl(url,coords);return `<div class="location-card"><div class="location-head"><div><small${sizeAttr(textSize,'locationLabel')}>${esc(x.kind)}</small><strong${sizeAttr(textSize,'locationName')}>${esc(x.name)}</strong></div>${map?`<button class="map-toggle" type="button" aria-expanded="false" aria-controls="${id}"><span>Ver mapa</span><span class="map-toggle-icon">＋</span></button>`:''}</div>${map?`<div class="map-disclosure" id="${id}"><div class="map-disclosure-inner"><div class="map-preview"><iframe data-src="${esc(map)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen title="Mapa de ${esc(x.name)}"></iframe></div></div></div>`:''}${safeMapLink(url)?`<a class="map-external" href="${esc(safeMapLink(url))}" target="_blank" rel="noopener">Abrir en Google Maps ↗</a>`:''}</div>`};if(p.showCeremony&&p.ceremonyText)locs.push(locationCard(p.ceremonyText,p.ceremonyUrl,p.ceremonyCoords,'map-ceremony',p.ceremonyTextSize));if(p.showReception&&p.receptionText)locs.push(locationCard(p.receptionText,p.receptionUrl,p.receptionCoords,'map-reception',p.receptionTextSize));
 const parts={
  locations:locs.length?`<section class="section reveal"><div class="section-label">Dónde será</div><h2${sizeAttr(p.locationsHeadingSize,'sectionTitle')}>Nos vemos aquí.</h2><div class="ornament"></div><div class="locations">${locs.join('')}</div></section>`:'',
  confirm:p.whatsappNumber?`<section class="section center rsvp reveal"><div class="section-label">RSVP</div><h2${sizeAttr(p.rsvpHeadingSize,'sectionTitle')}>¿Nos acompañas?</h2><p class="section-copy"${sizeAttr(p.rsvpCopySize,'body')}>Tu confirmación nos ayuda a preparar cada detalle.</p><a class="cta"${sizeAttr(p.rsvpButtonSize,'button')} target="_blank" href="https://wa.me/${encodeURIComponent(p.whatsappNumber.replace(/\D/g,''))}?text=${encodeURIComponent(p.whatsappMessage)}">Confirmar por WhatsApp →</a></section>`:'',
  countdown:p.eventDate?`<section class="section center reveal date-section"><div class="section-label">Save the date</div><h2${sizeAttr(p.countdownLabelSize,'sectionTitle')}>${esc(p.countdownLabel)}</h2>${dateCardHtml(p)}<div class="countdown ${countdownStyleClass(p)}" data-date="${esc(p.eventDate)}"><div class="count-item"><b data-d${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Días</span></div><div class="count-item"><b data-h${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Horas</span></div><div class="count-item"><b data-m${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Min</span></div><div class="count-item"><b data-s${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Seg</span></div></div></section>`:'',
  gallery:a.gallery.length?`<section class="section reveal gallery-section${(!p.galleryLabel&&!p.galleryTitle)?' gallery-only':''}">${p.galleryLabel?`<div class="section-label"${sizeAttr(p.galleryLabelSize,'sectionLabel')}>${esc(p.galleryLabel)}</div>`:''}${p.galleryTitle?`<h2${sizeAttr(p.galleryTitleSize,'sectionTitle')}>${esc(p.galleryTitle)}</h2>`:''}<div class="gallery ${esc(p.galleryStyle)}">${a.gallery.map((src,i)=>`<figure><img class="gallery-image" role="button" tabindex="0" aria-label="Ampliar fotografía ${i+1}" data-index="${i}" data-focus-y="${Number.isFinite(+offsets[i])?Math.max(0,Math.min(100,+offsets[i])):bounded(p.galleryFocusY,50,0,100)}" style="object-position:center ${Number.isFinite(+offsets[i])?Math.max(0,Math.min(100,+offsets[i])):bounded(p.galleryFocusY,50,0,100)}%" src="${src}" alt="Fotografía ${i+1}" loading="lazy"></figure>`).join('')}</div>${galleryFooter(p,a.gallery.length)}</section>`:'',
  extra:a.extra?bannerHtml557(a.extra,p.bannerExtraMode,'','Banner extra'):'',
  extra2:a.extra2?bannerHtml557(a.extra2,p.bannerExtra2Mode,'','Banner extra 2'):'',
  message:p.mainMessage?`<section class="section reveal"><div class="section-label center">Con cariño</div><div class="final-message"${sizeAttr(p.mainMessageSize,'finalMessage')}>${esc(p.mainMessage).replace(/\n/g,'<br>')}</div></section>`:'',
  video:p.videoUrl?`<section id="video" class="section reveal legacy-video-section">${auraVideo54(p,a)}</section>`:'',
  transfer:auraTransfer54(p,a)?`<section id="transferencia" class="section center reveal transfer-section">${auraTransfer54(p,a)}</section>`:''
 };
 const order=[['locations',p.orderLocations],['confirm',p.orderConfirm],['countdown',p.orderCountdown],['gallery',p.orderGallery],['extra',p.orderBannerExtra],['extra2',p.orderBannerExtra2],['message',p.orderMessage],['video',p.orderVideo],['transfer',p.orderTransfer||10]].filter(x=>+x[1]>0&&parts[x[0]]).sort((a,b)=>+a[1]-+b[1]);return order.map(x=>parts[x[0]]).join('')}

function invitationJs(){return '('+invitationRuntime.toString()+')();'}
function buildInvitation(p,a){const t=THEMES[p.themeVisual]||THEMES.editorial_cream;return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="${p.bgBodyColor}"><title>${esc(p.title)}</title><style>${invitationCss(p,t,a)}${editionCss(p,t,a)}${coverCss(p)}</style></head><body class="theme-${esc(p.themeVisual)} event-${esc(p.preset)} design-${themeFamily(p.themeVisual)}">${backgroundHtml(p,a)}${coverHtml(p)}<main class="page">${a.banner?bannerHtml557(a.banner,p.bannerMode,'banner-main','Banner principal'):''}<div class="content">${buildSections(p,a)}</div></main>${a.music?`<audio src="${a.music}" loop preload="auto"></audio><button class="music-toggle" aria-label="Música">♪</button>`:''}<script>${invitationJs()}<\/script></body></html>`}

let detachedPreviewWindow=null;
/* Editor gallery gestures are implemented below. */
function setupGalleryDrag(){const frame=$('preview-frame');bindGalleryDrag(frame?.contentDocument)}
function renderDetachedPreview(html){if(!detachedPreviewWindow||detachedPreviewWindow.closed)return;let scrollY=0;try{scrollY=detachedPreviewWindow.scrollY||0}catch(e){}try{detachedPreviewWindow.document.open();detachedPreviewWindow.document.write(html);detachedPreviewWindow.document.close();detachedPreviewWindow.document.title='Aura Digital · Preview';setTimeout(()=>{if(detachedPreviewWindow&&!detachedPreviewWindow.closed){try{detachedPreviewWindow.scrollTo(0,scrollY);bindGalleryDrag(detachedPreviewWindow.document)}catch(e){}}},40)}catch(e){console.warn('No se pudo actualizar la ventana de preview',e)}}
function openDetachedPreview(){const availW=Math.max(320,window.screen?.availWidth||window.innerWidth||430),availH=Math.max(560,window.screen?.availHeight||window.innerHeight||900),height=Math.min(900,Math.max(620,availH-80)),width=Math.min(430,Math.max(300,Math.round(height*(430/900))),Math.max(300,availW-40)),sx=Number.isFinite(window.screenX)?window.screenX:(window.screenLeft||0),sy=Number.isFinite(window.screenY)?window.screenY:(window.screenTop||0),left=Math.max(sx+10,sx+(window.outerWidth||availW)-width-30),top=Math.max(sy+20,sy+Math.round(Math.max(0,availH-height)/2)),features=`popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;try{if(detachedPreviewWindow&&!detachedPreviewWindow.closed)detachedPreviewWindow.close()}catch(e){}detachedPreviewWindow=window.open('about:blank','_blank',features);if(!detachedPreviewWindow){alert('El navegador bloqueó la ventana de vista previa. Permite ventanas emergentes para esta página e inténtalo de nuevo.');return}const fitPopup=()=>{try{detachedPreviewWindow.resizeTo(width,height);detachedPreviewWindow.moveTo(left,top)}catch(e){}};fitPopup();setTimeout(fitPopup,80);setTimeout(fitPopup,300);updatePreview();detachedPreviewWindow.focus()}
async function updatePreview(){syncCoverUi();const p=getFormParams();const frame=$('preview-frame');releaseUnusedFiles(p);const html=buildInvitation(p,previewAssets(p));frame.onload=setupGalleryDrag;frame.srcdoc=html;renderDetachedPreview(html)}
function configObject(p){const c={...p,schemaVersion:5,studioVersion:'5.1'};['portadaFile','bannerFile','bannerExtraFile','bannerExtra2File','bgFile','galleryFiles','musicFile','videoPosterFile','transferPhotoFile'].forEach(k=>delete c[k]);return c}
let exportBusy=false;

/* Exportación fotográfica optimizada · v5.6.4
   Todas las imágenes cargadas (portada, banners, fondo, póster, regalo y galería)
   pasan por este optimizador antes de entrar al ZIP. El objetivo es ~1.3 MiB y
   el máximo práctico es 1.4 MiB. Las imágenes que ya pesan <= 1.4 MiB no se
   inflan artificialmente ni se recomprimen. */
const ZIP_IMAGE_TARGET_BYTES=Math.round(1.30*1024*1024);
const ZIP_IMAGE_MAX_BYTES=Math.round(1.40*1024*1024);
const ZIP_IMAGE_MIN_BYTES=Math.round(1.20*1024*1024);

function zipImageSourceExt(file){
  const ext=fileExt(file?.name||'');
  if(ext)return ext;
  const type=String(file?.type||'').toLowerCase();
  if(type==='image/jpeg')return '.jpg';
  if(type==='image/png')return '.png';
  if(type==='image/webp')return '.webp';
  if(type==='image/gif')return '.gif';
  return '.jpg';
}
function zipImageOutputType(file){
  const type=String(file?.type||'').toLowerCase(),ext=zipImageSourceExt(file);
  if(type==='image/png'||ext==='.png')return {mime:'image/png',ext:'.png',quality:false};
  if(type==='image/webp'||ext==='.webp')return {mime:'image/webp',ext:'.webp',quality:true};
  if(type==='image/gif'||ext==='.gif')return {mime:'image/gif',ext:'.gif',quality:false,keep:true};
  return {mime:'image/jpeg',ext:ext==='.jpeg'?'.jpeg':'.jpg',quality:true};
}
function canvasBlob(canvas,mime,quality){
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('No se pudo codificar la imagen.')),mime,quality));
}
async function decodeImageForZip(file){
  if('createImageBitmap' in window){
    try{
      const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
      return {source:bitmap,width:bitmap.width,height:bitmap.height,close:()=>bitmap.close?.()};
    }catch(e){}
  }
  const url=URL.createObjectURL(file);
  try{
    const img=await new Promise((resolve,reject)=>{const el=new Image();el.onload=()=>resolve(el);el.onerror=()=>reject(new Error('Formato de imagen no compatible con el navegador.'));el.src=url});
    return {source:img,width:img.naturalWidth||img.width,height:img.naturalHeight||img.height,close:()=>URL.revokeObjectURL(url)};
  }catch(e){URL.revokeObjectURL(url);throw e}
}
function drawZipCanvas(decoded,width,height,mime){
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(width));canvas.height=Math.max(1,Math.round(height));
  const ctx=canvas.getContext('2d',{alpha:mime!=='image/jpeg'});
  if(mime==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height)}
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(decoded.source,0,0,canvas.width,canvas.height);
  return canvas;
}
async function bestQualityBlob(canvas,mime){
  let low=.42,high=1,best=null,bestDelta=Infinity;
  for(let i=0;i<9;i++){
    const q=(low+high)/2,blob=await canvasBlob(canvas,mime,q),size=blob.size;
    if(size<=ZIP_IMAGE_MAX_BYTES){
      const delta=Math.abs(size-ZIP_IMAGE_TARGET_BYTES);
      if(delta<bestDelta){best=blob;bestDelta=delta}
      low=q;
    }else high=q;
  }
  if(!best){
    const blob=await canvasBlob(canvas,mime,.38);
    if(blob.size<=ZIP_IMAGE_MAX_BYTES)best=blob;
    else return blob;
  }
  return best;
}
async function optimizeImageForZip(file){
  if(!file)return null;
  const sourceExt=zipImageSourceExt(file),kind=zipImageOutputType(file);
  if(kind.keep||file.size<=ZIP_IMAGE_MAX_BYTES)return {blob:file,ext:sourceExt,optimized:false,sourceSize:file.size,finalSize:file.size};
  let decoded;
  try{
    decoded=await decodeImageForZip(file);
    let width=decoded.width,height=decoded.height;
    const maxSide=Math.max(width,height);
    if(maxSide>3600){const scale=3600/maxSide;width=Math.round(width*scale);height=Math.round(height*scale)}
    let blob=null;
    for(let pass=0;pass<7;pass++){
      const canvas=drawZipCanvas(decoded,width,height,kind.mime);
      blob=kind.quality?await bestQualityBlob(canvas,kind.mime):await canvasBlob(canvas,kind.mime);
      canvas.width=1;canvas.height=1;
      if(blob.size<=ZIP_IMAGE_MAX_BYTES)break;
      const ratio=Math.sqrt(ZIP_IMAGE_TARGET_BYTES/blob.size);
      const scale=Math.max(.62,Math.min(.90,ratio*.97));
      width=Math.max(320,Math.round(width*scale));height=Math.max(320,Math.round(height*scale));
    }
    if(blob&&!kind.quality&&blob.size<ZIP_IMAGE_MIN_BYTES&&file.size>ZIP_IMAGE_MAX_BYTES){
      for(let tune=0;tune<3;tune++){
        const grow=Math.min(1.16,Math.sqrt(ZIP_IMAGE_TARGET_BYTES/blob.size)*.995);
        const nextWidth=Math.min(decoded.width,Math.max(width+1,Math.round(width*grow)));
        const nextHeight=Math.min(decoded.height,Math.max(height+1,Math.round(height*grow)));
        if(nextWidth===width&&nextHeight===height)break;
        const canvas=drawZipCanvas(decoded,nextWidth,nextHeight,kind.mime),candidate=await canvasBlob(canvas,kind.mime);canvas.width=1;canvas.height=1;
        if(candidate.size>ZIP_IMAGE_MAX_BYTES)break;
        blob=candidate;width=nextWidth;height=nextHeight;
        if(blob.size>=ZIP_IMAGE_MIN_BYTES)break;
      }
    }
    if(!blob||blob.size>ZIP_IMAGE_MAX_BYTES){
      return {blob:file,ext:sourceExt,optimized:false,sourceSize:file.size,finalSize:file.size};
    }
    return {blob,ext:kind.ext,optimized:true,sourceSize:file.size,finalSize:blob.size};
  }catch(e){
    console.warn('Aura Digital: no se pudo optimizar',file.name,e);
    return {blob:file,ext:sourceExt,optimized:false,sourceSize:file.size,finalSize:file.size};
  }finally{decoded?.close?.()}
}
async function prepareZipImages(p,onProgress){
  const fixed=[
    ['cover','portada',p.portadaFile],['banner','banner',p.bannerFile],['extra','banner-extra',p.bannerExtraFile],
    ['extra2','banner-extra-2',p.bannerExtra2File],['bg','fondo',p.bgFile],['poster','video-poster',p.videoPosterFile],
    ['transferPhoto','regalo-foto',p.transferPhotoFile]
  ];
  const jobs=fixed.filter(x=>x[2]);
  (p.galleryFiles||[]).forEach((f,i)=>jobs.push([`gallery:${i}`,`foto-${i+1}`,f]));
  const result={gallery:new Array((p.galleryFiles||[]).length).fill(null),files:[]};
  for(let i=0;i<jobs.length;i++){
    const [key,name,file]=jobs[i];onProgress?.(i+1,jobs.length,file);
    const prepared=await optimizeImageForZip(file);
    const entry={name:`${name}${prepared.ext}`,blob:prepared.blob,meta:prepared};
    result.files.push(entry);
    if(key.startsWith('gallery:'))result.gallery[Number(key.split(':')[1])]=`assets/${entry.name}`;
    else result[key]=`assets/${entry.name}`;
  }
  return result;
}

async function generateZip(){
  if(exportBusy)return;
  if(!window.JSZip||!window.saveAs){alert('No se cargaron las librerías para generar ZIP. Comprueba que la carpeta js esté junto al index.html.');return}
  exportBusy=true;const button=$('generate-zip'),label=button.textContent;button.disabled=true;button.textContent='Preparando ZIP…';
  try{
    await resolveAllMapUrls();
    const p=getFormParams();
    const prepared=await prepareZipImages(p,(n,total)=>{button.textContent=`Optimizando fotos ${n}/${total}…`});
    const a=zipAssets(p);
    if(p.portadaFile)a.cover=prepared.cover||'';if(p.bannerFile)a.banner=prepared.banner||'';if(p.bannerExtraFile)a.extra=prepared.extra||'';if(p.bannerExtra2File)a.extra2=prepared.extra2||'';if(p.bgFile)a.bg=prepared.bg||'';if(p.videoPosterFile)a.poster=prepared.poster||'';if(p.transferPhotoFile)a.transferPhoto=prepared.transferPhoto||'';a.gallery=prepared.gallery.filter(Boolean);
    const zip=new JSZip();
    zip.file('index.html',buildInvitation(p,a));
    zip.file('config.json',JSON.stringify(configObject(p),null,2));
    for(const r of fontRecords(p,THEMES[p.themeVisual]||THEMES.editorial_cream))zip.file(a.fontBase+r.name,r.data,{base64:true});
    if(typeof AURA_FONT_LICENSES!=='undefined')for(const family of new Set(fontRecords(p,THEMES[p.themeVisual]||THEMES.editorial_cream).map(r=>r.family)))zip.file(a.fontBase+family.replace(/ /g,'-')+'-LICENSE.txt',AURA_FONT_LICENSES[family]);
    const assets=zip.folder('assets');
    for(const entry of prepared.files)assets.file(entry.name,entry.blob);
    if(p.musicFile)assets.file('musica'+fileExt(p.musicFile.name),p.musicFile);
    button.textContent='Empaquetando ZIP…';
    const blob=await zip.generateAsync({type:'blob'});
    saveAs(blob,`invitacion-${(p.title||'aura').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}.zip`);
  }finally{exportBusy=false;button.disabled=false;button.textContent=label}
}
function toConfigUrl(url){let u=String(url||'').trim();if(!u)return'';if(u.includes('github.com/')&&u.includes('/blob/'))u=u.replace('https://github.com/','https://raw.githubusercontent.com/').replace('/blob/','/');u=u.split('#')[0].split('?')[0];if(!u.endsWith('.json')){if(!u.endsWith('/'))u+='/';u+='config.json'}return u}
function applyConfig(cfg){cfg={...COVER_DEFAULTS,...(cfg||{})};for(const [k,v] of Object.entries(THEMES))if(!Array.from($('themeVisual').options).some(o=>o.value===k))$('themeVisual').add(new Option(v.label,k));for(const k of Object.keys(PALETTES))if(!Array.from($('colorPalette').options).some(o=>o.value===k))$('colorPalette').add(new Option(PALETTE_LABELS[k]||k,k));const legacyThemes={boda_elegante:'editorial_cream',xv_glam:'xv_couture',bautizo_pastel:'baptism_air',fiesta_minimal:'contemporary'};if(legacyThemes[cfg.themeVisual])cfg.themeVisual=legacyThemes[cfg.themeVisual];Object.entries(cfg).forEach(([k,v])=>{const el=$(k);if(!el||el.type==='file')return;if(el.type==='checkbox'){el.checked=!!v;return}if(k==='galleryOffsets'&&Array.isArray(v)){el.value=JSON.stringify(v);return}if(el.tagName==='SELECT'&&!Array.from(el.options).some(o=>o.value===String(v))){if(k==='colorPalette')el.value='custom';return}el.value=v??''});renderThemeStrip();renderPaletteStrip();updatePreview();resolveAllMapUrls()}
async function importConfig(){const s=$('configStatus'),u=toConfigUrl($('configUrl').value);if(!u){s.textContent='Pega un enlace.';return}try{s.textContent='Cargando…';const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error(r.status);applyConfig(await r.json());s.textContent='Configuración aplicada ✓'}catch(e){s.textContent='No se pudo cargar';alert('No se pudo leer el config.json. Revisa que el enlace sea público.')}}
function renderPaletteStrip(){syncCollectionOptions();const root=$('palette-strip'),sel=$('colorPalette');root.replaceChildren();const keys=eventCollection().palettes.slice();if(PALETTES[sel.value]&&!keys.includes(sel.value))keys.push(sel.value);for(const k of keys){const colors=PALETTES[k],b=document.createElement('button');b.type='button';b.className='palette-chip'+(sel.value===k?' active':'');b.dataset.palette=k;b.setAttribute('aria-pressed',String(sel.value===k));b.innerHTML=`<span class="palette-swatch" style="background:linear-gradient(90deg,${[colors[4],colors[5],colors[0],colors[2]].map((c,i)=>`${c} ${i*25}%,${c} ${(i+1)*25}%`).join(',')})"></span><span class="palette-name">${esc(PALETTE_LABELS[k]||k)}</span>`;root.appendChild(b)}}
function bindPaletteStrip(){const root=$('palette-strip'),sel=$('colorPalette');if(!root||!sel||root.dataset.bound==='1')return;root.dataset.bound='1';root.addEventListener('click',e=>{const b=e.target.closest('.palette-chip');if(!b||!b.dataset.palette)return;sel.value=b.dataset.palette;applyPalette(b.dataset.palette);renderPaletteStrip()})}
function renderThemeStrip(){syncCollectionOptions();const root=$('theme-strip');root.replaceChildren();const keys=eventCollection().themes.slice();if(THEMES[$('themeVisual').value]&&!keys.includes($('themeVisual').value))keys.push($('themeVisual').value);keys.forEach(k=>{const t=THEMES[k],b=document.createElement('button');b.type='button';b.className='theme-chip'+($('themeVisual').value===k?' active':'');b.dataset.theme=k;b.style.setProperty('--swatch',t.swatch);b.setAttribute('aria-pressed',String($('themeVisual').value===k));b.innerHTML=`<span class="theme-sample sample-${k}"><i>Aa</i><b></b><em></em></span><span>${esc(t.label)}</span>`;b.addEventListener('click',()=>chooseTheme(k));root.appendChild(b)})}
let timer;function queuePreview(){clearTimeout(timer);timer=setTimeout(updatePreview,160)}
document.addEventListener('DOMContentLoaded',()=>{installStudioFonts();initCoverControls(); $('localConfig').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{applyConfig(JSON.parse(await f.text()));$('configStatus').textContent='Configuración aplicada. Vuelve a seleccionar las fotografías y la música.'}catch(err){$('configStatus').textContent='No se pudo leer este archivo JSON.'}e.target.value=''});$('galleryFiles').addEventListener('change',()=>{$('galleryOffsets').value='[]'});$('galleryEditMode').addEventListener('change',()=>{setupGalleryDrag();if(detachedPreviewWindow&&!detachedPreviewWindow.closed)bindGalleryDrag(detachedPreviewWindow.document)});renderThemeStrip();renderPaletteStrip();bindPaletteStrip();bindMapResolver('ceremony');bindMapResolver('reception');$('preset')?.addEventListener('change',e=>applyPreset(e.target.value));$('colorPalette')?.addEventListener('change',e=>{if(e.target.value!=='custom')applyPalette(e.target.value);renderPaletteStrip()});$('themeVisual')?.addEventListener('change',e=>chooseTheme(e.target.value));$('config-form')?.addEventListener('input',e=>{if(e.target.id?.startsWith('github'))return;if(['primaryColor','textColor','headingColor','mutedColor','bgBodyColor','bgContentColor'].includes(e.target.id)){$('colorPalette').value='custom';renderPaletteStrip()}if(e.target.type!=='file'&&e.target.id!=='galleryEditMode'&&e.target.id!=='localConfig')queuePreview()});$('config-form')?.addEventListener('change',e=>{if(e.target.id?.startsWith('github'))return;if(!['galleryEditMode','localConfig'].includes(e.target.id))queuePreview()});$('open-preview-window')?.addEventListener('click',openDetachedPreview);$('update-preview')?.addEventListener('click',updatePreview);$('generate-zip')?.addEventListener('click',()=>generateZip().catch(e=>{console.error(e);alert('No se pudo generar el ZIP.')}));$('btnLoadConfig')?.addEventListener('click',importConfig);$('clearCeremony')?.addEventListener('click',()=>{$('ceremonyText').value='';$('ceremonyUrl').value='';$('ceremonyCoords').value='';setMapStatus('ceremony','');$('showCeremony').checked=false;updatePreview()});$('clearReception')?.addEventListener('click',()=>{$('receptionText').value='';$('receptionUrl').value='';$('receptionCoords').value='';setMapStatus('reception','');$('showReception').checked=false;updatePreview()});updatePreview()});

function bounded(value,fallback,min,max){const n=value===''||value==null?NaN:Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback}
function safeMapLink(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:''}catch(e){return ''}}
function backgroundHtml(p,a){if(!a.bg)return '';return `<div class="invitation-background" aria-hidden="true"><img src="${esc(a.bg)}" alt="" decoding="async"><div class="background-veil"></div></div>`}
function galleryFooter(p,count){return `<div class="gallery-footer"><span>${String(count).padStart(2,'0')} fotografías · Toca para ampliar</span>${['carousel','filmstrip'].includes(p.galleryStyle)?'<div class="gallery-scroll-controls"><button type="button" data-gallery-step="-1" aria-label="Fotos anteriores">←</button><button type="button" data-gallery-step="1" aria-label="Más fotos">→</button></div>':''}</div>`}
function editionCss(p,t,a){return `
html{-webkit-text-size-adjust:100%;text-size-adjust:100%;scrollbar-gutter:stable}
body{isolation:isolate;overflow-wrap:anywhere}
.invitation-background{position:fixed;top:0;left:0;width:100%;height:100vh;height:100lvh;z-index:0;pointer-events:none;overflow:hidden;background:var(--bg)}
.invitation-background img{display:block;width:100%;height:100%;object-fit:${p.bgFit==='contain'?'contain':'cover'};object-position:${bounded(p.bgFocusX,50,0,100)}% ${bounded(p.bgFocusY,50,0,100)}%}
.background-veil{position:absolute;inset:0;background:${rgba(p.bgBodyColor,bounded(p.bgOverlayOpacity,.82,0,1))}}
.hero,.page{z-index:1}.hero{height:auto;min-height:100vh;min-height:100svh;padding:90px 0 110px}.hero-media{transform:none}.hero h1{line-height:1.06;overflow-wrap:anywhere}.hero-inner{max-width:720px}.hero-kicker{line-height:1.6}.scroll-note{width:90%;text-align:center}.section{box-shadow:none;margin-bottom:24px}.content{padding:64px 0 84px}.section h2{text-wrap:balance;line-height:1.13}.section-label{line-height:1.6}.location-head{gap:12px;grid-template-columns:minmax(0,1fr) auto}.location-card{padding:16px;background:var(--loc)}.map-toggle{min-height:44px}.map-external{line-height:1.6;min-height:36px}.date-main{gap:8px;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)}.date-month{font-size:9px;letter-spacing:.05em}.date-year{font-size:9px;letter-spacing:.08em}.date-card{max-width:100%;padding-left:14px;padding-right:14px}.countdown{gap:4px}.count-item{min-width:0}.count-item span{letter-spacing:.08em}
.enter-btn,.rsvp .cta{color:${['outline_thin','glass_soft','text_only'].includes(p.buttonStyle)?'#ffffff':buttonInk(p.primaryColor)}}
${['outline_thin','glass_soft','text_only'].includes(p.buttonStyle)?'.rsvp .cta{color:var(--heading);border-color:var(--accent)}':''}
/* Event collections change composition, not just the palette. */
.design-boda .hero-kicker{letter-spacing:.34em}.design-boda .section:not(.gallery-section){text-align:center}.design-boda .location-head{text-align:left}
.theme-editorial_cream .section{border-width:1px 0;border-radius:0}.theme-editorial_cream .hero-inner::before{content:'';display:block;width:1px;height:54px;background:rgba(255,255,255,.55);margin:0 auto 28px}.theme-editorial_cream .hero p{max-width:28ch}.theme-editorial_cream .ornament{width:36px}
.theme-old_money .hero-inner{outline:1px solid rgba(255,255,255,.25);outline-offset:8px;padding:48px 20px}.theme-old_money .section{border:1px solid ${rgba(p.primaryColor,.4)};border-radius:0}.theme-old_money .section-label{letter-spacing:.32em}
.theme-garden .hero-inner{border:1px solid rgba(255,255,255,.45);border-radius:260px 260px 0 0;padding:70px 24px 42px}.theme-garden .section::before{content:none}.theme-garden .section:not(.gallery-section){border-radius:80px 80px 10px 10px}.theme-garden .hero h1{font-style:italic}
.theme-dark_romance .hero{align-items:end}.theme-dark_romance .hero-inner{border-top:1px solid rgba(255,255,255,.4);padding-top:28px;text-align:left}.theme-dark_romance .hero p{margin-left:0}.theme-dark_romance .date-card.date-auto{background:${rgba(p.primaryColor,.09)}}
.theme-photo_story .hero{align-items:end;padding-bottom:100px}.theme-photo_story .hero-inner{text-align:left}.theme-photo_story .hero h1{max-width:9ch}.theme-photo_story .hero p{margin-left:0}.theme-photo_story .section{border:0;border-radius:0}.theme-photo_story .gallery-section{background:transparent;padding-left:0;padding-right:0}
.theme-xv_couture .hero-kicker::before,.theme-xv_couture .hero-kicker::after{content:none}.theme-xv_couture .hero{align-items:end}.theme-xv_couture .hero-inner{text-align:left;padding-left:20px;border-left:1px solid rgba(255,255,255,.65)}.theme-xv_couture .hero p{margin-left:0}.theme-xv_couture .hero-kicker{letter-spacing:.4em}.theme-xv_couture .section{border-radius:0;border-width:0 0 1px}.theme-xv_couture .section-label{border-bottom:1px solid ${rgba(p.headingColor,.18)};padding-bottom:12px}.theme-xv_couture .date-card.date-auto{box-shadow:none;border-width:1px 0}
.theme-xv_ballet .hero-inner{border-radius:180px 180px 6px 6px;border:1px solid rgba(255,255,255,.5);padding:70px 24px 40px}.theme-xv_ballet .hero h1{font-style:italic}.theme-xv_ballet .section:not(.gallery-section){border-radius:90px 90px 6px 6px;text-align:center;padding-top:54px}.theme-xv_ballet .gallery-section{border-radius:6px}.theme-xv_ballet .location-head{text-align:left}.theme-xv_ballet .date-card.date-auto{border-radius:140px 140px 2px 2px;padding-top:40px}
.theme-xv_nocturne .hero-kicker{border-top:1px solid rgba(255,255,255,.5);border-bottom:1px solid rgba(255,255,255,.5);padding:14px 0}.theme-xv_nocturne .hero h1{text-transform:uppercase;letter-spacing:-.04em}.theme-xv_nocturne .section{border:1px solid ${rgba(p.primaryColor,.3)};background:linear-gradient(135deg,${rgba(p.bgContentColor,bounded(p.contentBgOpacity,.94,0,1))},${rgba(p.bgBodyColor,bounded(p.contentBgOpacity,.94,0,1))})}.theme-xv_nocturne .date-day{font-size:78px}.theme-xv_nocturne .date-card.date-auto{border:0;border-bottom:1px solid var(--accent);background:transparent}
.theme-baptism_air .hero-inner{padding:55px 20px;border-radius:200px 200px 12px 12px;border:1px solid rgba(255,255,255,.45)}.theme-baptism_air .hero h1{font-size:clamp(40px,11vw,72px)}.theme-baptism_air .section{text-align:center;border-radius:44px}.theme-baptism_air .location-head{text-align:left}.theme-baptism_air .date-card.date-auto{border-radius:90px;padding:26px 12px}
.theme-baptism_linen .hero-inner{border-top:1px solid rgba(255,255,255,.5);border-bottom:1px solid rgba(255,255,255,.5);padding:40px 12px}.theme-baptism_linen .hero h1{font-size:clamp(42px,11vw,78px)}.theme-baptism_linen .section{border-width:0 0 1px;text-align:center}.theme-baptism_linen .location-head{text-align:left}.theme-baptism_linen .date-card.date-auto{background:transparent;border-width:1px 0}.theme-baptism_linen .section-label{letter-spacing:.3em}
.theme-party_studio .hero-inner{text-align:left}.theme-party_studio .hero h1{font-weight:600;letter-spacing:-.07em}.theme-party_studio .hero p{margin-left:0}.theme-party_studio .section{border-radius:4px 48px 4px 4px}.theme-party_studio .date-card.date-auto{border:0;border-left:4px solid var(--accent);text-align:left}.theme-party_studio .section h2{font-weight:600;letter-spacing:-.05em}
.theme-grad_edition .hero-inner{text-align:left;border-bottom:1px solid rgba(255,255,255,.55);padding-bottom:26px}.theme-grad_edition .hero h1{text-transform:uppercase;letter-spacing:-.07em;font-weight:600}.theme-grad_edition .hero p{margin-left:0}.theme-grad_edition .section{border:0;border-top:3px solid var(--accent)}.theme-grad_edition .section-label{letter-spacing:.25em}.theme-grad_edition .date-card.date-auto{border:0;background:transparent;padding-left:0;padding-right:0}.theme-grad_edition .date-day{font-weight:600}
.theme-school_atelier .hero-inner{text-align:left;border-left:4px solid rgba(255,255,255,.8);padding-left:24px}.theme-school_atelier .hero h1{font-weight:600;font-size:clamp(38px,10vw,70px)}.theme-school_atelier .hero p{margin-left:0}.theme-school_atelier .section{border:0;border-radius:18px}.theme-school_atelier .section h2{font-weight:600;font-size:clamp(28px,7vw,44px)}.theme-school_atelier .date-card.date-auto{border:0;border-radius:12px}
/* Stable photo layouts. The lightbox always shows the entire original. */
.gallery-section{padding:24px 16px;border-radius:4px}.gallery{gap:10px;min-width:0}.gallery figure{min-height:0;border-radius:2px;position:relative}.gallery img{min-width:0;transition:filter .2s;touch-action:auto}.gallery img:focus-visible{outline:3px solid var(--accent);outline-offset:-4px}.gallery img:hover{filter:brightness(.96)}
.gallery.editorial{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:auto;gap:10px}
.gallery.editorial figure:nth-child(n){grid-column:auto;grid-row:auto;aspect-ratio:3/4}
.gallery.editorial figure:nth-child(3n+1){grid-column:1/-1;aspect-ratio:4/5}
.gallery.editorial figure:last-child:nth-child(3n+2){grid-column:1/-1;aspect-ratio:4/3}
.gallery.square{grid-template-columns:repeat(2,minmax(0,1fr))}.gallery.square figure{aspect-ratio:1}
.gallery.rectangular{grid-template-columns:1fr}.gallery.rectangular figure{aspect-ratio:4/3}
.gallery.masonry{columns:2;column-gap:10px}.gallery.masonry figure{margin-bottom:10px}.gallery.masonry img{height:auto}
.gallery.story{display:grid;grid-template-columns:1fr;gap:22px}.gallery.story figure{overflow:visible}.gallery.story img{height:auto;object-fit:contain}
.gallery.filmstrip,.gallery.carousel{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding:0;scrollbar-width:thin;scrollbar-color:var(--accent) transparent;padding-bottom:12px;overscroll-behavior-x:contain}
.gallery.filmstrip figure,.gallery.carousel figure{flex:0 0 86%;aspect-ratio:3/4;scroll-snap-align:start}
.gallery.polaroid_pro{gap:14px}.gallery.polaroid_pro figure{aspect-ratio:3/4;padding:7px 7px 25px}.gallery.collage{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:150px}.gallery.collage figure{min-height:0}
.gallery-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:15px;color:var(--muted);font-size:9px;letter-spacing:.09em;line-height:1.6}.gallery-scroll-controls{display:flex;gap:6px}.gallery-scroll-controls button{border:1px solid ${rgba(p.headingColor,.22)};background:transparent;color:var(--heading);width:40px;height:40px;cursor:pointer;font-size:18px}
.gallery-lightbox{height:100vh;height:100dvh;bottom:auto;overscroll-behavior:contain;grid-template-rows:auto minmax(0,1fr) auto;touch-action:pan-y pinch-zoom}.gallery-lightbox-top{padding-top:max(12px,env(safe-area-inset-top));padding-left:max(14px,env(safe-area-inset-left));padding-right:max(14px,env(safe-area-inset-right))}.gallery-lightbox-stage{height:100%;min-height:0;min-width:0;padding:8px 48px}.gallery-lightbox-image{display:block;width:100%;height:100%;min-width:0;min-height:0;object-fit:contain;object-position:center;align-self:stretch}.gallery-lightbox-caption{padding-bottom:max(16px,env(safe-area-inset-bottom))}.gallery-lightbox-close,.gallery-lightbox-nav{min-width:44px;min-height:44px}.gallery-lightbox-nav:disabled{opacity:.2;cursor:default}.music-toggle{bottom:max(18px,env(safe-area-inset-bottom));right:max(18px,env(safe-area-inset-right))}
/* Content stays visible if scripts or animation APIs are unavailable. */
.reveal{opacity:1;transform:none}.reveal.reveal-pending{opacity:0;transform:translateY(18px)}.reveal.reveal-pending.in{opacity:1;transform:none}
@media(max-width:480px){.hero{min-height:100svh}.content{padding:40px 0 64px}.section{padding:32px 20px}.gallery-section{padding:20px 12px}.gallery-only{padding:12px}.gallery-lightbox-stage{padding:6px 44px}.location-head{gap:6px}.map-toggle{letter-spacing:.07em;padding-left:6px}.theme-old_money .hero-inner{padding:38px 14px}.theme-garden .hero-inner,.theme-xv_ballet .hero-inner{padding:60px 20px 34px}.date-card.date-heritage,.date-card.date-couture,.date-card.date-arch{padding-left:12px!important;padding-right:12px!important}.count-item b{font-size:26px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}.reveal.reveal-pending{opacity:1;transform:none}}
${p.motionPreset==='none'?'.reveal.reveal-pending{opacity:1;transform:none}':''}
`;}

function invitationRuntime(){
 const ready=()=>{
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const hero=document.querySelector('.hero'),heroInner=document.querySelector('.hero-inner');
  const fitCover=()=>{if(!hero||!heroInner)return;heroInner.style.setProperty('--safe-hero-offset','0px');const box=heroInner.getBoundingClientRect(),outer=hero.getBoundingClientRect(),asked=Number(hero.dataset.offset)||0,reserve=(hero.querySelector('.scroll-note')?64:24),min=outer.top+24-box.top,max=outer.bottom-reserve-box.bottom;heroInner.style.setProperty('--safe-hero-offset',(min<=max?Math.max(min,Math.min(max,asked)):0)+'px')};
  fitCover();document.fonts?.ready.then(fitCover);window.addEventListener('resize',fitCover,{passive:true});
  const gate=document.querySelector('[data-enter]'),audio=document.querySelector('audio');
  gate?.addEventListener('click',()=>{document.querySelector('.page')?.scrollIntoView({behavior:reduced?'auto':'smooth'});audio?.play().catch(()=>{})});
  const background=document.querySelector('.invitation-background');
  if(background&&!window.CSS?.supports('height','100lvh')){
   let width=0;const lock=()=>{if(width!==window.innerWidth){width=window.innerWidth;background.style.height=window.innerHeight+'px'}};
   lock();window.addEventListener('resize',lock,{passive:true});
  }
  if('IntersectionObserver' in window&&!reduced){
   const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}}),{threshold:0});
   document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('reveal-pending');obs.observe(el)});
  }
  const bindDisclosure=(selector,closed,opened)=>document.querySelectorAll(selector).forEach(btn=>btn.addEventListener('click',()=>{
   const panel=document.getElementById(btn.getAttribute('aria-controls'));if(!panel)return;
   const next=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(next));
   const label=btn.querySelector('span:first-child');if(label)label.textContent=next?opened:closed;
   panel.classList.toggle('open',next);
   if(next&&btn.matches('.map-toggle'))requestAnimationFrame(()=>{const frame=panel.querySelector('iframe[data-src]');if(frame&&!frame.getAttribute('src'))frame.setAttribute('src',frame.dataset.src)});
  }));
  bindDisclosure('.map-toggle','Ver mapa','Ocultar mapa');bindDisclosure('.video-toggle','Ver video','Ocultar video');
  const cd=document.querySelector('.countdown');
  if(cd){const target=new Date(cd.dataset.date).getTime();if(Number.isFinite(target)){
   const tick=()=>{const d=Math.max(0,target-Date.now()),values=[Math.floor(d/86400000),Math.floor(d%86400000/3600000),Math.floor(d%3600000/60000),Math.floor(d%60000/1000)];['[data-d]','[data-h]','[data-m]','[data-s]'].forEach((s,i)=>{const el=cd.querySelector(s);if(el)el.textContent=String(values[i]).padStart(2,'0')})};tick();setInterval(tick,1000);
  }}
  document.querySelectorAll('.video-poster').forEach(v=>v.addEventListener('click',()=>{const f=document.createElement('iframe');f.src=v.dataset.video+(v.dataset.video.includes('?')?'&':'?')+'autoplay=1';f.allow='autoplay; fullscreen; picture-in-picture';f.allowFullscreen=true;f.title='Video del evento';v.replaceWith(f)}));
  document.querySelectorAll('[data-gallery-step]').forEach(btn=>btn.addEventListener('click',()=>{const track=btn.closest('.gallery-section').querySelector('.gallery'),item=track.querySelector('figure');if(item)track.scrollBy({left:Number(btn.dataset.galleryStep)*(item.getBoundingClientRect().width+12),behavior:reduced?'auto':'smooth'})}));
  const gallery=Array.from(document.querySelectorAll('.gallery-image'));
  if(gallery.length){
   const lb=document.createElement('div');lb.className='gallery-lightbox';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Visor de fotografías');
   lb.innerHTML='<div class="gallery-lightbox-top"><span class="gallery-lightbox-count" aria-live="polite"></span><button class="gallery-lightbox-close" type="button" aria-label="Cerrar visor">×</button></div><div class="gallery-lightbox-stage"><button class="gallery-lightbox-nav gallery-lightbox-prev" type="button" aria-label="Fotografía anterior">‹</button><img class="gallery-lightbox-image" alt="" draggable="false"><button class="gallery-lightbox-nav gallery-lightbox-next" type="button" aria-label="Fotografía siguiente">›</button></div><div class="gallery-lightbox-caption">Desliza para ver más</div>';
   document.body.appendChild(lb);
   const img=lb.querySelector('img'),count=lb.querySelector('.gallery-lightbox-count'),closeButton=lb.querySelector('.gallery-lightbox-close'),prev=lb.querySelector('.gallery-lightbox-prev'),next=lb.querySelector('.gallery-lightbox-next');
   let index=0,touch=null,returnFocus=null,overflow='',bodyOverflow='',opened=false;
   const show=i=>{index=(i+gallery.length)%gallery.length;img.src=gallery[index].currentSrc||gallery[index].src;img.alt=gallery[index].alt||'Fotografía';count.textContent=String(index+1).padStart(2,'0')+' / '+String(gallery.length).padStart(2,'0')};
   const close=()=>{if(!opened)return;opened=false;lb.classList.remove('open');lb.hidden=true;document.documentElement.style.overflow=overflow;document.body.style.overflow=bodyOverflow;returnFocus?.focus({preventScroll:true})};
   const open=i=>{if(opened)return;returnFocus=document.activeElement;overflow=document.documentElement.style.overflow;bodyOverflow=document.body.style.overflow;show(i);opened=true;lb.hidden=false;lb.classList.add('open');document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';closeButton.focus({preventScroll:true})};
   gallery.forEach((g,i)=>{
    g.addEventListener('click',e=>{if(g.dataset.editing==='1'||e.defaultPrevented)return;open(i)});
    g.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&g.dataset.editing!=='1'){e.preventDefault();open(i)}});
   });
   closeButton.addEventListener('click',close);prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));
   if(gallery.length===1){prev.disabled=true;next.disabled=true;lb.querySelector('.gallery-lightbox-caption').textContent='Fotografía completa'}
   lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('gallery-lightbox-stage'))close()});
   lb.addEventListener('touchstart',e=>{touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null},{passive:true});
   lb.addEventListener('touchmove',e=>{if(e.touches.length>1)touch=null},{passive:true});
   lb.addEventListener('touchcancel',()=>{touch=null},{passive:true});
   lb.addEventListener('touchend',e=>{if(!touch||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3)show(index+(dx<0?1:-1))},{passive:true});
   document.addEventListener('keydown',e=>{if(!opened)return;if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1)}if(e.key==='ArrowRight'){e.preventDefault();show(index+1)}if(e.key==='Tab'){const buttons=Array.from(lb.querySelectorAll('button:not(:disabled)')),first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  }
  document.querySelectorAll('[data-copy-account]').forEach(btn=>btn.addEventListener('click',async()=>{const value=btn.getAttribute('data-copy-account')||'';if(!value)return;const label=btn.querySelector('em'),before=label?.textContent||'Copiar número';let copied=false;try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(value);copied=true}}catch(e){}if(!copied){const ta=document.createElement('textarea');ta.value=value;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();try{copied=document.execCommand('copy')!==false}catch(_){}ta.remove()}if(label)label.textContent=copied?'Copiado ✓':'Selecciona y copia';setTimeout(()=>{if(label)label.textContent=before},1800)}));
  const music=document.querySelector('.music-toggle');music?.addEventListener('click',()=>{if(!audio)return;if(audio.paused){audio.play().then(()=>{music.textContent='Ⅱ'}).catch(()=>{})}else{audio.pause();music.textContent='♪'}});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
}

function bindGalleryDrag(doc){
 if(!doc)return;const enabled=$('galleryEditMode')?.checked,imgs=Array.from(doc.querySelectorAll('.gallery-image'));
 imgs.forEach(img=>{
  const canCrop=!img.closest('.story,.masonry');img.dataset.editing=enabled&&canCrop?'1':'0';img.style.cursor=enabled&&canCrop?'ns-resize':'zoom-in';img.style.touchAction=enabled&&canCrop?'none':'auto';
  if(img.dataset.dragBound)return;img.dataset.dragBound='1';
  img.addEventListener('dragstart',e=>e.preventDefault());
  img.addEventListener('pointerdown',e=>{
   if(img.dataset.editing!=='1'||(e.pointerType==='mouse'&&e.button!==0))return;
   const id=e.pointerId,startY=e.clientY,start=bounded(img.dataset.focusY,50,0,100);let moved=false;
   e.preventDefault();img.setPointerCapture?.(id);
   const move=ev=>{if(ev.pointerId!==id)return;const delta=ev.clientY-startY;if(!moved&&Math.abs(delta)<6)return;moved=true;const n=bounded(start+delta/180*100,50,0,100);img.dataset.focusY=String(n);img.style.objectPosition='center '+n+'%'};
   const finish=ev=>{if(ev.pointerId!==id)return;img.removeEventListener('pointermove',move);img.removeEventListener('pointerup',finish);img.removeEventListener('pointercancel',cancel);img.removeEventListener('lostpointercapture',cancel);if(img.hasPointerCapture?.(id))img.releasePointerCapture(id);if(moved)$('galleryOffsets').value=JSON.stringify(imgs.map(x=>Math.round(bounded(x.dataset.focusY,50,0,100)*10)/10))};
   const cancel=ev=>{img.dataset.focusY=String(start);img.style.objectPosition='center '+start+'%';moved=false;finish(ev)};
   img.addEventListener('pointermove',move);img.addEventListener('pointerup',finish);img.addEventListener('pointercancel',cancel);img.addEventListener('lostpointercapture',cancel);
  });
 });
}

function saveAs(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}

function chooseTheme(k){const t=THEMES[k];if(!t)return;const c=eventCollection(),palette=c.palettes.includes(t.palette)?t.palette:c.palettes[0];$('themeVisual').value=k;$('colorPalette').value=palette;applyPalette(palette);renderThemeStrip();renderPaletteStrip();updatePreview()}

const fontUrls=new Map();
function fontRecords(p,t){if(typeof AURA_FONTS==='undefined')return [];const families=[t.display,t.body,FONT_MAP[p.fontPreset],FONT_MAP[p.heroTitleFont],COVERS[p.heroLayout]?.font,"'Italiana'"];return AURA_FONTS.filter(r=>families.some(f=>f&&f.includes("'"+r.family+"'")))}
function fontObjectUrl(r){if(!fontUrls.has(r.name)){const bytes=Uint8Array.from(atob(r.data),c=>c.charCodeAt(0));fontUrls.set(r.name,URL.createObjectURL(new Blob([bytes],{type:'font/woff2'})))}return fontUrls.get(r.name)}
function fontRules(records,base){return records.map(r=>`@font-face{font-family:'${r.family}';font-style:${r.style};font-weight:${r.weight};font-display:swap;src:url('${base?base+r.name:fontObjectUrl(r)}') format('woff2')}`).join('\n')}
function fontCss(p,t,a){return fontRules(fontRecords(p,t),a.fontBase||'')}
function installStudioFonts(){if(typeof AURA_FONTS==='undefined')return;const style=document.createElement('style');style.textContent=fontRules(AURA_FONTS.filter(r=>['DM Sans','Manrope','Italiana','Playfair Display','Cormorant Garamond','Great Vibes'].includes(r.family)),'');document.head.appendChild(style)}

function buttonInk(hex){const s=String(hex||'#000000').replace('#','');const channels=[0,2,4].map(i=>parseInt(s.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));const l=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;return (l+.05)/.058>1.05/(l+.05)?'#171717':'#ffffff'}

const COVER_DEFAULTS={designCollection:'event',heroLayout:'theme',heroLabelText:'',heroLabelSize:'auto',showHeroLabel:true,showHeroButton:true,showHeroScroll:true,heroTitleFont:'default',heroTextColor:'#ffffff',heroPosition:'auto',heroAlignment:'auto',heroBlockPosition:'auto',heroWidth:86,heroSpacing:'',heroTitleLeading:'',heroTitleTracking:'',heroOrder:'classic'};
const COVERS={
 theme:{label:'Original',description:'Conserva la portada original del tema. Puedes ajustar su texto y acomodo.',font:''},
 silence:{label:'Silencio',description:'Nombre protagonista, composición centrada y líneas finas. Editorial y sereno.',font:"'Italiana',serif"},
 atelier:{label:'Atelier',description:'Tipografía editorial y texto en la parte inferior izquierda. Deja respirar la fotografía.',font:"'Playfair Display',serif"},
 double_frame:{label:'Doble marco',description:'Dos líneas delicadas enmarcan los nombres. Una composición clásica y sobria.',font:"'Cormorant Garamond',serif"},
 arch:{label:'Arco',description:'Un arco fino envuelve el texto. Romántico, limpio y sin ilustraciones añadidas.',font:"'Cormorant Garamond',serif"},
 signature:{label:'Firma',description:'Caligrafía para los nombres y texto secundario discreto. Ideal con títulos breves.',font:"'Great Vibes',cursive"},
 veil:{label:'Velo',description:'Una tarjeta translúcida y un desenfoque suave detrás del texto. Contemporáneo y discreto.',font:"'Italiana',serif"}
};
function coverKey(p){return COVERS[p.heroLayout]?p.heroLayout:'theme'}
function themeFamily(key){return Object.entries(COLLECTIONS).find(([,c])=>c.themes.includes(key))?.[0]||'none'}
function eventLabel(type){return {boda:'Nuestra boda',xv:'Mis XV años',bautizo:'Con amor y fe',cumple:'Celebremos',graduacion:'Graduación',escolar:'Nuestra comunidad'}[type]||'Tenemos algo que celebrar'}
function coverHtml(params){
 const p={...COVER_DEFAULTS,...params},key=coverKey(p);
 const parts={label:p.showHeroLabel?`<div class="hero-kicker"${sizeAttr(p.heroLabelSize,'sectionLabel')}>${esc(p.heroLabelText.trim()||eventLabel(p.preset))}</div>`:'',title:p.title?.trim()?`<h1${sizeAttr(p.titleSize,'heroTitle')}>${esc(p.title)}</h1>`:'',phrase:p.subtitle?.trim()?`<p${sizeAttr(p.subtitleSize,'heroSubtitle')}>${esc(p.subtitle)}</p>`:''};
 const sequence=p.heroOrder==='phrase_first'?['label','phrase','title']:['label','title','phrase'];
 return `<header class="hero cover-${key}${key!=='theme'?' cover-designed':''}" data-order="${p.heroOrder==='phrase_first'?'phrase_first':'classic'}" data-offset="${bounded(p.heroOffset,0,-200,200)}"><div class="hero-media"></div><div class="hero-overlay"></div><div class="hero-inner">${sequence.map(k=>parts[k]).join('')}${p.showHeroButton?`<button type="button" class="enter-btn"${sizeAttr(p.buttonTextSize,'button')} data-enter>${esc(p.buttonText||'Ver invitación')} <span aria-hidden="true">↓</span></button>`:''}</div>${p.showHeroScroll?'<div class="scroll-note">Desliza para descubrir</div>':''}</header>`
}
function coverCss(params){
 const p={...COVER_DEFAULTS,...params},key=coverKey(p),customFont=FONT_MAP[p.heroTitleFont],font=customFont||COVERS[key].font;
 const align=['left','center','right'].includes(p.heroAlignment)?p.heroAlignment:'';
 const place=['start','center','end'].includes(p.heroPosition)?p.heroPosition:'';
 const horizontal=['start','center','end'].includes(p.heroBlockPosition)?p.heroBlockPosition:'';
 const border=rgba(p.heroTextColor,.5);
 return `
.hero{--cover-ink:${p.heroTextColor};--cover-line:${border}}
.hero .hero-inner{width:min(${bounded(p.heroWidth,86,55,94)}%,720px);color:var(--cover-ink);transform:translateY(var(--safe-hero-offset,0px))}
.hero h1{white-space:pre-line}.hero .hero-inner>p{white-space:pre-line}.hero .hero-kicker{white-space:pre-line}.hero .hero-kicker:empty{display:none}.hero .scroll-note{color:var(--cover-ink)}
/* Additional covers override only the text composition; the image stays untouched. */
.hero.cover-designed{align-items:center;justify-items:center;padding:96px 0 104px}
.hero.cover-designed .hero-inner{border:0;outline:0;border-radius:0;background:none;padding:0;text-align:center;box-shadow:none}
.hero.cover-designed .hero-inner::before,.hero.cover-designed .hero-inner::after{content:none}
.hero.cover-designed .hero-kicker{border:0;padding:0;letter-spacing:.27em;line-height:1.6;margin:0 0 24px}
.hero.cover-designed .hero-kicker::before,.hero.cover-designed .hero-kicker::after{content:none}
.hero.cover-designed h1{font-size:clamp(44px,12vw,86px);line-height:1.1;letter-spacing:-.035em;max-width:none;text-transform:none;font-weight:400;font-style:normal}
.hero.cover-designed .hero-inner>p{margin:24px auto 0;max-width:32ch;line-height:1.8}
.hero.cover-designed .enter-btn{margin-top:32px}
.hero.cover-silence .hero-inner{padding:30px 0;border-top:1px solid var(--cover-line);border-bottom:1px solid var(--cover-line)}
.hero.cover-silence h1{letter-spacing:-.045em}
.hero.cover-atelier{align-items:end}.hero.cover-atelier .hero-inner{text-align:left;padding:0 0 0 20px;border-left:1px solid var(--cover-line)}
.hero.cover-atelier .hero-inner>p{margin-left:0}.hero.cover-atelier h1{font-size:clamp(42px,11.5vw,84px);line-height:1.1}
.hero.cover-double_frame .hero-inner{border:1px solid var(--cover-line);outline:1px solid var(--cover-line);outline-offset:7px;padding:40px 20px}
.hero.cover-double_frame .hero-kicker{letter-spacing:.2em}.hero.cover-double_frame h1{font-size:clamp(46px,12vw,92px)}
.hero.cover-arch .hero-inner{border:1px solid var(--cover-line);border-radius:220px 220px 4px 4px;padding:70px 24px 40px}
.hero.cover-arch h1{font-size:clamp(44px,12vw,88px)}
.hero.cover-signature .hero-inner{padding:24px 10px}.hero.cover-signature h1{font-size:clamp(48px,14vw,102px);line-height:1.3;letter-spacing:0;padding:0 8px}
.hero.cover-signature .hero-inner>p{max-width:28ch}.hero.cover-signature .hero-kicker{font-size:9px;letter-spacing:.32em}
.hero.cover-veil{align-items:end}.hero.cover-veil .hero-inner{padding:32px 24px;border:1px solid ${rgba(p.heroTextColor,.25)};background:rgba(255,255,255,.09);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-radius:4px}
.hero.cover-veil h1{font-size:clamp(42px,11vw,80px)}.hero.cover-veil .hero-kicker{letter-spacing:.3em}
/* Preserve spacing when the phrase precedes the title or optional items are hidden. */
.hero[data-order="phrase_first"] .hero-inner>p{margin-top:0;margin-bottom:24px}
.hero[class] .hero-inner>:first-child{margin-top:0}.hero[class] .hero-inner>:last-child{margin-bottom:0}
/* Manual settings take precedence over the selected theme and cover. */
${font?`.hero .hero-inner h1{font-family:${font}}`:''}
${align?`.hero[class] .hero-inner{text-align:${align}}.hero[class] .hero-inner>p{margin-left:${align==='left'?'0':'auto'};margin-right:${align==='right'?'0':'auto'}}`:''}
${place?`.hero[class]{align-items:${place}}`:''}
${horizontal?`.hero .hero-inner{justify-self:${horizontal};${horizontal!=='center'?'margin-inline:3%;':''}}`:''}
${p.heroSpacing!==''?`.hero[class] .hero-inner.hero-inner>*{margin-top:0;margin-bottom:0}.hero[class] .hero-inner.hero-inner>*+*{margin-top:${bounded(p.heroSpacing,24,0,72)}px}`:''}
${p.heroTitleLeading!==''?`.hero .hero-inner h1{line-height:${bounded(p.heroTitleLeading,1.1,.9,1.6)}}`:''}
${p.heroTitleTracking!==''?`.hero .hero-inner h1{letter-spacing:${bounded(p.heroTitleTracking,-.035,-.08,.15)}em}`:''}
@media(max-width:380px){.hero.cover-double_frame .hero-inner{padding:32px 16px}.hero.cover-arch .hero-inner{padding:64px 18px 32px}.hero.cover-veil .hero-inner{padding:28px 18px}}
`;}
function syncCoverUi(){
 const root=$('cover-strip');if(!root)return;
 if(!root.children.length)for(const [key,item] of Object.entries(COVERS)){
  const b=document.createElement('button');b.type='button';b.className='cover-choice';b.dataset.cover=key;b.innerHTML=`<span class="cover-mini mini-${key}" aria-hidden="true"><i>Aa</i><b></b><em></em></span><span>${esc(item.label)}</span>`;
  b.addEventListener('click',()=>{$('heroLayout').value=key;syncCoverUi();updatePreview()});root.appendChild(b);
 }
 root.querySelectorAll('button').forEach(b=>{const active=b.dataset.cover===$('heroLayout').value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 $('cover-description').textContent=(COVERS[$('heroLayout').value]||COVERS.theme).description;
 const show=$('showHeroLabel').checked;$('heroLabelText').disabled=!show;$('heroLabelSize').disabled=!show;
 $('hero-label-hint').textContent=show?'Si lo dejas vacío: '+eventLabel($('preset').value):'La etiqueta no aparecerá ni dejará un espacio vacío.';
}
function initCoverControls(){
 $('designCollection').addEventListener('change',()=>{renderThemeStrip();renderPaletteStrip()});
 $('reset-cover-layout').addEventListener('click',()=>{for(const id of ['heroPosition','heroAlignment','heroBlockPosition','heroWidth','heroSpacing','heroTitleLeading','heroTitleTracking','heroTitleFont','heroTextColor'])$(id).value=COVER_DEFAULTS[id];$('heroOffset').value=0;updatePreview()});
 syncCoverUi();
}

/* =========================
   Aura Digital 5.2 layer
   Additive overrides preserve the proven 5.1 map, fixed background,
   lightbox and export plumbing while extending the editor and invitation.
   ========================= */
Object.assign(COVER_DEFAULTS,{
 continuityStyle:'editorial',showFamily:true,familyLabel:'Con el cariño de',familyHeading:'Quienes nos acompañan desde el corazón',parentsLabel:'Papás',parentsText:'',godparentsLabel:'Padrinos',godparentsText:'',familyTextSize:'auto',orderFamily:'2',showClosingSignature:true,closingSignature:'',closingSignatureFont:'script_greatvibes'
});
Object.assign(COVERS,{
 masthead:{label:'Masthead',description:'Composición inspirada en una portada de revista: gran título, etiqueta mínima y mucho aire.',font:"'Italiana',serif"},
 split:{label:'Split',description:'Bloque asimétrico dividido por una línea fina. Editorial, contemporáneo y especialmente útil con retratos.',font:"'Playfair Display',serif"},
 cinema:{label:'Cinema',description:'Encuadre de fotograma con texto contenido y contraste alto. Dramático sin alterar la fotografía.',font:"'DM Sans',sans-serif"},
 monogram:{label:'Monograma',description:'Inicial editorial, líneas finas y composición quiet luxury. Funciona igual para boda, XV, bautizo o cualquier evento.',font:"'Cormorant Garamond',serif"}
});

const _getFormParams51=getFormParams;
getFormParams=function(){
 const o=_getFormParams51();
 ['continuityStyle','familyLabel','familyHeading','parentsLabel','parentsText','godparentsLabel','godparentsText','familyTextSize','orderFamily','closingSignature','closingSignatureFont'].forEach(id=>o[id]=$(id)?.value??COVER_DEFAULTS[id]??'');
 o.showFamily=$('showFamily')?.checked??true;
 o.showClosingSignature=$('showClosingSignature')?.checked??true;
 return o;
};

const _fontRecords51=fontRecords;
fontRecords=function(p,t){
 const base=_fontRecords51(p,t),wanted=FONT_MAP[p.closingSignatureFont];
 if(typeof AURA_FONTS==='undefined'||!wanted)return base;
 const extra=AURA_FONTS.filter(r=>wanted.includes("'"+r.family+"'"));
 const seen=new Set(base.map(r=>r.name));
 return base.concat(extra.filter(r=>!seen.has(r.name)));
};

const _coverHtml51=coverHtml;
coverHtml=function(params){
 const p={...COVER_DEFAULTS,...params},key=coverKey(p);
 const parts={
  label:p.showHeroLabel?`<div class="hero-kicker" data-edit="heroLabelText"${sizeAttr(p.heroLabelSize,'sectionLabel')}>${esc(p.heroLabelText.trim()||eventLabel(p.preset))}</div>`:'',
  title:p.title?.trim()?`<h1 data-edit="title"${sizeAttr(p.titleSize,'heroTitle')}>${esc(p.title)}</h1>`:'',
  phrase:p.subtitle?.trim()?`<p data-edit="subtitle"${sizeAttr(p.subtitleSize,'heroSubtitle')}>${esc(p.subtitle)}</p>`:''
 };
 const sequence=p.heroOrder==='phrase_first'?['label','phrase','title']:['label','title','phrase'];
 const text=sequence.map(k=>parts[k]).join('');
 const action=p.showHeroButton?`<button type="button" class="enter-btn" data-edit="buttonText"${sizeAttr(p.buttonTextSize,'button')} data-enter>${esc(p.buttonText||'Ver invitación')} <span aria-hidden="true">↓</span></button>`:'';
 const adapted=!!action&&['silence','atelier','double_frame','arch','veil','monogram'].includes(key);
 const manualActionAlign=['left','center','right'].includes(p.heroAlignment)?p.heroAlignment:'';
 const naturalActionAlign={silence:'center',atelier:'left',double_frame:'center',arch:'center',signature:'center',veil:'center',masthead:'left',split:'left',cinema:'left',monogram:'center'}[key]||'';
 const actionAlign=manualActionAlign||naturalActionAlign;
 const classes=`hero cover-${key}${key!=='theme'?' cover-designed':''}${adapted?' hero-button-adapted':''}${action&&actionAlign?` hero-action-${actionAlign}`:''}`;
 if(adapted)return `<header class="${classes}" data-order="${p.heroOrder==='phrase_first'?'phrase_first':'classic'}" data-offset="${bounded(p.heroOffset,0,-200,200)}"><div class="hero-media"></div><div class="hero-overlay"></div><div class="hero-inner"><div class="hero-copy">${text}</div>${action}</div>${p.showHeroScroll?'<div class="scroll-note">Desliza para descubrir</div>':''}</header>`;
 return `<header class="${classes}" data-order="${p.heroOrder==='phrase_first'?'phrase_first':'classic'}" data-offset="${bounded(p.heroOffset,0,-200,200)}"><div class="hero-media"></div><div class="hero-overlay"></div><div class="hero-inner">${text}${action}</div>${p.showHeroScroll?'<div class="scroll-note">Desliza para descubrir</div>':''}</header>`;
};

const _coverCss51=coverCss;
coverCss=function(params){
 const p={...COVER_DEFAULTS,...params};
 const horizontal=['start','center','end'].includes(p.heroBlockPosition)?p.heroBlockPosition:'';
 return _coverCss51(p)+`
.hero.cover-masthead{align-items:start;padding-top:112px}.hero.cover-masthead .hero-inner{width:min(88%,760px);padding-top:18px;border-top:1px solid var(--cover-line)}.hero.cover-masthead .hero-kicker{text-align:left;margin-bottom:54px}.hero.cover-masthead h1{font-size:clamp(58px,16vw,116px);line-height:.84;letter-spacing:-.055em;text-align:left;text-transform:uppercase}.hero.cover-masthead .hero-inner>p{text-align:left;margin-left:0;max-width:29ch}.hero.cover-masthead .enter-btn{display:flex;width:max-content;margin-left:0}
.hero.cover-split{align-items:end;padding-bottom:102px}.hero.cover-split .hero-inner{display:grid;grid-template-columns:44% 1fr;grid-template-areas:'kicker title' 'phrase title' 'button button';gap:16px 24px;align-items:end;text-align:left;width:min(90%,760px)}.hero.cover-split .hero-kicker{grid-area:kicker;margin:0;padding-bottom:12px;border-bottom:1px solid var(--cover-line)}.hero.cover-split h1{grid-area:title;border-left:1px solid var(--cover-line);padding-left:24px;font-size:clamp(48px,12vw,88px);line-height:.94}.hero.cover-split .hero-inner>p{grid-area:phrase;margin:0;max-width:24ch}.hero.cover-split .enter-btn{grid-area:button;justify-self:start;margin:10px 0 0;width:max-content;max-width:100%}
.hero.cover-cinema{align-items:end;padding:72px 0 86px}.hero.cover-cinema::before,.hero.cover-cinema::after{content:'';position:absolute;z-index:1;left:0;right:0;height:36px;background:rgba(0,0,0,.76)}.hero.cover-cinema::before{top:0}.hero.cover-cinema::after{bottom:0}.hero.cover-cinema .hero-inner{text-align:left;width:min(88%,720px);border-left:2px solid var(--cover-line);padding-left:18px}.hero.cover-cinema .hero-kicker{font-family:var(--body);letter-spacing:.22em;margin-bottom:14px}.hero.cover-cinema h1{font-family:var(--body);font-weight:600;text-transform:uppercase;font-size:clamp(42px,11vw,80px);line-height:.9;letter-spacing:-.05em}.hero.cover-cinema .hero-inner>p{margin-left:0;max-width:30ch}.hero.cover-cinema .enter-btn{margin-left:0}
.hero.cover-monogram .hero-inner{padding:68px 22px 34px;border-top:1px solid var(--cover-line);border-bottom:1px solid var(--cover-line)}.hero.cover-monogram .hero-inner::before{content:'A';position:absolute;top:18px;left:50%;transform:translateX(-50%);width:36px;height:36px;display:grid;place-items:center;border:1px solid var(--cover-line);border-radius:50%;font:20px/1 'Cormorant Garamond',serif;color:var(--cover-ink)}.hero.cover-monogram h1{font-size:clamp(46px,12vw,92px);letter-spacing:-.02em}.hero.cover-monogram .hero-kicker{margin-bottom:20px}
/* Adaptive button treatments. The outer .hero-inner keeps the original cover geometry;
   only the decorative treatment moves to .hero-copy, so the button cannot enter the frame, arch or blur card. */
.hero.hero-button-adapted .hero-copy{width:100%}
.hero.hero-button-adapted .hero-copy>p{white-space:pre-line;margin:24px auto 0;max-width:32ch;line-height:1.8}
.hero.hero-button-adapted[data-order="phrase_first"] .hero-copy>p{margin-top:0;margin-bottom:24px}
.hero.hero-button-adapted .hero-copy>:first-child{margin-top:0}.hero.hero-button-adapted .hero-copy>:last-child{margin-bottom:0}
.hero.hero-button-adapted.cover-silence .hero-inner{padding:0;border:0}
.hero.hero-button-adapted.cover-silence .hero-copy{padding:30px 0;border-top:1px solid var(--cover-line);border-bottom:1px solid var(--cover-line)}
.hero.hero-button-adapted.cover-atelier .hero-inner{padding:0;border-left:0;text-align:left}
.hero.hero-button-adapted.cover-atelier .hero-copy{padding:0 0 0 20px;border-left:1px solid var(--cover-line)}
.hero.hero-button-adapted.cover-atelier .hero-copy>p{margin-left:0;margin-right:auto}
.hero.hero-button-adapted.cover-atelier .enter-btn{margin-left:20px}
.hero.hero-button-adapted.cover-double_frame .hero-inner{padding:0;border:0;outline:0}
.hero.hero-button-adapted.cover-double_frame .hero-copy{border:1px solid var(--cover-line);outline:1px solid var(--cover-line);outline-offset:7px;padding:40px 20px}
.hero.hero-button-adapted.cover-arch .hero-inner{padding:0;border:0;border-radius:0}
.hero.hero-button-adapted.cover-arch .hero-copy{border:1px solid var(--cover-line);border-radius:220px 220px 4px 4px;padding:70px 24px 40px}
.hero.hero-button-adapted.cover-veil .hero-inner{padding:0;border:0;background:none;-webkit-backdrop-filter:none;backdrop-filter:none;border-radius:0}
.hero.hero-button-adapted.cover-veil .hero-copy{padding:32px 24px;border:1px solid ${rgba(p.heroTextColor,.25)};background:rgba(255,255,255,.09);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-radius:4px}
.hero.hero-button-adapted.cover-monogram .hero-inner{padding:0;border:0}
.hero.hero-button-adapted.cover-monogram .hero-inner::before{content:none}
.hero.hero-button-adapted.cover-monogram .hero-copy{position:relative;padding:68px 22px 34px;border-top:1px solid var(--cover-line);border-bottom:1px solid var(--cover-line)}
.hero.hero-button-adapted.cover-monogram .hero-copy::before{content:'A';position:absolute;top:18px;left:50%;transform:translateX(-50%);width:36px;height:36px;display:grid;place-items:center;border:1px solid var(--cover-line);border-radius:50%;font:20px/1 'Cormorant Garamond',serif;color:var(--cover-ink)}
${p.heroSpacing!==''?`.hero.hero-button-adapted .hero-copy>*{margin-top:0;margin-bottom:0}.hero.hero-button-adapted .hero-copy>*+*{margin-top:${bounded(p.heroSpacing,24,0,72)}px}`:''}
${['left','center','right'].includes(p.heroAlignment)?`.hero.hero-button-adapted .hero-copy>p{margin-left:${p.heroAlignment==='left'?'0':'auto'};margin-right:${p.heroAlignment==='right'?'0':'auto'}}`:''}
/* The action follows the editorial direction of each cover instead of staying at the generic center. */
.hero.cover-designed .enter-btn{width:max-content}
.hero.cover-designed.hero-action-left:not(.cover-split) .enter-btn{display:flex;margin-left:0;margin-right:auto}
.hero.cover-designed.hero-action-center:not(.cover-split) .enter-btn{display:flex;margin-left:auto;margin-right:auto}
.hero.cover-designed.hero-action-right:not(.cover-split) .enter-btn{display:flex;margin-left:auto;margin-right:0}
.hero.cover-atelier.hero-action-left .enter-btn{margin-left:20px;margin-right:auto}
.hero.cover-masthead.hero-action-left .hero-inner,.hero.cover-cinema.hero-action-left .hero-inner{ text-align:left }
.hero.cover-split.hero-action-left .hero-inner,.hero.cover-split.hero-action-center .hero-inner,.hero.cover-split.hero-action-right .hero-inner{grid-template-areas:'kicker title' 'phrase title' 'button button'}
.hero.cover-split.hero-action-left .enter-btn{grid-area:button;justify-self:start;margin:10px 0 0;max-width:100%}
.hero.cover-split.hero-action-center .enter-btn{grid-area:button;justify-self:center;margin:10px 0 0;max-width:100%}
.hero.cover-split.hero-action-right .enter-btn{grid-area:button;justify-self:end;margin:10px 0 0;max-width:100%}
@media(max-width:380px){.hero.hero-button-adapted.cover-double_frame .hero-copy{padding:32px 16px}.hero.hero-button-adapted.cover-arch .hero-copy{padding:64px 18px 32px}.hero.hero-button-adapted.cover-veil .hero-copy{padding:28px 18px}}
@media(max-width:410px){.hero.cover-split .hero-inner{grid-template-columns:40% 1fr;gap:12px 16px}.hero.cover-split h1{padding-left:16px}.hero.cover-split .enter-btn{white-space:normal;text-align:center;line-height:1.35}.hero.cover-masthead h1{font-size:clamp(52px,15vw,86px)}}
`;
};

const _invitationCss51=invitationCss;
invitationCss=function(p,t,a){
 const continuity=p.continuityStyle||'editorial';
 const continuityCss=continuity==='none'?'':continuity==='soft'?`
.content>.section{position:relative;box-shadow:0 16px 44px ${rgba(p.headingColor,.045)}}
.content>.section+.section{margin-top:22px}
.content>.section::before{content:'';position:absolute;top:-12px;left:50%;width:5px;height:5px;border-radius:50%;background:var(--accent);transform:translateX(-50%);opacity:.65}
`:`
.content>.section{position:relative}.content>.section:not(:last-child)::after{content:'';display:block;width:min(34%,128px);height:1px;margin:44px auto -18px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:.52}
.content>.section-label{letter-spacing:.28em}.banner{position:relative}.banner::after{content:'';position:absolute;left:50%;bottom:-18px;width:1px;height:36px;background:var(--accent);opacity:.48}
`;
 return _invitationCss51(p,t,a)+`
${continuityCss}
.family-section{text-align:center}.family-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:30px}.family-card{min-height:180px;padding:30px 20px;border:1px solid ${rgba(p.primaryColor,.32)};display:flex;flex-direction:column;align-items:center;justify-content:center;background:${rgba(p.bgContentColor,Math.min(1,bounded(p.contentBgOpacity,.94,0,1)+.02))}}.family-card small{font-size:8px;letter-spacing:.26em;text-transform:uppercase;color:var(--muted);margin-bottom:15px}.family-card strong{font-family:var(--display);font-size:clamp(24px,6vw,38px);font-weight:400;line-height:1.25;color:var(--heading);white-space:pre-line}.family-equal-note{width:42px;height:1px;background:var(--accent);margin:24px auto 0;opacity:.58}
.closing-signature{margin:28px auto 0;text-align:center;max-width:90%;color:var(--heading)}.closing-signature::before{content:'';display:block;width:54px;height:1px;margin:0 auto 16px;background:var(--accent);opacity:.55}.closing-signature span{display:block;white-space:pre-line}
.gallery.narrative{display:flex;flex-direction:column;gap:28px}.gallery.narrative figure{position:relative;width:88%;margin:0;aspect-ratio:auto!important;background:transparent;overflow:visible}.gallery.narrative figure:nth-child(even){align-self:flex-end}.gallery.narrative figure:nth-child(3n+1){width:100%}.gallery.narrative figure img{display:block;width:100%;height:auto!important;max-height:none;object-fit:contain!important;background:transparent}.gallery.narrative figcaption{display:flex;align-items:center;gap:10px;margin-top:9px;font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}.gallery.narrative figcaption::before{content:'';width:28px;height:1px;background:var(--accent);opacity:.6}.gallery.narrative figure:nth-child(even) figcaption{justify-content:flex-end}.gallery.narrative figure:nth-child(even) figcaption::before{order:2}.gallery.narrative figure:nth-child(3n+1) figcaption{padding-left:3%}
@media(max-width:480px){.family-grid{grid-template-columns:1fr}.family-card{min-height:150px;padding:26px 18px}.gallery.narrative{gap:24px}.gallery.narrative figure{width:91%}}
`;
};

function galleryFigure52(p,src,i,offsets){
 const focus=Number.isFinite(+offsets[i])?Math.max(0,Math.min(100,+offsets[i])):bounded(p.galleryFocusY,50,0,100);
 const caption=p.galleryStyle==='narrative'?`<figcaption>Capítulo ${String(i+1).padStart(2,'0')}</figcaption>`:'';
 return `<figure><img class="gallery-image" role="button" tabindex="0" aria-label="Ampliar fotografía ${i+1}" data-index="${i}" data-focus-y="${focus}" style="object-position:center ${focus}%" src="${src}" alt="Fotografía ${i+1}" loading="lazy">${caption}</figure>`;
}

buildSections=function(p,a){
 const offsets=galleryOffsets(p),locs=[];
 const locationCard=(text,url,coords,id,textSize,editId)=>{const x=splitPlace(text),map=mapEmbedUrl(url,coords);return `<div class="location-card"><div class="location-head"><div><small data-edit="${editId}"${sizeAttr(textSize,'locationLabel')}>${esc(x.kind)}</small><strong data-edit="${editId}"${sizeAttr(textSize,'locationName')}>${esc(x.name)}</strong></div>${map?`<button class="map-toggle" type="button" aria-expanded="false" aria-controls="${id}"><span>Ver mapa</span><span class="map-toggle-icon">＋</span></button>`:''}</div>${map?`<div class="map-disclosure" id="${id}"><div class="map-disclosure-inner"><div class="map-preview"><iframe data-src="${esc(map)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen title="Mapa de ${esc(x.name)}"></iframe></div></div></div>`:''}${safeMapLink(url)?`<a class="map-external" href="${esc(safeMapLink(url))}" target="_blank" rel="noopener">Abrir en Google Maps ↗</a>`:''}</div>`};
 if(p.showCeremony&&p.ceremonyText)locs.push(locationCard(p.ceremonyText,p.ceremonyUrl,p.ceremonyCoords,'map-ceremony',p.ceremonyTextSize,'ceremonyText'));
 if(p.showReception&&p.receptionText)locs.push(locationCard(p.receptionText,p.receptionUrl,p.receptionCoords,'map-reception',p.receptionTextSize,'receptionText'));
 const familyVisible=p.showFamily&&(String(p.parentsText||'').trim()||String(p.godparentsText||'').trim());
 const famCards=[];
 if(String(p.parentsText||'').trim())famCards.push(`<div class="family-card"><small data-edit="parentsLabel">${esc(p.parentsLabel||'Papás')}</small><strong data-edit="parentsText"${sizeAttr(p.familyTextSize,'locationName')}>${esc(p.parentsText).replace(/\n/g,'<br>')}</strong></div>`);
 if(String(p.godparentsText||'').trim())famCards.push(`<div class="family-card"><small data-edit="godparentsLabel">${esc(p.godparentsLabel||'Padrinos')}</small><strong data-edit="godparentsText"${sizeAttr(p.familyTextSize,'locationName')}>${esc(p.godparentsText).replace(/\n/g,'<br>')}</strong></div>`);
 const signatureFont=FONT_MAP[p.closingSignatureFont]||"'Great Vibes',cursive";
 const parts={
  locations:locs.length?`<section class="section reveal"><div class="section-label">Dónde será</div><h2 data-edit="locationsHeadingSize"${sizeAttr(p.locationsHeadingSize,'sectionTitle')}>Nos vemos aquí.</h2><div class="ornament"></div><div class="locations">${locs.join('')}</div></section>`:'',
  family:familyVisible?`<section class="section reveal family-section">${p.familyLabel?`<div class="section-label" data-edit="familyLabel">${esc(p.familyLabel)}</div>`:''}${p.familyHeading?`<h2 data-edit="familyHeading">${esc(p.familyHeading)}</h2>`:''}<div class="family-grid">${famCards.join('')}</div><div class="family-equal-note"></div></section>`:'',
  confirm:p.whatsappNumber?`<section class="section center rsvp reveal"><div class="section-label">RSVP</div><h2${sizeAttr(p.rsvpHeadingSize,'sectionTitle')}>¿Nos acompañas?</h2><p class="section-copy"${sizeAttr(p.rsvpCopySize,'body')}>Tu confirmación nos ayuda a preparar cada detalle.</p><a class="cta"${sizeAttr(p.rsvpButtonSize,'button')} target="_blank" href="https://wa.me/${encodeURIComponent(p.whatsappNumber.replace(/\D/g,''))}?text=${encodeURIComponent(p.whatsappMessage)}">Confirmar por WhatsApp →</a></section>`:'',
  countdown:p.eventDate?`<section class="section center reveal date-section"><div class="section-label">Save the date</div><h2 data-edit="countdownLabel"${sizeAttr(p.countdownLabelSize,'sectionTitle')}>${esc(p.countdownLabel)}</h2>${dateCardHtml(p)}<div class="countdown ${countdownStyleClass(p)}" data-date="${esc(p.eventDate)}"><div class="count-item"><b data-d${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Días</span></div><div class="count-item"><b data-h${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Horas</span></div><div class="count-item"><b data-m${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Min</span></div><div class="count-item"><b data-s${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Seg</span></div></div></section>`:'',
  gallery:a.gallery.length?`<section class="section reveal gallery-section${(!p.galleryLabel&&!p.galleryTitle)?' gallery-only':''}">${p.galleryLabel?`<div class="section-label" data-edit="galleryLabel"${sizeAttr(p.galleryLabelSize,'sectionLabel')}>${esc(p.galleryLabel)}</div>`:''}${p.galleryTitle?`<h2 data-edit="galleryTitle"${sizeAttr(p.galleryTitleSize,'sectionTitle')}>${esc(p.galleryTitle)}</h2>`:''}<div class="gallery ${esc(p.galleryStyle)}">${a.gallery.map((src,i)=>galleryFigure52(p,src,i,offsets)).join('')}</div>${galleryFooter(p,a.gallery.length)}</section>`:'',
  extra:a.extra?bannerHtml557(a.extra,p.bannerExtraMode,'','Banner extra'):'',
  extra2:a.extra2?bannerHtml557(a.extra2,p.bannerExtra2Mode,'','Banner extra 2'):'',
  message:p.mainMessage||p.closingSignature?`<section class="section reveal"><div class="section-label center">Con cariño</div>${p.mainMessage?`<div class="final-message" data-edit="mainMessage"${sizeAttr(p.mainMessageSize,'finalMessage')}>${esc(p.mainMessage).replace(/\n/g,'<br>')}</div>`:''}${p.showClosingSignature&&p.closingSignature?`<div class="closing-signature" data-edit="closingSignature"><span style="font-family:${signatureFont}">${esc(p.closingSignature).replace(/\n/g,'<br>')}</span></div>`:''}</section>`:'',
  video:p.videoUrl?`<section id="video" class="section reveal legacy-video-section">${auraVideo54(p,a)}</section>`:'',
  transfer:auraTransfer54(p,a)?`<section id="transferencia" class="section center reveal transfer-section">${auraTransfer54(p,a)}</section>`:''
 };
 const order=[['locations',p.orderLocations],['family',p.orderFamily],['confirm',p.orderConfirm],['countdown',p.orderCountdown],['gallery',p.orderGallery],['extra',p.orderBannerExtra],['extra2',p.orderBannerExtra2],['message',p.orderMessage],['video',p.orderVideo],['transfer',p.orderTransfer||10]].filter(x=>+x[1]>0&&parts[x[0]]).sort((a,b)=>+a[1]-+b[1]);
 return order.map(x=>parts[x[0]]).join('');
};

const _configObject51=configObject;
configObject=function(p){const c=_configObject51(p);c.schemaVersion=5.2;c.studioVersion='5.2';return c};

function focusEditorField52(id){
 const el=$(id);if(!el)return;
 const section=el.closest('details.form-section');if(section)section.open=true;
 el.scrollIntoView({behavior:'smooth',block:'center'});
 setTimeout(()=>{try{el.focus({preventScroll:true})}catch(e){el.focus()}el.classList.add('field-flash');setTimeout(()=>el.classList.remove('field-flash'),850)},260);
}
function bindPreviewEditing52(doc){
 if(!doc||doc.documentElement.dataset.auraEditBound==='1')return;
 doc.documentElement.dataset.auraEditBound='1';
 const style=doc.createElement('style');style.textContent=`[data-edit]{transition:outline-color .16s,background-color .16s}[data-edit].aura-edit-hit{outline:1px dashed rgba(255,255,255,.82);outline-offset:5px;background:rgba(255,255,255,.05)}@media(hover:hover){[data-edit]:hover{outline:1px dashed rgba(255,255,255,.65);outline-offset:5px;cursor:pointer}}`;
 doc.head.appendChild(style);
 doc.addEventListener('click',e=>{if(!$('previewEditMode')?.checked)return;const target=e.target.closest?.('[data-edit]');if(!target)return;e.preventDefault();e.stopPropagation();doc.querySelectorAll('.aura-edit-hit').forEach(x=>x.classList.remove('aura-edit-hit'));target.classList.add('aura-edit-hit');focusEditorField52(target.dataset.edit)},true);
}

renderDetachedPreview=function(html){
 if(!detachedPreviewWindow||detachedPreviewWindow.closed)return;
 let scrollY=0;try{scrollY=detachedPreviewWindow.scrollY||0}catch(e){}
 try{
  const doc=detachedPreviewWindow.document;
  doc.open();doc.write(html);doc.close();doc.title='Aura Digital · Preview';
  setTimeout(()=>{if(detachedPreviewWindow&&!detachedPreviewWindow.closed){try{detachedPreviewWindow.scrollTo(0,scrollY);bindGalleryDrag(doc);bindPreviewEditing52(doc)}catch(e){}}},40);
 }catch(e){console.warn('No se pudo actualizar la ventana de preview',e)}
};
updatePreview=async function(){syncCoverUi();const p=getFormParams(),frame=$('preview-frame');releaseUnusedFiles(p);const html=buildInvitation(p,previewAssets(p));frame.onload=()=>{setupGalleryDrag();bindPreviewEditing52(frame.contentDocument)};frame.srcdoc=html;renderDetachedPreview(html)};

bindGalleryDrag=function(doc){
 if(!doc)return;const enabled=$('galleryEditMode')?.checked,imgs=Array.from(doc.querySelectorAll('.gallery-image'));
 imgs.forEach(img=>{
  const canCrop=!img.closest('.story,.masonry,.narrative');img.dataset.editing=enabled&&canCrop?'1':'0';img.style.cursor=enabled&&canCrop?'ns-resize':'zoom-in';img.style.touchAction=enabled&&canCrop?'none':'auto';
  if(img.dataset.dragBound)return;img.dataset.dragBound='1';img.addEventListener('dragstart',e=>e.preventDefault());img.addEventListener('pointerdown',e=>{
   if(img.dataset.editing!=='1'||(e.pointerType==='mouse'&&e.button!==0))return;const id=e.pointerId,startY=e.clientY,start=bounded(img.dataset.focusY,50,0,100);let moved=false;e.preventDefault();img.setPointerCapture?.(id);
   const move=ev=>{if(ev.pointerId!==id)return;const delta=ev.clientY-startY;if(!moved&&Math.abs(delta)<6)return;moved=true;const n=bounded(start+delta/180*100,50,0,100);img.dataset.focusY=String(n);img.style.objectPosition='center '+n+'%'};
   const finish=ev=>{if(ev.pointerId!==id)return;img.removeEventListener('pointermove',move);img.removeEventListener('pointerup',finish);img.removeEventListener('pointercancel',cancel);img.removeEventListener('lostpointercapture',cancel);if(img.hasPointerCapture?.(id))img.releasePointerCapture(id);if(moved)$('galleryOffsets').value=JSON.stringify(imgs.map(x=>Math.round(bounded(x.dataset.focusY,50,0,100)*10)/10))};
   const cancel=ev=>{img.dataset.focusY=String(start);img.style.objectPosition='center '+start+'%';moved=false;finish(ev)};img.addEventListener('pointermove',move);img.addEventListener('pointerup',finish);img.addEventListener('pointercancel',cancel);img.addEventListener('lostpointercapture',cancel);
  });
 });
};

function paletteTone52(colors){
 const l=colors.slice(0,4).map(h=>{h=h.replace('#','');const n=parseInt(h,16);return ((n>>16)&255)*.2126+((n>>8)&255)*.7152+(n&255)*.0722}).reduce((a,b)=>a+b,0)/4;
 return l<95?'oscura':l>185?'clara':'media';
}
renderPaletteStrip=function(){
 syncCollectionOptions();const root=$('palette-strip'),sel=$('colorPalette');root.replaceChildren();const keys=eventCollection().palettes.slice();if(PALETTES[sel.value]&&!keys.includes(sel.value))keys.push(sel.value);
 for(const k of keys){const colors=PALETTES[k],b=document.createElement('button');b.type='button';b.className='palette-chip'+(sel.value===k?' active':'');b.dataset.palette=k;b.setAttribute('aria-pressed',String(sel.value===k));b.innerHTML=`<span class="palette-swatch">${[colors[4],colors[5],colors[0],colors[2],colors[1]].map(c=>`<i style="background:${c}"></i>`).join('')}</span><span class="palette-meta"><span class="palette-name">${esc(PALETTE_LABELS[k]||k)}</span><span class="palette-tone">${paletteTone52(colors)}</span></span>`;root.appendChild(b)}
};
renderThemeStrip=function(){
 syncCollectionOptions();const root=$('theme-strip');root.replaceChildren();const keys=eventCollection().themes.slice();if(THEMES[$('themeVisual').value]&&!keys.includes($('themeVisual').value))keys.push($('themeVisual').value);
 keys.forEach(k=>{const t=THEMES[k],b=document.createElement('button');b.type='button';b.className='theme-chip'+($('themeVisual').value===k?' active':'');b.dataset.theme=k;b.style.setProperty('--swatch',t.swatch);b.setAttribute('aria-pressed',String($('themeVisual').value===k));b.innerHTML=`<span class="theme-sample sample-${k}"><span class="mini-kicker">Aura</span><i>Aa</i><span class="mini-copy"><b></b><em></em></span></span><span>${esc(t.label)}</span>`;b.addEventListener('click',()=>chooseTheme(k));root.appendChild(b)})
};

function setupEditorQuicknav52(){
 const nav=document.querySelector('.editor-quicknav');if(!nav)return;
 nav.addEventListener('click',e=>{const b=e.target.closest('button[data-target]');if(!b)return;const sec=document.getElementById(b.dataset.target);if(!sec)return;sec.open=true;sec.scrollIntoView({behavior:'smooth',block:'start'});nav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b))});
}
document.addEventListener('DOMContentLoaded',()=>{
 setupEditorQuicknav52();
 $('previewEditMode')?.addEventListener('change',()=>{bindPreviewEditing52($('preview-frame')?.contentDocument);if(detachedPreviewWindow&&!detachedPreviewWindow.closed)bindPreviewEditing52(detachedPreviewWindow.document)});
 renderThemeStrip();renderPaletteStrip();updatePreview();
});


/* =========================
   Aura Digital 5.3 · Editorial Experience
   New visual system inspired by the approved Boda / XV campaign:
   photo-led covers, glass quick actions, large negative space and
   continuous editorial sections. Additive layer over the proven 5.2.
   ========================= */
if(!Object.keys(PALETTE_LABELS).length){Array.from($('colorPalette')?.options||[]).forEach(o=>{if(o.value)PALETTE_LABELS[o.value]=o.textContent.trim()})}
Object.assign(PALETTES,{
 aura_champagne:['#a4875e','#493a2f','#3d3027','#8b7a6d','#eee6dc','#fcf8f2'],
 aura_blush:['#b58e80','#543f38','#49342f','#947f78','#f0e3df','#fdf8f5']
});
PALETTE_LABELS.aura_champagne='Aura Champagne';
PALETTE_LABELS.aura_blush='Aura Blush';

Object.assign(THEMES,{
 aura_editorial_boda:{label:'Aura Editorial · Boda · NUEVO',palette:'aura_champagne',swatch:'linear-gradient(135deg,#3d3027 0 26%,#a4875e 27% 38%,#fcf8f2 39% 76%,#eee6dc 77%)',display:"'Cormorant Garamond',serif",body:"'Manrope',sans-serif",radius:'0px',hero:'photo',ornament:'line',section:'editorial_luxe'},
 aura_editorial_xv:{label:'Aura Editorial · XV · NUEVO',palette:'aura_blush',swatch:'linear-gradient(135deg,#49342f 0 24%,#b58e80 25% 39%,#fdf8f5 40% 77%,#f0e3df 78%)',display:"'Cormorant Garamond',serif",body:"'Manrope',sans-serif",radius:'0px',hero:'photo',ornament:'diamond',section:'editorial_luxe'}
});
if(!COLLECTIONS.boda.themes.includes('aura_editorial_boda'))COLLECTIONS.boda.themes.unshift('aura_editorial_boda');
if(!COLLECTIONS.boda.palettes.includes('aura_champagne'))COLLECTIONS.boda.palettes.unshift('aura_champagne');
if(!COLLECTIONS.xv.themes.includes('aura_editorial_xv'))COLLECTIONS.xv.themes.unshift('aura_editorial_xv');
if(!COLLECTIONS.xv.palettes.includes('aura_blush'))COLLECTIONS.xv.palettes.unshift('aura_blush');
COLLECTIONS.boda.note='Editorial fotográfico, botones translúcidos, mucho aire y continuidad premium.';
COLLECTIONS.xv.note='Editorial minimal, fotografía protagonista, tonos champagne/blush y navegación translúcida.';

function isAuraEditorial53(theme){return theme==='aura_editorial_boda'||theme==='aura_editorial_xv'}
function auraQuickIcon53(kind){
 const icons={
  confirm:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M7 3v4M17 3v4M3 10h18"></path><path d="m8 15 2 2 5-5"></path></svg>',
  location:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>',
  gallery:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="8.5" cy="9" r="1.5"></circle><path d="m5 18 5-5 3 3 2-2 4 4"></path></svg>'
 };
 return icons[kind]||'';
}
function auraQuickActions53(p){
 const rows=[];
 if(String(p.whatsappNumber||'').trim())rows.push(`<a class="aura-quick-action" href="#confirmar">${auraQuickIcon53('confirm')}<span>Confirmar asistencia</span><b>›</b></a>`);
 if((p.showCeremony&&String(p.ceremonyText||'').trim())||(p.showReception&&String(p.receptionText||'').trim()))rows.push(`<a class="aura-quick-action" href="#ubicacion">${auraQuickIcon53('location')}<span>Ver ubicación</span><b>›</b></a>`);
 if((p.galleryFiles?.length||0)>0)rows.push(`<a class="aura-quick-action" href="#galeria">${auraQuickIcon53('gallery')}<span>Galería</span><b>›</b></a>`);
 return rows.length?`<nav class="aura-quick-actions" aria-label="Accesos de la invitación">${rows.join('')}</nav>`:'';
}

const _chooseTheme52=chooseTheme;
chooseTheme=function(k){
 if(!isAuraEditorial53(k))return _chooseTheme52(k);
 const t=THEMES[k],palette=t.palette;
 $('themeVisual').value=k;
 $('colorPalette').value=palette;
 $('heroLayout').value='theme';
 $('buttonStyle').value='glass_soft';
 $('galleryStyle').value=k==='aura_editorial_xv'?'filmstrip':'narrative';
 $('continuityStyle').value='editorial';
 $('fontPreset').value='default';
 $('heroTitleFont').value='default';
 $('heroTextColor').value='#fffaf6';
 $('heroPosition').value='end';
 $('heroAlignment').value='center';
 $('heroBlockPosition').value='center';
 $('heroWidth').value='88';
 $('heroSpacing').value='16';
 $('heroOffset').value='0';
 $('overlayColor').value='#201712';
 $('overlayOpacity').value='0.10';
 $('buttonOpacity').value='0.18';
 $('contentBlur').value='none';
 $('contentBgOpacity').value='0.82';
 const colors=PALETTES[palette];
 if(colors){
  const prev=$('bgContentColor').value;
  if($('locationsBgColor').value===prev||$('locationsBgColor').value==='#ffffff')$('locationsBgColor').value=colors[5];
  ['primaryColor','textColor','headingColor','mutedColor','bgBodyColor','bgContentColor'].forEach((id,i)=>$(id).value=colors[i]);
 }
 syncCoverUi();renderThemeStrip();renderPaletteStrip();updatePreview();
};

const _coverHtml52=coverHtml;
coverHtml=function(params){
 const p={...COVER_DEFAULTS,...params};
 if(!isAuraEditorial53(p.themeVisual))return _coverHtml52(params);
 const parts={
  label:p.showHeroLabel?`<div class="hero-kicker" data-edit="heroLabelText"${sizeAttr(p.heroLabelSize,'sectionLabel')}>${esc(p.heroLabelText.trim()||eventLabel(p.preset))}</div>`:'',
  title:p.title?.trim()?`<h1 data-edit="title"${sizeAttr(p.titleSize,'heroTitle')}>${esc(p.title)}</h1>`:'',
  phrase:p.subtitle?.trim()?`<p data-edit="subtitle"${sizeAttr(p.subtitleSize,'heroSubtitle')}>${esc(p.subtitle)}</p>`:''
 };
 const sequence=p.heroOrder==='phrase_first'?['label','phrase','title']:['label','title','phrase'];
 const quick=auraQuickActions53(p);
 const enter=p.showHeroButton?`<button type="button" class="enter-btn aura-enter" data-edit="buttonText"${sizeAttr(p.buttonTextSize,'button')} data-enter>${esc(p.buttonText||'Descubrir invitación')} <span aria-hidden="true">↓</span></button>`:'';
 return `<header class="hero cover-theme aura-editorial-cover" data-order="${p.heroOrder==='phrase_first'?'phrase_first':'classic'}" data-offset="${bounded(p.heroOffset,0,-200,200)}"><div class="hero-media"></div><div class="hero-overlay"></div><div class="hero-inner"><div class="aura-editorial-copy">${sequence.map(k=>parts[k]).join('')}</div>${quick}${enter}</div></header>`;
};

const _invitationCss52=invitationCss;
invitationCss=function(p,t,a){
 const base=_invitationCss52(p,t,a);
 if(!isAuraEditorial53(p.themeVisual))return base;
 const blush=p.themeVisual==='aura_editorial_xv';
 return base+`
/* Aura Editorial 5.3 */
html{scroll-padding-top:18px}
body.theme-${p.themeVisual}{background:${p.bgBodyColor};letter-spacing:.003em}
.theme-${p.themeVisual} .hero.aura-editorial-cover{min-height:100svh;padding:0;display:grid;align-items:end;overflow:hidden}
.theme-${p.themeVisual} .hero.aura-editorial-cover .hero-media{background-position:center ${blush?'38%':'45%'};transform:scale(1.001)}
.theme-${p.themeVisual} .hero.aura-editorial-cover .hero-overlay{background:linear-gradient(to top,rgba(22,16,13,.72) 0%,rgba(22,16,13,.40) 30%,rgba(22,16,13,.06) 64%,rgba(22,16,13,.10) 100%),${rgba(p.overlayColor,bounded(p.overlayOpacity,.10,0,.8))}}
.theme-${p.themeVisual} .hero.aura-editorial-cover .hero-inner{width:min(88%,560px);padding:0 0 max(44px,env(safe-area-inset-bottom));text-align:center;color:#fffaf6;transform:translateY(var(--safe-hero-offset,0px))}
.theme-${p.themeVisual} .aura-editorial-copy{padding:0 10px}
.theme-${p.themeVisual} .aura-editorial-copy .hero-kicker{margin:0 0 13px;font:500 9px/1.5 var(--body);letter-spacing:.34em;text-transform:uppercase;opacity:.92}
.theme-${p.themeVisual} .aura-editorial-copy h1{font-family:var(--display);font-size:clamp(52px,13vw,86px);font-weight:400;line-height:.92;letter-spacing:-.035em;text-wrap:balance;text-shadow:0 1px 18px rgba(0,0,0,.08)}
.theme-${p.themeVisual} .aura-editorial-copy p{max-width:31ch;margin:16px auto 0;font-size:12px;line-height:1.65;letter-spacing:.04em;opacity:.88}
.theme-${p.themeVisual} .aura-quick-actions{display:grid;gap:9px;margin:25px auto 0;width:min(100%,430px)}
.theme-${p.themeVisual} .aura-quick-action{min-height:52px;display:grid;grid-template-columns:24px minmax(0,1fr) 18px;gap:12px;align-items:center;padding:0 17px;color:#fffaf6;text-decoration:none;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.42);border-radius:999px;-webkit-backdrop-filter:blur(14px) saturate(115%);backdrop-filter:blur(14px) saturate(115%);box-shadow:inset 0 1px 0 rgba(255,255,255,.12);transition:transform .22s,background .22s,border-color .22s}
.theme-${p.themeVisual} .aura-quick-action:hover{transform:translateY(-1px);background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.62)}
.theme-${p.themeVisual} .aura-quick-action svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round;opacity:.92}
.theme-${p.themeVisual} .aura-quick-action span{text-align:left;font:400 12px/1.2 var(--body);letter-spacing:.02em}.theme-${p.themeVisual} .aura-quick-action b{font:300 23px/1 var(--body);text-align:right}
.theme-${p.themeVisual} .aura-enter{margin-top:12px;background:transparent;border-color:rgba(255,255,255,.36);color:#fff}
.theme-${p.themeVisual} .page{background:transparent}
.theme-${p.themeVisual} .content{width:min(100% - 38px,680px);padding:26px 0 112px}
.theme-${p.themeVisual} .content>.section{margin:0;padding:clamp(68px,15vw,112px) 10px;background:transparent;border:0;border-radius:0;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none}
.theme-${p.themeVisual} .content>.section:not(:last-child)::after{content:'';display:block;width:54px;height:1px;margin:72px auto -72px;background:var(--accent);opacity:.36}
.theme-${p.themeVisual} .section-label{margin-bottom:18px;font-size:8px;letter-spacing:.31em;color:var(--muted)}
.theme-${p.themeVisual} .section h2{max-width:13ch;margin-left:auto;margin-right:auto;font-family:var(--display);font-size:clamp(38px,9vw,60px);font-weight:400;line-height:1.02;letter-spacing:-.026em}
.theme-${p.themeVisual} .section-copy{max-width:36ch;line-height:1.8}
.theme-${p.themeVisual} .ornament{height:1px;width:34px;background:var(--accent);margin:24px auto 32px;opacity:.6}
.theme-${p.themeVisual} .date-card{background:transparent!important;border:0!important;border-top:1px solid ${rgba(p.primaryColor,.34)}!important;border-bottom:1px solid ${rgba(p.primaryColor,.34)}!important;border-radius:0!important;box-shadow:none!important;padding:26px 8px!important}
.theme-${p.themeVisual} .countdown{margin-top:28px;gap:4px}.theme-${p.themeVisual} .count-item{border:0!important;background:transparent!important}.theme-${p.themeVisual} .count-item b{font-family:var(--display);font-weight:400}.theme-${p.themeVisual} .count-item span{font-size:7px;letter-spacing:.16em}
.theme-${p.themeVisual} .locations{gap:12px}.theme-${p.themeVisual} .location-card{padding:20px 18px;background:${rgba(p.bgContentColor,.54)};border:1px solid ${rgba(p.primaryColor,.22)};border-radius:22px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.theme-${p.themeVisual} .location-card strong{font-family:var(--display);font-size:clamp(23px,6vw,32px);font-weight:400}.theme-${p.themeVisual} .map-toggle,.theme-${p.themeVisual} .map-external{letter-spacing:.12em}.theme-${p.themeVisual} .map-preview{border-radius:16px}
.theme-${p.themeVisual} .rsvp .cta{margin-top:30px;min-height:52px;border-radius:999px;background:transparent;border:1px solid ${rgba(p.primaryColor,.62)};color:var(--heading);padding:14px 28px;letter-spacing:.12em}
.theme-${p.themeVisual} .family-grid{grid-template-columns:1fr;gap:0;margin-top:38px;border-top:1px solid ${rgba(p.primaryColor,.26)}}
.theme-${p.themeVisual} .family-card{min-height:0;padding:35px 14px;background:transparent;border:0;border-bottom:1px solid ${rgba(p.primaryColor,.26)}}
.theme-${p.themeVisual} .family-card small{margin-bottom:10px}.theme-${p.themeVisual} .family-card strong{font-family:var(--display);font-size:clamp(28px,7vw,42px);font-weight:400}.theme-${p.themeVisual} .family-equal-note{display:none}
.theme-${p.themeVisual} .gallery-section{padding-left:0!important;padding-right:0!important}.theme-${p.themeVisual} .gallery-footer{margin-top:18px;padding:0 4px}.theme-${p.themeVisual} .gallery-footer>span{font-size:8px;letter-spacing:.14em}
.theme-${p.themeVisual} .gallery.filmstrip,.theme-${p.themeVisual} .gallery.carousel{gap:10px;padding:0 0 14px}.theme-${p.themeVisual} .gallery.filmstrip figure,.theme-${p.themeVisual} .gallery.carousel figure{flex-basis:78%;border-radius:18px;overflow:hidden}.theme-${p.themeVisual} .gallery.filmstrip img,.theme-${p.themeVisual} .gallery.carousel img{border-radius:18px}
.theme-${p.themeVisual} .gallery.narrative{gap:34px}.theme-${p.themeVisual} .gallery.narrative figure{width:86%}.theme-${p.themeVisual} .gallery.narrative figure:nth-child(3n+1){width:100%}.theme-${p.themeVisual} .gallery.narrative img{border-radius:2px}.theme-${p.themeVisual} .gallery.narrative figcaption{font-size:7px;letter-spacing:.22em}
.theme-${p.themeVisual} .final-message{max-width:15ch;margin-left:auto;margin-right:auto;font-family:var(--display);font-weight:400;line-height:1.15}.theme-${p.themeVisual} .closing-signature{margin-top:36px}
.theme-${p.themeVisual} .banner{width:calc(100% + 38px);margin-left:-19px;height:min(118vw,720px);max-height:none}.theme-${p.themeVisual} .banner::after{background:linear-gradient(to top,${rgba(p.bgBodyColor,.26)},transparent 42%)}
.theme-${p.themeVisual} .gallery-scroll-controls button{border-radius:50%;border-color:${rgba(p.primaryColor,.3)}}
@media(max-width:480px){.theme-${p.themeVisual} .hero.aura-editorial-cover .hero-inner{width:88%;padding-bottom:max(34px,env(safe-area-inset-bottom))}.theme-${p.themeVisual} .aura-editorial-copy h1{font-size:clamp(48px,15vw,72px)}.theme-${p.themeVisual} .aura-quick-action{min-height:50px}.theme-${p.themeVisual} .content{width:min(100% - 30px,680px)}.theme-${p.themeVisual} .content>.section{padding:70px 5px}.theme-${p.themeVisual} .content>.section:not(:last-child)::after{margin-top:58px;margin-bottom:-58px}.theme-${p.themeVisual} .gallery.filmstrip figure,.theme-${p.themeVisual} .gallery.carousel figure{flex-basis:84%}}
`;
};

const _buildSections52=buildSections;
buildSections=function(p,a){
 let html=_buildSections52(p,a);
 if(!isAuraEditorial53(p.themeVisual))return html;
 html=html.replace('<section class="section reveal"><div class="section-label">Dónde será</div>','<section id="ubicacion" class="section reveal"><div class="section-label">Dónde será</div>');
 html=html.replace('<section class="section center rsvp reveal">','<section id="confirmar" class="section center rsvp reveal">');
 html=html.replace('<section class="section center reveal date-section">','<section id="fecha" class="section center reveal date-section">');
 html=html.replace('<section class="section reveal family-section">','<section id="familia" class="section reveal family-section">');
 html=html.replace('<section class="section reveal gallery-section','<section id="galeria" class="section reveal gallery-section');
 return html;
};

const _configObject52=configObject;
configObject=function(p){const c=_configObject52(p);c.schemaVersion=5.3;c.studioVersion='5.3';return c};


/* =========================
   Aura Digital 5.3.1 · Corrección editorial
   - previews reales en selector
   - Boda y XV con composiciones distintas
   - secuencia editorial sugerida
   - documentación/versionado coherente
   ========================= */
const AURA_THEME_PREVIEWS_531={
 aura_editorial_boda:{src:'assets/previews/aura-editorial-boda.jpg',kicker:'BODA · EDITORIAL',title:'Aura Boda',note:'Fotografía · líneas · narrativa'},
 aura_editorial_xv:{src:'assets/previews/aura-editorial-xv.jpg',kicker:'XV · EDITORIAL',title:'Aura XV',note:'Moda · blush · secuencia'}
};

renderThemeStrip=function(){
 syncCollectionOptions();const root=$('theme-strip');root.replaceChildren();const keys=eventCollection().themes.slice();if(THEMES[$('themeVisual').value]&&!keys.includes($('themeVisual').value))keys.push($('themeVisual').value);
 keys.forEach(k=>{const t=THEMES[k],b=document.createElement('button'),preview=AURA_THEME_PREVIEWS_531[k];b.type='button';b.className='theme-chip'+($('themeVisual').value===k?' active':'');b.dataset.theme=k;b.style.setProperty('--swatch',t.swatch);b.setAttribute('aria-pressed',String($('themeVisual').value===k));
  b.innerHTML=preview
   ?`<span class="theme-sample theme-sample-real"><img src="${preview.src}" alt="" loading="lazy"><span class="theme-preview-copy"><small>${preview.kicker}</small><strong>${preview.title}</strong><em>${preview.note}</em></span></span><span>${esc(t.label)}</span>`
   :`<span class="theme-sample sample-${k}"><span class="mini-kicker">Aura</span><i>Aa</i><span class="mini-copy"><b></b><em></em></span></span><span>${esc(t.label)}</span>`;
  b.addEventListener('click',()=>chooseTheme(k));root.appendChild(b)
 })
};

function applyAuraEditorialSequence531(){
 const seq={orderCountdown:1,orderFamily:2,orderGallery:3,orderBannerExtra:4,orderLocations:5,orderVideo:6,orderBannerExtra2:7,orderMessage:8,orderConfirm:9,orderTransfer:10};
 Object.entries(seq).forEach(([id,v])=>{if($(id))$(id).value=String(v)});
}
const _chooseTheme53=chooseTheme;
const AURA_EDITORIAL_FORCED_FIELDS_531=['heroLayout','buttonStyle','galleryStyle','continuityStyle','fontPreset','heroTitleFont','heroTextColor','heroPosition','heroAlignment','heroBlockPosition','heroWidth','heroSpacing','heroOffset','overlayColor','overlayOpacity','buttonOpacity','contentBlur','contentBgOpacity','showHeroButton','showHeroScroll','orderCountdown','orderFamily','orderGallery','orderBannerExtra','orderLocations','orderVideo','orderBannerExtra2','orderMessage','orderConfirm','orderTransfer'];
let auraThemeState531=$('themeVisual')?.value||'';
let auraThemeSnapshot531=null;
function snapshotAuraEditorState531(){
 const out={};for(const id of AURA_EDITORIAL_FORCED_FIELDS_531){const el=$(id);if(!el)continue;out[id]=el.type==='checkbox'?el.checked:el.value}return out;
}
function restoreAuraEditorState531(state){
 if(!state)return;for(const [id,v] of Object.entries(state)){const el=$(id);if(!el)continue;if(el.type==='checkbox')el.checked=!!v;else el.value=v}
}
chooseTheme=function(k){
 const from=auraThemeState531;
 const entering=isAuraEditorial53(k)&&!isAuraEditorial53(from);
 const leaving=!isAuraEditorial53(k)&&isAuraEditorial53(from);
 if(entering)auraThemeSnapshot531=snapshotAuraEditorState531();
 _chooseTheme53(k);
 if(isAuraEditorial53(k)){
  applyAuraEditorialSequence531();
  $('heroOrder').value='classic';
  if(k==='aura_editorial_boda'){
   $('galleryStyle').value='narrative';$('heroPosition').value='end';$('heroAlignment').value='center';$('heroBlockPosition').value='center';$('heroWidth').value='88';$('heroSpacing').value='16';$('overlayOpacity').value='0.10';
  }else{
   $('galleryStyle').value='filmstrip';$('heroPosition').value='end';$('heroAlignment').value='left';$('heroBlockPosition').value='start';$('heroWidth').value='84';$('heroSpacing').value='12';$('overlayOpacity').value='0.08';
  }
 }else if(leaving&&auraThemeSnapshot531){
  restoreAuraEditorState531(auraThemeSnapshot531);auraThemeSnapshot531=null;
 }
 auraThemeState531=k;
 syncCoverUi();renderThemeStrip();renderPaletteStrip();updatePreview();
};

const _coverHtml53=coverHtml;
coverHtml=function(params){
 const p={...COVER_DEFAULTS,...params};
 if(!isAuraEditorial53(p.themeVisual))return _coverHtml53(params);
 const label=p.showHeroLabel?`<div class="hero-kicker" data-edit="heroLabelText"${sizeAttr(p.heroLabelSize,'sectionLabel')}>${esc(p.heroLabelText.trim()||eventLabel(p.preset))}</div>`:'';
 const title=p.title?.trim()?`<h1 data-edit="title"${sizeAttr(p.titleSize,'heroTitle')}>${esc(p.title)}</h1>`:'';
 const phrase=p.subtitle?.trim()?`<p data-edit="subtitle"${sizeAttr(p.subtitleSize,'heroSubtitle')}>${esc(p.subtitle)}</p>`:'';
 const quick=auraQuickActions53(p);
 const enter=p.showHeroButton?`<button type="button" class="enter-btn aura-enter" data-edit="buttonText"${sizeAttr(p.buttonTextSize,'button')} data-enter>${esc(p.buttonText||'Descubrir invitación')} <span aria-hidden="true">↓</span></button>`:'';
 if(p.themeVisual==='aura_editorial_xv'){
  return `<header class="hero cover-theme aura-editorial-cover aura-xv-cover" data-offset="${bounded(p.heroOffset,0,-200,200)}"><div class="hero-media"></div><div class="hero-overlay"></div><div class="aura-xv-rail"><span></span><i>XV</i></div><div class="hero-inner"><div class="aura-editorial-copy">${label}${title}${phrase}</div>${quick}${enter}</div></header>`;
 }
 return `<header class="hero cover-theme aura-editorial-cover aura-boda-cover" data-offset="${bounded(p.heroOffset,0,-200,200)}"><div class="hero-media"></div><div class="hero-overlay"></div><div class="aura-boda-mark"><span></span><i>♡</i><span></span></div><div class="hero-inner"><div class="aura-editorial-copy">${label}${title}${phrase}</div>${quick}${enter}</div></header>`;
};

const _buildSections53=buildSections;
buildSections=function(p,a){
 let html=_buildSections53(p,a);
 if(!isAuraEditorial53(p.themeVisual))return html;
 html=html
  .replace('id="fecha" class="section center reveal date-section"','id="fecha" class="section center reveal date-section aura-stage aura-stage-info"')
  .replace('id="familia" class="section reveal family-section"','id="familia" class="section reveal family-section aura-stage aura-stage-info"')
  .replace('id="galeria" class="section reveal gallery-section','id="galeria" class="section reveal gallery-section aura-stage aura-stage-experience')
  .replace('id="ubicacion" class="section reveal"','id="ubicacion" class="section reveal aura-stage aura-stage-experience"')
  .replace('id="confirmar" class="section center rsvp reveal"','id="confirmar" class="section center rsvp reveal aura-stage aura-stage-close"')
  .replace('<section class="section reveal"><div class="section-label center">Con cariño</div>','<section id="cierre" class="section reveal aura-stage aura-stage-close"><div class="section-label center">Con cariño</div>')
  .replaceAll('<div class="banner reveal"','<div class="banner reveal aura-stage aura-stage-experience"');
 return html;
};

const _invitationCss53=invitationCss;
invitationCss=function(p,t,a){
 const base=_invitationCss53(p,t,a);
 if(!isAuraEditorial53(p.themeVisual))return base;
 const common=`
/* Aura Editorial 5.3.1 · diferenciación real */
.theme-${p.themeVisual} .aura-stage{position:relative}
.theme-${p.themeVisual} .aura-stage-info,.theme-${p.themeVisual} .aura-stage-experience,.theme-${p.themeVisual} .aura-stage-close{scroll-margin-top:18px}
.theme-${p.themeVisual} .page>.banner{background-color:var(--surface);background-size:cover;background-position:center}
.theme-${p.themeVisual} .aura-boda-mark,.theme-${p.themeVisual} .aura-xv-rail{pointer-events:none}
`;
 if(p.themeVisual==='aura_editorial_boda')return base+common+`
.theme-aura_editorial_boda .hero.aura-boda-cover .hero-inner{width:min(86%,610px);text-align:center;padding-bottom:max(38px,env(safe-area-inset-bottom))}
.theme-aura_editorial_boda .hero.aura-boda-cover .hero-overlay{background:linear-gradient(to top,rgba(20,15,12,.76) 0%,rgba(20,15,12,.42) 29%,rgba(20,15,12,.08) 61%,rgba(20,15,12,.12) 100%),${rgba(p.overlayColor,bounded(p.overlayOpacity,.10,0,.8))}}
.theme-aura_editorial_boda .aura-boda-mark{position:absolute;z-index:3;top:max(24px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);display:grid;grid-template-columns:34px auto 34px;gap:10px;align-items:center;color:#fffaf6;opacity:.76}
.theme-aura_editorial_boda .aura-boda-mark span{height:1px;background:currentColor;opacity:.65}.theme-aura_editorial_boda .aura-boda-mark i{font:500 8px/1 var(--body);font-style:normal;letter-spacing:.24em}
.theme-aura_editorial_boda .aura-editorial-copy h1{font-size:clamp(56px,14vw,92px);line-height:.88;letter-spacing:-.046em;overflow-wrap:normal;word-break:normal;hyphens:none}
.theme-aura_editorial_boda .aura-quick-actions{width:min(100%,440px);margin-top:28px}
.theme-aura_editorial_boda .aura-quick-action{border-radius:2px;background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.50);min-height:50px}
.theme-aura_editorial_boda .page>.banner{width:100%;height:clamp(250px,56vw,430px);min-height:250px;max-height:430px;margin:0;border-radius:0}
.theme-aura_editorial_boda .content{width:min(100% - 42px,720px)}
.theme-aura_editorial_boda .content>.section{padding:clamp(78px,16vw,124px) 8px}
.theme-aura_editorial_boda .content>.section:not(:last-child)::after{width:72px;opacity:.38}
.theme-aura_editorial_boda .section h2{font-size:clamp(42px,9vw,64px);max-width:12ch}
.theme-aura_editorial_boda #fecha .date-card{padding:30px 6px!important}
.theme-aura_editorial_boda #familia .family-grid{grid-template-columns:repeat(2,minmax(0,1fr));border-top:1px solid ${rgba(p.primaryColor,.28)};border-bottom:1px solid ${rgba(p.primaryColor,.28)}}
.theme-aura_editorial_boda #familia .family-card{border-bottom:0;padding:42px 18px}.theme-aura_editorial_boda #familia .family-card+ .family-card{border-left:1px solid ${rgba(p.primaryColor,.28)}}
.theme-aura_editorial_boda #galeria.gallery-section{width:calc(100% + 22px);margin-left:-11px}
.theme-aura_editorial_boda .gallery.narrative{gap:42px}.theme-aura_editorial_boda .gallery.narrative figure{width:82%}.theme-aura_editorial_boda .gallery.narrative figure:nth-child(3n+1){width:100%}
.theme-aura_editorial_boda #ubicacion .location-card{border-radius:2px;background:transparent;border-left:0;border-right:0;padding:26px 4px}
.theme-aura_editorial_boda #ubicacion .locations{gap:18px}.theme-aura_editorial_boda #ubicacion .map-preview{border-radius:2px}
.theme-aura_editorial_boda #cierre .final-message{font-size:clamp(38px,9vw,58px);max-width:14ch}
.theme-aura_editorial_boda #confirmar .cta{border-radius:2px;padding-inline:34px}
@media(min-width:620px){.theme-aura_editorial_boda #fecha{display:grid;grid-template-columns:1fr 1fr;column-gap:42px;align-items:center}.theme-aura_editorial_boda #fecha>.section-label,.theme-aura_editorial_boda #fecha>h2{grid-column:1/-1}.theme-aura_editorial_boda #fecha>.date-card{grid-column:1}.theme-aura_editorial_boda #fecha>.countdown{grid-column:2;margin-top:0}}
@media(max-width:520px){.theme-aura_editorial_boda #familia .family-grid{grid-template-columns:1fr}.theme-aura_editorial_boda #familia .family-card+ .family-card{border-left:0;border-top:1px solid ${rgba(p.primaryColor,.28)}}}
`;
 return base+common+`
.theme-aura_editorial_xv .hero.aura-xv-cover{align-items:end}.theme-aura_editorial_xv .hero.aura-xv-cover .hero-inner{width:min(86%,560px);margin-left:7%;margin-right:auto;text-align:left;padding-bottom:max(34px,env(safe-area-inset-bottom))}
.theme-aura_editorial_xv .hero.aura-xv-cover .hero-overlay{background:linear-gradient(90deg,rgba(30,18,18,.36),rgba(30,18,18,.04) 56%),linear-gradient(to top,rgba(31,20,20,.68),rgba(31,20,20,.15) 57%,rgba(31,20,20,.05)),${rgba(p.overlayColor,bounded(p.overlayOpacity,.08,0,.8))}}
.theme-aura_editorial_xv .aura-xv-rail{position:absolute;z-index:3;top:max(28px,env(safe-area-inset-top));right:24px;display:flex;align-items:center;gap:10px;color:#fffaf6;opacity:.78}.theme-aura_editorial_xv .aura-xv-rail span{width:1px;height:52px;background:currentColor;opacity:.65}.theme-aura_editorial_xv .aura-xv-rail i{font:400 18px/1 var(--display);font-style:italic}
.theme-aura_editorial_xv .aura-editorial-copy{padding:0}.theme-aura_editorial_xv .aura-editorial-copy h1{font-size:clamp(50px,13vw,84px);line-height:.9;letter-spacing:-.04em;max-width:11ch;margin-left:0;overflow-wrap:normal;word-break:normal;hyphens:none}.theme-aura_editorial_xv .aura-editorial-copy p{margin-left:0;margin-right:0;max-width:29ch}
.theme-aura_editorial_xv .aura-quick-actions{grid-template-columns:1fr 1fr;width:min(100%,460px);margin:24px 0 0}.theme-aura_editorial_xv .aura-quick-action{border-radius:999px;background:rgba(255,255,255,.14);padding-inline:15px}.theme-aura_editorial_xv .aura-quick-action:first-child{grid-column:1/-1}
.theme-aura_editorial_xv .page>.banner{width:100%;height:clamp(250px,56vw,430px);min-height:250px;max-height:430px;margin:0;border-radius:0;overflow:hidden}
.theme-aura_editorial_xv .content{width:min(100% - 30px,680px)}.theme-aura_editorial_xv .content>.section{padding:74px 8px;text-align:left}
.theme-aura_editorial_xv .content>.section:not(:last-child)::after{width:7px;height:7px;transform:rotate(45deg);margin-left:4px;background:var(--accent);opacity:.48}
.theme-aura_editorial_xv .section-label{font-size:8px}.theme-aura_editorial_xv .section h2{margin-left:0;margin-right:0;max-width:11ch;font-size:clamp(42px,10vw,62px)}
.theme-aura_editorial_xv #fecha{text-align:left!important}.theme-aura_editorial_xv #fecha .date-card{border:1px solid ${rgba(p.primaryColor,.18)}!important;border-radius:24px!important;padding:26px 20px!important;background:${rgba(p.bgContentColor,.52)}!important;backdrop-filter:blur(10px)}
.theme-aura_editorial_xv #fecha .countdown{grid-template-columns:repeat(4,1fr);gap:7px}.theme-aura_editorial_xv #fecha .count-item{border:1px solid ${rgba(p.primaryColor,.14)}!important;border-radius:18px;background:${rgba(p.bgContentColor,.38)}!important;padding:13px 4px}
.theme-aura_editorial_xv #familia{text-align:left}.theme-aura_editorial_xv #familia .family-grid{border:0;gap:12px}.theme-aura_editorial_xv #familia .family-card{align-items:flex-start;text-align:left;border:1px solid ${rgba(p.primaryColor,.16)};border-radius:24px;background:${rgba(p.bgContentColor,.42)};padding:30px 24px}.theme-aura_editorial_xv #familia .family-card strong{font-size:clamp(30px,7.4vw,44px)}
.theme-aura_editorial_xv #galeria.gallery-section{padding-right:0!important}.theme-aura_editorial_xv #galeria .gallery.filmstrip{margin-right:-15px}.theme-aura_editorial_xv #galeria .gallery.filmstrip figure{flex-basis:80%;border-radius:28px}.theme-aura_editorial_xv #galeria .gallery.filmstrip img{border-radius:28px}
.theme-aura_editorial_xv #ubicacion .location-card{border-radius:26px;background:${rgba(p.bgContentColor,.56)};border-color:${rgba(p.primaryColor,.16)};padding:24px 20px}.theme-aura_editorial_xv #ubicacion .map-preview{border-radius:20px}
.theme-aura_editorial_xv #cierre{text-align:center}.theme-aura_editorial_xv #cierre .final-message{font-size:clamp(38px,9vw,56px);font-style:italic;max-width:14ch}.theme-aura_editorial_xv #confirmar{text-align:center}.theme-aura_editorial_xv #confirmar h2{margin-left:auto;margin-right:auto}.theme-aura_editorial_xv #confirmar .cta{border-radius:999px}
@media(max-width:430px){.theme-aura_editorial_xv .hero.aura-xv-cover .hero-inner{margin-left:6%;width:88%}.theme-aura_editorial_xv .aura-quick-actions{grid-template-columns:1fr}.theme-aura_editorial_xv .aura-quick-action:first-child{grid-column:auto}.theme-aura_editorial_xv #fecha .countdown{gap:4px}.theme-aura_editorial_xv #fecha .count-item{border-radius:14px;padding-inline:2px}}
`;
};

const _configObject53=configObject;
configObject=function(p){const c=_configObject53(p);c.schemaVersion=5.3;c.studioVersion='5.3.1';return c};

/* =========================
   Aura Digital 5.4 · 6 pantallas editoriales
   Referencia aprobada: Portada → Fecha → Familia → Galería → Ubicación → Cierre.
   La composición usa las paletas del editor; no depende de rosa/champagne fijos.
   ========================= */
const _getFormParams54=getFormParams;
getFormParams=function(){
 const p=_getFormParams54();
 p.showTransfer=$('showTransfer')?.checked??false;
 p.transferNumber=$('transferNumber')?.value??'';
 p.orderTransfer=$('orderTransfer')?.value??'10';
 return p;
};

function auraStagePhoto54(src,extraClass=''){
 return src?`<div class="aura-stage-photo ${extraClass}" style="background-image:url('${src}')" aria-hidden="true"></div>`:`<div class="aura-stage-photo aura-stage-photo-empty ${extraClass}" aria-hidden="true"></div>`;
}
function auraGalleryFigure54(p,src,i,offsets){
 const focus=Number.isFinite(+offsets[i])?Math.max(0,Math.min(100,+offsets[i])):bounded(p.galleryFocusY,50,0,100);
 return `<figure class="aura-gallery-tile aura-gallery-tile-${(i%6)+1}"><img class="gallery-image" role="button" tabindex="0" aria-label="Ampliar fotografía ${i+1}" data-index="${i}" data-focus-y="${focus}" style="object-position:center ${focus}%" src="${src}" alt="Fotografía ${i+1}" loading="lazy"></figure>`;
}
function auraLocationCard54(p,text,url,coords,id,textSize,editId){
 const x=splitPlace(text),map=mapEmbedUrl(url,coords),link=safeMapLink(url);
 return `<article class="aura-location-card"><div class="aura-location-copy"><small data-edit="${editId}"${sizeAttr(textSize,'locationLabel')}>${esc(x.kind||'Evento')}</small><strong data-edit="${editId}"${sizeAttr(textSize,'locationName')}>${esc(x.name)}</strong>${link?`<a class="aura-map-button" href="${esc(link)}" target="_blank" rel="noopener">Ver en Maps <span>↗</span></a>`:''}</div>${map?`<div class="aura-map-preview"><iframe src="${esc(map)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen title="Mapa de ${esc(x.name)}"></iframe></div>`:''}</article>`;
}
function auraTransfer54(p){
 const number=String(p.transferNumber||'').trim();
 if(!p.showTransfer||!number)return'';
 return `<div class="aura-transfer"><button type="button" data-copy-account="${esc(number)}"><b>${esc(number)}</b><em>Copiar número</em></button></div>`;
}
function auraVideo54(p,a){
 if(!p.videoUrl)return'';
 const hasCopy=!!(String(p.videoLabel||'').trim()||String(p.videoText||'').trim());
 return `<div class="aura-inline-video ${hasCopy?'has-copy':'video-only'}">${p.videoLabel?`<div class="section-label" data-edit="videoLabel"${sizeAttr(p.videoLabelSize,'sectionLabel')}>${esc(p.videoLabel)}</div>`:''}${p.videoText?`<h3 data-edit="videoText"${sizeAttr(p.videoTextSize,'sectionTitle')}>${esc(p.videoText)}</h3>`:''}<div class="video-wrap">${a.poster?`<button class="video-poster" type="button" data-video="${esc(normalizedVideo(p.videoUrl))}" style="background-image:linear-gradient(rgba(0,0,0,.08),rgba(0,0,0,.20)),url('${a.poster}')" aria-label="Reproducir video"><span class="video-play-chip"><i aria-hidden="true">▶</i><em>Ver video</em></span></button>`:`<iframe src="${esc(normalizedVideo(p.videoUrl))}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`}</div></div>`;
}
function auraEditorialSections54(p,a){
 const offsets=galleryOffsets(p),isXV=p.themeVisual==='aura_editorial_xv';
 // Los banners son piezas independientes: nunca se reutilizan como fotografía de una sección.
 // Las pantallas editoriales toman fotografías únicamente de la galería para evitar duplicados.
 const datePhoto=a.gallery?.[0]||'',dateIndex=a.gallery?.length?0:-1;
 const familyPhoto=a.gallery?.[1]||a.gallery?.[0]||'',familyIndex=a.gallery?.length>1?1:(a.gallery?.length?0:-1);
 const locationPhoto=a.gallery?.[2]||a.gallery?.[0]||'',locationIndex=a.gallery?.length>2?2:(a.gallery?.length?0:-1);
 const closingPhoto=a.gallery?.[a.gallery.length-1]||'',closingIndex=a.gallery?.length?a.gallery.length-1:-1;
 const d=eventDateParts(p.eventDate);
 const countdown=p.eventDate?`<div class="countdown aura-countdown ${countdownStyleClass(p)}" data-date="${esc(p.eventDate)}"><div class="count-item"><b data-d${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Días</span></div><div class="count-item"><b data-h${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Horas</span></div><div class="count-item"><b data-m${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Min</span></div><div class="count-item"><b data-s${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Seg</span></div></div>`:'';
 const dateStage=p.eventDate?`<section id="fecha" class="aura-screen aura-screen-date reveal"><div class="aura-screen-shell">${auraStagePhoto54(datePhoto,'aura-date-photo',p,dateIndex)}<div class="aura-date-panel"><div class="section-label">${isXV?'Te invito a celebrar':'Reserva la fecha'}</div><h2 data-edit="countdownLabel"${sizeAttr(p.countdownLabelSize,'sectionTitle')}>${esc(p.countdownLabel||eventLabel(p.preset))}</h2>${auraDateLockupHtml(p,d)}${p.subtitle?`<p class="aura-date-note">${esc(p.subtitle)}</p>`:''}${countdown}</div></div></section>`:'';
 const familyVisible=p.showFamily&&(String(p.parentsText||'').trim()||String(p.godparentsText||'').trim());
 const familyCards=[];
 if(String(p.parentsText||'').trim())familyCards.push(`<div class="aura-family-name"><small data-edit="parentsLabel">${esc(p.parentsLabel||'Papás')}</small><strong data-edit="parentsText"${sizeAttr(p.familyTextSize,'locationName')}>${esc(p.parentsText).replace(/\n/g,'<br>')}</strong></div>`);
 if(String(p.godparentsText||'').trim())familyCards.push(`<div class="aura-family-name"><small data-edit="godparentsLabel">${esc(p.godparentsLabel||'Padrinos')}</small><strong data-edit="godparentsText"${sizeAttr(p.familyTextSize,'locationName')}>${esc(p.godparentsText).replace(/\n/g,'<br>')}</strong></div>`);
 const familyStage=familyVisible?`<section id="familia" class="aura-screen aura-screen-family reveal"><div class="aura-screen-shell"><div class="aura-family-portrait">${auraStagePhoto54(familyPhoto,'aura-family-photo',p,familyIndex)}</div><div class="aura-family-panel">${p.familyLabel?`<div class="section-label" data-edit="familyLabel">${esc(p.familyLabel)}</div>`:''}<h2 data-edit="familyHeading">${esc(p.familyHeading||(isXV?'Con la bendición de quienes me acompañan':'Con el cariño de quienes nos acompañan'))}</h2><div class="aura-family-grid">${familyCards.join('')}</div></div></div></section>`:'';
 const galleryTitle=String(p.galleryTitle||'').trim()||(isXV?'Momentos que quiero compartir contigo':'Momentos que queremos compartir contigo');
 const galleryStage=a.gallery?.length?`<section id="galeria" class="aura-screen aura-screen-gallery gallery-section reveal"><div class="aura-screen-shell"><div class="aura-gallery-heading">${p.galleryLabel?`<div class="section-label" data-edit="galleryLabel"${sizeAttr(p.galleryLabelSize,'sectionLabel')}>${esc(p.galleryLabel)}</div>`:''}<h2 data-edit="galleryTitle"${sizeAttr(p.galleryTitleSize,'sectionTitle')}>${esc(galleryTitle)}</h2><div class="aura-gallery-ornament"></div></div><div class="aura-gallery-grid gallery ${esc(p.galleryStyle)}">${a.gallery.map((src,i)=>auraGalleryFigure54(p,src,i,offsets)).join('')}</div>${galleryFooter(p,a.gallery.length)}</div></section>`:'';
 const locs=[];
 if(p.showCeremony&&p.ceremonyText)locs.push(auraLocationCard54(p,p.ceremonyText,p.ceremonyUrl,p.ceremonyCoords,'map-ceremony',p.ceremonyTextSize,'ceremonyText'));
 if(p.showReception&&p.receptionText)locs.push(auraLocationCard54(p,p.receptionText,p.receptionUrl,p.receptionCoords,'map-reception',p.receptionTextSize,'receptionText'));
 const locationStage=locs.length?`<section id="ubicacion" class="aura-screen aura-screen-location reveal"><div class="aura-screen-shell">${auraStagePhoto54(locationPhoto,'aura-location-photo',p,locationIndex)}<div class="aura-location-panel"><div class="section-label">Ubicación</div><h2${sizeAttr(p.locationsHeadingSize,'sectionTitle')}>${isXV?'Aquí celebraremos':'Aquí comienza nuestro gran día'}</h2><div class="aura-locations">${locs.join('')}</div><p class="aura-location-note">Tu presencia hará este momento aún más especial.</p></div></div></section>`:'';
 const videoInner=auraVideo54(p,a);
 const videoStage=videoInner?`<section id="video" class="aura-screen aura-screen-video reveal"><div class="aura-screen-shell"><div class="aura-video-panel">${videoInner}</div></div></section>`:'';
 const signatureFont=FONT_MAP[p.closingSignatureFont]||"'Great Vibes',cursive";
 const messageStage=(p.mainMessage||(p.showClosingSignature&&p.closingSignature))?`<section id="cierre" class="aura-screen aura-screen-close reveal"><div class="aura-screen-shell aura-close-shell">${auraStagePhoto54(closingPhoto,'aura-close-photo',p,closingIndex)}<div class="aura-close-panel"><div class="section-label">Gracias</div>${p.mainMessage?`<div class="final-message" data-edit="mainMessage"${sizeAttr(p.mainMessageSize,'finalMessage')}>${esc(p.mainMessage).replace(/\n/g,'<br>')}</div>`:''}${p.showClosingSignature&&p.closingSignature?`<div class="closing-signature" data-edit="closingSignature"><span style="font-family:${signatureFont}">${esc(p.closingSignature).replace(/\n/g,'<br>')}</span></div>`:''}</div></div></section>`:'';
 const confirm=p.whatsappNumber?`<a class="aura-confirm"${sizeAttr(p.rsvpButtonSize,'button')} target="_blank" href="https://wa.me/${encodeURIComponent(p.whatsappNumber.replace(/\D/g,''))}?text=${encodeURIComponent(p.whatsappMessage)}"><span>✓</span> Confirmar asistencia</a>`:'';
 const confirmStage=confirm?`<section id="confirmar" class="aura-screen aura-screen-confirm reveal"><div class="aura-screen-shell"><div class="aura-confirm-panel"><div class="section-label">RSVP</div><h2${sizeAttr(p.rsvpHeadingSize,'sectionTitle')}>¿Nos acompañas?</h2><p class="aura-confirm-copy"${sizeAttr(p.rsvpCopySize,'body')}>Tu confirmación nos ayuda a preparar cada detalle.</p>${confirm}</div></div></section>`:'';
 const transferInner=auraTransfer54(p,a);
 const transferStage=transferInner?`<section id="transferencia" class="aura-screen aura-screen-transfer reveal"><div class="aura-screen-shell"><div class="aura-transfer-panel">${transferInner}</div></div></section>`:'';
 const extraBanner=a.extra?bannerHtml557(a.extra,p.bannerExtraMode,'aura-inline-banner aura-inline-banner-1','Banner extra'):'';
 const extraBanner2=a.extra2?bannerHtml557(a.extra2,p.bannerExtra2Mode,'aura-inline-banner aura-inline-banner-2','Banner extra 2'):'';
 const stages=[
  {html:locationStage,order:+p.orderLocations||0},
  {html:familyStage,order:+p.orderFamily||0},
  {html:confirmStage,order:+p.orderConfirm||0},
  {html:dateStage,order:+p.orderCountdown||0},
  {html:galleryStage,order:+p.orderGallery||0},
  {html:extraBanner,order:+p.orderBannerExtra||0},
  {html:extraBanner2,order:+p.orderBannerExtra2||0},
  {html:messageStage,order:+p.orderMessage||0},
  {html:videoStage,order:+p.orderVideo||0},
  {html:transferStage,order:(p.orderTransfer===''||p.orderTransfer==null)?10:+p.orderTransfer}
 ];
 return stages.filter(x=>x.html&&x.order>0).sort((a,b)=>a.order-b.order).map(x=>x.html).join('');
}

const _coverHtml54=coverHtml;
coverHtml=function(params){
 const p={...COVER_DEFAULTS,...params};
 if(!isAuraEditorial53(p.themeVisual))return _coverHtml54(params);
 if(typeof isWedding55==='function'&&isWedding55(p.themeVisual)&&p.heroLayout&&p.heroLayout!=='theme')return _coverHtml52(params);
 const isXV=p.themeVisual==='aura_editorial_xv';
 const d=eventDateParts(p.eventDate);
 const label=p.showHeroLabel?`<div class="hero-kicker" data-edit="heroLabelText"${sizeAttr(p.heroLabelSize,'sectionLabel')}>${esc(p.heroLabelText.trim()||eventLabel(p.preset))}</div>`:'';
 const title=p.title?.trim()?`<h1 data-edit="title"${sizeAttr(p.titleSize,'heroTitle')}>${esc(p.title)}</h1>`:'';
 const phrase=p.subtitle?.trim()?`<p data-edit="subtitle"${sizeAttr(p.subtitleSize,'heroSubtitle')}>${esc(p.subtitle)}</p>`:'';
 const date=d?`<div class="aura-cover-date"><span>${esc(d.day)} · ${esc(d.month)} · ${esc(d.year)}</span></div>`:'';
 const quick=auraQuickActions53(p);
 const enter=p.showHeroButton?`<button type="button" class="enter-btn aura-enter" data-edit="buttonText"${sizeAttr(p.buttonTextSize,'button')} data-enter>${esc(p.buttonText||'Entrar a la invitación')} <span aria-hidden="true">↓</span></button>`:'';
 const scroll=p.showHeroScroll?'<div class="scroll-note aura-scroll-note">Desliza para descubrir</div>':'';
 return `<header class="hero cover-theme aura-editorial-cover aura-story-cover ${isXV?'aura-xv-cover':'aura-boda-cover'}" data-offset="${bounded(p.heroOffset,0,-200,200)}"><div class="hero-media"></div><div class="hero-overlay"></div><div class="aura-cover-accent" aria-hidden="true"><span></span><i>${isXV?'XV':'♡'}</i><span></span></div><div class="hero-inner"><div class="aura-editorial-copy">${label}${title}${date}${phrase}</div>${quick}${enter}</div>${scroll}</header>`;
};

const _buildSections54=buildSections;
buildSections=function(p,a){
 if(!isAuraEditorial53(p.themeVisual))return _buildSections54(p,a);
 return auraEditorialSections54(p,a);
};

const _invitationCss54=invitationCss;
invitationCss=function(p,t,a){
 const base=_invitationCss54(p,t,a);
 if(!isAuraEditorial53(p.themeVisual))return base;
 const isXV=p.themeVisual==='aura_editorial_xv';
 const radius=isXV?'30px':'4px';
 const surfaceAlpha=bounded(p.contentBgOpacity,.82,0,1);
 const surfaceAlt=Math.max(0,Math.min(1,surfaceAlpha*.92));
 const panelAlpha=Math.max(.04,Math.min(1,surfaceAlpha));
 return base+`
/* Aura Digital 5.4 · seis pantallas editoriales */
/* Banner principal: conserva el acomodo histórico de Aura: inmediatamente después de la portada,
   a todo el ancho y sin separación. */
.theme-${p.themeVisual} .page>.banner{display:block!important;width:100%!important;height:clamp(250px,56vw,430px)!important;min-height:250px!important;max-height:430px!important;margin:0!important;border-radius:0!important;background-size:cover!important;background-position:center!important}
.theme-${p.themeVisual} .page>.banner::after{background:linear-gradient(to top,${rgba(p.headingColor,.16)},transparent 55%)!important}
.theme-${p.themeVisual} .content{width:100%;max-width:none;padding:0;margin:0}
/* Banners extra: conservan su orden configurable, pero se mantienen dentro del ancho editorial. */
.theme-${p.themeVisual} .aura-inline-banner{width:min(calc(100% - 30px),760px)!important;height:clamp(250px,56vw,430px)!important;min-height:250px!important;max-height:430px!important;margin:clamp(28px,6vw,56px) auto!important;border-radius:${isXV?'28px':'4px'}!important;overflow:hidden;background-size:cover!important;background-position:center!important;box-shadow:0 20px 55px ${rgba(p.headingColor,.06)}}
.theme-${p.themeVisual} .aura-screen{position:relative;min-height:100svh;margin:0;padding:clamp(26px,7vw,58px) 15px;display:flex;align-items:center;justify-content:center;background:linear-gradient(165deg,${rgba(p.bgContentColor,surfaceAlpha)},${rgba(p.bgBodyColor,surfaceAlpha)});overflow:hidden}
.theme-${p.themeVisual} .aura-screen:nth-child(even){background:linear-gradient(195deg,${rgba(p.bgBodyColor,surfaceAlt)},${rgba(p.bgContentColor,surfaceAlpha)})}
.theme-${p.themeVisual} .aura-screen::before,.theme-${p.themeVisual} .aura-screen::after{content:'';position:absolute;width:190px;height:190px;border:1px solid ${rgba(p.primaryColor,.11)};border-radius:50%;pointer-events:none}
.theme-${p.themeVisual} .aura-screen::before{left:-118px;top:-85px}.theme-${p.themeVisual} .aura-screen::after{right:-135px;bottom:-98px}
.theme-${p.themeVisual} .aura-screen-shell{position:relative;z-index:1;width:min(100%,650px);margin:auto}
.theme-${p.themeVisual} .aura-stage-photo{background-size:cover;background-position:center;min-height:330px;border-radius:${radius};box-shadow:0 22px 60px ${rgba(p.headingColor,.08)}}
.theme-${p.themeVisual} .aura-stage-photo-empty{background:radial-gradient(circle at 30% 20%,${rgba(p.primaryColor,.19)},transparent 32%),linear-gradient(145deg,${rgba(p.bgContentColor,panelAlpha)},${rgba(p.bgBodyColor,surfaceAlt)})}
.theme-${p.themeVisual} .aura-screen .section-label{font:500 8px/1.6 var(--body);letter-spacing:.28em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}
.theme-${p.themeVisual} .aura-screen h2{font:400 clamp(38px,10vw,62px)/1.02 var(--display);letter-spacing:-.03em;color:var(--heading);margin:0}
.theme-${p.themeVisual} .aura-date-photo{height:42svh;min-height:280px;max-height:430px}
.theme-${p.themeVisual} .aura-date-panel{position:relative;width:min(88%,480px);margin:-78px auto 0;padding:66px 28px 34px;text-align:center;border:1px solid ${rgba(p.primaryColor,.21)};border-radius:${isXV?'220px 220px 28px 28px':'4px'};background:${rgba(p.bgContentColor,panelAlpha)};box-shadow:0 24px 60px ${rgba(p.headingColor,.08)};backdrop-filter:blur(14px)}
.theme-${p.themeVisual} .aura-date-panel h2{font-size:clamp(34px,8.4vw,52px);max-width:11ch;margin:auto}
.theme-${p.themeVisual} .aura-date-lockup{margin:22px auto 0;display:grid;justify-items:center;color:var(--heading)}
.theme-${p.themeVisual} .aura-date-lockup>span:first-child{font:500 8px/1.4 var(--body);letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}
.theme-${p.themeVisual} .aura-date-lockup strong{font:400 clamp(66px,18vw,108px)/.88 var(--display);letter-spacing:-.05em}
.theme-${p.themeVisual} .aura-date-lockup>span:nth-child(3){font:500 9px/1.4 var(--body);letter-spacing:.22em;text-transform:uppercase}.theme-${p.themeVisual} .aura-date-lockup em{margin-top:9px;font:400 10px/1.4 var(--body);font-style:normal;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.theme-${p.themeVisual} .aura-date-note{max-width:31ch;margin:22px auto 0;color:var(--muted);font-size:12px;line-height:1.75}
.theme-${p.themeVisual} .aura-countdown{margin-top:24px;padding-top:20px}.theme-${p.themeVisual} .aura-countdown .count-item{padding:12px 5px}.theme-${p.themeVisual} .aura-countdown .count-item b{font-size:26px}.theme-${p.themeVisual} .aura-countdown .count-item span{font-size:6.5px}
.theme-${p.themeVisual} .aura-family-portrait{position:relative;width:min(86%,490px);margin:0 auto -94px;z-index:2;padding:0 14px}.theme-${p.themeVisual} .aura-family-photo{height:49svh;min-height:340px;max-height:500px;border-radius:${isXV?'230px 230px 22px 22px':'3px'}}
.theme-${p.themeVisual} .aura-family-panel{position:relative;padding:122px 26px 42px;text-align:center;border:1px solid ${rgba(p.primaryColor,.18)};border-radius:${isXV?'34px':'4px'};background:${rgba(p.bgContentColor,panelAlpha)};box-shadow:0 22px 55px ${rgba(p.headingColor,.065)}}
.theme-${p.themeVisual} .aura-family-panel h2{max-width:12ch;margin:auto;font-size:clamp(36px,9vw,55px)}
.theme-${p.themeVisual} .aura-family-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;margin-top:32px;border-top:1px solid ${rgba(p.primaryColor,.18)}}
.theme-${p.themeVisual} .aura-family-name{padding:26px 16px 5px;min-width:0}.theme-${p.themeVisual} .aura-family-name+ .aura-family-name{border-left:1px solid ${rgba(p.primaryColor,.18)}}
.theme-${p.themeVisual} .aura-family-name small{display:block;margin-bottom:10px;font:500 7px/1.4 var(--body);letter-spacing:.24em;text-transform:uppercase;color:var(--muted)}.theme-${p.themeVisual} .aura-family-name strong{display:block;font:400 clamp(22px,5.7vw,34px)/1.2 var(--display);color:var(--heading);white-space:normal;overflow-wrap:break-word}
.theme-${p.themeVisual} .aura-gallery-heading{text-align:center;margin-bottom:30px}.theme-${p.themeVisual} .aura-gallery-heading h2{max-width:12ch;margin:auto}.theme-${p.themeVisual} .aura-gallery-ornament{width:46px;height:1px;margin:22px auto 0;background:var(--accent);opacity:.5}
.theme-${p.themeVisual} .aura-gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:118px;gap:7px}.theme-${p.themeVisual} .aura-gallery-tile{margin:0;overflow:hidden;border-radius:${isXV?'16px':'2px'};min-height:0}.theme-${p.themeVisual} .aura-gallery-tile img{width:100%;height:100%;display:block;object-fit:cover;cursor:zoom-in}.theme-${p.themeVisual} .aura-gallery-tile-1{grid-column:span 2;grid-row:span 3}.theme-${p.themeVisual} .aura-gallery-tile-2,.theme-${p.themeVisual} .aura-gallery-tile-3{grid-row:span 1}.theme-${p.themeVisual} .aura-gallery-tile-4{grid-column:span 1;grid-row:span 2}.theme-${p.themeVisual} .aura-gallery-tile-5{grid-column:span 2;grid-row:span 2}.theme-${p.themeVisual} .aura-gallery-tile-6{grid-column:span 3;grid-row:span 2}
.theme-${p.themeVisual} .aura-screen-gallery .gallery-footer{padding-inline:2px}.theme-${p.themeVisual} .aura-inline-video{margin-top:36px;padding-top:28px;border-top:1px solid ${rgba(p.primaryColor,.16)}}.theme-${p.themeVisual} .aura-inline-video h3{font:400 clamp(30px,8vw,46px)/1.05 var(--display);color:var(--heading);margin:0 0 18px}
.theme-${p.themeVisual} .aura-location-photo{height:39svh;min-height:280px;max-height:410px;border-radius:${isXV?'26px 26px 0 0':'3px 3px 0 0'}}
.theme-${p.themeVisual} .aura-location-panel{padding:34px 24px 30px;text-align:center;border:1px solid ${rgba(p.primaryColor,.18)};border-top:0;border-radius:${isXV?'0 0 26px 26px':'0 0 3px 3px'};background:${rgba(p.bgContentColor,panelAlpha)}}.theme-${p.themeVisual} .aura-location-panel>h2{font-size:clamp(36px,9vw,54px);max-width:12ch;margin:auto}.theme-${p.themeVisual} .aura-locations{display:grid;gap:18px;margin-top:30px}
.theme-${p.themeVisual} .aura-location-card{overflow:hidden;border-top:1px solid ${rgba(p.primaryColor,.18)};padding-top:20px}.theme-${p.themeVisual} .aura-location-copy small{display:block;font:500 7px/1.4 var(--body);letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}.theme-${p.themeVisual} .aura-location-copy strong{display:block;margin-top:5px;font:400 clamp(27px,7vw,40px)/1.06 var(--display);color:var(--heading)}.theme-${p.themeVisual} .aura-map-button{display:inline-flex;gap:8px;align-items:center;margin-top:14px;padding:10px 17px;border:1px solid ${rgba(p.primaryColor,.5)};border-radius:999px;text-decoration:none;font:500 8px/1 var(--body);letter-spacing:.12em;text-transform:uppercase;color:var(--heading)}.theme-${p.themeVisual} .aura-map-preview{margin-top:18px;aspect-ratio:16/10;overflow:hidden;border-radius:${isXV?'18px':'2px'};border:1px solid ${rgba(p.primaryColor,.14)}}.theme-${p.themeVisual} .aura-map-preview iframe{width:100%;height:100%;border:0;filter:saturate(.78) contrast(.96)}.theme-${p.themeVisual} .aura-location-note{max-width:30ch;margin:25px auto 0;color:var(--muted);font-size:11px;line-height:1.7}
.theme-${p.themeVisual} .aura-close-shell{position:relative;min-height:82svh;display:flex;align-items:flex-end}.theme-${p.themeVisual} .aura-close-photo{position:absolute;inset:0;min-height:100%;border-radius:${isXV?'28px':'3px'};background-position:center}.theme-${p.themeVisual} .aura-close-photo::after{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(to top,${rgba(p.bgContentColor,.99)} 0%,${rgba(p.bgContentColor,.92)} 30%,${rgba(p.bgContentColor,.18)} 67%,transparent 84%)}
.theme-${p.themeVisual} .aura-close-panel{position:relative;z-index:2;width:100%;padding:44px 28px 34px;text-align:center}.theme-${p.themeVisual} .aura-close-panel .section-label{font-size:9px}.theme-${p.themeVisual} .aura-close-panel .final-message{font:400 clamp(40px,10vw,62px)/1.08 var(--display);max-width:12ch;margin:auto;color:var(--heading)}.theme-${p.themeVisual} .aura-close-panel .closing-signature{margin-top:22px}.theme-${p.themeVisual} .aura-confirm{display:flex;align-items:center;justify-content:center;gap:10px;min-height:54px;margin:30px auto 0;padding:14px 22px;width:min(100%,390px);border-radius:${isXV?'16px':'2px'};background:var(--accent);color:${buttonInk(p.primaryColor)};text-decoration:none;font:600 9px/1.3 var(--body);letter-spacing:.12em;text-transform:uppercase}.theme-${p.themeVisual} .aura-confirm span{font-size:15px}
.theme-${p.themeVisual} .aura-video-panel,.theme-${p.themeVisual} .aura-confirm-panel{width:min(100%,620px);margin:auto;padding:clamp(32px,7vw,52px);border:1px solid ${rgba(p.primaryColor,.18)};border-radius:${isXV?'26px':'4px'};background:${rgba(p.bgContentColor,panelAlpha)};backdrop-filter:blur(14px);box-shadow:0 22px 55px ${rgba(p.headingColor,.06)};text-align:center}.theme-${p.themeVisual} .aura-screen-video .aura-inline-video{margin:0;padding:0;border:0}.theme-${p.themeVisual} .aura-screen-video .aura-inline-video h3{margin-left:auto;margin-right:auto}.theme-${p.themeVisual} .aura-confirm-panel>h2{max-width:12ch;margin:0 auto;font:400 clamp(38px,10vw,58px)/1.02 var(--display);color:var(--heading)}.theme-${p.themeVisual} .aura-confirm-copy{max-width:31ch;margin:18px auto 0;color:var(--muted);font-size:12px;line-height:1.7}.theme-${p.themeVisual} .aura-transfer{width:min(100%,390px);margin:14px auto 0;padding-top:14px;border-top:1px solid ${rgba(p.primaryColor,.18)}}.theme-${p.themeVisual} .aura-transfer>span{display:block;margin-bottom:8px;font:500 7px/1.3 var(--body);letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}.theme-${p.themeVisual} .aura-transfer button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;border:1px solid ${rgba(p.primaryColor,.35)};border-radius:${isXV?'14px':'2px'};background:${rgba(p.bgContentColor,Math.max(.04,panelAlpha*.82))};color:var(--heading);cursor:pointer}.theme-${p.themeVisual} .aura-transfer b{font:500 11px/1.2 var(--body);letter-spacing:.06em}.theme-${p.themeVisual} .aura-transfer em{font:500 7px/1 var(--body);font-style:normal;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.theme-${p.themeVisual} .hero.aura-story-cover .aura-cover-accent{position:absolute;z-index:3;top:max(24px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);display:grid;grid-template-columns:30px auto 30px;gap:10px;align-items:center;color:#fffaf6;opacity:.78}.theme-${p.themeVisual} .aura-cover-accent span{height:1px;background:currentColor;opacity:.58}.theme-${p.themeVisual} .aura-cover-accent i{font:400 13px/1 var(--display);font-style:normal}.theme-${p.themeVisual} .aura-cover-date{margin-top:13px;font:500 8px/1.5 var(--body);letter-spacing:.22em;text-transform:uppercase;opacity:.9}
.theme-${p.themeVisual} .hero.aura-story-cover .aura-enter{display:flex;width:min(100%,430px);min-height:48px;margin:12px auto 0;border-radius:999px;background:${rgba(p.bgContentColor,bounded(p.buttonOpacity,.92,0,1))};border:1px solid rgba(255,255,255,.48);backdrop-filter:blur(12px);color:#fffaf6}.theme-${p.themeVisual} .hero.aura-story-cover .aura-scroll-note{bottom:max(12px,env(safe-area-inset-bottom));font-size:7px;letter-spacing:.18em;opacity:.76}.theme-${p.themeVisual} .aura-confirm-anchor{scroll-margin-top:22px}
.theme-aura_editorial_xv .hero.aura-story-cover .hero-inner{width:min(88%,560px);margin:0 auto;text-align:center;padding-bottom:max(34px,env(safe-area-inset-bottom))}.theme-aura_editorial_xv .hero.aura-story-cover .aura-editorial-copy h1{font-size:clamp(56px,15vw,88px)}.theme-aura_editorial_xv .hero.aura-story-cover .aura-quick-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;width:min(100%,430px);margin:24px auto 0}.theme-aura_editorial_xv .hero.aura-story-cover .aura-quick-action{min-height:86px;display:flex;flex-direction:column;justify-content:center;gap:7px;padding:11px 6px;border-radius:16px;background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.33)}.theme-aura_editorial_xv .hero.aura-story-cover .aura-quick-action svg{width:22px;height:22px}.theme-aura_editorial_xv .hero.aura-story-cover .aura-quick-action span{text-align:center;font-size:7px;letter-spacing:.08em;text-transform:uppercase;line-height:1.4}.theme-aura_editorial_xv .hero.aura-story-cover .aura-quick-action b{display:none}
.theme-aura_editorial_boda .hero.aura-story-cover .aura-cover-accent i{font-size:15px}.theme-aura_editorial_boda .hero.aura-story-cover .aura-quick-action{border-radius:999px}.theme-aura_editorial_boda .aura-date-panel,.theme-aura_editorial_boda .aura-family-panel,.theme-aura_editorial_boda .aura-location-panel{outline:1px solid ${rgba(p.primaryColor,.12)};outline-offset:7px}.theme-aura_editorial_boda .aura-gallery-grid{gap:10px}.theme-aura_editorial_boda .aura-gallery-tile{border-radius:1px}
@media(max-width:430px){.theme-${p.themeVisual} .aura-screen{padding-inline:11px}.theme-${p.themeVisual} .aura-date-panel{width:91%;padding-inline:20px}.theme-${p.themeVisual} .aura-family-portrait{width:91%;padding-inline:8px}.theme-${p.themeVisual} .aura-family-panel{padding-inline:18px}.theme-${p.themeVisual} .aura-family-grid{grid-template-columns:1fr}.theme-${p.themeVisual} .aura-family-name+ .aura-family-name{border-left:0;border-top:1px solid ${rgba(p.primaryColor,.18)}}.theme-${p.themeVisual} .aura-gallery-grid{grid-auto-rows:104px}.theme-${p.themeVisual} .aura-location-panel,.theme-${p.themeVisual} .aura-close-panel{padding-inline:20px}.theme-aura_editorial_xv .hero.aura-story-cover .aura-quick-actions{gap:7px}.theme-aura_editorial_xv .hero.aura-story-cover .aura-quick-action{min-height:80px}}
`;
};

const _configObject54=configObject;
configObject=function(p){const c=_configObject54(p);c.schemaVersion=5.41;c.studioVersion='5.4.1';return c};

/* =========================
   Aura Digital 5.5 · Colección Boda · 10 estilos
   Diez estructuras visuales reales sobre el motor editorial de 6 pantallas.
   Todas derivan sus acentos de la paleta activa del Studio.
   ========================= */
const WEDDING_THEME_IDS_55=[
 'wedding_minimal','wedding_floral','wedding_monogram','wedding_luxury','wedding_mediterranean',
 'wedding_layers','wedding_timeline','wedding_curves','wedding_double_panel','wedding_immersive'
];

Object.assign(THEMES,{
 wedding_minimal:{label:'01 · Editorial minimal',palette:'ivory_champagne',swatch:'linear-gradient(160deg,#f8f4ed 0 56%,#c9b79d 57% 58%,#57483b 59%)',display:"'Cormorant Garamond',serif",body:"'Manrope',sans-serif",radius:'2px',hero:'photo',ornament:'line',section:'w55_minimal'},
 wedding_floral:{label:'02 · Romántica floral',palette:'rose_taupe',swatch:'radial-gradient(circle at 18% 22%,#d9b9bf 0 10%,transparent 11%),radial-gradient(circle at 82% 76%,#879075 0 12%,transparent 13%),linear-gradient(145deg,#fbf6f3,#d9c7c2)',display:"'Playfair Display',serif",body:"'Manrope',sans-serif",radius:'26px',hero:'photo',ornament:'leaf',section:'w55_floral'},
 wedding_monogram:{label:'03 · Clásica monograma',palette:'forest_gold',swatch:'linear-gradient(135deg,#f7f2e7 0 63%,#b59b66 64% 66%,#263c31 67%)',display:"'Italiana',serif",body:"'Manrope',sans-serif",radius:'0px',hero:'framed',ornament:'monogram',section:'w55_monogram'},
 wedding_luxury:{label:'04 · Moderna de lujo',palette:'dark_velvet',swatch:'linear-gradient(145deg,#100d10 0 56%,#8f6d54 57% 59%,#d9c9bd 60%)',display:"'Italiana',serif",body:"'DM Sans',sans-serif",radius:'0px',hero:'dramatic',ornament:'line',section:'w55_luxury'},
 wedding_mediterranean:{label:'05 · Mediterránea romántica',palette:'blue_sand',swatch:'linear-gradient(180deg,#8298aa 0 38%,#ece3d4 39% 72%,#a36f56 73%)',display:"'Cormorant Garamond',serif",body:"'Manrope',sans-serif",radius:'20px',hero:'photo',ornament:'sun',section:'w55_mediterranean'},
 wedding_layers:{label:'06 · Editorial en capas',palette:'mocha_blush',swatch:'linear-gradient(135deg,#dac9c1 0 42%,#f8f3ed 43% 70%,#8e756b 71%)',display:"'Playfair Display',serif",body:"'DM Sans',sans-serif",radius:'8px',hero:'photo',ornament:'none',section:'w55_layers'},
 wedding_timeline:{label:'07 · Timeline moderna',palette:'sage_stone',swatch:'linear-gradient(90deg,#eef0e8 0 45%,#72806b 46% 48%,#30352f 49%)',display:"'DM Sans',sans-serif",body:"'Manrope',sans-serif",radius:'8px',hero:'bottom',ornament:'dot',section:'w55_timeline'},
 wedding_curves:{label:'08 · Secciones curvas',palette:'blush_cocoa',swatch:'radial-gradient(circle at 50% 110%,#fff8f3 0 43%,transparent 44%),linear-gradient(145deg,#bd877c,#eadbd4)',display:"'Cormorant Garamond',serif",body:"'Manrope',sans-serif",radius:'40px',hero:'curve',ornament:'none',section:'w55_curves'},
 wedding_double_panel:{label:'09 · Editorial doble panel',palette:'olive_ivory',swatch:'linear-gradient(90deg,#293128 0 49%,#f8f4eb 50%)',display:"'Italiana',serif",body:"'DM Sans',sans-serif",radius:'0px',hero:'split',ornament:'line',section:'w55_double'},
 wedding_immersive:{label:'10 · Inmersiva degradado',palette:'noir_wine',swatch:'linear-gradient(180deg,#111014 0 35%,#5d3346 67%,#d0b7ae 100%)',display:"'Playfair Display',serif",body:"'Manrope',sans-serif",radius:'18px',hero:'dramatic',ornament:'none',section:'w55_immersive'}
});

COLLECTIONS.boda.themes=[...WEDDING_THEME_IDS_55];
COLLECTIONS.boda.palettes=Object.keys(PALETTES);
COLLECTIONS.boda.note='10 propuestas de boda con todas las paletas del Studio disponibles y editables.';

Object.assign(AURA_THEME_PREVIEWS_531,{
 wedding_minimal:{src:'assets/previews/weddings55/01-minimal.svg',kicker:'BODA · 01',title:'Minimal',note:'aire · líneas · foto'},
 wedding_floral:{src:'assets/previews/weddings55/02-floral.svg',kicker:'BODA · 02',title:'Floral',note:'romántica · suave'},
 wedding_monogram:{src:'assets/previews/weddings55/03-monogram.svg',kicker:'BODA · 03',title:'Monograma',note:'clásica · marco'},
 wedding_luxury:{src:'assets/previews/weddings55/04-luxury.svg',kicker:'BODA · 04',title:'Lujo',note:'oscura · dorado'},
 wedding_mediterranean:{src:'assets/previews/weddings55/05-mediterranean.svg',kicker:'BODA · 05',title:'Mediterránea',note:'sol · arena · azul'},
 wedding_layers:{src:'assets/previews/weddings55/06-layers.svg',kicker:'BODA · 06',title:'Capas',note:'editorial · solapes'},
 wedding_timeline:{src:'assets/previews/weddings55/07-timeline.svg',kicker:'BODA · 07',title:'Timeline',note:'ritmo · secuencia'},
 wedding_curves:{src:'assets/previews/weddings55/08-curves.svg',kicker:'BODA · 08',title:'Curvas',note:'orgánica · suave'},
 wedding_double_panel:{src:'assets/previews/weddings55/09-double.svg',kicker:'BODA · 09',title:'Doble panel',note:'split · editorial'},
 wedding_immersive:{src:'assets/previews/weddings55/10-immersive.svg',kicker:'BODA · 10',title:'Inmersiva',note:'degradado · foto'}
});

const _isAuraEditorial55=isAuraEditorial53;
isAuraEditorial53=function(theme){return _isAuraEditorial55(theme)||WEDDING_THEME_IDS_55.includes(theme)};
function isWedding55(theme){return WEDDING_THEME_IDS_55.includes(theme)}
function hexRgb55(hex){const v=String(hex||'#000000').replace('#','').trim();const n=parseInt(v.length===3?v.split('').map(x=>x+x).join(''):v,16);return [(n>>16)&255,(n>>8)&255,n&255]}
function lum55(hex){const [r,g,b]=hexRgb55(hex).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b}
function paletteDark55(p){return [p.headingColor,p.textColor,p.bgBodyColor,p.bgContentColor].filter(Boolean).sort((a,b)=>lum55(a)-lum55(b))[0]||'#111111'}
function paletteLight55(p){return [p.headingColor,p.textColor,p.bgBodyColor,p.bgContentColor].filter(Boolean).sort((a,b)=>lum55(b)-lum55(a))[0]||'#ffffff'}
function mixHex55(a,b,t){const A=hexRgb55(a),B=hexRgb55(b),q=Math.max(0,Math.min(1,+t||0));return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*q).toString(16).padStart(2,'0')).join('')}

const WEDDING_DEFAULTS_55={
 wedding_minimal:{gallery:'narrative',overlay:'#1b1713',opacity:'0.08',align:'center',block:'center',width:'88',button:'outline_thin'},
 wedding_floral:{gallery:'editorial',overlay:'#2b1f1e',opacity:'0.12',align:'left',block:'start',width:'84',button:'glass_soft'},
 wedding_monogram:{gallery:'editorial',overlay:'#17231c',opacity:'0.10',align:'center',block:'center',width:'80',button:'outline_thin'},
 wedding_luxury:{gallery:'narrative',overlay:'#080709',opacity:'0.28',align:'right',block:'end',width:'84',button:'outline_thin'},
 wedding_mediterranean:{gallery:'story',overlay:'#32261f',opacity:'0.10',align:'left',block:'start',width:'88',button:'glass_soft'},
 wedding_layers:{gallery:'narrative',overlay:'#2c231e',opacity:'0.10',align:'left',block:'start',width:'86',button:'glass_soft'},
 wedding_timeline:{gallery:'filmstrip',overlay:'#1b201b',opacity:'0.10',align:'left',block:'start',width:'86',button:'outline_thin'},
 wedding_curves:{gallery:'editorial',overlay:'#34221e',opacity:'0.08',align:'center',block:'center',width:'88',button:'glass_soft'},
 wedding_double_panel:{gallery:'editorial',overlay:'#151914',opacity:'0.08',align:'left',block:'start',width:'86',button:'outline_thin'},
 wedding_immersive:{gallery:'narrative',overlay:'#08070a',opacity:'0.32',align:'center',block:'center',width:'88',button:'glass_soft'}
};

chooseTheme=function(k){
 if(isWedding55(k)){
  if(!THEMES[k])return;
  $('themeVisual').value=k;
  // Cambiar la piel visual no debe tocar contenido, paleta, opacidades, fondo ni orden.
  auraThemeSnapshot531=null;
  auraThemeState531=k;
  syncCoverUi();renderThemeStrip();renderPaletteStrip();updatePreview();
  return;
 }
 return _chooseTheme53(k);
};

function weddingThemeCss55(p){
 const C=`.theme-${p.themeVisual}`;
 const alpha=bounded(p.contentBgOpacity,.82,0,1),strong=Math.min(1,Math.max(0,alpha)),border=rgba(p.primaryColor,.28),soft=rgba(p.primaryColor,.12),card=rgba(p.bgContentColor,strong),ink=rgba(p.headingColor,.92),dark=paletteDark55(p),light=paletteLight55(p),darkAccent=mixHex55(dark,p.primaryColor,.20);
 switch(p.themeVisual){
  case 'wedding_minimal': return `
${C} .hero.aura-story-cover .hero-overlay{background:linear-gradient(to top,${rgba(dark,.66)},${rgba(dark,.08)} 62%),${rgba(p.overlayColor,bounded(p.overlayOpacity,.08,0,.8))}}
${C} .hero.aura-story-cover .aura-cover-accent{top:9%;opacity:.62}${C} .hero.aura-story-cover .hero-inner{width:min(82%,560px);padding-bottom:7vh}${C} .hero.aura-story-cover h1{font-size:clamp(58px,14vw,90px);font-weight:400}
${C} .aura-quick-actions{gap:8px}${C} .aura-quick-action{border-radius:0!important;background:${rgba(light,.04)}!important;border-width:1px 0!important}
${C} .aura-screen{background:${rgba(p.bgBodyColor,alpha)}!important}${C} .aura-screen::before,${C} .aura-screen::after{display:none}${C} .aura-screen-shell{width:min(100%,610px)}
${C} .aura-date-photo,${C} .aura-family-photo,${C} .aura-location-photo{border-radius:0!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{border-radius:0!important;box-shadow:none!important;border-width:1px 0!important;background:transparent!important}
${C} .aura-gallery-grid{grid-template-columns:1.15fr .85fr;grid-auto-rows:150px;gap:18px}${C} .aura-gallery-tile{border-radius:0!important}${C} .aura-gallery-tile-1{grid-column:1;grid-row:span 3}${C} .aura-gallery-tile-2{grid-column:2;grid-row:span 2}${C} .aura-gallery-tile-3{grid-column:2;grid-row:span 1}${C} .aura-gallery-tile-4,${C} .aura-gallery-tile-5,${C} .aura-gallery-tile-6{grid-column:span 1;grid-row:span 2}
${C} .aura-close-photo{border-radius:0!important}${C} .aura-confirm{border-radius:0!important}`;
  case 'wedding_floral': return `
${C} .hero.aura-story-cover .hero-overlay{background:linear-gradient(90deg,${rgba(dark,.48)},transparent 62%),linear-gradient(to top,${rgba(dark,.57)},transparent 60%),${rgba(p.overlayColor,bounded(p.overlayOpacity,.12,0,.8))}}
${C} .hero.aura-story-cover::after{content:'';position:absolute;z-index:2;inset:auto -90px -70px auto;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle at 35% 35%,${rgba(p.primaryColor,.42)} 0 8%,transparent 9%),radial-gradient(circle at 55% 48%,${rgba(p.primaryColor,.26)} 0 11%,transparent 12%),radial-gradient(circle at 72% 33%,${rgba(p.headingColor,.16)} 0 9%,transparent 10%);filter:blur(1px)}
${C} .hero.aura-story-cover .hero-inner{margin-left:7%;margin-right:auto;text-align:left;width:min(80%,520px)}${C} .hero.aura-story-cover .aura-cover-accent{left:7%;transform:none;grid-template-columns:26px auto 26px}
${C} .aura-screen{background:radial-gradient(circle at 8% 20%,${rgba(p.primaryColor,.08)},transparent 25%),linear-gradient(165deg,${rgba(p.bgContentColor,alpha)},${rgba(p.bgBodyColor,alpha)})!important}${C} .aura-screen-shell{width:min(100%,630px)}
${C} .aura-date-photo,${C} .aura-family-photo{border-radius:180px 180px 28px 28px!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{border-radius:32px!important;background:${card}!important}
${C} .aura-gallery-grid{display:flex;gap:14px;overflow:auto;padding:20px 22px 34px}${C} .aura-gallery-tile{flex:0 0 72%;height:440px;border-radius:150px 150px 24px 24px!important;transform:rotate(-1.5deg)}${C} .aura-gallery-tile:nth-child(even){transform:rotate(1.5deg);margin-top:26px}
${C} .aura-location-photo{border-radius:28px 28px 0 0!important}${C} .aura-close-photo{border-radius:160px 160px 28px 28px!important}`;
  case 'wedding_monogram': return `
${C} .hero.aura-story-cover::before{content:'';position:absolute;z-index:2;inset:28px;border:1px solid ${rgba(light,.58)};pointer-events:none}${C} .hero.aura-story-cover::after{content:'✦';position:absolute;z-index:3;top:42px;left:50%;transform:translateX(-50%);color:#fff;font-size:18px}
${C} .hero.aura-story-cover .aura-cover-accent{display:none}${C} .hero.aura-story-cover .hero-inner{width:min(76%,510px);padding:42px;border:1px solid ${rgba(light,.24)};background:${rgba(dark,.10)};backdrop-filter:blur(3px)}${C} .hero h1{font-family:'Italiana',serif!important;font-size:clamp(52px,12vw,78px)!important;letter-spacing:-.02em!important}
${C} .aura-screen{background:${rgba(p.bgContentColor,alpha)}!important}${C} .aura-screen::before,${C} .aura-screen::after{border-radius:0;transform:rotate(45deg);width:140px;height:140px}
${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{outline:1px solid ${border};outline-offset:8px;border-radius:0!important;background:${rgba(p.bgContentColor,strong)}!important}${C} .aura-stage-photo{border-radius:0!important}
${C} .aura-gallery-grid{gap:12px;padding:14px;border:1px solid ${border}}${C} .aura-gallery-tile{border-radius:0!important;outline:1px solid ${soft};outline-offset:-5px}
${C} .aura-confirm{border-radius:0!important;outline:1px solid ${rgba(p.primaryColor,.45)};outline-offset:5px}`;
  case 'wedding_luxury': return `
${C}{--bg-dark:${p.bgBodyColor}}${C} .hero.aura-story-cover .hero-overlay{background:linear-gradient(100deg,${rgba(dark,.22)},${rgba(dark,.72)} 72%),linear-gradient(to top,${rgba(dark,.78)},transparent 55%),${rgba(p.overlayColor,bounded(p.overlayOpacity,.28,0,.8))}}${C} .hero.aura-story-cover .hero-inner{margin-left:auto;margin-right:8%;text-align:right;width:min(78%,520px)}${C} .hero.aura-story-cover .aura-cover-accent{left:auto;right:8%;transform:none}
${C} .aura-screen{background:linear-gradient(145deg,${rgba(dark,alpha)},${rgba(darkAccent,alpha)})!important;color:${light}}${C} .aura-screen::before,${C} .aura-screen::after{border-color:${rgba(p.primaryColor,.25)}}${C} .aura-screen h2,${C} .aura-location-copy strong,${C} .aura-family-name strong,${C} .aura-close-panel .final-message{color:${light}!important}${C} .aura-screen .section-label,${C} .aura-date-note,${C} .aura-location-note{color:${rgba(light,.68)}!important}
${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{background:linear-gradient(145deg,${rgba(light,.045)},${rgba(light,.018)})!important;border-color:${rgba(p.primaryColor,.36)}!important;box-shadow:0 34px 90px ${rgba(dark,.28)}!important}${C} .aura-stage-photo{filter:saturate(.72) contrast(1.08)}
${C} .aura-gallery-grid{display:block}${C} .aura-gallery-tile{height:68svh;margin:0 0 12px;border-radius:0!important}${C} .aura-gallery-tile img{filter:saturate(.78) contrast(1.05)}${C} .aura-confirm{border-radius:0!important;background:transparent!important;border:1px solid ${p.primaryColor};color:${light}!important}`;
  case 'wedding_mediterranean': return `
${C} .hero.aura-story-cover .hero-overlay{background:linear-gradient(to top,${rgba(dark,.60)},transparent 58%),linear-gradient(90deg,${rgba(dark,.35)},transparent 56%),${rgba(p.overlayColor,bounded(p.overlayOpacity,.10,0,.8))}}${C} .hero.aura-story-cover .hero-inner{margin-left:7%;margin-right:auto;text-align:left;width:min(82%,530px)}${C} .hero.aura-story-cover .aura-cover-accent{left:7%;transform:none}${C} .hero h1{font-style:italic}
${C} .aura-screen{background:linear-gradient(180deg,${rgba(p.bgContentColor,alpha)},${rgba(p.bgBodyColor,alpha)})!important}${C} .aura-screen::before{width:260px;height:260px;border-radius:50%;left:-170px;top:30%;background:${rgba(p.primaryColor,.07)};border:0}${C} .aura-screen::after{display:none}
${C} .aura-date-photo,${C} .aura-family-photo,${C} .aura-location-photo{border-radius:220px 220px 18px 18px!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{border-radius:18px!important;border-color:${soft}!important;background:${rgba(p.bgContentColor,strong)}!important}
${C} .aura-gallery-grid{grid-template-columns:repeat(2,1fr);grid-auto-rows:210px;gap:10px}${C} .aura-gallery-tile{border-radius:110px 110px 14px 14px!important}${C} .aura-gallery-tile-1{grid-column:1/-1;grid-row:span 2}${C} .aura-gallery-tile-2,${C} .aura-gallery-tile-3,${C} .aura-gallery-tile-4,${C} .aura-gallery-tile-5{grid-column:auto;grid-row:auto}${C} .aura-gallery-tile-6{grid-column:1/-1;grid-row:auto}
${C} .aura-map-preview{border-radius:18px!important}${C} .aura-close-photo{border-radius:220px 220px 18px 18px!important}`;
  case 'wedding_layers': return `
${C} .hero.aura-story-cover .hero-inner{width:min(82%,540px);margin-left:6%;margin-right:auto;text-align:left;padding:30px;background:${rgba(p.bgContentColor,.14)};backdrop-filter:blur(10px);border:1px solid ${rgba(p.heroTextColor,.28)};transform:translateY(-3vh)}${C} .hero.aura-story-cover .aura-cover-accent{left:8%;transform:none}
${C} .aura-screen{background:${rgba(p.bgBodyColor,alpha)}!important}${C} .aura-screen-shell{perspective:1000px}${C} .aura-date-photo,${C} .aura-family-photo,${C} .aura-location-photo{width:86%;margin-left:0;border-radius:6px!important;box-shadow:0 24px 60px ${rgba(p.headingColor,.14)}}
${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{position:relative;width:88%;margin:-80px 0 0 auto;border-radius:8px!important;background:${rgba(p.bgContentColor,strong)}!important;box-shadow:0 30px 70px ${rgba(p.headingColor,.12)}!important;z-index:2}${C} .aura-family-panel{margin-top:-62px}
${C} .aura-gallery-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:18px 0 0}${C} .aura-gallery-tile{position:relative;width:100%;height:300px;border-radius:8px!important;box-shadow:0 24px 55px ${rgba(dark,.16)};grid-column:auto!important;grid-row:auto!important}${C} .aura-gallery-tile:nth-child(1){grid-column:1/-1!important;width:78%;height:430px;justify-self:start;transform:rotate(-3deg);z-index:1}${C} .aura-gallery-tile:nth-child(2){grid-column:1/-1!important;width:74%;height:420px;justify-self:end;margin-top:-150px;transform:rotate(3deg);z-index:2}${C} .aura-gallery-tile:nth-child(3){grid-column:1/-1!important;width:70%;height:390px;justify-self:center;margin-top:-120px;transform:rotate(-1deg);z-index:3}${C} .aura-gallery-tile:nth-child(n+4){display:block;transform:none;margin-top:0}${C} .aura-close-photo{border-radius:8px!important}`;
  case 'wedding_timeline': return `
${C} .hero.aura-story-cover .hero-inner{margin-left:7%;margin-right:auto;text-align:left;width:min(82%,540px)}${C} .hero.aura-story-cover .aura-cover-accent{left:7%;transform:none}${C} .hero h1{font-family:'DM Sans',sans-serif!important;font-weight:300!important;letter-spacing:-.06em!important}
${C} .aura-screen{align-items:flex-start;padding-top:10vh;background:${rgba(p.bgContentColor,alpha)}!important}${C} .aura-screen::before{left:31px;top:0;bottom:0;width:1px;height:auto;border:0;background:${rgba(p.primaryColor,.34)};border-radius:0}${C} .aura-screen::after{display:none}${C} .aura-screen-shell{padding-left:48px}
${C} .aura-screen-shell::before{content:'';position:absolute;left:-22px;top:14px;width:9px;height:9px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 7px ${rgba(p.primaryColor,.10)}}
${C} .aura-date-photo,${C} .aura-family-photo,${C} .aura-location-photo{border-radius:8px!important;max-height:46svh}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{border:0!important;border-left:1px solid ${border}!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;text-align:left!important}
${C} .aura-gallery-grid{display:flex;overflow:auto;gap:12px;padding-bottom:16px}${C} .aura-gallery-tile{flex:0 0 76%;height:55svh;border-radius:8px!important}${C} .aura-locations{position:relative;padding-left:20px}${C} .aura-location-card{border-left:1px solid ${border}!important;padding-left:22px!important}${C} .aura-location-card::before{content:'';position:absolute;width:8px;height:8px;border-radius:50%;background:var(--accent);margin-left:-27px;margin-top:3px}`;
  case 'wedding_curves': return `
${C} .hero.aura-story-cover::after{content:'';position:absolute;z-index:2;left:-8%;right:-8%;bottom:-11vh;height:28vh;border-radius:50% 50% 0 0;background:${p.bgBodyColor}}${C} .hero.aura-story-cover .hero-inner{z-index:3;padding-bottom:15vh}${C} .hero.aura-story-cover .aura-cover-accent{z-index:4}
${C} .aura-screen{background:${rgba(p.bgBodyColor,alpha)}!important;padding-block:9vh}${C} .aura-screen::before{left:-25%;top:6%;width:70%;height:34%;border:0;background:${rgba(p.primaryColor,.08)};border-radius:50%}${C} .aura-screen::after{right:-28%;bottom:4%;width:72%;height:38%;border:0;background:${rgba(p.headingColor,.04)};border-radius:50%}
${C} .aura-stage-photo{border-radius:50% 50% 18% 18% / 28% 28% 12% 12%!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{border-radius:58px 18px 58px 18px!important;background:${card}!important}
${C} .aura-gallery-grid{grid-template-columns:repeat(2,1fr);grid-auto-rows:240px;gap:12px}${C} .aura-gallery-tile{border-radius:50% 50% 14px 14px!important}${C} .aura-gallery-tile-1{grid-column:1/-1;grid-row:span 2}${C} .aura-gallery-tile-2,${C} .aura-gallery-tile-3,${C} .aura-gallery-tile-4,${C} .aura-gallery-tile-5{grid-column:auto;grid-row:auto}${C} .aura-gallery-tile-6{grid-column:1/-1;grid-row:auto}${C} .aura-confirm{border-radius:999px!important}`;
  case 'wedding_double_panel': return `
${C} .hero.aura-story-cover::before{content:'';position:absolute;z-index:1;inset:0 45% 0 0;background:linear-gradient(90deg,${rgba(p.bgContentColor,.96)} 0%,${rgba(p.bgContentColor,.88)} 72%,transparent 100%);pointer-events:none}${C} .hero.aura-story-cover .hero-overlay{background:linear-gradient(90deg,transparent 0 48%,${rgba(dark,.18)} 49%,${rgba(dark,.52)}),${rgba(p.overlayColor,bounded(p.overlayOpacity,.08,0,.8))}}${C} .hero.aura-story-cover .hero-inner{z-index:3;width:44%;margin-left:3%;margin-right:auto;text-align:left;color:${p.headingColor}}${C} .hero.aura-story-cover .hero-kicker,${C} .hero.aura-story-cover .aura-cover-date,${C} .hero.aura-story-cover p{color:${p.textColor}}${C} .hero.aura-story-cover .aura-cover-accent{left:25%;color:${p.headingColor}}
${C} .hero.aura-story-cover .aura-quick-actions{display:grid;grid-template-columns:1fr;margin-top:18px}${C} .hero.aura-story-cover .aura-quick-action{color:${p.headingColor};border-color:${rgba(p.headingColor,.28)};background:transparent!important;border-radius:0!important}${C} .hero.aura-story-cover .aura-enter{color:${p.headingColor}!important;border-color:${rgba(p.headingColor,.35)}!important;background:transparent!important}
${C} .aura-screen{background:${rgba(p.bgBodyColor,alpha)}!important}${C} .aura-screen-shell{display:grid;grid-template-columns:1fr 1fr;gap:0;align-items:stretch;width:min(100%,760px)}${C} .aura-stage-photo{height:100%!important;min-height:620px!important;border-radius:0!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{margin:0!important;border-radius:0!important;border:1px solid ${soft}!important;background:${rgba(p.bgContentColor,strong)}!important;display:flex;flex-direction:column;justify-content:center;padding:42px 28px!important}
${C} .aura-gallery-heading{grid-column:1/-1}${C} .aura-screen-gallery .aura-screen-shell{display:block}${C} .aura-gallery-grid{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:310px;gap:0}${C} .aura-gallery-tile{border-radius:0!important;grid-column:auto!important;grid-row:auto!important}${C} .aura-screen-close .aura-screen-shell{display:block}${C} .aura-close-photo{border-radius:0!important}
@media(max-width:560px){${C} .hero.aura-story-cover::before{display:none}${C} .hero.aura-story-cover .hero-inner{width:84%;margin:0 auto;color:${p.heroTextColor};text-align:center}${C} .hero.aura-story-cover .hero-kicker,${C} .hero.aura-story-cover .aura-cover-date,${C} .hero.aura-story-cover p{color:${p.heroTextColor}}${C} .hero.aura-story-cover .aura-cover-accent{left:50%;color:${p.heroTextColor}}${C} .hero.aura-story-cover .aura-quick-action,${C} .hero.aura-story-cover .aura-enter{color:${p.heroTextColor}!important;border-color:${rgba(p.heroTextColor,.45)}!important}${C} .aura-screen-shell{grid-template-columns:1fr}${C} .aura-stage-photo{min-height:380px!important}}`;
  case 'wedding_immersive': return `
${C} .hero.aura-story-cover .hero-overlay{background:linear-gradient(to top,${rgba(dark,.92)} 0%,${rgba(dark,.36)} 46%,${rgba(dark,.08)} 75%),linear-gradient(135deg,${rgba(p.primaryColor,.18)},transparent 48%),${rgba(p.overlayColor,bounded(p.overlayOpacity,.32,0,.8))}}${C} .hero.aura-story-cover .hero-inner{width:min(86%,620px);padding-bottom:8vh}${C} .hero h1{font-size:clamp(62px,15vw,96px)!important;font-weight:400!important}${C} .aura-quick-action{background:${rgba(dark,.26)}!important;backdrop-filter:blur(18px);border-color:${rgba(light,.25)}!important}
${C} .aura-screen{min-height:100svh;background:${rgba(dark,alpha)}!important;color:${light};padding:0!important}${C} .aura-screen::before,${C} .aura-screen::after{display:none}${C} .aura-screen-shell{width:100%;max-width:none;min-height:100svh;position:relative;display:flex;align-items:flex-end}${C} .aura-stage-photo{position:absolute;inset:0;width:100%!important;height:100%!important;max-height:none!important;border-radius:0!important;filter:saturate(.72) contrast(1.07)}${C} .aura-stage-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,${rgba(dark,.96)},${rgba(dark,.24)} 64%,${rgba(dark,.08)})}
${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{position:relative;z-index:3;width:min(calc(100% - 30px),620px);margin:0 auto 28px!important;border-radius:18px!important;background:${rgba(dark,.72)}!important;backdrop-filter:blur(18px);border:1px solid ${rgba(light,.14)}!important;color:${light};box-shadow:0 25px 80px ${rgba(dark,.35)}!important}${C} .aura-date-panel h2,${C} .aura-family-panel h2,${C} .aura-location-panel h2,${C} .aura-family-name strong,${C} .aura-location-copy strong{color:${light}!important}${C} .aura-screen .section-label,${C} .aura-date-note,${C} .aura-location-note{color:${rgba(light,.66)}!important}
${C} .aura-screen-gallery .aura-screen-shell{display:block;padding:10vh 15px;background:linear-gradient(180deg,${rgba(dark,alpha)},${rgba(darkAccent,alpha)})}${C} .aura-gallery-heading h2{color:${light}!important}${C} .aura-gallery-grid{display:flex;gap:12px;overflow:auto}${C} .aura-gallery-tile{flex:0 0 86%;height:72svh;border-radius:18px!important}${C} .aura-screen-close .aura-screen-shell{display:flex}${C} .aura-close-photo{border-radius:0!important}${C} .aura-close-panel{background:linear-gradient(to top,${rgba(dark,.96)},${rgba(dark,.06)});color:${light}}${C} .aura-close-panel .final-message{color:${light}!important}${C} .aura-confirm{background:${p.primaryColor}!important;border-radius:999px!important}`;
  default:return'';
 }
}

function weddingEditorOverrides55(p){
 const C=`.theme-${p.themeVisual}`;
 const bits=[];
 if(['left','center','right'].includes(p.heroAlignment))bits.push(`${C} .hero.aura-story-cover .hero-inner{text-align:${p.heroAlignment}!important}${C} .hero.aura-story-cover .aura-editorial-copy p{margin-left:${p.heroAlignment==='left'?'0':'auto'}!important;margin-right:${p.heroAlignment==='right'?'0':'auto'}!important}`);
 if(['start','center','end'].includes(p.heroPosition))bits.push(`${C} .hero.aura-story-cover{align-items:${p.heroPosition}!important}`);
 if(['start','center','end'].includes(p.heroBlockPosition)){
  const m=p.heroBlockPosition==='start'?'margin-left:3%!important;margin-right:auto!important':p.heroBlockPosition==='end'?'margin-left:auto!important;margin-right:3%!important':'margin-left:auto!important;margin-right:auto!important';
  bits.push(`${C} .hero.aura-story-cover .hero-inner{justify-self:${p.heroBlockPosition}!important;${m}}`);
 }
 bits.push(`${C} .hero.aura-story-cover .hero-inner{width:min(${bounded(p.heroWidth,86,55,94)}%,720px)!important;color:${p.heroTextColor}!important}${C} .hero.aura-story-cover .hero-kicker,${C} .hero.aura-story-cover h1,${C} .hero.aura-story-cover p,${C} .hero.aura-story-cover .aura-cover-date,${C} .hero.aura-story-cover .aura-cover-accent{color:${p.heroTextColor}!important}${C} .hero.aura-story-cover .hero-overlay{background-color:${rgba(p.overlayColor,bounded(p.overlayOpacity,.1,0,.8))}!important}`);
 let q='';
 if(p.buttonStyle==='pill')q=`border-radius:999px!important;background:${rgba(p.primaryColor,bounded(p.buttonOpacity,.18,0,1))}!important;border-color:${rgba(p.primaryColor,.82)}!important`;
 else if(p.buttonStyle==='rounded')q=`border-radius:12px!important;background:${rgba(p.primaryColor,bounded(p.buttonOpacity,.18,0,1))}!important;border-color:${rgba(p.primaryColor,.72)}!important`;
 else if(p.buttonStyle==='outline_thin')q=`border-radius:2px!important;background:transparent!important;border-color:${rgba(p.heroTextColor,.62)}!important`;
 else if(p.buttonStyle==='glass_soft')q=`border-radius:999px!important;background:${rgba(p.bgContentColor,bounded(p.buttonOpacity,.18,0,1))}!important;border-color:${rgba(p.heroTextColor,.36)}!important;backdrop-filter:blur(14px)!important`;
 else if(p.buttonStyle==='text_only')q=`border-radius:0!important;background:transparent!important;border:0!important;border-bottom:1px solid ${rgba(p.heroTextColor,.65)}!important`;
 if(q)bits.push(`${C} .hero.aura-story-cover .aura-quick-action,${C} .hero.aura-story-cover .aura-enter{${q};color:${p.heroTextColor}!important}`);
 return bits.join('\n');
}
const _invitationCss55=invitationCss;
invitationCss=function(p,t,a){const base=_invitationCss55(p,t,a);return isWedding55(p.themeVisual)?base+weddingThemeCss55(p)+weddingEditorOverrides55(p):base};

const _configObject55=configObject;
configObject=function(p){const c=_configObject55(p);c.schemaVersion=5.53;c.studioVersion='5.5.3';c.weddingCollection='10-estilos-integracion-corregida';return c};

/* =========================
   Aura Digital 5.5.4 · Estabilidad integral
   - Paletas visibles completas en el Studio
   - Encuadre X/Y y modo por fotografía
   - El mismo encuadre acompaña a una foto en galería y pantallas editoriales
   - Espaciado editorial adaptativo (sin forzar 100vh salvo Inmersiva)
   ========================= */
function photoFrames554(p){
  try{
    const raw=typeof p.galleryFrames==='string'?JSON.parse(p.galleryFrames):p.galleryFrames;
    if(Array.isArray(raw))return raw.map(x=>({
      x:bounded(x?.x,50,0,100),
      y:bounded(x?.y,50,0,100),
      fit:x?.fit==='contain'?'contain':'cover'
    }));
  }catch(e){}
  const ys=galleryOffsets(p);
  return ys.map(y=>({x:50,y:bounded(y,50,0,100),fit:'cover'}));
}
function photoFrame554(p,i){
  const f=photoFrames554(p)[i]||{};
  return {x:bounded(f.x,50,0,100),y:bounded(f.y,Number.isFinite(+f.y)?+f.y:bounded(p.galleryFocusY,50,0,100),0,100),fit:f.fit==='contain'?'contain':'cover'};
}
function syncLegacyOffsets554(frames){
  const el=$('galleryOffsets');if(el)el.value=JSON.stringify(frames.map(f=>Math.round(bounded(f.y,50,0,100)*10)/10));
}
function readFramesEditor554(){
  try{const v=JSON.parse($('galleryFrames')?.value||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}
}
function writeFramesEditor554(frames,{preview=true}={}){
  const clean=frames.map(f=>({x:Math.round(bounded(f?.x,50,0,100)*10)/10,y:Math.round(bounded(f?.y,50,0,100)*10)/10,fit:f?.fit==='contain'?'contain':'cover'}));
  if($('galleryFrames'))$('galleryFrames').value=JSON.stringify(clean);
  syncLegacyOffsets554(clean);
  if(preview)queuePreview();
}
function ensureFramesEditor554(){
  const n=$('galleryFiles')?.files?.length||0,old=readFramesEditor554(),legacy=(()=>{try{return JSON.parse($('galleryOffsets')?.value||'[]')}catch(e){return[]}})();
  const out=[];
  for(let i=0;i<n;i++){
    const f=old[i]||{};
    out.push({x:bounded(f.x,50,0,100),y:bounded(f.y,Number.isFinite(+legacy[i])?+legacy[i]:bounded($('galleryFocusY')?.value,50,0,100),0,100),fit:f.fit==='contain'?'contain':'cover'});
  }
  writeFramesEditor554(out,{preview:false});return out;
}
function renderPhotoFraming554(){
  const root=$('photo-framing-list');if(!root)return;
  const files=Array.from($('galleryFiles')?.files||[]),frames=ensureFramesEditor554();root.replaceChildren();
  if(!files.length){const q=document.createElement('p');q.className='helper';q.textContent='Carga fotografías para ajustar cada encuadre por separado.';root.appendChild(q);return}
  files.forEach((file,i)=>{
    const f=frames[i]||{x:50,y:50,fit:'cover'},card=document.createElement('div');card.className='photo-frame-card';card.dataset.index=String(i);
    const thumb=document.createElement('img');thumb.className='photo-frame-thumb';thumb.src=fileUrl(file);thumb.alt='Vista previa fotografía '+(i+1);thumb.style.objectPosition=`${f.x}% ${f.y}%`;thumb.style.objectFit=f.fit;
    const body=document.createElement('div');body.className='photo-frame-body';
    body.innerHTML=`<div class="photo-frame-title"><strong>${esc(file.name||('Fotografía '+(i+1)))}</strong><button type="button" data-frame-reset>Restablecer</button></div>
      <div class="photo-frame-mode"><label>Modo</label><select data-frame-fit><option value="cover">Llenar espacio</option><option value="contain">Foto completa</option></select></div>
      <div class="photo-frame-axis"><label>Horizontal <span class="photo-frame-value" data-x-value>${Math.round(f.x)}%</span><input data-frame-x type="range" min="0" max="100" value="${f.x}"></label><label>Vertical <span class="photo-frame-value" data-y-value>${Math.round(f.y)}%</span><input data-frame-y type="range" min="0" max="100" value="${f.y}"></label></div>`;
    body.querySelector('[data-frame-fit]').value=f.fit;
    const commit=()=>{const all=ensureFramesEditor554(),x=+body.querySelector('[data-frame-x]').value,y=+body.querySelector('[data-frame-y]').value,fit=body.querySelector('[data-frame-fit]').value;all[i]={x,y,fit};thumb.style.objectPosition=`${x}% ${y}%`;thumb.style.objectFit=fit;body.querySelector('[data-x-value]').textContent=Math.round(x)+'%';body.querySelector('[data-y-value]').textContent=Math.round(y)+'%';writeFramesEditor554(all)};
    body.querySelector('[data-frame-x]').addEventListener('input',commit);body.querySelector('[data-frame-y]').addEventListener('input',commit);body.querySelector('[data-frame-fit]').addEventListener('change',commit);
    body.querySelector('[data-frame-reset]').addEventListener('click',()=>{body.querySelector('[data-frame-x]').value=50;body.querySelector('[data-frame-y]').value=50;body.querySelector('[data-frame-fit]').value='cover';commit()});
    card.append(thumb,body);root.appendChild(card);
  });
}
const _getFormParams554=getFormParams;
getFormParams=function(){const p=_getFormParams554();p.galleryFrames=$('galleryFrames')?.value||'[]';return p};

// Aplica el encuadre individual también a galerías clásicas.
galleryFigure52=function(p,src,i,offsets){
  const f=photoFrame554(p,i),caption=p.galleryStyle==='narrative'?`<figcaption>Capítulo ${String(i+1).padStart(2,'0')}</figcaption>`:'';
  return `<figure><img class="gallery-image" role="button" tabindex="0" aria-label="Ampliar fotografía ${i+1}" data-index="${i}" data-focus-x="${f.x}" data-focus-y="${f.y}" data-fit="${f.fit}" style="object-position:${f.x}% ${f.y}%;object-fit:${f.fit}!important" src="${src}" alt="Fotografía ${i+1}" loading="lazy">${caption}</figure>`;
};
auraGalleryFigure54=function(p,src,i,offsets){
  const f=photoFrame554(p,i),caption=p.galleryStyle==='narrative'?`<figcaption>Capítulo ${String(i+1).padStart(2,'0')}</figcaption>`:'';
  return `<figure class="aura-gallery-tile aura-gallery-tile-${(i%6)+1}"><img class="gallery-image" role="button" tabindex="0" aria-label="Ampliar fotografía ${i+1}" data-index="${i}" data-focus-x="${f.x}" data-focus-y="${f.y}" data-fit="${f.fit}" style="object-position:${f.x}% ${f.y}%;object-fit:${f.fit}!important" src="${src}" alt="Fotografía ${i+1}" loading="lazy">${caption}</figure>`;
};
auraStagePhoto54=function(src,extraClass='',p={},index=-1){
  const f=index>=0?photoFrame554(p,index):{x:50,y:50,fit:'cover'};
  return src?`<div class="aura-stage-photo ${extraClass}" data-photo-index="${index}" data-focus-x="${f.x}" data-focus-y="${f.y}" data-fit="${f.fit}" style="background-image:url('${src}');background-position:${f.x}% ${f.y}%;background-size:${f.fit};background-repeat:no-repeat" aria-hidden="true"></div>`:`<div class="aura-stage-photo aura-stage-photo-empty ${extraClass}" aria-hidden="true"></div>`;
};

// Arrastre bidimensional y sincronizado: al mover una aparición, se actualizan todas las instancias de esa fotografía.
bindGalleryDrag=function(doc){
  if(!doc)return;const enabled=$('galleryEditMode')?.checked;
  const targets=Array.from(doc.querySelectorAll('.gallery-image[data-index],.aura-stage-photo[data-photo-index]')).filter(el=>+(el.dataset.index??el.dataset.photoIndex)>=0);
  targets.forEach(el=>{
    el.style.touchAction=enabled?'none':'';el.style.cursor=enabled?'grab':(el.matches('.gallery-image')?'zoom-in':'');
    if(!enabled)return;
    el.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0)return;const idx=+(el.dataset.index??el.dataset.photoIndex),id=e.pointerId,startX=e.clientX,startY=e.clientY,frames=ensureFramesEditor554(),base=frames[idx]||{x:50,y:50,fit:'cover'};let moved=false;
      e.preventDefault();el.setPointerCapture?.(id);
      const paint=(x,y)=>{doc.querySelectorAll(`[data-index="${idx}"],[data-photo-index="${idx}"]`).forEach(node=>{node.dataset.focusX=String(x);node.dataset.focusY=String(y);if(node.matches('.gallery-image'))node.style.objectPosition=`${x}% ${y}%`;else node.style.backgroundPosition=`${x}% ${y}%`})};
      const move=ev=>{if(ev.pointerId!==id)return;const dx=ev.clientX-startX,dy=ev.clientY-startY;if(!moved&&Math.hypot(dx,dy)<5)return;moved=true;const x=bounded(base.x+dx/Math.max(120,el.clientWidth)*100,50,0,100),y=bounded(base.y+dy/Math.max(120,el.clientHeight)*100,50,0,100);paint(x,y)};
      const finish=ev=>{if(ev.pointerId!==id)return;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',finish);el.removeEventListener('pointercancel',cancel);el.removeEventListener('lostpointercapture',cancel);if(el.hasPointerCapture?.(id))el.releasePointerCapture(id);if(moved){const x=bounded(el.dataset.focusX,base.x,0,100),y=bounded(el.dataset.focusY,base.y,0,100),all=ensureFramesEditor554();all[idx]={x,y,fit:base.fit};writeFramesEditor554(all);renderPhotoFraming554()}};
      const cancel=ev=>{paint(base.x,base.y);moved=false;finish(ev)};
      el.addEventListener('pointermove',move);el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',cancel);el.addEventListener('lostpointercapture',cancel);
    });
  });
};

function weddingSpacingFix554(p){
  if(!isWedding55(p.themeVisual)||p.themeVisual==='wedding_immersive')return'';const C=`.theme-${p.themeVisual}`;
  return `
${C} .aura-screen{min-height:auto!important;padding-top:clamp(38px,7vw,68px)!important;padding-bottom:clamp(38px,7vw,68px)!important}
${C} .aura-screen-gallery{padding-top:clamp(48px,8vw,78px)!important;padding-bottom:clamp(48px,8vw,78px)!important}
${C} .aura-screen-confirm,${C} .aura-screen-video{padding-top:clamp(46px,9vw,82px)!important;padding-bottom:clamp(46px,9vw,82px)!important}
${C} .aura-family-portrait{margin-bottom:-64px!important}
${C} .aura-family-panel{padding-top:92px!important}
${C} .aura-close-shell{min-height:clamp(560px,78svh,760px)!important}
@media(max-width:430px){${C} .aura-screen{padding-top:36px!important;padding-bottom:36px!important}${C} .aura-family-portrait{margin-bottom:-52px!important}${C} .aura-family-panel{padding-top:76px!important}}
`;
}
const _invitationCss554=invitationCss;
invitationCss=function(p,t,a){return _invitationCss554(p,t,a)+weddingSpacingFix554(p)};

const _applyConfig554=applyConfig;
applyConfig=function(cfg){
  const copy={...(cfg||{})};
  if(Array.isArray(copy.galleryFrames))copy.galleryFrames=JSON.stringify(copy.galleryFrames);
  _applyConfig554(copy);renderPhotoFraming554();
};
const _configObject554=configObject;
configObject=function(p){const c=_configObject554(p);c.schemaVersion=5.54;c.studioVersion='5.5.4';c.weddingCollection='10-estilos-estable';if(typeof c.galleryFrames==='string'){try{c.galleryFrames=JSON.parse(c.galleryFrames)}catch(e){c.galleryFrames=[]}}return c};

document.addEventListener('DOMContentLoaded',()=>{
  const files=$('galleryFiles');if(files){files.addEventListener('change',()=>{if($('galleryFrames'))$('galleryFrames').value='[]';renderPhotoFraming554();queuePreview()})}
  $('galleryFocusY')?.addEventListener('input',()=>{if(!(files?.files?.length))return;const frames=ensureFramesEditor554();frames.forEach(f=>f.y=bounded($('galleryFocusY').value,50,0,100));writeFramesEditor554(frames);renderPhotoFraming554()});
  renderPhotoFraming554();
});

const _renderPaletteStrip554=renderPaletteStrip;
renderPaletteStrip=function(){
  _renderPaletteStrip554();
  const n=$('palette-strip')?.children?.length||0,el=document.querySelector('.palette-browser-head small');
  if(el)el.textContent=`${n} combinaciones`;
};


/* =========================
   Aura Digital 5.5.5 · Diseños realmente diferenciados + galería soberana
   El tema define la composición de la invitación.
   galleryStyle define el acomodo de fotografías y SIEMPRE gana sobre el tema.
   ========================= */
function auraGalleryStyleCss555(p){
  if(!isAuraEditorial53(p.themeVisual))return'';
  const C=`.theme-${p.themeVisual}`;
  const base=`
${C} .aura-screen-gallery .aura-gallery-grid{display:grid!important;grid-template-columns:1fr 1fr!important;grid-auto-rows:auto!important;gap:12px!important;overflow:visible!important;overflow-x:visible!important;padding:0!important;margin:0!important;columns:auto!important;column-gap:normal!important;scroll-snap-type:none!important}
${C} .aura-screen-gallery .aura-gallery-tile{display:block!important;position:relative!important;width:auto!important;height:auto!important;min-height:0!important;max-height:none!important;flex:none!important;grid-column:auto!important;grid-row:auto!important;margin:0!important;align-self:auto!important;justify-self:stretch!important;transform:none!important;break-inside:auto!important;padding:0!important;overflow:hidden}
${C} .aura-screen-gallery .aura-gallery-tile img{display:block!important;width:100%!important;height:100%!important;max-height:none!important}
${C} .aura-screen-gallery .aura-gallery-tile figcaption{display:none}
`;
  switch(p.galleryStyle){
    case 'square': return base+`
${C} .aura-screen-gallery .aura-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
${C} .aura-screen-gallery .aura-gallery-tile{aspect-ratio:1/1!important}`;
    case 'rectangular': return base+`
${C} .aura-screen-gallery .aura-gallery-grid{grid-template-columns:1fr!important;gap:16px!important}
${C} .aura-screen-gallery .aura-gallery-tile{aspect-ratio:4/3!important}`;
    case 'masonry': return base+`
${C} .aura-screen-gallery .aura-gallery-grid{display:block!important;columns:2!important;column-gap:10px!important}
${C} .aura-screen-gallery .aura-gallery-tile{display:inline-block!important;width:100%!important;margin:0 0 10px!important;break-inside:avoid!important;aspect-ratio:auto!important}
${C} .aura-screen-gallery .aura-gallery-tile img{height:auto!important;aspect-ratio:auto!important}`;
    case 'collage': return base+`
${C} .aura-screen-gallery .aura-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:145px!important;gap:9px!important}
${C} .aura-screen-gallery .aura-gallery-tile{aspect-ratio:auto!important;height:100%!important}
${C} .aura-screen-gallery .aura-gallery-tile:nth-child(1){grid-column:1/-1!important;grid-row:span 2!important}
${C} .aura-screen-gallery .aura-gallery-tile:nth-child(4n+2){grid-row:span 2!important}
${C} .aura-screen-gallery .aura-gallery-tile:nth-child(5n){grid-column:1/-1!important}`;
    case 'carousel': return base+`
${C} .aura-screen-gallery .aura-gallery-grid{display:flex!important;gap:12px!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important;scrollbar-width:thin!important;padding-bottom:14px!important}
${C} .aura-screen-gallery .aura-gallery-tile{flex:0 0 88%!important;aspect-ratio:4/5!important;scroll-snap-align:center!important}`;
    case 'filmstrip': return base+`
${C} .aura-screen-gallery .aura-gallery-grid{display:flex!important;gap:10px!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important;scrollbar-width:thin!important;padding-bottom:14px!important}
${C} .aura-screen-gallery .aura-gallery-tile{flex:0 0 72%!important;aspect-ratio:3/4!important;scroll-snap-align:start!important}`;
    case 'story': return base+`
${C} .aura-screen-gallery .aura-gallery-grid{grid-template-columns:1fr!important;gap:24px!important}
${C} .aura-screen-gallery .aura-gallery-tile{aspect-ratio:auto!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-tile img{height:auto!important;object-fit:contain!important}`;
    case 'narrative': return base+`
${C} .aura-screen-gallery .aura-gallery-grid{display:flex!important;flex-direction:column!important;gap:30px!important}
${C} .aura-screen-gallery .aura-gallery-tile{width:88%!important;align-self:flex-start!important;aspect-ratio:auto!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-tile:nth-child(even){align-self:flex-end!important}
${C} .aura-screen-gallery .aura-gallery-tile:nth-child(3n+1){width:100%!important}
${C} .aura-screen-gallery .aura-gallery-tile img{height:auto!important;object-fit:contain!important}
${C} .aura-screen-gallery .aura-gallery-tile figcaption{display:flex!important;align-items:center;gap:10px;margin-top:8px;color:var(--muted);font:500 8px/1.4 var(--body);letter-spacing:.18em;text-transform:uppercase}
${C} .aura-screen-gallery .aura-gallery-tile figcaption::before{content:'';width:26px;height:1px;background:var(--accent);opacity:.65}`;
    case 'polaroid_pro': return base+`
${C} .aura-screen-gallery .aura-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px!important;padding:8px!important}
${C} .aura-screen-gallery .aura-gallery-tile{aspect-ratio:auto!important;padding:8px 8px 30px!important;background:${rgba(p.bgContentColor,bounded(p.contentBgOpacity,.82,0,1))}!important;border:1px solid ${rgba(p.headingColor,.12)}!important;box-shadow:0 14px 34px ${rgba(p.headingColor,.10)}!important;border-radius:2px!important}
${C} .aura-screen-gallery .aura-gallery-tile:nth-child(odd){transform:rotate(-1.4deg)!important}${C} .aura-screen-gallery .aura-gallery-tile:nth-child(even){transform:rotate(1.4deg)!important}
${C} .aura-screen-gallery .aura-gallery-tile img{aspect-ratio:3/4!important;height:auto!important}`;
    case 'editorial':
    default:return base+`
${C} .aura-screen-gallery .aura-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
${C} .aura-screen-gallery .aura-gallery-tile{aspect-ratio:3/4!important}
${C} .aura-screen-gallery .aura-gallery-tile:nth-child(3n+1){grid-column:1/-1!important;aspect-ratio:4/5!important}
${C} .aura-screen-gallery .aura-gallery-tile:last-child:nth-child(3n+2){grid-column:1/-1!important;aspect-ratio:4/3!important}`;
  }
}

function weddingDistinctCss555(p){
  if(!isWedding55(p.themeVisual))return'';
  const C=`.theme-${p.themeVisual}`,alpha=bounded(p.contentBgOpacity,.82,0,1),card=rgba(p.bgContentColor,alpha),line=rgba(p.primaryColor,.24),dark=paletteDark55(p),light=paletteLight55(p);
  switch(p.themeVisual){
    case 'wedding_minimal': return `
${C} .aura-screen-shell{width:min(100%,590px)!important}${C} .aura-stage-photo{width:100%!important;margin:0!important;border-radius:0!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{width:100%!important;margin:0!important;padding:36px 8px!important;background:transparent!important;border:0!important;border-top:1px solid ${line}!important;border-bottom:1px solid ${line}!important;box-shadow:none!important;border-radius:0!important}${C} .aura-family-portrait{width:100%!important;margin:0!important;padding:0!important}${C} .aura-family-panel{padding-top:42px!important}${C} .aura-close-shell{min-height:620px!important}`;
    case 'wedding_floral': return `
${C} .aura-screen-shell{width:min(100%,630px)!important}${C} .aura-stage-photo{border-radius:220px 220px 28px 28px!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{background:${card}!important;border-radius:34px!important;box-shadow:0 24px 60px ${rgba(p.headingColor,.08)}!important}${C} .aura-date-panel::after,${C} .aura-family-panel::after,${C} .aura-location-panel::after{content:'❦';display:block;margin:24px auto 0;color:var(--accent);opacity:.6;font-size:20px}${C} .aura-close-photo{border-radius:220px 220px 30px 30px!important}`;
    case 'wedding_monogram': return `
${C} .aura-date-photo,${C} .aura-family-photo,${C} .aura-location-photo{width:230px!important;height:230px!important;min-height:230px!important;margin:0 auto 30px!important;border-radius:50%!important;box-shadow:0 0 0 8px ${rgba(p.bgContentColor,.72)},0 0 0 9px ${line}!important}${C} .aura-family-portrait{width:100%!important;margin:0!important;padding:0!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{margin:0!important;padding:42px 28px!important;border-radius:0!important;outline:1px solid ${line}!important;outline-offset:7px!important;background:${card}!important}${C} .aura-family-panel{padding-top:42px!important}${C} .aura-screen h2{text-transform:uppercase;letter-spacing:.02em!important}`;
    case 'wedding_luxury': return `
${C} .aura-screen:not(.aura-screen-gallery):not(.aura-screen-video):not(.aura-screen-confirm) .aura-screen-shell{min-height:76svh!important;display:flex!important;align-items:flex-end!important;width:100%!important;max-width:720px!important}${C} .aura-screen:not(.aura-screen-gallery):not(.aura-screen-video):not(.aura-screen-confirm) .aura-stage-photo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:none!important;border-radius:0!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{position:relative!important;z-index:2!important;width:calc(100% - 28px)!important;margin:0 auto 20px!important;padding:34px 24px!important;background:linear-gradient(180deg,${rgba(dark,.34)},${rgba(dark,.82)})!important;color:${light}!important;backdrop-filter:blur(12px)!important;border:1px solid ${rgba(p.primaryColor,.34)}!important}${C} .aura-family-portrait{position:absolute!important;inset:0!important;width:100%!important;margin:0!important;padding:0!important}${C} .aura-family-photo{width:100%!important;height:100%!important;max-height:none!important;border-radius:0!important}${C} .aura-family-panel{padding-top:34px!important}`;
    case 'wedding_mediterranean': return `
${C} .aura-stage-photo{border-radius:46% 46% 18px 18px / 24% 24% 18px 18px!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{margin-top:-34px!important;width:94%!important;border-radius:26px!important;background:${card}!important;box-shadow:0 24px 58px ${rgba(p.headingColor,.09)}!important}${C} .aura-family-portrait{margin-bottom:-28px!important}${C} .aura-family-panel{padding-top:72px!important}`;
    case 'wedding_layers': return `
${C} .aura-stage-photo{width:82%!important;margin-left:2%!important;transform:rotate(-2.1deg)!important;border-radius:7px!important;box-shadow:0 25px 60px ${rgba(p.headingColor,.15)}!important}${C} .aura-date-panel,${C} .aura-location-panel{width:84%!important;margin:-72px 1% 0 auto!important;transform:rotate(.8deg)!important;border-radius:8px!important;background:${card}!important;box-shadow:0 28px 65px ${rgba(p.headingColor,.13)}!important}${C} .aura-family-portrait{width:86%!important;margin:0 auto -72px 1%!important;padding:0!important;transform:rotate(1.6deg)!important}${C} .aura-family-panel{width:86%!important;margin:0 1% 0 auto!important;transform:rotate(-.6deg)!important;padding-top:100px!important;background:${card}!important}`;
    case 'wedding_timeline': return `
${C} .aura-screen-shell{padding-left:52px!important}${C} .aura-screen::before{display:block!important;left:30px!important;top:0!important;bottom:0!important;width:1px!important;height:auto!important;border:0!important;background:${line}!important;border-radius:0!important}${C} .aura-screen-shell::before{content:'';position:absolute;left:-26px;top:18px;width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 8px ${rgba(p.primaryColor,.11)}}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{text-align:left!important;background:transparent!important;border:0!important;border-left:1px solid ${line}!important;border-radius:0!important;box-shadow:none!important}${C} .aura-family-panel{padding-top:92px!important}`;
    case 'wedding_curves': return `
${C} .aura-stage-photo{border-radius:48% 48% 14% 14% / 22% 22% 12% 12%!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{border-radius:64px 20px 64px 20px!important;background:${card}!important}${C} .aura-screen:nth-of-type(even) .aura-date-panel,${C} .aura-screen:nth-of-type(even) .aura-family-panel,${C} .aura-screen:nth-of-type(even) .aura-location-panel{border-radius:20px 64px 20px 64px!important}${C} .aura-close-photo{border-radius:80px 22px 80px 22px!important}`;
    case 'wedding_double_panel': return `
${C} .aura-screen-date .aura-screen-shell,${C} .aura-screen-location .aura-screen-shell{display:grid!important;grid-template-columns:minmax(120px,.78fr) minmax(0,1.22fr)!important;align-items:stretch!important;width:min(100%,740px)!important}${C} .aura-screen-date .aura-stage-photo,${C} .aura-screen-location .aura-stage-photo{height:100%!important;min-height:520px!important;border-radius:0!important}${C} .aura-screen-date .aura-date-panel,${C} .aura-screen-location .aura-location-panel{margin:0!important;width:100%!important;padding:32px 20px!important;border-radius:0!important;background:${card}!important;display:flex!important;flex-direction:column!important;justify-content:center!important}${C} .aura-screen-family .aura-family-portrait{width:42%!important;margin:0 auto -70px!important}${C} .aura-screen-family .aura-family-photo{border-radius:50%!important;aspect-ratio:1/1!important;height:auto!important;min-height:0!important}${C} .aura-screen-family .aura-family-panel{padding-top:102px!important}@media(max-width:420px){${C} .aura-screen-date .aura-screen-shell,${C} .aura-screen-location .aura-screen-shell{grid-template-columns:38% 62%!important}${C} .aura-screen-date .aura-stage-photo,${C} .aura-screen-location .aura-stage-photo{min-height:500px!important}${C} .aura-screen-date .aura-date-panel,${C} .aura-screen-location .aura-location-panel{padding:24px 14px!important}${C} .aura-screen-date h2,${C} .aura-screen-location h2{font-size:clamp(28px,8vw,40px)!important}}`;
    case 'wedding_immersive': return `
${C} .aura-screen:not(.aura-screen-gallery):not(.aura-screen-video):not(.aura-screen-confirm){min-height:100svh!important;padding:0!important}${C} .aura-screen:not(.aura-screen-gallery):not(.aura-screen-video):not(.aura-screen-confirm) .aura-screen-shell{width:100%!important;max-width:none!important;min-height:100svh!important;display:flex!important;align-items:flex-end!important}${C} .aura-screen:not(.aura-screen-gallery):not(.aura-screen-video):not(.aura-screen-confirm) .aura-stage-photo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:none!important;border-radius:0!important}${C} .aura-date-panel,${C} .aura-family-panel,${C} .aura-location-panel{position:relative!important;z-index:2!important;width:min(calc(100% - 28px),600px)!important;margin:0 auto 24px!important;padding:32px 22px!important;background:${rgba(dark,.72)}!important;color:${light}!important;backdrop-filter:blur(16px)!important;border-radius:20px!important}${C} .aura-family-portrait{position:absolute!important;inset:0!important;width:100%!important;margin:0!important;padding:0!important}${C} .aura-family-photo{width:100%!important;height:100%!important;max-height:none!important;border-radius:0!important}${C} .aura-family-panel{padding-top:32px!important}`;
    default:return'';
  }
}

const _invitationCss555=invitationCss;
invitationCss=function(p,t,a){return _invitationCss555(p,t,a)+weddingDistinctCss555(p)+auraGalleryStyleCss555(p)};

const _configObject555=configObject;
configObject=function(p){const c=_configObject555(p);c.schemaVersion=5.55;c.studioVersion='5.5.5';c.weddingCollection='10-estilos-diferenciados';return c};

function weddingCoverDistinctCss555(p){
 if(!isWedding55(p.themeVisual))return'';
 const C=`.theme-${p.themeVisual}`,card=rgba(p.bgContentColor,bounded(p.contentBgOpacity,.82,0,1)),dark=paletteDark55(p),light=paletteLight55(p),line=rgba(p.primaryColor,.28),ink=p.headingColor;
 switch(p.themeVisual){
  case 'wedding_minimal': return `
${C} .hero.aura-story-cover{background:${p.bgBodyColor}!important;align-items:end!important;padding:0 14px 22px!important}
${C} .hero.aura-story-cover .hero-media{inset:0 0 31% 0!important;transform:none!important}
${C} .hero.aura-story-cover .hero-overlay{inset:0 0 31% 0!important;background:linear-gradient(to top,${rgba(dark,.52)},transparent 58%)!important}
${C} .hero.aura-story-cover .hero-inner{width:min(100%,590px)!important;margin:0 auto!important;padding:28px 22px 18px!important;background:${card}!important;border:1px solid ${line}!important;color:${ink}!important;transform:none!important;text-align:center!important;box-shadow:0 22px 60px ${rgba(p.headingColor,.10)}}
${C} .hero.aura-story-cover .hero-kicker,${C} .hero.aura-story-cover h1,${C} .hero.aura-story-cover p,${C} .hero.aura-story-cover .aura-cover-date,${C} .hero.aura-story-cover .aura-cover-accent{color:${ink}!important}
${C} .hero.aura-story-cover .aura-cover-accent{top:18px!important}${C} .hero.aura-story-cover .aura-quick-action,${C} .hero.aura-story-cover .aura-enter{color:${ink}!important;border-color:${rgba(p.headingColor,.28)}!important;background:transparent!important}`;
  case 'wedding_floral': return `
${C} .hero.aura-story-cover{align-items:center!important}${C} .hero.aura-story-cover .hero-media{inset:0!important;transform:scale(1.02)!important}${C} .hero.aura-story-cover .hero-inner{width:min(76%,500px)!important;margin-left:8%!important;margin-right:auto!important;text-align:left!important;padding:26px 0 26px 8px!important}${C} .hero.aura-story-cover .hero-inner::before{content:'';position:absolute;inset:-28px -38px -28px -20px;border-radius:220px 30px 220px 30px;background:linear-gradient(90deg,${rgba(p.bgContentColor,.18)},transparent);border-left:1px solid ${rgba(p.primaryColor,.42)};pointer-events:none}${C} .hero.aura-story-cover .aura-quick-actions{grid-template-columns:1fr 1fr!important}`;
  case 'wedding_monogram': return `
${C} .hero.aura-story-cover{background:${p.bgBodyColor}!important;align-items:end!important;padding:28px 20px!important}
${C} .hero.aura-story-cover .hero-media{inset:9% 21% 49% 21%!important;border-radius:50%!important;transform:none!important;box-shadow:0 0 0 8px ${rgba(p.bgContentColor,.9)},0 0 0 9px ${line}!important}
${C} .hero.aura-story-cover .hero-overlay{display:none!important}
${C} .hero.aura-story-cover::before{content:''!important;display:block!important;position:absolute!important;inset:18px!important;background:transparent!important;border:1px solid ${line}!important;pointer-events:none!important}
${C} .hero.aura-story-cover::after{content:'✦'!important;top:34px!important;bottom:auto!important;left:50%!important;right:auto!important;width:auto!important;height:auto!important;background:none!important;color:var(--accent)!important;transform:translateX(-50%)!important}
${C} .hero.aura-story-cover .hero-inner{width:min(88%,530px)!important;margin:0 auto!important;padding:0 12px 12px!important;background:transparent!important;border:0!important;color:${ink}!important;text-align:center!important;transform:none!important}
${C} .hero.aura-story-cover .hero-kicker,${C} .hero.aura-story-cover h1,${C} .hero.aura-story-cover p,${C} .hero.aura-story-cover .aura-cover-date{color:${ink}!important}${C} .hero.aura-story-cover .aura-cover-accent{display:none!important}
${C} .hero.aura-story-cover .aura-quick-action,${C} .hero.aura-story-cover .aura-enter{color:${ink}!important;border-color:${line}!important;background:transparent!important}`;
  case 'wedding_luxury': return `
${C} .hero.aura-story-cover{align-items:center!important}${C} .hero.aura-story-cover .hero-media{inset:0!important;transform:scale(1.03)!important}${C} .hero.aura-story-cover .hero-inner{width:min(76%,500px)!important;margin-left:auto!important;margin-right:8%!important;text-align:right!important;padding:34px 0!important}${C} .hero.aura-story-cover h1{font-size:clamp(62px,15vw,94px)!important;letter-spacing:.01em!important}${C} .hero.aura-story-cover .aura-quick-actions{margin-left:auto!important;width:min(100%,390px)!important}`;
  case 'wedding_mediterranean': return `
${C} .hero.aura-story-cover{background:${p.bgBodyColor}!important;align-items:end!important;padding:0 14px 20px!important}
${C} .hero.aura-story-cover .hero-media{inset:0 0 36% 0!important;transform:none!important;border-radius:0 0 48% 48% / 0 0 12% 12%!important;overflow:hidden!important}
${C} .hero.aura-story-cover .hero-overlay{inset:0 0 36% 0!important;background:linear-gradient(to top,${rgba(dark,.54)},transparent 62%)!important}
${C} .hero.aura-story-cover .hero-inner{width:min(100%,600px)!important;margin:0 auto!important;padding:24px 18px 10px!important;color:${ink}!important;text-align:center!important;transform:none!important}
${C} .hero.aura-story-cover .hero-kicker,${C} .hero.aura-story-cover h1,${C} .hero.aura-story-cover p,${C} .hero.aura-story-cover .aura-cover-date,${C} .hero.aura-story-cover .aura-cover-accent{color:${ink}!important}${C} .hero.aura-story-cover .aura-cover-accent{top:10px!important}${C} .hero.aura-story-cover .aura-quick-action,${C} .hero.aura-story-cover .aura-enter{color:${ink}!important;border-color:${line}!important;background:${rgba(p.bgContentColor,.34)}!important}`;
  case 'wedding_layers': return `
${C} .hero.aura-story-cover{background:${p.bgBodyColor}!important;align-items:end!important;padding:0 14px 28px!important;overflow:hidden!important}
${C} .hero.aura-story-cover::before{content:''!important;display:block!important;position:absolute!important;z-index:0!important;inset:8% 13% 34% 7%!important;background:${rgba(p.primaryColor,.12)}!important;transform:rotate(-4deg)!important;border:1px solid ${line}!important}
${C} .hero.aura-story-cover .hero-media{inset:5% 7% 36% 15%!important;transform:rotate(2.2deg)!important;border-radius:6px!important;box-shadow:0 28px 70px ${rgba(p.headingColor,.20)}!important}
${C} .hero.aura-story-cover .hero-overlay{inset:5% 7% 36% 15%!important;background:linear-gradient(to top,${rgba(dark,.42)},transparent 62%)!important;transform:rotate(2.2deg)!important}
${C} .hero.aura-story-cover .hero-inner{z-index:3!important;width:min(91%,570px)!important;margin:0 auto!important;padding:25px 22px 18px!important;background:${card}!important;color:${ink}!important;border:1px solid ${line}!important;transform:rotate(-.8deg)!important;text-align:left!important;box-shadow:0 20px 54px ${rgba(p.headingColor,.10)}}
${C} .hero.aura-story-cover .hero-kicker,${C} .hero.aura-story-cover h1,${C} .hero.aura-story-cover p,${C} .hero.aura-story-cover .aura-cover-date,${C} .hero.aura-story-cover .aura-cover-accent{color:${ink}!important}${C} .hero.aura-story-cover .aura-cover-accent{display:none!important}${C} .hero.aura-story-cover .aura-quick-action,${C} .hero.aura-story-cover .aura-enter{color:${ink}!important;border-color:${line}!important;background:transparent!important}`;
  case 'wedding_timeline': return `
${C} .hero.aura-story-cover{background:${p.bgBodyColor}!important;align-items:end!important;padding:0 18px 26px 58px!important}
${C} .hero.aura-story-cover .hero-media{inset:0 0 43% 0!important;transform:none!important}
${C} .hero.aura-story-cover .hero-overlay{inset:0 0 43% 0!important;background:linear-gradient(to top,${rgba(dark,.54)},transparent 60%)!important}
${C} .hero.aura-story-cover::before{content:''!important;display:block!important;position:absolute!important;z-index:2!important;left:31px!important;top:7%!important;bottom:5%!important;width:1px!important;height:auto!important;background:${line}!important;border:0!important}
${C} .hero.aura-story-cover::after{content:''!important;position:absolute!important;z-index:3!important;left:26px!important;top:53%!important;width:11px!important;height:11px!important;border-radius:50%!important;background:var(--accent)!important;box-shadow:0 0 0 8px ${rgba(p.primaryColor,.12)}!important}
${C} .hero.aura-story-cover .hero-inner{width:100%!important;margin:0!important;padding:18px 0 0!important;color:${ink}!important;text-align:left!important;transform:none!important}
${C} .hero.aura-story-cover .hero-kicker,${C} .hero.aura-story-cover h1,${C} .hero.aura-story-cover p,${C} .hero.aura-story-cover .aura-cover-date,${C} .hero.aura-story-cover .aura-cover-accent{color:${ink}!important}${C} .hero.aura-story-cover .aura-cover-accent{display:none!important}${C} .hero.aura-story-cover .aura-quick-actions{grid-template-columns:repeat(3,1fr)!important}${C} .hero.aura-story-cover .aura-quick-action,${C} .hero.aura-story-cover .aura-enter{color:${ink}!important;border-color:${line}!important;background:transparent!important}`;
  case 'wedding_curves': return `
${C} .hero.aura-story-cover{background:${p.bgBodyColor}!important;align-items:end!important;padding:0 14px 22px!important}
${C} .hero.aura-story-cover .hero-media{inset:0 0 38% 0!important;transform:none!important;border-radius:0 0 50% 50% / 0 0 18% 18%!important}
${C} .hero.aura-story-cover .hero-overlay{inset:0 0 38% 0!important;background:linear-gradient(to top,${rgba(dark,.52)},transparent 62%)!important}
${C} .hero.aura-story-cover::after{display:none!important}${C} .hero.aura-story-cover .hero-inner{z-index:4!important;width:min(100%,590px)!important;margin:0 auto!important;padding:22px 20px 12px!important;color:${ink}!important;text-align:center!important;transform:none!important}
${C} .hero.aura-story-cover .hero-kicker,${C} .hero.aura-story-cover h1,${C} .hero.aura-story-cover p,${C} .hero.aura-story-cover .aura-cover-date,${C} .hero.aura-story-cover .aura-cover-accent{color:${ink}!important}${C} .hero.aura-story-cover .aura-cover-accent{display:none!important}${C} .hero.aura-story-cover .aura-quick-action,${C} .hero.aura-story-cover .aura-enter{color:${ink}!important;border-color:${line}!important;background:${rgba(p.bgContentColor,.30)}!important;border-radius:999px!important}`;
  case 'wedding_double_panel': return `
${C} .hero.aura-story-cover{background:${p.bgBodyColor}!important;align-items:stretch!important;padding:0!important;display:grid!important;grid-template-columns:52% 48%!important;place-items:stretch!important}
${C} .hero.aura-story-cover .hero-media{position:relative!important;inset:auto!important;grid-column:1!important;grid-row:1!important;width:100%!important;height:100%!important;transform:none!important;background-position:center!important}
${C} .hero.aura-story-cover .hero-overlay{grid-column:1!important;grid-row:1!important;position:relative!important;inset:auto!important;background:${rgba(dark,.18)}!important}
${C} .hero.aura-story-cover::before{display:none!important}${C} .hero.aura-story-cover .hero-inner{grid-column:2!important;grid-row:1!important;align-self:stretch!important;width:100%!important;max-width:none!important;margin:0!important;padding:44px 18px 28px!important;background:${card}!important;color:${ink}!important;text-align:left!important;transform:none!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
${C} .hero.aura-story-cover .hero-kicker,${C} .hero.aura-story-cover h1,${C} .hero.aura-story-cover p,${C} .hero.aura-story-cover .aura-cover-date,${C} .hero.aura-story-cover .aura-cover-accent{color:${ink}!important}${C} .hero.aura-story-cover .aura-cover-accent{display:none!important}${C} .hero.aura-story-cover h1{font-size:clamp(38px,9vw,60px)!important}${C} .hero.aura-story-cover .aura-quick-actions{grid-template-columns:1fr!important}${C} .hero.aura-story-cover .aura-quick-action,${C} .hero.aura-story-cover .aura-enter{color:${ink}!important;border-color:${line}!important;background:transparent!important;padding-inline:10px!important}`;
  case 'wedding_immersive': return `
${C} .hero.aura-story-cover{align-items:end!important;padding-bottom:4vh!important}${C} .hero.aura-story-cover .hero-media{inset:0!important;transform:scale(1.035)!important}${C} .hero.aura-story-cover .hero-inner{width:min(88%,620px)!important;margin:0 auto!important;padding:32px 20px!important;text-align:center!important;background:linear-gradient(180deg,transparent,${rgba(dark,.26)})!important}${C} .hero.aura-story-cover h1{font-size:clamp(68px,16vw,100px)!important}${C} .hero.aura-story-cover .aura-quick-actions{grid-template-columns:repeat(3,minmax(0,1fr))!important}${C} .hero.aura-story-cover .aura-quick-action{min-height:82px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}`;
  default:return'';
 }
}
const _invitationCss555b=invitationCss;
invitationCss=function(p,t,a){return _invitationCss555b(p,t,a)+weddingCoverDistinctCss555(p)};

function weddingCoverCompactActions555(p){
 if(!['wedding_floral','wedding_timeline'].includes(p.themeVisual))return'';
 const C=`.theme-${p.themeVisual}`;
 return `
${C} .hero.aura-story-cover .aura-quick-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;width:100%!important;margin-top:20px!important}
${C} .hero.aura-story-cover .aura-quick-action{min-width:0!important;min-height:74px!important;padding:10px 5px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:6px!important;text-align:center!important}
${C} .hero.aura-story-cover .aura-quick-action svg{width:20px!important;height:20px!important;flex:none!important}${C} .hero.aura-story-cover .aura-quick-action span{font-size:7px!important;line-height:1.35!important;letter-spacing:.06em!important;white-space:normal!important;overflow-wrap:normal!important;word-break:normal!important}${C} .hero.aura-story-cover .aura-quick-action b{display:none!important}`;
}
const _invitationCss555c=invitationCss;
invitationCss=function(p,t,a){return _invitationCss555c(p,t,a)+weddingCoverCompactActions555(p)};


/* =========================
   Aura Digital 5.5.6 · Integración de módulos
   - Transferencia independiente de RSVP y disponible en todos los diseños
   - Video integrado al lenguaje visual de los 10 diseños de Boda
   - Tipografía numérica estable para fecha y contador
   ========================= */
const _fontRecords556=fontRecords;
fontRecords=function(p,t){
 const base=_fontRecords556(p,t);
 if(typeof AURA_FONTS==='undefined')return base;
 const seen=new Set(base.map(r=>r.name));
 const extra=AURA_FONTS.filter(r=>r.family==='DM Sans'&&!seen.has(r.name));
 return base.concat(extra);
};

function moduleIntegrationCss556(p){
 const numeric="'DM Sans',sans-serif";
 let css=`
.date-day,.count-item b,.aura-date-lockup strong,.aura-cover-date{font-family:${numeric}!important;font-variant-numeric:lining-nums tabular-nums!important;font-feature-settings:'tnum' 1,'lnum' 1!important;letter-spacing:-.025em!important;font-style:normal!important}
.aura-date-lockup strong{font-weight:500!important;line-height:.9!important}
.aura-countdown .count-item b{font-weight:500!important}
.transfer-section .aura-transfer{margin:0 auto!important;padding:0!important;border:0!important}
.aura-transfer{width:min(100%,430px);margin:0 auto;text-align:center}
.aura-transfer>span{display:block;margin-bottom:12px;font:600 8px/1.3 var(--body);letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}
.aura-transfer button{width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;padding:17px 18px;border:1px solid color-mix(in srgb,var(--accent) 34%,transparent);background:color-mix(in srgb,var(--card) 88%,transparent);color:var(--heading);cursor:pointer}
.aura-transfer b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:600 12px/1.2 ${numeric};font-variant-numeric:tabular-nums;letter-spacing:.035em}
.aura-transfer em{font:600 8px/1 var(--body);font-style:normal;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.aura-screen-transfer{padding:clamp(42px,8vw,78px) 15px!important}
.aura-transfer-panel{width:min(100%,560px);margin:auto;padding:clamp(28px,6vw,46px);background:var(--card);border:1px solid color-mix(in srgb,var(--accent) 20%,transparent);backdrop-filter:blur(12px);text-align:center}
.aura-screen-video{padding:clamp(48px,9vw,86px) 15px!important}
.aura-video-panel{width:min(100%,680px)!important;padding:0!important;overflow:hidden;text-align:left!important;background:var(--card)!important;border:1px solid color-mix(in srgb,var(--accent) 20%,transparent)!important;box-shadow:0 24px 70px color-mix(in srgb,var(--heading) 8%,transparent)!important}
.aura-inline-video{display:grid;grid-template-columns:1fr;gap:0;margin:0!important;padding:0!important;border:0!important}
.aura-inline-video>.section-label,.aura-inline-video>h3{margin-left:clamp(22px,6vw,44px)!important;margin-right:clamp(22px,6vw,44px)!important}
.aura-inline-video>.section-label{margin-top:clamp(24px,6vw,42px)!important;margin-bottom:10px!important}
.aura-inline-video>h3{margin-top:0!important;margin-bottom:clamp(20px,5vw,34px)!important;max-width:13ch}
.aura-inline-video .video-wrap{margin:0!important;width:100%;aspect-ratio:16/9;overflow:hidden;background:color-mix(in srgb,var(--heading) 8%,var(--bg))}
.aura-inline-video .video-wrap iframe,.aura-inline-video .video-poster{width:100%;height:100%;display:block;border:0}
.aura-inline-video .video-poster{position:relative;background-size:cover;background-position:center}
.aura-inline-video .video-poster::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.22),transparent 62%);pointer-events:none}
.aura-inline-video .video-poster .video-play-chip{position:absolute!important;left:50%!important;bottom:18px!important;z-index:3!important;transform:translateX(-50%)!important}
.aura-inline-video.video-only .video-wrap{grid-column:1/-1!important}
`;
 if(!isWedding55(p.themeVisual))return css;
 const C=`.theme-${p.themeVisual}`,line=rgba(p.primaryColor,.28),card=rgba(p.bgContentColor,bounded(p.contentBgOpacity,.82,0,1)),dark=paletteDark55(p),light=paletteLight55(p);
 const shared=`${C} .aura-video-panel,${C} .aura-transfer-panel{color:var(--text)}${C} .aura-video-panel h3{color:var(--heading)!important}`;
 switch(p.themeVisual){
  case 'wedding_minimal': css+=shared+`${C} .aura-video-panel,${C} .aura-transfer-panel{border-width:1px 0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}${C} .aura-transfer button{border-width:1px 0;border-radius:0;background:transparent}`;break;
  case 'wedding_floral': css+=shared+`${C} .aura-video-panel,${C} .aura-transfer-panel{border-radius:34px!important;background:${card}!important}${C} .aura-inline-video .video-wrap{border-radius:0 0 34px 34px}${C} .aura-transfer button{border-radius:999px}`;break;
  case 'wedding_monogram': css+=shared+`${C} .aura-video-panel,${C} .aura-transfer-panel{border-radius:0!important;outline:1px solid ${line};outline-offset:7px;background:${card}!important}${C} .aura-transfer button{border-radius:0}`;break;
  case 'wedding_luxury': css+=`${C} .aura-screen-video,${C} .aura-screen-transfer{background:${rgba(dark,.94)}!important}${C} .aura-video-panel,${C} .aura-transfer-panel{background:${rgba(dark,.72)}!important;border-color:${rgba(p.primaryColor,.34)}!important;color:${light}!important;backdrop-filter:blur(14px)}${C} .aura-video-panel h3,${C} .aura-transfer b{color:${light}!important}${C} .aura-video-panel .section-label,${C} .aura-transfer>span,${C} .aura-transfer em{color:${rgba(light,.68)}!important}${C} .aura-transfer button{background:${rgba(dark,.38)};border-color:${rgba(p.primaryColor,.42)};color:${light}}`;break;
  case 'wedding_mediterranean': css+=shared+`${C} .aura-video-panel,${C} .aura-transfer-panel{border-radius:40px 40px 18px 18px!important;background:${card}!important}${C} .aura-inline-video .video-wrap{border-radius:0 0 18px 18px}${C} .aura-transfer button{border-radius:18px}`;break;
  case 'wedding_layers': css+=shared+`${C} .aura-video-panel{transform:rotate(-.7deg);border-radius:8px!important;background:${card}!important;box-shadow:18px 20px 0 ${rgba(p.primaryColor,.09)}!important}${C} .aura-transfer-panel{transform:rotate(.5deg);border-radius:8px!important;background:${card}!important;box-shadow:-15px 16px 0 ${rgba(p.primaryColor,.08)}!important}${C} .aura-transfer button{border-radius:6px}`;break;
  case 'wedding_timeline': css+=shared+`${C} .aura-screen-video .aura-screen-shell,${C} .aura-screen-transfer .aura-screen-shell{padding-left:52px!important}${C} .aura-video-panel,${C} .aura-transfer-panel{border:0!important;border-left:1px solid ${line}!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;text-align:left!important}${C} .aura-transfer{text-align:left}${C} .aura-transfer button{border-radius:0}`;break;
  case 'wedding_curves': css+=shared+`${C} .aura-video-panel,${C} .aura-transfer-panel{border-radius:64px 20px 64px 20px!important;background:${card}!important}${C} .aura-inline-video .video-wrap{border-radius:0 0 64px 20px}${C} .aura-transfer button{border-radius:999px}`;break;
  case 'wedding_double_panel': css+=shared+`${C} .aura-video-panel{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);align-items:center;border-radius:0!important;background:${card}!important}${C} .aura-inline-video{display:contents}${C} .aura-inline-video>.section-label,${C} .aura-inline-video>h3{grid-column:1;margin-left:22px!important;margin-right:22px!important}${C} .aura-inline-video>.section-label{align-self:end}${C} .aura-inline-video>h3{align-self:start}${C} .aura-inline-video .video-wrap{grid-column:2;grid-row:1/3;height:100%;aspect-ratio:auto;min-height:360px}${C} .aura-inline-video.video-only .video-wrap{grid-column:1/-1!important;grid-row:1/-1!important;min-height:0;height:auto;aspect-ratio:16/9}${C} .aura-transfer-panel{border-radius:0!important;background:${card}!important}${C} .aura-transfer button{border-radius:0}@media(max-width:520px){${C} .aura-video-panel{display:block}${C} .aura-inline-video{display:grid}${C} .aura-inline-video .video-wrap{height:auto;aspect-ratio:16/9;min-height:0}}`;break;
  case 'wedding_immersive': css+=`${C} .aura-screen-video,${C} .aura-screen-transfer{min-height:86svh;background:linear-gradient(180deg,${rgba(dark,.92)},${rgba(dark,.98)})!important;display:flex!important;align-items:center!important}${C} .aura-video-panel,${C} .aura-transfer-panel{background:${rgba(dark,.72)}!important;border-color:${rgba(light,.15)}!important;color:${light}!important;backdrop-filter:blur(18px);border-radius:20px!important}${C} .aura-video-panel h3,${C} .aura-transfer b{color:${light}!important}${C} .aura-video-panel .section-label,${C} .aura-transfer>span,${C} .aura-transfer em{color:${rgba(light,.66)}!important}${C} .aura-transfer button{background:${rgba(dark,.34)};color:${light};border-color:${rgba(light,.22)};border-radius:999px}`;break;
 }
 return css;
}
const _invitationCss556=invitationCss;
invitationCss=function(p,t,a){return _invitationCss556(p,t,a)+moduleIntegrationCss556(p)};

const _configObject556=configObject;
configObject=function(p){const c=_configObject556(p);c.schemaVersion=5.56;c.studioVersion='5.5.6';return c};


/* =========================
   Aura Digital 5.5.7 · Integración total + banners verticales + regalo visual
   - Los banners pueden conservar el acomodo horizontal clásico o mostrarse completos en vertical/auto.
   - Regalo/transferencia admite texto, fotografía y número copiable de manera independiente.
   - Todos los nuevos recursos participan en preview, config y exportación.
   ========================= */
function bannerHtml557(src,mode='horizontal',extraClass='',label='Banner'){
  if(!src)return'';
  const m=['horizontal','vertical','auto'].includes(String(mode))?String(mode):'horizontal';
  if(m==='horizontal')return `<div class="banner reveal banner-horizontal ${extraClass}" style="background-image:url('${src}')" role="img" aria-label="${esc(label)}"></div>`;
  return `<figure class="banner-media reveal banner-${m} ${extraClass}" aria-label="${esc(label)}"><img src="${src}" alt="${esc(label)}" loading="lazy"></figure>`;
}

const _getFormParams557=getFormParams;
getFormParams=function(){
  const p=_getFormParams557();
  p.transferLabel=$('transferLabel')?.value??'';
  p.transferText=$('transferText')?.value??'';
  p.transferPhotoFile=$('transferPhotoFile')?.files?.[0]||null;
  p.bannerMode=$('bannerMode')?.value||'horizontal';
  p.bannerExtraMode=$('bannerExtraMode')?.value||'horizontal';
  p.bannerExtra2Mode=$('bannerExtra2Mode')?.value||'horizontal';
  return p;
};

const _previewAssets557=previewAssets;
previewAssets=function(p){return {..._previewAssets557(p),transferPhoto:fileUrl(p.transferPhotoFile)}};
const _zipAssets557=zipAssets;
zipAssets=function(p){return {..._zipAssets557(p),transferPhoto:assetName('regalo-foto',p.transferPhotoFile)}};

releaseUnusedFiles=function(p){
  const active=new Set([p.portadaFile,p.bannerFile,p.bannerExtraFile,p.bannerExtra2File,p.bgFile,p.musicFile,p.videoPosterFile,p.transferPhotoFile,...(p.galleryFiles||[])]);
  for(const [f,u] of fileUrls){if(!active.has(f)){URL.revokeObjectURL(u);fileUrls.delete(f)}}
};

function auraTransfer54(p,a={}){
  if(!p.showTransfer)return'';
  const label=String(p.transferLabel||'').trim(),text=String(p.transferText||'').trim(),number=String(p.transferNumber||'').trim(),photo=a?.transferPhoto||'';
  if(!label&&!text&&!number&&!photo)return'';
  return `<div class="aura-gift-module ${photo?'has-photo':'no-photo'}">
    ${photo?`<div class="aura-gift-photo"><img src="${photo}" alt="Fotografía del apartado de regalo" loading="lazy"></div>`:''}
    <div class="aura-gift-copy">
      ${label?`<div class="section-label" data-edit="transferLabel">${esc(label)}</div>`:''}
      ${text?`<div class="aura-gift-text" data-edit="transferText">${esc(text).replace(/\n/g,'<br>')}</div>`:''}
      ${number?`<div class="aura-transfer"><button type="button" data-copy-account="${esc(number)}"><b>${esc(number)}</b><em>Copiar número</em></button></div>`:''}
    </div>
  </div>`;
}

function moduleExpansionCss557(p){
  const alpha=bounded(p.contentBgOpacity,.82,0,1);
  let css=`
.banner-media{margin:clamp(24px,6vw,56px) auto;width:min(calc(100% - 30px),560px);padding:0;background:transparent;overflow:hidden}
.banner-media img{display:block;width:100%;height:auto;max-width:100%;object-fit:contain}
.banner-vertical{width:min(calc(100% - 30px),500px)}
.banner-auto{width:min(calc(100% - 30px),680px)}
.content .banner-media{width:min(100%,560px)}
.content .banner-horizontal{border-radius:var(--radius);overflow:hidden}
.aura-screen-transfer .aura-screen-shell{width:min(100%,680px)}
.aura-transfer-panel{padding:0!important;overflow:hidden}
.aura-gift-module{display:grid;grid-template-columns:1fr;overflow:hidden;background:color-mix(in srgb,var(--card) 96%,transparent)}
.aura-gift-photo{position:relative;width:100%;aspect-ratio:4/5;overflow:hidden;background:color-mix(in srgb,var(--heading) 6%,var(--bg))}
.aura-gift-photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
.aura-gift-copy{padding:clamp(28px,7vw,48px);text-align:center}
.aura-gift-text{max-width:36ch;margin:0 auto 22px;color:var(--text);font:400 clamp(14px,3.8vw,17px)/1.75 var(--body)}
.aura-gift-copy>.section-label{margin-bottom:14px}
.aura-gift-module.has-photo .aura-transfer{margin-top:22px}
.transfer-section{padding:0!important;overflow:hidden}
.transfer-section .aura-gift-copy{padding:clamp(28px,6vw,44px)}
@media(min-width:620px){.aura-gift-module.has-photo{grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);align-items:stretch}.aura-gift-module.has-photo .aura-gift-photo{aspect-ratio:auto;min-height:430px}.aura-gift-module.has-photo .aura-gift-copy{display:flex;flex-direction:column;justify-content:center}}
`;
  if(typeof isWedding55!=='function'||!isWedding55(p.themeVisual))return css;
  const C=`.theme-${p.themeVisual}`,card=rgba(p.bgContentColor,alpha),line=rgba(p.primaryColor,.26),dark=paletteDark55(p),light=paletteLight55(p);
  switch(p.themeVisual){
    case 'wedding_minimal': css+=`${C} .aura-transfer-panel{border-width:1px 0!important}${C} .aura-gift-module{background:transparent}${C} .aura-gift-photo{border-radius:0}${C} .aura-gift-copy{padding-inline:8px}`;break;
    case 'wedding_floral': css+=`${C} .aura-transfer-panel{border-radius:34px!important}${C} .aura-gift-module{background:${card};border-radius:34px}${C} .aura-gift-photo{border-radius:34px 34px 0 0}@media(min-width:620px){${C} .aura-gift-photo{border-radius:34px 0 0 34px}}`;break;
    case 'wedding_monogram': css+=`${C} .aura-gift-module{background:${card};outline:1px solid ${line};outline-offset:-10px;padding:10px}${C} .aura-gift-photo{border-radius:50% 50% 8px 8px / 30% 30% 8px 8px}`;break;
    case 'wedding_luxury': css+=`${C} .aura-gift-module{background:${rgba(dark,.78)};color:${light}}${C} .aura-gift-text,${C} .aura-gift-copy>.section-label{color:${rgba(light,.76)}}${C} .aura-gift-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,${rgba(dark,.38)},transparent 62%)}`;break;
    case 'wedding_mediterranean': css+=`${C} .aura-gift-module{background:${card};border-radius:42px 42px 18px 18px}${C} .aura-gift-photo{border-radius:42px 42px 0 0}`;break;
    case 'wedding_layers': css+=`${C} .aura-transfer-panel{overflow:visible!important}${C} .aura-gift-module{background:${card};transform:rotate(.45deg);box-shadow:18px 20px 0 ${rgba(p.primaryColor,.08)}}`;break;
    case 'wedding_timeline': css+=`${C} .aura-gift-module{background:transparent;border-left:1px solid ${line}}${C} .aura-gift-copy{text-align:left}${C} .aura-gift-text{margin-left:0}`;break;
    case 'wedding_curves': css+=`${C} .aura-gift-module{background:${card};border-radius:64px 20px 64px 20px}${C} .aura-gift-photo{border-radius:64px 20px 0 0}`;break;
    case 'wedding_double_panel': css+=`${C} .aura-gift-module.has-photo{grid-template-columns:1fr 1fr!important}${C} .aura-gift-photo{min-height:480px!important}${C} .aura-gift-copy{text-align:left}${C} .aura-gift-text{margin-left:0}@media(max-width:520px){${C} .aura-gift-module.has-photo{grid-template-columns:1fr!important}${C} .aura-gift-photo{min-height:0!important;aspect-ratio:4/5!important}}`;break;
    case 'wedding_immersive': css+=`${C} .aura-gift-module{background:${rgba(dark,.74)};color:${light};border:1px solid ${rgba(light,.16)};border-radius:20px}${C} .aura-gift-text,${C} .aura-gift-copy>.section-label{color:${rgba(light,.72)}}`;break;
  }
  return css;
}
const _invitationCss557=invitationCss;
invitationCss=function(p,t,a){return _invitationCss557(p,t,a)+moduleExpansionCss557(p)};

const _configObject557=configObject;
configObject=function(p){const c=_configObject557(p);c.schemaVersion=5.57;c.studioVersion='5.5.7';return c};

/* =========================
   Aura Digital 5.5.8 · Navegación global + regalo con jerarquía
   - Navegación rápida disponible en todas las portadas.
   - Dos estilos limpios: pastillas translúcidas y tarjetas con icono.
   - Regalo/transferencia prioriza texto y CLABE; la fotografía se integra mediante degradado.
   ========================= */
const _getFormParams558=getFormParams;
getFormParams=function(){
  const p=_getFormParams558();
  p.showHeroNav=$('showHeroNav')?.checked??true;
  p.heroNavStyle=$('heroNavStyle')?.value||'glass_pills';
  return p;
};

function auraNavigation558(p){
  if(!p.showHeroNav)return'';
  const rows=[];
  const orderConfirm=Number(p.orderConfirm??3),orderLocations=Number(p.orderLocations??1),orderGallery=Number(p.orderGallery??5);
  if(orderConfirm>0&&String(p.whatsappNumber||'').trim())rows.push(`<a class="aura-quick-action" href="#confirmar">${auraQuickIcon53('confirm')}<span>Confirmar asistencia</span><b aria-hidden="true">›</b></a>`);
  if(orderLocations>0&&((p.showCeremony&&String(p.ceremonyText||'').trim())||(p.showReception&&String(p.receptionText||'').trim())))rows.push(`<a class="aura-quick-action" href="#ubicacion">${auraQuickIcon53('location')}<span>Ver ubicación</span><b aria-hidden="true">›</b></a>`);
  if(orderGallery>0&&(p.galleryFiles?.length||0)>0)rows.push(`<a class="aura-quick-action" href="#galeria">${auraQuickIcon53('gallery')}<span>Galería</span><b aria-hidden="true">›</b></a>`);
  if(!rows.length)return'';
  const style=p.heroNavStyle==='icon_cards'?'aura-nav-cards':'aura-nav-pills';
  return `<nav class="aura-quick-actions aura-global-nav ${style}" aria-label="Navegación rápida">${rows.join('')}</nav>`;
}

const _coverHtml558=coverHtml;
coverHtml=function(params){
  const p={...COVER_DEFAULTS,...params};
  let html=_coverHtml558(params);
  try{
    const tpl=document.createElement('template');tpl.innerHTML=html.trim();
    const hero=tpl.content.firstElementChild;if(!hero)return html;
    hero.querySelectorAll('.aura-quick-actions').forEach(n=>n.remove());
    const nav=auraNavigation558(p),inner=hero.querySelector('.hero-inner');
    if(nav&&inner){const enter=inner.querySelector('[data-enter]');if(enter)enter.insertAdjacentHTML('beforebegin',nav);else inner.insertAdjacentHTML('beforeend',nav)}
    return hero.outerHTML;
  }catch(e){return html}
};

function auraTransfer54(p,a={}){
  if(!p.showTransfer)return'';
  const label=String(p.transferLabel||'').trim(),text=String(p.transferText||'').trim(),number=String(p.transferNumber||'').trim(),photo=a?.transferPhoto||'';
  if(!label&&!text&&!number&&!photo)return'';
  const hasCopy=!!(label||text||number);
  return `<div class="aura-gift-module ${photo?'has-photo':'no-photo'} ${hasCopy?'has-copy':'photo-only'}">
    ${photo?`<div class="aura-gift-photo"><img src="${photo}" alt="Fotografía del apartado de regalo" loading="lazy"></div>`:''}
    ${hasCopy?`<div class="aura-gift-copy">
      ${label?`<div class="section-label" data-edit="transferLabel">${esc(label)}</div>`:''}
      ${text?`<div class="aura-gift-text" data-edit="transferText">${esc(text).replace(/\n/g,'<br>')}</div>`:''}
      ${number?`<div class="aura-transfer"><span class="aura-transfer-caption">CLABE / cuenta</span><button type="button" data-copy-account="${esc(number)}" aria-label="Copiar CLABE o número de cuenta"><b>${esc(number)}</b><em>Copiar</em></button></div>`:''}
    </div>`:''}
  </div>`;
}

function navigationAndGiftCss558(p){
  const navInk=p.heroTextColor||'#ffffff';
  const buttonAlpha=bounded(p.buttonOpacity,.92,0,1);
  const navBorder=rgba(navInk,.42),navCard=rgba(p.bgContentColor,buttonAlpha),navHover=rgba(p.bgContentColor,Math.min(1,buttonAlpha+.08));
  const darkGift=(typeof isWedding55==='function'&&isWedding55(p.themeVisual)&&['wedding_luxury','wedding_immersive'].includes(p.themeVisual));
  const giftSurface=darkGift?paletteDark55(p):p.bgContentColor;
  const giftInk=darkGift?paletteLight55(p):p.headingColor;
  const giftText=darkGift?rgba(paletteLight55(p),.78):p.textColor;
  return `
/* Navegación rápida global */
.hero .aura-global-nav{width:min(100%,440px)!important;margin:22px auto 0!important;position:relative!important;z-index:5!important;color:${navInk}!important}
.hero .aura-global-nav .aura-quick-action{color:${navInk}!important;border-color:${navBorder}!important;text-decoration:none!important;box-sizing:border-box!important;transition:transform .2s ease,background .2s ease,border-color .2s ease!important}
.hero .aura-global-nav .aura-quick-action svg{width:20px!important;height:20px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.45!important;stroke-linecap:round!important;stroke-linejoin:round!important;flex:none!important}
.hero .aura-global-nav.aura-nav-pills{display:grid!important;grid-template-columns:1fr!important;gap:8px!important}
.hero .aura-global-nav.aura-nav-pills .aura-quick-action{min-height:50px!important;display:grid!important;grid-template-columns:24px minmax(0,1fr) 18px!important;align-items:center!important;gap:11px!important;padding:0 16px!important;border:1px solid ${navBorder}!important;border-radius:999px!important;background:${navCard}!important;-webkit-backdrop-filter:blur(14px) saturate(115%)!important;backdrop-filter:blur(14px) saturate(115%)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.11)!important}
.hero .aura-global-nav.aura-nav-pills .aura-quick-action span{text-align:left!important;font:500 10px/1.25 var(--body)!important;letter-spacing:.04em!important;text-transform:none!important;white-space:normal!important}
.hero .aura-global-nav.aura-nav-pills .aura-quick-action b{display:block!important;text-align:right!important;font:300 22px/1 var(--body)!important}
.hero .aura-global-nav.aura-nav-cards{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}
.hero .aura-global-nav.aura-nav-cards .aura-quick-action{min-height:82px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:7px!important;padding:10px 6px!important;border:1px solid ${navBorder}!important;border-radius:17px!important;background:${navCard}!important;-webkit-backdrop-filter:blur(14px) saturate(115%)!important;backdrop-filter:blur(14px) saturate(115%)!important;text-align:center!important}
.hero .aura-global-nav.aura-nav-cards .aura-quick-action span{font:600 7px/1.35 var(--body)!important;letter-spacing:.075em!important;text-transform:uppercase!important;text-align:center!important;white-space:normal!important}
.hero .aura-global-nav.aura-nav-cards .aura-quick-action b{display:none!important}
.hero .aura-global-nav .aura-quick-action:hover{transform:translateY(-1px)!important;background:${navHover}!important}
@media(max-width:350px){.hero .aura-global-nav.aura-nav-cards{gap:5px!important}.hero .aura-global-nav.aura-nav-cards .aura-quick-action{min-height:76px!important;padding-inline:3px!important}.hero .aura-global-nav.aura-nav-cards .aura-quick-action span{font-size:6.5px!important}}

/* Regalo / transferencia: el texto y la CLABE mandan; la fotografía acompaña */
.aura-gift-module{--gift-surface:${giftSurface};--gift-ink:${giftInk};--gift-text:${giftText};position:relative!important;background:var(--gift-surface)!important;color:var(--gift-text)!important;overflow:hidden!important}
.aura-gift-module.has-photo{display:block!important;grid-template-columns:1fr!important}
.aura-gift-module.has-photo .aura-gift-photo{position:relative!important;width:100%!important;aspect-ratio:16/11!important;min-height:0!important;max-height:360px!important;overflow:hidden!important;border-radius:0!important}
.aura-gift-module.has-photo .aura-gift-photo img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;filter:saturate(.78) contrast(.94) brightness(.90)!important;opacity:.90!important;transform:scale(1.015)!important}
.aura-gift-module.has-photo .aura-gift-photo::after{content:''!important;position:absolute!important;inset:0!important;pointer-events:none!important;background:linear-gradient(180deg,transparent 0%,transparent 28%,${rgba(giftSurface,.18)} 50%,${rgba(giftSurface,.78)} 76%,${rgba(giftSurface,1)} 100%)!important}
.aura-gift-module.has-photo .aura-gift-copy{position:relative!important;z-index:3!important;margin-top:-102px!important;padding:124px clamp(26px,7vw,48px) clamp(32px,7vw,50px)!important;background:linear-gradient(180deg,transparent 0,${rgba(giftSurface,.76)} 88px,${rgba(giftSurface,1)} 122px)!important;text-align:center!important}
.aura-gift-module.no-photo .aura-gift-copy{padding:clamp(32px,7vw,52px)!important;text-align:center!important}
.aura-gift-copy>.section-label{color:var(--gift-text)!important;opacity:.72!important;margin-bottom:12px!important}
.aura-gift-text{max-width:38ch!important;margin:0 auto 24px!important;color:var(--gift-text)!important;font:500 clamp(15px,4vw,18px)/1.75 var(--body)!important}
.aura-gift-module .aura-transfer{width:min(100%,440px)!important;margin:18px auto 0!important;text-align:left!important}
.aura-transfer-caption{display:block!important;margin:0 0 8px!important;color:var(--gift-text)!important;font:700 8px/1.2 var(--body)!important;letter-spacing:.16em!important;text-transform:uppercase!important;opacity:.68!important}
.aura-gift-module .aura-transfer button{width:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:12px!important;padding:16px 17px!important;border:1px solid ${rgba(p.primaryColor,.34)}!important;background:${rgba(giftSurface,darkGift?.64:.86)}!important;color:var(--gift-ink)!important;cursor:pointer!important;box-shadow:none!important}
.aura-gift-module .aura-transfer b{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;color:var(--gift-ink)!important;font:650 clamp(14px,4vw,17px)/1.2 'DM Sans',sans-serif!important;font-variant-numeric:tabular-nums!important;letter-spacing:.035em!important}
.aura-gift-module .aura-transfer em{color:var(--gift-text)!important;font:700 8px/1 var(--body)!important;font-style:normal!important;letter-spacing:.12em!important;text-transform:uppercase!important;opacity:.72!important}
.aura-gift-module.photo-only .aura-gift-photo{aspect-ratio:4/5!important;max-height:520px!important}
@media(min-width:620px){.aura-gift-module.has-photo{grid-template-columns:1fr!important}.aura-gift-module.has-photo .aura-gift-photo{min-height:0!important;max-height:390px!important;aspect-ratio:16/10!important}.aura-gift-module.has-photo .aura-gift-copy{margin-top:-118px!important;padding-top:144px!important}}
`;
}

const _invitationCss558=invitationCss;
invitationCss=function(p,t,a){return _invitationCss558(p,t,a)+navigationAndGiftCss558(p)};

const _configObject558=configObject;
configObject=function(p){const c=_configObject558(p);c.schemaVersion=5.58;c.studioVersion='5.5.8';return c};

/* =========================
   Aura Digital 5.5.9 · Fecha y contador con variantes reales
   - Conserva intactos los estilos actuales (auto / super_minimal).
   - Las alternativas son optativas e independientes del diseño general.
   ========================= */
function dateCountdownCss559(p){
  const line=rgba(p.headingColor,.18),accentSoft=rgba(p.primaryColor,.10),accentMid=rgba(p.primaryColor,.28),surface=rgba(p.bgContentColor,bounded(p.contentBgOpacity,.82,0,1));
  return `
/* CUENTA REGRESIVA — el estilo actual super_minimal queda intacto */
.countdown.countdown-soft{gap:10px!important}.countdown.countdown-soft .count-item{background:${surface}!important;border:1px solid ${line}!important;border-radius:18px!important;box-shadow:0 10px 28px ${rgba(p.headingColor,.055)}!important;padding:18px 6px!important}
.countdown.countdown-simple{gap:0!important;border-top:1px solid ${line}!important;border-bottom:1px solid ${line}!important;padding:10px 0!important}.countdown.countdown-simple .count-item{border-radius:0!important;padding:12px 4px!important;background:transparent!important}.countdown.countdown-simple .count-item+ .count-item{border-left:1px solid ${line}!important}
.countdown.countdown-outline{gap:9px!important}.countdown.countdown-outline .count-item{background:transparent!important;border:1px solid ${accentMid}!important;border-radius:4px!important;padding:18px 5px!important}
.countdown.countdown-pill{gap:7px!important}.countdown.countdown-pill .count-item{background:${accentSoft}!important;border:1px solid ${accentMid}!important;border-radius:999px!important;padding:17px 3px!important}.countdown.countdown-pill .count-item span{font-size:7px!important;letter-spacing:.11em!important}
.countdown.countdown-glass{gap:9px!important}.countdown.countdown-glass .count-item{background:${rgba(p.bgContentColor,bounded(p.contentBgOpacity,.82,0,1))}!important;border:1px solid ${rgba(p.headingColor,.12)}!important;border-radius:20px!important;-webkit-backdrop-filter:blur(16px) saturate(125%)!important;backdrop-filter:blur(16px) saturate(125%)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 12px 30px ${rgba(p.headingColor,.05)}!important}
.countdown.countdown-circles{gap:7px!important;align-items:center!important}.countdown.countdown-circles .count-item{aspect-ratio:1/1!important;min-width:0!important;padding:7px 2px!important;border-radius:50%!important;border:1px solid ${accentMid}!important;background:${accentSoft}!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important}.countdown.countdown-circles .count-item b{font-size:clamp(22px,7vw,34px)!important}.countdown.countdown-circles .count-item span{font-size:6.5px!important;letter-spacing:.08em!important;margin-top:5px!important}
.countdown.countdown-editorial{gap:0!important;max-width:560px!important;margin-left:auto!important;margin-right:auto!important}.countdown.countdown-editorial .count-item{position:relative!important;border-radius:0!important;background:transparent!important;padding:16px 8px!important}.countdown.countdown-editorial .count-item:not(:last-child)::after{content:''!important;position:absolute!important;right:0!important;top:18%!important;height:64%!important;width:1px!important;background:${line}!important}.countdown.countdown-editorial .count-item b{font-size:clamp(34px,10vw,54px)!important;font-weight:400!important}.countdown.countdown-editorial .count-item span{letter-spacing:.22em!important}
.countdown.countdown-stacked{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;width:min(100%,430px)!important;margin-left:auto!important;margin-right:auto!important}.countdown.countdown-stacked .count-item{min-height:112px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;background:${surface}!important;border:1px solid ${line}!important;border-radius:18px!important;padding:18px!important}.countdown.countdown-stacked .count-item b{font-size:clamp(34px,11vw,54px)!important}

/* FECHA — tarjetas clásicas */
.date-card.date-calendar{overflow:hidden!important;border:1px solid ${accentMid}!important;border-radius:20px!important;padding:0 24px 24px!important;background:${surface}!important;box-shadow:0 18px 44px ${rgba(p.headingColor,.06)}!important}.date-card.date-calendar .date-weekday{margin:0 -24px 18px!important;padding:11px 12px!important;background:${p.primaryColor}!important;color:white!important}.date-card.date-calendar .date-main{grid-template-columns:1fr!important;gap:3px!important}.date-card.date-calendar .date-month,.date-card.date-calendar .date-year{text-align:center!important}.date-card.date-calendar .date-day{font-size:82px!important;margin:4px 0!important}.date-card.date-calendar .date-time{margin-top:12px!important}
.date-card.date-vertical{width:min(100%,390px)!important;padding:24px!important;background:transparent!important;border:1px solid ${line}!important;border-radius:0!important}.date-card.date-vertical .date-weekday{text-align:left!important;margin-bottom:12px!important}.date-card.date-vertical .date-main{display:grid!important;grid-template-columns:auto 1fr!important;grid-template-areas:'day month' 'day year'!important;column-gap:18px!important;row-gap:2px!important;align-items:center!important}.date-card.date-vertical .date-day{grid-area:day!important;font-size:88px!important}.date-card.date-vertical .date-month{grid-area:month!important;text-align:left!important;align-self:end!important}.date-card.date-vertical .date-year{grid-area:year!important;text-align:left!important;align-self:start!important}.date-card.date-vertical .date-time{text-align:left!important;margin-top:12px!important}
.date-card.date-seal{width:min(78vw,285px)!important;aspect-ratio:1/1!important;border-radius:50%!important;padding:34px!important;background:${accentSoft}!important;border:1px solid ${accentMid}!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important}.date-card.date-seal .date-main{grid-template-columns:1fr!important;gap:2px!important;margin:8px 0!important}.date-card.date-seal .date-month,.date-card.date-seal .date-year{text-align:center!important}.date-card.date-seal .date-day{font-size:78px!important}.date-card.date-seal .date-time{margin-top:6px!important}

/* FECHA — diseños editoriales Aura */
.aura-date-lockup.date-editorial{width:min(100%,400px)!important;padding:18px 8px!important;border-top:1px solid ${line}!important;border-bottom:1px solid ${line}!important;background:transparent!important}
.aura-date-lockup.date-heritage{width:min(100%,360px)!important;padding:28px 24px!important;border:1px solid ${accentMid}!important;outline:1px solid ${rgba(p.primaryColor,.18)}!important;outline-offset:6px!important;background:${accentSoft}!important}
.aura-date-lockup.date-arch{width:min(100%,340px)!important;padding:44px 24px 26px!important;border:1px solid ${rgba(p.primaryColor,.20)}!important;border-radius:170px 170px 26px 26px!important;background:${accentSoft}!important}
.aura-date-lockup.date-couture{width:min(100%,350px)!important;padding:30px 26px!important;border:1px solid ${rgba(p.primaryColor,.40)}!important;box-shadow:inset 0 0 0 7px ${rgba(p.bgContentColor,.58)},0 18px 44px ${rgba(p.primaryColor,.07)}!important;background:${accentSoft}!important}
.aura-date-lockup.date-calendar{width:min(100%,330px)!important;overflow:hidden!important;border:1px solid ${accentMid}!important;border-radius:20px!important;background:${surface}!important;padding:0 24px 26px!important}.aura-date-lockup.date-calendar .aura-date-weekday{width:calc(100% + 48px)!important;margin:0 -24px 18px!important;padding:11px 10px!important;background:${p.primaryColor}!important;color:white!important;text-align:center!important}.aura-date-lockup.date-calendar .aura-date-day{font-size:clamp(72px,20vw,104px)!important}.aura-date-lockup.date-calendar .aura-date-monthyear{margin-top:5px!important}
.aura-date-lockup.date-vertical{width:min(100%,390px)!important;display:grid!important;grid-template-columns:auto 1fr!important;grid-template-areas:'weekday weekday' 'day monthyear' 'day time'!important;column-gap:20px!important;align-items:center!important;justify-items:start!important;text-align:left!important;padding:22px 0!important;border-top:1px solid ${line}!important;border-bottom:1px solid ${line}!important}.aura-date-lockup.date-vertical .aura-date-weekday{grid-area:weekday!important}.aura-date-lockup.date-vertical .aura-date-day{grid-area:day!important;font-size:clamp(74px,22vw,112px)!important}.aura-date-lockup.date-vertical .aura-date-monthyear{grid-area:monthyear!important;align-self:end!important}.aura-date-lockup.date-vertical .aura-date-time{grid-area:time!important;align-self:start!important;margin-top:2px!important}
.aura-date-lockup.date-seal{width:min(78vw,290px)!important;aspect-ratio:1/1!important;border-radius:50%!important;border:1px solid ${accentMid}!important;background:${accentSoft}!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:34px!important}.aura-date-lockup.date-seal .aura-date-day{font-size:clamp(70px,20vw,98px)!important}.aura-date-lockup.date-seal .aura-date-time{margin-top:7px!important}
.aura-date-lockup.date-minimal{width:min(100%,390px)!important;padding:14px 4px!important;border-top:1px solid ${line}!important;border-bottom:1px solid ${line}!important;background:transparent!important}.aura-date-lockup.date-minimal .aura-date-day{font-size:clamp(58px,17vw,88px)!important}

@media(max-width:360px){.countdown.countdown-circles{gap:4px!important}.countdown.countdown-circles .count-item span{font-size:6px!important}.date-card.date-vertical .date-day{font-size:76px!important}}
`;
}
const _invitationCss559=invitationCss;
invitationCss=function(p,t,a){return _invitationCss559(p,t,a)+dateCountdownCss559(p)};

const _configObject559=configObject;
configObject=function(p){const c=_configObject559(p);c.schemaVersion=5.59;c.studioVersion='5.5.9';return c};


/* =========================
   Aura Digital 5.6.1 · Preview externo completo + video refinado
   El preview interno del Studio no se modifica.
   ========================= */
function auraDetachedPhoneShell560(){
 return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Aura Digital · Preview móvil</title><style>
 *{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#e9e5df;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif;color:#282522}
 body{display:grid;place-items:center}.mock-stage{position:fixed;inset:0;display:grid;place-items:center;padding:16px;background:radial-gradient(circle at 50% 16%,#f8f6f2 0,#ebe7e1 46%,#d9d3ca 100%);overflow:hidden}
 .phone-scale-box{position:relative;display:block;flex:0 0 auto}.phone-wrap{display:grid;justify-items:center;gap:10px;transform-origin:top left}.device{position:relative;width:417px;height:876px;padding:12px;border-radius:54px;background:linear-gradient(145deg,#151515,#343434 48%,#0b0b0b);box-shadow:0 35px 90px rgba(35,30,24,.28),inset 0 0 0 1px rgba(255,255,255,.14)}
 .screen{width:393px;height:852px;border:0;border-radius:43px;background:#fff;display:block;overflow:hidden}.island{position:absolute;z-index:5;top:20px;left:50%;transform:translateX(-50%);width:116px;height:31px;border-radius:999px;background:#050505;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04);pointer-events:none}.side{position:absolute;background:#1b1b1b;border-radius:3px}.side.s1{left:-3px;top:126px;width:4px;height:30px}.side.s2{left:-3px;top:174px;width:4px;height:55px}.side.s3{right:-3px;top:154px;width:4px;height:77px}.device-label{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#756e66;background:rgba(255,255,255,.58);border:1px solid rgba(73,65,56,.10);border-radius:999px;padding:7px 11px;backdrop-filter:blur(10px)}
 @media(max-width:470px){.mock-stage{padding:8px}.device-label{display:none}}
 </style></head><body><main class="mock-stage"><div class="phone-scale-box" id="phoneScaleBox"><div class="phone-wrap" id="phoneWrap"><div class="device"><span class="island"></span><span class="side s1"></span><span class="side s2"></span><span class="side s3"></span><iframe class="screen" id="aura-device-frame" title="Preview móvil de la invitación"></iframe></div><div class="device-label">Vista móvil · 393 × 852</div></div></div></main><script>
 function fitPhone(){
  const wrap=document.getElementById('phoneWrap'),box=document.getElementById('phoneScaleBox');if(!wrap||!box)return;
  wrap.style.transform='none';box.style.width='auto';box.style.height='auto';
  const naturalW=wrap.offsetWidth||417,naturalH=wrap.offsetHeight||914;
  const safeX=32,safeY=32,availW=Math.max(220,innerWidth-safeX),availH=Math.max(360,innerHeight-safeY);
  const scale=Math.min(1,availW/naturalW,availH/naturalH);
  box.style.width=(naturalW*scale)+'px';box.style.height=(naturalH*scale)+'px';
  wrap.style.transformOrigin='top left';wrap.style.transform='scale('+scale+')';
 }
 addEventListener('resize',fitPhone);requestAnimationFrame(fitPhone);setTimeout(fitPhone,80);
 <\/script></body></html>`;
}
openDetachedPreview=function(){
 const availW=Math.max(520,window.screen?.availWidth||window.innerWidth||900),availH=Math.max(700,window.screen?.availHeight||window.innerHeight||980);
 const width=Math.min(560,Math.max(500,availW-80)),height=Math.min(980,Math.max(760,availH-70));
 const sx=Number.isFinite(window.screenX)?window.screenX:(window.screenLeft||0),sy=Number.isFinite(window.screenY)?window.screenY:(window.screenTop||0);
 const left=Math.max(sx+8,sx+(window.outerWidth||availW)-width-24),top=Math.max(sy+12,sy+Math.round(Math.max(0,availH-height)/2));
 try{if(detachedPreviewWindow&&!detachedPreviewWindow.closed)detachedPreviewWindow.close()}catch(e){}
 detachedPreviewWindow=window.open('about:blank','_blank',`popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`);
 if(!detachedPreviewWindow){alert('El navegador bloqueó la ventana de vista previa. Permite ventanas emergentes para esta página e inténtalo de nuevo.');return}
 try{detachedPreviewWindow.document.open();detachedPreviewWindow.document.write(auraDetachedPhoneShell560());detachedPreviewWindow.document.close()}catch(e){console.warn('No se pudo preparar el mockup móvil',e)}
 setTimeout(()=>{updatePreview();try{detachedPreviewWindow.focus()}catch(e){}},40);
};
renderDetachedPreview=function(html){
 if(!detachedPreviewWindow||detachedPreviewWindow.closed)return;
 try{
  const doc=detachedPreviewWindow.document,frame=doc.getElementById('aura-device-frame');if(!frame)return;
  let scrollY=0;try{scrollY=frame.contentWindow?.scrollY||0}catch(e){}
  frame.onload=()=>{try{frame.contentWindow?.scrollTo(0,scrollY);bindGalleryDrag(frame.contentDocument);bindPreviewEditing52(frame.contentDocument)}catch(e){}};
  frame.srcdoc=html;
 }catch(e){console.warn('No se pudo actualizar el preview móvil externo',e)}
};

const _configObject560=configObject;configObject=function(p){const c=_configObject560(p);c.schemaVersion=5.61;c.studioVersion='5.6.1';return c};


/* =========================
   Aura Digital 5.6.2 · Espaciado del módulo de video
   El video se adapta a su contenido en todos los temas.
   Evita pantallas vacías en Aura Editorial Boda/XV e Inmersiva.
   ========================= */
function videoSpacingCss562(p){
 return `
.aura-screen-video{
  min-height:0!important;
  height:auto!important;
  padding:clamp(34px,7vw,62px) 15px!important;
  align-items:center!important;
  justify-content:center!important;
}
.aura-screen-video .aura-screen-shell{
  min-height:0!important;
  height:auto!important;
  width:min(100%,680px)!important;
  margin:0 auto!important;
}
.aura-screen-video .aura-video-panel{
  min-height:0!important;
  height:auto!important;
  margin:0 auto!important;
}
.aura-screen-video .aura-inline-video{
  min-height:0!important;
  height:auto!important;
}
.aura-screen-video .aura-inline-video .video-wrap{
  min-height:0!important;
  height:auto!important;
  aspect-ratio:16/9!important;
}
.aura-screen-video .aura-inline-video.video-only .video-wrap{
  margin:0!important;
}
@media(max-width:430px){
 .aura-screen-video{padding-top:30px!important;padding-bottom:30px!important}
 .aura-screen-video .aura-inline-video>h3{margin-bottom:18px!important}
}
`;
}
const _invitationCss562=invitationCss;
invitationCss=function(p,t,a){return _invitationCss562(p,t,a)+videoSpacingCss562(p)};

const _configObject562=configObject;
configObject=function(p){const c=_configObject562(p);c.schemaVersion=5.62;c.studioVersion='5.6.2';return c};


/* =========================
   Aura Digital 5.6.3 · Navegación global corregida
   - Los destinos de portada funcionan también en temas clásicos.
   - Scroll robusto en preview, ventana externa e invitación exportada.
   ========================= */
const _buildSections563=buildSections;
buildSections=function(p,a){
 let html=_buildSections563(p,a);
 if(!/\bid=["']ubicacion["']/.test(html)){
  html=html.replace('<section class="section reveal"><div class="section-label">Dónde será</div>','<section id="ubicacion" class="section reveal"><div class="section-label">Dónde será</div>');
 }
 if(!/\bid=["']confirmar["']/.test(html)){
  html=html.replace('<section class="section center rsvp reveal">','<section id="confirmar" class="section center rsvp reveal">');
 }
 if(!/\bid=["']galeria["']/.test(html)){
  html=html.replace(/<section class="section reveal gallery-section([^\"]*)"/, '<section id="galeria" class="section reveal gallery-section$1"');
 }
 return html;
};

const _invitationJs563=invitationJs;
invitationJs=function(){
 return _invitationJs563()+`;(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;document.querySelectorAll('.aura-global-nav a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const id=a.getAttribute('href');const target=id&&document.querySelector(id);if(!target)return;e.preventDefault();target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});try{history.replaceState(null,'',id)}catch(_){}})});})();`;
};

const _configObject563=configObject;
configObject=function(p){const c=_configObject563(p);c.schemaVersion=5.63;c.studioVersion='5.6.3';return c};


/* =========================
   Aura Digital 5.6.4 · auditoría integral
   - Espaciado adaptable por contenido cuando no hay fotografía que justifique pantalla completa.
   - Toda navegación de portada intenta iniciar la música.
   - El video pausa la música antes de comenzar.
   - Editor agrupado para reducir desorientación.
   ========================= */

// El video siempre inicia desde un control propio. Si no hay portada, usa un fondo editorial;
// así podemos pausar la música en el mismo gesto que inicia el video.
const _auraVideo54_564=auraVideo54;
auraVideo54=function(p,a){
 if(!p.videoUrl)return'';
 const hasCopy=!!(String(p.videoLabel||'').trim()||String(p.videoText||'').trim());
 const url=esc(normalizedVideo(p.videoUrl));
 const poster=a?.poster||'';
 const bg=poster?`linear-gradient(rgba(0,0,0,.08),rgba(0,0,0,.22)),url('${poster}')`:`linear-gradient(145deg,color-mix(in srgb,var(--accent) 28%,#26211d),#171411)`;
 return `<div class="aura-inline-video ${hasCopy?'has-copy':'video-only'}">${p.videoLabel?`<div class="section-label" data-edit="videoLabel"${sizeAttr(p.videoLabelSize,'sectionLabel')}>${esc(p.videoLabel)}</div>`:''}${p.videoText?`<h3 data-edit="videoText"${sizeAttr(p.videoTextSize,'sectionTitle')}>${esc(p.videoText)}</h3>`:''}<div class="video-wrap"><button class="video-poster" type="button" data-video="${url}" style="background-image:${bg}" aria-label="Reproducir video"><span class="video-play-chip"><i aria-hidden="true">▶</i><em>Ver video</em></span></button></div></div>`;
};

function spacingAuditCss564(p){
 return `
/* Evita huecos vacíos: una sección solo conserva gran altura cuando una fotografía la llena. */
.content>.section{min-height:0!important}
.aura-screen-confirm,.aura-screen-video,.aura-screen-transfer,.aura-screen-gallery{min-height:0!important;height:auto!important}
.aura-screen-confirm .aura-screen-shell,.aura-screen-video .aura-screen-shell,.aura-screen-transfer .aura-screen-shell,.aura-screen-gallery .aura-screen-shell{min-height:0!important;height:auto!important}
.aura-screen:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))){min-height:0!important;height:auto!important;padding-top:clamp(34px,7vw,64px)!important;padding-bottom:clamp(34px,7vw,64px)!important}
.aura-screen:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))) .aura-screen-shell{min-height:0!important;height:auto!important}
.aura-stage-photo-empty{display:none!important}
.aura-screen-close:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))) .aura-close-panel{position:relative!important;inset:auto!important;min-height:0!important;padding:clamp(38px,9vw,74px) 24px!important}
.aura-screen-family:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))) .aura-family-portrait{display:none!important}
.aura-screen-family:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))) .aura-family-panel{padding-top:clamp(30px,7vw,52px)!important}
.aura-screen-date:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))) .aura-date-panel,.aura-screen-location:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))) .aura-location-panel{margin:0 auto!important}
@media(max-width:430px){.content>.section{margin-bottom:20px!important}.aura-screen:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))){padding-top:30px!important;padding-bottom:30px!important}}
`;
}
const _invitationCss564=invitationCss;
invitationCss=function(p,t,a){return _invitationCss564(p,t,a)+spacingAuditCss564(p)};

const _invitationJs564=invitationJs;
invitationJs=function(){
 return _invitationJs564()+`;(()=>{
  const audio=document.querySelector('audio'),music=document.querySelector('.music-toggle');
  const startMusic=()=>{if(!audio)return;audio.play().then(()=>{if(music)music.textContent='Ⅱ'}).catch(()=>{})};
  const pauseForVideo=()=>{if(!audio)return;audio.dataset.auraWasPlaying=audio.paused?'0':'1';audio.pause();if(music)music.textContent='♪'};
  document.addEventListener('click',e=>{
   const nav=e.target.closest('.hero .aura-global-nav a[href^="#"]');if(nav)startMusic();
   const video=e.target.closest('.video-poster');if(video)pauseForVideo();
  },true);
 })();`;
};

function initEditorGroups564(){
 const nav=document.querySelector('.editor-groupnav');if(!nav)return;
 const groups={
  design:['sec-identidad','sec-portada','sec-apariencia','sec-movimiento'],
  content:['sec-evento','sec-ubicaciones','sec-familia','sec-cierre'],
  media:['sec-transferencia','sec-video','sec-media'],
  order:['sec-orden'],
  file:['sec-exportar','sec-github','sec-system']
 };
 // sec-apariencia se añadió históricamente sin id; resolver por número 03.
 const all=Array.from(document.querySelectorAll('details.form-section'));
 const section03=all.find(d=>d.querySelector('summary b')?.textContent.trim()==='03');if(section03&&!section03.id)section03.id='sec-apariencia';
 const names={design:'Diseño',content:'Contenido',media:'Multimedia',order:'Orden',file:'Archivo'};
 Object.entries(groups).forEach(([g,ids])=>ids.forEach(id=>{const d=document.getElementById(id);if(!d)return;d.dataset.editorGroup=g;const span=d.querySelector('summary span');if(span&&!span.querySelector('.editor-group-tag'))span.insertAdjacentHTML('beforeend',`<small class="editor-group-tag">${names[g]}</small>`)}));
 const note=document.getElementById('editor-guide-note');
 const notes={all:'Ves todos los apartados. Elige un grupo para reducir el menú.',design:'Temas, portada, colores y movimiento.',content:'Fecha, lugares, familia, confirmación y cierre.',media:'Regalo, video, fotografías, banners y música.',order:'Acomoda u oculta las secciones de la invitación.',file:'Importa configuraciones, publica en GitHub y administra actualizaciones de Aura.'};
 const apply=g=>{
  all.forEach(d=>{const show=g==='all'||d.dataset.editorGroup===g;d.classList.toggle('editor-filtered',!show);if(!show)d.open=false});
  nav.querySelectorAll('button[data-editor-group]').forEach(b=>b.classList.toggle('active',b.dataset.editorGroup===g));
  if(note)note.textContent=notes[g]||notes.all;
  if(g!=='all'){const first=all.find(d=>d.dataset.editorGroup===g);if(first){first.open=true;requestAnimationFrame(()=>first.scrollIntoView({behavior:'smooth',block:'start'}))}}
 };
 nav.addEventListener('click',e=>{const b=e.target.closest('button[data-editor-group]');if(!b)return;apply(b.dataset.editorGroup)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initEditorGroups564);else initEditorGroups564();


// Si el usuario toca un texto del preview mientras hay un filtro activo, abre automáticamente su grupo.
const _focusEditorField52_564=focusEditorField52;
focusEditorField52=function(id){
 const el=$(id);if(!el)return;const section=el.closest('details.form-section');
 if(section?.classList.contains('editor-filtered')){const g=section.dataset.editorGroup;const b=g&&document.querySelector(`button[data-editor-group="${g}"]`);if(b)b.click()}
 _focusEditorField52_564(id);
};

const _configObject564=configObject;
configObject=function(p){const c=_configObject564(p);c.schemaVersion=5.64;c.studioVersion='5.6.4';return c};


/* =========================
   Aura Digital 5.6.4 · mejoras nocturnas
   1) Mapa global con modos: desplegable / visible / solo lugar.
   2) Optimización fotográfica más agresiva: objetivo ~500 KB por imagen.
   ========================= */

function auraMapDisplayMode564(p){
  const mode=String((p&&p.mapDisplayMode)||'toggle').toLowerCase();
  return ['toggle','visible','hidden'].includes(mode)?mode:'toggle';
}

function mapToggleMarkup564(mode,map,link,id,name){
  const safeName=esc(name||'Ubicación');
  const safeLink=link?esc(link):'';
  const safeMap=map?esc(map):'';
  if(!map&&link){
    return `<a class="map-external" href="${safeLink}" target="_blank" rel="noopener">Abrir en Google Maps ↗</a>`;
  }
  if(!map)return '';
  if(mode==='visible'){
    return `<div class="map-disclosure open" id="${id}"><div class="map-disclosure-inner"><div class="map-preview"><iframe src="${safeMap}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen title="Mapa de ${safeName}"></iframe></div>${safeLink?`<a class="map-external" href="${safeLink}" target="_blank" rel="noopener">Abrir en Google Maps ↗</a>`:''}</div></div>`;
  }
  if(mode==='hidden'){
    return safeLink?`<a class="map-external" href="${safeLink}" target="_blank" rel="noopener">Abrir en Google Maps ↗</a>`:'';
  }
  return `<button class="map-toggle" type="button" aria-expanded="false" aria-controls="${id}"><span>Ver mapa</span><span class="map-toggle-icon">＋</span></button><div class="map-disclosure" id="${id}"><div class="map-disclosure-inner"><div class="map-preview"><iframe data-src="${safeMap}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen title="Mapa de ${safeName}"></iframe></div>${safeLink?`<a class="map-external" href="${safeLink}" target="_blank" rel="noopener">Abrir en Google Maps ↗</a>`:''}</div></div>`;
}

const _getFormParams564_map=getFormParams;
getFormParams=function(){
  const p=_getFormParams564_map();
  p.mapDisplayMode=$('mapDisplayMode')?.value||'toggle';
  return p;
};

const _auraLocationCard54_564 = auraLocationCard54;
auraLocationCard54=function(p,text,url,coords,id,textSize,editId){
  const x=splitPlace(text),map=mapEmbedUrl(url,coords),link=safeMapLink(url),mode=auraMapDisplayMode564(p);
  const control=mapToggleMarkup564(mode,map,link,id,x.name);
  const inlineToggle = mode==='toggle' ? control : '';
  const secondary = mode!=='toggle' ? control : '';
  return `<article class="aura-location-card aura-map-mode-${mode}"><div class="aura-location-copy"><small data-edit="${editId}"${sizeAttr(textSize,'locationLabel')}>${esc(x.kind||'Evento')}</small><strong data-edit="${editId}"${sizeAttr(textSize,'locationName')}>${esc(x.name)}</strong>${inlineToggle}</div>${secondary}</article>`;
};

const _buildSections564_map = buildSections;
buildSections=function(p,a){
  if(typeof isAuraEditorial53==='function' && isAuraEditorial53(p.themeVisual))return auraEditorialSections54(p,a);
  const offsets=galleryOffsets(p),locs=[],mapMode=auraMapDisplayMode564(p);
  const locationCard=(text,url,coords,id,textSize,editId)=>{
    const x=splitPlace(text),map=mapEmbedUrl(url,coords),link=safeMapLink(url),control=mapToggleMarkup564(mapMode,map,link,id,x.name);
    const inlineToggle = mapMode==='toggle' ? control : '';
    const secondary = mapMode!=='toggle' ? control : '';
    return `<div class="location-card map-mode-${mapMode}"><div class="location-head"><div><small data-edit="${editId}"${sizeAttr(textSize,'locationLabel')}>${esc(x.kind)}</small><strong data-edit="${editId}"${sizeAttr(textSize,'locationName')}>${esc(x.name)}</strong></div>${inlineToggle}</div>${secondary}</div>`
  };
  if(p.showCeremony&&p.ceremonyText)locs.push(locationCard(p.ceremonyText,p.ceremonyUrl,p.ceremonyCoords,'map-ceremony',p.ceremonyTextSize,'ceremonyText'));
  if(p.showReception&&p.receptionText)locs.push(locationCard(p.receptionText,p.receptionUrl,p.receptionCoords,'map-reception',p.receptionTextSize,'receptionText'));
  const familyVisible=p.showFamily&&(String(p.parentsText||'').trim()||String(p.godparentsText||'').trim());
  const famCards=[];
  if(String(p.parentsText||'').trim())famCards.push(`<div class="family-card"><small data-edit="parentsLabel">${esc(p.parentsLabel||'Papás')}</small><strong data-edit="parentsText"${sizeAttr(p.familyTextSize,'locationName')}>${esc(p.parentsText).replace(/\n/g,'<br>')}</strong></div>`);
  if(String(p.godparentsText||'').trim())famCards.push(`<div class="family-card"><small data-edit="godparentsLabel">${esc(p.godparentsLabel||'Padrinos')}</small><strong data-edit="godparentsText"${sizeAttr(p.familyTextSize,'locationName')}>${esc(p.godparentsText).replace(/\n/g,'<br>')}</strong></div>`);
  const signatureFont=FONT_MAP[p.closingSignatureFont]||"'Great Vibes',cursive";
  const parts={
    locations:locs.length?`<section class="section reveal"><div class="section-label">Dónde será</div><h2 data-edit="locationsHeadingSize"${sizeAttr(p.locationsHeadingSize,'sectionTitle')}>Nos vemos aquí.</h2><div class="ornament"></div><div class="locations">${locs.join('')}</div></section>`:'',
    family:familyVisible?`<section class="section reveal family-section">${p.familyLabel?`<div class="section-label" data-edit="familyLabel">${esc(p.familyLabel)}</div>`:''}${p.familyHeading?`<h2 data-edit="familyHeading">${esc(p.familyHeading)}</h2>`:''}<div class="family-grid">${famCards.join('')}</div><div class="family-equal-note"></div></section>`:'',
    confirm:p.whatsappNumber?`<section class="section center rsvp reveal"><div class="section-label">RSVP</div><h2${sizeAttr(p.rsvpHeadingSize,'sectionTitle')}>¿Nos acompañas?</h2><p class="section-copy"${sizeAttr(p.rsvpCopySize,'body')}>Tu confirmación nos ayuda a preparar cada detalle.</p><a class="cta"${sizeAttr(p.rsvpButtonSize,'button')} target="_blank" href="https://wa.me/${encodeURIComponent(p.whatsappNumber.replace(/\D/g,''))}?text=${encodeURIComponent(p.whatsappMessage)}">Confirmar por WhatsApp →</a></section>`:'',
    countdown:p.eventDate?`<section class="section center reveal date-section"><div class="section-label">Save the date</div><h2 data-edit="countdownLabel"${sizeAttr(p.countdownLabelSize,'sectionTitle')}>${esc(p.countdownLabel)}</h2>${dateCardHtml(p)}<div class="countdown ${countdownStyleClass(p)}" data-date="${esc(p.eventDate)}"><div class="count-item"><b data-d${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Días</span></div><div class="count-item"><b data-h${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Horas</span></div><div class="count-item"><b data-m${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Min</span></div><div class="count-item"><b data-s${sizeAttr(p.countdownNumbersSize,'countNumber')}>00</b><span>Seg</span></div></div></section>`:'',
    gallery:a.gallery.length?`<section class="section reveal gallery-section${(!p.galleryLabel&&!p.galleryTitle)?' gallery-only':''}">${p.galleryLabel?`<div class="section-label" data-edit="galleryLabel"${sizeAttr(p.galleryLabelSize,'sectionLabel')}>${esc(p.galleryLabel)}</div>`:''}${p.galleryTitle?`<h2 data-edit="galleryTitle"${sizeAttr(p.galleryTitleSize,'sectionTitle')}>${esc(p.galleryTitle)}</h2>`:''}<div class="gallery ${esc(p.galleryStyle)}">${a.gallery.map((src,i)=>galleryFigure52(p,src,i,offsets)).join('')}</div>${galleryFooter(p,a.gallery.length)}</section>`:'',
    extra:a.extra?bannerHtml557(a.extra,p.bannerExtraMode,'','Banner extra'):'',
    extra2:a.extra2?bannerHtml557(a.extra2,p.bannerExtra2Mode,'','Banner extra 2'):'',
    message:p.mainMessage||p.closingSignature?`<section class="section reveal"><div class="section-label center">Con cariño</div>${p.mainMessage?`<div class="final-message" data-edit="mainMessage"${sizeAttr(p.mainMessageSize,'finalMessage')}>${esc(p.mainMessage).replace(/\n/g,'<br>')}</div>`:''}${p.showClosingSignature&&p.closingSignature?`<div class="closing-signature" data-edit="closingSignature"><span style="font-family:${signatureFont}">${esc(p.closingSignature).replace(/\n/g,'<br>')}</span></div>`:''}</section>`:'',
    video:p.videoUrl?`<section id="video" class="section reveal legacy-video-section">${auraVideo54(p,a)}</section>`:'',
    transfer:auraTransfer54(p,a)?`<section id="transferencia" class="section center reveal transfer-section">${auraTransfer54(p,a)}</section>`:''
  };
  const order=[['locations',p.orderLocations],['family',p.orderFamily],['confirm',p.orderConfirm],['countdown',p.orderCountdown],['gallery',p.orderGallery],['extra',p.orderBannerExtra],['extra2',p.orderBannerExtra2],['message',p.orderMessage],['video',p.orderVideo],['transfer',p.orderTransfer||10]].filter(x=>+x[1]>0&&parts[x[0]]).sort((a,b)=>+a[1]-+b[1]);
  return order.map(x=>parts[x[0]]).join('');
};

const _invitationCss564_map = invitationCss;
invitationCss=function(p,t,a){
  return _invitationCss564_map(p,t,a)+`
.aura-location-card .map-toggle{margin-top:16px;padding-left:0}
.aura-location-card .map-disclosure{margin-top:16px}
.aura-location-card .map-external{margin-top:12px}
.aura-location-card.aura-map-mode-visible .map-disclosure,.aura-location-card.aura-map-mode-hidden .map-disclosure{display:block}
#aura-map-display-hint{margin-top:6px;display:block}
`;
};

function injectMapDisplayControl564(){
  const host=document.querySelector('#sec-ubicaciones .section-body');
  if(!host||document.getElementById('mapDisplayMode'))return;
  const wrap=document.createElement('div');
  wrap.className='field-grid';
  wrap.innerHTML=`<label>Modo del mapa<select id="mapDisplayMode"><option value="toggle" selected>Desplegable (limpio)</option><option value="visible">Visible siempre</option><option value="hidden">Solo nombre del lugar</option></select><small id="aura-map-display-hint" class="field-hint">En “Desplegable” solo se ve el nombre del lugar y el mapa aparece al tocar “Ver mapa”.</small></label>`;
  const checkRow=host.querySelector('.check-row');
  if(checkRow)checkRow.insertAdjacentElement('afterend',wrap); else host.prepend(wrap);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectMapDisplayControl564);else injectMapDisplayControl564();

const _configObject564_night=configObject;
configObject=function(p){
  const c=_configObject564_night(p);
  c.schemaVersion=5.64;
  c.studioVersion='5.6.4';
  return c;
};

/* Objetivo nuevo de exportación: alrededor de 500 KB por foto.
   Las imágenes pequeñas se respetan; las grandes se reducen con más fuerza. */
const ZIP_IMAGE_TARGET_BYTES_500=Math.round(500*1024);
const ZIP_IMAGE_MAX_BYTES_500=Math.round(550*1024);
const ZIP_IMAGE_MIN_BYTES_500=Math.round(430*1024);

async function bestQualityBlob500(canvas,mime){
  let low=.34,high=.96,best=null,bestDelta=Infinity;
  for(let i=0;i<10;i++){
    const q=(low+high)/2,blob=await canvasBlob(canvas,mime,q),size=blob.size;
    if(size<=ZIP_IMAGE_MAX_BYTES_500){
      const delta=Math.abs(size-ZIP_IMAGE_TARGET_BYTES_500);
      if(delta<bestDelta){best=blob;bestDelta=delta}
      low=q;
    }else high=q;
  }
  if(!best){
    const blob=await canvasBlob(canvas,mime,.30);
    if(blob.size<=ZIP_IMAGE_MAX_BYTES_500)best=blob; else return blob;
  }
  return best;
}

optimizeImageForZip=async function(file){
  if(!file)return null;
  const sourceExt=zipImageSourceExt(file),kind=zipImageOutputType(file);
  if(kind.keep||file.size<=ZIP_IMAGE_MAX_BYTES_500)return {blob:file,ext:sourceExt,optimized:false,sourceSize:file.size,finalSize:file.size};
  let decoded;
  try{
    decoded=await decodeImageForZip(file);
    let width=decoded.width,height=decoded.height;
    const maxSide=Math.max(width,height);
    if(maxSide>3000){const scale=3000/maxSide;width=Math.round(width*scale);height=Math.round(height*scale)}
    let blob=null;
    for(let pass=0;pass<8;pass++){
      const canvas=drawZipCanvas(decoded,width,height,kind.mime);
      blob=kind.quality?await bestQualityBlob500(canvas,kind.mime):await canvasBlob(canvas,kind.mime);
      canvas.width=1;canvas.height=1;
      if(blob.size<=ZIP_IMAGE_MAX_BYTES_500)break;
      const ratio=Math.sqrt(ZIP_IMAGE_TARGET_BYTES_500/blob.size);
      const scale=Math.max(.54,Math.min(.88,ratio*.96));
      width=Math.max(260,Math.round(width*scale));height=Math.max(260,Math.round(height*scale));
    }
    if(blob&&!kind.quality&&blob.size<ZIP_IMAGE_MIN_BYTES_500&&file.size>ZIP_IMAGE_MAX_BYTES_500){
      for(let tune=0;tune<3;tune++){
        const grow=Math.min(1.12,Math.sqrt(ZIP_IMAGE_TARGET_BYTES_500/blob.size)*.99);
        const nextWidth=Math.min(decoded.width,Math.max(width+1,Math.round(width*grow)));
        const nextHeight=Math.min(decoded.height,Math.max(height+1,Math.round(height*grow)));
        if(nextWidth===width&&nextHeight===height)break;
        const canvas=drawZipCanvas(decoded,nextWidth,nextHeight,kind.mime),candidate=await canvasBlob(canvas,kind.mime);canvas.width=1;canvas.height=1;
        if(candidate.size>ZIP_IMAGE_MAX_BYTES_500)break;
        blob=candidate;width=nextWidth;height=nextHeight;
        if(blob.size>=ZIP_IMAGE_MIN_BYTES_500)break;
      }
    }
    if(!blob||blob.size>ZIP_IMAGE_MAX_BYTES_500){
      return {blob:file,ext:sourceExt,optimized:false,sourceSize:file.size,finalSize:file.size};
    }
    return {blob,ext:kind.ext,optimized:true,sourceSize:file.size,finalSize:blob.size};
  }catch(e){
    console.warn('Aura Digital: no se pudo optimizar',file.name,e);
    return {blob:file,ext:sourceExt,optimized:false,sourceSize:file.size,finalSize:file.size};
  }finally{decoded?.close?.()}
};

/* =======================================================================
   AURA DIGITAL · v5.6.8 · GITHUB PUBLISH · CACHE BUSTING
   - No guarda la credencial: vive únicamente en memoria/DOM durante la sesión.
   - Publica el mismo paquete que "Generar ZIP" mediante Git Data API.
   - Evita el límite de 100 archivos de la subida manual desde github.com.
   ======================================================================= */

const AURA_GITHUB_API='https://api.github.com';
const AURA_GITHUB_API_VERSION='2026-03-10';
const auraGithubState={token:'',user:null,repo:null,busy:false};

class AuraGithubError extends Error{
  constructor(message,status=0,data=null){super(message);this.name='AuraGithubError';this.status=status;this.data=data}
}

function auraGithubSlug(value){
  return String(value||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9._-]+/g,'-')
    .replace(/-+/g,'-').replace(/^[-._]+|[-._]+$/g,'').slice(0,90);
}
function auraGithubDefaultRepo(){
  const title=$('title')?.value||'invitacion-aura';
  return auraGithubSlug(title)||'invitacion-aura';
}
function auraGithubSetStatus(text,type=''){
  const el=$('githubAuthStatus');if(!el)return;el.textContent=text||'';el.className='github-status'+(type?` ${type}`:'');
}
function auraGithubSetPublishStatus(text,type=''){
  const el=$('githubPublishStatus');if(!el)return;el.textContent=text||'';el.className='github-publish-status'+(type?` ${type}`:'');
}
function auraGithubProgress(percent,text){
  const box=$('githubProgress'),bar=$('githubProgressBar');
  if(box)box.hidden=false;if(bar)bar.style.width=`${Math.max(0,Math.min(100,Number(percent)||0))}%`;
  if(text)auraGithubSetPublishStatus(text);
}
function auraGithubResetLink(){
  const wrap=$('githubPagesActions'),a=$('githubPagesLink'),input=$('githubPagesUrl'),status=$('githubCopyStatus');
  if(wrap)wrap.hidden=true;
  if(a){a.removeAttribute('href');a.textContent='Abrir invitación publicada ↗'}
  if(input)input.value='';
  if(status){status.textContent='';status.className='github-copy-status'}
}
function auraGithubDelay(ms){return new Promise(r=>setTimeout(r,ms))}

async function auraGithubRequest(path,{method='GET',body=null,token=null}={}){
  const auth=token||auraGithubState.token||$('githubToken')?.value.trim();
  if(!auth)throw new AuraGithubError('Falta conectar GitHub.',401);
  const headers={
    'Accept':'application/vnd.github+json',
    'Authorization':`Bearer ${auth}`,
    'X-GitHub-Api-Version':AURA_GITHUB_API_VERSION
  };
  if(body!==null)headers['Content-Type']='application/json';
  let response;
  try{response=await fetch(`${AURA_GITHUB_API}${path}`,{method,headers,body:body===null?undefined:JSON.stringify(body),cache:'no-store'})}
  catch(err){throw new AuraGithubError('No se pudo conectar con la API de GitHub. Revisa tu conexión.',0,err)}
  const raw=await response.text();let data=null;
  if(raw){try{data=JSON.parse(raw)}catch(e){data=raw}}
  if(!response.ok){
    const detail=(data&&typeof data==='object'&&(data.message||data.error))||'';
    throw new AuraGithubError(detail||`GitHub respondió ${response.status}.`,response.status,data);
  }
  return data;
}

async function auraGithubConnect(){
  const input=$('githubToken'),button=$('githubConnect'),publish=$('githubPublish');
  const token=String(input?.value||'').trim();
  if(!token){auraGithubSetStatus('Pega primero tu token.','error');return}
  const old=button?.textContent;if(button){button.disabled=true;button.textContent='Conectando…'}
  auraGithubResetLink();auraGithubSetStatus('Verificando cuenta…');
  try{
    const user=await auraGithubRequest('/user',{token});
    auraGithubState.token=token;auraGithubState.user=user;auraGithubState.repo=null;
    auraGithubSetStatus(`Conectado como @${user.login}`,'ok');
    if($('githubRepo')&&!$('githubRepo').value.trim())$('githubRepo').value=auraGithubDefaultRepo();
    if(publish)publish.disabled=false;
    const loadRepos=$('githubLoadRepos'),repoSearch=$('githubRepoSearch');if(loadRepos)loadRepos.disabled=false;if(repoSearch)repoSearch.disabled=false;
  }catch(err){
    auraGithubState.token='';auraGithubState.user=null;if(publish)publish.disabled=true;
    const loadRepos=$('githubLoadRepos'),repoSearch=$('githubRepoSearch');if(loadRepos)loadRepos.disabled=true;if(repoSearch)repoSearch.disabled=true;
    auraGithubSetStatus(err.status===401?'Token inválido o sin acceso.':err.message,'error');
  }finally{if(button){button.disabled=false;button.textContent=old}}
}

function auraBytesToBase64(bytes){
  let out='';const chunk=0x8000;
  for(let i=0;i<bytes.length;i+=chunk)out+=String.fromCharCode(...bytes.subarray(i,i+chunk));
  return btoa(out);
}
async function auraBlobToBase64(blob){return auraBytesToBase64(new Uint8Array(await blob.arrayBuffer()))}
function auraTextToBase64(text){return auraBytesToBase64(new TextEncoder().encode(String(text??'')))}

async function auraGithubBuildFiles(onProgress){
  await resolveAllMapUrls();
  const p=getFormParams();
  const prepared=await prepareZipImages(p,(n,total)=>onProgress?.(n,total));
  const a=zipAssets(p);
  if(p.portadaFile)a.cover=prepared.cover||'';
  if(p.bannerFile)a.banner=prepared.banner||'';
  if(p.bannerExtraFile)a.extra=prepared.extra||'';
  if(p.bannerExtra2File)a.extra2=prepared.extra2||'';
  if(p.bgFile)a.bg=prepared.bg||'';
  if(p.videoPosterFile)a.poster=prepared.poster||'';
  if(p.transferPhotoFile)a.transferPhoto=prepared.transferPhoto||'';
  a.gallery=prepared.gallery.filter(Boolean);

  // Cache busting solo para la publicación web. Los archivos físicos conservan
  // sus nombres de siempre; el HTML agrega ?v=<publicación> a los assets que
  // pueden cambiar para obligar al navegador a solicitar la versión nueva.
  const publishVersion=Date.now().toString(36);
  const versionAsset=src=>src?`${src}${src.includes('?')?'&':'?'}v=${publishVersion}`:'';
  const publishedAssets={...a};
  for(const key of ['cover','banner','extra','extra2','bg','poster','transferPhoto','music']){
    if(publishedAssets[key])publishedAssets[key]=versionAsset(publishedAssets[key]);
  }
  publishedAssets.gallery=(a.gallery||[]).map(versionAsset);

  let publishedHtml=buildInvitation(p,publishedAssets);
  // Ayuda adicional para que el documento se revalide. GitHub Pages puede
  // seguir teniendo su propio caché/CDN, pero una vez llegue este index nuevo,
  // todos los assets variables se solicitan con una URL nueva.
  publishedHtml=publishedHtml.replace('<head>',`<head><meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="0"><meta name="aura-publication-version" content="${publishVersion}">`);

  const files=[
    {path:'index.html',encoding:'text',content:publishedHtml},
    {path:'config.json',encoding:'text',content:JSON.stringify(configObject(p),null,2)},
    {path:'.nojekyll',encoding:'text',content:''}
  ];
  const records=fontRecords(p,THEMES[p.themeVisual]||THEMES.editorial_cream);
  for(const r of records)files.push({path:a.fontBase+r.name,encoding:'base64',content:r.data});
  if(typeof AURA_FONT_LICENSES!=='undefined'){
    for(const family of new Set(records.map(r=>r.family))){
      const license=AURA_FONT_LICENSES[family];if(license)files.push({path:a.fontBase+family.replace(/ /g,'-')+'-LICENSE.txt',encoding:'text',content:license});
    }
  }
  for(const entry of prepared.files)files.push({path:`assets/${entry.name}`,encoding:'blob',content:entry.blob});
  if(p.musicFile)files.push({path:`assets/musica${fileExt(p.musicFile.name)}`,encoding:'blob',content:p.musicFile});
  return {p,files};
}

async function auraGithubEnsureRepo(name){
  const owner=auraGithubState.user?.login;if(!owner)throw new AuraGithubError('Conecta GitHub primero.',401);
  const path=`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
  try{
    const repo=await auraGithubRequest(path);
    if(repo.private)throw new AuraGithubError('Este repositorio es privado. Para una invitación pública usa un repositorio público.',409,repo);
    return {repo,created:false};
  }catch(err){
    if(err.status!==404)throw err;
    const repo=await auraGithubRequest('/user/repos',{method:'POST',body:{name,description:'Invitación publicada desde Aura Digital',private:false,auto_init:true,has_issues:false,has_projects:false,has_wiki:false}});
    return {repo,created:true};
  }
}

async function auraGithubWaitForRef(owner,repo,branch){
  let last;
  for(let i=0;i<7;i++){
    try{return await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/ref/heads/${encodeURIComponent(branch)}`)}
    catch(err){last=err;if(err.status!==404)throw err;await auraGithubDelay(450+(i*220))}
  }
  throw last||new AuraGithubError('GitHub todavía no creó la rama del repositorio.');
}

async function auraGithubMapLimit(items,limit,fn){
  const results=new Array(items.length);let next=0;
  async function worker(){while(true){const i=next++;if(i>=items.length)return;results[i]=await fn(items[i],i)}}
  await Promise.all(Array.from({length:Math.min(limit,items.length)},worker));return results;
}

async function auraGithubFileBase64(file){
  if(file.encoding==='base64')return String(file.content||'').replace(/\s+/g,'');
  if(file.encoding==='blob'){
    const size=Number(file.content?.size||0);
    if(size>95*1024*1024)throw new AuraGithubError(`El archivo ${file.path} supera el tamaño seguro para GitHub.`);
    return auraBlobToBase64(file.content);
  }
  return auraTextToBase64(file.content);
}

async function auraGithubPublishTree(owner,repo,branch,files,onProgress){
  const ref=await auraGithubWaitForRef(owner,repo,branch);
  const parentSha=ref?.object?.sha;if(!parentSha)throw new AuraGithubError('No pude leer la rama principal del repositorio.');
  let done=0;
  const tree=await auraGithubMapLimit(files,4,async file=>{
    const content=await auraGithubFileBase64(file);
    const blob=await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/blobs`,{method:'POST',body:{content,encoding:'base64'}});
    done++;onProgress?.(done,files.length,file.path);
    return {path:file.path,mode:'100644',type:'blob',sha:blob.sha};
  });
  // Sin base_tree: el repositorio dedicado refleja exactamente la invitación actual.
  const newTree=await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees`,{method:'POST',body:{tree}});
  const commit=await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/commits`,{method:'POST',body:{message:`Publicar invitación desde Aura Digital · ${new Date().toISOString()}`,tree:newTree.sha,parents:[parentSha]}});
  await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/refs/heads/${encodeURIComponent(branch)}`,{method:'PATCH',body:{sha:commit.sha,force:false}});
  return commit;
}

async function auraGithubEnablePages(owner,repo,branch){
  const pagesPath=`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pages`;
  let existing=null;
  try{existing=await auraGithubRequest(pagesPath)}catch(err){if(err.status!==404)throw err}
  if(existing){
    await auraGithubRequest(pagesPath,{method:'PUT',body:{source:{branch,path:'/'}}});
  }else{
    let last;
    for(let i=0;i<4;i++){
      try{return await auraGithubRequest(pagesPath,{method:'POST',body:{source:{branch,path:'/'}}})}
      catch(err){last=err;if(![409,422].includes(err.status)||i===3)throw err;await auraGithubDelay(850+(i*500))}
    }
    if(last)throw last;
  }
  try{return await auraGithubRequest(pagesPath)}catch(e){return existing}
}

function auraGithubFriendlyError(err){
  if(err.status===401)return 'GitHub rechazó la credencial. Vuelve a conectar.';
  if(err.status===403)return 'Faltan permisos. El token necesita escritura en Contents, Administration y Pages.';
  if(err.status===404)return 'GitHub no encontró el recurso o el token no tiene acceso.';
  if(err.status===409)return err.message||'GitHub reportó un conflicto con el repositorio.';
  if(err.status===422)return 'GitHub rechazó la operación. Revisa nombre del repo y permisos de Pages.';
  return err.message||'No se pudo publicar en GitHub.';
}

async function auraGithubPublish(){
  if(auraGithubState.busy)return;
  if(!auraGithubState.user||!auraGithubState.token){await auraGithubConnect();if(!auraGithubState.user)return}
  const repoInput=$('githubRepo'),button=$('githubPublish');
  const repoName=auraGithubSlug(repoInput?.value||auraGithubDefaultRepo());
  if(!repoName){auraGithubSetPublishStatus('Escribe un nombre válido para el repositorio.','error');return}
  if(repoInput)repoInput.value=repoName;
  auraGithubState.busy=true;auraGithubResetLink();if(button){button.disabled=true;button.textContent='Publicando…'}
  try{
    auraGithubProgress(2,'Preparando invitación…');
    const bundle=await auraGithubBuildFiles((n,total)=>auraGithubProgress(2+Math.round((n/Math.max(total,1))*18),`Optimizando fotos ${n}/${total}…`));
    auraGithubProgress(22,'Revisando repositorio…');
    const {repo,created}=await auraGithubEnsureRepo(repoName);auraGithubState.repo=repo;
    const owner=auraGithubState.user.login,branch=repo.default_branch||'main';
    auraGithubProgress(28,created?'Repositorio creado. Subiendo archivos…':'Repositorio encontrado. Actualizando archivos…');
    await auraGithubPublishTree(owner,repoName,branch,bundle.files,(n,total,path)=>{
      const pct=28+Math.round((n/Math.max(total,1))*57);auraGithubProgress(pct,`Subiendo ${n}/${total} · ${path}`);
    });
    auraGithubProgress(90,'Configurando GitHub Pages…');
    const pages=await auraGithubEnablePages(owner,repoName,branch);
    const fallback=repoName.toLowerCase()===`${owner.toLowerCase()}.github.io`?`https://${owner}.github.io/`:`https://${owner}.github.io/${repoName}/`;
    const url=pages?.html_url||fallback;
    const wrap=$('githubPagesActions'),link=$('githubPagesLink'),urlInput=$('githubPagesUrl');
    if(link){link.href=url;link.textContent='Abrir invitación publicada ↗'}
    if(urlInput)urlInput.value=url;
    if(wrap)wrap.hidden=false
    auraGithubProgress(100,created?'Invitación publicada. GitHub Pages puede tardar un momento en terminar el primer build.':'Publicación actualizada correctamente.');
    if(button)button.textContent='Actualizar publicación';
  }catch(err){
    console.error('Aura GitHub publish',err);auraGithubSetPublishStatus(auraGithubFriendlyError(err),'error');
    const box=$('githubProgress');if(box)box.hidden=true;
    if(err.status===401){auraGithubState.token='';auraGithubState.user=null;auraGithubSetStatus('Sesión de GitHub vencida.','error')}
  }finally{
    auraGithubState.busy=false;if(button){button.disabled=!auraGithubState.user;if(button.textContent==='Publicando…')button.textContent='Publicar invitación'}
  }
}


async function auraGithubCopyPagesLink(){
  const input=$('githubPagesUrl'),link=$('githubPagesLink'),button=$('githubCopyLink'),status=$('githubCopyStatus');
  const url=String(input?.value||link?.getAttribute('href')||'').trim();
  if(!url){
    if(status){status.textContent='Publica la invitación primero para obtener el enlace.';status.className='github-copy-status error'}
    return;
  }
  let copied=false;
  try{
    if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);copied=true}
  }catch(e){}
  if(!copied){
    try{
      const ta=document.createElement('textarea');
      ta.value=url;ta.setAttribute('readonly','');
      ta.style.position='fixed';ta.style.opacity='0';ta.style.pointerEvents='none';ta.style.left='-9999px';
      document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,ta.value.length);
      copied=document.execCommand('copy');ta.remove();
    }catch(e){copied=false}
  }
  if(copied){
    if(status){status.textContent='Enlace copiado.';status.className='github-copy-status ok'}
    if(button){const prev=button.textContent;button.textContent='Copiado ✓';setTimeout(()=>{if(button.textContent==='Copiado ✓')button.textContent=prev},1400)}
  }else{
    if(input){input.focus();input.select()}
    if(status){status.textContent='No se pudo copiar automáticamente. El enlace quedó seleccionado para copiarlo manualmente.';status.className='github-copy-status error'}
  }
}


function auraGithubSetRepoStatus(text,type=''){
  const el=$('githubRepoStatus');if(!el)return;el.textContent=text||'';el.className='github-publish-status'+(type?` ${type}`:'');
}
function auraGithubEscapeText(value){return String(value??'')}
async function auraGithubListAllRepos(){
  if(!auraGithubState.user||!auraGithubState.token){await auraGithubConnect();if(!auraGithubState.user)return []}
  const button=$('githubLoadRepos');
  if(button){button.disabled=true;button.textContent='Cargando…'}
  auraGithubSetRepoStatus('Leyendo repositorios de GitHub…');
  try{
    const repos=[];const perPage=100;let page=1;
    while(page<=50){
      const batch=await auraGithubRequest(`/user/repos?per_page=${perPage}&page=${page}&sort=updated&direction=desc&affiliation=owner,collaborator,organization_member`);
      if(!Array.isArray(batch))break;
      repos.push(...batch);
      if(batch.length<perPage)break;
      page++;
    }
    auraGithubState.repos=repos;
    auraGithubRenderRepos();
    auraGithubSetRepoStatus(`${repos.length} repositorio${repos.length===1?'':'s'} disponible${repos.length===1?'':'s'}.`,'ok');
    return repos;
  }catch(err){
    console.error('Aura GitHub repos',err);auraGithubSetRepoStatus(auraGithubFriendlyError(err),'error');return [];
  }finally{
    if(button){button.disabled=!auraGithubState.user;button.textContent='Actualizar lista'}
  }
}
function auraGithubRenderRepos(){
  const box=$('githubRepoList'),search=$('githubRepoSearch');if(!box)return;
  const q=String(search?.value||'').trim().toLowerCase();
  const repos=(auraGithubState.repos||[]).filter(repo=>{
    const hay=`${repo.full_name||''} ${repo.description||''}`.toLowerCase();return !q||hay.includes(q);
  });
  box.textContent='';box.hidden=false;
  if(!repos.length){
    const empty=document.createElement('p');empty.className='github-repo-empty';empty.textContent=q?'No hay repositorios que coincidan con la búsqueda.':'No hay repositorios disponibles para este token.';box.appendChild(empty);return;
  }
  for(const repo of repos){
    const row=document.createElement('div');row.className='github-repo-item';
    const info=document.createElement('div');info.className='github-repo-info';
    const name=document.createElement('strong');name.textContent=repo.full_name||repo.name||'Repositorio';
    const meta=document.createElement('span');meta.textContent=`${repo.private?'Privado':'Público'}${repo.archived?' · Archivado':''}${repo.fork?' · Fork':''}`;
    info.append(name,meta);
    const actions=document.createElement('div');actions.className='github-repo-actions';
    const preview=document.createElement('button');preview.type='button';preview.className='btn github-preview-btn';
    if(repo.has_pages){preview.textContent='Vista previa';preview.addEventListener('click',()=>auraGithubOpenRepoPreview(repo,preview))}
    else{preview.textContent='Sin Pages';preview.disabled=true;preview.title='Este repositorio no tiene GitHub Pages activo.'}
    const del=document.createElement('button');del.type='button';del.className='btn github-delete-btn';del.textContent='Eliminar';
    if(repo.permissions&&repo.permissions.admin===false){del.disabled=true;del.textContent='Sin permiso';del.title='GitHub no reporta permiso de administración para este repositorio.'}
    else del.addEventListener('click',()=>auraGithubDeleteRepo(repo,del));
    actions.append(preview,del);row.append(info,actions);box.appendChild(row);
  }
}
async function auraGithubDeleteRepo(repo,button){
  if(!repo?.full_name)return;
  const expected=repo.full_name;
  const typed=window.prompt(`Vas a eliminar DEFINITIVAMENTE ${expected}.\n\nTambién dejará de funcionar cualquier GitHub Pages publicado desde ese repositorio.\n\nPara confirmar, escribe exactamente:\n${expected}`,'');
  if(typed===null)return;
  if(String(typed).trim()!==expected){auraGithubSetRepoStatus('No se eliminó: el nombre escrito no coincide.','error');return}
  const original=button?.textContent;if(button){button.disabled=true;button.textContent='Eliminando…'}
  auraGithubSetRepoStatus(`Eliminando ${expected}…`);
  try{
    await auraGithubRequest(`/repos/${encodeURIComponent(repo.owner?.login||expected.split('/')[0])}/${encodeURIComponent(repo.name||expected.split('/').slice(1).join('/'))}`,{method:'DELETE'});
    auraGithubState.repos=(auraGithubState.repos||[]).filter(r=>r.id!==repo.id);
    auraGithubRenderRepos();
    auraGithubSetRepoStatus(`${expected} fue eliminado definitivamente.`,'ok');
    if(auraGithubState.repo?.full_name===expected){auraGithubState.repo=null;auraGithubResetLink()}
  }catch(err){
    console.error('Aura GitHub delete',err);
    auraGithubSetRepoStatus(err.status===403?'GitHub no permitió borrarlo. Ese token necesita Administration: Read and write sobre ese repositorio.':auraGithubFriendlyError(err),'error');
    if(button){button.disabled=false;button.textContent=original||'Eliminar'}
  }
}

function initAuraGithubPublisher(){
  const open=$('open-github'),section=$('sec-github'),connect=$('githubConnect'),publish=$('githubPublish'),token=$('githubToken'),repo=$('githubRepo'),loadRepos=$('githubLoadRepos'),repoSearch=$('githubRepoSearch');
  if(open&&section)open.addEventListener('click',()=>{section.open=true;section.classList.remove('editor-filtered');section.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>token?.focus(),350)});
  connect?.addEventListener('click',()=>auraGithubConnect());
  publish?.addEventListener('click',()=>auraGithubPublish());
  $('githubCopyLink')?.addEventListener('click',()=>auraGithubCopyPagesLink());
  loadRepos?.addEventListener('click',()=>auraGithubListAllRepos());
  repoSearch?.addEventListener('input',()=>auraGithubRenderRepos());
  token?.addEventListener('input',()=>{if(auraGithubState.token&&token.value.trim()!==auraGithubState.token){auraGithubState.token='';auraGithubState.user=null;auraGithubState.repos=[];auraGithubSetStatus('Vuelve a conectar después de cambiar el token.');if(publish)publish.disabled=true;if(loadRepos)loadRepos.disabled=true;if(repoSearch)repoSearch.disabled=true;const list=$('githubRepoList');if(list){list.hidden=true;list.textContent=''}}});
  repo?.addEventListener('blur',()=>{if(repo.value)repo.value=auraGithubSlug(repo.value)});
  if(repo&&!repo.value)repo.value=auraGithubDefaultRepo();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAuraGithubPublisher);else initAuraGithubPublisher();

// La publicación GitHub no altera el esquema de la invitación; solo identifica el Studio actual.
const _configObject566=configObject;
configObject=function(p){const c=_configObject566(p);c.studioVersion='5.6.9';return c};


/* =========================
   Aura Digital 5.6.10 · corrección de opacidades
   - Opacidad botón gobierna Entrar, navegación de portada y CTA.
   - Opacidad contenido puede llegar realmente a 0 en los módulos que usan la tarjeta del tema.
   ========================= */
function opacityControlsCss5610(p){
  const b=bounded(p.buttonOpacity,.92,0,1);
  let enterBg=rgba(p.primaryColor,b),enterBorder=rgba(p.primaryColor,.82);
  if(p.buttonStyle==='glass_soft'){enterBg=rgba(p.bgContentColor,b);enterBorder=rgba(p.heroTextColor||'#ffffff',.36)}
  if(p.buttonStyle==='outline_thin'||p.buttonStyle==='text_only')enterBg='transparent';
  const navBg=rgba(p.bgContentColor,b),navHover=rgba(p.bgContentColor,Math.min(1,b+.08));
  return `
/* El slider de opacidad manda al final de la cascada. */
.hero .aura-global-nav .aura-quick-action{background:${navBg}!important}
.hero .aura-global-nav .aura-quick-action:hover{background:${navHover}!important}
.hero .aura-enter,.rsvp .cta{background:${enterBg}!important}
.hero .aura-enter{border-color:${enterBorder}!important}
${p.buttonStyle==='outline_thin'?'.hero .aura-enter,.rsvp .cta{background:transparent!important}':''}
${p.buttonStyle==='text_only'?'.hero .aura-enter,.rsvp .cta{background:transparent!important;border-left:0!important;border-right:0!important;border-top:0!important}':''}
`;
}
const _invitationCss5610=invitationCss;
invitationCss=function(p,t,a){return _invitationCss5610(p,t,a)+opacityControlsCss5610(p)};

const _configObject5610=configObject;
configObject=function(p){const c=_configObject5610(p);c.studioVersion='5.6.10';return c};


/* =========================
   Aura Digital 5.6.11 · Sistema premium global de botones de portada
   - 5 modelos visuales opcionales para todos los temas/portadas.
   - Color por paleta o personalizado, opacidad existente, tamaño, forma e icono.
   - Original por defecto para no alterar diseños existentes.
   ========================= */
const _getFormParams5611=getFormParams;
getFormParams=function(){
  const p=_getFormParams5611();
  p.heroButtonModel=$('heroButtonModel')?.value||'original';
  p.heroButtonSize=$('heroButtonSize')?.value||'medium';
  p.heroButtonShape=$('heroButtonShape')?.value||'auto';
  p.heroButtonIcon=$('heroButtonIcon')?.value||'auto';
  p.heroButtonColor=$('heroButtonColor')?.value||p.primaryColor||'#a88a58';
  p.heroButtonUsePalette=$('heroButtonUsePalette')?.checked??true;
  return p;
};

function auraPremiumIcon5611(name){
  const icons={
    sparkle:`<svg class="aura-premium-main-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8c.7 5.2 3.1 7.6 8.2 8.2-5.1.7-7.5 3.1-8.2 8.2-.7-5.1-3.1-7.5-8.2-8.2 5.1-.6 7.5-3 8.2-8.2Z"/><path d="M19 2.8c.2 1.7 1 2.5 2.7 2.7-1.7.2-2.5 1-2.7 2.7-.2-1.7-1-2.5-2.7-2.7 1.7-.2 2.5-1 2.7-2.7Z"/></svg>`,
    heart:`<svg class="aura-premium-main-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 5.8c-2-2-5.2-1.9-7.1.2L12 7.5 10.6 6C8.7 3.9 5.5 3.8 3.5 5.8c-2.1 2.1-2 5.5.1 7.5L12 21l8.4-7.7c2.1-2 2.2-5.4.1-7.5Z"/></svg>`,
    diamond:`<svg class="aura-premium-main-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m4 9 3.4-5h9.2L20 9l-8 11L4 9Z"/><path d="M4 9h16M7.4 4 12 20 16.6 4M9.2 9 12 4l2.8 5"/></svg>`,
    leaf:`<svg class="aura-premium-main-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20c3.8-6.6 8.7-11.1 14.5-15.1M7.3 16.4C4.4 13.8 4.1 10.8 5 8c3.2.1 5.4 1.3 6.4 3.3M12.4 10.1c-.2-3.8 1.5-6.1 4.4-7.1 1.7 2.8 1.7 5.4.1 7.8"/></svg>`,
    star:`<svg class="aura-premium-main-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.4 6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.9L12 3Z"/></svg>`,
    arrow:`<svg class="aura-premium-main-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 7l5 5-5 5"/></svg>`
  };
  return icons[name]||icons.sparkle;
}
function auraPremiumDefaultIcon5611(model){return({crystal_pill:'sparkle',editorial_frame:'arrow',jewel_badge:'diamond',minimal_label:'leaf',premium_icons:'sparkle'})[model]||'sparkle'}

const _coverHtml5611=coverHtml;
coverHtml=function(params){
  const p={...COVER_DEFAULTS,...params};
  let html=_coverHtml5611(params);
  if((p.heroButtonModel||'original')==='original')return html;
  try{
    const tpl=document.createElement('template');tpl.innerHTML=html.trim();
    const hero=tpl.content.firstElementChild;if(!hero)return html;
    hero.classList.add('aura-premium-buttons','aura-premium-'+p.heroButtonModel);
    hero.dataset.premiumButtonModel=p.heroButtonModel;
    const enter=hero.querySelector('[data-enter]');
    if(enter){
      const icon=p.heroButtonIcon==='auto'?auraPremiumDefaultIcon5611(p.heroButtonModel):p.heroButtonIcon;
      const label=esc(p.buttonText||'Ver invitación');
      enter.innerHTML=`<span class="aura-premium-icon-shell">${auraPremiumIcon5611(icon)}</span><span class="aura-premium-label">${label}</span><span class="aura-premium-arrow" aria-hidden="true">→</span>`;
      enter.classList.add('aura-premium-primary');
    }
    hero.querySelectorAll('.aura-global-nav .aura-quick-action').forEach(a=>a.classList.add('aura-premium-secondary'));
    return hero.outerHTML;
  }catch(_){return html}
};

function auraHexMix5611(hex,target,amount){
  const norm=h=>{h=String(h||'').replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return /^[0-9a-f]{6}$/i.test(h)?h:'a88a58'};
  const a=norm(hex),b=norm(target),t=Math.max(0,Math.min(1,Number(amount)||0));
  const out=[0,2,4].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
  return '#'+out;
}
function auraContrast5611(hex){
  const h=String(hex||'#000').replace('#','');const n=h.length===3?h.split('').map(c=>c+c).join(''):h;
  if(!/^[0-9a-f]{6}$/i.test(n))return '#ffffff';
  const rgb=[0,2,4].map(i=>parseInt(n.slice(i,i+2),16)/255).map(c=>c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4));
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]>.42?'#261f1b':'#fffaf6';
}
function premiumCoverButtonsCss5611(p){
  const model=p.heroButtonModel||'original';if(model==='original')return'';
  const base=p.heroButtonUsePalette!==false?(p.primaryColor||'#a88a58'):(p.heroButtonColor||p.primaryColor||'#a88a58');
  const light=auraHexMix5611(base,'#ffffff',.38),pale=auraHexMix5611(base,'#ffffff',.72),dark=auraHexMix5611(base,'#000000',.30),deep=auraHexMix5611(base,'#000000',.48);
  const alpha=bounded(p.buttonOpacity,.92,0,1);
  const ink=auraContrast5611(base);
  const heroInk=p.heroTextColor||'#ffffff';
  const size={small:{h:40,icon:17,font:9.5,pad:14,max:300,card:64},medium:{h:48,icon:20,font:10.5,pad:18,max:360,card:76},large:{h:56,icon:23,font:11.5,pad:22,max:430,card:88}}[p.heroButtonSize]||{h:48,icon:20,font:10.5,pad:18,max:360,card:76};
  const shape=p.heroButtonShape||'auto';
  const shapeRule=shape==='pill'?'border-radius:999px!important':shape==='rounded'?'border-radius:14px!important':shape==='square'?'border-radius:2px!important':'';
  let primary='',secondary='',navLayout='';
  if(model==='crystal_pill'){
    primary=`background:linear-gradient(180deg,rgba(255,255,255,${Math.min(.32,alpha*.32)}),${rgba(base,alpha*.72)})!important;border:1px solid rgba(255,255,255,.60)!important;color:#fffaf6!important;border-radius:999px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.38),inset 0 -10px 24px ${rgba(dark,.13)},0 10px 28px rgba(0,0,0,.14)!important;-webkit-backdrop-filter:blur(16px) saturate(125%)!important;backdrop-filter:blur(16px) saturate(125%)!important`;
    secondary=`background:linear-gradient(180deg,rgba(255,255,255,${Math.min(.24,alpha*.28)}),${rgba(base,alpha*.56)})!important;border:1px solid rgba(255,255,255,.48)!important;color:#fffaf6!important;border-radius:999px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 7px 20px rgba(0,0,0,.10)!important;-webkit-backdrop-filter:blur(15px) saturate(120%)!important;backdrop-filter:blur(15px) saturate(120%)!important`;
    navLayout='grid-template-columns:1fr!important';
  }else if(model==='editorial_frame'){
    primary=`background:${rgba(base,alpha*.12)}!important;border:1px solid ${rgba(light,.90)}!important;color:${heroInk}!important;border-radius:8px!important;box-shadow:inset 0 0 0 3px rgba(255,255,255,.10),0 8px 24px rgba(0,0,0,.08)!important;outline:1px solid ${rgba(base,.36)}!important;outline-offset:3px!important;-webkit-backdrop-filter:blur(9px)!important;backdrop-filter:blur(9px)!important`;
    secondary=`background:${rgba(base,alpha*.10)}!important;border:1px solid ${rgba(light,.78)}!important;color:${heroInk}!important;border-radius:7px!important;box-shadow:inset 0 0 0 2px rgba(255,255,255,.08)!important;outline:1px solid ${rgba(base,.28)}!important;outline-offset:2px!important`;
    navLayout='grid-template-columns:1fr!important';
  }else if(model==='jewel_badge'){
    primary=`background:linear-gradient(180deg,${rgba(light,Math.min(1,alpha*.42))} 0%,${rgba(base,alpha)} 22%,${rgba(dark,alpha)} 72%,${rgba(deep,alpha)} 100%)!important;border:1px solid ${rgba(pale,.88)}!important;color:${ink}!important;border-radius:999px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.44),inset 0 -9px 18px rgba(0,0,0,.24),0 9px 25px rgba(0,0,0,.17),0 0 0 2px ${rgba(dark,.34)}!important`;
    secondary=`background:linear-gradient(180deg,${rgba(light,Math.min(1,alpha*.34))},${rgba(base,alpha*.88)} 28%,${rgba(deep,alpha*.94)})!important;border:1px solid ${rgba(pale,.74)}!important;color:${ink}!important;border-radius:999px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.34),inset 0 -7px 15px rgba(0,0,0,.20),0 7px 18px rgba(0,0,0,.13)!important`;
    navLayout='grid-template-columns:1fr!important';
  }else if(model==='minimal_label'){
    primary=`background:${rgba(pale,Math.min(.96,.28+alpha*.62))}!important;border:1px solid ${rgba(base,.30)}!important;color:${auraContrast5611(pale)}!important;border-radius:18px!important;box-shadow:0 9px 24px ${rgba(dark,.10)}!important`;
    secondary=`background:${rgba(pale,Math.min(.92,.22+alpha*.56))}!important;border:1px solid ${rgba(base,.24)}!important;color:${auraContrast5611(pale)}!important;border-radius:16px!important;box-shadow:0 7px 18px ${rgba(dark,.08)}!important`;
    navLayout='grid-template-columns:1fr!important';
  }else{
    primary=`background:${rgba(pale,Math.min(.96,.30+alpha*.62))}!important;border:1px solid ${rgba(base,.28)}!important;color:${auraContrast5611(pale)}!important;border-radius:999px!important;box-shadow:0 10px 26px ${rgba(dark,.12)},inset 0 1px 0 rgba(255,255,255,.66)!important`;
    secondary=`background:${rgba(pale,Math.min(.94,.26+alpha*.60))}!important;border:1px solid ${rgba(base,.26)}!important;color:${auraContrast5611(pale)}!important;border-radius:18px!important;box-shadow:0 8px 20px ${rgba(dark,.10)},inset 0 1px 0 rgba(255,255,255,.60)!important`;
    navLayout='grid-template-columns:repeat(3,minmax(0,1fr))!important';
  }
  return `
/* Sistema premium de botones: capa final global para todas las portadas */
.hero.aura-premium-buttons .hero-inner{--aura-premium-base:${base};--aura-premium-light:${light};--aura-premium-dark:${dark}}
.hero.aura-premium-buttons.aura-premium-buttons .aura-premium-primary.aura-premium-primary{width:min(100%,${size.max}px)!important;min-height:${size.h}px!important;height:auto!important;margin:14px auto 0!important;padding:8px ${size.pad}px!important;display:grid!important;grid-template-columns:${size.icon+12}px minmax(0,1fr) ${size.icon}px!important;align-items:center!important;gap:10px!important;font:600 ${size.font}px/1.25 var(--body)!important;letter-spacing:.08em!important;text-transform:uppercase!important;text-decoration:none!important;white-space:normal!important;box-sizing:border-box!important;transform:none!important;${primary};${shapeRule}}
.hero.aura-premium-buttons.aura-premium-buttons .aura-premium-primary.aura-premium-primary .aura-premium-icon-shell{width:${size.icon+10}px!important;height:${size.icon+10}px!important;display:grid!important;place-items:center!important;border-radius:999px!important;background:rgba(255,255,255,.12)!important;border:1px solid currentColor!important;border-color:color-mix(in srgb,currentColor 26%,transparent)!important;justify-self:start!important;flex:none!important}
.hero.aura-premium-buttons.aura-premium-buttons .aura-premium-primary.aura-premium-primary .aura-premium-main-icon{width:${size.icon}px!important;height:${size.icon}px!important;display:block!important;fill:none!important;stroke:currentColor!important;stroke-width:1.35!important;stroke-linecap:round!important;stroke-linejoin:round!important}
.hero.aura-premium-buttons.aura-premium-buttons.aura-premium-crystal_pill .aura-premium-primary.aura-premium-primary .aura-premium-main-icon path:first-child{fill:currentColor!important;stroke:none!important}
.hero.aura-premium-buttons.aura-premium-buttons .aura-premium-primary.aura-premium-primary .aura-premium-label{text-align:center!important;min-width:0!important}
.hero.aura-premium-buttons.aura-premium-buttons .aura-premium-primary.aura-premium-primary .aura-premium-arrow{font:300 ${size.icon+3}px/1 var(--body)!important;justify-self:end!important}
.hero.aura-premium-buttons.aura-premium-buttons .aura-global-nav.aura-global-nav{display:grid!important;${navLayout};gap:8px!important;width:min(100%,${Math.max(360,size.max)}px)!important;margin:18px auto 0!important}
.hero.aura-premium-buttons.aura-premium-buttons .aura-global-nav.aura-global-nav .aura-premium-secondary.aura-premium-secondary{min-width:0!important;min-height:${model==='premium_icons'?size.card:size.h}px!important;height:auto!important;padding:${model==='premium_icons'?'9px 5px':'7px '+size.pad+'px'}!important;box-sizing:border-box!important;${secondary};${shapeRule}}
.hero.aura-premium-buttons.aura-premium-buttons .aura-global-nav.aura-global-nav .aura-premium-secondary.aura-premium-secondary svg{width:${size.icon}px!important;height:${size.icon}px!important;stroke:currentColor!important;fill:none!important;stroke-width:1.45!important;flex:none!important}
.hero.aura-premium-buttons.aura-premium-buttons .aura-global-nav.aura-global-nav .aura-premium-secondary.aura-premium-secondary span{font:600 ${model==='premium_icons'?Math.max(7,size.font-3):Math.max(8,size.font-1)}px/1.3 var(--body)!important;letter-spacing:${model==='premium_icons'?'.07em':'.035em'}!important;text-transform:${model==='premium_icons'?'uppercase':'none'}!important;white-space:normal!important;overflow-wrap:normal!important;word-break:normal!important}
.hero.aura-premium-buttons.aura-premium-buttons .aura-global-nav.aura-global-nav .aura-premium-secondary.aura-premium-secondary b{font-size:${size.icon+2}px!important;line-height:1!important}
.hero.aura-premium-buttons:not(.aura-premium-premium_icons) .aura-global-nav .aura-premium-secondary{display:grid!important;grid-template-columns:${size.icon+8}px minmax(0,1fr) 18px!important;align-items:center!important;gap:10px!important;text-align:left!important}
.hero.aura-premium-buttons:not(.aura-premium-premium_icons) .aura-global-nav .aura-premium-secondary span{text-align:left!important}
.hero.aura-premium-buttons:not(.aura-premium-premium_icons) .aura-global-nav .aura-premium-secondary b{display:block!important;text-align:right!important}
.hero.aura-premium-buttons.aura-premium-premium_icons .aura-global-nav .aura-premium-secondary{display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:7px!important;text-align:center!important}
.hero.aura-premium-buttons.aura-premium-premium_icons .aura-global-nav .aura-premium-secondary b{display:none!important}
.hero.aura-premium-buttons.aura-premium-buttons.aura-premium-jewel_badge .aura-premium-primary.aura-premium-primary{grid-template-columns:${size.icon+28}px minmax(0,1fr) ${size.icon}px!important;padding-left:${size.pad+4}px!important;overflow:visible!important}
.hero.aura-premium-buttons.aura-premium-buttons.aura-premium-jewel_badge .aura-premium-primary.aura-premium-primary .aura-premium-icon-shell{width:${size.icon+20}px!important;height:${size.icon+20}px!important;margin-left:-10px!important;background:radial-gradient(circle at 34% 28%,${rgba(pale,.76)} 0 8%,${rgba(light,.62)} 18%,${rgba(base,.94)} 48%,${rgba(deep,.98)} 100%)!important;border:2px solid ${rgba(pale,.82)}!important;outline:1px solid ${rgba(deep,.70)}!important;outline-offset:2px!important;box-shadow:inset 0 0 0 2px ${rgba(pale,.28)},inset 0 -6px 12px rgba(0,0,0,.24),0 4px 11px rgba(0,0,0,.24)!important}
.hero.aura-premium-buttons.aura-premium-buttons.aura-premium-jewel_badge .aura-premium-secondary.aura-premium-secondary svg{width:${size.icon+8}px!important;height:${size.icon+8}px!important;padding:5px!important;border:1px solid ${rgba(pale,.72)}!important;border-radius:999px!important;outline:1px solid ${rgba(deep,.52)}!important;outline-offset:2px!important;background:radial-gradient(circle at 35% 28%,${rgba(light,.62)},${rgba(base,.90)} 52%,${rgba(deep,.96)})!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 3px 8px rgba(0,0,0,.16)!important}
.hero.aura-premium-buttons.aura-premium-buttons.aura-premium-editorial_frame .aura-premium-primary.aura-premium-primary .aura-premium-icon-shell{border-radius:4px!important;background:transparent!important}
.hero.aura-premium-buttons.aura-premium-buttons.aura-premium-minimal_label .aura-premium-primary.aura-premium-primary .aura-premium-icon-shell{border:0!important;background:transparent!important}
.hero.aura-premium-buttons.aura-premium-buttons .aura-premium-primary.aura-premium-primary:hover,.hero.aura-premium-buttons.aura-premium-buttons .aura-premium-secondary.aura-premium-secondary:hover{transform:translateY(-1px)!important;filter:brightness(1.035)!important}
@media(max-width:360px){.hero.aura-premium-buttons.aura-premium-buttons .aura-global-nav.aura-global-nav{gap:6px!important}.hero.aura-premium-buttons.aura-premium-premium_icons .aura-global-nav .aura-premium-secondary{min-height:${Math.max(60,size.card-8)}px!important;padding-inline:3px!important}}
`;
}
const _invitationCss5611=invitationCss;
invitationCss=function(p,t,a){return _invitationCss5611(p,t,a)+premiumCoverButtonsCss5611(p)};

function initPremiumButtons5611(){
  const use=$('heroButtonUsePalette'),color=$('heroButtonColor'),model=$('heroButtonModel');
  const sync=()=>{if(color)color.disabled=!!use?.checked;if(model){const off=model.value==='original';['heroButtonSize','heroButtonShape','heroButtonIcon','heroButtonColor','heroButtonUsePalette'].forEach(id=>{const el=$(id);if(el)el.closest('label')?.classList.toggle('control-muted',off)})}};
  use?.addEventListener('change',sync);model?.addEventListener('change',sync);sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initPremiumButtons5611);else initPremiumButtons5611();

const _configObject5611=configObject;
configObject=function(p){const c=_configObject5611(p);c.schemaVersion=5.611;c.studioVersion='5.6.11';return c};


/* ==========================================================
   Aura Digital 5.6.12 · Copiar enlace de invitación publicada
   ========================================================== */
const _configObject5612=configObject;
configObject=function(p){const c=_configObject5612(p);c.schemaVersion=5.612;c.studioVersion='5.6.12';return c};

function auraGithubPreviewUrlWithBust(url){
  try{const u=new URL(url);u.searchParams.set('_aura_preview',String(Date.now()));return u.toString()}catch(_){return url+(String(url).includes('?')?'&':'?')+'_aura_preview='+Date.now()}
}
async function auraGithubResolvePagesUrl(repo){
  const owner=repo?.owner?.login||String(repo?.full_name||'').split('/')[0];
  const name=repo?.name||String(repo?.full_name||'').split('/').slice(1).join('/');
  if(!owner||!name)throw new AuraGithubError('No pude identificar este repositorio.');
  const pages=await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/pages`);
  const fallback=name.toLowerCase()===`${owner.toLowerCase()}.github.io`?`https://${owner}.github.io/`:`https://${owner}.github.io/${name}/`;
  return pages?.html_url||fallback;
}
function auraGithubCloseRepoPreview(){
  const modal=$('githubRepoPreviewModal'),frame=$('githubPreviewFrame');
  if(frame)frame.src='about:blank';
  if(modal?.open)modal.close();
  document.body.classList.remove('github-preview-open');
}
function auraGithubShowRepoPreview(repo,url){
  const modal=$('githubRepoPreviewModal'),frame=$('githubPreviewFrame'),title=$('githubPreviewTitle'),label=$('githubPreviewUrl'),open=$('githubPreviewOpen');
  if(!modal||!frame)return;
  if(title)title.textContent=repo?.full_name||repo?.name||'Vista previa';
  if(label)label.textContent=url;
  if(open)open.href=url;
  frame.src=auraGithubPreviewUrlWithBust(url);
  document.body.classList.add('github-preview-open');
  if(typeof modal.showModal==='function'){
    if(!modal.open)modal.showModal();
  }else{
    modal.setAttribute('open','');
  }
  setTimeout(()=>$('githubPreviewClose')?.focus(),20);
}
async function auraGithubOpenRepoPreview(repo,button){
  if(!repo?.has_pages){auraGithubSetRepoStatus('Ese repositorio no tiene GitHub Pages activo.','error');return}
  const original=button?.textContent;if(button){button.disabled=true;button.textContent='Abriendo…'}
  auraGithubSetRepoStatus(`Abriendo vista previa de ${repo.full_name||repo.name}…`);
  try{
    const url=await auraGithubResolvePagesUrl(repo);
    auraGithubShowRepoPreview(repo,url);
    auraGithubSetRepoStatus(`Vista previa abierta: ${repo.full_name||repo.name}`,'ok');
  }catch(err){
    console.error('Aura GitHub repo preview',err);
    auraGithubSetRepoStatus(err.status===404?'GitHub Pages no está activo en ese repositorio.':auraGithubFriendlyError(err),'error');
  }finally{if(button){button.disabled=false;button.textContent=original||'Vista previa'}}
}
function initAuraGithubRepoPreview5614(){
  const modal=$('githubRepoPreviewModal');
  $('githubPreviewClose')?.addEventListener('click',auraGithubCloseRepoPreview);
  modal?.addEventListener('cancel',e=>{e.preventDefault();auraGithubCloseRepoPreview()});
  modal?.addEventListener('click',e=>{if(e.target===modal)auraGithubCloseRepoPreview()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAuraGithubRepoPreview5614);else initAuraGithubRepoPreview5614();

const _configObject5614=configObject;
configObject=function(p){const c=_configObject5614(p);c.schemaVersion=5.614;c.studioVersion='5.6.14';return c};


/* ==========================================================
   Aura Digital 5.6.15 · Vista previa de repositorios en popup real
   - Abre la ventana de forma síncrona desde el clic para evitar pestaña normal/bloqueo.
   - Usa las mismas proporciones del Preview desprendido de Aura.
   - Después resuelve GitHub Pages y navega esa misma ventana a la invitación publicada.
   ========================================================== */
let auraGithubRepoPreviewWindow5615=null;
function auraGithubCreateRepoPopup5615(repo){
  const availW=Math.max(320,window.screen?.availWidth||window.innerWidth||430);
  const availH=Math.max(560,window.screen?.availHeight||window.innerHeight||900);
  const height=Math.min(900,Math.max(620,availH-80));
  const width=Math.min(430,Math.max(300,Math.round(height*(430/900))),Math.max(300,availW-40));
  const sx=Number.isFinite(window.screenX)?window.screenX:(window.screenLeft||0);
  const sy=Number.isFinite(window.screenY)?window.screenY:(window.screenTop||0);
  const left=Math.max(sx+10,sx+(window.outerWidth||availW)-width-30);
  const top=Math.max(sy+20,sy+Math.round(Math.max(0,availH-height)/2));
  const features=`popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
  try{if(auraGithubRepoPreviewWindow5615&&!auraGithubRepoPreviewWindow5615.closed)auraGithubRepoPreviewWindow5615.close()}catch(_){ }
  const popup=window.open('about:blank','auraGithubRepoPreview',features);
  if(!popup)return null;
  auraGithubRepoPreviewWindow5615=popup;
  try{
    popup.document.open();
    popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${auraGithubEscapeText(repo?.name||'Vista previa')}</title><style>html,body{margin:0;min-height:100%;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#171513;color:#fff;display:grid;place-items:center}main{text-align:center;padding:28px}strong{display:block;font-size:16px;margin-bottom:10px}span{font-size:13px;opacity:.72}</style></head><body><main><strong>Abriendo vista previa…</strong><span>${auraGithubEscapeText(repo?.full_name||repo?.name||'GitHub Pages')}</span></main></body></html>`);
    popup.document.close();
    const fit=()=>{try{popup.resizeTo(width,height);popup.moveTo(left,top)}catch(_){ }};
    fit();setTimeout(fit,80);setTimeout(fit,280);
    popup.focus();
  }catch(_){ }
  return popup;
}
async function auraGithubOpenRepoPreview(repo,button){
  if(!repo?.has_pages){auraGithubSetRepoStatus('Ese repositorio no tiene GitHub Pages activo.','error');return}
  /* IMPORTANTE: abrir antes de cualquier await para conservar el gesto del usuario. */
  const popup=auraGithubCreateRepoPopup5615(repo);
  if(!popup){
    auraGithubSetRepoStatus('El navegador bloqueó la ventana emergente. Permite popups para Aura e inténtalo de nuevo.','error');
    return;
  }
  const original=button?.textContent;if(button){button.disabled=true;button.textContent='Abriendo…'}
  auraGithubSetRepoStatus(`Abriendo vista previa de ${repo.full_name||repo.name}…`);
  try{
    const url=await auraGithubResolvePagesUrl(repo);
    const target=auraGithubPreviewUrlWithBust(url);
    try{popup.location.replace(target)}catch(_){popup.location.href=target}
    try{popup.focus()}catch(_){ }
    auraGithubSetRepoStatus(`Vista previa abierta: ${repo.full_name||repo.name}`,'ok');
  }catch(err){
    console.error('Aura GitHub repo preview popup',err);
    try{
      popup.document.open();
      popup.document.write('<!doctype html><html><body style="font-family:system-ui;padding:28px"><h2>No pude abrir la vista previa</h2><p>Revisa que GitHub Pages esté activo para este repositorio.</p></body></html>');
      popup.document.close();
    }catch(_){ }
    auraGithubSetRepoStatus(err.status===404?'GitHub Pages no está activo en ese repositorio.':auraGithubFriendlyError(err),'error');
  }finally{if(button){button.disabled=false;button.textContent=original||'Vista previa'}}
}

const _configObject5615=configObject;
configObject=function(p){const c=_configObject5615(p);c.schemaVersion=5.615;c.studioVersion='5.6.15';return c};

/* ==========================================================
   Aura Digital 5.6.16 · Actualizador de la propia plataforma
   - Lee un ZIP firmado lógicamente con aura-version.json.
   - Detecta el repo actual cuando Aura corre en github.io.
   - Reemplaza el contenido del repo seleccionado sin cambiar su URL.
   - Usa la misma credencial temporal de la integración GitHub.
   ========================================================== */
const AURA_STUDIO_PRODUCT_5616='Aura Digital Studio';
const AURA_STUDIO_VERSION_5616='5.6.17';
const auraSystemState5616={zipFile:null,zip:null,manifest:null,prefix:'',files:null,busy:false,lastInstalledVersion:'',lastInstalledUrl:'',lastInstalledRepo:''};

function auraSystemSetStatus5616(text,type=''){
  const el=$('auraSystemStatus');if(!el)return;
  el.textContent=text||'';el.className='github-publish-status'+(type?` ${type}`:'');
}
function auraSystemProgress5616(percent,text){
  const box=$('auraSystemProgress'),bar=$('auraSystemProgressBar');
  if(box)box.hidden=false;if(bar)bar.style.width=`${Math.max(0,Math.min(100,Number(percent)||0))}%`;
  if(text)auraSystemSetStatus5616(text);
}
function auraSystemNormalizeRepo5616(value){
  const raw=String(value||'').trim().replace(/^https?:\/\/github\.com\//i,'').replace(/\.git$/i,'').replace(/^\/+|\/+$/g,'');
  const parts=raw.split('/').filter(Boolean);
  if(parts.length!==2)return '';
  const owner=parts[0].replace(/[^A-Za-z0-9-]/g,'');
  const repo=parts[1].replace(/[^A-Za-z0-9._-]/g,'');
  return owner&&repo?`${owner}/${repo}`:'';
}
function auraSystemDetectRepo5616(){
  const host=String(location.hostname||'').toLowerCase();
  if(!host.endsWith('.github.io'))return '';
  const owner=host.slice(0,-'.github.io'.length);
  if(!owner)return '';
  const parts=location.pathname.split('/').filter(Boolean).map(v=>decodeURIComponent(v));
  const repo=parts[0]||`${owner}.github.io`;
  return auraSystemNormalizeRepo5616(`${owner}/${repo}`);
}
function auraSystemPackageReset5616(){
  auraSystemState5616.zipFile=null;auraSystemState5616.zip=null;auraSystemState5616.manifest=null;auraSystemState5616.prefix='';auraSystemState5616.files=null;
  const box=$('auraSystemPackage'),btn=$('auraSystemInstall');if(box)box.hidden=true;if(btn)btn.disabled=true;
  const reload=$('auraSystemReload'),online=$('auraSystemOnlineLink');if(reload)reload.hidden=true;if(online)online.hidden=true;
}
function auraSystemCleanZipPath5616(path){
  const p=String(path||'').replace(/\\/g,'/').replace(/^\/+/, '');
  if(!p||p.split('/').some(part=>part==='..'))throw new Error(`Ruta no permitida en el ZIP: ${path}`);
  return p;
}
async function auraSystemReadPackage5616(file){
  auraSystemPackageReset5616();
  if(!file)return;
  if(!window.JSZip){auraSystemSetStatus5616('No está disponible JSZip para leer la actualización.','error');return}
  if(file.size>100*1024*1024){auraSystemSetStatus5616('El ZIP supera 100 MB. Revisa que sea un paquete de Aura válido.','error');return}
  auraSystemSetStatus5616('Validando paquete de actualización…');
  try{
    const zip=await JSZip.loadAsync(file);
    const names=Object.keys(zip.files).filter(name=>!zip.files[name].dir&&!/^__MACOSX\//.test(name));
    const manifests=names.filter(name=>/(^|\/)aura-version\.json$/i.test(name));
    if(manifests.length!==1)throw new Error('El ZIP debe contener un único aura-version.json.');
    const manifestPath=manifests[0];
    const prefix=manifestPath.slice(0,manifestPath.length-'aura-version.json'.length);
    const manifest=JSON.parse(await zip.files[manifestPath].async('text'));
    if(manifest?.product!==AURA_STUDIO_PRODUCT_5616)throw new Error('El ZIP no se identifica como Aura Digital Studio.');
    if(!/^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(String(manifest.version||'')))throw new Error('El paquete no tiene un número de versión válido.');
    for(const required of ['index.html','css/style.css','js/script.js','js/vendor/jszip.min.js']){
      if(!zip.files[prefix+required]||zip.files[prefix+required].dir)throw new Error(`Falta ${required} en el paquete.`);
    }
    const packageNames=names.filter(name=>name.startsWith(prefix)).map(name=>auraSystemCleanZipPath5616(name.slice(prefix.length))).filter(rel=>rel&&!/(^|\/)\.DS_Store$/i.test(rel));
    if(!packageNames.includes('aura-version.json'))throw new Error('No pude localizar el manifiesto dentro del paquete.');
    if(packageNames.length<6)throw new Error('El paquete parece incompleto.');
    auraSystemState5616.zipFile=file;auraSystemState5616.zip=zip;auraSystemState5616.manifest=manifest;auraSystemState5616.prefix=prefix;auraSystemState5616.files=packageNames;
    const box=$('auraSystemPackage'),ver=$('auraSystemNewVersion'),info=$('auraSystemPackageInfo'),btn=$('auraSystemInstall');
    if(ver)ver.textContent=String(manifest.version);
    if(info)info.textContent=`${packageNames.length} archivos · ${(file.size/1024/1024).toFixed(2)} MB · ${file.name}`;
    if(box)box.hidden=false;if(btn)btn.disabled=false;
    const same=String(manifest.version)===AURA_STUDIO_VERSION_5616;
    auraSystemSetStatus5616(same?'Paquete válido. Es la misma versión; puedes reinstalarla si lo necesitas.':'Paquete válido y listo para instalar.','ok');
  }catch(err){
    console.error('Aura updater package',err);auraSystemPackageReset5616();auraSystemSetStatus5616(err.message||'No se pudo validar el ZIP.','error');
  }
}
async function auraSystemZipFiles5616(onProgress){
  const {zip,prefix,files}=auraSystemState5616;if(!zip||!files)throw new Error('Selecciona primero un ZIP válido.');
  let done=0;
  const out=await auraGithubMapLimit(files,4,async rel=>{
    const entry=zip.files[prefix+rel];if(!entry||entry.dir)throw new Error(`No pude leer ${rel}.`);
    const content=await entry.async('base64');done++;onProgress?.(done,files.length,rel);
    return {path:rel,encoding:'base64',content};
  });
  return out;
}
async function auraSystemPublishTree5616(owner,repo,branch,files,version,onProgress){
  const ref=await auraGithubWaitForRef(owner,repo,branch);
  const parentSha=ref?.object?.sha;if(!parentSha)throw new AuraGithubError('No pude leer la rama principal de Aura.');
  let done=0;
  const tree=await auraGithubMapLimit(files,4,async file=>{
    const blob=await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/blobs`,{method:'POST',body:{content:String(file.content||'').replace(/\s+/g,''),encoding:'base64'}});
    done++;onProgress?.(done,files.length,file.path);
    return {path:file.path,mode:'100644',type:'blob',sha:blob.sha};
  });
  /* Sin base_tree: el repo dedicado a Aura queda exactamente igual al ZIP validado. */
  const newTree=await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees`,{method:'POST',body:{tree}});
  const commit=await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/commits`,{method:'POST',body:{message:`Actualizar Aura Digital a v${version} · ${new Date().toISOString()}`,tree:newTree.sha,parents:[parentSha]}});
  await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/refs/heads/${encodeURIComponent(branch)}`,{method:'PATCH',body:{sha:commit.sha,force:false}});
  return commit;
}
async function auraSystemInstall5616(){
  if(auraSystemState5616.busy)return;
  const manifest=auraSystemState5616.manifest;if(!manifest){auraSystemSetStatus5616('Selecciona primero un ZIP válido de Aura.','error');return}
  const repoField=$('auraSystemRepo');const full=auraSystemNormalizeRepo5616(repoField?.value||'');
  if(!full){auraSystemSetStatus5616('Escribe el repositorio como usuario/repositorio.','error');return}
  if(repoField)repoField.value=full;
  if(!auraGithubState.user||!auraGithubState.token){await auraGithubConnect();if(!auraGithubState.user){auraSystemSetStatus5616('Conecta GitHub en la sección 14 antes de actualizar Aura.','error');return}}
  const detected=auraSystemDetectRepo5616();
  if(detected&&detected.toLowerCase()!==full.toLowerCase()){
    const ok=window.confirm(`Aura está abierta desde ${detected}, pero elegiste actualizar ${full}.\n\n¿Seguro que quieres continuar con otro repositorio?`);if(!ok)return;
  }
  const ok=window.confirm(`Actualizarás la plataforma Aura en:\n${full}\n\nVersión actual: ${AURA_STUDIO_VERSION_5616}\nPaquete: ${manifest.version}\n\nEl contenido de ese repositorio será reemplazado por el ZIP validado. La URL de GitHub Pages no cambia.\n\n¿Continuar?`);
  if(!ok)return;
  auraSystemState5616.busy=true;const btn=$('auraSystemInstall');if(btn){btn.disabled=true;btn.textContent='Actualizando…'}
  const reload=$('auraSystemReload');if(reload)reload.hidden=true;
  try{
    auraSystemProgress5616(3,'Revisando repositorio de Aura…');
    const [owner,repo]=full.split('/');
    let repoInfo=null;
    try{repoInfo=await auraGithubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`)}
    catch(err){
      if(err.status!==404)throw err;
      if(String(auraGithubState.user?.login||'').toLowerCase()!==owner.toLowerCase())throw new AuraGithubError('Ese repositorio no existe y Aura solo puede crear automáticamente repositorios en tu propia cuenta.',404);
      auraSystemProgress5616(5,'El repositorio no existe. Creándolo para Aura…');
      repoInfo=await auraGithubRequest('/user/repos',{method:'POST',body:{name:repo,description:'Aura Digital · Studio de invitaciones',private:false,auto_init:true,has_issues:false,has_projects:false,has_wiki:false}});
      await auraGithubWaitForRef(owner,repo,repoInfo.default_branch||'main');
    }
    if(repoInfo.private)throw new AuraGithubError('El repositorio de Aura debe ser público para usarlo como sitio de GitHub Pages.',409);
    if(repoInfo.permissions&&repoInfo.permissions.admin===false)throw new AuraGithubError('El token no tiene permiso de administración sobre ese repositorio.',403);
    const branch=repoInfo.default_branch||'main';
    auraSystemProgress5616(10,'Leyendo archivos del ZIP…');
    const files=await auraSystemZipFiles5616((n,total,path)=>auraSystemProgress5616(10+Math.round((n/Math.max(total,1))*22),`Leyendo ${n}/${total} · ${path}`));
    auraSystemProgress5616(34,'Subiendo nueva versión de Aura…');
    await auraSystemPublishTree5616(owner,repo,branch,files,String(manifest.version),(n,total,path)=>auraSystemProgress5616(34+Math.round((n/Math.max(total,1))*51),`Subiendo ${n}/${total} · ${path}`));
    auraSystemProgress5616(88,'Confirmando GitHub Pages…');
    const pages=await auraGithubEnablePages(owner,repo,branch);
    const fallback=repo.toLowerCase()===`${owner.toLowerCase()}.github.io`?`https://${owner}.github.io/`:`https://${owner}.github.io/${repo}/`;
    const appUrl=pages?.html_url||fallback;
    auraSystemState5616.lastInstalledVersion=String(manifest.version);auraSystemState5616.lastInstalledUrl=appUrl;auraSystemState5616.lastInstalledRepo=`${owner}/${repo}`;
    const online=$('auraSystemOnlineLink');if(online){online.href=appUrl;online.hidden=false}
    auraSystemProgress5616(100,`Aura v${manifest.version} fue enviada a GitHub. GitHub Pages conservará el mismo enlace.`);
    if(reload)reload.hidden=false;
  }catch(err){
    console.error('Aura self update',err);auraSystemSetStatus5616(auraGithubFriendlyError(err),'error');const box=$('auraSystemProgress');if(box)box.hidden=true;
  }finally{
    auraSystemState5616.busy=false;if(btn){btn.disabled=!auraSystemState5616.manifest;btn.textContent='Instalar actualización'}
  }
}
function auraSystemReload5616(){
  const version=auraSystemState5616.lastInstalledVersion||auraSystemState5616.manifest?.version||Date.now().toString();
  const detected=auraSystemDetectRepo5616();
  const base=(auraSystemState5616.lastInstalledUrl&&(!detected||detected.toLowerCase()!==String(auraSystemState5616.lastInstalledRepo||'').toLowerCase()))?auraSystemState5616.lastInstalledUrl:location.href;
  const url=new URL(base);url.searchParams.set('aura_app_v',version);url.searchParams.set('_',Date.now().toString());location.href=url.toString();
}
function initAuraSystemUpdater5616(){
  const current=$('auraSystemCurrentVersion');if(current)current.textContent=AURA_STUDIO_VERSION_5616;
  const repo=$('auraSystemRepo'),hint=$('auraSystemRepoHint');const detected=auraSystemDetectRepo5616();
  if(repo&&!repo.value&&detected)repo.value=detected;
  if(hint)hint.textContent=detected?`Detectado desde este enlace: ${detected}`:'Aura está abierta fuera de github.io; escribe manualmente el repositorio de la plataforma.';
  $('auraSystemZip')?.addEventListener('change',e=>auraSystemReadPackage5616(e.target.files?.[0]||null));
  $('auraSystemInstall')?.addEventListener('click',()=>auraSystemInstall5616());
  $('auraSystemReload')?.addEventListener('click',auraSystemReload5616);
  repo?.addEventListener('blur',()=>{const v=auraSystemNormalizeRepo5616(repo.value);if(v)repo.value=v});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAuraSystemUpdater5616);else initAuraSystemUpdater5616();

const _configObject5616=configObject;
configObject=function(p){const c=_configObject5616(p);c.schemaVersion=5.616;c.studioVersion='5.6.16';return c};


/* =======================================================================
   AURA DIGITAL · v5.6.17 · RECUPERACIÓN COMPLETA DESDE LINK
   - Recupera config.json + assets publicados (fotos y música).
   - Los archivos recuperados se marcan para NO recomprimirlos al exportar
     o volver a publicar, evitando pérdida acumulativa de calidad.
   - No modifica el comportamiento de archivos nuevos seleccionados por usuario.
   ======================================================================= */
const AURA_STUDIO_VERSION_5617='5.6.17';
const auraRecoveredAssetFiles5617=new WeakSet();
const auraRecoveredAssets5617={
  portadaFile:null,bannerFile:null,bannerExtraFile:null,bannerExtra2File:null,
  bgFile:null,videoPosterFile:null,transferPhotoFile:null,musicFile:null,galleryFiles:[]
};
function auraRecoveredAllFiles5617(){
  return [auraRecoveredAssets5617.portadaFile,auraRecoveredAssets5617.bannerFile,auraRecoveredAssets5617.bannerExtraFile,
    auraRecoveredAssets5617.bannerExtra2File,auraRecoveredAssets5617.bgFile,auraRecoveredAssets5617.videoPosterFile,
    auraRecoveredAssets5617.transferPhotoFile,auraRecoveredAssets5617.musicFile,...(auraRecoveredAssets5617.galleryFiles||[])].filter(Boolean);
}
function auraClearRecoveredAssets5617(){
  for(const f of auraRecoveredAllFiles5617()){
    try{const u=fileUrls?.get?.(f);if(u){URL.revokeObjectURL(u);fileUrls.delete(f)}}catch(e){}
  }
  for(const k of Object.keys(auraRecoveredAssets5617))auraRecoveredAssets5617[k]=k==='galleryFiles'?[]:null;
}
function auraRecoveredMime5617(name,type=''){
  if(type)return type;
  const ext=(String(name).split('.').pop()||'').toLowerCase();
  return ({jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif',avif:'image/avif',
    mp3:'audio/mpeg',m4a:'audio/mp4',aac:'audio/aac',ogg:'audio/ogg',wav:'audio/wav'})[ext]||'application/octet-stream';
}
function auraProjectUrls5617(value){
  let raw=String(value||'').trim();if(!raw)return null;
  try{
    let u=new URL(raw);u.hash='';u.search='';
    if(u.hostname==='github.com'&&u.pathname.includes('/blob/')){
      const parts=u.pathname.split('/').filter(Boolean),i=parts.indexOf('blob');
      if(i>=2&&parts[i+1])u=new URL(`https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${parts[i+1]}/${parts.slice(i+2).join('/')}`);
    }
    let path=u.pathname;
    if(/\/(?:config\.json|index\.html)$/i.test(path))path=path.replace(/(?:config\.json|index\.html)$/i,'');
    else if(/\.(?:json|html?)$/i.test(path))path=path.replace(/[^/]+$/,'');
    if(!path.endsWith('/'))path+='/';u.pathname=path;u.search='';u.hash='';
    const base=u.toString();return {base,config:new URL('config.json',base).toString(),index:new URL('index.html',base).toString()};
  }catch(e){return null}
}
function auraExtractAssetPaths5617(html){
  const found=new Set();
  const re=/assets\/[A-Za-z0-9._~%+\/-]+(?:\?[^"'\s)<]*)?/g;
  for(const m of String(html||'').matchAll(re)){
    const clean=m[0].replace(/&amp;/g,'&').split('?')[0].replace(/^\.\//,'');
    if(!clean.startsWith('assets/fonts/'))found.add(clean);
  }
  return [...found];
}
function auraClassifyAsset5617(path){
  const name=decodeURIComponent(String(path).split('/').pop()||'').toLowerCase();
  if(/^portada\./.test(name))return {key:'portadaFile'};
  if(/^banner-extra-2\./.test(name))return {key:'bannerExtra2File'};
  if(/^banner-extra\./.test(name))return {key:'bannerExtraFile'};
  if(/^banner\./.test(name))return {key:'bannerFile'};
  if(/^fondo\./.test(name))return {key:'bgFile'};
  if(/^video-poster\./.test(name))return {key:'videoPosterFile'};
  if(/^regalo-foto\./.test(name))return {key:'transferPhotoFile'};
  if(/^musica\./.test(name))return {key:'musicFile'};
  const g=name.match(/^foto-(\d+)\./);if(g)return {key:'galleryFiles',index:Number(g[1])};
  return null;
}
async function auraFetchRecoveredFile5617(url,path){
  const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`No se pudo descargar ${path} (${r.status})`);
  const blob=await r.blob(),name=decodeURIComponent(String(path).split('/').pop()||'asset');
  const file=new File([blob],name,{type:auraRecoveredMime5617(name,blob.type),lastModified:Date.now()});
  auraRecoveredAssetFiles5617.add(file);return file;
}
async function auraRecoverPublishedAssets5617(base,indexHtml,statusEl){
  const paths=auraExtractAssetPaths5617(indexHtml),jobs=[];
  for(const path of paths){const info=auraClassifyAsset5617(path);if(info)jobs.push({path,info})}
  jobs.sort((a,b)=>(a.info.key==='galleryFiles'?a.info.index:0)-(b.info.key==='galleryFiles'?b.info.index:0));
  const gallery=[];let images=0,music=0,failed=0;
  for(let i=0;i<jobs.length;i++){
    const {path,info}=jobs[i];if(statusEl)statusEl.textContent=`Recuperando archivos ${i+1}/${jobs.length}…`;
    try{
      const file=await auraFetchRecoveredFile5617(new URL(path,base).toString(),path);
      if(info.key==='galleryFiles')gallery.push({index:info.index,file});else auraRecoveredAssets5617[info.key]=file;
      if(info.key==='musicFile')music++;else images++;
    }catch(err){console.warn('Aura: no se pudo recuperar asset',path,err);failed++}
  }
  auraRecoveredAssets5617.galleryFiles=gallery.sort((a,b)=>a.index-b.index).map(x=>x.file);
  return {images,music,failed,total:jobs.length};
}
const _getFormParams5617=getFormParams;
getFormParams=function(){
  const p=_getFormParams5617();
  for(const key of ['portadaFile','bannerFile','bannerExtraFile','bannerExtra2File','bgFile','videoPosterFile','transferPhotoFile','musicFile']){
    if(!p[key]&&auraRecoveredAssets5617[key])p[key]=auraRecoveredAssets5617[key];
  }
  if((p.galleryFiles?.length||0)===0&&(auraRecoveredAssets5617.galleryFiles?.length||0)>0)p.galleryFiles=[...auraRecoveredAssets5617.galleryFiles];
  return p;
};
const _optimizeImageForZip5617=optimizeImageForZip;
optimizeImageForZip=async function(file){
  if(file&&auraRecoveredAssetFiles5617.has(file)){
    return {blob:file,ext:fileExt(file.name),optimized:false,recovered:true,sourceSize:file.size,finalSize:file.size};
  }
  return _optimizeImageForZip5617(file);
};
async function importConfig5617(){
  const s=$('configStatus'),source=String($('configUrl')?.value||'').trim(),urls=auraProjectUrls5617(source);
  if(!urls){if(s)s.textContent='Pega un enlace válido.';return}
  auraClearRecoveredAssets5617();
  try{
    if(s)s.textContent='Cargando configuración…';
    const cfgRes=await fetch(urls.config,{cache:'no-store'});if(!cfgRes.ok)throw new Error(`config ${cfgRes.status}`);
    const cfg=await cfgRes.json();applyConfig(cfg);
    let result={images:0,music:0,failed:0,total:0};
    try{
      if(s)s.textContent='Leyendo archivos publicados…';
      const htmlRes=await fetch(urls.index,{cache:'no-store'});if(!htmlRes.ok)throw new Error(`index ${htmlRes.status}`);
      result=await auraRecoverPublishedAssets5617(urls.base,await htmlRes.text(),s);
    }catch(assetErr){console.warn('Aura: configuración recuperada sin assets',assetErr)}
    if(typeof renderPhotoFraming554==='function')try{renderPhotoFraming554()}catch(e){}
    updatePreview();
    const galleryCount=auraRecoveredAssets5617.galleryFiles.length;
    const pieces=[];if(result.images)pieces.push(`${result.images} foto${result.images===1?'':'s'}`);if(result.music)pieces.push('música');
    if(s)s.textContent=pieces.length?`Proyecto recuperado ✓ · ${pieces.join(' + ')}${result.failed?` · ${result.failed} archivo(s) no disponible(s)`:''}`:'Configuración aplicada ✓ · sin archivos publicados detectables';
  }catch(e){console.error('Aura recuperar proyecto',e);if(s)s.textContent='No se pudo cargar';alert('No se pudo recuperar esta invitación. Revisa que el enlace sea público y apunte a una invitación de Aura.')}
}
importConfig=importConfig5617;
function initRecovery5617(){
  const helper=$('configUrl')?.closest('.section-body')?.querySelector('.helper');if(helper)helper.textContent='Pega el link público de la invitación o de su config.json. Aura recuperará también las fotos y la música publicadas cuando estén disponibles.';
  const btn=$('btnLoadConfig');if(btn)btn.textContent='Recuperar proyecto';
  const map={portadaFile:'portadaFile',bannerFile:'bannerFile',bannerExtraFile:'bannerExtraFile',bannerExtra2File:'bannerExtra2File',bgFile:'bgFile',videoPosterFile:'videoPosterFile',transferPhotoFile:'transferPhotoFile',musicFile:'musicFile',galleryFiles:'galleryFiles'};
  for(const [id,key] of Object.entries(map))$(id)?.addEventListener('change',()=>{auraRecoveredAssets5617[key]=key==='galleryFiles'?[]:null},{capture:true});
  $('localConfig')?.addEventListener('change',()=>auraClearRecoveredAssets5617(),{capture:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initRecovery5617);else initRecovery5617();

const _configObject5617=configObject;
configObject=function(p){const c=_configObject5617(p);c.schemaVersion=5.617;c.studioVersion='5.6.17';return c};
