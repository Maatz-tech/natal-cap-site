// ===========================================
// Global Scripts - Natal Cap
// Scripts comuns a todas as páginas
// ===========================================

// Mobile Menu
(function initMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

  if (!mobileMenu) return;

  window.openMobileMenu = function() {
    mobileMenu.classList.add('active');
    document.body.classList.add('menu-open');
  };

  window.closeMobileMenu = function() {
    mobileMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  };

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', window.openMobileMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeMobileMenu();
  });
})();

// Logo Pulse Animation
(function initLogoPulse() {
  const logos = document.querySelectorAll('.logo-mobile, .logo-desktop');
  if (!logos.length) return;

  function doPulse() {
    logos.forEach(logo => {
      logo.classList.add('pulse');
      setTimeout(() => logo.classList.remove('pulse'), 800);
    });
  }

  setInterval(doPulse, 6000);
  setTimeout(doPulse, 3000);
})();

// Botão Central Bounce Animation
(function initCentralBtnBounce() {
  const btn = document.querySelector('.nav-central-btn');
  if (!btn) return;

  function doBounce() {
    btn.classList.add('bounce');
    setTimeout(() => btn.classList.remove('bounce'), 700);
  }

  function triggerDoubleBounce() {
    doBounce();
    setTimeout(doBounce, 800);
  }

  setInterval(triggerDoubleBounce, 5000);
  setTimeout(triggerDoubleBounce, 2000);
})();
