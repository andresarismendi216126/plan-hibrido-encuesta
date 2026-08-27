# Encuesta modelo híbrido

## Ejecutar localmente

Abre `index.html` en el navegador o sirve esta carpeta con cualquier servidor estático.

## Conectar Supabase

1. El proyecto ya está conectado en `config.js` con la URL y la clave pública `publishable` proporcionadas.
2. En Supabase, abre **SQL Editor** y ejecuta `supabase-schema.sql` para crear la tabla y su política RLS.
3. Publica la carpeta completa en GitHub Pages, Netlify, Vercel o un hosting estático.
4. Para configurar otra instancia, edita `config.js` con esta estructura:

```js
window.SURVEY_CONFIG = {
  endpoint: 'https://TU-PROYECTO.supabase.co/rest/v1/respuestas_modelo_hibrido',
  anonKey: 'TU_CLAVE_PUBLICA_ANON'
};
```

La clave `publishable` puede exponerse en una aplicación web cuando las políticas RLS están configuradas. Nunca pongas la contraseña de PostgreSQL ni una clave `service_role` en estos archivos. El archivo `.env` local está ignorado por Git.

Las respuestas se guardan primero en `localStorage`. Si Supabase está configurado, también se envían a la tabla `respuestas_modelo_hibrido`. Para visualizarlas, usa **Table Editor** en Supabase o esta consulta:

```sql
select * from public.respuestas_modelo_hibrido order by fecha desc;
```

## CLI opcional

Para usar Supabase CLI necesitas instalarla y autenticarte en tu equipo. La cadena PostgreSQL requiere reemplazar `[YOUR-PASSWORD]` por la contraseña real y debe usarse únicamente en herramientas locales o backend, nunca en el frontend.

```powershell
supabase login
supabase init
supabase link --project-ref waslmzkyqyygabihsstx
```
