-- Pega TODO esto en Supabase → SQL Editor → Run

-- 1) Tabla con la lista de fotos subidas
create table if not exists public.fotos (
  id bigint generated always as identity primary key,
  ruta text not null unique,
  created_at timestamptz not null default now()
);

alter table public.fotos enable row level security;

-- Cualquier visitante puede VER la lista (para mostrar la galería)
create policy "ver fotos" on public.fotos
  for select to anon, authenticated using (true);

-- Solo el admin (con sesión iniciada) puede agregar o borrar
create policy "admin agrega fotos" on public.fotos
  for insert to authenticated with check (true);
create policy "admin borra fotos" on public.fotos
  for delete to authenticated using (true);

-- 2) Carpeta de archivos (pública para que se vean las fotos)
insert into storage.buckets (id, name, public)
values ('galeria', 'galeria', true)
on conflict (id) do nothing;

create policy "admin sube archivos" on storage.objects
  for insert to authenticated with check (bucket_id = 'galeria');
create policy "admin borra archivos" on storage.objects
  for delete to authenticated using (bucket_id = 'galeria');
