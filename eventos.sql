-- Corre esto UNA vez en Supabase: SQL Editor -> New query -> pega todo -> Run
create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  fecha date not null,
  hora text,
  imagen text,
  created_at timestamptz not null default now()
);

alter table public.eventos enable row level security;

drop policy if exists "eventos lectura publica" on public.eventos;
create policy "eventos lectura publica" on public.eventos
  for select to anon, authenticated using (true);

drop policy if exists "eventos admin inserta" on public.eventos;
create policy "eventos admin inserta" on public.eventos
  for insert to authenticated with check (true);

drop policy if exists "eventos admin edita" on public.eventos;
create policy "eventos admin edita" on public.eventos
  for update to authenticated using (true) with check (true);

drop policy if exists "eventos admin borra" on public.eventos;
create policy "eventos admin borra" on public.eventos
  for delete to authenticated using (true);

-- Permisos de la API (por si el proyecto no los da por defecto)
grant usage on schema public to anon, authenticated;
grant select on public.eventos to anon, authenticated;
grant insert, update, delete on public.eventos to authenticated;

-- Refresca la API para que reconozca la tabla nueva sin esperar
notify pgrst, 'reload schema';
