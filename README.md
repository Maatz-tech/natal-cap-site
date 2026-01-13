# Natal Cap - Site Institucional

Site institucional do Natal Cap, título de capitalização beneficente que apoia o Hospital Infantil Varela Santiago.

## Stack Técnica

- **HTML5** - Estrutura semântica
- **Tailwind CSS** - Estilização (build para produção)
- **JavaScript Vanilla** - Interações e carregamento dinâmico
- **JSON** - Configuração de conteúdos dinâmicos

## Estrutura do Projeto

```
natal-cap/
├── index.html              # Página inicial
├── index.js                # Scripts da home
├── global.css              # Estilos globais
├── index.css               # Estilos específicos da home
│
├── data/                   # Arquivos de configuração JSON
│   ├── config.json         # Configurações da home (hero, vídeos)
│   ├── resultados.json     # Dados dos sorteios/resultados
│   └── regulamento.json    # Links das condições gerais SUSEP
│
├── dist/                   # CSS compilado (produção)
│   └── output.css
│
├── src/                    # CSS fonte
│   └── input.css           # Entrada do Tailwind
│
├── script/
│   └── main.js             # Config do Tailwind + utils globais
│
├── images/                 # Assets de imagem
│
├── resultados/             # Página de resultados
│   ├── index.html
│   └── index.js
│
├── regulamento/            # Página de regulamento
│   ├── index.html
│   └── index.js
│
├── termos/                 # Página de termos
│   └── index.html
│
├── instituicao-beneficiada/
│   └── index.html
│
├── ganhadores/
│   └── index.html
│
└── contato/
    └── index.html
```

---

## Sistema de Configuração (Provisório)

O site utiliza arquivos JSON na pasta `/data` para gerenciar conteúdos dinâmicos. Isso permite que a equipe atualize informações sem modificar o HTML diretamente.

### Arquivos de Configuração

#### 1. `data/config.json`
Configurações da página inicial (imagens do hero e vídeos).

```json
{
  "hero": {
    "mobile": {
      "src": "images/home/home-hero-image-mobile.webp",
      "alt": "Natal Cap - Sua sorte ajuda quem precisa"
    },
    "desktop": {
      "src": "images/home/home-hero-image-desktop.webp",
      "alt": "Natal Cap - Sua sorte ajuda quem precisa"
    }
  },
  "videos": {
    "sorteio": {
      "thumbnail": "images/home/thumb-sorteio.webp",
      "videoId": "YOUTUBE_VIDEO_ID",
      "alt": "Sorteio ao vivo"
    }
  }
}
```

**Como usar no HTML:**
```html
<img data-config="hero.mobile" src="..." alt="...">
<div data-config="videos.sorteio" data-video-id="">...</div>
```

O JavaScript em `index.js` lê o atributo `data-config` e atualiza os valores automaticamente.

---

#### 2. `data/resultados.json`
Dados completos dos sorteios (datas, prêmios, ganhadores, dezenas).

```json
{
  "resultados": [
    {
      "data": "2025-01-05",
      "dataFormatada": "05/01/2025",
      "pdfUrl": "https://...",
      "edicao": "145",
      "premios": [
        {
          "id": "1",
          "nome": "1° Premio",
          "valor": "R$ 120.000,00",
          "contemplados": [
            {
              "nome": "Nome do Ganhador",
              "numero": "200.265"
            }
          ],
          "dezenasSorteadas": ["99", "24", "00", ...]
        }
      ]
    }
  ]
}
```

**Campos importantes:**
| Campo | Descrição |
|-------|-----------|
| `data` | Data no formato ISO (ordenação) |
| `dataFormatada` | Data para exibição |
| `pdfUrl` | Link do PDF oficial do sorteio |
| `edicao` | Número da edição |
| `premios` | Array com todos os prêmios |
| `contemplados` | Ganhadores de cada prêmio |
| `dezenasSorteadas` | Dezenas do sorteio |

---

#### 3. `data/regulamento.json`
Links das condições gerais aprovadas pela SUSEP.

```json
{
  "condicoesGerais": [
    {
      "codigo": "15414.901263/2019-61",
      "pdf": "https://..."
    }
  ],
  "sorteioExtra": [
    {
      "codigo": "15414.603239/2025-16",
      "pdf": "https://..."
    }
  ]
}
```

---

### Como Funciona o Carregamento

1. Página carrega com valores placeholder/fallback no HTML
2. JavaScript faz `fetch()` do JSON correspondente
3. Elementos com `data-config` são atualizados dinamicamente
4. Se o JSON falhar, os valores do HTML são mantidos

---

## Build para Produção

```bash
# Gerar CSS minificado (apenas classes utilizadas)
npx tailwindcss -i src/input.css -o dist/output.css --minify
```

Ver [TAILWIND-BUILD.md](./TAILWIND-BUILD.md) para instruções detalhadas.

---

## Proposta de Migração para API

O sistema atual de JSONs estáticos é funcional, mas tem limitações para escala. Abaixo está uma proposta de migração para uma arquitetura mais robusta.

### Limitações Atuais

- **Atualização manual**: Requer acesso ao repositório para editar JSONs
- **Sem cache inteligente**: Arquivos são baixados a cada pageview
- **Sem histórico**: Difícil rastrear mudanças nos dados
- **Sem validação**: Erros no JSON quebram a página silenciosamente

### Arquitetura Proposta

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│  API REST   │────▶│  Database   │
│   (Site)    │     │  (Backend)  │     │  (PostgreSQL│
└─────────────┘     └─────────────┘     │  ou similar)│
                           │            └─────────────┘
                           ▼
                    ┌─────────────┐
                    │    CMS      │
                    │  (Painel)   │
                    └─────────────┘
```

### Endpoints Sugeridos

```
GET /api/v1/config
GET /api/v1/resultados
GET /api/v1/resultados?data=2025-01-05
GET /api/v1/resultados/latest
GET /api/v1/regulamento
```

### Exemplo de Migração no Frontend

**Antes (JSON estático):**
```javascript
const response = await fetch('../data/resultados.json');
const data = await response.json();
```

**Depois (API):**
```javascript
const API_BASE = 'https://api.natalcap.com.br/v1';

const response = await fetch(`${API_BASE}/resultados/latest`);
const data = await response.json();
```

### Benefícios da Migração

| Aspecto | JSON Estático | API REST |
|---------|---------------|----------|
| Atualização | Manual (dev) | Painel administrativo |
| Cache | Nenhum | CDN + cache headers |
| Validação | Nenhuma | Schema validation |
| Histórico | Git commits | Audit log |
| Performance | Arquivo completo | Paginação + filtros |
| Segurança | Público | Autenticação opcional |

### Tecnologias Sugeridas

- **Backend**: Node.js (Express/Fastify) ou Python (FastAPI)
- **Database**: PostgreSQL ou MongoDB
- **CMS**: Strapi, Payload CMS, ou painel custom
- **Cache**: Redis + CDN (Cloudflare/Vercel Edge)
- **Hospedagem**: Vercel, Railway, ou AWS

### Fases de Migração

1. **Fase 1**: Criar API que lê os mesmos JSONs (compatibilidade)
2. **Fase 2**: Migrar dados para banco de dados
3. **Fase 3**: Implementar painel administrativo
4. **Fase 4**: Adicionar cache e otimizações

---

## Contato

Desenvolvido por [Maatz](https://maatz.com.br)
