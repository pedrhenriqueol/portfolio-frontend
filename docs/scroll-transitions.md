# Transições de scroll

A prioridade é o desktop e a continuidade de composição observada na referência. A implementação usa scroll nativo, sem capturar `wheel` e sem novas bibliotecas. O deployment da Vercel não foi verificado nesta revisão.

## Composição atual

### Home → Sobre

A abertura é uma única cena delimitada. O terminal atravessa o centro, amplia e gira discretamente enquanto o nome sai. A biografia entra à direita. Em seguida, o terminal reduz sua altura, preservando o tamanho da fonte; formação e relógio aparecem abaixo dele, e os indicadores completam a composição. Só então a cena solta e a leitura continua.

O início da biografia se sobrepõe discretamente à saída do nome. Terminal e credenciais terminam a montagem em 88% do percurso, e os indicadores em 90%; os últimos 10% mantêm a composição completa disponível para leitura e interação.

- Há uma única instância interativa do terminal, preservando comandos e rascunhos.
- A educação acompanha a borda atual do terminal durante a redução para não aparecer atrás dele.
- Os indicadores entram inteiros, sem máscara cortando seus cards.
- O resumo tem fonte maior na composição desktop, com espaço reservado para a navegação e o dock.
- O conteúdo real é medido antes de ativar a cena. Textos longos, telas baixas ou estreitas usam fluxo normal quando a composição não cabe.

### Sobre → Experiência

Os três pilares e a abertura da carreira ocupam o mesmo enquadramento. O pilar central recua e os laterais se afastam, abrindo espaço para o título no centro. Os indicadores entram primeiro, seguidos pelo marco de 2026, depois que os pilares saem. A cena tem 0,86 viewport de percurso, com aceleração e desaceleração graduais e um intervalo final de leitura. Um filamento se transforma de horizontal para vertical e encontra o eixo da timeline. O robô permanece junto ao título, no tamanho habitual.

A cena contém o ano, o registro operacional e o cartão inteiro de 2026, incluindo as responsabilidades. O cabeçalho e o corpo pertencem à mesma superfície e se movem juntos, inclusive na reversão. A ativação exige que título, indicadores e identificação caibam no viewport; o restante do cartão pode ultrapassar a dobra e continua legível por scroll nativo após a soltura. Nenhum cargo, botão ou responsabilidade é duplicado. Também exige espaço lateral para afastar os pilares sem cortar texto; em desktop estreito, usa fluxo normal. O nó de 2026 acompanha o centro dos metadados iniciais, inclusive nos fallbacks, em vez de descer até o meio das responsabilidades.

O rastreador da continuação usa as posições reais dos marcos em pixels do viewport, considerando o `zoom: 0.8` existente. Os anos acendem quando a linha de leitura chega a cada marco.

O filamento da cena acompanha a posição real do início da continuação enquanto o quadro está fixo. Assim, os dois segmentos se encontram antes e depois da soltura, inclusive no percurso reverso. SVG e trilho HTML usam a mesma espessura lógica de 2 px e o mesmo eixo central; o marco de 2026 e o rastreador continuam sendo elementos distintos.

### Experiência → Habilidades

O final real do trilho da carreira se conecta a um marcador acima do título de Habilidades. O título e o seletor de modos entram antes do breve trecho fixo, com 0,32 viewport de percurso. A guia abaixo deles se abre em três saídas para os primeiros cards na Grade Técnica; no visualizador 3D, conserva uma saída central. A geometria acompanha a aproximação do corpo, que permanece no fluxo nativo.

Existe uma única instância de Habilidades. A troca de modo preserva a seleção e recalcula os destinos da guia; a altura do conteúdo 3D não aumenta o percurso fixo. A âncora estacionária `#habilidades` leva à composição revelada. Mobile, telas baixas e movimento reduzido usam fluxo normal, sem o percurso adicional.

Os centros dos cards são medidos pelas posições de layout, sem incorporar os transforms de saída para Projetos. Redimensionar nessa saída e retornar a Habilidades mantém as bifurcações alinhadas.

### Demais seções e acessibilidade

Habilidades → Projetos → Contato mantêm o progresso compartilhado entre os últimos cards, a divisória e o cabeçalho seguinte. O formulário permanece estável na área de leitura. As passagens específicas dessas duas fronteiras ficam para uma etapa posterior.

Mobile, telas baixas e preferência de movimento reduzido usam fluxo normal, sem distância extra para cenas desativadas. Controles escondidos pela transição ficam fora da ordem de foco e voltam ao reverter o scroll. Modais ficam fora dos elementos transformados.

