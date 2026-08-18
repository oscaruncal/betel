/* ── LANGUAGE SWITCHER ── */
function setLang(lang) {
  var t = translations[lang];
  var els = [];
  Object.keys(t).forEach(function(id) {
    if (id === 'title') return;
    var el = document.getElementById(id);
    if (el) els.push(el);
  });

  // Fade out
  els.forEach(function(el) {
    el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(4px)';
  });

  setTimeout(function() {
    // Actualizar contenido
    document.title = t['title'];
    document.documentElement.lang = lang === 'es' ? 'es' : 'en';
    Object.keys(t).forEach(function(id) {
      if (id === 'title') return;
      var el = document.getElementById(id);
      if (el) el.innerHTML = t[id];
    });

    // Fade in
    els.forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    var phName = document.getElementById('sub-name');
    var phSurname = document.getElementById('sub-surname');
    var phEmail = document.getElementById('sub-email');
    var phCity = document.getElementById('sub-city');
    var phMsg = document.getElementById('sub-msg');
    if (phName) phName.placeholder = (lang === 'en') ? 'Name' : 'Nombre';
    if (phSurname) phSurname.placeholder = (lang === 'en') ? 'Surname' : 'Apellido';
    if (phEmail) phEmail.placeholder = (lang === 'en') ? 'you@email.com' : 'tu@email.com';
    if (phCity) phCity.placeholder = (lang === 'en') ? 'City' : 'Ciudad';
    if (phMsg) phMsg.placeholder = (lang === 'en') ? 'Prayer request (optional)' : 'Pedido de oración (opcional)';
    var videoSearch = document.getElementById('yt-rec-search');
    if (videoSearch) videoSearch.placeholder = (lang === 'en') ? 'Faith, prayer, family...' : 'Fe, oración, familia...';
    var phCountry = document.getElementById('sub-country');
    if (phCountry && typeof window.populateCountrySelect === 'function') {
      window.populateCountrySelect(phCountry, lang);
    }

    document.getElementById('btn-es').classList.toggle('active', lang === 'es');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    var esM = document.getElementById('btn-es-m');
    var enM = document.getElementById('btn-en-m');
    if (esM) esM.classList.toggle('active', lang === 'es');
    if (enM) enM.classList.toggle('active', lang === 'en');
    localStorage.setItem('betel-lang', lang);
    var announce = document.getElementById('lang-announce');
    if (announce) announce.textContent = lang === 'es' ? 'Idioma cambiado a español' : 'Language changed to English';
    if (typeof ytLoadForLang === 'function') ytLoadForLang(lang);
    var v = (VERSES[lang] || VERSES.es)[verseIndex];
    var vt = document.getElementById('t-verse-text');
    var vr = document.getElementById('t-verse-ref');
    if (vt) vt.textContent = v.text;
    if (vr) vr.textContent = v.ref;
  }, 200);
}

// Inicializar idioma guardado (espera a que defer-scripts como countries.js terminen)
(function() {
  var saved = localStorage.getItem('betel-lang') || 'es';
  var initLang = function() { setLang(saved); };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }
})();

/* Scroll fade-in */
(function() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    return;
  }
  window._fadeObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        window._fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => window._fadeObs.observe(el));
})();

/* Dropdown Links */
function toggleLinks(e) {
  e.preventDefault();
  var dd = document.getElementById('linksDropdown');
  dd.classList.toggle('open');
}
document.addEventListener('click', function(e) {
  var dd = document.getElementById('linksDropdown');
  if (dd && !dd.contains(e.target)) dd.classList.remove('open');
});

/* Menú mobile */
var mobileLastFocus = null;
var MOBILE_FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function handleMobileOverlay(e) {
  if (e.target === document.getElementById('mobileMenu')) closeMobileMenu();
}

function openMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  var btn = document.getElementById('nav-hamburger');
  mobileLastFocus = document.activeElement;
  menu.classList.add('open');
  menu.setAttribute('aria-hidden', 'false');
  btn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  var first = menu.querySelector(MOBILE_FOCUSABLE);
  if (first) first.focus();
}

function closeMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  var btn = document.getElementById('nav-hamburger');
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  if (mobileLastFocus && typeof mobileLastFocus.focus === 'function') {
    mobileLastFocus.focus();
    mobileLastFocus = null;
  }
}

document.addEventListener('keydown', function(e) {
  var menu = document.getElementById('mobileMenu');
  if (!menu || !menu.classList.contains('open')) return;
  if (e.key === 'Escape') {
    closeMobileMenu();
    return;
  }
  if (e.key !== 'Tab') return;
  var focusables = Array.prototype.slice.call(menu.querySelectorAll(MOBILE_FOCUSABLE))
    .filter(function(el) { return el.offsetParent !== null; });
  if (!focusables.length) return;
  var first = focusables[0];
  var last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
});

/* Modal de donación */
var donateLastFocus = null;
var DONATE_FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function openDonate(e) {
  if (e && e.preventDefault) e.preventDefault();
  donateLastFocus = document.activeElement;
  var m = document.getElementById('donateModal');
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  var closeBtn = m.querySelector('.donate-close');
  if (closeBtn) closeBtn.focus();
}
function closeDonate() {
  var m = document.getElementById('donateModal');
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (donateLastFocus && typeof donateLastFocus.focus === 'function') {
    donateLastFocus.focus();
    donateLastFocus = null;
  }
}
function handleDonateOverlay(e) {
  if (e.target === document.getElementById('donateModal')) closeDonate();
}
/* Focus trap dentro del modal */
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Tab') return;
  var m = document.getElementById('donateModal');
  if (!m || !m.classList.contains('open')) return;
  var focusables = Array.prototype.slice.call(m.querySelectorAll(DONATE_FOCUSABLE))
    .filter(function(el) { return el.offsetParent !== null; });
  if (!focusables.length) return;
  var first = focusables[0];
  var last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
});
function copyDonateCvu(btn) {
  var cvu = document.getElementById('donateMpCvu').textContent.trim();
  var label = btn.querySelector('span');
  var lang = (document.documentElement.lang === 'en') ? 'en' : 'es';
  var ok = (lang === 'en') ? 'Copied' : 'Copiado';
  var fail = (lang === 'en') ? 'Press Ctrl+C' : 'Copiá con Ctrl+C';
  var done = function(success) {
    var prev = label.textContent;
    label.textContent = success ? ok : fail;
    btn.classList.toggle('copied', success);
    setTimeout(function() {
      label.textContent = (lang === 'en') ? 'Copy' : 'Copiar';
      btn.classList.remove('copied');
    }, 1800);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cvu).then(function() { done(true); }, function() { done(false); });
  } else {
    try {
      var r = document.createRange();
      r.selectNodeContents(document.getElementById('donateMpCvu'));
      var s = window.getSelection();
      s.removeAllRanges(); s.addRange(r);
      document.execCommand('copy');
      s.removeAllRanges();
      done(true);
    } catch (_) { done(false); }
  }
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var m = document.getElementById('donateModal');
    if (m && m.classList.contains('open')) closeDonate();
  }
});

/* Acordeón de temas */
document.querySelectorAll('.topic-item').forEach(function(item, index) {
  var btn = item.querySelector('.topic-trigger');
  var panel = item.querySelector('.topic-body-outer');
  if (!btn || !panel) return;
  var id = panel.id || 'topic-panel-' + (index + 1);
  panel.id = id;
  btn.setAttribute('aria-controls', id);
});

