/* ===== Animacje wejścia przy scrollu ===== */
(function () {
  'use strict';

  /* Brak IntersectionObserver: pokaż wszystko od razu */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.animate-on-scroll, .hero-card').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.15 });

  document.querySelectorAll('.animate-on-scroll, .hero-card').forEach(function (el) {
    observer.observe(el);
  });
})();

/* ===== Floaties — parallax (konfiguracja: góra styles.css) ===== */
(function () {
  'use strict';

  var floaties = Array.prototype.slice.call(document.querySelectorAll('.floaty'));
  if (!floaties.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = [];

  /* top = sekcja (data-anchor) + --y × jej wysokość; --y/--speed czytane z CSS,
     więc mają wartości per breakpoint. Wywoływane też po resize. */
  function layout() {
    items = floaties.map(function (el) {
      var cs = getComputedStyle(el);
      var anchor = document.getElementById(el.dataset.anchor);
      var ratio = parseFloat(cs.getPropertyValue('--y')) || 0;
      var speed = parseFloat(cs.getPropertyValue('--speed')) || 0;
      var top = anchor ? anchor.offsetTop + ratio * anchor.offsetHeight : 0;
      el.style.top = top + 'px';
      return { el: el, speed: speed, center: top + el.offsetHeight / 2 };
    });
    if (reduce) {
      floaties.forEach(function (el) { el.style.transform = 'none'; });
    } else {
      update();
    }
  }

  var ticking = false;
  /* Dryf proporcjonalny do odległości środka obiektu od środka ekranu */
  function update() {
    var mid = window.pageYOffset + window.innerHeight / 2;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      it.el.style.transform = 'translate3d(0,' + ((mid - it.center) * it.speed).toFixed(1) + 'px,0)';
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('load', layout); /* ponownie po załadowaniu obrazków */
  layout();

  if (!reduce) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });
})();
