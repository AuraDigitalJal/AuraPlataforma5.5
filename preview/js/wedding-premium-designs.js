(function auraPremiumWeddings(){
  'use strict';
  const premium=new Set(['wedding_mediterranean','wedding_layers','wedding_curves']);
  Object.assign(THEMES,{
    wedding_mediterranean:{...THEMES.wedding_mediterranean,label:'05 · Mediterránea editorial',display:"'Cormorant Garamond',serif",hero:'photo',ornament:'line',radius:'3px'},
    wedding_layers:{...THEMES.wedding_layers,label:'06 · Capas boutique',display:"'Cormorant Garamond',serif",hero:'photo',ornament:'line',radius:'6px'},
    wedding_curves:{...THEMES.wedding_curves,label:'08 · Curvas de seda',display:"'Cormorant Garamond',serif",hero:'photo',ornament:'line',radius:'18px'}
  });
  Object.assign(AURA_THEME_PREVIEWS_531,{
    wedding_mediterranean:{src:'preview/assets/previews/weddings-premium/05.svg?v=2',kicker:'BODA · 05',title:'Mediterránea',note:'editorial · oliva · cerámica'},
    wedding_layers:{src:'preview/assets/previews/weddings-premium/06.svg?v=2',kicker:'BODA · 06',title:'Capas boutique',note:'papel · fotografía · relieve'},
    wedding_curves:{src:'preview/assets/previews/weddings-premium/08.svg?v=2',kicker:'BODA · 08',title:'Curvas de seda',note:'fluida · romántica · editorial'}
  });
  const seams={
    wedding_mediterranean: `<svg viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true"><path class="ap-seam-fill" d="M0 22 C78 76 170 112 260 87 C320 75 368 43 400 22 L400 120 H0Z"/><path class="ap-seam-rule" d="M0 22 C78 76 170 112 260 87 C320 75 368 43 400 22"/></svg>`,
    wedding_layers: `<svg viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true"><path class="ap-seam-shadow" d="M0 60 L400 18 L400 120 H0Z"/><path class="ap-seam-fill" d="M0 79 L400 36 L400 120 H0Z"/><path class="ap-seam-rule" d="M0 79 L400 36"/></svg>`,
    wedding_curves: `<svg viewBox="0 0 400 130" preserveAspectRatio="none" aria-hidden="true"><path class="ap-seam-shadow" d="M0 13 C130 122 251 2 400 36 L400 130 H0Z"/><path class="ap-seam-fill" d="M0 48 C115 135 261 43 400 65 L400 130 H0Z"/><path class="ap-seam-rule" d="M0 48 C115 135 261 43 400 65"/></svg>`
  };
  const motif= `<svg class="ap-craft-sprig" viewBox="0 0 185 130" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" opacity=".65"><path d="M-8 105 Q75 92 158 14"/><path d="M42 99 Q56 68 54 48"/><path d="M77 82 Q89 49 96 32"/><path d="M108 56 Q135 65 152 46"/><path d="M28 105 Q40 118 65 119"/></g><g fill="currentColor" opacity=".38"><ellipse cx="52" cy="64" rx="9" ry="22" transform="rotate(-21 52 64)"/><ellipse cx="97" cy="41" rx="9" ry="20" transform="rotate(29 97 41)"/><ellipse cx="135" cy="58" rx="8" ry="19" transform="rotate(65 135 58)"/><ellipse cx="62" cy="115" rx="7" ry="18" transform="rotate(112 62 115)"/></g></svg>`;
  const _cover=coverHtml;
  coverHtml=function(params){
    let html=_cover(params);
    const k=params?.themeVisual;
    if(!premium.has(k)||!html.includes('aura-story-cover'))return html;
    const visual=`<div class="ap-cover-seam ap-${k}" aria-hidden="true">${seams[k]}</div><div class="ap-sprig-wrap" aria-hidden="true">${motif}</div>`;
    return html.replace('<div class="hero-inner">',visual+'<div class="hero-inner">');
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
${C} .page .content .aura-gallery-ornament{display:none!important}
${C} .page .content .aura-screen-shell{position:relative!important;width:min(100%,660px)!important;margin:0 auto!important;padding:0 clamp(14px,4vw,28px)!important}
${C} .page .content .aura-stage-photo{filter:saturate(.87) contrast(1.02)!important;box-shadow:none!important;transform:none!important}
${C} .page .content .aura-date-panel,${C} .page .content .aura-family-panel,${C} .page .content .aura-location-panel,${C} .page .content .aura-close-panel,${C} .page .content .aura-confirm-panel,${C} .page .content .aura-transfer-panel,${C} .page .content .aura-video-panel{position:relative!important;z-index:2!important;transform:none!important;max-width:100%!important;box-sizing:border-box!important;text-align:center!important}
${C} .page .content .aura-gallery-grid{transform:none!important}
${C} .page .content .aura-gallery-tile{transform:none!important;box-shadow:none!important;margin-top:0!important;max-width:100%!important}
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
${C} .page .content .aura-gallery-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}
${C} .page .content .aura-gallery-tile{border-radius:48% 48% 2px 2px / 13% 13% 0 0!important;aspect-ratio:4/5!important;grid-column:auto!important;grid-row:auto!important;height:auto!important}
${C} .page .content .aura-gallery-tile:first-child{grid-column:1/-1!important;aspect-ratio:4/3!important}
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
${C} .page .content .aura-gallery-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:11px!important;padding:12px 3px!important}
${C} .page .content .aura-gallery-tile{border:6px solid ${rgba(base,.93)}!important;outline:1px solid ${rgba(ink,.09)}!important;border-radius:1px!important;box-shadow:0 9px 18px ${rgba(ink,.06)}!important;aspect-ratio:3/4!important;height:auto!important;grid-column:auto!important;grid-row:auto!important;width:100%!important}
${C} .page .content .aura-gallery-tile:nth-child(1){grid-column:1/-1!important;aspect-ratio:4/3!important}
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
${C} .page .content .aura-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:auto!important;gap:9px!important}
${C} .page .content .aura-gallery-tile{border-radius:48% 48% 7px 7px / 13% 13% 0 0!important;aspect-ratio:4/5!important;height:auto!important;grid-column:auto!important;grid-row:auto!important;width:100%!important}
${C} .page .content .aura-gallery-tile:first-child{grid-column:1/-1!important;aspect-ratio:5/4!important}
`;
    }
    return css+parameterResponsiveCss(p);
  }
  function parameterResponsiveCss(p){
  const k=p.themeVisual,C='.theme-'+k;
  const opacity=bounded(p.contentBgOpacity,.94,0,1);
  const buttonOpacity=bounded(p.buttonOpacity,.92,0,1);
  const veil=bounded(p.overlayOpacity,.42,0,1);
  const backgroundVeil=bounded(p.bgOverlayOpacity,.82,0,1);
  const base=p.bgContentColor||'#faf6f0',accent=p.primaryColor||'#ab897a',ink=p.headingColor||'#483932';
  const heroVeil=p.overlayColor||'#16130f';
  const buttonStyle=String(p.buttonStyle||'rounded');
  const buttonBg=buttonStyle==='text_only'||buttonStyle==='outline_thin'?'transparent':
    buttonStyle==='glass_soft'?rgba(base,buttonOpacity):rgba(accent,buttonOpacity);
  const radius=buttonStyle==='pill'||buttonStyle==='glass_soft'?'999px':
    buttonStyle==='rounded'?'14px':buttonStyle==='square'?'0px':'4px';
  const blur={none:'none',light:'blur(6px)',strong:'blur(14px)'}[p.contentBlur]||'none';
  const surfaceTop=rgba(base,opacity*.44);
  const surfaceBottom=rgba(base,opacity);
  const border=rgba(accent,opacity*.26);
  const sectionGlow=rgba(accent,opacity*.045);
  const screenBg=rgba(p.bgBodyColor||'#f3eee8',opacity*.5);
  const curve=k==='wedding_mediterranean'?'28px':
    k==='wedding_layers'?'22px 38px 25px 38px':'60px 26px 58px 24px';
  const closeCurve=k==='wedding_mediterranean'?'38px 38px 24px 24px':
    k==='wedding_layers'?'28px 42px 25px 36px':'70px 28px 60px 28px';
  const photoSections=['.aura-screen-date','.aura-screen-family','.aura-screen-location','.aura-screen-close'];
  const photos=photoSections.map(q=>C+' .page .content '+q+' .aura-stage-photo:not(.aura-stage-photo-empty)').join(',');
  const photoAfter=photoSections.map(q=>C+' .page .content '+q+' .aura-stage-photo:not(.aura-stage-photo-empty)::after').join(',');
  const panels=['.aura-date-panel','.aura-family-panel','.aura-location-panel',
    '.aura-close-panel','.aura-confirm-panel','.aura-video-panel','.aura-transfer-panel']
    .map(q=>C+' .page .content '+q).join(',');
  const touching=['.aura-screen-date .aura-date-panel','.aura-screen-family .aura-family-panel',
    '.aura-screen-location .aura-location-panel','.aura-screen-close .aura-close-panel']
    .map(q=>C+' .page .content '+q.split(' ')[0]+':has(.aura-stage-photo:not(.aura-stage-photo-empty)) '+q.split(' ')[1]).join(',');
  return `
