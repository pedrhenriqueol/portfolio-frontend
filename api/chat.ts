export const config = {
    runtime: 'edge',
};

const SYSTEM_INSTRUCTION = `Você é o Copilot Técnico e Assistente de Terminal do portfólio de Pedro Henrique.
Perfil do Pedro:
- Analista de QA / Testes (Estágio) na SETE Tecnologia: Validações de sistemas em zonas portuárias/logísticas (ZPEs), modelagem de testes funcionais/regressivos, consultas diagnósticas em Microsoft SQL Server e automação de testes de API via Postman.
- Desenvolvedor Back-End / Full Stack (Estágio) anterior na Qualisoft Sistemas: Modernização de ERP legado em Delphi 11 (VCL/UniGui), APIs RESTful em PHP (Laravel) e interfaces com React + TypeScript.
- Formação: Cursando Engenharia de Software na Unifanor Wyden; Técnico em Informática pela EEEP Luiza de Teodoro Vieira.
- Tecnologias principais: PHP, Laravel, TypeScript, React, Delphi, SQL Server, Postman, Tailwind CSS.

Diretrizes de Resposta:
- Tom profissional, direto, técnico e conciso (máximo de 2 a 4 frases).
- Formate as respostas no estilo de saída de terminal (linhas limpas, destaque de tecnologias com crases \`code\`).
- Se fizer sentido, sugira um comando do terminal ao final (ex: "Para simular a validação de APIs, digite \`test\`" ou "Para ver os projetos, digite \`pedro --projects\`").
- Responda no mesmo idioma em que o usuário perguntou (Português, Inglês ou Espanhol).`;

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const body = await req.json();
        const rawMessage = body?.message;

        if (!rawMessage || typeof rawMessage !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid message payload' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Validação estrita: limita o tamanho máximo em 300 caracteres para proteção de cota
        const sanitized = rawMessage.trim().slice(0, 300);
        if (!sanitized) {
            return new Response(JSON.stringify({ error: 'Message cannot be empty' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'MISSING_API_KEY' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Chamada à API de streaming do Gemini 1.5 Flash via SSE
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

        const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: SYSTEM_INSTRUCTION }],
                },
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: sanitized }],
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 350,
                    temperature: 0.6,
                },
            }),
        });

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            console.error('Gemini API Error:', geminiRes.status, errText);
            return new Response(JSON.stringify({ error: 'GEMINI_ERROR', status: geminiRes.status }), {
                status: 502,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const reader = geminiRes.body?.getReader();
        if (!reader) {
            return new Response(JSON.stringify({ error: 'NO_STREAM_BODY' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // TransformStream que decodifica SSE do Gemini e emite stream puro de texto token a token
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const stream = new ReadableStream({
            async start(controller) {
                let buffer = '';
                try {
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
                                    const parsed = JSON.parse(jsonStr);
                                    const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                                    if (text) {
                                        controller.enqueue(encoder.encode(text));
                                    }
                                } catch {
                                    // Fragmento JSON parcial
                                }
                            }
                        }
                    }

                    if (buffer.trim().startsWith('data: ')) {
                        try {
                            const parsed = JSON.parse(buffer.trim().slice(6).trim());
                            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {
                                controller.enqueue(encoder.encode(text));
                            }
                        } catch {}
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                } finally {
                    reader.releaseLock();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
