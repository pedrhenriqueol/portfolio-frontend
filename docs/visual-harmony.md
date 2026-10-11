# Harmonia visual e movimento

Revisão do caminho ativo de `App.tsx`, de Home até Contato, comparada ao vídeo `portifolio_referencia.mp4` enviado em 10/10/2026. A identidade de Pedro — tipografia Newsreader/Outfit, terminal e conteúdo profissional — continua sendo a base.

## Leitura da referência

O arquivo tem 26,7 segundos. Os tempos abaixo são da gravação, não do contador do player que aparece nela.

- **0–10 s:** composição ampla, poucos elementos dominantes e continuidade do protagonista entre Home e Sobre. Os textos entram e saem acompanhando a cena.
- **10–16 s:** serviços e experiência usam hierarquia forte, fundos discretos, uma cor de acento e espaço entre os grupos.
- **18–22 s:** projetos repetem a mesma anatomia, com screenshots em destaque, tecnologias compactas e indicação de progresso no trilho.
- **22–26 s:** tecnologias organizadas em grupos regulares; o vídeo retorna à Home. Não mostra uma transição de Contato suficiente para reproduzir seu comportamento.

A comparação visual não permite medir com precisão easing, hover ou FPS do site de referência. As durações usadas aqui são escolhas da implementação.

## Mudanças

`src/index.css` reúne superfícies opacas com leve influência da paleta selecionada, bordas, títulos, texto de apoio, chips, controles, campos e foco. As classes ficam em `@layer components`, permitindo ajustes explícitos pelas utilities sem conflitos na cascata. As seis paletas e a preferência salva permanecem disponíveis.

Home, Sobre, Experiência, Habilidades, Projetos e Contato compartilham essa linguagem. A sequência dos capítulos passa a ser `00 → 01 → 02 → 03 → 04 / 04.02 → 05`. Os dois grupos de projetos usam a mesma hierarquia editorial. O rodapé técnico dos destaques dá lugar a orientação de navegação, contador e barra de progresso.

O nome entra em duas linhas após a liberação do preloader. Entradas de conteúdo usam opacidade e pequenos deslocamentos, normalmente em 650 ms, com stagger curto. `Common/Reveal.tsx` executa a entrada uma vez e revela também ao receber foco. O palco dos destaques tem uma camada de entrada separada dos transforms dos cards; sua apresentação em foco está descrita abaixo. Screenshots têm zoom de hover discreto; links de contato deslocam apenas sua seta.

A passagem Habilidades → Projetos agora pertence a `useProjectPresentation`, evitando duas cenas escrevendo nos mesmos elementos. Os hooks de cenas continuam medindo a geometria e escrevendo transforms em seus consumidores; nenhuma variável de scroll nova é herdada por uma seção inteira. A barra dos destaques usa `scaleX`. Foram removidos os grandes blobs com blur da Home e os backdrops do terminal, Navbar e Dock.

As novas entradas e o parallax da Home respeitam movimento reduzido. `MotionConfig` aplica a preferência às animações Framer Motion; as cenas medidas conservam seus próprios fallbacks. As interações existentes, incluindo a timeline e os carrosséis DOM 3D, continuam disponíveis.

Em mobile, cards de projetos ficam mais largos e altos para manter as ações visíveis. Cards laterais inativos não recebem foco. Ícones decorativos dos controles alterados ficam fora do nome acessível. O modal SQL usa portal, saída animada, foco inicial, contenção de Tab, Escape e restauração de foco. Campos de Contato têm labels associados e erros anunciados.

## Validação

- Build Vite concluído; nenhum chunk supera o limite configurado de 700 kB.
- TypeScript dos componentes About, Timeline, Skills, Contact e Reveal passou. A checagem ampliada que inclui Hero e os carrosséis encontra o alias circular preexistente de `MagneticButton.tsx` para `MagneticButton.jsx` (TS2303). Vite compila essa importação normalmente; o wrapper não foi alterado.
- ESLint conserva o resultado anterior: 42 erros e 6 avisos, sem novos achados. O comando não cobre os arquivos TSX neste repositório.
- Chromium/Playwright em 1440 × 900: Home → Sobre, percurso completo e reverso, modal SQL/foco/Escape, alternância de Habilidades, navegação e drawer de projetos, filtros/tabela corporativa, validação local do formulário, clipboard, tema e idiomas EN/ES. Nenhum erro de página.
- Em 320 e 390 px com toque: ações dos projetos dentro dos cards, Contato sem overflow horizontal e nenhum erro de página. Em 1440 px com movimento reduzido: cena inicial em fluxo normal, ações visíveis e Contato sem overflow.
- Revisão visual adicional a 1920 × 1080, link direto `#projetos` alinhado à margem de navegação com CSS zoom e resize para 320 px passaram, sem erro de página.

Comparação indicativa em Chromium headless, a 1440 × 900, num percurso de 6 segundos de Habilidades ao final de Contato:

| Medida | Commit 49693ee | Revisão visual |
| --- | ---: | ---: |
| Tempo acumulado de recálculo de estilos | 358 ms | 260 ms |
| Tempo acumulado de layout | 12,8 ms | 16,6 ms |
| Tempo acumulado de script | 370 ms | 505 ms |
| Tempo acumulado de tarefas | 2075 ms | 2289 ms |
| Intervalos entre RAF maiores que 50 ms | 2 | 0 |

O recálculo de estilos caiu aproximadamente 27%; os novos reveals aumentam a atividade de script. É uma amostra única, com distâncias ligeiramente diferentes devido ao layout e sem a GPU do computador do visitante. Não representa uma garantia de 60 FPS nem uma comparação estatística de desempenho.

Fontes Newsreader, Outfit e ícones Font Awesome foram fornecidos como fixtures locais apenas no navegador de teste, porque os CDNs externos não estavam acessíveis no ambiente. Os arquivos e URLs de produção foram preservados. Não foram enviados formulários reais; o deployment não foi verificado.
