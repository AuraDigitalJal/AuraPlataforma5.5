(function auraPremiumWeddings(){
  'use strict';
  const premium=new Set(['wedding_mediterranean']);
  Object.assign(THEMES,{
    wedding_mediterranean:{...THEMES.wedding_mediterranean,label:'05 · Mediterránea editorial',display:"'Cormorant Garamond',serif",hero:'photo',ornament:'line',radius:'3px'}
  });
  Object.assign(AURA_THEME_PREVIEWS_531,{
    wedding_mediterranean:{src:'preview/assets/previews/weddings-premium/05.svg?v=2',kicker:'BODA · 05',title:'Mediterránea',note:'editorial · oliva · cerámica'}
  });
  // Sólo se publicita Mediterránea; no se borran definiciones antiguas, así
  // las invitaciones ya creadas siguen cargando por su identificador original.
  const retired=new Set(['wedding_layers','wedding_curves']);
  if(COLLECTIONS?.boda?.themes){
    COLLECTIONS.boda.themes=COLLECTIONS.boda.themes.filter(k=>!retired.has(k));
    COLLECTIONS.boda.note=COLLECTIONS.boda.themes.length+' propuestas de boda con paletas editables.';
  }
  const themeSelector=document.getElementById('themeVisual');
  if(themeSelector&&retired.has(themeSelector.value))
    themeSelector.value='wedding_mediterranean';
  const seams={
    wedding_mediterranean: `<svg viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true"><path class="ap-seam-fill" d="M0 22 C78 76 170 112 260 87 C320 75 368 43 400 22 L400 120 H0Z"/><path class="ap-seam-rule" d="M0 22 C78 76 170 112 260 87 C320 75 368 43 400 22"/></svg>`,
    wedding_layers: `<svg viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true"><path class="ap-seam-shadow" d="M0 60 L400 18 L400 120 H0Z"/><path class="ap-seam-fill" d="M0 79 L400 36 L400 120 H0Z"/><path class="ap-seam-rule" d="M0 79 L400 36"/></svg>`,
    wedding_curves: `<svg viewBox="0 0 400 130" preserveAspectRatio="none" aria-hidden="true"><path class="ap-seam-shadow" d="M0 13 C130 122 251 2 400 36 L400 130 H0Z"/><path class="ap-seam-fill" d="M0 48 C115 135 261 43 400 65 L400 130 H0Z"/><path class="ap-seam-rule" d="M0 48 C115 135 261 43 400 65"/></svg>`
  };
  const motif= `<svg class="ap-craft-sprig" viewBox="0 0 185 130" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" opacity=".65"><path d="M-8 105 Q75 92 158 14"/><path d="M42 99 Q56 68 54 48"/><path d="M77 82 Q89 49 96 32"/><path d="M108 56 Q135 65 152 46"/><path d="M28 105 Q40 118 65 119"/></g><g fill="currentColor" opacity=".38"><ellipse cx="52" cy="64" rx="9" ry="22" transform="rotate(-21 52 64)"/><ellipse cx="97" cy="41" rx="9" ry="20" transform="rotate(29 97 41)"/><ellipse cx="135" cy="58" rx="8" ry="19" transform="rotate(65 135 58)"/><ellipse cx="62" cy="115" rx="7" ry="18" transform="rotate(112 62 115)"/></g></svg>`;
  const _cover=coverHtml;
  coverHtml=function pairedCoverHtml(params){
 let html=_cover(params);
 const k=params?.themeVisual;
 if(!premium.has(k)||!html.includes('aura-story-cover'))return html;
 const source='<div class="hero-media"></div><div class="hero-overlay"></div>';
 if(!html.includes(source))return html;
 const art='<div class="ap-cover-photo-frame" aria-hidden="true">'+
   '<div class="hero-media"></div><div class="hero-overlay"></div>'+
   '<div class="ap-cover-seam ap-'+k+'">'+seams[k]+'</div></div>';
 html=html.replace(source,art);
 const sprig='<div class="ap-sprig-wrap" aria-hidden="true">'+motif+'</div>';
 return html.replace('<div class="hero-inner">',sprig+'<div class="hero-inner">');
};
  function decorationCss(p){
    if(!premium.has(p?.themeVisual))return '';
    const k=p.themeVisual,C='.theme-'+k;
    const base=p.bgContentColor||'#f8f2e9',outer=p.bgBodyColor||'#e9ded2',ink=p.headingColor||'#483b32',accent=p.primaryColor||'#ad8a69';
    const neutral=k==='wedding_mediterranean'?`color-mix(in srgb,${base} 91%,#fff7e6)`:k==='wedding_layers'?`color-mix(in srgb,${base} 91%,#f8ece3)`:`color-mix(in srgb,${base} 87%,#fff0ed)`;
    const paper=`background-color:var(--ap-card)!important;background-image:radial-gradient(ellipse at 13% 29%,${rgba(accent,.055)} 0,transparent 42%),radial-gradient(ellipse at 88% 90%,${rgba(ink,.025)},transparent 39%),repeating-linear-gradient(104deg,transparent 0 4px,${rgba(ink,.012)} 5px 6px,transparent 7px 14px)!important`;
    let css=`
${C}{--ap-card:${neutral};--ap-ink:${ink};--ap-accent:${accent};--ap-line:${rgba(accent,.48)};--ap-shadow:${rgba(ink,.12)}}
${C} .hero.aura-story-cover{height:auto!important;min-height:100svh!important;min-height:100dvh!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;align-items:stretch!important;gap:0!important;padding:clamp(410px,63svh,680px) 0 18px!important;position:relative!important;overflow:hidden!important;isolation:isolate;background:var(--ap-card)!important}
${C} .hero.aura-story-cover::before,${C} .hero.aura-story-cover::after{display:none!important;content:none!important}
${C} .hero.aura-story-cover .hero-media{position:absolute!important;inset:0 0 auto 0!important;height:clamp(400px,59svh,640px)!important;transform:none!important;filter:contrast(1.025) saturate(.9)}
${C} .hero.aura-story-cover .hero-overlay{position:absolute!important;inset:0 0 auto 0!important;height:clamp(400px,59svh,640px)!important;background:linear-gradient(0deg,${rgba(ink,.10)},transparent 45%)!important;pointer-events:none!important}
${C} .hero.aura-story-cover .ap-cover-seam{position:absolute!important;z-index:3!important;left:0!important;right:0!important;top:clamp(325px,48svh,527px)!important;height:clamp(85px,13svh,140px)!important;display:block!important;pointer-events:none!important}
${C} .hero.aura-story-cover .ap-cover-seam svg{width:100%;height:100%;display:block;overflow:visible}
${C} .ap-seam-fill{fill:var(--ap-card)!important}
${C} .ap-seam-shadow{fill:${rgba(accent,.19)}!important}
${C} .ap-seam-rule{fill:none;stroke:var(--ap-line);stroke-width:1.2;vector-effect:non-scaling-stroke}
${C} .hero.aura-story-cover .hero-inner{position:relative!important;z-index:5!important;width:min(100%,600px)!important;max-width:100%!important;min-width:0!important;align-self:center!important;margin:0 auto!important;padding:8px clamp(20px,6vw,45px) 20px!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;transform:none!important;text-align:center!important;color:var(--ap-ink)!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:center!important}
${C} .hero.aura-story-cover .hero-inner::before,${C} .hero.aura-story-cover .hero-inner::after{display:none!important;content:none!important}
${C} .hero.aura-story-cover .aura-editorial-copy{padding:0!important;position:relative;z-index:1}
${C} .hero.aura-story-cover .aura-editorial-copy .hero-kicker{color:var(--ap-ink)!important;opacity:.85!important;font:500 clamp(9px,2.4vw,12px)/1.4 var(--body)!important;letter-spacing:.31em!important;text-transform:uppercase!important;margin:2px 0 10px!important}
${C} .hero.aura-story-cover .aura-editorial-copy h1{color:var(--ap-ink)!important;text-shadow:none!important;font-family:var(--display)!important;font-size:clamp(43px,11.9vw,75px)!important;font-weight:400!important;line-height:.99!important;letter-spacing:-.04em!important;margin:0!important;text-wrap:balance;overflow-wrap:anywhere}
${C} .hero.aura-story-cover .aura-editorial-copy .aura-cover-date{color:var(--ap-ink)!important;opacity:.84!important;font:500 clamp(9px,2vw,11px)/1.5 var(--body)!important;letter-spacing:.17em!important;text-transform:uppercase!important;margin:13px auto 0!important}
${C} .hero.aura-story-cover .aura-editorial-copy p{color:var(--ap-ink)!important;text-shadow:none!important;max-width:34ch!important;font:400 clamp(11px,2.6vw,13px)/1.55 var(--body)!important;letter-spacing:.03em!important;margin:10px auto 0!important;opacity:.83!important}
${C} .hero.aura-story-cover .aura-cover-accent{display:none!important}
${C} .hero.aura-story-cover .aura-quick-actions{position:relative!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important;width:100%!important;margin:18px auto 0!important;max-width:460px!important}
${C} .hero.aura-story-cover .aura-quick-actions .aura-quick-action{position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;min-width:0!important;min-height:58px!important;max-width:none!important;margin:0!important;padding:8px 5px!important;border:1px solid ${rgba(ink,.21)}!important;border-radius:4px!important;background:${rgba(base,.32)}!important;color:var(--ap-ink)!important;box-shadow:none!important;backdrop-filter:none!important;white-space:normal!important}
${C} .hero.aura-story-cover .aura-quick-actions .aura-quick-action span{color:var(--ap-ink)!important;font-size:10px!important;text-align:center!important;line-height:1.25!important}
${C} .hero.aura-story-cover .aura-quick-actions .aura-quick-action b{display:none!important}
${C} .hero.aura-story-cover .aura-quick-actions svg{height:17px!important;width:17px!important}
${C} .hero.aura-story-cover .enter-btn,${C} .hero.aura-story-cover .aura-enter{position:relative!important;z-index:6!important;display:flex!important;justify-content:center!important;align-items:center!important;width:min(100%,460px)!important;min-height:44px!important;padding:10px 20px!important;margin:10px auto 0!important;border-radius:4px!important;border:1px solid ${rgba(ink,.22)}!important;background:${rgba(accent,.13)}!important;color:var(--ap-ink)!important;box-shadow:none!important;backdrop-filter:none!important}
${C} .hero.aura-story-cover .scroll-note{position:relative!important;z-index:5!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;text-align:center!important;color:var(--ap-ink)!important;font:400 9px/1.6 var(--body)!important;letter-spacing:.19em!important;margin:2px auto 8px!important;opacity:.7!important}
${C} .hero.aura-story-cover .ap-sprig-wrap{position:absolute;z-index:4;left:-14px;top:clamp(353px,53svh,569px);width:145px;height:110px;pointer-events:none;opacity:.65;color:var(--ap-accent)}
${C} .hero.aura-story-cover .ap-craft-sprig{width:100%;height:100%;display:block}
${C} .page .content .aura-screen{background:var(--ap-card)!important;${paper};min-height:0!important}
${C} .page .content .aura-screen::before,${C} .page .content .aura-screen::after{display:none!important;content:none!important}
${C} .page .content .aura-screen-shell{position:relative!important;width:min(100%,660px)!important;margin:0 auto!important;padding:0 clamp(14px,4vw,28px)!important}
${C} .page .content .aura-stage-photo{filter:saturate(.87) contrast(1.02)!important;box-shadow:none!important;transform:none!important}
${C} .page .content .aura-date-panel,${C} .page .content .aura-family-panel,${C} .page .content .aura-location-panel,${C} .page .content .aura-close-panel,${C} .page .content .aura-confirm-panel,${C} .page .content .aura-transfer-panel,${C} .page .content .aura-video-panel{position:relative!important;z-index:2!important;transform:none!important;max-width:100%!important;box-sizing:border-box!important;text-align:center!important}
${C} .page .content .aura-screen .section-label{font:500 10px/1.45 var(--body)!important;letter-spacing:.24em!important;color:${accent}!important;text-transform:uppercase!important}
${C} .page .content .aura-screen h2{font-family:var(--display)!important;letter-spacing:-.025em!important;line-height:1.1!important}
@media(max-width:420px){
${C} .hero.aura-story-cover{padding-top:clamp(365px,62svh,610px)!important}
${C} .hero.aura-story-cover .hero-media,${C} .hero.aura-story-cover .hero-overlay{height:clamp(355px,58svh,580px)!important}
${C} .hero.aura-story-cover .ap-cover-seam{top:clamp(290px,46svh,465px)!important}
${C} .hero.aura-story-cover .ap-sprig-wrap{top:clamp(315px,51svh,510px)!important}
${C} .hero.aura-story-cover .hero-inner{padding-left:21px!important;padding-right:21px!important}
${C} .hero.aura-story-cover .aura-editorial-copy h1{font-size:clamp(37px,10.6vw,53px)!important}
}
`;
    if(k==='wedding_mediterranean'){
      css+=`
${C} .hero.aura-story-cover .hero-media{clip-path:inset(0 round 0 0 0 0)!important}
${C} .hero.aura-story-cover .hero-inner{padding-top:6px!important}
${C} .hero.aura-story-cover .aura-editorial-copy h1{font-style:italic!important}
${C} .hero.aura-story-cover .aura-editorial-copy .hero-kicker{color:var(--ap-accent)!important}
${C} .hero.aura-story-cover .hero-inner .aura-editorial-copy::before{content:'✥';display:block;color:var(--ap-accent);font:18px/1.5 Georgia,serif;letter-spacing:0;margin:0 auto 8px}
${C} .hero.aura-story-cover .ap-cover-seam{height:clamp(90px,14svh,145px)!important}
${C} .page .content .aura-screen{background-image:radial-gradient(ellipse at 15% 6%,${rgba(accent,.065)},transparent 44%),repeating-linear-gradient(110deg,transparent 0 7px,${rgba(ink,.014)} 8px 9px,transparent 10px 19px)!important}
${C} .page .content .aura-stage-photo{border-radius:48% 48% 3px 3px / 12% 12% 0 0!important}
${C} .page .content .aura-date-panel,${C} .page .content .aura-family-panel,${C} .page .content .aura-location-panel,${C} .page .content .aura-video-panel,${C} .page .content .aura-transfer-panel{width:94%!important;margin:-24px auto 0!important;border:1px solid ${rgba(accent,.19)}!important;border-radius:2px!important;background:var(--ap-card)!important;box-shadow:0 12px 25px ${rgba(ink,.035)}!important}
`;
    }else if(k==='wedding_layers'){
      css+=`
${C} .hero.aura-story-cover{background:linear-gradient(140deg,${rgba(accent,.08)},transparent 45%),var(--ap-card)!important}
${C} .hero.aura-story-cover .hero-media{inset:16px 17px auto 17px!important;width:auto!important;height:clamp(385px,58svh,615px)!important;border:11px solid ${rgba(base,.96)}!important;outline:1px solid ${rgba(ink,.12)}!important;box-shadow:0 13px 26px ${rgba(ink,.14)}!important}
${C} .hero.aura-story-cover .hero-overlay{inset:25px 24px auto 24px!important;height:clamp(367px,55svh,593px)!important}
${C} .hero.aura-story-cover .ap-cover-seam{transform:rotate(-4deg) scale(1.14);transform-origin:center!important;height:126px!important}
${C} .hero.aura-story-cover .hero-inner{margin-top:0!important;padding:18px clamp(24px,6vw,47px) 26px!important;max-width:560px!important;background:var(--ap-card)!important;box-shadow:0 18px 38px ${rgba(ink,.09)}!important;outline:1px solid ${rgba(accent,.21)}!important}
${C} .hero.aura-story-cover .hero-inner::before{content:''!important;display:block!important;width:52px!important;height:2px!important;margin:0 auto 14px!important;background:var(--ap-accent)!important;opacity:.5}
${C} .hero.aura-story-cover .ap-sprig-wrap{left:-8px!important;top:clamp(380px,54svh,590px)!important;transform:rotate(-12deg)!important}
${C} .page .content .aura-screen{background-image:linear-gradient(140deg,${rgba(ink,.03)} 0 12%,transparent 36%),linear-gradient(19deg,${rgba(accent,.04)},transparent 65%)!important}
${C} .page .content .aura-stage-photo{width:92%!important;margin:0 auto!important;aspect-ratio:4/5!important;border:9px solid ${rgba(base,.93)}!important;outline:1px solid ${rgba(ink,.09)}!important;border-radius:2px!important;box-shadow:0 13px 26px ${rgba(ink,.09)}!important}
${C} .page .content .aura-date-panel,${C} .page .content .aura-family-panel,${C} .page .content .aura-location-panel,${C} .page .content .aura-video-panel,${C} .page .content .aura-transfer-panel{width:94%!important;margin:-27px auto 0!important;border-radius:2px!important;border:1px solid ${rgba(accent,.24)}!important;background:var(--ap-card)!important;box-shadow:0 14px 24px ${rgba(ink,.06)}!important;padding:26px 22px!important}
`;
    }else{
      css+=`
${C} .hero.aura-story-cover{background:linear-gradient(155deg,${rgba(accent,.10)},transparent 48%),var(--ap-card)!important}
${C} .hero.aura-story-cover .hero-media{clip-path:none!important}
${C} .hero.aura-story-cover .ap-cover-seam{height:clamp(108px,15svh,170px)!important}
${C} .hero.aura-story-cover .hero-inner{padding-top:3px!important}
${C} .hero.aura-story-cover .ap-sprig-wrap{opacity:.33;left:auto!important;right:-20px!important;transform:scaleX(-1)!important}
${C} .hero.aura-story-cover .hero-kicker{color:var(--ap-accent)!important}
${C} .hero.aura-story-cover h1{font-style:italic!important;font-size:clamp(42px,11vw,67px)!important}
${C} .hero.aura-story-cover .enter-btn{border-radius:999px!important}
${C} .page .content .aura-screen{background-image:radial-gradient(ellipse at -10% 12%,${rgba(accent,.11)},transparent 52%),radial-gradient(ellipse at 112% 96%,${rgba(ink,.035)},transparent 48%)!important}
${C} .page .content .aura-stage-photo{border-radius:52% 48% 2px 2px / 12% 12% 0 0!important}
${C} .page .content .aura-date-panel,${C} .page .content .aura-family-panel,${C} .page .content .aura-location-panel,${C} .page .content .aura-video-panel,${C} .page .content .aura-transfer-panel{width:96%!important;margin:-34px auto 0!important;border-radius:42px 42px 14px 14px!important;background:var(--ap-card)!important;border:1px solid ${rgba(accent,.16)}!important;box-shadow:0 10px 29px ${rgba(ink,.04)}!important}
`;
    }
    return css+parameterResponsiveCss(p)+artDirectedLayoutCss(p);
  }
  function artDirectedLayoutCss(p){
  const k=p.themeVisual;
  const C='.theme-'+k;
  const v=bounded(p.contentBgOpacity,.94,0,1);
  const base=p.bgContentColor||'#fcf8f1',ink=p.headingColor||'#44342e',accent=p.primaryColor||'#aa8171';
  const matte=rgba(base,v), tinted=rgba(base,v*.92), line=rgba(accent,v*.27);
  const has=['.aura-screen-date','.aura-screen-family','.aura-screen-location'];
  const image=['.aura-date-photo','.aura-family-photo','.aura-location-photo'];
  const panels=['.aura-date-panel','.aura-family-panel','.aura-location-panel'];
  const shellSel=has.map(h=>C+' .page .content '+h+':has(.aura-stage-photo:not(.aura-stage-photo-empty)) .aura-screen-shell').join(',');
  const imageSel=image.map(h=>C+' .page .content '+h+':not(.aura-stage-photo-empty)').join(',');
  const panelSel=has.map((h,i)=>C+' .page .content '+h+':has(.aura-stage-photo:not(.aura-stage-photo-empty)) '+panels[i]).join(',');
  const familyWrap=C+' .page .content .aura-screen-family:has(.aura-family-photo:not(.aura-stage-photo-empty)) .aura-family-portrait';
  const close=C+' .page .content .aura-screen-close:has(.aura-close-photo:not(.aura-stage-photo-empty))';
  let css=`
/* BOUTIQUE v5 - composiciones fotografica/editorial. Portada intacta. */
${shellSel}{
  position:relative!important;isolation:isolate!important;display:block!important;
  box-sizing:border-box!important;max-width:610px!important;
  min-height:0!important;height:auto!important;overflow:visible!important;
}
${imageSel}{
  position:relative!important;inset:auto!important;display:block!important;
  height:clamp(350px,58svh,590px)!important;
  max-height:none!important;min-height:0!important;
  background-size:cover!important;
  box-sizing:border-box!important;z-index:1!important;
  filter:none!important;transform:none!important;
}
${panelSel}{
  position:relative!important;inset:auto!important;box-sizing:border-box!important;
  height:auto!important;min-height:0!important;max-width:100%!important;
  z-index:3!important;text-align:center!important;
  -webkit-backdrop-filter:none!important;backdrop-filter:none!important;
}
${familyWrap}{
  display:block!important;position:relative!important;inset:auto!important;
  min-height:0!important;height:auto!important;z-index:1!important;
  padding:0!important;margin:0!important;width:100%!important;
}
${imageSel.split(',').map(s=>s+'::after').join(',')}{
  content:none!important;display:none!important;background:none!important;
}
/* El cierre es una composición fotográfica autónoma, no una tarjeta debajo. */
${close} .aura-close-shell{
  position:relative!important;isolation:isolate!important;
  display:grid!important;grid-template-columns:minmax(0,1fr)!important;
  grid-template-rows:minmax(clamp(470px,74svh,740px),auto)!important;
  width:min(100%,650px)!important;max-width:650px!important;
  min-height:0!important;height:auto!important;
  align-items:stretch!important;justify-items:center!important;
  padding:0 clamp(9px,2vw,18px)!important;
  overflow:visible!important;
}
${close} .aura-close-photo:not(.aura-stage-photo-empty){
  grid-area:1/1!important;position:relative!important;inset:auto!important;
  align-self:stretch!important;justify-self:stretch!important;
  width:100%!important;max-width:none!important;
  height:100%!important;min-height:clamp(470px,74svh,740px)!important;max-height:none!important;
  margin:0!important;background-size:cover!important;
  background-position:center!important;
  border:0!important;box-shadow:none!important;filter:none!important;transform:none!important;
  border-radius:24px!important;z-index:1!important;
}
${close} .aura-close-photo::after{
  content:none!important;display:none!important;background:none!important;
}
${close} .aura-close-panel{
  grid-area:1/1!important;align-self:end!important;justify-self:center!important;
  position:relative!important;inset:auto!important;z-index:3!important;
  width:min(88%,480px)!important;max-width:100%!important;
  margin:0 auto 23px!important;
  padding:clamp(24px,7vw,44px) clamp(18px,5vw,36px)!important;
  border:1px solid ${line}!important;
  border-radius:23px!important;
  background:${matte}!important;background-image:none!important;
  box-shadow:0 14px 38px ${rgba(ink,v*.14)}!important;
  color:${ink}!important;transform:none!important;
  -webkit-backdrop-filter:none!important;backdrop-filter:none!important;
}
${C} .page .content .aura-screen-close:not(:has(.aura-close-photo:not(.aura-stage-photo-empty))) .aura-close-panel{
  display:block!important;margin:0 auto!important;position:relative!important;
}
@media(max-width:420px){
${close} .aura-close-shell{grid-template-rows:minmax(490px,auto)!important}
${close} .aura-close-photo:not(.aura-stage-photo-empty){min-height:490px!important}
${close} .aura-close-panel{width:92%!important;margin-bottom:15px!important}
}
`;
  if(k==='wedding_mediterranean'){
    css+=`
/* 05 — único nicho arquitectónico: foto y texto pertenecen a la misma pieza. */
${shellSel}{
  padding:clamp(12px,3vw,19px) clamp(12px,3vw,19px) 22px!important;
  border:1px solid ${line}!important;
  border-radius:230px 230px 16px 16px / 125px 125px 16px 16px!important;
  background:${rgba(base,v*.94)}!important;
  box-shadow:0 18px 40px ${rgba(ink,v*.045)}!important;
}
${imageSel}{
  width:100%!important;max-width:none!important;
  height:clamp(340px,54svh,570px)!important;
  border:0!important;outline:0!important;
  margin:0 auto!important;
  border-radius:220px 220px 4px 4px / 123px 123px 4px 4px!important;
  box-shadow:none!important;
}
${familyWrap}{width:100%!important}
${panelSel}{
  width:100%!important;max-width:none!important;
  margin:0 auto!important;
  padding:clamp(30px,7vw,48px) clamp(15px,5vw,36px) 28px!important;
  border:0!important;border-radius:0!important;
  background:transparent!important;background-image:none!important;
  box-shadow:none!important;transform:none!important;
}
/* Un remate arquitectónico que está pegado al marco, no flota en el contenido. */
${has.map((h)=>C+' .page .content '+h+':has(.aura-stage-photo:not(.aura-stage-photo-empty)) .aura-screen-shell::after').join(',')}{
  content:''!important;display:block!important;
  position:absolute!important;inset:auto 20% 13px 20%!important;
  height:1px!important;background:${rgba(accent,v*.34)}!important;
  pointer-events:none!important;
}
${close} .aura-close-photo:not(.aura-stage-photo-empty){
  border-radius:220px 220px 11px 11px / 115px 115px 11px 11px!important}
${close} .aura-close-panel{
  border-radius:18px!important;
  width:min(84%,450px)!important;
}
`;
  } else if(k==='wedding_layers'){
    css+=`
/* 06 — la fotografía y el texto se cruzan como hojas de una composición real. */
${shellSel}{
  padding:12px 12px 24px!important;
  background:transparent!important;border:0!important;
}
${imageSel}{
  width:85%!important;max-width:510px!important;
  margin:0 auto 0 2%!important;
  height:clamp(370px,55svh,570px)!important;
  border:clamp(7px,2.5vw,12px) solid ${rgba(base,Math.max(.22,v*.95))}!important;
  border-radius:3px!important;outline:1px solid ${rgba(accent,v*.2)}!important;
  box-shadow:15px 17px 0 ${rgba(accent,v*.115)},0 23px 45px ${rgba(ink,v*.16)}!important;
  transform:rotate(-2.25deg)!important;
  transform-origin:center!important;
}
${familyWrap}{margin:0!important}
${panelSel}{
  width:81%!important;max-width:490px!important;
  margin:-130px 1% 12px auto!important;
  padding:clamp(28px,7vw,48px) clamp(17px,5vw,33px)!important;
  border:1px solid ${line}!important;
  border-radius:3px!important;
  background:${matte}!important;
  box-shadow:-12px 14px 0 ${rgba(accent,v*.105)},0 24px 46px ${rgba(ink,v*.12)}!important;
  transform:rotate(.9deg)!important;
}
${close} .aura-close-photo:not(.aura-stage-photo-empty){
  border:clamp(7px,2vw,11px) solid ${rgba(base,Math.max(.25,v*.86))}!important;
  border-radius:3px!important;transform:rotate(-1deg)!important;
  box-shadow:11px 12px 0 ${rgba(accent,v*.12)}!important;
}
${close} .aura-close-panel{
  width:min(76%,435px)!important;
  margin:0 4% 24px auto!important;
  border-radius:3px!important;
  box-shadow:-10px 12px 0 ${rgba(accent,v*.13)},0 19px 35px ${rgba(ink,v*.14)}!important;
  transform:rotate(.8deg)!important;
}
@media(max-width:420px){
${panelSel}{width:87%!important;margin-top:-105px!important}
${close} .aura-close-panel{width:82%!important}
}
`;
  } else if(k==='wedding_curves'){
    css+=`
/* 08 — una sola silueta ondulante: la tarjeta es continuación del recorte. */
${shellSel}{
  padding:0 0 14px!important;
  background:${rgba(base,v*.26)}!important;
  border-radius:140px 140px 34px 34px / 80px 80px 34px 34px!important;
  overflow:visible!important;
  box-shadow:0 17px 42px ${rgba(ink,v*.08)}!important;
}
${imageSel}{
  width:100%!important;max-width:none!important;
  margin:0!important;height:clamp(365px,57svh,580px)!important;
  border:0!important;outline:0!important;box-shadow:none!important;
  border-radius:46% 46% 0 0 / 14% 14% 0 0!important;
  clip-path:polygon(0 0,100% 0,100% 96%,95% 94%,90% 92%,85% 90%,
   80% 88%,75% 86%,70% 83%,65% 81%,60% 79%,55% 78%,50% 78%,
   45% 78%,40% 79%,35% 81%,30% 83%,25% 86%,20% 88%,15% 90%,
   10% 92%,5% 94%,0 96%)!important;
}
${panelSel}{
  width:100%!important;max-width:none!important;
  margin:-105px auto 0!important;
  padding:clamp(72px,15vw,103px) clamp(19px,6vw,44px) 30px!important;
  border:0!important;border-radius:54% 46% 31px 31px / 85px 73px 31px 31px!important;
  background:${matte}!important;background-image:none!important;
  box-shadow:none!important;transform:none!important;
}
/* La tarjeta coincide con el borde de la fotografía; nada se superpone a la cara. */
${close} .aura-close-photo:not(.aura-stage-photo-empty){
  border-radius:46% 46% 32px 32px / 14% 14% 32px 32px!important}
${close} .aura-close-panel{
  width:min(89%,480px)!important;
  border-radius:55px 26px 49px 25px!important;
}
@media(max-width:420px){
${panelSel}{margin-top:-95px!important;padding-top:73px!important}
}
`;
  }
  return css;
}
  function parameterResponsiveCss(p){
 const k=p.themeVisual,C='.theme-'+k, opacity=bounded(p.contentBgOpacity,.94,0,1),
 buttonOpacity=bounded(p.buttonOpacity,.92,0,1),
 veil=bounded(p.overlayOpacity,.42,0,1),backgroundVeil=bounded(p.bgOverlayOpacity,.82,0,1);
 const base=p.bgContentColor||'#faf6f0',accent=p.primaryColor||'#ab897a',ink=p.headingColor||'#483932';
 const buttonStyle=String(p.buttonStyle||'rounded');
 const buttonBg=buttonStyle==='text_only'||buttonStyle==='outline_thin'?'transparent':
   buttonStyle==='glass_soft'?rgba(base,buttonOpacity):rgba(accent,buttonOpacity);
 const buttonRadius=buttonStyle==='pill'||buttonStyle==='glass_soft'?'999px':
   buttonStyle==='rounded'?'14px':buttonStyle==='square'?'0px':'4px';
 const blur={none:'none',light:'blur(6px)',strong:'blur(14px)'}[p.contentBlur]||'none';
 const photoRadius=k==='wedding_mediterranean'?'48% 48% 22px 22px / 17% 17% 22px 22px':
   k==='wedding_layers'?'32px 32px 12px 12px':'52% 48% 54px 34px / 14% 14% 12% 9%';
 const panelRadius=k==='wedding_mediterranean'?'32px 32px 18px 18px':
   k==='wedding_layers'?'18px 42px 24px 34px':'62px 29px 58px 24px';
 const frame=k==='wedding_layers'?'8px':'0px';
 const photoShadow=k==='wedding_layers'?`0 16px 34px ${rgba(ink,.105)}`:`0 12px 25px ${rgba(ink,.065)}`;
 const photoFrame=k==='wedding_layers'?rgba(base,Math.max(.62,opacity)): 'transparent';
 const photoLayout=['.aura-screen-date','.aura-screen-family','.aura-screen-location'];
 const shells=photoLayout.map(q=>C+' .page .content '+q+' .aura-screen-shell').join(',');
 const photos=['.aura-date-photo','.aura-family-photo','.aura-location-photo'].map(q=>C+' .page .content '+q).join(',');
 const photoBefore=['.aura-date-photo','.aura-family-photo','.aura-location-photo','.aura-close-photo'].map(q=>C+' .page .content '+q+'::after').join(',');
 const stagePanels=['.aura-date-panel','.aura-family-panel','.aura-location-panel'].map(q=>C+' .page .content '+q).join(',');
 const withPhoto=['.aura-screen-date .aura-date-panel','.aura-screen-family .aura-family-panel','.aura-screen-location .aura-location-panel'].map(q=>{
   const [stage,panel]=q.split(' ');
   return C+' .page .content '+stage+':has(.aura-stage-photo:not(.aura-stage-photo-empty)) '+panel;
 }).join(',');
 const otherPanels=['.aura-confirm-panel','.aura-transfer-panel','.aura-video-panel'].map(q=>C+' .page .content '+q).join(',');
 const paper=rgba(base,opacity),outline=rgba(accent,opacity*.27);
 return `
/* V3: tarjetas estructurales sin degradados ni pseudo-capas en fotos. */
${C} .background-veil{background:${rgba(p.bgBodyColor||'#f3eee8',backgroundVeil)}!important}
${C} .hero.aura-story-cover .hero-overlay{background:${rgba(p.overlayColor||'#16130f',veil)}!important;opacity:1!important}
${C} .hero.aura-story-cover .aura-quick-actions .aura-quick-action{
 background:${buttonBg}!important;border-color:${rgba(ink,buttonOpacity*.25)}!important;
 border-radius:${buttonRadius}!important}
${C} .hero.aura-story-cover .enter-btn,${C} .hero.aura-story-cover .aura-enter,${C} .hero.aura-story-cover button[data-enter]{
 background:${buttonBg}!important;border-color:${rgba(ink,buttonOpacity*.3)}!important;
 border-radius:${buttonRadius}!important}
${C} .page,${C} .page .content{background:transparent!important}
${C} .page .content .aura-screen{
 background-color:${rgba(p.bgBodyColor||'#f3eee8',opacity*.46)}!important;
 background-image:none!important;
 -webkit-backdrop-filter:${blur}!important;backdrop-filter:${blur}!important}
${shells}{display:block!important;grid-template-columns:none!important;perspective:none!important;
 min-height:0!important;height:auto!important}
${C} .page .content .aura-family-portrait{
 position:relative!important;inset:auto!important;width:min(100%,560px)!important;
 margin:0 auto!important;padding:0!important;z-index:1!important;display:block!important}
${C} .page .content .aura-screen-family:not(:has(.aura-family-photo:not(.aura-stage-photo-empty))) .aura-family-portrait{display:none!important}
${photos}{
 display:block!important;position:relative!important;inset:auto!important;
 box-sizing:border-box!important;width:min(100%,560px)!important;
 height:clamp(330px,55svh,565px)!important;min-height:0!important;max-height:none!important;
 margin:0 auto!important;transform:none!important;
 border:${frame} solid ${photoFrame}!important;
 border-radius:${photoRadius}!important;
 background-size:cover!important;overflow:hidden!important;
 box-shadow:${photoShadow}!important}
${photoBefore}{content:none!important;display:none!important;background:none!important}
${stagePanels}{
 position:relative!important;inset:auto!important;z-index:3!important;
 width:min(96%,540px)!important;max-width:100%!important;min-height:0!important;
 margin:0 auto!important;padding:clamp(30px,7vw,45px) clamp(18px,5vw,32px)!important;
 border:1px solid ${outline}!important;border-radius:${panelRadius}!important;
 background:${paper}!important;background-image:none!important;
 box-shadow:0 13px 30px ${rgba(ink,opacity*.075)}!important;
 -webkit-backdrop-filter:${blur}!important;backdrop-filter:${blur}!important;
 text-align:center!important;transform:none!important}
${withPhoto}{margin-top:-36px!important}
${C} .page .content .aura-screen-family:has(.aura-family-photo:not(.aura-stage-photo-empty)) .aura-family-panel{
 padding-top:clamp(34px,7vw,48px)!important}
${C} .page .content .aura-screen:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))) .aura-date-panel,
${C} .page .content .aura-screen:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))) .aura-family-panel,
${C} .page .content .aura-screen:not(:has(.aura-stage-photo:not(.aura-stage-photo-empty))) .aura-location-panel{
 margin-top:0!important}
${otherPanels}{margin:0 auto!important;padding:clamp(32px,8vw,50px) clamp(18px,6vw,34px)!important;
 width:min(96%,540px)!important;max-width:100%!important;
 background:${paper}!important;background-image:none!important;
 border:1px solid ${outline}!important;border-radius:${panelRadius}!important;
 -webkit-backdrop-filter:${blur}!important;backdrop-filter:${blur}!important;
 box-shadow:0 10px 25px ${rgba(ink,opacity*.05)}!important;transform:none!important}
${C} .page .content .aura-map-preview{border-radius:clamp(15px,4vw,25px)!important;overflow:hidden!important}
/* Cierre: estructura independiente, imagen intacta y a escala real. */
${C} .page .content .aura-screen-close:has(.aura-close-photo:not(.aura-stage-photo-empty)) .aura-close-shell{
 display:flex!important;flex-direction:column!important;align-items:center!important;
 justify-content:flex-start!important;gap:0!important;min-height:0!important;height:auto!important;
 padding:0 clamp(14px,4vw,26px)!important;overflow:visible!important}
${C} .page .content .aura-screen-close .aura-close-photo:not(.aura-stage-photo-empty){
 position:relative!important;inset:auto!important;display:block!important;
 width:100%!important;max-width:560px!important;
 height:clamp(390px,63svh,680px)!important;min-height:0!important;max-height:none!important;
 margin:0 auto!important;transform:none!important;filter:none!important;
 background-size:cover!important;overflow:hidden!important;
 border:0!important;border-radius:${photoRadius}!important;
 box-shadow:${photoShadow}!important;z-index:1!important}
${C} .page .content .aura-screen-close .aura-close-photo::after{
 content:none!important;display:none!important;background:none!important}
${C} .page .content .aura-screen-close .aura-close-panel{
 position:relative!important;inset:auto!important;z-index:3!important;
 width:min(96%,540px)!important;max-width:100%!important;
 margin:0 auto!important;padding:clamp(35px,8vw,52px) clamp(18px,6vw,32px)!important;
 border:1px solid ${outline}!important;border-radius:${panelRadius}!important;
 background:${paper}!important;background-image:none!important;
 -webkit-backdrop-filter:${blur}!important;backdrop-filter:${blur}!important;
 box-shadow:0 10px 25px ${rgba(ink,opacity*.065)}!important;
 color:${ink}!important;text-align:center!important;transform:none!important}
${C} .page .content .aura-screen-close:has(.aura-close-photo:not(.aura-stage-photo-empty)) .aura-close-panel{
 margin-top:-39px!important}
${C} .page .content .aura-screen-close .aura-close-panel .final-message,
${C} .page .content .aura-screen-close .aura-close-panel .section-label,
${C} .page .content .aura-screen-close .aura-close-panel .closing-signature{
 color:inherit!important;text-shadow:none!important}
${C} .page .content .aura-screen-close:not(:has(.aura-close-photo:not(.aura-stage-photo-empty))) .aura-close-shell{
 display:block!important;min-height:0!important;height:auto!important}
${C} .page .content .aura-screen-close:not(:has(.aura-close-photo:not(.aura-stage-photo-empty))) .aura-close-panel{
 margin:0 auto!important}
@media(max-width:420px){
${C} .page .content .aura-screen-close .aura-close-photo:not(.aura-stage-photo-empty){
 height:clamp(350px,56svh,570px)!important}
${C} .page .content .aura-screen-family .aura-family-portrait{width:100%!important}
}
`;
}
  /* Encuadre de portada Mediterránea: la curva no mueve la foto; la cubre.
     Foto, curva y remate se sincronizan desde los controles editables. */
  function mediterraneanCoverFramingCss(p){
 if(p?.themeVisual!=='wedding_mediterranean')return '';
 const C='.theme-wedding_mediterranean';
 const photoX=bounded(p.auraHeroPhotoX,50,0,100);
 const photoY=bounded(p.auraHeroPhotoY,50,0,100);
 const curve=bounded(p.auraHeroCurveY,56,45,62);
 // El control representa el nivel real de la transición; no se añade un segundo bloque de foto.
 const waveDepth=10;
 const photoBottom=curve+3;
 const textOffset=bounded(p.heroOffset,0,-200,200);
 return `
/* El marco fotográfico contiene el SVG de la curva y el velo, sin medidas divergentes. */
${C} .hero.aura-story-cover{
 --med-photo-bottom:${photoBottom}svh;
 --med-wave-depth:${waveDepth}svh;
 min-height:100svh!important;
 height:auto!important;
 justify-content:flex-start!important;
 padding-top:calc(var(--med-photo-bottom) + .5svh)!important;
 padding-bottom:clamp(12px,2svh,20px)!important;
}
${C} .hero.aura-story-cover .ap-cover-photo-frame{
 position:absolute!important;inset:0 0 auto 0!important;
 width:100%!important;height:var(--med-photo-bottom)!important;
 overflow:hidden!important;isolation:isolate!important;
 z-index:1!important;pointer-events:none!important;
}
${C} .hero.aura-story-cover .ap-cover-photo-frame .hero-media,
${C} .hero.aura-story-cover .ap-cover-photo-frame .hero-overlay{
 position:absolute!important;top:0!important;left:0!important;
 right:0!important;bottom:0!important;inset:0!important;
 display:block!important;width:100%!important;height:100%!important;
 max-height:none!important;min-height:0!important;
 clip-path:none!important;transform:none!important;
}
${C} .hero.aura-story-cover .ap-cover-photo-frame .hero-media{
 z-index:1!important;
 background-size:cover!important;
 background-position:${photoX}% ${photoY}%!important;
 background-repeat:no-repeat!important;
}
${C} .hero.aura-story-cover .ap-cover-photo-frame .hero-overlay{
 z-index:2!important;pointer-events:none!important;
}
${C} .hero.aura-story-cover .ap-cover-photo-frame .ap-cover-seam{
 display:block!important;position:absolute!important;
 top:auto!important;bottom:-1px!important;left:0!important;right:0!important;
 width:100%!important;height:var(--med-wave-depth)!important;
 z-index:3!important;pointer-events:none!important;
 transform:none!important;
}
${C} .hero.aura-story-cover .ap-cover-photo-frame .ap-cover-seam svg{
 width:100%!important;height:100%!important;display:block!important;
 overflow:hidden!important;
}
${C} .hero.aura-story-cover .ap-sprig-wrap{
 top:calc(var(--med-photo-bottom) - 8svh)!important;
 z-index:4!important;
}
${C} .hero.aura-story-cover .hero-inner{
 transform:translateY(${textOffset}px)!important;
 position:relative!important;z-index:5!important;
}
`;
}
  const _getFormParamsMed=getFormParams;
  getFormParams=function(){
    const p=_getFormParamsMed();
    p.auraHeroPhotoX=document.getElementById('auraHeroPhotoX')?.value??'50';
    p.auraHeroPhotoY=document.getElementById('auraHeroPhotoY')?.value??'50';
    p.auraHeroCurveY=document.getElementById('auraHeroCurveY')?.value??'56';
    return p;
  };
  const _applyConfigMed=applyConfig;
  applyConfig=function(cfg){
    for(const [id,def] of [['auraHeroPhotoX','50'],['auraHeroPhotoY','50'],['auraHeroCurveY','56']]){
      if(cfg?.[id]===undefined||cfg[id]===null){
        const control=document.getElementById(id);
        if(control)control.value=def;
      }
    }
    return _applyConfigMed(cfg);
  };
  function syncMediterraneanCoverControls(){
    const panel=document.getElementById('medCoverAdjustments');
    if(!panel)return;
    const current=isEditorialBannerGalleryTheme({themeVisual:document.getElementById('themeVisual')?.value});
    panel.hidden=!current;
    panel.style.display=current?'':'none';
  }
  const _renderThemeStripMed=renderThemeStrip;
  renderThemeStrip=function(...args){
    const out=_renderThemeStripMed(...args);
    syncMediterraneanCoverControls();
    return out;
  };
  function mediterraneanTextFlowCss(p){
 if(p?.themeVisual!=='wedding_mediterranean')return '';
 const C='.theme-wedding_mediterranean';
 // Sólo el texto de Ubicación y Cierre. No se fuerza text-align.
 const locationSize=p.locationsHeadingSize&&p.locationsHeadingSize!=='auto'?'':'font-size:clamp(30px,7.8vw,46px);';
 const closeSize=p.mainMessageSize&&p.mainMessageSize!=='auto'?'':'font-size:clamp(30px,8vw,45px);';
 return `
/* Editorial legible: sin columnas de 12 caracteres ni cortes de palabra. */
${C} .page .content .aura-screen-location .aura-location-panel>h2{
 display:block!important;
 box-sizing:border-box!important;
 max-width:100%!important;width:100%!important;min-width:0!important;
 margin-left:0!important;margin-right:0!important;
 white-space:normal!important;word-break:normal!important;
 overflow-wrap:normal!important;hyphens:none!important;
 text-wrap:pretty!important;
 ${locationSize}
}
${C} .page .content .aura-screen-close .aura-close-panel .final-message{
 display:block!important;
 box-sizing:border-box!important;
 max-width:100%!important;width:100%!important;min-width:0!important;
 margin-left:0!important;margin-right:0!important;
 white-space:normal!important;word-break:normal!important;
 overflow-wrap:normal!important;hyphens:none!important;
 text-wrap:pretty!important;
 line-height:1.18!important;
 ${closeSize}
}
${C} .page .content .aura-screen-location .aura-location-panel,
${C} .page .content .aura-screen-close .aura-close-panel{
 min-width:0!important;
}
`;
}
  function mediterraneanGalleryRespectCss(p){
  if(p?.themeVisual!=='wedding_mediterranean')return '';
  const C='.theme-wedding_mediterranean';
  // El estilo de la galería, NO el tema, controla tamaño, forma y distribución.
  // Aplicar después de weddingThemeCss55 y editionCss para ganar a 110px!important.
  const normalize=`
${C} .aura-screen-gallery .aura-gallery-tile{
 border-radius:2px!important;
 box-shadow:none!important;
 outline:0!important;
 transform:none!important;
}
${C} .aura-screen-gallery .aura-gallery-grid{
 grid-auto-rows:auto!important;
}
`;
  // Reutilizar los diez modos oficiales, sin duplicar sus reglas o cambiar
  // object-position / object-fit configurados para cada fotografía.
  return normalize+(typeof auraGalleryStyleCss555==='function'?auraGalleryStyleCss555(p):'');
}
  // Solo en pruebas: estilos de Aura Editorial y colección de boda 01–10.
  function isEditorialBannerGalleryTheme(p){
   const id=p?.themeVisual;
   return id==='aura_editorial_boda'||id==='aura_editorial_xv'||(typeof WEDDING_THEME_IDS_55!=='undefined'&&WEDDING_THEME_IDS_55.includes(id));
  }
  // En las pruebas el banner es una sección visual completa, sin marco exterior.
  // El modo vertical/automático conserva TODA la imagen, sin recortar ni estirarla.
  // El modo horizontal continúa siendo un recorte panorámico explícito.
  function editorialBannerCss(p){
   if(!isEditorialBannerGalleryTheme(p))return '';
   const C='.theme-'+p.themeVisual;
   return `
${C} .page > figure.banner-media,
${C} .page .content > figure.banner-media{
 display:block!important;
 position:relative!important;
 box-sizing:border-box!important;
 width:100vw!important;
 max-width:100vw!important;
 min-width:0!important;
 height:auto!important;
 min-height:0!important;
 max-height:none!important;
 aspect-ratio:auto!important;
 margin:0!important;
 padding:0!important;
 border:0!important;
 outline:0!important;
 border-radius:0!important;
 box-shadow:none!important;
 background:transparent!important;
 background-image:none!important;
 clip-path:none!important;
 filter:none!important;
 overflow:hidden!important;
}
${C} .page .content > figure.banner-media{
 margin-left:calc(50% - 50vw)!important;
 margin-right:0!important;
}
${C} .page figure.banner-media > img{
 display:block!important;
 position:static!important;
 inset:auto!important;
 box-sizing:border-box!important;
 width:100%!important;
 max-width:100%!important;
 min-width:0!important;
 height:auto!important;
 min-height:0!important;
 max-height:none!important;
 aspect-ratio:auto!important;
 object-fit:contain!important;
 transform:none!important;
 filter:none!important;
 clip-path:none!important;
 border:0!important;
 border-radius:0!important;
 box-shadow:none!important;
}
${C} .page > .banner-horizontal,
${C} .page .content > .banner-horizontal{
 display:block!important;
 position:relative!important;
 box-sizing:border-box!important;
 width:100vw!important;
 max-width:100vw!important;
 min-width:0!important;
 height:clamp(220px,56.25vw,540px)!important;
 min-height:0!important;
 max-height:none!important;
 aspect-ratio:auto!important;
 margin:0!important;
 padding:0!important;
 border:0!important;
 outline:0!important;
 border-radius:0!important;
 box-shadow:none!important;
 clip-path:none!important;
 filter:none!important;
 overflow:hidden!important;
 background-size:cover!important;
 background-position:center center!important;
 background-repeat:no-repeat!important;
}
${C} .page .content > .banner-horizontal{
 margin-left:calc(50% - 50vw)!important;
 margin-right:0!important;
}
${C} .page figure.banner-media::before,
${C} .page figure.banner-media::after,
${C} .page .banner-horizontal::before,
${C} .page .banner-horizontal::after{
 content:none!important;
 display:none!important;
}
`;
  }
  // Galería estable en PRUEBAS (Aura Editorial + boda 01-10).
  // El selector del usuario determina el layout; el encuadre por foto permanece intacto.
  // Separar el tamaño de las celdas de las imágenes elimina las filas que se montan.
  function editorialGalleryLayoutRepairCss(p){
   if(!isEditorialBannerGalleryTheme(p))return '';
   const C='.theme-'+p.themeVisual;
   const mode=String(p.galleryStyle||'editorial');
   // Prioridad final sobre weddingThemeCss55 y los estilos de Aura Editorial.
   const standard=typeof auraGalleryStyleCss555==='function'?auraGalleryStyleCss555(p):'';
   const foundation=`
${C} .aura-screen-gallery{height:auto!important;min-height:0!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-screen-shell{height:auto!important;min-height:0!important;display:block!important;min-width:0!important;max-width:100%;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery{box-sizing:border-box!important;position:relative!important;width:100%!important;max-width:100%!important;min-width:0!important;clear:both!important;grid-template-rows:none!important;grid-auto-flow:row!important}
${C} .aura-screen-gallery .aura-gallery-grid > figure.aura-gallery-tile{box-sizing:border-box!important;min-width:0!important;min-height:0!important;max-height:none!important;float:none!important;z-index:auto!important}
${C} .aura-screen-gallery .aura-gallery-grid > figure.aura-gallery-tile img.gallery-image{box-sizing:border-box!important;display:block!important;width:100%!important;min-width:0!important;max-width:100%!important;margin:0!important;transform:none!important}
`;
   // Aspecto y tamaños de los recuadros: la imagen no participa en el cálculo
   // de filas del grid, evitando alturas circulares y fotografías empalmadas.
   const framed=`
${C} .aura-screen-gallery .aura-gallery-grid > figure.aura-gallery-tile{position:relative!important;height:auto!important;margin:0!important;overflow:hidden!important}
${C} .aura-screen-gallery .aura-gallery-grid > figure.aura-gallery-tile img.gallery-image{position:absolute!important;inset:0!important;height:100%!important}
`;
   switch(mode){
    case 'square':
     return standard+foundation+framed+`
${C} .aura-screen-gallery .aura-gallery-grid.gallery.square{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:auto!important;gap:10px!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.square > figure.aura-gallery-tile{grid-column:auto!important;grid-row:auto!important;aspect-ratio:1/1!important}
`;
    case 'rectangular':
     return standard+foundation+framed+`
${C} .aura-screen-gallery .aura-gallery-grid.gallery.rectangular{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-auto-rows:auto!important;gap:16px!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.rectangular > figure.aura-gallery-tile{grid-column:auto!important;grid-row:auto!important;aspect-ratio:4/3!important}
`;
    case 'editorial':
     return standard+foundation+framed+`
${C} .aura-screen-gallery .aura-gallery-grid.gallery.editorial{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:auto!important;gap:10px!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.editorial > figure.aura-gallery-tile{grid-column:auto!important;grid-row:auto!important;aspect-ratio:3/4!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.editorial > figure.aura-gallery-tile:nth-child(3n+1){grid-column:1/-1!important;grid-row:auto!important;aspect-ratio:4/5!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.editorial > figure.aura-gallery-tile:last-child:nth-child(3n+2){grid-column:1/-1!important;grid-row:auto!important;aspect-ratio:4/3!important}
`;
    case 'collage':
     return standard+foundation+framed+`
${C} .aura-screen-gallery .aura-gallery-grid.gallery.collage{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:clamp(110px,30vw,185px)!important;gap:9px!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.collage > figure.aura-gallery-tile{grid-column:auto!important;grid-row:auto!important;aspect-ratio:auto!important;height:100%!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.collage > figure.aura-gallery-tile:first-child{grid-column:1/-1!important;grid-row:span 2!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.collage > figure.aura-gallery-tile:nth-child(4n+2){grid-row:span 2!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.collage > figure.aura-gallery-tile:nth-child(5n){grid-column:1/-1!important}
`;
    case 'carousel':
    case 'filmstrip':
     return standard+foundation+framed+`
${C} .aura-screen-gallery .aura-gallery-grid.gallery.${mode}{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;grid-template-columns:none!important;gap:${mode==='carousel'?'12':'10'}px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;scrollbar-width:thin!important;padding:0 0 14px!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.${mode} > figure.aura-gallery-tile{flex:0 0 ${mode==='carousel'?'86':'72'}%!important;width:auto!important;min-width:0!important;aspect-ratio:${mode==='carousel'?'4/5':'3/4'}!important;scroll-snap-align:start!important}
`;
    case 'masonry':
     return standard+foundation+`
${C} .aura-screen-gallery .aura-gallery-grid.gallery.masonry{display:block!important;columns:2!important;column-gap:10px!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.masonry > figure.aura-gallery-tile{display:inline-block!important;position:relative!important;vertical-align:top!important;width:100%!important;height:auto!important;aspect-ratio:auto!important;margin:0 0 10px!important;padding:0!important;break-inside:avoid!important;overflow:hidden!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.masonry > figure.aura-gallery-tile img.gallery-image{position:static!important;inset:auto!important;height:auto!important;aspect-ratio:auto!important}
`;
    case 'story':
     return standard+foundation+`
${C} .aura-screen-gallery .aura-gallery-grid.gallery.story{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-auto-rows:auto!important;gap:22px!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.story > figure.aura-gallery-tile{position:relative!important;grid-column:auto!important;grid-row:auto!important;width:100%!important;height:auto!important;aspect-ratio:auto!important;margin:0!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.story > figure.aura-gallery-tile img.gallery-image{position:static!important;inset:auto!important;height:auto!important;aspect-ratio:auto!important}
`;
    case 'narrative':
     return standard+foundation+`
${C} .aura-screen-gallery .aura-gallery-grid.gallery.narrative{display:flex!important;flex-direction:column!important;flex-wrap:nowrap!important;gap:28px!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.narrative > figure.aura-gallery-tile{position:relative!important;flex:none!important;width:88%!important;height:auto!important;aspect-ratio:auto!important;margin:0!important;align-self:flex-start!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.narrative > figure.aura-gallery-tile:nth-child(even){align-self:flex-end!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.narrative > figure.aura-gallery-tile:nth-child(3n+1){width:100%!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.narrative > figure.aura-gallery-tile img.gallery-image{position:static!important;inset:auto!important;height:auto!important;aspect-ratio:auto!important}
`;
    case 'polaroid_pro':
     return standard+foundation+`
${C} .aura-screen-gallery .aura-gallery-grid.gallery.polaroid_pro{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:auto!important;gap:20px!important;padding:10px!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.polaroid_pro > figure.aura-gallery-tile{position:relative!important;grid-column:auto!important;grid-row:auto!important;height:auto!important;aspect-ratio:auto!important;margin:0!important;align-self:start!important;overflow:visible!important}
${C} .aura-screen-gallery .aura-gallery-grid.gallery.polaroid_pro > figure.aura-gallery-tile img.gallery-image{position:static!important;inset:auto!important;height:auto!important;aspect-ratio:3/4!important}
`;
    default:return standard+foundation;
   }
  }

  /* Moderna de Lujo: cuatro escenas fotográficas SIN tarjeta rectangular.
     Una sola fotografía a pantalla completa, vidrio original blur(12px)
     en un velo inferior de borde desvanecido, textos limpios encima.
     Lógica exclusiva del tema, sin editar galerías ni banners. */
  function luxuryHeritageGlassScenesCss(p){
    if(p?.themeVisual!=='wedding_luxury')return '';
    const C='body.theme-wedding_luxury';
    const dark=paletteDark55(p),light=paletteLight55(p);
    const kinds=['date','family','location','close'];
    const screens=k=>C+' .page .content > section.aura-screen-'+k;
    const shell=k=>screens(k)+' > .aura-screen-shell';
    const panel=k=>shell(k)+' .aura-'+k+'-panel';
    const photo=k=>shell(k)+' .aura-'+k+'-photo';
    const scr=kinds.map(screens),shells=kinds.map(shell),panels=kinds.map(panel),photos=kinds.map(photo);
    const veil= 'linear-gradient(to bottom,transparent 0%,'
        +rgba(dark,.07)+' 16%,'+rgba(dark,.30)+' 35%,'
        +rgba(dark,.63)+' 63%,'+rgba(dark,.87)+' 100%)';
    return `
/* Las cuatro escenas ocupan el ancho del móvil y presentan una sola foto. */
${scr.join(',\n')}{
 position:relative!important;
 min-height:100svh!important;margin:0!important;padding:0!important;
 display:flex!important;align-items:stretch!important;justify-content:stretch!important;
 overflow:hidden!important;background:transparent!important;background-image:none!important;
}
${scr.map(x=>x+'::before').concat(scr.map(x=>x+'::after')).join(',\n')}{
 content:none!important;display:none!important;
}
/* Un escenario continuo, sin separaciones ni tarjeta dentro de otra. */
${shells.join(',\n')}{
 position:relative!important;
 min-height:100svh!important;width:100%!important;max-width:none!important;
 margin:0!important;padding:0!important;
 display:flex!important;flex-direction:column!important;align-items:stretch!important;
 justify-content:flex-end!important;
 isolation:isolate!important;overflow:hidden!important;
 background:transparent!important;
}
/* La fotografía ocupa la sección COMPLETA, desde su borde superior. */
${photos.join(',\n')}{
 position:absolute!important;inset:0!important;
 display:block!important;width:100%!important;height:100%!important;
 min-height:100%!important;max-height:none!important;
 margin:0!important;padding:0!important;
 z-index:0!important;border:0!important;border-radius:0!important;
 box-shadow:none!important;
 background-size:cover!important;background-position:center!important;
}
/* El retrato de Familia antes quedaba encerrado en otro contenedor. */
${shell('family')} .aura-family-portrait{
 position:absolute!important;inset:0!important;width:100%!important;height:100%!important;
 max-width:none!important;margin:0!important;padding:0!important;
 z-index:0!important;transform:none!important;
}
/* UNA capa grande de cristal. Empieza sobre la foto y llega hasta el pie,
   con máscara que evita el corte superior; conserva el blur de lujo (12px). */
${shells.map(x=>x+'::before').join(',\n')}{
 content:''!important;display:block!important;pointer-events:none!important;
 position:absolute!important;inset:19% 0 0 0!important;
 z-index:1!important;border:0!important;border-radius:0!important;
 background:${veil}!important;
 -webkit-backdrop-filter:blur(12px)!important;backdrop-filter:blur(12px)!important;
 -webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 19%,#000 100%)!important;
 mask-image:linear-gradient(to bottom,transparent 0%,#000 19%,#000 100%)!important;
}
/* Cierre usaba otro degradado fotográfico que creaba una segunda capa. */
${photo('close')}::after{content:none!important;display:none!important}
/* El bloque de texto NO ES UNA TARJETA: se coloca directamente encima
   del vidrio compartido, a lo ancho de la escena. */
${panels.join(',\n')}{
 position:relative!important;inset:auto!important;z-index:2!important;
 display:block!important;flex:none!important;align-self:stretch!important;
 box-sizing:border-box!important;width:100%!important;max-width:none!important;
 min-height:0!important;height:auto!important;
 margin:0!important;padding:clamp(26px,5svh,52px) max(24px,calc((100% - 590px)/2)) clamp(44px,8svh,90px)!important;
 border:0!important;border-radius:0!important;outline:0!important;
 background:transparent!important;background-image:none!important;
 -webkit-backdrop-filter:none!important;backdrop-filter:none!important;
 box-shadow:none!important;transform:none!important;color:${light}!important;
}
/* Fecha y Familia no recuperan sus márgenes negativos heredados. */
${shell('family')} .aura-family-panel{padding-top:clamp(26px,5svh,52px)!important}
${shell('close')} .aura-close-panel{margin:0!important}
@media(min-width:700px){
 ${panels.join(',\n')}{padding-left:max(40px,calc((100% - 650px)/2))!important;padding-right:max(40px,calc((100% - 650px)/2))!important}
}
`;
  }
  const _coverCss=coverCss;
  coverCss=function(p){return _coverCss(p)+decorationCss(p)+mediterraneanCoverFramingCss(p)+mediterraneanTextFlowCss(p)+mediterraneanGalleryRespectCss(p)+editorialBannerCss(p)+editorialGalleryLayoutRepairCss(p)+luxuryHeritageGlassScenesCss(p)};
  const _editionCss=editionCss;
  editionCss=function(p,t,a){return _editionCss(p,t,a)};
  const _fullCss=invitationCss;
  invitationCss=function(p,t,a){return _fullCss(p,t,a)};
  function bindEditorialPortraitBanners(){
 const mappings=[['bannerFile','bannerMode'],['bannerExtraFile','bannerExtraMode'],['bannerExtra2File','bannerExtra2Mode']];
 for(const [fileId,modeId] of mappings){
  const field=document.getElementById(fileId);
  const select=document.getElementById(modeId);
  if(!field||!select||field.dataset.edBannerAutoBound==='true')continue;
  field.dataset.edBannerAutoBound='true';
  select.addEventListener('change',()=>{select.dataset.edBannerUserChanged='true';});
  field.addEventListener('change',()=>{
   if(!isEditorialBannerGalleryTheme({themeVisual:document.getElementById('themeVisual')?.value}))return;
   const file=field.files?.[0];
   if(!file||!file.type.startsWith('image/')||select.dataset.edBannerUserChanged==='true')return;
   const url=URL.createObjectURL(file),img=new Image();
   const finish=()=>URL.revokeObjectURL(url);
   img.onload=()=>{
    const portrait=img.naturalHeight>img.naturalWidth;
    finish();
    if(portrait&&select.value==='horizontal'&&select.dataset.edBannerUserChanged!=='true'&&isEditorialBannerGalleryTheme({themeVisual:document.getElementById('themeVisual')?.value})){
     select.value='auto';
     select.dispatchEvent(new Event('change',{bubbles:true}));
     // Es una selección automática, el usuario aún puede cambiarla a Horizontal.
     delete select.dataset.edBannerUserChanged;
    }
   };
   img.onerror=finish;
   img.src=url;
  });
 }
}
  const run=()=>{
    // Actualizar las miniaturas originales en el catálogo visible.
    if(typeof renderThemeStrip==='function')renderThemeStrip();
    bindEditorialPortraitBanners();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
