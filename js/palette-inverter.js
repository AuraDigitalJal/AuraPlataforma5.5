/* Aura Digital: inversor reversible de las paletas para el editor.
   Opera sobre los controles existentes, sin reescribir PALETTES ni diseños. */
(function auraPaletteInverter(){
 'use strict';
 const ids=['primaryColor','textColor','headingColor','mutedColor','bgBodyColor','bgContentColor','locationsBgColor'];
 const get=id=>document.getElementById(id);
 let original=null;
 const valid=s=>/^#[0-9a-f]{6}$/i.test(String(s||''));
 const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
 const hex=arr=>'#'+arr.map(n=>Math.round(Math.min(255,Math.max(0,n))).toString(16).padStart(2,'0')).join('');
 const mix=(a,b,t)=>hex(rgb(a).map((v,i)=>v*(1-t)+rgb(b)[i]*t));
 const luminance=h=>{
  const x=rgb(h).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});
  return .2126*x[0]+.7152*x[1]+.0722*x[2];
 };
 const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 const read=()=>Object.fromEntries(ids.filter(id=>!!get(id)).map(id=>[id,get(id).value]));
 const write=values=>{for(const [id,value] of Object.entries(values)){if(get(id)&&valid(value))get(id).value=value}};
 function accessibleAccent(accent,body,card){
  if(Math.min(contrast(accent,body),contrast(accent,card))>=3)return accent;
  const target=(luminance(body)+luminance(card))/2<.28?'#ffffff':'#171413';
  for(const ratio of [.2,.3,.4,.5,.6,.75,.9,1]){
   const color=mix(accent,target,ratio);
   if(Math.min(contrast(color,body),contrast(color,card))>=3)return color;
  }
  return target;
 }
 function reverse(values){
  const body=values.headingColor;
  const card=values.textColor;
  const foreground=values.bgContentColor;
  const heading=values.bgBodyColor;
  const result={
   primaryColor:accessibleAccent(values.primaryColor,body,card),
   textColor:foreground,
   headingColor:heading,
   mutedColor:mix(foreground,card,.38),
   bgBodyColor:body,
   bgContentColor:card
  };
  const location=values.locationsBgColor;
  if(valid(location)&&[values.bgContentColor,values.bgBodyColor,'#ffffff'].includes(location.toLowerCase()))
    result.locationsBgColor=card;
  return result;
 }
 function label(){
  const btn=get('auraPaletteInvert');
  const help=get('auraPaletteInvertHint');
  if(!btn)return;
  btn.textContent=original?'Restaurar paleta original':'Invertir claros y oscuros';
  btn.setAttribute('aria-pressed',String(!!original));
  if(help)help.textContent=original?
   'Vista invertida activa. Pulsa de nuevo para recuperar los colores anteriores.':
   'Intercambia fondos y textos, conserva la imagen y adapta el acento al contraste.';
 }
 function invalidate(){if(!original)return;original=null;label()}
 function init(){
  const btn=get('auraPaletteInvert');
  if(!btn||btn.dataset.bound==='1')return;
  btn.dataset.bound='1';
  btn.addEventListener('click',()=>{
   if(original){
    const undo=original;original=null;write(undo.colors);
    const palette=get('colorPalette');if(palette)palette.value=undo.palette;
   }else{
    const colors=read();
    if(!ids.slice(0,6).every(id=>valid(colors[id])))return;
    original={colors,palette:get('colorPalette')?.value||'custom'};
    write(reverse(colors));
    const palette=get('colorPalette');if(palette)palette.value='custom';
   }
   label();
   if(typeof renderPaletteStrip==='function')renderPaletteStrip();
   if(typeof updatePreview==='function')updatePreview();
  });
  // Cuando el usuario elige otra paleta/diseño, no restaurar accidentalmente los colores previos.
  for(const id of ['colorPalette','themeVisual','preset','designCollection','localConfig']){
   get(id)?.addEventListener('change',invalidate,true);
  }
  for(const id of ids)get(id)?.addEventListener('input',invalidate,true);
  for(const id of ['palette-strip','theme-strip']){
   get(id)?.addEventListener('click',invalidate,true);
  }
  get('configUrl')?.addEventListener('change',invalidate,true);
  label();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
 else init();
})();