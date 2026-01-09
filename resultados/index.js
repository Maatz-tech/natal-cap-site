// ===========================================
// Resultados Page Scripts - Natal Cap
// ===========================================

let resultadosData = null;
let currentDateIndex = 0;
let currentTabIndex = 0;
let isTransitioning = false;

async function loadResultados() {
  try {
    const response = await fetch('../data/resultados.json');
    const data = await response.json();
    resultadosData = data.resultados;

    populateDateSelect();
    renderResults();
  } catch (error) {
    console.error('Erro ao carregar resultados:', error);
  }
}

function populateDateSelect() {
  const select = document.getElementById('date-select');
  select.innerHTML = resultadosData.map((resultado, index) =>
    `<option value="${index}">${resultado.dataFormatada}</option>`
  ).join('');

  select.addEventListener('change', (e) => {
    currentDateIndex = parseInt(e.target.value);
    currentTabIndex = 0;
    renderResults();
  });
}

function renderResults() {
  const resultado = resultadosData[currentDateIndex];

  // Reset transition state
  isTransitioning = false;

  // Update PDF link
  document.getElementById('pdf-download').href = resultado.pdfUrl;

  // Render tabs
  renderTabs(resultado.premios);

  // Render content (pass full resultado for bannerImagem, edicao, etc)
  renderTabContent(resultado);
}

function renderTabs(premios) {
  const tabsNav = document.getElementById('tabs-nav');
  tabsNav.innerHTML = premios.map((premio, index) => `
    <button
      class="tab-btn ${index === currentTabIndex ? 'active' : ''}"
      data-index="${index}"
    >
      ${premio.nome}
    </button>
  `).join('');

  // Add click handlers
  tabsNav.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newIndex = parseInt(btn.dataset.index);
      if (newIndex !== currentTabIndex && !isTransitioning) {
        switchTab(newIndex);
      }
    });
  });
}

function switchTab(newIndex) {
  if (isTransitioning) return;
  isTransitioning = true;

  const oldIndex = currentTabIndex;
  const contents = document.querySelectorAll('.tab-content');
  const oldContent = contents[oldIndex];
  const newContent = contents[newIndex];

  // Update active tab button immediately
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === newIndex);
  });

  // Phase 1: Fade out current content
  oldContent.classList.remove('active');
  oldContent.classList.add('fade-out');

  // Phase 2: After fade out, switch and fade in new content
  setTimeout(() => {
    oldContent.classList.remove('fade-out');
    currentTabIndex = newIndex;
    newContent.classList.add('fade-in');

    // Phase 3: After fade in, clean up classes
    setTimeout(() => {
      newContent.classList.remove('fade-in');
      newContent.classList.add('active');
      isTransitioning = false;
    }, 250);
  }, 200);
}

