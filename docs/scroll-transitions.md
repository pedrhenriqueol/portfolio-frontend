# Transições de scroll

A prioridade é o desktop e a continuidade de composição observada na referência. A implementação usa scroll nativo, sem capturar `wheel` e sem novas bibliotecas. O deployment da Vercel não foi verificado nesta revisão.

## Composição atual

### Home → Sobre

A abertura é uma única cena delimitada. O terminal atravessa o centro, amplia e gira discretamente enquanto o nome sai. A biografia entra à direita. Em seguida, o terminal reduz sua altura, preservando o tamanho da fonte; formação e relógio aparecem abaixo dele, e os indicadores completam a composição. Só então a cena solta e a leitura continua.

- Há uma única instância interativa do terminal, preservando comandos e rascunhos.
- A educação acompanha a borda atual do terminal durante a redução para não aparecer atrás dele.
- Os indicadores entram inteiros, sem máscara cortando seus cards.
- O resumo tem fonte maior na composição desktop, com espaço reservado para a navegação e o dock.
- O conteúdo real é medido antes de ativar a cena. Textos longos, telas baixas ou estreitas usam fluxo normal quando a composição não cabe.

### Sobre → Experiência

Os três pilares e a abertura da carreira ocupam o mesmo enquadramento. O pilar central recua e os laterais se afastam, abrindo espaço para o título no centro. Os indicadores e o marco de 2026 entram depois que os pilares saem. Um filamento se transforma de horizontal para vertical e encontra o eixo da timeline. O robô permanece junto ao título, no tamanho habitual.

A cena contém o ano, o registro operacional e a identificação do cargo de 2026. As responsabilidades completas continuam logo abaixo, na mesma coluna, seguidas por 2025 e 2024. Nenhum cargo, botão ou responsabilidade é duplicado. A cena é delimitada e não prende o restante da timeline. Também exige espaço lateral para afastar os pilares sem cortar texto; em desktop estreito, usa fluxo normal.

O rastreador da continuação usa as posições reais dos marcos em pixels do viewport, considerando o `zoom: 0.8` existente. Os anos acendem quando a linha de leitura chega a cada marco.

### Demais seções e acessibilidade

Experiência → Habilidades → Projetos → Contato mantêm o progresso compartilhado entre os últimos cards, a divisória e o cabeçalho seguinte. O formulário permanece estável na área de leitura.

Mobile, telas baixas e preferência de movimento reduzido usam fluxo normal, sem distância extra para cenas desativadas. Controles escondidos pela transição ficam fora da ordem de foco e voltam ao reverter o scroll. Modais ficam fora dos elementos transformados.

As âncoras `#sobre` e `#experiencia` são marcadores estacionários que levam à composição completa. A seleção da Navbar usa posições de leitura e volta corretamente à Home no percurso reverso. TechChips levam ao terminal expandido e focam o mesmo campo. O link direto `#terminal` também abre o enquadramento inicial, sem alinhar a página pelo filho que está se movendo. Links diretos para Projetos e Contato acompanham as mudanças de altura enquanto os carrosséis carregam. Esse alinhamento inicial para imediatamente após a primeira interação do visitante. Sem hash, a abertura permanece na Home. A barra inferior de versão, horário e latência continua removida.

## Organização

| Arquivo | Responsabilidade |
| --- | --- |
| `AboutExperienceStory.tsx` | Compõe Home/Sobre e a entrada da carreira. |
| `AboutMe.tsx` | Mantém o estado interativo e fornece os blocos de conteúdo para a composição, sem duplicá-los. |
| `Hero.tsx`, `useHeroHandoff.ts`, `scroll-transitions.css` | Cena inicial, geometria medida, foco e fallbacks. |
| `CareerEntranceScene.tsx`, `Common/CareerEntranceStage.tsx`, `useCareerEntrance.ts`, `career-entrance.css` | Passagem dos pilares para a carreira e acompanhamento da continuação. |
| `ProfessionalJourneyTimeline.tsx` | Conteúdo único dos marcos, separando a identificação inicial das responsabilidades na cena. |
| `Common/ScrollChapter.tsx` | Fronteiras das seções seguintes. |
| `Navbar.tsx`, `InteractiveTerminal.tsx` | Navegação por posição de leitura e retorno ao terminal expandido. |

Hooks ficam em `src/hooks`; os componentes e estilos acima ficam em `src/components/Portfolio`. O antigo `useJourneyHandoff` e sua rail de robô foram removidos.

As medidas são atualizadas em resize, carregamento de fontes e mudanças de conteúdo. O scroll atualiza progresso/estilos por `requestAnimationFrame`. A alteração de altura fica restrita ao corpo isolado do terminal; os marcadores da cena não se movem com os filhos animados.

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
4. Teste links diretos, Navbar, TechChips e os modais de Sobre/carreira.
5. Repita em mobile, tela baixa e com movimento reduzido.

A aprovação estética final permanece com Pedro. Chromium automatizado não substitui Opera, GPU e touchpad físicos.

## Validação desta revisão

- Build de produção aprovado; permanece o aviso de chunk acima de 700 kB.
- TypeScript dos hooks de cenas e `ScrollChapter` aprovado. O projeto não tem comando global de typecheck/tsconfig.
- Lint: 43 erros e 6 avisos, mesma contagem preexistente; não é um lint aprovado.
- Chromium com fontes originais: cenas completas em 1440×900, 1366×768 e 1920×1080; percurso reverso, limites de leitura, indicadores e sessão única do terminal aprovados.
- Roda nativa, parada e reversão; robô durante a entrada, TechChip → terminal expandido com foco e comando local aprovados.
- PT, EN e ES: enquadramentos medidos novamente e sem overflow horizontal.
- Links diretos `#terminal`, `#sobre`, `#experiencia`, `#projetos` e `#contato` aprovados. O desvio de Contato por imports tardios de Projetos foi reproduzido e corrigido.
- Fluxo normal aprovado em 390×844, 820×1180, 1024×768, 1440×600 e 1440×900 com movimento reduzido. Conteúdo preservado e sem overflow horizontal.
- Modais SQL e de registro operacional cobrem o viewport; fechamento e Escape do registro aprovados.
- Fronteiras seguintes de Habilidades, Projetos e Contato: progresso compartilhado e reversão aprovados.
- Nenhum erro JavaScript não tratado nas rodadas finais.

A requisição a Google Fonts recebe HTTP 403 do proxy deste ambiente. A automação visual carregou os arquivos originais Newsreader/Outfit por interceptação apenas no navegador de teste. As URLs e dependências de produção foram preservadas. Ícones externos podem não carregar neste ambiente. Não houve envio real de formulário nem chamada remota Gemini.
