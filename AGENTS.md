# AGENTS.md

> Guía para agentes de código que trabajen en este proyecto.
> El proyecto está documentado en español; esta guía también lo está.

## Visión general del proyecto

**Betel | Oscar Uncal** es un sitio web estático para un ministerio cristiano. Comparte predicaciones, devocionales, enseñanzas bíblicas, versículos y canales oficiales de Oscar Uncal.

El sitio es **intencionalmente estático**: no hay bundler, framework ni gestor de paquetes. Se publica directamente en GitHub Pages. El único componente con backend es un Cloudflare Worker opcional para guardar emails de comunidad.

## Pila tecnológica

- **Frontend**: HTML5, CSS3, JavaScript vanilla (ES5/ES6 compatible, sin transpilar).
- **Fuentes**: Google Fonts (`Libre Baskerville`, `Karla`).
- **APIs externas**: YouTube Data API v3, GitHub Contents API, FormSubmit.
- **Backend opcional**: Cloudflare Worker (`api/community-signup-worker.js`).
- **Despliegue**: GitHub Pages (sitio estático) + Cloudflare Workers (Worker).
- **Configuración del Worker**: `wrangler.toml`.

## Estructura de archivos

```
/
├── index.html              # Página principal
├── css/styles.css          # Estilos globales y responsive de la home
├── js/
│   ├── main.js             # Comportamiento principal (i18n, YouTube, form, UI)
│   ├── translations.js     # Textos en español e inglés (objeto global `translations`)
│   ├── verses.js           # Versículos (objeto global `VERSES`)
│   └── countries.js        # Países del formulario + helpers
├── data/
│   ├── featured-videos.json   # Devocional destacado ({ id, title, description })
│   └── community-emails.txt   # Lista de emails (uno por línea)
├── admin/
│   └── index.html          # Panel admin autocontenido (HTML+CSS+JS)
├── palabraviva/
│   └── index.html          # Página estática adicional independiente
├── api/
│   └── community-signup-worker.js  # Worker de Cloudflare para altas
├── wrangler.toml           # Configuración del Worker
├── .dev.vars.example       # Plantilla de variables locales del Worker
├── README.md               # Documentación extensa para humanos
└── CLAUDE.md               # Guía rápida para Claude Code
```

### Archivos legacy en raíz

Existen `styles.css`, `countries.js` y `featured-videos.json` en la raíz que **no son cargados por `index.html`**. La home usa `css/styles.css`, `js/countries.js` y `data/featured-videos.json`. Tratar los archivos de raíz como legacy; verificar dependencias antes de modificarlos o eliminarlos.

## Cómo probar localmente

No hay paso de build. Para probar la home, servir la carpeta con cualquier servidor estático:

```bash
python3 -m http.server
# Luego abrir http://localhost:8000/
```

Servir por HTTP es preferible a abrir `index.html` directamente con `file://`, porque algunos navegadores bloquean `fetch()` a archivos locales.

### Worker de Cloudflare (local)

```bash
# 1. Copiar secrets locales
cp .dev.vars.example .dev.vars
# 2. Editar .dev.vars con el token real de GitHub
# 3. Ejecutar en modo dev
npx wrangler dev
```

### Desplegar el Worker

```bash
npx wrangler secret put GITHUB_TOKEN
npx wrangler deploy
```

## Orden de carga de la página principal

`index.html` carga recursos en este orden exacto:

1. Google Fonts en `<head>`.
2. `js/countries.js` con `defer`.
3. `css/styles.css`.
4. Al final del `<body>`: `js/translations.js`, `js/verses.js`, `js/main.js`.

`main.js` depende de que ya existan los objetos globales `translations`, `VERSES` y los helpers de países (`window.populateCountrySelect`, `window.countryNameByCode`). No cambiar este orden sin refactorizar a módulos.

## Convenciones de código

### JavaScript

- Usar JavaScript vanilla compatible con navegadores modernos. No usar TypeScript ni frameworks.
- Preferir `var` sobre `let`/`const` para mantener consistencia con el estilo actual (el código usa `var` extensivamente).
- Las funciones globales expuestas al HTML (ej. `onclick`) deben ser globales reales (no módulos ES), a menos que se refactorice todo el sistema de eventos.
- Los objetos de datos globales (`translations`, `VERSES`, `COUNTRIES`) viven en sus propios archivos.

### CSS

- Los estilos de la home viven en `css/styles.css`.
- El admin (`admin/index.html`) y `palabraviva/index.html` tienen estilos embebidos propios; no comparten `css/styles.css`.
- Se usan variables CSS para colores, tipografías, transiciones y breakpoints.

### HTML

