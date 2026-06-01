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
