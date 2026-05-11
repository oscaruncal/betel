/**
 * Cloudflare Worker para altas de comunidad.
 *
 * Responsabilidades:
 * - Recibir el formulario publico del sitio.
 * - Guardar el email normalizado en data/community-emails.txt via GitHub API.
 * - Reenviar la notificacion por FormSubmit.
 *
 * Variables de entorno requeridas:
 * - GITHUB_TOKEN: token fino de GitHub con Contents: Read and write.
 * - REPO_OWNER: owner del repo, por ejemplo oscaruncal.
 * - REPO_NAME: nombre del repo, por ejemplo betel.
 *
 * Variables opcionales:
 * - BRANCH: rama destino. Default: main.
 * - EMAILS_PATH: archivo destino. Default: data/community-emails.txt.
 * - FORMSUBMIT_ENDPOINT: endpoint de FormSubmit.
 * - ALLOWED_ORIGIN: origen permitido para CORS. Default: *.
 */

var DEFAULT_BRANCH = 'main';
var DEFAULT_EMAILS_PATH = 'data/community-emails.txt';
var DEFAULT_FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/devocionales001@gmail.com';

export default {
  async fetch(request, env) {
    var origin = env.ALLOWED_ORIGIN || '*';
    var headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: headers });
    }

    if (request.method !== 'POST') {
      return json({ success: false, message: 'Method not allowed' }, 405, headers);
    }

    try {
      assertEnv(env, 'GITHUB_TOKEN');
      assertEnv(env, 'REPO_OWNER');
      assertEnv(env, 'REPO_NAME');

      var payload = await request.json();
      var entry = normalizePayload(payload);

      var results = await Promise.allSettled([
        saveEmailWithRetry(entry.email, env),
        sendFormSubmit(entry.formSubmitPayload, env)
      ]);
      if (results[0].status === 'rejected' || results[1].status === 'rejected') {
        throw new Error('Signup side effect failed');
      }

      return json({ success: true }, 200, headers);
    } catch (err) {
      return json({
        success: false,
        message: err && err.publicMessage ? err.publicMessage : 'No se pudo procesar la suscripcion.'
      }, 400, headers);
    }
  }
};

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  };
}

function json(data, status, headers) {
  var h = new Headers(headers);
  h.set('Content-Type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(data), { status: status, headers: h });
}

function assertEnv(env, name) {
  if (!env[name]) {
    var err = new Error('Missing env ' + name);
    err.publicMessage = 'Configuracion incompleta del servidor.';
    throw err;
  }
}

function normalizePayload(payload) {
  var nombre = clean(payload.Nombre || payload.nombre);
  var apellido = clean(payload.Apellido || payload.apellido);
  var email = clean(payload.Email || payload.email).toLowerCase();
  var ciudad = clean(payload.Ciudad || payload.ciudad);
  var pais = clean(payload['Pais'] || payload['País'] || payload.pais);
  var pedido = clean(payload['Pedido de oracion'] || payload['Pedido de oración'] || payload.pedido);

  if (!nombre || !apellido || !email || !ciudad || !pais) {
    var required = new Error('Missing required fields');
    required.publicMessage = 'Completá nombre, apellido, email, ciudad y país.';
    throw required;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    var invalid = new Error('Invalid email');
    invalid.publicMessage = 'Ingresá un email válido.';
    throw invalid;
  }

  var subject = pedido
    ? 'Suscripcion + pedido de oracion: ' + nombre + ' ' + apellido
    : 'Nuevo suscriptor: ' + nombre + ' ' + apellido;

  return {
    email: email,
    formSubmitPayload: {
      Nombre: nombre,
      Apellido: apellido,
      Email: email,
      Ciudad: ciudad,
      Pais: pais,
      'Pedido de oracion': pedido || '-',
      _subject: subject,
      _template: 'table',
      _captcha: 'false'
    }
  };
}

function clean(value) {
  return String(value || '').trim();
}

async function saveEmail(email, env) {
  var branch = env.BRANCH || DEFAULT_BRANCH;
  var path = env.EMAILS_PATH || DEFAULT_EMAILS_PATH;
  var file = await getGithubFile(path, branch, env);
  var current = file && file.content ? decodeBase64(file.content) : '';
  var emails = normalizeEmailList(current + '\n' + email);
  var content = emails.join('\n') + (emails.length ? '\n' : '');
  await putGithubFile(path, branch, content, file && file.sha, env);
}

async function saveEmailWithRetry(email, env) {
  var lastError = null;
  for (var attempt = 0; attempt < 3; attempt++) {
    try {
      await saveEmail(email, env);
      return;
    } catch (err) {
      lastError = err;
      if (!err || err.message.indexOf('GitHub PUT failed: 409') === -1) break;
    }
  }
  throw lastError || new Error('Email save failed');
}

function normalizeEmailList(raw) {
  var seen = {};
  return String(raw || '')
    .split(/[\n,; \t]+/)
    .map(function(value) { return value.trim().toLowerCase(); })
    .filter(function(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); })
    .filter(function(value) {
      if (seen[value]) return false;
      seen[value] = true;
      return true;
    })
    .sort();
}

async function getGithubFile(path, branch, env) {
  var res = await fetch(githubFileUrl(path, env) + '?ref=' + encodeURIComponent(branch), {
    headers: githubHeaders(env)
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('GitHub GET failed: ' + res.status);
  return res.json();
}

async function putGithubFile(path, branch, content, sha, env) {
  var body = {
    message: 'Add community signup email',
    content: encodeBase64(content),
    branch: branch
  };
  if (sha) body.sha = sha;

  var res = await fetch(githubFileUrl(path, env), {
    method: 'PUT',
    headers: Object.assign(githubHeaders(env), { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error('GitHub PUT failed: ' + res.status);
  return res.json();
}

function githubFileUrl(path, env) {
  return 'https://api.github.com/repos/' + env.REPO_OWNER + '/' + env.REPO_NAME + '/contents/' + path;
}

function githubHeaders(env) {
  return {
    'Authorization': 'Bearer ' + env.GITHUB_TOKEN,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'betel-community-worker'
  };
}

async function sendFormSubmit(payload, env) {
  var endpoint = env.FORMSUBMIT_ENDPOINT || DEFAULT_FORMSUBMIT_ENDPOINT;
  var res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('FormSubmit failed: ' + res.status);
  var data = await res.json().catch(function() { return {}; });
  if (!(data && (data.success === true || data.success === 'true'))) {
    throw new Error('FormSubmit rejected');
  }
}

function encodeBase64(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeBase64(value) {
  try {
    return decodeURIComponent(escape(atob(String(value || '').replace(/\s/g, ''))));
  } catch (_) {
    return '';
  }
}