function toggleTopic(btn) {
  var item = btn.closest('.topic-item');
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.topic-item.open').forEach(function(el) {
    el.classList.remove('open');
    el.querySelector('.topic-trigger').setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

/* Pedido de oración → notificación por email vía FormSubmit */
var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/devocionales001@gmail.com';
var COMMUNITY_SIGNUP_ENDPOINT = '';

function handleSub(e) {
  e.preventDefault();
  var form = e.target;
  var nameI = document.getElementById('sub-name');
  var surnameI = document.getElementById('sub-surname');
  var emailI = document.getElementById('sub-email');
  var cityI = document.getElementById('sub-city');
  var countryI = document.getElementById('sub-country');
  var msgI = document.getElementById('sub-msg');
  var btn = form.querySelector('button');
  var status = document.getElementById('formStatus');
  var lang = (document.documentElement.lang === 'en') ? 'en' : 'es';

  var msgs = {
    es: {
      required: 'Completá nombre, apellido, email, ciudad y país.',
      invalidEmail: 'Ingresá un email válido.',
      sending: 'Enviando…',
      okWithPrayer: '¡Gracias! Quedaste suscripto y vamos a estar orando por tu pedido.',
      okSubscribe: '¡Gracias! Te avisaremos cuando haya un nuevo devocional.',
      err: 'No pudimos enviar el formulario. Intentá de nuevo en unos minutos.'
    },
    en: {
      required: 'Please complete name, surname, email, city and country.',
      invalidEmail: 'Please enter a valid email.',
      sending: 'Sending…',
      okWithPrayer: "Thank you! You're subscribed and we'll be praying for your request.",
      okSubscribe: "Thank you! We'll let you know when there is a new devotional.",
      err: "We couldn't send the form. Please try again in a few minutes."
    }
  };
  var t = msgs[lang];
  var nombre = (nameI.value || '').trim();
  var apellido = (surnameI.value || '').trim();
  var email = (emailI.value || '').trim();
  var ciudad = (cityI.value || '').trim();
  var paisCode = countryI.value || '';
  var paisNombre = paisCode && window.countryNameByCode ? window.countryNameByCode(paisCode, lang) : paisCode;
  var pedido = (msgI.value || '').trim();

  var fields = [nameI, surnameI, emailI, cityI, countryI, msgI];
  fields.forEach(function(el) {
    el.classList.remove('is-invalid');
    el.removeAttribute('aria-invalid');
  });
  status.className = 'cta-status';

  var invalid = [];
  if (!nombre) invalid.push(nameI);
  if (!apellido) invalid.push(surnameI);
  if (!email) invalid.push(emailI);
  if (!ciudad) invalid.push(cityI);
  if (!paisCode) invalid.push(countryI);

  if (invalid.length) {
    invalid.forEach(function(el) {
      el.classList.add('is-invalid');
      el.setAttribute('aria-invalid', 'true');
    });
    status.textContent = t.required;
    status.classList.add('is-error');
    invalid[0].focus();
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailI.classList.add('is-invalid');
    emailI.setAttribute('aria-invalid', 'true');
    status.textContent = t.invalidEmail;
    status.classList.add('is-error');
    emailI.focus();
    return;
  }

  var originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = t.sending;
  status.textContent = '';

  var subject = pedido
    ? 'Suscripción + pedido de oración: ' + nombre + ' ' + apellido
    : 'Nuevo suscriptor: ' + nombre + ' ' + apellido;

  var payload = {
    Nombre: nombre,
    Apellido: apellido,
    Email: email,
    Ciudad: ciudad,
    País: paisNombre,
    'Pedido de oración': pedido || '—',
    _subject: subject,
    _template: 'table',
    _captcha: 'false'
  };

  var okMsg = pedido ? t.okWithPrayer : t.okSubscribe;
  var submitEndpoint = COMMUNITY_SIGNUP_ENDPOINT || FORMSUBMIT_ENDPOINT;

  fetch(submitEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(r) { return r.json().catch(function(){ return {}; }); })
  .then(function(data) {
    if (data && (data.success === 'true' || data.success === true)) {
      status.textContent = okMsg;
      status.classList.add('is-success');
      form.reset();
    } else {
      status.textContent = (data && data.message) || t.err;
      status.classList.add('is-error');
    }
  })
  .catch(function() {
    status.textContent = t.err;
    status.classList.add('is-error');
  })
  .then(function() {
    btn.disabled = false;
    btn.textContent = originalLabel;
  });
}

/* Limpia el estado is-invalid al volver a editar el campo */
document.querySelectorAll('.cta-form input, .cta-form textarea').forEach(function(el) {
  el.addEventListener('input', function() {
    if (el.classList.contains('is-invalid')) {
      el.classList.remove('is-invalid');
      el.removeAttribute('aria-invalid');
    }
  });
});

/* ── VERSÍCULO DEL DÍA ── */
    var verseIndex = parseInt(sessionStorage.getItem('betel-verse-idx'));
if (isNaN(verseIndex)) {
  verseIndex = Math.floor(Math.random() * VERSES.es.length);
  sessionStorage.setItem('betel-verse-idx', verseIndex);
}

(function initVerse() {
  var lang = localStorage.getItem('betel-lang') || 'es';
  var v = (VERSES[lang] || VERSES.es)[verseIndex];
  document.getElementById('t-verse-text').textContent = v.text;
  document.getElementById('t-verse-ref').textContent = v.ref;
})();

/* ── YOUTUBE API ── */
var YT_API_KEY = 'AIzaSyB-P_fQvifJMEhm9FaGkvCsUSrMzKlcXuc';
var YT_CHANNELS = {
  es: 'UCS6R64PyG8TCxmnwuMcnS5Q',
  en: 'UCCiNz-PQt9006xU2ppVYASg'
};
var YT_PER_PAGE = 9;
var ytCurrentLang = null;

var ytState = {
  rec: { allVideos: [], videos: [], page: 0, perPage: 6, query: '' }
};

function ytPlayIcon() {
  return '<svg viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg"><path d="M66.5 7.7c-.8-2.9-3-5.1-5.8-5.9C55.8.9 34 .9 34 .9S12.3.9 7.3 1.8C4.6 2.6 2.3 4.9 1.5 7.7.7 12.8.7 24 .7 24s0 11.2.8 16.3c.8 2.9 3 5.1 5.8 5.9C12.3 47.1 34 47.1 34 47.1s21.8 0 26.7-.9c2.8-.8 5-3 5.8-5.9.8-5.1.8-16.3.8-16.3s0-11.2-.8-16.3z" fill="#f00"/><path d="M27 33l18-9-18-9v18z" fill="#fff"/></svg>';
}

function ytLang() {
  return (localStorage.getItem('betel-lang') || 'es') === 'en' ? 'en' : 'es';
}

function ytFormatViews(n) {
  var label = ytLang() === 'en' ? ' views' : ' vistas';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M' + label;
  if (n >= 1000) return Math.round(n / 1000) + 'K' + label;
  return n + label;
}

function ytFormatDate(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  var diff = Math.floor((new Date() - d) / 1000);
  var en = ytLang() === 'en';
  if (diff < 60)           return en ? 'just now'                                    : 'hace un momento';
  if (diff < 3600)         return en ? Math.floor(diff/60) + ' min ago'              : 'hace ' + Math.floor(diff/60) + ' min';
  if (diff < 86400)        return en ? Math.floor(diff/3600) + 'h ago'               : 'hace ' + Math.floor(diff/3600) + ' h';
  if (diff < 7*86400)      return en ? Math.floor(diff/86400) + ' days ago'          : 'hace ' + Math.floor(diff/86400) + ' días';
  if (diff < 30*86400)     return en ? Math.floor(diff/7/86400) + ' weeks ago'       : 'hace ' + Math.floor(diff/7/86400) + ' sem';
  if (diff < 365*86400)    return en ? Math.floor(diff/30/86400) + ' months ago'     : 'hace ' + Math.floor(diff/30/86400) + ' meses';
  return en ? Math.floor(diff/365/86400) + ' years ago' : 'hace ' + Math.floor(diff/365/86400) + ' años';
}

function ytIsNew(iso) {
  if (!iso) return false;
  return (new Date() - new Date(iso)) < 7 * 24 * 60 * 60 * 1000;
}

function ytBuildMeta(v) {
  var parts = [];
  if (v.duration) parts.push('<span class="vm-duration">▶ ' + v.duration + '</span>');
  if (v.publishedAt) parts.push('<span class="vm-date">' + ytFormatDate(v.publishedAt) + '</span>');
  if (v.views) parts.push('<span class="vm-views">' + ytFormatViews(v.views) + '</span>');
  return parts.length ? '<div class="video-meta">' + parts.join('<span class="vm-sep">·</span>') + '</div>' : '';
}

function ytEscape(value) {
  return String(value || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function ytNormalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function ytMatchesQuery(video, query) {
  if (!query) return true;
  var haystack = ytNormalize([video.title, video.description].join(' '));
  return query.split(' ').every(function(term) {
    return haystack.indexOf(term) !== -1;
  });
}

function ytBuildDesc(v) {
  var descLines = v.description ? v.description.split('\n').map(function(l){ return l.trim(); }).filter(function(l){ return l.length > 0; }) : [];
  var titleClean = v.title.replace(/[^a-záéíóúüñ0-9 ]/gi,'').trim().toLowerCase();
  var rawDesc = '';
  for (var di = 0; di < descLines.length; di++) {
    var line = descLines[di];
    var lineClean = line.replace(/[^a-záéíóúüñ0-9 ]/gi,'').trim().toLowerCase();
    var lineNoColon = lineClean.replace(/:$/,'').trim();
    var isTitleRepeat = lineClean === titleClean || titleClean.startsWith(lineClean) || lineClean.startsWith(titleClean) || lineNoColon === titleClean || titleClean.startsWith(lineNoColon) || lineNoColon.startsWith(titleClean);
    if (!isTitleRepeat && line.length >= 20 && !/^https?:\/\//i.test(line) && !/^[@#]/.test(line)) { rawDesc = line; break; }
  }
  var shortDesc = rawDesc.length > 180 ? rawDesc.slice(0, 180).trim() + '…' : rawDesc;
  return shortDesc ? '<div class="video-desc">' + shortDesc.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>' : '';
}

function ytBindInlinePlayers(root) {
  root.querySelectorAll('.yt-inline-play').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id = btn.getAttribute('data-video-id');
      var title = btn.getAttribute('data-title') || 'Video';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      iframe.title = title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;

      if (btn.parentElement && btn.parentElement.classList.contains('video-embed')) {
        btn.parentElement.replaceChildren(iframe);
        return;
      }

      var embed = document.createElement('div');
      embed.className = 'video-embed';
      embed.appendChild(iframe);
      btn.replaceWith(embed);
    }, { once: true });
  });
}

