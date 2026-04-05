import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'ai-scanner-middleware',
        configureServer(server) {
          // 💡 엔드포인트를 기획안에 맞게 스캐너 용도로 변경
          server.middlewares.use('/api/ai/scan-profile', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }));
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
              const portfolioText = String(body?.portfolioText ?? '').trim();

              if (!portfolioText) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ error: 'Missing portfolio text or URL' }));
                return;
              }

              // 💡 기획안 맞춤형 프롬프트 엔지니어링
              const prompt = `
                너는 개발자/디자이너/기획자의 포트폴리오를 분석하여 역량을 평가하는 'AI 역량 스캐너'야.
                다음 사용자의 포트폴리오(또는 텍스트)를 분석해서 직군과 역량 칭호를 부여해줘.

                포트폴리오 내용:
                ${portfolioText}

                규칙:
                1. "role"은 "Frontend", "Backend", "Designer", "PM" 중 하나로 매칭.
                2. "title"은 분석된 실력에 따라 "루키", "에이스", "마스터" 중 하나를 선택.
                3. 반드시 아래 JSON 형식으로만 답변해.
                { "role": "Frontend", "title": "루키 개발자", "reason": "React 기초 역량이 돋보입니다." }
              `;

              // Gemini REST API 호출 (1.5 Flash 또는 최신 모델 권장)
              const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: { temperature: 0.2 } // 일관된 평가를 위해 온도 낮춤
                })
              });

              if (!response.ok) throw new Error('Gemini API Error');
              
              const data: any = await response.json();
              const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
              
              // 마크다운 백틱(```json) 제거 및 파싱
              const cleanJson = textOut.replace(/```json|```/g, '').trim();
              const parsed = JSON.parse(cleanJson);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ parsed }));
            } catch (e: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: e?.message ?? 'Internal error' }));
            }
          });
        },
      },
    ],
    resolve: { alias: { '@/': path.resolve(__dirname, './src/') } },
    server: { hmr: process.env.DISABLE_HMR !== 'true' },
  };
});