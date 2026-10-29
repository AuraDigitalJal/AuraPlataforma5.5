/* Lúmina V4 tablet - SW con alcance limitado a preview/. No almacena datos o media de clientes. */
const CACHE='lumina-tablet-shell-v1';
const SHELL=['./lumina-v4.html?v=lumina-direct-menu-v4-20261028','./lumina-tablet.webmanifest','./lumina-icon-192.png','./lumina-icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(Promise.resolve().then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('lumina-tablet-shell-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.mode!=='navigate')return;const url=new URL(req.url);if(url.origin!==self.location.origin||!/\\/preview\\/lumina-v4(?:\\.html)?$/.test(url.pathname))return;
 event.respondWith((async()=>{try{const fresh=await fetch(req);if(fresh.ok){const cache=await caches.open(CACHE);await cache.put(req,fresh.clone())}return fresh}catch(error){const cache=await caches.open(CACHE);const cached=await cache.match(req);if(cached)return cached;return new Response('<!doctype html><html lang="es"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:sans-serif;padding:40px;background:#fbf9f8;color:#6b465c"><h1>Lúmina Studio</h1><p>Conecta tu tablet a internet para abrir el editor y continuar trabajando.</p></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8'},status:503})}})());
});