function ytRender(key) {
  var s = ytState[key];
  var grid = document.getElementById('yt-' + key + '-grid');
  var perPage = s.perPage || YT_PER_PAGE;
  var start = s.page * perPage;
  var slice = s.videos.slice(start, start + perPage);
  var empty = document.getElementById('yt-' + key + '-empty');

  grid.innerHTML = slice.map(function(v, i) {
    var id = v.videoId;
    var title = ytEscape(v.title);
    var titleAttr = ytEscape(v.title);
    var thumb = v.thumb || ('https://i.ytimg.com/vi/' + id + '/hqdefault.jpg');
    var isFirst = (s.page === 0 && i === 0);
    var isNew = ytIsNew(v.publishedAt);
    var badgeHtml = isNew ? '<span class="yt-badge-new">Nuevo</span>' : '';
    return '<div class="video-card fade-in' + (isFirst ? ' video-card--featured' : '') + '">' +
      '<button type="button" class="video-thumb-wrap yt-inline-play" data-video-id="' + id + '" data-title="' + titleAttr + '" aria-label="Reproducir: ' + titleAttr + '">' +
        '<img src="' + thumb + '" alt="' + titleAttr + '" loading="lazy" onerror="this.style.display=\'none\'">' +
        '<div class="yt-play-btn">' + ytPlayIcon() + '</div>' +
        badgeHtml +
      '</button>' +
      '<div class="video-body">' +
        '<div class="video-tag">Oscar Uncal</div>' +
        '<a href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener" class="video-title video-title-link">' + title + '</a>' +
        ytBuildDesc(v) +
        ytBuildMeta(v) +
      '</div>' +
    '</div>';
  }).join('');

  ytBindInlinePlayers(grid);

  grid.querySelectorAll('.fade-in').forEach(function(el) {
    el.classList.remove('visible');
    if (window._fadeObs) window._fadeObs.observe(el);
  });

  var total = s.videos.length;
  var totalPages = Math.ceil(total / perPage);
  var pag = document.getElementById('yt-' + key + '-pag');
  var info = document.getElementById('yt-' + key + '-info');
  var prev = document.getElementById('yt-' + key + '-prev');
  var next = document.getElementById('yt-' + key + '-next');
  if (empty) empty.hidden = total > 0;
  if (totalPages > 1) {
    pag.style.display = 'flex';
    info.textContent = (s.page + 1) + ' / ' + totalPages;
    prev.disabled = s.page === 0;
    next.disabled = s.page >= totalPages - 1;
  } else {
    pag.style.display = 'none';
  }
}

