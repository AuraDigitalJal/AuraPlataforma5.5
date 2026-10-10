
(function auraWeddingTrials(){
 'use strict';
 const variants={
  wedding_lino_editorial:{label:'PRUEBA A · Lino Editorial',palette:'ivory_champagne',swatch:'linear-gradient(180deg,#c7b9a7 0 55%,#f8f2e8 56%)',display:"'Cormorant Garamond',serif",body:"'Manrope',sans-serif",radius:'2px',hero:'photo',ornament:'line',section:'trial_lino'},
  wedding_velo_sobrio:{label:'PRUEBA B · Velo Sobrio',palette:'sage_stone',swatch:'linear-gradient(155deg,#788476 0 53%,#ece9e2 54%)',display:"'Cormorant Garamond',serif",body:"'Manrope',sans-serif",radius:'16px',hero:'photo',ornament:'none',section:'trial_velo'},
  wedding_papel_artesanal:{label:'PRUEBA C · Papel Artesanal',palette:'terracotta_linen',swatch:'linear-gradient(150deg,#e8dccc 0 48%,#8e7364 49% 51%,#f8f0e5 52%)',display:"'Libre Baskerville',serif",body:"'Manrope',sans-serif",radius:'2px',hero:'photo',ornament:'line',section:'trial_papel'}
 };
 Object.assign(THEMES,variants);
 const ids=Object.keys(variants);
 ids.forEach(function(id){
  if(!WEDDING_THEME_IDS_55.includes(id))WEDDING_THEME_IDS_55.push(id);
  if(COLLECTIONS.boda&&!COLLECTIONS.boda.themes.includes(id))COLLECTIONS.boda.themes.push(id);
 });
 if(COLLECTIONS.boda)COLLECTIONS.boda.note='Bodas · propuestas aprobadas y tres variantes adicionales en pruebas.';
 /* Dejar las previsualizaciones en el catálogo como componentes CSS, no mockups externos. */
 function visualCss(){/* 

:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover{
  display:flex!important;flex-direction:column!important;justify-content:flex-end!important;
  align-items:stretch!important;position:relative!important;isolation:isolate!important;
  box-sizing:border-box!important;height:auto!important;min-height:100svh!important;
  margin:0!important;gap:0!important;overflow:hidden!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover::before,
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover::after{display:none!important;content:none!important}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .hero-media{transform:none!important;filter:none!important;background-position:center 30%!important}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .hero-inner{
  position:relative!important;z-index:5!important;box-sizing:border-box!important;
  display:flex!important;flex-direction:column!important;justify-content:center!important;
  width:min(100%,610px)!important;max-width:none!important;min-width:0!important;
  margin:0 auto!important;text-align:center!important;transform:none!important;
  color:var(--heading)!important;text-shadow:none!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .hero-inner h1{
  font-family:var(--display)!important;font-size:clamp(42px,11vw,78px)!important;
  font-weight:400!important;line-height:1.02!important;letter-spacing:-.028em!important;
  color:var(--heading)!important;text-shadow:none!important;overflow-wrap:anywhere!important;
  text-wrap:balance
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .aura-editorial-copy p{
  max-width:38ch!important;margin:12px auto 0!important;
  color:var(--text)!important;text-shadow:none!important;
  font:400 clamp(11px,2.8vw,13px)/1.7 var(--body)!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .hero-kicker,
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .aura-cover-date{
  color:var(--muted)!important;font-size:9px!important;font-weight:500!important;
  letter-spacing:.22em!important;text-transform:uppercase!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .aura-cover-accent{display:none!important}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .aura-quick-actions{
  display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:7px!important;width:100%!important;max-width:460px!important;margin:18px auto 0!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .aura-quick-action{
  position:relative!important;display:flex!important;flex-direction:column!important;
  justify-content:center!important;align-items:center!important;gap:4px!important;
  min-width:0!important;min-height:58px!important;padding:8px 4px!important;
  color:var(--heading)!important;background:color-mix(in srgb,var(--card) 57%,transparent)!important;
  border:1px solid color-mix(in srgb,var(--heading) 22%,transparent)!important;
  text-decoration:none!important;box-shadow:none!important;backdrop-filter:none!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .aura-quick-action span{
  color:var(--heading)!important;font:500 10px/1.3 var(--body)!important;text-align:center!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .aura-quick-action svg{width:17px!important;height:17px!important}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .aura-quick-action b{display:none!important}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .aura-enter{
  position:relative!important;z-index:6!important;display:flex!important;
  justify-content:center!important;align-items:center!important;
  width:min(100%,460px)!important;min-height:44px!important;
  padding:10px 16px!important;margin:10px auto 0!important;
  border:1px solid color-mix(in srgb,var(--heading) 32%,transparent)!important;
  background:var(--trial-button)!important;color:var(--heading)!important;
  text-shadow:none!important;box-shadow:none!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .scroll-note{
  position:relative!important;left:auto!important;bottom:auto!important;
  margin:7px auto 0!important;transform:none!important;text-align:center!important;
  color:var(--muted)!important;font:400 9px/1.5 var(--body)!important;letter-spacing:.18em!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .page .content{width:100%!important;max-width:none!important;margin:0!important;padding:0!important}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .page .content .aura-screen{
  background:var(--bg)!important;height:auto!important;min-height:0!important;
  padding:clamp(46px,9vw,92px) 15px!important;overflow:visible!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .page .content .aura-screen::before,
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .page .content .aura-screen::after{display:none!important;content:none!important}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .page .content .aura-screen-shell{width:min(100%,660px)!important;max-width:660px!important;box-sizing:border-box!important;margin-left:auto!important;margin-right:auto!important}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .page .content .aura-screen .section-label{color:var(--accent)!important;letter-spacing:.22em!important}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .page .content .aura-screen h2{
  color:var(--heading)!important;font-family:var(--display)!important;
  font-weight:400!important;font-size:clamp(30px,8vw,56px)!important;line-height:1.13!important
}
:is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .page .content .aura-stage-photo{filter:none!important;transform:none!important}

.theme-wedding_lino_editorial .hero.aura-story-cover{
  padding:clamp(378px,57svh,610px) 16px 26px!important;background:var(--bg)!important
}
.theme-wedding_lino_editorial .hero.aura-story-cover .hero-media,
.theme-wedding_lino_editorial .hero.aura-story-cover .hero-overlay{
  position:absolute!important;inset:0 0 auto 0!important;height:clamp(340px,55svh,585px)!important
}
.theme-wedding_lino_editorial .hero.aura-story-cover .hero-overlay{
  background:linear-gradient(to top,color-mix(in srgb,var(--heading) 12%,transparent),transparent 55%),var(--trial-overlay)!important
}
.theme-wedding_lino_editorial .hero.aura-story-cover .hero-inner{
  padding:clamp(14px,3svh,26px) 10px 0!important;background:transparent!important;
  border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important
}
.theme-wedding_lino_editorial .hero.aura-story-cover .hero-inner::before{
  content:'';display:block;width:48px;height:1px;margin:0 auto 16px;
  background:var(--accent);opacity:.65
}
.theme-wedding_lino_editorial .hero.aura-story-cover .aura-editorial-copy h1{font-style:italic!important}
.theme-wedding_lino_editorial .hero.aura-story-cover .aura-quick-action,
.theme-wedding_lino_editorial .hero.aura-story-cover .aura-enter{border-radius:var(--trial-radius)!important}
.theme-wedding_lino_editorial .page .content .aura-screen{
  background:linear-gradient(176deg,var(--bg),color-mix(in srgb,var(--bg) 91%,var(--card)))!important
}
.theme-wedding_lino_editorial .page .content .aura-stage-photo{border-radius:2px!important}
.theme-wedding_lino_editorial .page .content .aura-date-panel,
.theme-wedding_lino_editorial .page .content .aura-family-panel,
.theme-wedding_lino_editorial .page .content .aura-location-panel{
  border:0!important;border-top:1px solid color-mix(in srgb,var(--accent) 42%,transparent)!important;
  border-radius:0!important;box-shadow:none!important;background:var(--card)!important
}

.theme-wedding_velo_sobrio .hero.aura-story-cover{
  padding:clamp(270px,42svh,450px) 15px 22px!important;background:var(--bg)!important
}
.theme-wedding_velo_sobrio .hero.aura-story-cover .hero-media{
  position:absolute!important;inset:0!important;height:100%!important;background-position:center 32%!important
}
.theme-wedding_velo_sobrio .hero.aura-story-cover .hero-overlay{
  position:absolute!important;inset:0!important;height:100%!important;
  background:linear-gradient(to bottom,transparent 0 44%,color-mix(in srgb,var(--heading) 18%,transparent) 85%,color-mix(in srgb,var(--heading) 27%,transparent)),var(--trial-overlay)!important
}
.theme-wedding_velo_sobrio .hero.aura-story-cover .hero-inner{
  padding:clamp(20px,5vw,34px)!important;
  background:color-mix(in srgb,var(--card) 86%,transparent)!important;
  border:1px solid color-mix(in srgb,var(--card) 75%,transparent)!important;
  border-radius:18px!important;box-shadow:0 18px 46px color-mix(in srgb,var(--heading) 9%,transparent)!important;
  -webkit-backdrop-filter:blur(8px)!important;backdrop-filter:blur(8px)!important
}
.theme-wedding_velo_sobrio .hero.aura-story-cover .aura-quick-action,
.theme-wedding_velo_sobrio .hero.aura-story-cover .aura-enter{border-radius:var(--trial-radius)!important}
.theme-wedding_velo_sobrio .page .content .aura-screen{
  background:linear-gradient(160deg,var(--bg),color-mix(in srgb,var(--bg) 85%,var(--card)))!important
}
.theme-wedding_velo_sobrio .page .content .aura-stage-photo{border-radius:20px!important}
.theme-wedding_velo_sobrio .page .content .aura-date-panel,
.theme-wedding_velo_sobrio .page .content .aura-family-panel,
.theme-wedding_velo_sobrio .page .content .aura-location-panel{
  background:var(--card)!important;border-radius:18px!important;
  border:1px solid color-mix(in srgb,var(--accent) 26%,transparent)!important;
  box-shadow:0 14px 34px color-mix(in srgb,var(--heading) 6%,transparent)!important
}

.theme-wedding_papel_artesanal .hero.aura-story-cover{
  padding:clamp(360px,56svh,590px) 19px 28px!important;background-color:var(--bg)!important;
  background-image:repeating-linear-gradient(104deg,transparent 0 4px,color-mix(in srgb,var(--heading) 1.3%,transparent) 5px 6px,transparent 7px 12px)!important
}
.theme-wedding_papel_artesanal .hero.aura-story-cover .hero-media{
  position:absolute!important;inset:15px 15px auto 15px!important;width:auto!important;
  height:clamp(308px,52svh,545px)!important;border:8px solid var(--bg)!important;
  outline:1px solid color-mix(in srgb,var(--accent) 33%,transparent)!important;
  box-shadow:0 12px 24px color-mix(in srgb,var(--heading) 8%,transparent)!important
}
.theme-wedding_papel_artesanal .hero.aura-story-cover .hero-overlay{position:absolute!important;inset:15px 15px auto 15px!important;height:clamp(308px,52svh,545px)!important;background:var(--trial-overlay)!important;pointer-events:none!important}
.theme-wedding_papel_artesanal .hero.aura-story-cover .hero-inner{
  padding:clamp(14px,3svh,30px) 10px 0!important;
  background:transparent!important;border:0!important;box-shadow:none!important;
  backdrop-filter:none!important;border-radius:0!important
}
.theme-wedding_papel_artesanal .hero.aura-story-cover .hero-inner::before{
  content:'✳';display:block;margin:0 auto 12px;color:var(--accent);font:400 20px/1 var(--display)
}
.theme-wedding_papel_artesanal .hero.aura-story-cover .aura-quick-action,
.theme-wedding_papel_artesanal .hero.aura-story-cover .aura-enter{border-radius:var(--trial-radius)!important}
.theme-wedding_papel_artesanal .page .content .aura-screen{
  background-color:var(--bg)!important;
  background-image:repeating-linear-gradient(107deg,transparent 0 6px,color-mix(in srgb,var(--heading) 1%,transparent) 7px 8px,transparent 9px 17px)!important
}
.theme-wedding_papel_artesanal .page .content .aura-stage-photo{
  border:8px solid var(--bg)!important;outline:1px solid color-mix(in srgb,var(--accent) 30%,transparent)!important;
  border-radius:2px!important
}
.theme-wedding_papel_artesanal .page .content .aura-date-panel,
.theme-wedding_papel_artesanal .page .content .aura-family-panel,
.theme-wedding_papel_artesanal .page .content .aura-location-panel{
  background:var(--card)!important;border-radius:2px!important;
  border:1px solid color-mix(in srgb,var(--accent) 30%,transparent)!important;box-shadow:none!important
}
@media(max-width:420px){
 .theme-wedding_lino_editorial .hero.aura-story-cover{padding-top:max(365px,57svh)!important}
 .theme-wedding_velo_sobrio .hero.aura-story-cover{padding-top:38svh!important}
 .theme-wedding_papel_artesanal .hero.aura-story-cover{padding-top:max(350px,55svh)!important}
 :is(.theme-wedding_lino_editorial,.theme-wedding_velo_sobrio,.theme-wedding_papel_artesanal) .hero.aura-story-cover .hero-inner h1{
  font-size:clamp(39px,10.8vw,56px)!important
 }
}
 */ }
 const styles=visualCss.toString().split('/* ').slice(1).join('/* ').replace(/\s*\*\/\s*\}\s*$/,'');
 const priorCoverCss=coverCss;
 coverCss=function(p){
  const base=priorCoverCss(p);
  if(!p||!ids.includes(p.themeVisual))return base;
  const buttonColor=p.heroButtonUsePalette===false&&p.heroButtonColor?p.heroButtonColor:p.primaryColor;
  const radius=p.heroButtonShape==='pill'?'999px':p.heroButtonShape==='rounded'?'12px':p.heroButtonShape==='square'?'0px':(p.themeVisual==='wedding_velo_sobrio'?'999px':'2px');
  return base+'.theme-'+p.themeVisual+'{--trial-button:'+rgba(buttonColor,bounded(p.buttonOpacity,.92,0,1))+';--trial-overlay:'+rgba(p.overlayColor||'#000000',bounded(p.overlayOpacity,.1,0,1))+';--trial-radius:'+radius+';}\n'+styles;
 };
 function activate(){
  const selector=document.getElementById('themeVisual');
  if(selector)ids.forEach(function(id){
   if(!Array.from(selector.options).some(function(o){return o.value===id})){
    selector.add(new Option(variants[id].label,id));
   }
  });
  if(typeof renderThemeStrip==='function')renderThemeStrip();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',activate);
 else activate();
})();