As âncoras `#sobre` e `#experiencia` são marcadores estacionários que levam à composição completa. A seleção da Navbar usa posições de leitura e volta corretamente à Home no percurso reverso. TechChips levam ao terminal expandido e focam o mesmo campo. O link direto `#terminal` também abre o enquadramento inicial, sem alinhar a página pelo filho que está se movendo. Links diretos para Projetos e Contato acompanham as mudanças de altura enquanto os carrosséis carregam. Esse alinhamento inicial para imediatamente após a primeira interação do visitante. Sem hash, a abertura permanece na Home. A barra inferior de versão, horário e latência continua removida.

## Organização

| Arquivo | Responsabilidade |
| --- | --- |
| `AboutExperienceStory.tsx` | Compõe Home/Sobre e a entrada da carreira. |
| `AboutMe.tsx` | Mantém o estado interativo e fornece os blocos de conteúdo para a composição, sem duplicá-los. |
| `Hero.tsx`, `useHeroHandoff.ts`, `scroll-transitions.css` | Cena inicial, geometria medida, foco e fallbacks. |
| `CareerEntranceScene.tsx`, `Common/CareerEntranceStage.tsx`, `useCareerEntrance.ts`, `career-entrance.css` | Passagem dos pilares para a carreira e acompanhamento da continuação. |
| `ProfessionalJourneyTimeline.tsx` | Conteúdo único dos marcos e cartão completo de 2026 na cena inicial. |
| `Skills.tsx`, `Common/CareerSkillsHandoff.tsx`, `useCareerSkillsHandoff.ts`, `career-skills-handoff.css` | Introdução de Habilidades conectada ao trilho da carreira, com corpo e modos preservados em fluxo. |
| `Common/ScrollChapter.tsx` | Fronteiras das seções seguintes. |
| `Navbar.tsx`, `InteractiveTerminal.tsx` | Navegação por posição de leitura e retorno ao terminal expandido. |
| `src/utils/sceneStyles.ts` | Escrita de estilos apenas quando o valor muda e limpeza das propriedades controladas pela cena. |

Hooks ficam em `src/hooks`; os componentes e estilos acima ficam em `src/components/Portfolio`. O antigo `useJourneyHandoff` e sua rail de robô foram removidos.

As medidas são atualizadas em resize, carregamento de fontes e mudanças de conteúdo. O scroll atualiza progresso/estilos por `requestAnimationFrame`, ignorando progresso e valores repetidos. Os estilos dinâmicos ficam nos elementos que se movem, evitando propagar variáveis pela árvore inteira da cena. O atributo `data-scene-progress` permite inspecionar seu progresso sem uma variável CSS herdada. A alteração de altura fica restrita ao corpo isolado do terminal; formação e relógio acompanham a borda com `transform`. Os marcadores da cena não se movem com os filhos animados. Resize e preferência de movimento reduzido limpam os estilos da composição antes de voltar ao fluxo normal.

O canvas de partículas entra em repouso quando a simulação estabiliza, inclusive com o mouse parado sobre ele, e retoma ao receber movimento, resize ou mudança de visibilidade. O backing store usa os pixels físicos do viewport e DPR limitado a 2, preservando o espaçamento lógico com o zoom existente. Isso reduz em 36% os pixels alocados em comparação com a ampliação anterior por `1 / 0.8` nos dois eixos. A barra de progresso da Navbar usa `scaleX`.

`SceneCanvas` e `AmbientBackdrop` deixaram de ser montados pelo App: o primeiro estava encoberto pelo fundo opaco e o segundo recortado por um contêiner de altura zero. Seus arquivos permanecem disponíveis. A checagem de oclusão confirmou a ausência de contribuição visível do WebGL; a retirada evita renderização e carregamento dessa cena durante o scroll.

## Executar

