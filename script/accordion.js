// ===========================================
// Accordion Script - Natal Cap
// Usado em: regulamento, termos
// ===========================================

function toggleAccordion(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector('.accordion-icon');
  const isOpen = content.classList.contains('open');

  if (isOpen) {
    // Fechando: primeiro define o max-height atual, depois anima para 0
    content.style.maxHeight = content.scrollHeight + 'px';
    requestAnimationFrame(() => {
      content.style.maxHeight = '0';
    });
    content.classList.remove('open');
    icon.classList.remove('open');
  } else {
    // Abrindo: anima para o scrollHeight real
    content.classList.add('open');
    icon.classList.add('open');
    content.style.maxHeight = content.scrollHeight + 'px';

    // Remove o max-height inline após a transição para permitir resize
    content.addEventListener('transitionend', function handler() {
      if (content.classList.contains('open')) {
        content.style.maxHeight = 'none';
      }
      content.removeEventListener('transitionend', handler);
    });
  }
}
