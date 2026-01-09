// ===========================================
// Regulamento Page Scripts - Natal Cap
// ===========================================

// Dynamic Regulamento Config Loader
(function initRegulamentoLoader() {
  fetch('../data/regulamento.json')
    .then(response => response.json())
    .then(config => {
      const linkIcon = `<svg class="w-[14px] h-[14px] text-[#7b7d84] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>`;

      function createLinkElement(item) {
        const a = document.createElement('a');
        a.href = item.pdf || '#';
        if (item.pdf) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        a.className = 'bg-white border border-[#e5e5e6] rounded-[7px] p-[13px] lg:py-[9px] lg:px-[17px] flex items-center justify-between hover:border-[#db1526] transition-colors';
        a.innerHTML = `<span class="text-[14px] font-bold text-[#19191a] leading-[1.6]">${item.codigo}</span>${linkIcon}`;
        return a;
      }

      // Condições Gerais
      const condicoesContainer = document.getElementById('condicoes-gerais-links');
      if (condicoesContainer && config.condicoesGerais) {
        config.condicoesGerais.forEach(item => {
          condicoesContainer.appendChild(createLinkElement(item));
        });
      }

      // Sorteio Extra
      const sorteioContainer = document.getElementById('sorteio-extra-links');
      if (sorteioContainer && config.sorteioExtra) {
        config.sorteioExtra.forEach(item => {
          sorteioContainer.appendChild(createLinkElement(item));
        });
      }
    })
    .catch(err => console.warn('Regulamento config not loaded:', err));
})();
