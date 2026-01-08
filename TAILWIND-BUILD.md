# Tailwind CSS Build - Instruções

Este projeto usa Tailwind CSS. Para produção, devemos gerar apenas o CSS utilizado.

## Setup Inicial (uma vez)

```bash
# Instalar Tailwind CLI standalone (não precisa de Node.js)
curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-macos-arm64
chmod +x tailwindcss-macos-arm64
mv tailwindcss-macos-arm64 tailwindcss
```

Ou com npm:
```bash
npm init -y
npm install -D tailwindcss
npx tailwindcss init
```

## Arquivo de Configuração

Criar `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"],
  theme: {
    extend: {
      colors: {
        'primary': '#DB1526',
        'primary-dark': '#B8111F',
      },
      fontFamily: {
        'figtree': ['Figtree', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

## Arquivo CSS de Entrada

Criar `src/input.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles aqui */
html { scroll-behavior: smooth; }
body { font-family: 'Figtree', sans-serif; }

/* Animations */
.fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
.fade-in.visible { opacity: 1; transform: translateY(0); }
/* ... resto dos estilos customizados ... */
```

## Build para Produção

```bash
# Gerar CSS minificado (apenas classes usadas)
./tailwindcss -i src/input.css -o dist/output.css --minify

# Ou com npm
npx tailwindcss -i src/input.css -o dist/output.css --minify
```

## Atualizar HTML

Substituir nos arquivos HTML:
```html
<!-- REMOVER -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- ADICIONAR -->
<link href="dist/output.css" rel="stylesheet">
```

## Watch Mode (desenvolvimento)

```bash
./tailwindcss -i src/input.css -o dist/output.css --watch
```

## Resultado Esperado

- CDN Tailwind: ~300KB
- Build otimizado: ~10-30KB (dependendo das classes usadas)
- Com gzip: ~3-8KB