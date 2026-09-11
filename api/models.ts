declare const process: {
    env: Record<string, string | undefined>;
};

export const config = {
    runtime: 'edge',
};

export default async function handler(): Promise<Response> {
    const apiKey = process.env.GEMINI_API_KEY || (process.env as any).GENINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not defined in environment variables' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();

        return new Response(JSON.stringify(data, null, 2), {
            status: res.status,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store',
            },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message || 'Failed to query ModelService.ListModels' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
