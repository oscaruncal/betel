# Betel | Oscar Uncal

Sitio web estático para compartir predicaciones, devocionales, enseñanzas bíblicas, versículos y canales oficiales del ministerio Betel de Oscar Uncal.

El proyecto está preparado para publicarse como sitio estático, por ejemplo en GitHub Pages, sin proceso de build ni dependencias de Node.

## Navegación Del Sitio

La página principal se organiza en secciones pensadas para navegación simple desde escritorio y móvil:

- **Inicio**: presentación del sitio, mensaje principal y acceso rápido al contenido.
- **Versículo del día**: muestra un versículo aleatorio por sesión, disponible en español e inglés.
- **Devocional de hoy**: destaca un video configurado desde `data/featured-videos.json`.
- **Predicaciones**: muestra los videos más vistos del canal de YouTube y métricas asociadas cuando la API responde correctamente.
- **Recientes**: lista los últimos mensajes publicados en el canal.
- **Enseñanzas**: temas bíblicos con contenido ampliado en acordeones.
- **Links**: accesos a YouTube, Spotify, Facebook y opciones de donación.
- **Comunidad**: formulario para suscripción y pedidos de oración.
- **Donar**: modal con acceso a PayPal y datos de transferencia por Mercado Pago.

El sitio incluye selector de idioma **Español / Inglés**. La preferencia se guarda en el navegador con `localStorage`.

## Administración

La carpeta `admin/` contiene una página administrativa para actualizar el devocional destacado.

Desde `admin/index.html` se puede:

- iniciar sesión con las credenciales configuradas en el propio archivo;
- conectar un token de GitHub;
- cargar un link de YouTube;
- publicar el devocional editando `data/featured-videos.json` vía GitHub API;
- ver y copiar la lista de emails de `data/community-emails.txt`.

El acceso de publicación se guarda solo en el navegador del usuario mediante `localStorage`.

## Estructura Del Proyecto

```text
/
├── index.html
├── styles.css
├── countries.js
├── featured-videos.json
├── admin/
│   └── index.html
├── api/
│   └── community-signup-worker.js
├── css/
│   └── styles.css
├── data/
│   ├── community-emails.txt
│   └── featured-videos.json
├── js/
│   ├── countries.js
│   ├── main.js
│   ├── translations.js
│   └── verses.js
└── palabraviva/
    └── index.html
```

## Apartado Técnico

### Construcción

El sitio no usa bundler, framework ni gestor de paquetes. Los archivos se sirven directamente desde el navegador y la página principal se arma desde `index.html`:

- `index.html`: estructura principal.
- `css/styles.css`: estilos globales y responsive.
- `js/main.js`: comportamiento principal de la página.
- `js/translations.js`: textos en español e inglés.
- `js/verses.js`: listado de versículos.
- `js/countries.js`: datos y helpers del selector de país.
- `data/featured-videos.json`: video destacado del devocional.
- `data/community-emails.txt`: lista simple de emails de comunidad, un email por línea.
- `api/community-signup-worker.js`: Worker serverless para guardar emails en GitHub y reenviar el formulario.
- `admin/index.html`: panel administrativo autocontenido.
- `palabraviva/index.html`: página estática independiente de contenido bíblico.

También existen `styles.css`, `countries.js` y `featured-videos.json` en la raíz. La página principal actual no carga esos archivos; carga `css/styles.css`, `js/countries.js` y `data/featured-videos.json`. Si se mantienen, tratarlos como archivos legacy o auxiliares y revisar antes de editarlos.

Para probar localmente, alcanza con abrir `index.html` o servir la carpeta:

```bash
python3 -m http.server
```

Luego abrir `http://localhost:8000/`. Servir la carpeta con HTTP es preferible para probar `fetch('data/featured-videos.json')`, porque algunos navegadores bloquean peticiones locales al abrir `index.html` con `file://`.

### Carga De Archivos En La Página Principal

`index.html` carga los recursos en este orden:

1. Google Fonts en el `<head>`.
2. `js/countries.js` con `defer`, para exponer `window.COUNTRIES`, `window.populateCountrySelect` y `window.countryNameByCode`.
3. `css/styles.css`.
4. Al final del `<body>`, `js/translations.js`, `js/verses.js` y `js/main.js`.

Ese orden es importante: `main.js` espera que ya existan `translations`, `VERSES` y los helpers de países.

### Internacionalización

La internacionalización está implementada del lado del cliente:

