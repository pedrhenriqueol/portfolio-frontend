import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function apiDevServerPlugin(env = {}) {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const message = (parsed.message || '').trim().slice(0, 300);
            const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'MISSING_API_KEY' }));
              return;
            }

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
            const geminiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
              },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{
                    text: `Você é o Copilot Técnico e Assistente de Terminal interativo do portfólio de Pedro Henrique.

SUAS DIRETRIZES FUNDAMENTAIS:
1. Responda DIRETAMENTE e COM PRECISÃO ao que o usuário perguntou. Respeite sempre a intenção e a lógica exata da mensagem recebida.
2. Você é um assistente de IA versátil: pode conversar sobre QUALQUER assunto de tecnologia, engenharia de software, desenvolvimento web, arquitetura, QA, banco de dados, carreira, ou manter conversação aberta e amigável (por exemplo, se perguntarem "você fala sobre outras coisas além disso?", responda afirmativamente e explique com entusiasmo sobre o que você pode dialogar).
3. NÃO jogue informações aleatórias do portfólio ou biografia do Pedro se o usuário estiver fazendo uma pergunta de outro assunto.
4. Quando a pergunta for sobre o Pedro Henrique, sua stack ou seus projetos, utilize o perfil oficial:
- Analista de QA / Testes na SETE Tecnologia (sistemas de zonas portuárias/aduaneiras ZPEs / ePita, automação de testes REST no Postman, diagnósticos de queries no SQL Server, -25% taxa de bugs).
- Ex-Desenvolvedor Back-End na Qualisoft Sistemas (modernização de ERP legado em Delphi 11 VCL/UniGui, APIs REST PHP/Laravel, interfaces React/TypeScript, otimização de queries SQL de 2s para <500ms).
- Formação: Cursando Engenharia de Software na Unifanor Wyden; Técnico em Informática pela EEEP Luiza de Teodoro Vieira.
- Projetos principais: PayStream Gateway (Fintech/Idempotência/Fastify/Prisma/PostgreSQL), PortLog OS (Terminais portuários/IoT/FSM/RBAC), SPECTR TestOps (Testes de API/Chaos Lab/Percentis p50-p99).
- Tecnologias principais: PHP, Laravel, TypeScript, React, Delphi, SQL Server, Postman, Tailwind CSS, Docker, Linux.
5. Tom profissional, amigável, inteligente e conciso (máximo de 2 a 4 frases).
6. Formate as respostas no estilo de terminal (linhas limpas, destaque termos e comandos com crases \`code\`).
7. Responda no mesmo idioma em que o usuário perguntou (Português, Inglês ou Espanhol).`
                  }]
                },
                contents: [{ role: 'user', parts: [{ text: message }] }],
                generationConfig: { maxOutputTokens: 350, temperature: 0.6 }
              })
            });

            if (!geminiRes.ok) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_ERROR' }));
              return;
            }

            res.writeHead(200, {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'no-cache',
              'Transfer-Encoding': 'chunked'
            });

            const reader = geminiRes.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('data: ')) {
                  const jsonStr = trimmedLine.slice(6).trim();
                  if (jsonStr === '[DONE]') continue;
                  try {
                    const data = JSON.parse(jsonStr);
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                      res.write(text);
                    }
                  } catch {}
                }
              }
            }
            res.end();
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), apiDevServerPlugin(env)],
    build: {
      cssCodeSplit: true,
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('react-type-animation')) {
                return 'vendor-typing';
              }
              return 'vendor-libs';
            }
          },
        },
      },
    },
  };
});
