declare const process: {
    env: Record<string, string | undefined>;
};

export const config = {
    runtime: 'edge',
};

const SYSTEM_INSTRUCTION = `Você é o Copilot Técnico e Assistente de Terminal interativo do portfólio de Pedro Henrique.

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
7. Responda no mesmo idioma em que o usuário perguntou (Português, Inglês ou Espanhol).`;

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

        const apiKey = process.env.GEMINI_API_KEY || (process.env as any).GENINI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'MISSING_API_KEY' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Lista de modelos suportados em ordem de versão e disponibilidade
        const candidateModels = [
            'gemini-2.0-flash',
            'gemini-2.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-flash-latest',
            'gemini-1.5-flash',
        ];

        let geminiRes: Response | null = null;
        let lastErrText = '';
        let lastStatus = 502;

        for (const model of candidateModels) {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
            try {
                const res = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': apiKey,
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

                if (res.ok) {
                    geminiRes = res;
                    break;
                } else {
                    lastStatus = res.status;
                    lastErrText = await res.text();
                    // Se for 404 (modelo não existe) ou 503/429 (alta demanda temporária no modelo), tenta o próximo candidato imediatamente
                    if (res.status === 404 || res.status === 503 || res.status === 429) {
                        continue;
                    }
                    break;
                }
            } catch (fetchErr: any) {
                lastErrText = fetchErr?.message || String(fetchErr);
            }
        }

        if (!geminiRes || !geminiRes.ok) {
            console.error('Gemini API Error:', lastStatus, lastErrText);
            return new Response(JSON.stringify({ error: 'GEMINI_ERROR', status: lastStatus, details: lastErrText }), {
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