- `js/translations.js` define un objeto global `translations` con claves `es` y `en`.
- Cada texto traducible del HTML tiene un `id` estable, por ejemplo `t-hero-h1`.
- `setLang(lang)` en `js/main.js` busca cada `id`, actualiza `innerHTML`, cambia `document.title`, cambia `document.documentElement.lang` y actualiza placeholders.
- La preferencia se guarda en `localStorage` con la clave `betel-lang`.
- Al cambiar idioma también se recarga el listado de YouTube para usar el canal correspondiente.

Los textos que incluyen HTML, como énfasis o listas, están guardados como strings HTML dentro de `translations.js`.

### Versículo Del Día

Los versículos viven en `js/verses.js` bajo el objeto global `VERSES`.

El índice del versículo se elige al azar al iniciar la sesión del navegador y se guarda en `sessionStorage` con la clave `betel-verse-idx`. Esto hace que el usuario conserve el mismo versículo durante la sesión actual, pero pueda recibir otro en una sesión nueva. El texto se toma del idioma activo (`es` o `en`).

### Países Del Formulario

`js/countries.js` contiene la lista de países con:

- `code`: código ISO de país.
- `es`: nombre en español.
- `en`: nombre en inglés.
- `priority`: marca opcional para países frecuentes.

El helper `populateCountrySelect(selectEl, lang)` arma el `<select>` del formulario. Los países prioritarios aparecen primero y el resto se ordena alfabéticamente.

### Formulario De Comunidad

El formulario de suscripción y pedidos de oración está en `index.html` y llama a `handleSub(event)` en `js/main.js`.

La implementación:

- valida nombre, apellido, email, ciudad y país;
- valida formato básico de email;
- traduce mensajes de error y éxito según el idioma activo;
- envía los datos por `fetch` a FormSubmit usando JSON;
- usa `_subject`, `_template` y `_captcha` como campos de configuración de FormSubmit;
- resetea el formulario si FormSubmit responde correctamente.

El endpoint está definido en `FORMSUBMIT_ENDPOINT` dentro de `js/main.js`.

El formulario puede trabajar de dos maneras:

- Si `COMMUNITY_SIGNUP_ENDPOINT` está vacío, envía directo a `FORMSUBMIT_ENDPOINT`, como fallback.
- Si `COMMUNITY_SIGNUP_ENDPOINT` tiene una URL, envía el alta al endpoint propio. Ese backend guarda el email en `data/community-emails.txt` vía GitHub API y reenvía la notificación a FormSubmit.

El archivo `api/community-signup-worker.js` contiene una implementación lista para Cloudflare Workers. Ese Worker necesita un token de GitHub guardado como variable secreta del entorno, no en el navegador.

### YouTube

La carga de videos se implementa en `js/main.js` con la YouTube Data API.

Configuración principal:

- `YT_API_KEY`: clave pública usada desde el navegador.
- `YT_CHANNELS.es`: canal usado cuando el sitio está en español.
- `YT_CHANNELS.en`: canal usado cuando el sitio está en inglés.
- `YT_CACHE_TTL`: duración de caché local, actualmente 1 hora.

Flujo de carga:

1. `ytLoadForLang(lang)` selecciona el canal según idioma.
2. `ytCacheGet(lang)` intenta recuperar videos desde `localStorage`.
3. Si no hay caché vigente, `ytFetchAllVideos(apiKey, channelId)` consulta el canal, obtiene la playlist de uploads y pagina todos los videos.
4. `ytFetchViewsAndDuration(apiKey, videos)` consulta estadísticas y duración por tandas de hasta 50 videos.
5. Los recientes se ordenan por `publishedAt` descendente.
6. Los más vistos se ordenan por `views` descendente.
7. `ytRender('rec')` pinta el listado paginado de recientes.
8. `ytRenderTop4(videos)` pinta la sección de predicaciones destacadas.

La sección de recientes incluye búsqueda por texto sobre título y descripción. La normalización quita mayúsculas, acentos y espacios repetidos para mejorar coincidencias.

Nota: aunque el nombre interno de la función es `ytRenderTop4`, actualmente renderiza los primeros 5 videos del ranking (`slice(0, 5)`).

### Reproducción De Videos

El sitio evita cargar iframes de YouTube de entrada. Primero muestra miniaturas y un botón de reproducción. Al hacer click:

- crea un `<iframe>` con URL `https://www.youtube.com/embed/{id}?autoplay=1&rel=0`;
- reemplaza la miniatura por el iframe;
- usa `allowFullscreen` y permisos estándar de reproducción.

