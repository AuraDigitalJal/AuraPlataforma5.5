/* Aura Digital · Firma institucional por defecto.
 * Respeta la firma compacta de Cassandra y Armando.
 * En Capas interactivas se muestra reducida sobre «CON CARIÑO, PARA TI».
 * Se incorpora a la vista previa y al HTML publicado, nunca a invitaciones ya entregadas.
 */
(function auraBrandCreditDefault566(){
  'use strict';
  if(typeof buildInvitation!=='function')return;
  const previousBuildInvitation=buildInvitation;
  const BRAND_CLASS='aura-brand-credit';
  const BRAND_MARKUP='<footer class="aura-brand-credit" data-aura-brand-credit="default-v1" aria-label="Créditos de diseño"><a href="https://auradigitaljal.com/" target="_blank" rel="noopener noreferrer" aria-label="Creado por Aura Digital. Conoce nuestras invitaciones"><span class="aura-brand-credit-kicker">Creado por</span><strong>AURA DIGITAL</strong><span class="aura-brand-credit-link">Conoce nuestras invitaciones</span></a></footer>';
  const BRAND_CSS=[
    '/* Firma institucional Aura Digital · proporciones de Cassandra */',
    '.aura-brand-credit{width:min(100%,760px);margin:0 auto;padding:0;position:relative;text-align:center;background:transparent!important;border:0!important;box-shadow:none!important;clear:both}',
    '.aura-brand-credit a{display:inline-flex;flex-direction:column;align-items:center;gap:0;padding:4px 14px;color:var(--heading);text-decoration:none;transition:opacity .2s ease,transform .2s ease}',
    '.aura-brand-credit a:hover{opacity:.8;transform:translateY(-2px)}',
    '.aura-brand-credit a:focus-visible{outline:2px solid var(--accent);outline-offset:4px}',
    '.aura-brand-credit-kicker{font:400 9px/1.35 var(--body);color:var(--muted)}',
    '.aura-brand-credit strong{font:500 12px/1.35 "DM Sans",sans-serif;letter-spacing:.14em}',
    '.aura-brand-credit-link{font:400 8px/1.35 var(--body);letter-spacing:.03em;color:var(--muted);text-decoration:underline;text-underline-offset:3px}',
    'main.page .content:has(> .aura-brand-credit){padding-bottom:18px!important}',
    'main.page .content:has(> .aura-brand-credit)>:nth-last-child(2){margin-bottom:0!important}',
    'main.page .content>.aura-brand-credit{margin:10px auto 0}',
    '.aura-close-panel>.aura-brand-credit{margin:12px auto 0;max-width:100%}',
    '@media(max-width:480px){main.page .content:has(> .aura-brand-credit){padding-bottom:16px!important}.aura-close-panel>.aura-brand-credit{margin-top:10px}}'
  ].join('\n');
  const LAYERS_CSS=[
    '/* Capas interactivas: crédito reducido encima de «CON CARIÑO, PARA TI» */',
    'body.theme-baptism_layers .bl-menu .bl-screen-footer{margin-top:clamp(4px,.65dvh,7px)!important}',
    'body.theme-baptism_layers .bl-menu .bl-screen-footer>.aura-brand-credit{display:block;width:100%;max-width:100%;margin:0 auto 4px;padding:0;background:transparent!important;border:0!important;box-shadow:none!important;text-align:center;letter-spacing:normal}',
    'body.theme-baptism_layers .bl-menu .bl-screen-footer>.aura-brand-credit a{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:0;padding:1px 6px;text-decoration:none;color:var(--heading);transition:opacity .2s ease}',
    'body.theme-baptism_layers .bl-menu .bl-screen-footer>.aura-brand-credit a:hover{opacity:.75}',
    'body.theme-baptism_layers .bl-menu .bl-screen-footer>.aura-brand-credit a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}',
    'body.theme-baptism_layers .bl-menu .bl-screen-footer .aura-brand-credit-kicker{font:400 7px/1.18 var(--body);color:var(--muted);letter-spacing:.015em}',
    'body.theme-baptism_layers .bl-menu .bl-screen-footer .aura-brand-credit strong{font:500 10px/1.2 "DM Sans",sans-serif;letter-spacing:.10em;color:var(--heading)}',
    'body.theme-baptism_layers .bl-menu .bl-screen-footer .aura-brand-credit-link{font:400 7px/1.18 var(--body);letter-spacing:.015em;color:var(--muted);text-decoration:underline;text-underline-offset:2px}'
  ].join('\n');
  function addBrand(p,html){
    if(!p||typeof html!=='string'||html.includes('data-aura-brand-credit="default-v1"')||html.includes('class="aura-brand-credit"'))return html;
    if(!html.includes('</style>')||!html.includes('</main>'))return html;
    if(p.themeVisual==='baptism_layers'){
      const target='<div class="bl-screen-footer"><span class="bl-menu-footer-label">CON CARIÑO, PARA TI</span>';
      if(!html.includes(target))return html;
      const layerBrand=BRAND_MARKUP.replace('<footer ','<div ').replace('</footer>','</div>');
      const replacement='<div class="bl-screen-footer">'+layerBrand+'<span class="bl-menu-footer-label">CON CARIÑO, PARA TI</span>';
      return html.replace(target,replacement).replace('</style>','\n'+LAYERS_CSS+'\n</style>');
    }
    let updated=html;
    let inserted=false;
    // Pantallas editoriales y bodas: el crédito va dentro del panel de despedida,
    // sobre el mismo fondo de la sección, no como una franja independiente.
    const closingStart=updated.indexOf('<section id="cierre" class="aura-screen aura-screen-close');
    if(closingStart!==-1){
      const closingEnd=updated.indexOf('</section>',closingStart);
      const panelStart=updated.indexOf('<div class="aura-close-panel"',closingStart);
      const panelTail=updated.lastIndexOf('</div></div></section>',closingEnd);
      if(panelStart!==-1&&closingEnd!==-1&&panelStart<closingEnd&&panelTail>panelStart){
        updated=updated.slice(0,panelTail)+BRAND_MARKUP+updated.slice(panelTail);
        inserted=true;
      }
    }
    // Plantillas tradicionales o cierre opcional desactivado:
    // se agrega como último elemento de .content sin crear otro bloque de fondo.
    if(!inserted){
      const mainStart=updated.indexOf('<main class="page">');
      const mainEnd=updated.indexOf('</main>',mainStart);
      const contentStart=updated.indexOf('<div class="content">',mainStart);
      const contentTail=updated.lastIndexOf('</div></main>',mainEnd);
      if(mainStart!==-1&&mainEnd!==-1&&contentStart>mainStart&&contentStart<mainEnd&&contentTail>contentStart&&contentTail+6===mainEnd){
        updated=updated.slice(0,contentTail)+BRAND_MARKUP+updated.slice(contentTail);
        inserted=true;
      }
    }
    if(!inserted)return html;
    return updated.replace('</style>','\n'+BRAND_CSS+'\n</style>');
  }
  buildInvitation=function(p,a){
    return addBrand(p,previousBuildInvitation(p,a));
  };
})();
