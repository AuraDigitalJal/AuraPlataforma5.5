(function auraUniversalEditorAddon(){
  'use strict';
  const AURA_TX_FIELDS=['auraTxContent','auraTxFont','auraTxSize','auraTxColor','auraTxAlign','auraTxWeight','auraTxItalic','auraTxUnderline','auraTxTransform','auraTxSpacing','auraTxLineHeight','auraTxShape','auraTxBg','auraTxPadding'];
  let selectedKey='', originalText='', selectedDynamic=false, selectedDynamicSource='', refreshTimer=0;
  function at(id){return document.getElementById(id)}
  function loadEdits(){try{const v=JSON.parse(at('auraTextEdits')?.value||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(_){return{}}}
  function saveEdits(edits){at('auraTextEdits').value=JSON.stringify(edits)}
  function auraTextRuntime(edits){
    'use strict';
    const disallowed=new Set(['SCRIPT','STYLE','NOSCRIPT','SVG','PATH','IFRAME','OPTION','OPTGROUP','SELECT','INPUT','TEXTAREA','IMG','VIDEO','AUDIO','BR','HR','CANVAS','META','LINK','SOURCE','USE']);
    const used=new Map();
    // Estos nodos dependen de datos o temporizadores: se permite darles formato, no alterar su valor.
    const dynamicSelector='.date-weekday,.date-month,.date-day,.date-year,.date-time,.aura-date-weekday,.aura-date-day,.aura-date-monthyear,.aura-date-time,.countdown .count-item b,.countdown .count-item span,.aura-music-time,.aura-gallery-count';
    function splitGalleryFooter(){
      document.querySelectorAll('.gallery-footer > span').forEach(host=>{
        if(host.querySelector('.aura-gallery-count'))return;
        const full=(host.textContent||'').trim();
        const match=full.match(/^(\d+)\s+(fotografías|fotografias|fotos)\s*[·•-]\s*(.+)$/i);
        if(!match)return;
        const count=document.createElement('span');
        count.className='aura-gallery-count';
        count.textContent=match[1]+' '+match[2];
        const sep=document.createElement('span');
        sep.className='aura-gallery-divider';
        sep.setAttribute('aria-hidden','true');
        sep.textContent=' · ';
        const caption=document.createElement('span');
        caption.className='aura-gallery-caption';
        caption.textContent=match[3];
        host.replaceChildren(count,sep,caption);
      });
    }
    function normalized(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[0-9]+/g,'n').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,65)}
    function group(el){
      const parent=el.closest('section[id],header[id],footer[id],.gallery-section,.gallery-footer,.aura-screen-gallery,.aura-screen-confirm,.aura-screen,.hero,.location-card,.rsvp,.date-section,.aura-global-nav,.aura-music-player,section,footer,header');
      return parent?(parent.id||Array.from(parent.classList).filter(c=>/gallery|confirm|date|hero|screen|rsvp|location|music|family|closing|message|final|section/.test(c)).slice(0,2).join('-')||parent.tagName.toLowerCase()):'global';
    }
    function directText(el){return Array.from(el.childNodes).filter(n=>n.nodeType===3&&n.nodeValue.trim()).map(n=>n.nodeValue.trim()).join(' ').replace(/\s+/g,' ').trim()}
    function replaceText(el,text){
      const preserve=el.querySelector('svg,img,button,input,video,audio,iframe');
      if(preserve){
        const nodes=Array.from(el.childNodes).filter(n=>n.nodeType===3&&n.nodeValue.trim());
        if(nodes.length){nodes[0].nodeValue=text;for(const n of nodes.slice(1))n.nodeValue='';return}
      }
      const parts=String(text).split('\n');
      el.replaceChildren();
      parts.forEach((line,i)=>{if(i)el.appendChild(document.createElement('br'));el.appendChild(document.createTextNode(line))});
    }
    function apply(el,edit){
      if(el.dataset.auraTextDynamic!=='1'&&Object.prototype.hasOwnProperty.call(edit,'text'))replaceText(el,String(edit.text));
      const sty=el.style;
      const set=(prop,v)=>{if(v!==undefined&&v!==null&&v!=='')sty.setProperty(prop,String(v),'important')};
      const fonts={inherit:'inherit',cormorant:"'Cormorant Garamond',serif",playfair:"'Playfair Display',serif",italiana:"'Italiana',serif",baskerville:"'Libre Baskerville',serif",manrope:"'Manrope',sans-serif",montserrat:"'Montserrat',sans-serif",inter:"'Inter',sans-serif",dm:"'DM Sans',sans-serif",greatvibes:"'Great Vibes',cursive"};
      if(edit.font&&fonts[edit.font])set('font-family',fonts[edit.font]);
      if(edit.size!==''&&Number.isFinite(+edit.size))set('font-size',Math.max(7,Math.min(180,+edit.size))+'px');
      if(/^#[0-9a-fA-F]{6}$/.test(edit.color||''))set('color',edit.color);
      if(['left','center','right','justify'].includes(edit.align))set('text-align',edit.align);
      if(['400','500','600','700','800'].includes(String(edit.weight)))set('font-weight',edit.weight);
      if(edit.italic)set('font-style','italic');
      if(edit.underline)set('text-decoration','underline');
      if(['none','uppercase','lowercase','capitalize'].includes(edit.transform))set('text-transform',edit.transform);
      if(edit.spacing!==''&&Number.isFinite(+edit.spacing))set('letter-spacing',Math.max(-3,Math.min(20,+edit.spacing))+'px');
      if(edit.lineHeight!==''&&Number.isFinite(+edit.lineHeight))set('line-height',Math.max(.7,Math.min(3,+edit.lineHeight)));
      if(edit.shape&&edit.shape!=='none'){
        set('display','inline-block');set('max-width','100%');set('box-sizing','border-box');
        const radii={pill:'999px',rounded:'18px',square:'0'};
        set('border-radius',radii[edit.shape]||'0');
        set('background-color',/^#[0-9a-fA-F]{6}$/.test(edit.bg||'')?edit.bg:'transparent');
        if(edit.padding!==''&&Number.isFinite(+edit.padding))set('padding',Math.max(0,Math.min(48,+edit.padding))+'px');
      }
    }
    splitGalleryFooter();
    const nodes=Array.from(document.body.querySelectorAll('*'));
    for(const el of nodes){
      if(disallowed.has(el.tagName))continue;
      if(el.closest('svg,script,style,noscript,[aria-hidden="true"],.aura-music-range'))continue;
      if(el.closest('[data-aura-text-key]'))continue;
      let text=directText(el);
      if(!text)continue;
      if(el.tagName==='DIV'&&el.childElementCount>0&&!(el.matches('[data-edit],.final-message,.section-label,.gallery-footer,.aura-music-title')))continue;
      if(el.closest('aura-text-editor'))continue;
      const field=el.closest('[data-edit]')?.getAttribute('data-edit');
      const isDynamic=el.matches(dynamicSelector);
      const dynamicSource=el.matches('.aura-gallery-count')?'galleryFiles':el.matches('.aura-music-time')?'':isDynamic?'eventDate':'';
      const identity=isDynamic?Array.from(el.classList).find(c=>/^(date-|aura-date-|aura-music-|aura-gallery-)/.test(c))||el.tagName.toLowerCase():null;
      const keyBase=isDynamic?'dynamic:'+group(el)+':'+identity:
        el.matches('.aura-gallery-caption')?'campo:galleryFooterCaption':
        field?'campo:'+field:'texto:'+group(el)+':'+normalized(text);
      const count=used.get(keyBase)||0;used.set(keyBase,count+1);
      const key=keyBase+(count?':'+count:'');
      el.dataset.auraTextKey=key;
      el.dataset.auraOriginalText=text;
      if(isDynamic){el.dataset.auraTextDynamic='1';if(dynamicSource)el.dataset.auraTextSource=dynamicSource;}
      const e=edits[key];
      if(e&&typeof e==='object')apply(el,e);
    }
  }
  const _auraTxBuild=buildInvitation;
  buildInvitation=function(p,a){
    const html=_auraTxBuild(p,a);
    let edits={};
    try{edits=JSON.parse(p.auraTextEdits||'{}')}catch(_){}
    const payload=JSON.stringify(edits&&typeof edits==='object'?edits:{}).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
    const runtime=';('+auraTextRuntime.toString()+')('+payload+');';
    return html.replace(/<\/body>/i,'<script>'+runtime+'</script></body>');
  };
  const _auraTxParams=getFormParams;
  getFormParams=function(){const p=_auraTxParams();p.auraTextEdits=at('auraTextEdits')?.value||'{}';return p};
  // Incorporar al ZIP y a la vista previa las fuentes elegidas en cada texto.
  const _auraTxFonts=fontRecords;
  fontRecords=function(p,t){
    const original=_auraTxFonts(p,t);
    if(typeof AURA_FONTS==='undefined')return original;
    let edits={};try{edits=JSON.parse(p.auraTextEdits||'{}')}catch(_){}
    const names={cormorant:'Cormorant Garamond',playfair:'Playfair Display',italiana:'Italiana',baskerville:'Libre Baskerville',manrope:'Manrope',montserrat:'Montserrat',inter:'Inter',dm:'DM Sans',greatvibes:'Great Vibes'};
    const selected=new Set(Object.values(edits||{}).map(e=>names[e?.font]).filter(Boolean));
    const known=new Set(original.map(x=>x.name));
    return original.concat(AURA_FONTS.filter(x=>selected.has(x.family)&&!known.has(x.name)));
  };
  function panel(){
    const form=at('config-form');if(!form||at('auraTextEdits'))return;
    const hidden=document.createElement('input');hidden.type='hidden';hidden.id='auraTextEdits';hidden.value='{}';form.appendChild(hidden);
    const details=document.createElement('details');details.id='sec-universal-text';details.className='form-section';
    details.innerHTML=`<summary><span><b>TXT</b> Edición total de textos</span><i>+</i></summary>
      <div class="section-body" style="display:grid;gap:12px">
      <p class="helper">Activa «Tocar para editar» y selecciona cualquier frase en el teléfono. Estos cambios se incluyen al publicar y en el ZIP.</p>
      <p id="auraTxSelection" style="font-size:12px;font-weight:700;margin:0">Selecciona un texto en la vista previa.</p>
      <label>Texto completo<textarea id="auraTxContent" rows="3" style="width:100%;resize:vertical" placeholder="Selecciona una frase" disabled></textarea></label>
      <button type="button" id="auraTxDataSource" class="btn secondary" hidden>Modificar dato original</button>
      <div class="field-grid">
        <label>Tipografía<select id="auraTxFont"><option value="">Original del diseño</option><option value="cormorant">Cormorant Garamond</option><option value="playfair">Playfair Display</option><option value="italiana">Italiana</option><option value="baskerville">Libre Baskerville</option><option value="manrope">Manrope</option><option value="montserrat">Montserrat</option><option value="inter">Inter</option><option value="dm">DM Sans</option><option value="greatvibes">Great Vibes</option></select></label>
        <label>Tamaño en px<input type="number" id="auraTxSize" min="7" max="180" step="1" placeholder="Automático"></label>
        <label>Color<input type="color" id="auraTxColor" value="#333333"></label>
        <label>Alineación<select id="auraTxAlign"><option value="">Original</option><option value="left">Izquierda</option><option value="center">Centro</option><option value="right">Derecha</option><option value="justify">Justificado</option></select></label>
        <label>Grosor<select id="auraTxWeight"><option value="">Original</option><option value="400">Normal</option><option value="500">Medio</option><option value="600">Seminegrita</option><option value="700">Negrita</option><option value="800">Extra negrita</option></select></label>
        <label>Mayúsculas<select id="auraTxTransform"><option value="">Original</option><option value="none">Sin transformación</option><option value="uppercase">MAYÚSCULAS</option><option value="lowercase">minúsculas</option><option value="capitalize">Iniciales</option></select></label>
        <label>Espacio letras (px)<input id="auraTxSpacing" type="number" min="-3" max="20" step=".5" placeholder="Automático"></label>
        <label>Interlineado<input id="auraTxLineHeight" type="number" min=".7" max="3" step=".1" placeholder="Automático"></label>
        <label>Forma del fondo<select id="auraTxShape"><option value="none">Sin fondo</option><option value="rounded">Rectángulo redondeado</option><option value="pill">Cápsula</option><option value="square">Rectángulo recto</option></select></label>
        <label>Color del fondo<input id="auraTxBg" type="color" value="#ffffff"></label>
        <label>Relleno (px)<input id="auraTxPadding" type="number" min="0" max="48" step="1" placeholder="12"></label>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
       <label style="display:flex;gap:7px;align-items:center"><input type="checkbox" id="auraTxItalic"> Cursiva</label>
       <label style="display:flex;gap:7px;align-items:center"><input type="checkbox" id="auraTxUnderline"> Subrayado</label>
      </div>
      <button type="button" id="auraTxReset" class="btn secondary">Restablecer solo este texto</button>
      <small id="auraTxHelp" style="color:#776b62">Puedes cambiar el diseño después: los textos personalizados permanecen guardados por elemento.</small>
      </div>`;
    const before=at('sec-github')||form.querySelector('details.form-section');
    if(before)form.insertBefore(details,before);else form.appendChild(details);
    AURA_TX_FIELDS.forEach(id=>{const field=at(id);if(!field)return;field.addEventListener('input',saveSelected);field.addEventListener('change',saveSelected)});
    at('auraTxDataSource')?.addEventListener('click',()=>{
      const source=at(selectedDynamicSource);
      if(!source)return;
      const section=source.closest('details.form-section');
      if(section)section.open=true;
      source.scrollIntoView({behavior:'smooth',block:'center'});
      source.focus({preventScroll:true});
    });
    at('auraTxReset')?.addEventListener('click',()=>{if(!selectedKey)return;const obj=loadEdits();delete obj[selectedKey];saveEdits(obj);selectedKey='';at('auraTxSelection').textContent='Texto restablecido. Tócalo para editarlo otra vez.';queuePreview()});
  }
  function saveSelected(event){
    if(event?.target?.id==='auraTxColor')event.target.dataset.touched='yes';
    if(!selectedKey)return;
    const obj=loadEdits();
    const val=at('auraTxContent')?.value??originalText;
    const v={};
    if(!selectedDynamic&&val!==originalText)v.text=val;
    if(at('auraTxFont').value)v.font=at('auraTxFont').value;
    if(at('auraTxSize').value)v.size=at('auraTxSize').value;
    if(at('auraTxAlign').value)v.align=at('auraTxAlign').value;
    if(at('auraTxWeight').value)v.weight=at('auraTxWeight').value;
    if(at('auraTxTransform').value)v.transform=at('auraTxTransform').value;
    if(at('auraTxSpacing').value)v.spacing=at('auraTxSpacing').value;
    if(at('auraTxLineHeight').value)v.lineHeight=at('auraTxLineHeight').value;
    if(at('auraTxShape').value!=='none'){
      v.shape=at('auraTxShape').value;
      v.bg=at('auraTxBg').value;
      if(at('auraTxPadding').value)v.padding=at('auraTxPadding').value;
    }
    if(at('auraTxColor').dataset.touched==='yes')v.color=at('auraTxColor').value;
    if(at('auraTxItalic').checked)v.italic=true;
    if(at('auraTxUnderline').checked)v.underline=true;
    if(Object.keys(v).length)obj[selectedKey]=v;else delete obj[selectedKey];
    saveEdits(obj);
    clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>updatePreview(),180);
  }
  function pick(el){
    if(!el?.dataset?.auraTextKey)return;
    selectedKey=el.dataset.auraTextKey;
    originalText=el.dataset.auraOriginalText||el.textContent?.trim()||'';
    selectedDynamic=el.dataset.auraTextDynamic==='1';
    selectedDynamicSource=el.dataset.auraTextSource||'';
    const saved=loadEdits()[selectedKey]||{};
    const d=at('sec-universal-text');d.open=true;
    d.classList.remove('editor-filtered');
    at('auraTxSelection').textContent=(selectedDynamic?'Dato automático: ':'Editando: ')+originalText.slice(0,80);
    at('auraTxContent').disabled=selectedDynamic;
    at('auraTxHelp').textContent=selectedDynamic?
      'Este valor es automático. Puedes modificar su tipografía, tamaño y aspecto, pero no reemplazar el número, la fecha o el conteo desde aquí.':
      'Puedes cambiar el diseño después: los textos personalizados permanecen guardados por elemento.';
    const link=at('auraTxDataSource');
    if(link){link.hidden=!selectedDynamicSource;link.textContent=selectedDynamicSource==='galleryFiles'?'Modificar fotografías':'Modificar fecha del evento';}
    const vals={auraTxContent:saved.text??originalText,auraTxFont:saved.font||'',auraTxSize:saved.size||'',auraTxColor:saved.color||'#333333',auraTxAlign:saved.align||'',auraTxWeight:saved.weight||'',auraTxTransform:saved.transform||'',auraTxSpacing:saved.spacing||'',auraTxLineHeight:saved.lineHeight||'',auraTxShape:saved.shape||'none',auraTxBg:saved.bg||'#ffffff',auraTxPadding:saved.padding||''};
    for(const [id,value] of Object.entries(vals))if(at(id))at(id).value=value;
    at('auraTxItalic').checked=!!saved.italic;
    at('auraTxUnderline').checked=!!saved.underline;
    at('auraTxColor').dataset.touched=saved.color?'yes':'no';
    d.scrollIntoView({behavior:'smooth',block:'nearest'});
    if(!selectedDynamic)setTimeout(()=>{try{at('auraTxContent').focus({preventScroll:true})}catch(_){}},120);
  }
  const oldBind=bindPreviewEditing52;
  bindPreviewEditing52=function(doc){
    oldBind(doc);
    if(!doc||doc.documentElement.dataset.auraUniversalTextBound==='1')return;
    doc.documentElement.dataset.auraUniversalTextBound='1';
    const st=doc.createElement('style');st.textContent='[data-aura-text-key]:hover{outline:1px dashed #a17e5a!important;outline-offset:3px;cursor:text!important}[data-aura-text-key].aura-text-selected{outline:2px solid #a17e5a!important;outline-offset:3px}';doc.head.appendChild(st);
    doc.addEventListener('click',e=>{
      if(!at('previewEditMode')?.checked)return;
      const el=e.target.closest?.('[data-aura-text-key]');
      if(!el)return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      doc.querySelectorAll('.aura-text-selected').forEach(x=>x.classList.remove('aura-text-selected'));
      el.classList.add('aura-text-selected');
      pick(el);
    },true);
  };
  function start(){
    panel();
    at('auraTxColor')?.addEventListener('input',()=>{at('auraTxColor').dataset.touched='yes'});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
