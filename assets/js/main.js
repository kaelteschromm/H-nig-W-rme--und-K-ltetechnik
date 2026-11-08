/* Neckair – gemeinsames Script für alle Seiten */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  /* Jahr im Footer */
  document.querySelectorAll('[data-year], #y').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Header-Schatten beim Scrollen */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Menü-Overlay */
  var menuBtn = document.getElementById('menuBtn');
  var overlay = document.getElementById('menuOverlay');
  var closeBtn = document.getElementById('closeMenu');

  function openMenu() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    setTimeout(function () { (closeBtn || overlay).focus(); }, 50);
  }
  function closeMenu() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    menuBtn.focus();
  }

  if (menuBtn && overlay) {
    menuBtn.addEventListener('click', function () {
      overlay.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        overlay.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
      /* Fokus im Menü halten */
      if (e.key === 'Tab' && overlay.classList.contains('open')) {
        var f = overlay.querySelectorAll('a, button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* Splash-Screen (nur Startseite, nur einmal pro Sitzung) */
  var splash = document.getElementById('splash');
  if (splash) {
    var seen = false;
    try { seen = sessionStorage.getItem('neckairSplash') === '1'; } catch (e) {}
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduce) {
      splash.remove();
    } else {
      var hide = function () {
        splash.classList.add('hide');
        try { sessionStorage.setItem('neckairSplash', '1'); } catch (e) {}
        setTimeout(function () { splash.remove(); }, 600);
      };
      splash.addEventListener('click', hide);
      setTimeout(hide, 1400);
    }
  }

  /* Elemente beim Scrollen sanft einblenden */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Google Maps erst nach Klick laden (Datenschutz) */
  document.querySelectorAll('[data-map-src]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var holder = btn.closest('.map-card');
      var iframe = document.createElement('iframe');
      iframe.className = 'map-frame';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.src = btn.getAttribute('data-map-src');
      iframe.title = btn.getAttribute('data-map-title') || 'Karte';
      holder.innerHTML = '';
      holder.appendChild(iframe);
    });
  });
})();