function ytSearchStatusText(count, total, query) {
  var en = ytLang() === 'en';
  if (!query) return en ? total + ' videos loaded' : total + ' videos cargados';
  if (count === 1) return en ? '1 result' : '1 resultado';
  return en ? count + ' results' : count + ' resultados';
}

function ytApplySearch(key) {
  var s = ytState[key];
  var input = document.getElementById('yt-' + key + '-search');
  var clear = document.getElementById('yt-' + key + '-search-clear');
  var status = document.getElementById('yt-' + key + '-search-status');
  var query = ytNormalize(input ? input.value : '');

  s.query = query;
  s.page = 0;
  s.videos = s.allVideos.filter(function(video) {
    return ytMatchesQuery(video, query);
  });

  if (clear) clear.hidden = !query;
  if (status) status.textContent = ytSearchStatusText(s.videos.length, s.allVideos.length, query);
  ytRender(key);
}

function ytSetupSearch() {
  var input = document.getElementById('yt-rec-search');
  var clear = document.getElementById('yt-rec-search-clear');
  if (!input || input.dataset.bound === 'true') return;

  input.dataset.bound = 'true';
  input.addEventListener('input', function() {
    ytApplySearch('rec');
  });
  if (clear) {
    clear.addEventListener('click', function() {
      input.value = '';
      input.focus();
      ytApplySearch('rec');
    });
  }
}

