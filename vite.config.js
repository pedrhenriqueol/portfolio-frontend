import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function apiDevServerPlugin() {
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
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'MISSING_API_KEY' }));
              return;
            }

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
            const geminiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{
                    text: `Você é o Copilot Técnico e Assistente de Terminal do portfólio de Pedro Henrique.
Perfil do Pedro:
- Analista de QA / Testes (Estágio) na SETE Tecnologia: Validações de sistemas em zonas portuárias/logísticas (ZPEs), modelagem de testes funcionais/regressivos, consultas diagnósticas em Microsoft SQL Server e automação de testes de API via Postman.
- Desenvolvedor Back-End / Full Stack (Estágio) anterior na Qualisoft Sistemas: Modernização de ERP legado em Delphi 11 (VCL/UniGui), APIs RESTful em PHP (Laravel) e interfaces com React + TypeScript.
- Formação: Cursando Engenharia de Software na Unifanor Wyden; Técnico em Informática pela EEEP Luiza de Teodoro Vieira.
- Tecnologias principais: PHP, Laravel, TypeScript, React, Delphi, SQL Server, Postman, Tailwind CSS.

Diretrizes de Resposta:
- Tom profissional, direto, técnico e conciso (máximo de 2 a 4 frases).
- Formate as respostas no estilo de saída de terminal (linhas limpas, destaque de tecnologias com crases \`code\`).
- Se fizer sentido, sugira um comando do terminal ao final (ex: "Para simular a validação de APIs, digite \`test\`" ou "Para ver os projetos, digite \`pedro --projects\`").
- Responda no mesmo idioma em que o usuário perguntou.`
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
export default defineConfig({
  plugins: [react(), apiDevServerPlugin()],
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
});