Na raiz, com Node compatível com Vite 8:

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
npm run build
```

O servidor da tarefa pertence ao ambiente de nuvem. Para testar no computador pessoal, use encaminhamento de porta se disponível na interface, ou atualize a cópia local e execute os comandos acima.

## Revisão visual

1. Digite no terminal, role devagar até Sobre e confira a preservação da sessão.
2. Pare e inverta o scroll em posições intermediárias. A geometria deve acompanhar a posição atual.
3. Continue pelos pilares até 2026 e confira a continuidade do cartão e do filamento ao soltar a cena.
4. Siga até Habilidades, inverta o scroll e alterne Grade Técnica/Visualizador 3D. Redimensione a janela já em Projetos e volte para conferir os destinos da guia.
5. Teste links diretos, Navbar, TechChips e os modais de Sobre/carreira.
6. Repita em mobile, tela baixa e com movimento reduzido.

A aprovação estética final permanece com Pedro. Chromium automatizado não substitui Opera, GPU e touchpad físicos.

## Medição de fluidez — 9 de outubro de 2026

Comparação do build `bb5c2a8` com a revisão de otimização `a69fd8c`, em Chromium automatizado, viewport 1440×900, fontes originais e 90 passos de scroll por trecho. São medições da etapa anterior às mudanças de ritmo e à entrada de Habilidades. A instrumentação contou chamadas a `style.setProperty` e alterações de `inert`; os tempos vieram de `Performance.getMetrics`/tracing do Chromium.

| Trecho | Escritas de estilo antes → depois | Alterações de `inert` antes → depois | Recálculo de estilos antes → depois |
| --- | ---: | ---: | ---: |
| Home → Sobre | 2160 → 271 | 900 → 4 | 4391 → 462 ms |
| Pilares → Experiência | 2160 → 214 | 900 → 5 | 3387 → 629 ms |
| Continuação da timeline | 2160 → 0 | 900 → 0 | 528 → 172 ms |

Os contadores abrangem as chamadas instrumentadas da página; não contam atribuições diretas a propriedades de estilo. Os tempos são totais por percurso, não por frame. O ambiente de nuvem usa renderização por software e os resultados não equivalem a uma garantia de 60 fps em hardware real. Não houve erro JavaScript nesse perfil. Após a estabilização das partículas, nenhum redesenho do canvas foi registrado nos três percursos de scroll.

Verificações isoladas das partículas confirmaram convergência com cursor parado, repouso sem redesenho, ausência de leitura de geometria por scroll e remoção dos listeners na desmontagem. Cinco combinações de resolução, zoom e DPR preservaram as coordenadas aparentes após a redução do backing store.

## Validação funcional — 10 de outubro de 2026

- Build de produção aprovado, agora sem o aviso de chunk acima de 700 kB após retirar a cena WebGL encoberta da montagem.
- TypeScript dos hooks de cenas, dos componentes de composição e de `ScrollChapter` aprovado. O projeto não tem comando global de typecheck/tsconfig.
- Lint: 42 erros e 6 avisos preexistentes; não é um lint aprovado. A contagem permaneceu igual à revisão anterior; o ESLint atual não cobre os arquivos TypeScript.
- Chromium com fontes originais: cenas completas em 1440×900, 1366×768 e 1920×1080; percurso reverso, limites de leitura, indicadores e sessão única do terminal aprovados.
- Roda nativa, parada e reversão; robô durante a entrada, TechChip → terminal expandido com foco e comando local aprovados.
- PT, EN e ES: enquadramentos medidos novamente e sem overflow horizontal.
- Experiência → Habilidades: conexão ao fim real do trilho, aproximação da guia ao corpo e reversão aprovadas nas três resoluções desktop. Grade Técnica com três saídas e Visualizador 3D com uma saída; a instância 3D permanece a mesma durante o scroll.
- Redimensionamento durante a saída de Habilidades para Projetos e retorno: centros das três bifurcações alinhados aos cards, com diferença inferior a 0,5 pixel físico nos tamanhos testados.
- Composição de Sobre completamente visível e interativa no intervalo final de leitura; indicadores e marco de 2026 entram em etapas distintas. Cabeçalho e responsabilidades do cartão mantêm contato no desktop e nos fallbacks.
- Link direto `#habilidades`, troca de modos/idiomas e retorno do fallback à cena desktop aprovados.
- Links diretos `#terminal`, `#sobre`, `#experiencia`, `#projetos` e `#contato` aprovados. O desvio de Contato por imports tardios de Projetos foi reproduzido e corrigido.
- Fluxo normal aprovado em 390×844, 820×1180, 1024×768, 1440×600 e 1440×900 com movimento reduzido. Conteúdo preservado e sem overflow horizontal.
- Modais SQL e de registro operacional cobrem o viewport; fechamento e Escape do registro aprovados.
- Fronteiras Habilidades → Projetos e Projetos → Contato: progresso compartilhado e reversão aprovados.
- Nenhum erro JavaScript não tratado nas rodadas finais.

A requisição a Google Fonts recebe HTTP 403 do proxy deste ambiente. A automação visual carregou os arquivos originais Newsreader/Outfit por interceptação apenas no navegador de teste. As URLs e dependências de produção foram preservadas. Ícones externos podem não carregar neste ambiente. Não houve envio real de formulário nem chamada remota Gemini.
