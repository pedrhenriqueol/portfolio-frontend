# Projetos — conclusão da implementação de 23/10/2026

## Apresentação atual

Os três destaques compartilham um palco de case study: trilho vertical com orbe,
tela de produto com wipe diagonal, textos mascarados e contador em odômetro.
Os dados e as traduções PT/EN/ES ficam em `src/data/flagshipProjects.ts`.

O catálogo corporativo usa um índice editorial numerado, com prévia de arquitetura
sticky no desktop. `corporate-index.css` completa a estilização que faltava nessa
implementação. Os filtros, a tabela técnica, os repositórios públicos e a indicação
de código privado continuam disponíveis. Selecionar uma linha escolhe a prévia;
o botão de detalhes abre o inspector.

O handoff entre coleções mantém os seletores existentes. A carta de Contato e o
formulário continuam nas mesmas instâncias, sem mudanças em seus arquivos.

## Correções de comportamento

- A navegação por setas dos destaques não cancela a própria animação de scroll.
- Taps e gestos verticais não selecionam outro case; o arraste horizontal é
  proporcional ao tamanho do palco.
- O case ativo se sincroniza ao retornar à viewport. Apenas sua imagem é
  exposta a tecnologias assistivas.
- A câmera cobre a área da imagem em telas largas. O pin considera a altura
  real dos textos e das ações; telas sem espaço usam fluxo normal.
- O índice seleciona projetos por ID, preserva refs ao filtrar e permite
  navegar por setas, Home e End. Elementos em saída ficam inertes.
- A tabela possui cabeçalhos associados e região de rolagem acessível por
  teclado. Metadados de armazenamento respeitam os dados reais do projeto.
- As animações continuam com fallback para `prefers-reduced-motion`.
- A medição da transição Home → Sobre foi agendada fora do callback síncrono
  de `ResizeObserver`. Isso eliminou os avisos de notificações pendentes
  reproduzidos ao alternar desktop → mobile → desktop, preservando sua cena.

## Validação

- `npm run build`: aprovado.
- ESLint de `ProjectsSection.jsx`: aprovado.
- TypeScript focal de dados, hooks e catálogo: aprovado com `--types vite/client`.
- `git diff --check`: aprovado.
- Navegador: três destaques por teclado, filtros rápidos, seis linhas após
  restaurar Todos, navegação por End, tabela e abertura/fechamento do inspector.
- Layout: 1920×1080, 1440×900 e 1366×768; fallbacks em 1440×620,
  390×844 e 320×740 sem overflow horizontal. Ações dos destaques dentro
  da composição.
- Idiomas EN/ES e retorno a PT; links diretos dos destaques, catálogo e Contato.
- Contato: composição aberta, aba da carta preservada e apenas um campo Nome.
- Carregamento frio de `#projetos-corporativos`: seis linhas visíveis, catálogo
  interativo e nenhum erro ou aviso no console da sessão final.
- Sequência de resize repetida após a correção: servidor de desenvolvimento
  sem novos avisos de `ResizeObserver`.

O repositório não possui script `npm test`. O lint do frontend conserva 42 erros
e 5 avisos em arquivos existentes; `npm run lint` também inclui assets compilados
do backend e totaliza 1054 erros e 5 avisos. A checagem de tipos que inclui o
destaque encontra o alias circular já existente em `MagneticButton.tsx` (TS2303).
O ESLint atual cobre JS/JSX, mas não TSX. Movimento reduzido foi revisado no
código; sua preferência do sistema não foi alterada para emulação no navegador.

Este relatório registra a validação local da implementação.