Este patrón se usa para videos de listados y para el devocional destacado.

### Devocional Destacado

La página principal lee `data/featured-videos.json` con `fetch('data/featured-videos.json?v=' + Date.now(), { cache: 'no-store' })`. El parámetro `v` funciona como cache-buster para que GitHub Pages entregue cambios recientes más rápido.

Formato esperado:

```json
{
  "id": "K3dhGuscYe8",
  "title": "El temor en nuestras vidas",
  "description": ""
}
```

Campos:

- `id`: ID de video de YouTube, obligatorio.
- `title`: título visible, con fallback a `Devocional`.
- `description`: texto opcional; si está vacío, no se muestra descripción.

Si el JSON no existe, no responde o no tiene `id`, la sección `#devocional-hoy` queda oculta.

### Panel Admin

`admin/index.html` es una página autocontenida: HTML, CSS y JavaScript viven en el mismo archivo. Permite actualizar `data/featured-videos.json` y `data/community-emails.txt` en GitHub sin backend propio.

Configuración interna:

- `REPO_OWNER`: dueño del repositorio.
- `REPO_NAME`: nombre del repositorio.
- `BRANCH`: rama objetivo.
- `FILE_PATH`: archivo actualizado, actualmente `data/featured-videos.json`.
- `EMAILS_PATH`: archivo de emails, actualmente `data/community-emails.txt`.
- `TOKEN_KEY`: clave de `localStorage` donde se guarda el token.
- `AUTH_USER`: email autorizado para entrar.
- `AUTH_PASS_HASH`: hash SHA-256 de la contraseña.
- `SESSION_KEY`: clave de sesión local.
- `SESSION_DAYS`: duración de sesión local.

Flujo de autenticación:

1. El usuario ingresa email y contraseña.
2. La contraseña se hashea en el navegador con `crypto.subtle.digest('SHA-256', ...)`.
3. El hash se compara contra `AUTH_PASS_HASH`.
4. Si coincide, se guarda una sesión local con vencimiento.

Flujo de publicación:

1. El usuario pega un token personal de GitHub con permisos de `Contents: Read and write`.
2. El token se guarda en `localStorage`.
3. El admin carga el estado actual desde GitHub API si hay token, o desde `../data/featured-videos.json` como fallback.
4. Al publicar, extrae el ID desde URLs `youtu.be`, `watch?v=`, `shorts`, `live`, `embed` o desde un ID directo.
5. Refresca el SHA actual del archivo con `GET /repos/{owner}/{repo}/contents/{path}`.
6. Envía un `PUT` a la GitHub Contents API con `message`, `content` en base64, `branch` y `sha` si el archivo ya existe.
7. Actualiza el estado visual del admin y avisa que GitHub Pages puede demorar alrededor de 1 minuto.

La tarjeta **Emails de comunidad** permite:

- cargar el contenido actual de `data/community-emails.txt`;
- ver la lista en modo solo lectura;
- actualizar la vista desde el archivo publicado;
- copiar todos los emails al portapapeles;
- consultar el total de emails guardados.

Este admin no reemplaza seguridad del lado servidor: las credenciales y la lógica están visibles en el cliente. Su objetivo es restringir operación básica para usuarios conocidos, mientras la autorización real de escritura depende del token de GitHub.

Importante: `data/community-emails.txt` es un archivo del sitio. Si GitHub Pages o el repositorio son públicos, la lista puede ser accesible públicamente aunque no esté enlazada desde la navegación.

### Worker De Altas De Comunidad

`api/community-signup-worker.js` resuelve el alta automática de comunidad sin exponer credenciales en el frontend.

Responsabilidades:

- recibir el JSON del formulario público;
- validar campos obligatorios y formato de email;
- normalizar el email a minúsculas;
- leer `data/community-emails.txt` desde GitHub;
- agregar el email, deduplicar y ordenar la lista;
- publicar el archivo actualizado vía GitHub Contents API;
- reenviar la notificación por FormSubmit.

Variables requeridas:

- `GITHUB_TOKEN`: token fino de GitHub con permiso `Contents: Read and write`.
- `REPO_OWNER`: dueño del repositorio.
- `REPO_NAME`: nombre del repositorio.

Variables opcionales:

