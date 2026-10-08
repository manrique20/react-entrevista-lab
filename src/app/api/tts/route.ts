import { NextRequest, NextResponse } from 'next/server';

function splitIntoChunks(text: string, maxLen = 140): string[] {
  if (!text) return [];

  function breakDown(fragment: string): string[] {
    const trimmed = fragment.trim();
    if (!trimmed) return [];
    if (trimmed.length <= maxLen) return [trimmed];

    // 1. Dividir por signos de final de oración (. ! ?)
    const sentences = trimmed.split(/(?<=[.?!])\s+/).filter(Boolean);
    if (sentences.length > 1) {
      return combineUnderLimit(sentences.flatMap(breakDown), maxLen);
    }

    // 2. Dividir por cláusulas gramaticales (, ; : — – paréntesis)
    const clauses = trimmed.split(/(?<=[,;:—–\)])\s+/).filter(Boolean);
    if (clauses.length > 1) {
      return combineUnderLimit(clauses.flatMap(breakDown), maxLen);
    }

    // 3. Dividir por palabras
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      return combineUnderLimit(words.flatMap(breakDown), maxLen);
    }

    // 4. Si una sola palabra/token excede maxLen, dividir por caracteres estrictamente
    const slices: string[] = [];
    for (let i = 0; i < trimmed.length; i += maxLen) {
      slices.push(trimmed.slice(i, i + maxLen));
    }
    return slices;
  }

  function combineUnderLimit(pieces: string[], limit: number): string[] {
    const result: string[] = [];
    let current = '';

    for (const p of pieces) {
      const piece = p.trim();
      if (!piece) continue;

      if (!current) {
        current = piece;
      } else if ((current + ' ' + piece).length <= limit) {
        current += ' ' + piece;
      } else {
        result.push(current);
        current = piece;
      }
    }
    if (current) result.push(current);
    return result;
  }

  return breakDown(text);
}

async function fetchAudioChunk(chunk: string, retries = 1): Promise<ArrayBuffer | null> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(chunk)}`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        return await res.arrayBuffer();
      }
      console.warn(`[TTS] Error HTTP ${res.status} (intento ${attempt + 1}) en fragmento de audio: "${chunk.slice(0, 40)}..."`);
    } catch (err) {
      console.warn(`[TTS] Excepción de red (intento ${attempt + 1}):`, err);
    }
    if (attempt < retries) {
      await new Promise(r => setTimeout(r, 150));
    }
  }
  return null;
}

async function synthesizeFullAudio(text: string): Promise<Buffer | null> {
  const chunks = splitIntoChunks(text, 140);
  if (chunks.length === 0) return null;

  const buffers: Buffer[] = [];
  for (const chunk of chunks) {
    const ab = await fetchAudioChunk(chunk);
    if (ab) {
      buffers.push(Buffer.from(ab));
    } else {
      console.warn(`[TTS] Se omitió fragmento fallido tras reintentos: "${chunk.slice(0, 40)}..."`);
    }
  }

  if (buffers.length === 0) return null;
  return Buffer.concat(buffers);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new NextResponse('Texto requerido', { status: 400 });
    }

    const combinedMp3 = await synthesizeFullAudio(text.trim());
    if (!combinedMp3) {
      return new NextResponse('Error al sintetizar audio', { status: 500 });
    }

    return new NextResponse(new Uint8Array(combinedMp3), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    });
  } catch (err) {
    console.error('[API TTS POST] Error:', err);
    return new NextResponse('Error interno', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');

  if (!text || text.trim().length === 0) {
    return new NextResponse('Texto requerido', { status: 400 });
  }

  const combinedMp3 = await synthesizeFullAudio(text.trim());
  if (!combinedMp3) {
    return new NextResponse('Error al sintetizar audio', { status: 500 });
  }

  return new NextResponse(new Uint8Array(combinedMp3), {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