- Cada texto traducible tiene un `id` estable con prefijo `t-`, por ejemplo `t-hero-h1`.
- Se incluyen atributos de accesibilidad (`aria-label`, `aria-expanded`, `aria-controls`, `aria-live`, `aria-invalid`).

### Internacionalización

- Agregar o editar textos visibles en `js/translations.js`, no en `js/main.js`.
- Cada idioma tiene una clave de objeto (`es`, `en`). Los valores pueden contener HTML.
- Los placeholders de formularios se actualizan desde `setLang()` en `main.js`.

## Datos y contenido

- **Versículos**: agregar o editar en `js/verses.js`. Cada idioma es un array de objetos `{ text, ref }`.
- **Países**: `js/countries.js` contiene objetos `{ code, es, en, priority? }`. Los de `priority: 1` aparecen primero en el `<select>`.
- **Devocional destacado**: `data/featured-videos.json` debe tener `{ "id": "YOUTUBE_ID", "title": "...", "description": "" }`. Si no tiene `id`, la sección queda oculta.
- **Emails de comunidad**: `data/community-emails.txt` es un archivo de texto plano, un email por línea.

## Integraciones externas

### YouTube Data API

- Configurada en `js/main.js`:
  - `YT_API_KEY`: clave pública.
  - `YT_CHANNELS`: `{ es: '...', en: '...' }`.
  - `YT_CACHE_TTL`: 1 hora (caché en `localStorage`).
- El sitio carga todos los videos del canal, obtiene vistas y duración, y ordena por recientes / más vistos.

### FormSubmit

- Endpoint para suscripciones y pedidos de oración: `https://formsubmit.co/ajax/devocionales001@gmail.com`.
- Configurado en `js/main.js` (`FORMSUBMIT_ENDPOINT`) y en `wrangler.toml`.

### GitHub API

- Usada por `admin/index.html` para editar `data/featured-videos.json` y leer `data/community-emails.txt`.
- Usada por el Worker para escribir `data/community-emails.txt`.
- Requiere un token de GitHub con permiso `Contents: Read and write`.

## Panel de administración

- `admin/index.html` es una página autocontenida con su propio CSS y JS.
- **Autenticación**: email + contraseña hasheada con SHA-256 en el cliente. La sesión se guarda en `localStorage` con vencimiento.
- **Token de GitHub**: se guarda en `localStorage` (`betel-admin-token`). La escritura real depende de este token y de la GitHub API.
- **No es seguro del lado servidor**: las credenciales y la lógica son visibles en el cliente. Su propósito es restringir operaciones básicas a usuarios conocidos.

## Consideraciones de seguridad

- `data/community-emails.txt` puede ser accesible públicamente si el repositorio o GitHub Pages son públicos, aunque no esté enlazado desde la navegación.
- La clave de YouTube (`YT_API_KEY`) es pública en `js/main.js`; está restringida por dominio en Google Cloud Console.
- `.dev.vars` contiene `GITHUB_TOKEN` y está ignorado por Git. Nunca commitearlo.
- El hash de la contraseña del admin está visible en `admin/index.html`; no es un sistema de seguridad robusto.

## Testing

No hay suite de tests automatizados. Las validaciones manuales recomendadas son:

1. Abrir `index.html` servido por HTTP.
2. Cambiar idioma y verificar que todos los textos se actualicen.
3. Verificar que el formulario valida campos y envía correctamente.
4. Comprobar que los videos de YouTube cargan y se pueden reproducir.
5. En el admin, verificar login, carga de devocional y lectura de emails.

## Mantenimiento habitual

| Tarea | Archivo |
|-------|---------|
| Cambiar textos visibles | `js/translations.js` |
| Agregar/editar versículos | `js/verses.js` |
| Modificar estilos de la home | `css/styles.css` |
| Ajustar comportamiento | `js/main.js` |
| Actualizar devocional destacado | `data/featured-videos.json` o admin |
| Cambiar canales de YouTube | `js/main.js` (`YT_CHANNELS`) |
| Modificar países del formulario | `js/countries.js` |

## Notas para agentes

- El sitio es estático por diseño. Evitar agregar un build step (webpack, vite, etc.) a menos que el usuario lo solicite explícitamente.
- No modificar `admin/index.html` para mover su CSS/JS a archivos externos; está diseñado a propósito como archivo autocontenido.
- Si se agrega una nueva sección traducible, seguir el patrón de `id`s con prefijo `t-` y agregarla en `translations.js` para ambos idiomas.
- Antes de borrar archivos de la raíz (`styles.css`, `countries.js`, `featured-videos.json`), confirmar que no sean usados por GitHub Pages, enlaces externos o páginas antiguas.
