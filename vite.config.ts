import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const audioDir = fileURLToPath(new URL('./src/audio', import.meta.url));

// Background sound per era (files in src/audio). Eras without a file get the voice only.
const eraMusic: Record<string, string> = { '1950': '50s.mp3.mpeg', '1980': '80s.mp3.mpeg', '2000': '00s.mp3.mpeg' };

const INTRO_SECONDS = 2;
const OUTRO_SECONDS = 2.5;

// Mixes the voice over the era sound: short intro, music ducked while the voice speaks, fade out.
async function mixWithMusic(voice: Buffer, musicFile: string): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), 'dploy-'));
  try {
    const voicePath = join(dir, 'voice.mp3');
    const outPath = join(dir, 'spot.mp3');
    await writeFile(voicePath, voice);
    const probe = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', voicePath]);
    const total = Number(probe.stdout.trim()) + INTRO_SECONDS + OUTRO_SECONDS;
    const filter = [
      `[0:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay=${INTRO_SECONDS * 1000}|${INTRO_SECONDS * 1000},apad=whole_dur=${total},asplit=2[voice][key]`,
      '[1:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=0.9[music]',
      '[music][key]sidechaincompress=threshold=0.02:ratio=10:attack=30:release=500:makeup=1[ducked]',
      `[voice][ducked]amix=inputs=2:duration=first:normalize=0,afade=t=out:st=${total - OUTRO_SECONDS}:d=${OUTRO_SECONDS}[out]`,
    ].join(';');
    await run('ffmpeg', ['-y', '-i', voicePath, '-stream_loop', '-1', '-i', join(audioDir, musicFile), '-filter_complex', filter, '-map', '[out]', '-t', String(total), '-b:a', '128k', outPath]);
    return await readFile(outPath);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

// Local proxy for ElevenLabs text-to-speech: keeps the API key server-side.
// POST /api/tts { text, era } -> audio/mpeg
function elevenLabsProxy(env: Record<string, string>): Plugin {
  return {
    name: 'elevenlabs-proxy',
    configureServer(server) {
      // POST /api/send-email { to, audio (base64 mp3), text, product, era } -> sends the spot by mail via Resend
      server.middlewares.use('/api/send-email', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { to, audio, text, product, era } = JSON.parse(body) as { to?: string; audio?: string; text?: string; product?: string; era?: string };
            if (!env.RESEND_API_KEY) {
              res.statusCode = 500;
              res.end('RESEND_API_KEY manquante dans le .env');
              return;
            }
            if (!to || !/^\S+@\S+\.\S+$/.test(to) || !audio) {
              res.statusCode = 400;
              res.end('Adresse e-mail ou audio manquant');
              return;
            }
            const escape = (value = '') => value.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
            const upstream = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: env.MAIL_FROM || 'Dploy <onboarding@resend.dev>',
                to: [to],
                subject: `Votre spot Dploy : ${product ?? ''} (${era ?? ''})`,
                html: `<p>Voici votre spot audio, en pièce jointe.</p><p><em>${escape(text)}</em></p>`,
                attachments: [{ filename: 'spot-dploy.mp3', content: audio }],
              }),
            });
            if (!upstream.ok) {
              res.statusCode = upstream.status;
              res.end(await upstream.text());
              return;
            }
            res.end('ok');
          } catch (error) {
            res.statusCode = 500;
            res.end(String(error));
          }
        });
      });

      server.middlewares.use('/api/tts', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { text, era } = JSON.parse(body) as { text?: string; era?: string };
            const apiKey = env.ELEVENLABS_API_KEY;
            const voiceId = env[`ELEVENLABS_VOICE_${era}`] || env.ELEVENLABS_VOICE_ID;
            if (!apiKey || !voiceId || !text?.trim()) {
              res.statusCode = 400;
              res.end('Missing ELEVENLABS_API_KEY, voice id or text');
              return;
            }
            const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
              method: 'POST',
              headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
              body: JSON.stringify({
                text: text.slice(0, 300),
                model_id: env.ELEVENLABS_MODEL || 'eleven_multilingual_v2',
                // Lower stability + some style = more expressive, less "read aloud"
                voice_settings: { stability: 0.35, similarity_boost: 0.75, style: 0.45, use_speaker_boost: true },
              }),
            });
            if (!upstream.ok) {
              res.statusCode = upstream.status;
              res.end(await upstream.text());
              return;
            }
            let audio: Buffer = Buffer.from(await upstream.arrayBuffer());
            const musicFile = era ? eraMusic[era] : undefined;
            if (musicFile && existsSync(join(audioDir, musicFile))) {
              try {
                audio = await mixWithMusic(audio, musicFile);
              } catch (error) {
                console.error('Mix failed, sending voice only:', error);
              }
            }
            res.setHeader('Content-Type', 'audio/mpeg');
            res.end(audio);
          } catch (error) {
            res.statusCode = 500;
            res.end(String(error));
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), elevenLabsProxy(env)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
