// ===========================================
// Home Page Scripts - Natal Cap
// ===========================================

// Video Lightbox
(function initVideoLightbox() {
  const lightbox = document.getElementById('video-lightbox');
  const iframe = document.getElementById('lightbox-iframe');
  const closeBtn = document.getElementById('lightbox-close');
  const videoThumbs = document.querySelectorAll('.video-thumb');

  if (!lightbox || !iframe) return;

  // Open lightbox
  videoThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const videoId = thumb.dataset.videoId;
      if (videoId) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
})();

// Dynamic Config Loader
(function initConfigLoader() {
  fetch('data/config.json')
    .then(response => response.json())
    .then(config => {
      // Helper para acessar valores aninhados (ex: "hero.mobile" -> config.hero.mobile)
      function getNestedValue(obj, path) {
        return path.split('.').reduce((acc, key) => acc && acc[key], obj);
      }

      // Atualiza elementos com data-config
      document.querySelectorAll('[data-config]').forEach(el => {
        const configPath = el.dataset.config;
        const data = getNestedValue(config, configPath);

        if (!data) return;

        // Se for imagem do hero
        if (configPath.startsWith('hero.')) {
          if (data.src) el.src = data.src;
          if (data.alt) el.alt = data.alt;
        }

        // Se for video
        if (configPath.startsWith('videos.')) {
          // Atualiza video ID
          if (data.videoId) {
            el.dataset.videoId = data.videoId;
          }

          // Atualiza thumbnail
          if (data.thumbnail) {
            const img = el.querySelector('img');
            if (img) {
              img.src = data.thumbnail;
              if (data.alt) img.alt = data.alt;
            }
          }

          // Atualiza caption se existir
          if (data.caption) {
            const captionEl = el.querySelector('.text-white.font-bold');
            if (captionEl) captionEl.textContent = data.caption;
          }
        }
      });
    })
    .catch(err => console.warn('Config not loaded:', err));
})();
