# Betel | Oscar Uncal

Sitio web estático para compartir predicaciones, devocionales, enseñanzas bíblicas, versículos y canales oficiales del ministerio Betel de Oscar Uncal.

El proyecto está preparado para publicarse como sitio estático, por ejemplo en GitHub Pages, sin proceso de build ni dependencias de Node.

## Navegación Del Sitio

La página principal se organiza en secciones pensadas para navegación simple desde escritorio y móvil:

- **Inicio**: presentación del sitio, mensaje principal y acceso rápido al contenido.
- **Versículo del día**: muestra un versículo aleatorio por sesión, disponible en español e inglés.
- **Devocional de hoy**: destaca un video configurado desde `data/featured-videos.json`.
- **Predicaciones**: muestra videos del canal de YouTube y métricas asociadas cuando la API responde correctamente.
- **Recientes**: lista los últimos mensajes publicados en el canal.
- **Enseñanzas**: temas bíblicos con contenido ampliado en modales.
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
- publicar el devocional editando `data/featured-videos.json` vía GitHub API.

El acceso de publicación se guarda solo en el navegador del usuario mediante `localStorage`.

## Estructura Del Proyecto

```text
/
├── index.html
├── admin/
│   └── index.html
├── css/
│   └── styles.css
├── data/
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

El sitio no usa bundler, framework ni gestor de paquetes. Los archivos se sirven directamente desde el navegador:

- `index.html`: estructura principal.
- `css/styles.css`: estilos globales y responsive.
- `js/main.js`: comportamiento principal de la página.
- `js/translations.js`: textos en español e inglés.
- `js/verses.js`: listado de versículos.
- `js/countries.js`: datos y helpers del selector de país.
- `data/featured-videos.json`: video destacado del devocional.

Para probar localmente, alcanza con abrir `index.html` o servir la carpeta:

```bash
python3 -m http.server
```

### Integraciones

- **YouTube Data API**: carga videos, estadísticas y publicaciones recientes de los canales configurados en `js/main.js`.
- **YouTube embeds**: reproduce el devocional destacado y enlaza a videos externos.
- **FormSubmit**: envía suscripciones y pedidos de oración por email.
- **GitHub API**: usada por `admin/index.html` para actualizar `data/featured-videos.json`.
- **PayPal**: enlace externo para donaciones.
- **Mercado Pago / transferencia**: muestra CVU y permite copiarlo.
- **Spotify y Facebook**: enlaces externos a plataformas del ministerio.
- **Google Fonts**: carga tipografías `Libre Baskerville` y `Karla`.

### Estado Local Del Navegador

El sitio usa almacenamiento local del navegador para:

- `betel-lang`: idioma seleccionado.
- `betel-verse-idx`: índice del versículo elegido para la sesión.
- `betel-yt-*`: caché temporal de videos de YouTube.
- claves del admin para sesión y token de publicación.

### Despliegue En GitHub Pages

Para publicar:

1. Subir el contenido del proyecto a un repositorio.
2. Configurar GitHub Pages desde la rama deseada.
3. Mantener `index.html` en la raíz del repositorio.
4. Verificar que `data/featured-videos.json` exista, porque la página principal y el admin dependen de ese archivo.

No subir carpetas `.git` internas dentro de subcarpetas, porque pueden generar problemas como repositorios embebidos o submódulos accidentales.

## Mantenimiento

- Cambiar textos visibles en `js/translations.js`.
- Agregar o editar versículos en `js/verses.js`.
- Modificar estilos en `css/styles.css`.
- Ajustar comportamiento en `js/main.js`.
- Actualizar el devocional destacado en `data/featured-videos.json` o desde `admin/index.html`.