/* Aura boutique v2 - respetar parámetros de diseño, sin modificar datos. */
${C} .background-veil{background:${rgba(p.bgBodyColor||'#f3eee8',backgroundVeil)}!important}
${C} .hero.aura-story-cover .hero-overlay{background:${rgba(heroVeil,veil)}!important;opacity:1!important}
${C} .hero.aura-story-cover .aura-quick-actions .aura-quick-action{
 background:${buttonBg}!important;
 border-color:${rgba(ink,buttonOpacity*.28)}!important;border-radius:${radius}!important}
${C} .hero.aura-story-cover .enter-btn,${C} .hero.aura-story-cover .aura-enter,${C} .hero.aura-story-cover button[data-enter]{
 background:${buttonBg}!important;border-radius:${radius}!important;
 border-color:${rgba(ink,buttonOpacity*.3)}!important}
${C} .page,${C} .page .content{background:transparent!important}
${C} .page .content .aura-screen{
 background:${screenBg}!important;
 background-image:linear-gradient(160deg,${sectionGlow},transparent 60%)!important;
 backdrop-filter:${blur}!important;-webkit-backdrop-filter:${blur}!important}
${panels}{
 background:linear-gradient(to bottom,${surfaceTop},${surfaceBottom} 40%,${surfaceBottom})!important;
 background-color:transparent!important;
 backdrop-filter:${blur}!important;-webkit-backdrop-filter:${blur}!important;
 border-color:${border}!important;border-radius:${curve}!important;
 box-shadow:0 10px 28px ${rgba(ink,.07*opacity)}!important}