- `BRANCH`: rama destino, default `main`.
- `EMAILS_PATH`: archivo de emails, default `data/community-emails.txt`.
- `FORMSUBMIT_ENDPOINT`: endpoint de FormSubmit, default `https://formsubmit.co/ajax/devocionales001@gmail.com`.
- `ALLOWED_ORIGIN`: origen permitido por CORS. En producción conviene configurarlo con la URL pública del sitio.

Para activar el guardado automático, desplegar el Worker y configurar en `js/main.js`:

```js
var COMMUNITY_SIGNUP_ENDPOINT = 'https://tu-worker.tu-subdominio.workers.dev';
```

Mientras esa variable esté vacía, el sitio conserva el comportamiento anterior y solo envía el formulario por FormSubmit.

### Integraciones

- **YouTube Data API**: carga videos, estadísticas y publicaciones recientes de los canales configurados en `js/main.js`.
- **YouTube embeds**: reproduce el devocional destacado y enlaza a videos externos.
- **FormSubmit**: envía suscripciones y pedidos de oración por email.
- **Cloudflare Worker**: opcional para guardar automáticamente emails de comunidad en el repo.
- **GitHub API**: usada por `admin/index.html` para actualizar `data/featured-videos.json` y `data/community-emails.txt`.
- **PayPal**: enlace externo para donaciones.
- **Mercado Pago / transferencia**: muestra CVU y permite copiarlo.
- **Spotify y Facebook**: enlaces externos a plataformas del ministerio.
- **Google Fonts**: carga tipografías `Libre Baskerville` y `Karla`.

### Estado Local Del Navegador

El sitio usa almacenamiento local del navegador para:

- `betel-lang`: idioma seleccionado.
- `betel-yt-*`: caché temporal de videos de YouTube.
- `betel-admin-token`: token de publicación usado por el admin.
- `betel-admin-session`: sesión local del admin con vencimiento.

Y usa `sessionStorage` para:

- `betel-verse-idx`: índice del versículo elegido para la sesión.

### Accesibilidad E Interacción

La interfaz incluye varias decisiones de accesibilidad implementadas en HTML y JavaScript:

- link de salto al contenido (`skip-link`);
- regiones `aria-live` para cambios de idioma y estado del formulario;
- menú mobile con `aria-hidden`, `aria-expanded`, cierre con `Escape` y manejo de foco;
- modal de donación con cierre por overlay, cierre con `Escape` y retorno de foco;
- acordeones de enseñanza con `aria-expanded` y `aria-controls`;
- estados de validación con `aria-invalid`.

### Estilos

Los estilos principales están en `css/styles.css`. El diseño usa variables CSS para colores, tipografías, fondos, bordes, transiciones y breakpoints. La página principal depende de ese archivo; el admin y `palabraviva/` tienen estilos embebidos propios.

### Datos Y Archivos Legacy

Archivos activos:

- `data/featured-videos.json`: devocional que consume la home y actualiza el admin.
- `data/community-emails.txt`: lista manual de emails de comunidad que administra el admin.
- `js/countries.js`: países activos del formulario.
- `css/styles.css`: estilos activos de la home.

Archivos raíz que pueden estar desfasados:

- `featured-videos.json`: no es leído por la home ni por el admin.
- `countries.js`: actualmente coincide con `js/countries.js`, pero no es el archivo cargado por `index.html`.
- `styles.css`: difiere de `css/styles.css` y no es el archivo cargado por `index.html`.

Antes de borrar o reutilizar estos archivos raíz, verificar si GitHub Pages, enlaces externos o páginas antiguas dependen de ellos.

### Despliegue En GitHub Pages

Para publicar:

1. Subir el contenido del proyecto a un repositorio.
2. Configurar GitHub Pages desde la rama deseada.
3. Mantener `index.html` en la raíz del repositorio.
4. Verificar que `data/featured-videos.json` exista, porque la página principal y el admin dependen de ese archivo.
5. Verificar que `data/community-emails.txt` exista si se usa la tarjeta de emails del admin.

No subir carpetas `.git` internas dentro de subcarpetas, porque pueden generar problemas como repositorios embebidos o submódulos accidentales.

## Mantenimiento

- Cambiar textos visibles en `js/translations.js`.
- Agregar o editar versículos en `js/verses.js`.
- Modificar estilos en `css/styles.css`.
- Ajustar comportamiento en `js/main.js`.
- Actualizar el devocional destacado en `data/featured-videos.json` o desde `admin/index.html`.
- Copiar emails de comunidad desde la tarjeta correspondiente en `admin/index.html`.
