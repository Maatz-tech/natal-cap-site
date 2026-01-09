// ===========================================
// Parallax Effect Script - Natal Cap
// Desktop only
// ===========================================

(function initParallax() {
  if (window.innerWidth < 1024) return;

  const cards = document.querySelectorAll('.parallax-card');
  if (!cards.length) return;

  function updateParallax() {
    cards.forEach(card => {
      const rect = card.parentElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const relativePosition = (elementCenter - viewportCenter) / windowHeight;

      const offset = relativePosition * 140;
      const scale = 1 + (1 - Math.abs(relativePosition)) * 0.08;

      card.style.transform = `translateY(${offset}px) scale(${scale})`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
})();
