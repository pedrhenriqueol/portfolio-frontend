// Minijogos e Easter Eggs para o InteractiveTerminal
export const GAMES_INFO = {
    pt: [
        { cmd: 'pedro --games', desc: 'Lista todos os minijogos disponíveis' },
        { cmd: 'pedro --play snake', desc: '🐍 Snake Game clássico em ASCII (Controles: Setas / WASD)' },
        { cmd: 'pedro --play bug-hunter', desc: '🐛 Bug Hunter: Encontre os módulos sem estourar Erro 500!' },
        { cmd: 'pedro --play trivia', desc: '🧠 Quiz Técnico de QA, Delphi, SQL & Web' },
        { cmd: 'pedro --play aim-test', desc: '🎯 Teste de Reflexo em Milissegundos' },
        { cmd: 'pedro --sudo matrix', desc: '🕶️ Chuva de Código Matrix no Terminal' },
        { cmd: 'exit', desc: 'Sai de qualquer jogo em execução e volta ao shell' }
    ],
    en: [
        { cmd: 'pedro --games', desc: 'List all available terminal minigames' },
        { cmd: 'pedro --play snake', desc: '🐍 Classic ASCII Snake Game (Controls: Arrow Keys / WASD)' },
        { cmd: 'pedro --play bug-hunter', desc: '🐛 Bug Hunter: Find clean modules without triggering Error 500!' },
        { cmd: 'pedro --play trivia', desc: '🧠 Technical Architecture, Delphi, SQL & QA Quiz' },
        { cmd: 'pedro --play aim-test', desc: '🎯 Millisecond Reflex & Reaction Speed Test' },
        { cmd: 'pedro --sudo matrix', desc: '🕶️ Classic Matrix Code Rain in Terminal' },
        { cmd: 'exit', desc: 'Exit any running game and return to the main shell' }
    ],
    es: [
        { cmd: 'pedro --games', desc: 'Lista todos los minijuegos disponibles' },
        { cmd: 'pedro --play snake', desc: '🐍 Juego de la Serpiente en ASCII (Controles: Flechas / WASD)' },
        { cmd: 'pedro --play bug-hunter', desc: '🐛 Bug Hunter: ¡Encuentra módulos limpios sin provocar Error 500!' },
        { cmd: 'pedro --play trivia', desc: '🧠 Quiz Técnico de Arquitectura, Delphi, SQL y QA' },
        { cmd: 'pedro --play aim-test', desc: '🎯 Test de Reflejos y Velocidad en Milisegundos' },
        { cmd: 'pedro --sudo matrix', desc: '🕶️ Lluvia de Código Matrix en la Terminal' },
        { cmd: 'exit', desc: 'Salir de cualquier juego en ejecución y volver al shell' }
    ]
};

export const TRIVIA_QUESTIONS = {
    pt: [
        {
            q: '1/4: Qual método HTTP deve ser IDEMPOTENTE por padrão em APIs RESTful?',
            options: ['A) POST', 'B) GET e PUT', 'C) PATCH', 'D) CONNECT'],
            answer: 'B',
            explanation: 'GET, PUT e DELETE são idempotentes (múltiplas chamadas produzem o mesmo efeito no estado).'
        },
        {
            q: '2/4: Em bancos SQL relacionais, o problema da query "N+1" é resolvido tipicamente por:',
            options: ['A) JOIN / Eager Loading com indexação', 'B) Adicionar mais triggers', 'C) Usar cursor explícito', 'D) Executar SELECT *'],
            answer: 'A',
            explanation: 'Eager Loading e JOINs reduzem N requisições individuais a uma única consulta eficiente com índices.'
        },
        {
            q: '3/4: No Delphi/Pascal clássico, qual componente é amplamente usado para exibir datasets em grade tabular?',
            options: ['A) TTreeView', 'B) TDBGrid', 'C) TCanvas', 'D) TShape'],
            answer: 'B',
            explanation: 'TDBGrid é o componente padrão para conectar dados a um TDataSource em aplicações VCL.'
        },
        {
            q: '4/4: Em testes de QA sob metodologia ágil, o objetivo principal de um teste de REGRESSÃO é:',
            options: ['A) Escrever o código novo', 'B) Garantir que novas alterações não quebraram funcionalidades existentes', 'C) Estressar a CPU até 100%', 'D) Fazer deploy manual'],
            answer: 'B',
            explanation: 'Testes de regressão blindam o sistema contra efeitos colaterais de novas entregas.'
        }
    ],
    en: [
        {
            q: '1/4: Which HTTP method must be IDEMPOTENT by specification in RESTful APIs?',
            options: ['A) POST', 'B) GET and PUT', 'C) PATCH', 'D) CONNECT'],
            answer: 'B',
            explanation: 'GET, PUT, and DELETE are idempotent (multiple identical requests yield the same server state effect).'
        },
        {
            q: '2/4: In relational SQL databases, the "N+1 queries" problem is typically solved by:',
            options: ['A) JOIN / Eager Loading with indexing', 'B) Adding database triggers', 'C) Explicit cursors', 'D) SELECT * without filters'],
            answer: 'A',
            explanation: 'Eager Loading and JOINs consolidate N separate network roundtrips into one optimized indexed query.'
        },
        {
            q: '3/4: In classic Delphi/Pascal, which visual component is standard for tabular dataset visualization?',
            options: ['A) TTreeView', 'B) TDBGrid', 'C) TCanvas', 'D) TShape'],
            answer: 'B',
            explanation: 'TDBGrid is the flagship component for binding dataset records via TDataSource in VCL apps.'
        },
        {
            q: '4/4: In agile QA engineering, what is the primary objective of a REGRESSION test?',
            options: ['A) Write brand new business code', 'B) Ensure recent changes did not break existing features', 'C) Stress CPU to 100%', 'D) Trigger manual deployments'],
            answer: 'B',
            explanation: 'Regression testing shields legacy stability against unintended side-effects from new commits.'
        }
    ],
    es: [
        {
            q: '1/4: ¿Qué método HTTP debe ser IDEMPOTENTE por estándar en APIs RESTful?',
            options: ['A) POST', 'B) GET y PUT', 'C) PATCH', 'D) CONNECT'],
            answer: 'B',
            explanation: 'GET, PUT y DELETE son idempotentes (múltiples llamadas generan el mismo efecto en el estado).'
        },
        {
            q: '2/4: En bases de datos SQL relacionales, el problema "N+1 consultas" se resuelve típicamente con:',
            options: ['A) JOIN / Eager Loading con indexación', 'B) Agregar más triggers', 'C) Usar cursores explícitos', 'D) Ejecutar SELECT *'],
            answer: 'A',
            explanation: 'Eager Loading y JOINs consolidan N consultas individuales en una sola consulta optimizada.'
        },
        {
            q: '3/4: En Delphi/Pascal clásico, ¿qué componente se usa ampliamente para tablas de datos?',
            options: ['A) TTreeView', 'B) TDBGrid', 'C) TCanvas', 'D) TShape'],
            answer: 'B',
            explanation: 'TDBGrid es el componente estándar para conectar datasets a través de TDataSource en VCL.'
        },
        {
            q: '4/4: En pruebas de QA bajo metodologías ágiles, ¿cuál es el objetivo principal de una prueba de REGRESIÓN?',
            options: ['A) Escribir nuevo código fuente', 'B) Garantizar que nuevos cambios no rompan funciones existentes', 'C) Saturar la CPU al 100%', 'D) Desplegar manualmente'],
            answer: 'B',
            explanation: 'Las pruebas de regresión blindan el sistema contra efectos colaterais en nuevos despliegues.'
        }
    ]
};
