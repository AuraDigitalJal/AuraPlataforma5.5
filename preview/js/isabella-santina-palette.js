/* Paleta propia para la invitación conjunta de Isabella y Santina.
   Solo plataforma preview. No altera temas, diseños ni la versión Pro. */
(function registerIsabellaSantinaPalette(){
  'use strict';
  const key='isabella_santina_marfil';
  if(typeof PALETTES==='undefined'||typeof PALETTE_LABELS==='undefined'||typeof COLLECTIONS==='undefined')return;
  // El selector toma las etiquetas originales del HTML una sola vez.
  // Guardarlas antes de añadir la nueva evita renombrar otras paletas.
  const selector=document.getElementById('colorPalette');
  if(selector){
    Array.from(selector.options).forEach(function(option){
      if(!PALETTE_LABELS[option.value]){
        PALETTE_LABELS[option.value]=option.textContent.trim();
      }
    });
  }
  PALETTES[key]=[
    '#a48b6e', // champaña sobrio: acentos, iconos y líneas
    '#534c42', // gris topo cálido: texto
    '#605344', // café suave: títulos legibles
    '#908372', // arena: texto secundario
    '#f8f5ef', // hueso: fondo
    '#fffefa'  // blanco marfil: tarjetas
  ];
  PALETTE_LABELS[key]='Marfil y Hueso · Isabella y Santina';
  if(COLLECTIONS.bautizo && Array.isArray(COLLECTIONS.bautizo.palettes)){
    const options=COLLECTIONS.bautizo.palettes;
    if(!options.includes(key))options.unshift(key);
  }
})();