function renderTabContent(resultado) {
  const container = document.getElementById('tabs-content');
  const { premios, edicao, bannerImagem, premiacaoImagem } = resultado;

  container.innerHTML = premios.map((premio, index) => `
    <div class="tab-content ${index === currentTabIndex ? 'active' : ''}" data-tab="${index}">
      <!-- Main Layout: flex-col-reverse on mobile, flex-row on desktop -->
      <div class="flex flex-col-reverse lg:flex-row gap-y-[24px] gap-x-[32px]">

        <!-- Left Column (Desktop) / Bottom (Mobile): Prize + Dezenas -->
        <div class="flex flex-col gap-[24px] lg:max-w-[385px] lg:w-[385px] shrink-0">
          <!-- Prize Card -->
          <div class="bg-white border border-border rounded-[24px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] px-[17px] py-[25px] flex flex-col gap-[16px]">
            <!-- Header: Edition + Prize Name -->
            <div class="flex items-center justify-between">
              <span class="bg-surface-muted text-label text-[12px] font-bold uppercase tracking-[1px] px-[7px] py-[3.5px] rounded-[3.5px]">Edição ${edicao}</span>
              <span class="text-primary text-[12px] font-bold uppercase">${premio.nome}</span>
            </div>
            <!-- Prize Image -->
            <div class="w-full h-[178px] overflow-hidden">
              <img src="${premiacaoImagem}" alt="${premio.nome}" class="w-full h-full object-cover">
            </div>
            <!-- Value Box -->
            <div class="bg-surface-light border border-border rounded-[10.5px] py-[17px] px-[17px] flex flex-col items-center justify-center gap-[3.5px]">
              <span class="text-muted text-[10.5px] font-bold uppercase tracking-[1.05px]">Valor Líquido</span>
              <span class="text-heading text-[26px] font-black tracking-[-0.65px]">${premio.valor}</span>
            </div>
          </div>

          <!-- Dezenas Sorteadas -->
          <div class="bg-white rounded-[24px] border border-border shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] px-[17px] py-[25px]">
            <div class="border-b border-border-light pb-[12px] mb-[16px]">
              <h3 class="text-[16px] font-bold text-heading">Dezenas Sorteadas</h3>
            </div>

            <div class="flex flex-wrap gap-[12px]">
              ${premio.dezenasSorteadas.map(dezena => `
                <div class="dezena-item">${String(dezena).padStart(2, '0')}</div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column (Desktop) / Top (Mobile): Contemplados -->
        <div class="lg:flex-1">
          <div class="bg-white border border-border rounded-[21px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] p-[25px] flex flex-col gap-[32px]">
            <!-- Banner Image -->
            <div class="w-full aspect-[749/315] rounded-[8px] lg:rounded-[24px] overflow-hidden">
              <img src="${bannerImagem}" alt="Sorteio" class="w-full h-full object-cover">
            </div>

            <!-- Contemplados Content -->
            <div class="flex flex-col gap-[16px]">
              <!-- Header: Title + Badge -->
              <div class="flex items-center gap-[16px]">
                <h3 class="text-[20px] font-bold text-heading">Contemplados</h3>
                <span class="bg-[rgba(219,21,38,0.1)] border border-[rgba(219,21,38,0.12)] text-primary text-[10.5px] font-bold px-[11.5px] py-[4.5px] rounded-full">${premio.contemplados.length} Ganhador(es)</span>
              </div>

              <!-- Winner Cards -->
              ${premio.contemplados.map(contemplado => `
                <div class="bg-white border border-border rounded-[14px] p-[17px] lg:p-[22px] relative overflow-hidden">
                  <!-- Red left accent -->
                  <div class="absolute left-0 top-0 bottom-0 w-[5px] bg-primary"></div>

                  <!-- Mobile Layout -->
                  <div class="flex flex-col gap-[6px] lg:hidden">
                    <!-- Título Number - inline on mobile -->
                    <div class="flex items-center gap-[8px]">
                      <span class="text-muted text-[12px] font-bold uppercase">Título Nº</span>
                      <span class="text-heading text-[16px] font-bold">${contemplado.numero}</span>
                    </div>
                    <!-- Winner Info -->
                    <div class="flex flex-col gap-[7px]">
                      <p class="text-[16px] font-bold text-heading leading-[1.5]">${contemplado.nome}</p>
                      <div class="flex flex-wrap gap-x-[21px] gap-y-[4px] text-[12px] font-medium text-subtle">
                        <span class="flex items-center gap-[4px]">
                          <svg class="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          ${contemplado.cidade || 'Natal/RN'}
                        </span>
                        <span class="flex items-center gap-[4px]">
                          <span class="w-[14px] h-[14px] bg-border-muted rounded-full flex items-center justify-center text-[10px] font-bold text-subtle">P</span>
                          PDV: ${contemplado.pdv || 'Aplicativo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Desktop Layout -->
                  <div class="hidden lg:flex items-center gap-[12px]">
                    <!-- Título Number -->
                    <div class="flex flex-col items-center min-w-[100px]">
                      <span class="text-muted text-[12px] font-bold uppercase">Título Nº</span>
                      <span class="text-heading text-[16px] font-bold">${contemplado.numero}</span>
                    </div>
                    <!-- Divider -->
                    <div class="w-px h-[42px] bg-surface-muted"></div>
                    <!-- Winner Info -->
                    <div class="flex-1 flex flex-col gap-[7px]">
                      <p class="text-[16px] font-bold text-heading">${contemplado.nome}</p>
                      <div class="flex flex-wrap gap-x-[21px] gap-y-[4px] text-[12px] font-medium text-subtle">
                        <span class="flex items-center gap-[4px]">
                          <svg class="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          ${contemplado.cidade || 'Natal/RN'}
                        </span>
                        <span class="flex items-center gap-[4px]">
                          <span class="w-[14px] h-[14px] bg-border-muted rounded-full flex items-center justify-center text-[10px] font-bold text-subtle">P</span>
                          PDV: ${contemplado.pdv || 'Aplicativo'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>
    </div>
  `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', loadResultados);
