/* Kin Fit AI endpoint (Netlify Function).
   The browser sends a task and the user's profile; this function calls Claude with the coach and
   nutrition prompts and returns JSON the app can render. The API key lives only in the Netlify
   environment variable ANTHROPIC_API_KEY, never in the app or the repository. */
import Anthropic from '@anthropic-ai/sdk';
import { build, messagesFor } from '../../ai-core.mjs';

const MODEL_PLAN = process.env.KINFIT_MODEL_PLAN || 'claude-sonnet-5-5';
const MODEL_CHAT = process.env.KINFIT_MODEL_CHAT || 'claude-haiku-5-5';
const EFFORT = process.env.KINFIT_EFFORT || 'low';
const ALLOWED = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);

/* ---------- Rate limit (per function instance, best effort) ---------- */

const hits = new Map();
function limited(ip) {
  const now = Date.now(); const win = 10 * 60 * 1000; const max = Number(process.env.KINFIT_RATE_LIMIT) || 40;
  const list = (hits.get(ip) || []).filter((t) => now - t < win);
  list.push(now); hits.set(ip, list);
  return list.length > max;
}

/* ---------- Handler ---------- */

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

function headers(req) {
  const h = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
  const origin = req.headers.get('origin');
  if (origin && ALLOWED.includes(origin)) { h['access-control-allow-origin'] = origin; h['access-control-allow-headers'] = 'content-type'; h.vary = 'Origin'; }
  return h;
}
const reply = (req, status, data) => new Response(JSON.stringify(data), { status, headers: headers(req) });

export default async (req, context) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: headers(req) });
  if (req.method === 'GET') return reply(req, 200, { ok: true, ready: !!client });
  if (req.method !== 'POST') return reply(req, 405, { ok: false, error: 'method' });
  if (!client) return reply(req, 503, { ok: false, error: 'not_configured' });
  if (limited(context?.ip || req.headers.get('x-nf-client-connection-ip') || 'anon')) return reply(req, 429, { ok: false, error: 'rate_limited' });

  let body;
  try { body = await req.json(); } catch { return reply(req, 400, { ok: false, error: 'bad_json' }); }
  const job = build(body?.task, body || {});
  if (!job) return reply(req, 400, { ok: false, error: 'bad_task' });
  job.model = job.kind === 'chat' ? MODEL_CHAT : MODEL_PLAN;

  const params = {
    model: job.model,
    max_tokens: job.max,
    system: [{ type: 'text', text: job.system, cache_control: { type: 'ephemeral' } }],
    output_config: { effort: EFFORT, ...(job.schema ? { format: { type: 'json_schema', schema: job.schema } } : {}) },
    messages: messagesFor(job, body),
  };
  // Server-side fallback reroutes a safety refusal on Sonnet 5.5; Haiku has none.
  const useFallback = /^claude-(sonnet-5-5|opus-5|fable-5)/.test(job.model);

  try {
    const msg = useFallback
      ? await client.beta.messages.create({ ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' })
      : await client.messages.create(params);
    const u = msg.usage || {};
    console.log(JSON.stringify({ task: body.task, model: msg.model, stop: msg.stop_reason, in: u.input_tokens, out: u.output_tokens, cache_read: u.cache_read_input_tokens, cache_write: u.cache_creation_input_tokens }));
    if (msg.stop_reason === 'refusal') return reply(req, 502, { ok: false, error: 'refusal' });
    if (msg.stop_reason === 'max_tokens') return reply(req, 502, { ok: false, error: 'truncated' });
    const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
    if (!text) return reply(req, 502, { ok: false, error: 'empty' });
    if (job.chat) return reply(req, 200, { ok: true, data: { texte: text } });
    return reply(req, 200, { ok: true, data: JSON.parse(text) });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return reply(req, 429, { ok: false, error: 'rate_limited' });
    if (err instanceof Anthropic.AuthenticationError) { console.error('Clé API refusée'); return reply(req, 503, { ok: false, error: 'not_configured' }); }
    if (err instanceof Anthropic.APIError) { console.error(`API ${err.status}: ${err.message}`); return reply(req, 502, { ok: false, error: 'api' }); }
    if (err instanceof SyntaxError) return reply(req, 502, { ok: false, error: 'bad_output' });
    console.error(err); return reply(req, 500, { ok: false, error: 'server' });
  }
};

export const config = { path: '/api/ai' };
