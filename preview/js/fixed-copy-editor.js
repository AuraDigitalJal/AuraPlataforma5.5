(function auraFixedCopyModule(){
  'use strict';
  const FIELDS=[
    {id:'galleryHint',label:'Galería · frase inferior',selector:'.gallery-footer .aura-fixed-gallery-caption',defaults:['Toca para ampliar']},
    {id:'galleryCount',label:'Galería · cantidad de fotografías (solo estilo u ocultar)',selector:'.gallery-footer .aura-fixed-gallery-count',defaults:[],protected:true},
    {id:'locationKicker',label:'Ubicación · etiqueta superior',selector:'#ubicacion .section-label',defaults:['Dónde será','Ubicación']},
    {id:'locationTitle',label:'Ubicación · título de sección',selector:'#ubicacion h2',defaults:['Nos vemos aquí.','Aquí celebraremos','Aquí comienza nuestro gran día']},
    {id:'locationNote',label:'Ubicación · frase complementaria',selector:'#ubicacion .aura-location-note',defaults:['Tu presencia hará este momento aún más especial.']},
    {id:'rsvpKicker',label:'Confirmación · etiqueta RSVP',selector:'#confirmar .section-label',defaults:['RSVP']},
    {id:'rsvpTitle',label:'Confirmación · pregunta principal',selector:'#confirmar h2',defaults:['¿Nos acompañas?']},
    {id:'rsvpNote',label:'Confirmación · frase informativa',selector:'#confirmar .section-copy,#confirmar .aura-confirm-copy',defaults:['Tu confirmación nos ayuda a preparar cada detalle.']},
    {id:'dateKicker',label:'Fecha · frase decorativa',selector:'#fecha .section-label,.date-section > .section-label',defaults:['Save the date','Reserva la fecha','Te invito a celebrar']},
    {id:'closingKicker',label:'Cierre · frase decorativa',selector:'#cierre .section-label,.section-label.center',defaults:['Con cariño','Gracias']},
    {id:'musicKicker',label:'Música · texto «Ahora suena»',selector:'.aura-music-kicker',defaults:['Ahora suena']},
    {id:'scrollHint',label:'Portada · indicación para deslizar',selector:'.hero .scroll-note',defaults:['Desliza para descubrir']},
    {id:"blMenuTitle",label:"Bautizo capas · Menú · encabezado",selector:".theme-baptism_layers .bl-menu-title",defaults:["DETALLES","Detalles"]},
    {id:"blMenuSubtitle",label:"Bautizo capas · Menú · frase bajo el título",selector:".theme-baptism_layers .bl-menu-subtitle",defaults:["TODO LO QUE NECESITAS SABER"]},
    {id:"blMenuDateTitle",label:"Bautizo capas · Menú · Fecha",selector:".theme-baptism_layers .bl-menu-row[data-bl-go=\"date\"] .bl-row-copy strong",defaults:["Fecha"]},
    {id:"blMenuCeremonyTitle",label:"Bautizo capas · Menú · Ceremonia",selector:".theme-baptism_layers .bl-menu-row[data-bl-go=\"ceremony\"] .bl-row-copy strong",defaults:["Ceremonia"]},
    {id:"blMenuReceptionTitle",label:"Bautizo capas · Menú · Recepción",selector:".theme-baptism_layers .bl-menu-row[data-bl-go=\"reception\"] .bl-row-copy strong",defaults:["Recepción"]},
    {id:"blMenuConfirmTitle",label:"Bautizo capas · Menú · Confirmación",selector:".theme-baptism_layers .bl-menu-confirm-label",defaults:["Confirmar asistencia"]},
    {id:"blMenuConfirmHint",label:"Bautizo capas · Menú · subtítulo confirmación",selector:".theme-baptism_layers .bl-menu-confirm-hint",defaults:["Te esperamos"]},
    {id:"blMenuGalleryCTA",label:"Bautizo capas · Menú · acceso a galería",selector:".theme-baptism_layers .bl-menu-row[data-bl-go=\"gallery\"] .bl-row-copy strong",defaults:["Ver galería","Galería"]},
    {id:"blMenuFooter",label:"Bautizo capas · Menú · frase inferior",selector:".theme-baptism_layers .bl-menu-footer-label",defaults:["CON CARIÑO, PARA TI"]},
    {id:"blMenuBack",label:"Bautizo capas · Navegación · Menú",selector:".theme-baptism_layers .bl-back[data-bl-go=\"menu\"] span:last-child",defaults:["Menú"]},
    {id:"blCoverBack",label:"Bautizo capas · Navegación · Portada",selector:".theme-baptism_layers .bl-back[data-bl-go=\"cover\"] span:last-child",defaults:["Portada"]},
    {id:"blCeremonyKicker",label:"Bautizo capas · Ceremonia · etiqueta",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"ceremony\"] .bl-kicker",defaults:["CEREMONIA"]},
    {id:"blCeremonyTitle",label:"Bautizo capas · Ceremonia · título",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"ceremony\"] .bl-heading",defaults:["Dónde será"]},
    {id:"blCeremonyNote",label:"Bautizo capas · Ceremonia · frase",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"ceremony\"] .bl-place p",defaults:["Nos encantará compartir este momento contigo."]},
    {id:"blCeremonyFooter",label:"Bautizo capas · Ceremonia · frase inferior",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"ceremony\"] .bl-footer-label",defaults:["UN MOMENTO PARA RECORDAR"]},
    {id:"blReceptionKicker",label:"Bautizo capas · Recepción · etiqueta",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"reception\"] .bl-kicker",defaults:["RECEPCIÓN"]},
    {id:"blReceptionTitle",label:"Bautizo capas · Recepción · título",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"reception\"] .bl-heading",defaults:["Nos vemos aquí"]},
    {id:"blReceptionNote",label:"Bautizo capas · Recepción · frase",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"reception\"] .bl-place p",defaults:["Nos encantará compartir este momento contigo."]},
    {id:"blReceptionFooter",label:"Bautizo capas · Recepción · frase inferior",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"reception\"] .bl-footer-label",defaults:["UN MOMENTO PARA RECORDAR"]},
    {id:"blConfirmKicker",label:"Bautizo capas · Confirmación · etiqueta",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"confirm\"] .bl-kicker",defaults:["CONFIRMACIÓN"]},
    {id:"blConfirmTitle",label:"Bautizo capas · Confirmación · título",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"confirm\"] .bl-heading",defaults:["Te esperamos"]},
    {id:"blConfirmQuestion",label:"Bautizo capas · Confirmación · pregunta",selector:".theme-baptism_layers .bl-confirm-body h2",defaults:["¿Nos acompañas?"]},
    {id:"blConfirmNote",label:"Bautizo capas · Confirmación · mensaje",selector:".theme-baptism_layers .bl-confirm-body p",defaults:["Tu presencia hará este momento aún más especial. Confirma tu asistencia para ayudarnos a preparar cada detalle."]},
    {id:"blConfirmWhatsAppCTA",label:"Bautizo capas · Confirmación · botón WhatsApp",selector:".theme-baptism_layers .bl-whatsapp-label",defaults:["Confirmar por WhatsApp"]},
    {id:"blConfirmFooter",label:"Bautizo capas · Confirmación · frase inferior",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"confirm\"] .bl-footer-label",defaults:["UN MOMENTO PARA RECORDAR"]},
    {id:"blGalleryHeading",label:"Bautizo capas · Galería · encabezado",selector:".theme-baptism_layers .bl-gallery-heading",defaults:["NUESTROS RECUERDOS"]},
    {id:"blMapShow",label:"Bautizo capas · Ubicaciones · ver mapa",selector:".theme-baptism_layers .bl-map-toggle-label",defaults:["Ver mapa"]},
    {id:"blMapLink",label:"Bautizo capas · Ubicaciones · enlace a Google Maps",selector:".theme-baptism_layers .bl-maps-link-label",defaults:["Abrir ubicación en Google Maps"]},
    {id:"blDateDays",label:"Bautizo capas · Cuenta regresiva · días",selector:".theme-baptism_layers .bl-countdown .count-item:nth-child(1) span",defaults:["Días"]},
    {id:"blDateHours",label:"Bautizo capas · Cuenta regresiva · horas",selector:".theme-baptism_layers .bl-countdown .count-item:nth-child(2) span",defaults:["Horas"]},
    {id:"blDateMinutes",label:"Bautizo capas · Cuenta regresiva · minutos",selector:".theme-baptism_layers .bl-countdown .count-item:nth-child(3) span",defaults:["Min"]},
    {id:"blDateSeconds",label:"Bautizo capas · Cuenta regresiva · segundos",selector:".theme-baptism_layers .bl-countdown .count-item:nth-child(4) span",defaults:["Seg"]},
    {id:"blDateMissing",label:"Bautizo capas · Fecha sin configurar",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"date\"] .bl-empty",defaults:["Agrega la fecha del evento desde el editor para mostrarla aquí."]},
    {id:"blLocationMissing",label:"Bautizo capas · Ubicación sin configurar",selector:".theme-baptism_layers .bl-screen[data-bl-screen=\"ceremony\"] .bl-empty,.theme-baptism_layers .bl-screen[data-bl-screen=\"reception\"] .bl-empty",defaults:["Activa y completa los datos de esta ubicación en el editor."]},
    {id:"blRSVPMissing",label:"Bautizo capas · WhatsApp sin configurar",selector:".theme-baptism_layers .bl-confirm-body .bl-empty",defaults:["Agrega el número de WhatsApp en el editor para activar la confirmación."]},
    {id:"blGalleryMissing",label:"Bautizo capas · Galería sin fotografías",selector:".theme-baptism_layers .bl-gallery-screen .bl-empty",defaults:["Selecciona fotografías en el apartado de galería del editor."]}
  ];
  let chosen='',working=false;
  const node=id=>document.getElementById(id);
  function parse(raw){try{const v=typeof raw==='string'?JSON.parse(raw||'{}'):raw;return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(_){return{}}}
  function edits(){return parse(node('auraStaticTexts')?.value)}
  function write(obj){const input=node('auraStaticTexts');if(input)input.value=JSON.stringify(obj)}
  function buildMarkupEditor(data,catalog){
    'use strict';
    const fields=Array.isArray(catalog)?catalog:[];
    const current=data&&typeof data==='object'?data:{};
    const fonts={cormorant:"'Cormorant Garamond',serif",playfair:"'Playfair Display',serif",italiana:"'Italiana',serif",manrope:"'Manrope',sans-serif",dm:"'DM Sans',sans-serif",greatvibes:"'Great Vibes',cursive"};
    // Separar solo la frase decorativa de la cantidad real de fotografías.
    document.querySelectorAll('.gallery-footer > span').forEach(host=>{
      if(host.querySelector('.aura-fixed-gallery-count'))return;
      const raw=String(host.textContent||'').trim();
      const found=/^(\d+)\s+(fotografías|fotografias|fotos)\s*[·•-]\s*(.+)$/i.exec(raw);
      if(!found)return;
      const count=document.createElement('span');count.className='aura-fixed-gallery-count';count.textContent=found[1]+' '+found[2];
      const join=document.createElement('span');join.className='aura-fixed-gallery-separator';join.textContent=' · ';
      const hint=document.createElement('span');hint.className='aura-fixed-gallery-caption';hint.textContent=found[3];
      host.replaceChildren(count,join,hint);
    });
    function decorate(element,field,style){
      element.dataset.auraFixedKey=field.id;
      if(!style||typeof style!=='object')return;
      const css=element.style;
      const set=(k,v)=>{if(v!==null&&v!==undefined&&v!=='')css.setProperty(k,v,'important')};
      if(!field.protected&&typeof style.text==='string'&&style.text.trim())element.textContent=style.text;
      if(style.hide===true)set('display','none');
      const size=Number(style.size);if(style.size!==undefined&&style.size!==''&&Number.isFinite(size))set('font-size',Math.max(7,Math.min(110,size))+'px');
      if(fonts[style.font])set('font-family',fonts[style.font]);
      if(/^#[0-9a-f]{6}$/i.test(style.color||''))set('color',style.color);
      if(['left','center','right'].includes(style.align))set('text-align',style.align);
      if(['normal','bold'].includes(style.weight))set('font-weight',style.weight==='bold'?'700':'400');
      if(style.shape&&style.shape!=='original'){
        const r={square:'0px',rounded:'12px',pill:'999px'};
        set('border-radius',r[style.shape]||'0px');
        set('padding','5px 10px');
        if(/^#[0-9a-f]{6}$/i.test(style.bg||''))set('background-color',style.bg);
      }
    }
    for(const field of fields){
      for(const el of document.querySelectorAll(field.selector)){
        const visible=(el.textContent||'').trim();
        if(!field.protected&&!field.defaults.includes(visible))continue;
        decorate(el,field,current[field.id]);
      }
    }
    const countHidden=current.galleryCount?.hide===true;
    const captionHidden=current.galleryHint?.hide===true;
    document.querySelectorAll('.aura-fixed-gallery-separator').forEach(el=>{
      if(countHidden||captionHidden)el.style.display='none';
    });
  }
  const _build=buildInvitation;
  buildInvitation=function(p,a){
    const html=_build(p,a);
    const value=parse(p.auraStaticTexts);
    // La modificación se aplica solo sobre elementos descriptivos identificados en el catálogo.
    const toInline=x=>JSON.stringify(x).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
    const script=';('+buildMarkupEditor.toString()+')('+toInline(value)+','+toInline(FIELDS)+');';
    return html.replace(/<\/body>/i,'<script>'+script+'</script></body>');
  };
  const _params=getFormParams;
  getFormParams=function(){const p=_params();p.auraStaticTexts=node('auraStaticTexts')?.value||'{}';return p};
  const _fonts=fontRecords;
  fontRecords=function(p,t){
    const base=_fonts(p,t);
    if(typeof AURA_FONTS==='undefined')return base;
    const names={cormorant:'Cormorant Garamond',playfair:'Playfair Display',italiana:'Italiana',manrope:'Manrope',dm:'DM Sans',greatvibes:'Great Vibes'};
    const requested=new Set(Object.values(parse(p.auraStaticTexts)).map(e=>names[e?.font]).filter(Boolean));
    const used=new Set(base.map(x=>x.name));
    return base.concat(AURA_FONTS.filter(x=>requested.has(x.family)&&!used.has(x.name)));
  };
  const _apply=applyConfig;
  applyConfig=function(config){
    const incoming={...(config||{})};
    if(incoming.auraStaticTexts&&typeof incoming.auraStaticTexts==='object')incoming.auraStaticTexts=JSON.stringify(incoming.auraStaticTexts);
    _apply(incoming);
    populate();
  };
  function options(id){
    const el=node(id);
    if(!el)return;
    el.replaceChildren();
    el.add(new Option('Selecciona una frase…',''));
    for(const field of FIELDS)el.add(new Option(field.label,field.id));
  }
  function populate(){
    const field=FIELDS.find(x=>x.id===chosen);
    const ed=edits()[chosen]||{};
    if(!field)return;
    const values={auraFixedText:ed.text||'',auraFixedSize:ed.size||'',auraFixedFont:ed.font||'',auraFixedAlign:ed.align||'',auraFixedWeight:ed.weight||'',auraFixedShape:ed.shape||'original',auraFixedColor:ed.color||'#333333',auraFixedBg:ed.bg||'#ffffff'};
    for(const [id,v] of Object.entries(values)){const x=node(id);if(x)x.value=v}
    node('auraFixedHide').checked=!!ed.hide;
    node('auraFixedColorToggle').checked=!!ed.color;
    const tx=node('auraFixedText');tx.disabled=!!field.protected;
    tx.placeholder=field.protected?'Número automático: no se puede sustituir':'Vacío = conservar frase original del diseño';
    node('auraFixedHint').textContent=field.protected?
      'Este es un dato calculado: puedes cambiar su apariencia u ocultarlo, pero no sustituir el número.':
      'Este control solo modifica la frase señalada; no altera fechas, botones ni información del evento.';
  }
  function selectField(k){
    chosen=FIELDS.some(x=>x.id===k)?k:'';
    node('auraFixedChoose').value=chosen;
    node('auraFixedControls').hidden=!chosen;
    if(chosen)populate();
  }
  function save(){
    if(!chosen||working)return;
    const v={
      text:node('auraFixedText').value,
      size:node('auraFixedSize').value,
      font:node('auraFixedFont').value,
      color:node('auraFixedColorToggle').checked?node('auraFixedColor').value:'',
      align:node('auraFixedAlign').value,
      weight:node('auraFixedWeight').value,
      shape:node('auraFixedShape').value,
      bg:node('auraFixedShape').value!=='original'?node('auraFixedBg').value:'',
      hide:node('auraFixedHide').checked
    };
    if(FIELDS.find(x=>x.id===chosen)?.protected)delete v.text;
    const fresh=edits();
    if(v.text||v.size||v.font||v.color||v.align||v.weight||v.shape!=='original'||v.hide)fresh[chosen]=v;
    else delete fresh[chosen];
    write(fresh);
    queuePreview();
  }
  function attach(){
    const form=node('config-form');
    if(!form||node('auraStaticTexts'))return;
    const secret=document.createElement('input');secret.type='hidden';secret.id='auraStaticTexts';secret.value='{}';
    form.appendChild(secret);
    const details=document.createElement('details');details.id='sec-aura-fixed-copy';details.className='form-section';
    details.innerHTML=`<summary><span><b>TXT</b> Frases fijas de los diseños</span><i>+</i></summary>
    <div class="section-body" style="display:grid;gap:12px">
      <p class="helper">Cambia, estiliza u oculta las frases que el diseño añade automáticamente. Puedes tocar la frase en el teléfono o elegirla aquí.</p>
      <label>Seleccionar texto
        <select id="auraFixedChoose"></select>
      </label>
      <div id="auraFixedControls" hidden>
        <label>Frase personalizada
          <textarea id="auraFixedText" rows="2" placeholder="Vacío = conservar frase original del diseño"></textarea>
        </label>
        <label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="auraFixedHide"> Ocultar esta frase</label>
        <div class="field-grid">
          <label>Tamaño (px)<input id="auraFixedSize" type="number" min="7" max="110" step="1" placeholder="Original"></label>
          <label>Tipografía<select id="auraFixedFont">
            <option value="">Original</option><option value="cormorant">Cormorant Garamond</option><option value="playfair">Playfair Display</option><option value="italiana">Italiana</option><option value="manrope">Manrope</option><option value="dm">DM Sans</option><option value="greatvibes">Great Vibes</option>
          </select></label>
          <label>Alineación<select id="auraFixedAlign"><option value="">Original</option><option value="left">Izquierda</option><option value="center">Centro</option><option value="right">Derecha</option></select></label>
          <label>Grosor<select id="auraFixedWeight"><option value="">Original</option><option value="normal">Normal</option><option value="bold">Negrita</option></select></label>
          <label>Fondo y forma<select id="auraFixedShape"><option value="original">Original</option><option value="square">Rectangular</option><option value="rounded">Redondeado</option><option value="pill">Cápsula</option></select></label>
          <label>Color de fondo<input type="color" id="auraFixedBg" value="#ffffff"></label>
          <label>Color de letras
            <span style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="auraFixedColorToggle"> Personalizar <input id="auraFixedColor" type="color" value="#333333"></span>
          </label>
        </div>
        <button type="button" class="btn secondary" id="auraFixedReset">Restaurar frase original</button>
        <small id="auraFixedHint">No afecta datos automáticos ni botones.</small>
      </div>
    </div>`;
    form.insertBefore(details,form.querySelector('details.form-section')||null);
    options('auraFixedChoose');
    node('auraFixedChoose').addEventListener('change',e=>selectField(e.target.value));
    const control=node('auraFixedControls');
    control.addEventListener('input',e=>{if(e.target.id!=='auraFixedReset')save()});
    control.addEventListener('change',e=>{if(e.target.id!=='auraFixedReset')save()});
    node('auraFixedReset').addEventListener('click',()=>{
      if(!chosen)return;
      const all=edits();delete all[chosen];write(all);populate();queuePreview();
    });
  }
  const oldBinder=bindPreviewEditing52;
  bindPreviewEditing52=function(doc){
    oldBinder(doc);
    if(!doc||doc.documentElement.dataset.auraFixedBound==='1')return;
    doc.documentElement.dataset.auraFixedBound='1';
    // En la vista previa se captura antes de la navegación por capas.
    // En invitaciones exportadas este listener nunca se registra.
    doc.defaultView?.addEventListener('click',e=>{
      if(!node('previewEditMode')?.checked)return;
      const target=e.target.closest?.('[data-aura-fixed-key]');
      if(!target)return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      selectField(target.dataset.auraFixedKey);
      const details=node('sec-aura-fixed-copy');
      details.open=true;
      details.scrollIntoView({behavior:'smooth',block:'start'});
    },true);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach);
  else attach();
})();
