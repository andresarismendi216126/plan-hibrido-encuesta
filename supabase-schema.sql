drop table if exists public.respuestas_modelo_hibrido cascade;

create table public.respuestas_modelo_hibrido (
  id bigint generated always as identity primary key,
  codigo_participante text not null default 'anonimo',
  ciudad text,
  edad_mascota integer,
  edad_persona integer,
  genero text,
  estrato_social text,
  modelo text,
  claridad text,
  adelanto text,
  copago text,
  opinion_copago_hibrido text,
  claridad_copago_reembolso text,
  comentario text,
  mejora text,
  factura_simulada numeric(14,2),
  modelo_simulado text,
  copago_simulado numeric(14,2),
  fecha timestamptz not null default now(),
  version_prototipo text not null default '1.0'
);

alter table public.respuestas_modelo_hibrido enable row level security;

create policy "Permitir insertar respuestas anonimas"
  on public.respuestas_modelo_hibrido for insert
  to anon
  with check (true);

create policy "Permitir consultar respuestas anonimas"
  on public.respuestas_modelo_hibrido for select
  to anon
  using (true);

create policy "Permitir actualizar respuestas anonimas"
  on public.respuestas_modelo_hibrido for update
  to anon
  using (true)
  with check (true);

create index if not exists respuestas_modelo_hibrido_fecha_idx
  on public.respuestas_modelo_hibrido (fecha desc);