${touching}{
 margin-top:-42px!important;z-index:3!important;width:96%!important;
 border-top-color:transparent!important}
${C} .page .content .aura-screen-close .aura-close-panel{border-radius:${closeCurve}!important}
${photos}{position:relative!important;overflow:hidden!important}
${photoAfter}{
 content:''!important;display:block!important;position:absolute!important;inset:0!important;
 background:linear-gradient(to bottom,transparent 44%,${rgba(base,opacity*.23)} 68%,${rgba(base,opacity*.96)} 100%)!important;
 pointer-events:none!important;z-index:1!important}
${C} .page .content .aura-screen-confirm .aura-confirm-panel,
${C} .page .content .aura-screen-video .aura-video-panel,
${C} .page .content .aura-screen-transfer .aura-transfer-panel{
 margin:0 auto!important;width:96%!important}
${C} .page .content .aura-screen .aura-map-preview{
 border-radius:clamp(14px,4vw,24px)!important;overflow:hidden!important}
`;
}
  const _coverCss=coverCss;
  coverCss=function(p){return _coverCss(p)+decorationCss(p)};
  const _editionCss=editionCss;
  editionCss=function(p,t,a){return _editionCss(p,t,a)};
  const _fullCss=invitationCss;
  invitationCss=function(p,t,a){return _fullCss(p,t,a)};
  const run=()=>{
    // Actualizar las miniaturas originales en el catálogo visible.
    if(typeof renderThemeStrip==='function')renderThemeStrip();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
