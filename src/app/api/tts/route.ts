import { NextRequest, NextResponse } from 'next/server';

function splitIntoChunks(text: string, maxLen = 140): string[] {
  if (!text) return [];
  // Dividir por signos de puntuación respetando pausas naturales
  const rawSentences = text
    .replace(/([.?!])\s+/g, '$1|§|')
    .split('|§|')
    .map(s => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = '';

  for (const s of rawSentences) {
    if ((current ? current + ' ' + s : s).length <= maxLen) {
      current = current ? current + ' ' + s : s;
    } else {
      if (current) chunks.push(current);
      if (s.length <= maxLen) {
        current = s;
      } else {
        // Si una oración es muy extensa, subdividir por comas o dos puntos
        const parts = s.split(/([,;:])\s+/);
        let subCurr = '';
        for (const p of parts) {
          if ((subCurr + p).length <= maxLen) {
            subCurr += p;
          } else {
            if (subCurr.trim()) chunks.push(subCurr.trim());
            subCurr = p;
          }
        }
        current = subCurr.trim();
      }
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks.filter(c => c.length > 0);
}

async function fetchAudioChunk(chunk: string): Promise<ArrayBuffer | null> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(chunk)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

async function synthesizeFullAudio(text: string): Promise<Buffer | null> {
  const chunks = splitIntoChunks(text, 140);
  if (chunks.length === 0) return null;

  const buffers: Buffer[] = [];
  for (const chunk of chunks) {
    const ab = await fetchAudioChunk(chunk);
    if (ab) {
      buffers.push(Buffer.from(ab));
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
