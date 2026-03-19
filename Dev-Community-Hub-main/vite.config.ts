import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'xai-recommend-middleware',
        configureServer(server) {
          server.middlewares.use('/api/ai/recommend', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            // NOTE:
            // - `gsk_...` keys are commonly Groq API keys (not xAI).
            // - Support both to reduce confusion:
            //   - Groq: VITE_GROQ_API_KEY (recommended when key starts with gsk_)
            //   - xAI : VITE_XAI_API_KEY
            const groqKey = env.VITE_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
            const xaiKey = env.VITE_XAI_API_KEY || process.env.VITE_XAI_API_KEY;
            const apiKey = groqKey || xaiKey;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: 'Missing VITE_GROQ_API_KEY or VITE_XAI_API_KEY in server env' }));
              return;
            }

            try {
              const chunks: Buffer[] = [];
              await new Promise<void>((resolve, reject) => {
                req.on('data', (c) => chunks.push(Buffer.from(c)));
                req.on('end', () => resolve());
                req.on('error', reject);
              });

              const bodyRaw = Buffer.concat(chunks).toString('utf-8');
              const body = bodyRaw ? JSON.parse(bodyRaw) : {};
              const query = String(body?.query ?? '').trim();
              const teams = Array.isArray(body?.teams) ? body.teams : [];

              if (!query) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ error: 'Missing query' }));
                return;
              }

              const prompt = [
                "너는 팀원 모집글(팀) 추천 도우미야.",
                "사용자가 입력한 조건에 가장 잘 맞는 팀을 최대 8개 추천해줘.",
                "",
                `사용자 조건: ${query}`,
                "",
                "팀 목록(JSON):",
                JSON.stringify(teams),
                "",
                "반드시 아래 JSON 형식으로만 답변해:",
                '{ "teamIds": ["id1","id2"], "reasons": { "id1": "추천 이유", "id2": "추천 이유" } }',
                "",
                "규칙:",
                "- teamIds에는 반드시 위 팀 목록에 존재하는 id만 넣어",
                "- 관련도 높은 순서대로 정렬",
                "- reasons는 한 팀당 한 문장으로 짧게",
              ].join("\n");

              const upstreamUrl = groqKey
                ? 'https://api.groq.com/openai/v1/chat/completions'
                : 'https://api.x.ai/v1/chat/completions';

              const model = groqKey ? 'llama-3.3-70b-versatile' : 'grok-4-0709';

              const r = await fetch(upstreamUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  model,
                  messages: [{ role: 'user', content: prompt }],
                  temperature: 0.3,
                }),
              });

              if (!r.ok) {
                const t = await r.text().catch(() => '');
                res.statusCode = 502;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ error: `Grok API error (${r.status})`, detail: t }));
                return;
              }

              const data: any = await r.json();
              const textOut: string = data?.choices?.[0]?.message?.content ?? '';

              const safeParseJsonFromText = (text: string) => {
                const trimmed = String(text ?? '').trim();
                try {
                  return JSON.parse(trimmed);
                } catch {
                  const objMatch = trimmed.match(/\{[\s\S]*\}/);
                  if (objMatch) {
                    try { return JSON.parse(objMatch[0]); } catch { /* ignore */ }
                  }
                  const arrMatch = trimmed.match(/\[[\s\S]*\]/);
                  if (arrMatch) {
                    try { return JSON.parse(arrMatch[0]); } catch { /* ignore */ }
                  }
                  return null;
                }
              };

              const parsed = safeParseJsonFromText(textOut);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ parsed, raw: textOut }));
            } catch (e: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: e?.message ?? 'Internal error' }));
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
