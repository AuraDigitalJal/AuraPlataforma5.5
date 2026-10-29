/* Lúmina Tablet: worker limitado a la página de la aplicación.
   No guarda fotografías, música, configuraciones ni respuestas de Supabase. */
self.addEventListener("install",event=>{
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate",event=>{
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.mode!=="navigate")return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  const match=url.pathname.endsWith("/preview/lumina-v4")||url.pathname.endsWith("/preview/lumina-v4.html");
  if(!match)return;
  event.respondWith(
    fetch(request).catch(()=>new Response(
      '<!doctype html><html lang="es"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:system-ui,sans-serif;padding:32px;background:#fbf9f8;color:#63485b"><h1>Lúmina Studio</h1><p>Conecta la tablet a internet para continuar creando tu invitación.</p></body></html>',
      {status:503,headers:{"Content-Type":"text/html; charset=utf-8"}}
    ))
  );
});
