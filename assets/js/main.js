/* ═══════════════════════════════════════════════
   main.js — shared nav/sidebar + utilities
   ═══════════════════════════════════════════════ */

(function () {
  var t = localStorage.getItem('as-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
}());

function buildNav(root) {
  var p = root ? 'pages/' : '';
  var h = root ? '' : '../';
  return [
    '<nav class="nav">',
      '<button class="hamburger" onclick="toggleSidebar()">&#xf0c9;</button>',
      '<a class="nav-brand" href="' + h + 'index.html">',
        '<img class="nav-logo" src="' + h + 'favicon.svg" alt="anomshell logo">',
        'anomshell',
      '</a>',
      '<div class="nav-links">',
        '<a href="https://ko-fi.com/anom538" target="_blank" class="kofi-btn">',
          '<span class="nf">&#xf0f4;</span>',
          '<span>Ko-fi</span>',
        '</a>',
        '<a href="https://github.com/atif-1402/anomshell" target="_blank">',
          '<span class="nf">&#xf09b;</span>',
          '<span>GitHub</span>',
        '</a>',
        '<button class="theme-btn" id="theme-btn" onclick="toggleTheme()">',
          '<span class="nf" id="theme-icon">&#xf185;</span>',
          '<span id="theme-label">Light</span>',
        '</button>',
      '</div>',
    '</nav>',

    '<div class="sidebar-overlay" id="overlay" onclick="toggleSidebar()"></div>',
    '<div class="page-transition-overlay" id="page-transition-overlay" aria-hidden="true"></div>',

    '<div class="layout">',
      '<aside class="sidebar" id="sidebar">',

        '<div class="sidebar-section">',
          '<div class="sidebar-label">General</div>',
          '<a class="sidebar-link" href="' + h + 'index.html" data-page="home">',
            '<span class="nf">&#xf015;</span> Home</a>',
          '<a class="sidebar-link" href="' + p + 'showcase.html" data-page="showcase">',
            '<span class="nf">&#xf03e;</span> Showcase</a>',
          '<a class="sidebar-link" href="' + p + 'credits.html" data-page="credits">',
            '<span class="nf">&#xf004;</span> Contributors</a>',
        '</div>',

        '<div class="sidebar-section">',
          '<div class="sidebar-label">',
            'anomshell <span class="sidebar-badge badge-alpha">alpha</span>',
          '</div>',
          '<a class="sidebar-link" href="' + p + 'intro.html" data-page="intro">',
            '<span class="nf">&#xf05a;</span> Introduction</a>',
          '<a class="sidebar-link" href="' + p + 'install.html" data-page="install">',
            '<span class="nf">&#xf0ed;</span> Installation</a>',
          '<a class="sidebar-link" href="' + p + 'usage.html" data-page="usage">',
            '<span class="nf">&#xf121;</span> Usage</a>',
          '<a class="sidebar-link" href="' + p + 'config.html" data-page="config">',
            '<span class="nf">&#xf013;</span> Configuration</a>',
          '<a class="sidebar-link" href="' + p + 'keybinds.html" data-page="keybinds">',
            '<span class="nf">&#xf11c;</span> Keybindings</a>',
          '<a class="sidebar-link" href="' + p + 'faq.html" data-page="faq">',
            '<span class="nf">&#xf128;</span> FAQ</a>',
        '</div>',

        '<div class="sidebar-section">',
          '<div class="sidebar-label">Dev Notes</div>',
          '<a class="sidebar-link" href="' + p + 'structure.html" data-page="structure">',
            '<span class="nf">&#xf115;</span> Folder Structure</a>',
          '<a class="sidebar-link" href="' + p + 'contrib.html" data-page="contrib">',
            '<span class="nf">&#xf126;</span> Contributing</a>',
        '</div>',

        '<div class="sidebar-kofi">',
          '<a href="https://ko-fi.com/anom538" target="_blank" class="sidebar-kofi-link">',
            '<span class="nf">&#xf0f4;</span>',
            '<div>',
              '<div class="sidebar-kofi-title">Support anomshell</div>',
              '<div class="sidebar-kofi-sub">Buy me a coffee &#x2665;</div>',
            '</div>',
          '</a>',
        '</div>',

      '</aside>',
      '<main class="main" id="main-content">'
  ].join('');
}

function initPageTransitions() {
  var body = document.body;
  if (!body) return;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animate internal page navigations before full-page transition
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    var href = link.getAttribute('href') || '';
    if (!href || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;

    var next;
    try {
      next = new URL(link.href, window.location.href);
    } catch (_err) {
      return;
    }

    var sameOrigin = next.origin === window.location.origin;
    var sameDoc = next.pathname === window.location.pathname && next.search === window.location.search;
    if (!sameOrigin || sameDoc) return;

    if (reduceMotion) return;
    if (body.classList.contains('page-leave')) return;

    e.preventDefault();
    body.classList.add('page-leave');
    setTimeout(function () {
      window.location.href = next.href;
    }, 220);
  });
}

function initPage(pageId, root) {
  root = root === true;
  var pageBody = document.getElementById('page-body');
  if (!pageBody) { console.error('anomshell: missing <div id="page-body">'); return; }
  var content = pageBody.cloneNode(true);
  var wrapper = document.createElement('div');
  wrapper.innerHTML = buildNav(root);
  document.body.insertBefore(wrapper, document.body.firstChild);
  var mainEl = document.getElementById('main-content');
  if (mainEl) mainEl.appendChild(content);
  if (pageBody.parentNode) pageBody.parentNode.removeChild(pageBody);
  document.querySelectorAll('.sidebar-link[data-page]').forEach(function (l) {
    if (l.getAttribute('data-page') === pageId) l.classList.add('active');
  });
  syncThemeUI();
  initPageTransitions();
}

function syncThemeUI() {
  var t = localStorage.getItem('as-theme') || 'dark';
  var icon  = document.getElementById('theme-icon');
  var label = document.getElementById('theme-label');
  if (!icon) return;
  icon.innerHTML    = t === 'light' ? '&#xf186;' : '&#xf185;';
  label.textContent = t === 'light' ? 'Dark' : 'Light';
}

function toggleTheme() {
  var html   = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  var next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('as-theme', next);
  syncThemeUI();
}

function toggleSidebar() {
  var s = document.getElementById('sidebar');
  var o = document.getElementById('overlay');
  if (s) s.classList.toggle('open');
  if (o) o.classList.toggle('open');
}

function toggleFaq(el) {
  el.closest('.faq-item').classList.toggle('open');
}

function openLightbox(src, type, caption) {
  var lb = document.getElementById('_lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = '_lightbox';
    lb.className = 'lightbox';
    lb.innerHTML =
      '<div class="lightbox-inner" onclick="event.stopPropagation()">' +
        '<button class="lightbox-close" onclick="closeLightbox()"><span class="nf">&#xf00d;</span></button>' +
        '<div id="_lb_media"></div>' +
        '<div class="lightbox-caption" id="_lb_cap"></div>' +
      '</div>';
    lb.addEventListener('click', closeLightbox);
    document.body.appendChild(lb);
  }
  var media = document.getElementById('_lb_media');
  if (type === 'video') {
    media.innerHTML = '<video src="' + src + '" controls autoplay style="max-width:100%;max-height:80vh;border-radius:var(--radius)"></video>';
  } else {
    media.innerHTML = '<img src="' + src + '" alt="' + (caption || '') + '">';
  }
  document.getElementById('_lb_cap').textContent = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  var lb = document.getElementById('_lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  var m = document.getElementById('_lb_media');
  if (m) m.innerHTML = '';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
});
