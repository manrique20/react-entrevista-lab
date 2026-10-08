'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface NarratorItem {
  id: string;
  title: string;
  text: string;
  domId: string;
}

export function cleanMarkdownForSpeech(text: string): string {
  if (!text) return '';
  return text
    // Eliminar bloques de código markdown
    .replace(/```[\s\S]*?```/g, ' Ejemplo de código en pantalla. ')
    // Eliminar código inline backticks
    .replace(/`([^`]+)`/g, '$1')
    // Eliminar enlaces [texto](url) -> texto
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Eliminar encabezados #
    .replace(/^#{1,6}\s+/gm, '')
    // Eliminar negritas e itálicas
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Convertir listas con viñetas en pausas
    .replace(/^[-*•]\s+/gm, '. ')
    .replace(/^\d+\.\s+/gm, '. ')
    // Operadores comunes a texto hablado (solo cuando operan sintácticamente, no signos de puntuación)
    .replace(/\s*!==\s*/g, ' estrictamente diferente de ')
    .replace(/\s*===\s*/g, ' estrictamente igual a ')
    .replace(/\s*!=\s*/g, ' diferente de ')
    .replace(/\s*==\s*/g, ' igual a ')
    .replace(/\s*&&\s*/g, ' y ')
    .replace(/\s*\|\|\s*/g, ' o ')
    .replace(/(?<=\s)\?\?(?=\s)/g, ' nullish coalescing ')
    .replace(/([a-zA-Z0-9_$)\]])\s*\?\?\s*(?=[a-zA-Z0-9_$([{'"])/g, '$1 nullish coalescing ')
    .replace(/(?<=\s)\?\.(?=\s)/g, ' optional chaining ')
    .replace(/([a-zA-Z0-9_$)\]])\?\.(?=[a-zA-Z0-9_$([{'"])/g, '$1 optional chaining ')
    // Limpiar saltos de línea excesivos y espacios
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

interface UseLevelAudioReaderOptions {
  items: NarratorItem[];
  levelTitle?: string;
}

export function useLevelAudioReader({ items, levelTitle }: UseLevelAudioReaderOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rate, setRate] = useState(1.0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isSupported] = useState(true);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentIndexRef = useRef(0);
  const itemsRef = useRef(items);
  const rateRef = useRef(rate);
  const autoScrollRef = useRef(autoScroll);

  // Reproductor de audio HTML5 y caché en memoria para audio instantáneo
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const currentObjectUrlRef = useRef<string | null>(null);
  const audioBlobCacheRef = useRef<Map<string, Blob>>(new Map());

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    rateRef.current = rate;
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = rate;
    }
  }, [rate]);

  useEffect(() => {
    autoScrollRef.current = autoScroll;
  }, [autoScroll]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
      }
      if (currentObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(currentObjectUrlRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Función principal para reproducir un tema completo sin cortes ni pérdidas
  const playTopic = useCallback(async (item: NarratorItem, onFinished: () => void) => {
    try {
      // 1. Detener cualquier reproducción previa
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
      }

      // 2. Auto-scroll suave para centrar la tarjeta del tema activo
      if (autoScrollRef.current && typeof document !== 'undefined') {
        const el =
          document.getElementById(item.domId) ||
          document.getElementById(`topic-${item.id}`) ||
          document.getElementById(item.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      const titleClean = (item.title || '').trim();
      const titleFormatted = /[.?!]$/.test(titleClean) ? titleClean : `${titleClean}.`;
      const fullText = cleanMarkdownForSpeech(`${titleFormatted} ${item.text}`);
      setIsLoadingAudio(true);
      setErrorMessage(null);

      // 3. Obtener el archivo de audio (Blob) desde la caché o el endpoint /api/tts
      let blob = audioBlobCacheRef.current.get(item.id);

      if (!blob) {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: fullText })
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} al sintetizar audio`);
        }

        blob = await res.blob();
        audioBlobCacheRef.current.set(item.id, blob);
      }

      // Revocar la URL de objeto anterior para liberar memoria
      if (currentObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(currentObjectUrlRef.current);
        } catch {
          // ignore
        }
      }

      // Crear URL fresca válida a partir del Blob seguro
      const audioUrl = URL.createObjectURL(blob);
      currentObjectUrlRef.current = audioUrl;

      // 4. Configurar y reproducir a través del elemento Audio
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio();
      }

      const audio = audioElementRef.current;
      audio.src = audioUrl;
      audio.playbackRate = rateRef.current;

      audio.onended = () => {
        setIsLoadingAudio(false);
        onFinished();
      };

      audio.onerror = (e) => {
        setIsLoadingAudio(false);
        console.warn('[AudioReader] Error en elemento de audio:', e);
        onFinished();
      };

      await audio.play();
      setIsLoadingAudio(false);
      setIsPlaying(true);
      setIsPaused(false);
    } catch (err) {
      setIsLoadingAudio(false);
      console.warn('[AudioReader] Error reproduciendo tema:', err);
      setErrorMessage('No se pudo cargar el audio para este tema.');
      setIsPlaying(false);
      setIsPaused(false);
      setActiveSpeechId(null);
    }
  }, []);

  // Reproducir el tema actual y avanzar secuencialmente por el nivel
  const playItemAtIndex = useCallback(
    (index: number) => {
      const currentItems = itemsRef.current;
      if (index < 0 || index >= currentItems.length) {
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSpeechId(null);
        return;
      }

      const item = currentItems[index];
      setCurrentIndex(index);
      currentIndexRef.current = index;
      setActiveSpeechId(item.id);
      setIsPlaying(true);
      setIsPaused(false);

      playTopic(item, () => {
        const nextIdx = currentIndexRef.current + 1;
        if (nextIdx < itemsRef.current.length) {
          playItemAtIndex(nextIdx);
        } else {
          // Fin del nivel
          setIsPlaying(false);
          setIsPaused(false);
          setActiveSpeechId(null);
        }
      });
    },
    [playTopic]
  );

  const play = useCallback(() => {
    if (isPaused && audioElementRef.current) {
      audioElementRef.current
        .play()
        .then(() => {
          setIsPaused(false);
          setIsPlaying(true);
        })
        .catch(() => {
          playItemAtIndex(currentIndexRef.current);
        });
      return;
    }

    playItemAtIndex(currentIndexRef.current);
  }, [isPaused, playItemAtIndex]);

  const pause = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSpeechId(null);
  }, []);

  const next = useCallback(() => {
    const nextIdx = currentIndexRef.current + 1;
    if (nextIdx < itemsRef.current.length) {
      playItemAtIndex(nextIdx);
    }
  }, [playItemAtIndex]);

  const prev = useCallback(() => {
    const prevIdx = Math.max(0, currentIndexRef.current - 1);
    playItemAtIndex(prevIdx);
  }, [playItemAtIndex]);

  const changeRate = useCallback((newRate: number) => {
    setRate(newRate);
    rateRef.current = newRate;
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = newRate;
    }
  }, []);

  // Reproducir un tema individual puntual
  const speakSingleTopic = useCallback(
    (topicId: string, title: string, text: string) => {
      if (typeof window === 'undefined') return;

      if (activeSpeechId === topicId && (isPlaying || isPaused)) {
        stop();
        return;
      }

      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
      }

      setActiveSpeechId(topicId);
      setIsPlaying(true);
      setIsPaused(false);

      const targetItem =
        itemsRef.current.find(i => i.id === topicId) || {
          id: topicId,
          title,
          text,
          domId: `topic-${topicId}`
        };

      playTopic(targetItem, () => {
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSpeechId(null);
      });
    },
    [activeSpeechId, isPlaying, isPaused, stop, playTopic]
  );

  return {
    isSupported,
    isPlaying,
    isPaused,
    isLoadingAudio,
    currentIndex,
    totalItems: items.length,
    activeItem: items[currentIndex] || null,
    activeSpeechId,
    rate,
    autoScroll,
    voices: [],
    selectedVoice: null,
    errorMessage,
    clearError: () => setErrorMessage(null),
    play,
    pause,
    stop,
    next,
    prev,
    setRate: changeRate,
    setAutoScroll,
    setSelectedVoice: () => {},
    playItemAtIndex,
    speakSingleTopic
  };
}
