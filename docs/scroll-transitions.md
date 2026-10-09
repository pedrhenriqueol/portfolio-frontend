# Transições de scroll — revisão local

A implementação usa o scroll nativo e não adiciona bibliotecas. Este relatório descreve a validação local; o estado do deployment da Vercel não foi verificado.

A prioridade desta entrega é o desktop e a continuidade de composição inspirada na referência. Os ajustes de mobile estão encerrados na versão simplificada e legível descrita abaixo; não foi ampliado o escopo de animação nesse formato.

## Comportamento

- **Hero → Sobre:** o terminal ocupa uma única coluna que atravessa as duas composições. As duas colunas usam sticky nativo: a apresentação permanece durante o início da passagem, recua e sai enquanto Sobre entra. O mesmo terminal amplia até 108%, depois recua até 84% e desloca-se conforme o scroll. As colunas terminam antes do Bento Grid; não há terminal clonado, troca de montagem, captura de wheel ou palco fixo sobre a página. Os CTAs da apresentação saem da ordem de foco quando perdem legibilidade e voltam ao reverter o percurso.
- **Sobre → Experiência → Habilidades → Projetos → Contato:** cada fronteira compartilha um progresso entre os últimos cards, a linha divisória existente e o cabeçalho seguinte. Os espaços entre as seções foram reduzidos. O formulário fica estável quando o cabeçalho do Contato chega à área de leitura.
- **Mobile, telas baixas e movimento reduzido:** o terminal e os textos ficam no fluxo normal. Não há distância adicional para uma animação desabilitada. A cena também é desativada se seu conteúdo não couber na altura disponível.
- **Navegação:** a URL sem hash inicia na Home, com posicionamento instantâneo durante o preloader e restauração automática desativada antes de carregar a aplicação. Links diretos, incluindo `#projetos`, continuam abrindo sua seção. Pedro confirmou que o endereço salvo pelo navegador continha esse hash. A âncora de Sobre fica em um wrapper estável, separado do texto animado. TechChips usam uma única ação de foco/rolagem; o terminal mantém o foco durante a resposta, permitindo também Ctrl+C. No menu mobile, a rolagem começa após o fechamento; o retorno rápido ao topo cancela o temporizador que ocultava a Navbar. A Navbar oculta fica fora da ordem de foco. O ID duplicado de projetos foi separado em `projetos` e `projetos-corporativos`.
- **Barra inferior:** a StatusBar de versão, horário e latência foi removida, junto com seu estado e callback de média. O painel de telemetria mantém seus resultados e controles próprios.

## Arquivos principais

- `src/hooks/useHeroHandoff.ts`: mede a coluna, o terminal e o viewport, considerando o `zoom: 0.8` já existente. O percurso termina em `altura da coluna - altura do terminal - inset superior`. ResizeObserver e carregamento de fontes atualizam as medidas; o scroll apenas escreve o progresso, sem springs nem leituras de layout a cada frame.
- `src/components/Portfolio/Hero.tsx` e `AboutMe.tsx`: introdução compartilhada, uma instância do terminal e Bento completo no documento.
- `src/components/Portfolio/Common/ScrollChapter.tsx`: progresso compartilhado entre capítulos e wrappers de cabeçalho. As raízes das seções não recebem transforms, preservando os modais fixos.
- `src/components/Portfolio/scroll-transitions.css`: geometria, versões responsivas, movimento reduzido e estilos de passagem.
- `src/App.tsx`: composição dos capítulos e restauração do hash inicial.
- As estimativas de altura com `content-visibility: auto` foram removidas dos dois carrosséis, pois deslocavam o Contato durante uma navegação longa. Os controles de atividade existentes dos carrosséis foram mantidos.
- Cabeçalhos/últimos cards em `ProfessionalJourneyTimeline`, `Skills`, `Projects/Cylindrical3DShowcase`, `ProjectsSection` e `Contact` participam das fronteiras.
- `InteractiveTerminal.tsx`, `Workstation/Dock.jsx`, `Navbar.tsx` e `NavBar/MobileMenu.jsx`: correções de foco e navegação necessárias à validação.

## Executar

Na raiz do repositório, com Node compatível com Vite 8:

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Para validar o pacote de produção:

```sh
npm run build
```

O servidor iniciado nesta tarefa pertence ao ambiente de nuvem. Para testar no computador pessoal, encaminhe a porta 5173 desse ambiente, se a interface oferecer essa opção, ou aplique as alterações à sua cópia e execute os comandos acima.

## Roteiro de revisão visual

1. Digite um comando no terminal e role lentamente até o Sobre. Confira a mesma sessão, a composição intermediária e a entrada do Bento.
2. Inverta o scroll no meio e pare. A geometria deve acompanhar a posição atual sem continuar se deslocando.
3. Teste Sobre → Experiência e clique no robô. Continue até projetos, abra um drawer e chegue ao formulário.
4. Teste Navbar, Ctrl+K, TechChips e carregamento direto em `#sobre` e `#contato`.
5. Repita em uma tela estreita e com preferência de movimento reduzido.

