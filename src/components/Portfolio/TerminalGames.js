// Minijogos e Easter Eggs para o InteractiveTerminal
export const GAMES_INFO = [
    { cmd: 'pedro --games', desc: 'Lista todos os minijogos disponíveis' },
    { cmd: 'pedro --play snake', desc: '🐍 Snake Game clássico em ASCII (Controles: Setas / WASD)' },
    { cmd: 'pedro --play bug-hunter', desc: '🐛 Bug Hunter: Encontre os bugs sem causar Crash 500!' },
    { cmd: 'pedro --play trivia', desc: '🧠 Quiz Técnico de QA, Delphi, SQL & Web' },
    { cmd: 'pedro --play aim-test', desc: '🎯 Teste de Reflexo em Milissegundos' },
    { cmd: 'pedro --sudo matrix', desc: '🕶️ Chuva de Código Matrix no Terminal' },
    { cmd: 'exit', desc: 'Sai de qualquer jogo em execução e volta ao shell' }
];

export const TRIVIA_QUESTIONS = [
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
];
