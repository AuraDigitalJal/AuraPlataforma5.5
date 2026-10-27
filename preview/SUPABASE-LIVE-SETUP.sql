-- Aura Digital · LIVE VIEW SUPABASE (PRUEBAS)
-- Ejecutar en SQL Editor del proyecto Supabase que conectes.
-- 1) En Authentication > Providers > Anonymous Sign-Ins: habilitar.
-- 2) En Project Settings / API Keys: copiar SOLO publishable / anon key.
--    NUNCA poner una clave secret o service_role en el editor público.
-- 3) Este bucket es PUBLIC: cualquier persona que conozca la URL exacta
--    de un archivo puede abrirlo. Úsalo solo para pruebas y demos.
-- 4) Configura captcha/rate limiting para Anonymous Sign-Ins.
-- 5) Los archivos no se eliminan automáticamente. Limpia sesiones viejas.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'aura-live',
  'aura-live',
  true,
  41943040,
  array[
    'text/html','application/json',
    'image/jpeg','image/png','image/webp','image/gif',
    'audio/mpeg','audio/mp4','audio/aac','audio/wav',
    'audio/ogg','audio/webm','audio/flac',
    'video/mp4','video/webm'
  ]
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Sólo usuarios autenticados por Supabase Auth, siempre dentro
-- de su propio UUID. Crear usuarios anónimos se hace mediante
-- auth.signInAnonymously() desde el editor, no desde el visor.
drop policy if exists "aura_live_insert_owner" on storage.objects;
create policy "aura_live_insert_owner"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'aura-live'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] ~ '^aura-live-[0-9a-f]{40}$'
);

drop policy if exists "aura_live_select_owner" on storage.objects;
create policy "aura_live_select_owner"
on storage.objects for select
to authenticated
using (
  bucket_id = 'aura-live'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "aura_live_update_owner" on storage.objects;
create policy "aura_live_update_owner"
on storage.objects for update
to authenticated
using (
  bucket_id = 'aura-live'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'aura-live'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] ~ '^aura-live-[0-9a-f]{40}$'
);

drop policy if exists "aura_live_delete_owner" on storage.objects;
create policy "aura_live_delete_owner"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'aura-live'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Realtime Broadcast público se usa únicamente como aviso de cambios.
-- Todas las versiones de preview se guardan en Storage, por lo que
-- el visor recupera la última aun si perdió la notificación.
-- No se necesita crear tablas ni activar Postgres Changes.