A aprovação visual final permanece com Pedro. Testes em Chromium automatizado não medem o desempenho da GPU ou o comportamento de um touchpad físico.

## Evidências desta sessão

Validação em 08/10/2026, Node 24.19.0 e Chromium automatizado:

| Verificação | Resultado |
| --- | --- |
| `npm run build` | Aprovado; permanece aviso de chunk acima de 700 kB. |
| TypeScript dos dois módulos novos (`useHeroHandoff` e `ScrollChapter`) e suas importações diretas | Aprovado com `tsc --noEmit`; o projeto continua sem comando global de typecheck/tsconfig. |
| `npm run lint` | 43 erros e 6 avisos, mesma contagem medida antes das alterações. Não é um lint aprovado. |
| Terminal único, comandos e rascunho preservados durante scroll/resize | Aprovado. A resposta atual usa o motor local de conhecimento. |
| Posições intermediárias, scroll reverso, parada e progresso compartilhado nas quatro fronteiras seguintes | Aprovado. |
| Revisão final desktop após estabilizar as alturas dos carrosséis | Terminal persistente, quatro fronteiras nos dois sentidos e navegação até Contato aprovados; nenhum erro JavaScript não tratado. |
| Roda nativa, PageDown e 20 paradas por Tab | Aprovado após retirar ícones decorativos da ordem de foco. |
| Navbar, Ctrl+K, TechChips, robô, carrossel e drawer, modal SQL, seletor de tema | Verificados no navegador. |
| Formulário | Fluxo testado com resposta simulada; nenhuma mensagem externa foi enviada. |
| Telas 1440×900, 1366×768, 1024×600, 390×844 e 820×1180 | Geometria/estado verificados; sem overflow horizontal. Capturas desktop e mobile inspecionadas. |
| Toque e menu mobile | Gesto de swipe e tap emulados aprovados; dispositivo físico não testado. |
| Movimento reduzido e hashes diretos `#sobre`/`#contato` | Aprovados. |
| Idiomas inglês e espanhol | Capturas inspecionadas sem colisão na introdução. |
| Erros JavaScript não tratados na rodada principal | Nenhum registrado. |

Uma captura excedeu o timeout inicial de 10 segundos e foi repetida com sucesso com 30 segundos. O primeiro gesto sintético de toque não demonstrou rolagem; uma sequência nativa emulada de touchStart/move/end confirmou o movimento da página. As falhas intermediárias de foco do terminal, hash inicial e navegação mobile foram corrigidas e verificadas novamente. A navegação mobile foi conferida até Sobre e Contato e com movimento reduzido.

Limitação visual do ambiente: a requisição a Google Fonts recebeu HTTP 403 do proxy. A declaração das fontes originais foi preservada, mas as capturas podem usar fontes de fallback. A tipografia com os recursos externos carregados deve ser conferida no navegador do usuário. Não houve teste físico de GPU/touchpad, integração remota Gemini nem envio real pelo FormSubmit.

## Revisão de imersão após o teste no Opera

Pedro esclareceu que busca uma transformação de composição mais perceptível. A apresentação agora permanece em sua coluna por parte do percurso, e a ampliação seguida do recuo do terminal prepara a chegada de Sobre. As quatro fronteiras seguintes usam cabeçalhos com deslocamento de até 96px e escala de 90% a 100%, cards que recuam até 92,5% e a divisória que se estende pelo mesmo progresso. Os cards se deslocam para longe da linha anterior, evitando sobreposição com os indicadores do Bento.

A gravação enviada nessa revisão excedeu o limite de transferência de 32 MiB e não foi inspecionada. O diagnóstico de imersão usa o esclarecimento de Pedro e a observação da implementação no navegador, não uma análise alegada daquele vídeo.

Para conferir a geometria com as fontes reais, o navegador de teste recebeu os arquivos oficiais de Newsreader e Outfit do repositório `google/fonts`, somente por interceptação de requests na automação. Nenhuma fonte ou dependência nova foi adicionada ao site. Capturas e uma gravação desktop foram geradas.

Nesta revisão, passaram: abertura sem hash e recarregamentos a partir de Projetos/Contato, carregamento com JavaScript atrasado, links diretos para Sobre/Projetos/Contato, quatro tamanhos desktop (1920×1080, 1844×900, 1440×900 e 1366×768), terminal persistente, percurso reverso, quatro fronteiras com progresso compartilhado, foco dos CTAs, mobile simplificado e movimento reduzido. Não houve erro JavaScript não tratado. Build e TypeScript dos módulos novos passaram; o lint mantém 43 erros e 6 avisos.

O primeiro teste de hash reutilizava o mesmo documento e observou a rolagem suave antes de terminar; o teste correto usa navegação completa. O teste de retorno às fronteiras também foi ajustado para aguardar as medidas após trocar o viewport. A âncora de Sobre foi separada do filho animado, e os resultados finais foram conferidos após essas correções.
