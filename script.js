/* ===== Scroll-triggered animations ===== */
(function () {
  'use strict';

  /* Fallback dla bardzo starych przeglądarek bez IntersectionObserver:
     pokaż całą treść od razu, bez animacji. */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.animate-on-scroll, .hero-card').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  /* Observe all animated elements */
  document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
    observer.observe(el);
  });

  /* Observe hero/footer cards */
  document.querySelectorAll('.hero-card').forEach(function (card) {
    observer.observe(card);
  });
})();

/* ===== Pływające obiekty — parallax przy scrollu ===== */
(function () {
  'use strict';

  var floaties = Array.prototype.slice.call(document.querySelectorAll('.floaty'));
  if (!floaties.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = [];

  /* Kotwiczenie pionowe: top liczony względem sekcji (data-anchor + data-ratio),
     dzięki czemu obiekt trzyma się swojej sekcji także po reflow na mobile.
     Zapamiętujemy środek obiektu w układzie dokumentu do obliczeń parallax. */
  function layout() {
    items = floaties.map(function (el) {
      var anchor = document.getElementById(el.dataset.anchor);
      var ratio = parseFloat(el.dataset.ratio || '0.5');
      var speed = parseFloat(el.dataset.speed || '0');
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
  /* Parallax: przesunięcie zależne od pozycji środka obiektu względem środka ekranu.
     Gdy sekcja jest wyśrodkowana, offset ~0; im dalej, tym większy dryf (skalowany speed). */
  function update() {
    var mid = window.pageYOffset + window.innerHeight / 2;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var offset = (mid - it.center) * it.speed;
      it.el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  /* Recompute po pełnym załadowaniu (znane wymiary obrazków) i przy zmianie rozmiaru. */
  window.addEventListener('load', layout);
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