function ytPage(key, dir) {
  var s = ytState[key];
  var totalPages = Math.ceil(s.videos.length / (s.perPage || YT_PER_PAGE));
  var next = s.page + dir;
  if (next < 0 || next >= totalPages) return;
  s.page = next;
  ytRender(key);
  document.getElementById('yt-' + key + '-grid').closest('section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

var YT_CACHE_TTL = 60 * 60 * 1000; // 1 hora

function ytCacheGet(lang) {
  try {
    var raw = localStorage.getItem('betel-yt-' + lang);
    if (!raw) return null;
    var obj = JSON.parse(raw);
    if (Date.now() - obj.ts > YT_CACHE_TTL) { localStorage.removeItem('betel-yt-' + lang); return null; }
    return obj.videos;
  } catch(e) { return null; }
}

function ytCacheSet(lang, videos) {
  try { localStorage.setItem('betel-yt-' + lang, JSON.stringify({ ts: Date.now(), videos: videos })); } catch(e) {}
}

function ytParseDuration(iso) {
  var m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '';
  var h = parseInt(m[1] || 0), min = parseInt(m[2] || 0), sec = parseInt(m[3] || 0);
  if (h > 0) return h + ':' + String(min).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
  return min + ':' + String(sec).padStart(2,'0');
}

async function ytFetchAllVideos(apiKey, channelId) {
  var chRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=' + channelId + '&key=' + apiKey);
  var chData = await chRes.json();
  if (!chData.items || !chData.items.length) throw new Error('Canal no encontrado');
  var uploadsId = chData.items[0].contentDetails.relatedPlaylists.uploads;

  var items = [];
  var pageToken = '';
  do {
    var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + uploadsId +
      '&maxResults=50&key=' + apiKey + (pageToken ? '&pageToken=' + pageToken : '');
    var res = await fetch(url);
    var data = await res.json();
    if (data.error) throw new Error(data.error.message);
    data.items.forEach(function(item) {
      var sn = item.snippet;
      var vid = sn.resourceId && sn.resourceId.videoId;
      if (vid) items.push({
        videoId: vid,
        title: sn.title,
        description: sn.description || '',
        thumb: (sn.thumbnails.maxres || sn.thumbnails.high || sn.thumbnails.medium).url,
        publishedAt: sn.publishedAt,
        views: 0,
        duration: ''
      });
    });
    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return items;
}

async function ytFetchViewsAndDuration(apiKey, videos) {
  for (var i = 0; i < videos.length; i += 50) {
    var batch = videos.slice(i, i + 50);
    var ids = batch.map(function(v) { return v.videoId; }).join(',');
    var res = await fetch('https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=' + ids + '&key=' + apiKey);
    var data = await res.json();
    if (data.items) {
      data.items.forEach(function(item) {
        var found = videos.find(function(v) { return v.videoId === item.id; });
        if (found) {
          found.views = parseInt((item.statistics && item.statistics.viewCount) || '0', 10);
          found.duration = ytParseDuration((item.contentDetails && item.contentDetails.duration) || '');
        }
      });
    }
  }
  return videos;
}

function ytRenderTop4(videos) {
  var loading = document.getElementById('yt-top-loading');
  var grid = document.getElementById('yt-top-grid');
  if (loading) loading.style.display = 'none';
  if (!grid) return;

  grid.innerHTML = videos.slice(0, 5).map(function(v, i) {
    var id = v.videoId;
    var title = v.title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    var titleAttr = v.title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    var thumb = v.thumb || ('https://i.ytimg.com/vi/' + id + '/hqdefault.jpg');
    var isFirst = i === 0;
    return '<div class="video-card fade-in' + (isFirst ? ' video-card--featured' : '') + '">' +
      '<div class="video-embed">' +
        '<button type="button" class="video-thumb-wrap yt-inline-play" data-video-id="' + id + '" data-title="' + titleAttr + '" aria-label="Reproducir: ' + titleAttr + '">' +
          '<img src="' + thumb + '" alt="' + titleAttr + '" loading="lazy" onerror="this.style.display=\'none\'">' +
          '<div class="yt-play-btn">' + ytPlayIcon() + '</div>' +
        '</button>' +
      '</div>' +
      '<div class="video-body">' +
        '<div class="video-tag">Oscar Uncal</div>' +
        '<div class="video-title">' + title + '</div>' +
        ytBuildDesc(v) +
        ytBuildMeta(v) +
      '</div>' +
    '</div>';
  }).join('');

  ytBindInlinePlayers(grid);

  grid.querySelectorAll('.fade-in').forEach(function(el) {
    el.classList.remove('visible');
    if (window._fadeObs) window._fadeObs.observe(el);
  });
}

async function ytLoadForLang(lang) {
  if (ytCurrentLang === lang) return;
  ytCurrentLang = lang;

  var channelId = YT_CHANNELS[lang] || YT_CHANNELS.es;

  var recLoading = document.getElementById('yt-rec-loading');
  var recError   = document.getElementById('yt-rec-error');
  var recGrid    = document.getElementById('yt-rec-grid');

  // Reset UI
  var topGrid = document.getElementById('yt-top-grid');
  var topLoading = document.getElementById('yt-top-loading');
  if (topGrid) topGrid.innerHTML = '';
  if (topLoading) topLoading.style.display = 'flex';
  recGrid.innerHTML = '';
  recError.style.display = 'none';
  recLoading.style.display = 'flex';
  ytState.rec = { allVideos: [], videos: [], page: 0, perPage: 6, query: '' };
  document.getElementById('yt-rec-pag').style.display = 'none';
  var recSearchWrap = document.getElementById('yt-rec-search-wrap');
  var recSearchInput = document.getElementById('yt-rec-search');
  var recSearchStatus = document.getElementById('yt-rec-search-status');
  var recSearchClear = document.getElementById('yt-rec-search-clear');
  var recEmpty = document.getElementById('yt-rec-empty');
  if (recSearchWrap) recSearchWrap.hidden = true;
  if (recSearchInput) recSearchInput.value = '';
  if (recSearchStatus) recSearchStatus.textContent = '';
  if (recSearchClear) recSearchClear.hidden = true;
  if (recEmpty) recEmpty.hidden = true;

  try {
    var allVideos = ytCacheGet(lang);
    if (!allVideos) {
      allVideos = await ytFetchAllVideos(YT_API_KEY, channelId);
      if (!allVideos.length) throw new Error('Sin videos');
      allVideos = await ytFetchViewsAndDuration(YT_API_KEY, allVideos);
      ytCacheSet(lang, allVideos);
    }

    // Actualizar links y contadores según el canal cargado
    var channelUrl = lang === 'en'
      ? 'https://www.youtube.com/@devocionaleseningles'
      : 'https://www.youtube.com/@beteldeoscaruncal2876';
    ['yt-rec-channel-btn'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.href = channelUrl;
    });
    var totalLabel = allVideos.length + ' videos';
    ['yt-rec-total'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) { el.textContent = totalLabel; el.style.display = 'inline-block'; }
    });

    recLoading.style.display = 'none';
    ytState.rec.allVideos = allVideos.slice().sort(function(a, b) {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
    ytState.rec.videos = ytState.rec.allVideos.slice();
    ytSetupSearch();
    if (recSearchWrap) recSearchWrap.hidden = false;
    if (recSearchStatus) recSearchStatus.textContent = ytSearchStatusText(ytState.rec.videos.length, ytState.rec.allVideos.length, '');
    ytRender('rec');

    var withViews = allVideos.slice().sort(function(a, b) { return b.views - a.views; });
    ytRenderTop4(withViews);

  } catch(err) {
    console.error('YouTube API error:', err);
    recLoading.style.display = 'none';
    recError.style.display = 'block';
  }
}

// Cargar al iniciar con el idioma guardado
(function() {
  var saved = localStorage.getItem('betel-lang') || 'es';
  ytLoadForLang(saved);
})();

/* ── DEVOCIONAL DE HOY (lee data/featured-videos.json) ── */
(function() {
  var section = document.getElementById('devocional-hoy');
  if (!section) return;

  // Cache-buster suave para que GH Pages sirva la versión nueva pronto
  fetch('data/featured-videos.json?v=' + Date.now(), { cache: 'no-store' })
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(data) {
      if (!data || !data.id) return;
      var embed = document.getElementById('featured-embed');
      var cover = document.getElementById('featured-cover');
      var titleEl = document.getElementById('featured-title');
      var descEl = document.getElementById('featured-desc');
      var title = (data.title || 'Devocional').toString();
      var desc = (data.description || '').toString().trim();
      var videoId = encodeURIComponent(data.id);

      cover.style.backgroundImage = 'url("https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg")';
      cover.setAttribute('aria-label', 'Reproducir devocional: ' + title);
      titleEl.textContent = title;
      if (desc) {
        descEl.textContent = desc;
        descEl.hidden = false;
      } else {
        descEl.hidden = true;
      }

      cover.addEventListener('click', function() {
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
        iframe.title = title;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        embed.replaceChildren(iframe);
      }, { once: true });

      section.hidden = false;
    })
    .catch(function() { /* sección oculta por defecto */ });
})();
