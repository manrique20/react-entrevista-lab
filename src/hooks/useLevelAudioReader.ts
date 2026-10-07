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
    .replace(/```[\s\S]*?```/g, ' Ejemplo de código disponible en pantalla. ')
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
    // Operadores comunes a texto hablado
    .replace(/\s*!==\s*/g, ' estrictamente diferente de ')
    .replace(/\s*===\s*/g, ' estrictamente igual a ')
    .replace(/\s*!=\s*/g, ' diferente de ')
    .replace(/\s*==\s*/g, ' igual a ')
    .replace(/\s*&&\s*/g, ' y ')
    .replace(/\s*\|\|\s*/g, ' o ')
    .replace(/\s*\?\?\s*/g, ' nullish coalescing ')
    .replace(/\s*\?\.\s*/g, ' optional chaining ')
    // Limpiar saltos de línea excesivos y espacios
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Divide el texto en oraciones cortas (máximo ~180 caracteres).
 * Esto permite una cadencia natural y compatibilidad tanto con Web Speech API como con el reproductor HTTP.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  const rawSentences = text
    .replace(/([.?!])\s+/g, '$1|§|')
    .split('|§|')
    .map(s => s.trim())
    .filter(Boolean);

  const sentences: string[] = [];

  for (const s of rawSentences) {
    if (s.length > 180) {
      const parts = s.split(/([,;:])\s+/);
      let current = '';
      for (let i = 0; i < parts.length; i++) {
        if ((current + parts[i]).length < 180) {
          current += parts[i];
        } else {
          if (current.trim()) sentences.push(current.trim());
          current = parts[i];
        }
      }
      if (current.trim()) sentences.push(current.trim());
    } else {
      sentences.push(s);
    }
  }

  return sentences.filter(s => s.length > 0);
}

interface UseLevelAudioReaderOptions {
  items: NarratorItem[];
  levelTitle?: string;
}

export function useLevelAudioReader({ items, levelTitle }: UseLevelAudioReaderOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rate, setRate] = useState(1.0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentIndexRef = useRef(0);
  const itemsRef = useRef(items);
  const rateRef = useRef(rate);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const autoScrollRef = useRef(autoScroll);

  // Modo de reproducción por streaming HTTP (/api/tts) cuando Web Speech API falla (ej. en Brave / Linux)
  const useHttpAudioRef = useRef<boolean>(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Registro de voces que hayan fallado con 'synthesis-failed'
  const failedVoicesRef = useRef<Set<string>>(new Set());

  // Referencias para manejo de Web Speech API
  const activeUtterancesRef = useRef<Set<SpeechSynthesisUtterance>>(new Set());
  const speakTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldStopRef = useRef(false);

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
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

  useEffect(() => {
    autoScrollRef.current = autoScroll;
  }, [autoScroll]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  }, []);

  const startKeepAlive = useCallback(() => {
    stopKeepAlive();
    keepAliveIntervalRef.current = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  }, [stopKeepAlive]);

  // Cargar voces disponibles en el navegador
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      useHttpAudioRef.current = true;
      return;
    }

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      const spanishVoices = allVoices.filter(v =>
        v.lang.toLowerCase().startsWith('es')
      );
      const voiceList = spanishVoices.length > 0 ? spanishVoices : allVoices;
      setVoices(voiceList);

      if (!selectedVoiceRef.current) {
        const localSpanish = voiceList.find(v => v.lang.toLowerCase().startsWith('es') && v.localService);
        const nonGoogleSpanish = voiceList.find(v => v.lang.toLowerCase().startsWith('es') && !v.name.toLowerCase().includes('google'));
        const systemVoice = localSpanish || nonGoogleSpanish || voiceList.find(v => v.localService) || voiceList[0];

        setSelectedVoice(systemVoice);
        selectedVoiceRef.current = systemVoice;
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    const voiceRetryTimer = setTimeout(updateVoices, 300);

    return () => {
      clearTimeout(voiceRetryTimer);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
      }
    };
  }, []);

  // Función para reproducir fragmento usando HTML5 Audio (/api/tts)
  const playHttpSentence = useCallback((text: string, onEnded: () => void, onError: () => void) => {
    try {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
      }

      const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}`);
      audio.playbackRate = rateRef.current;
      audioElementRef.current = audio;

      audio.onended = () => {
        onEnded();
      };

      audio.onerror = () => {
        onError();
      };

      audio.play().catch(() => {
        onError();
      });
    } catch {
      onError();
    }
  }, []);

  // Función para narrar oraciones en cola (híbrido: Web Speech API con auto-fallback a HTTP Audio)
  const speakSentences = useCallback((sentences: string[], onEndCallback: () => void) => {
    if (typeof window === 'undefined') return;

    if (sentences.length === 0) {
      onEndCallback();
      return;
    }

    shouldStopRef.current = false;
    setErrorMessage(null);

    // Cancelar cualquier síntesis en curso
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }

    let sentenceIndex = 0;

    const speakNext = () => {
      if (shouldStopRef.current) {
        stopKeepAlive();
        return;
      }

      if (sentenceIndex >= sentences.length) {
        stopKeepAlive();
        onEndCallback();
        return;
      }

      const text = sentences[sentenceIndex];
      sentenceIndex++;

      // Si ya se activó el motor HTTP (ej. tras error en Brave/Linux), reproducir vía /api/tts
      if (useHttpAudioRef.current) {
        playHttpSentence(
          text,
          () => speakNext(),
          () => speakNext() // si una frase tiene micro-corte, continuar con la siguiente
        );
        return;
      }

      // Intentar primero con la Web Speech API nativa
      speakTimeoutRef.current = setTimeout(() => {
        if (shouldStopRef.current) return;

        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = rateRef.current;

          let voiceToUse = selectedVoiceRef.current;
          if (voiceToUse && failedVoicesRef.current.has(voiceToUse.name)) {
            voiceToUse = null;
          }

          if (voiceToUse) {
            utterance.voice = voiceToUse;
            utterance.lang = voiceToUse.lang;
          } else {
            utterance.lang = 'es-ES';
          }

          activeUtterancesRef.current.add(utterance);

          utterance.onstart = () => {
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
          };

          utterance.onend = () => {
            activeUtterancesRef.current.delete(utterance);
            speakNext();
          };

          utterance.onerror = (e) => {
            activeUtterancesRef.current.delete(utterance);

            if (shouldStopRef.current || e.error === 'canceled' || e.error === 'interrupted') {
              return;
            }

            // Si Web Speech API falla (ej. synthesis-failed en Brave/Linux):
            if (e.error === 'synthesis-failed' || e.error === 'audio-busy') {
              console.warn('[AudioReader] Web Speech API no disponible en este entorno. Activando reproductor de audio optimizado...');
              useHttpAudioRef.current = true;
              // Reintentar la misma frase inmediatamente a través de /api/tts
              sentenceIndex--;
              speakNext();
              return;
            }

            speakNext();
          };

          window.speechSynthesis.speak(utterance);
          window.speechSynthesis.resume();
          startKeepAlive();
        } catch {
          // Fallback inmediato a HTTP Audio ante cualquier excepción
          useHttpAudioRef.current = true;
          sentenceIndex--;
          speakNext();
        }
      }, 60);
    };

    speakNext();
  }, [playHttpSentence, startKeepAlive, stopKeepAlive]);

  // Reproducir el tema actual y encadenar el siguiente
  const playItemAtIndex = useCallback((index: number) => {
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

    // Auto-scroll al elemento en pantalla
    if (autoScrollRef.current && typeof document !== 'undefined') {
      const el = document.getElementById(item.domId) || document.getElementById(`topic-${item.id}`) || document.getElementById(item.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    const fullText = `${item.title}. ${cleanMarkdownForSpeech(item.text)}`;
    const sentences = splitIntoSentences(fullText);

    speakSentences(sentences, () => {
      const nextIdx = currentIndexRef.current + 1;
      if (nextIdx < itemsRef.current.length) {
        playItemAtIndex(nextIdx);
      } else {
        // Fin de la lista
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSpeechId(null);
      }
    });
  }, [speakSentences]);

  const play = useCallback(() => {
    if (isPaused) {
      if (useHttpAudioRef.current && audioElementRef.current) {
        audioElementRef.current.play();
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
        startKeepAlive();
      }
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    playItemAtIndex(currentIndexRef.current);
  }, [isPaused, playItemAtIndex, startKeepAlive]);

  const pause = useCallback(() => {
    if (useHttpAudioRef.current && audioElementRef.current) {
      audioElementRef.current.pause();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    stopKeepAlive();
    setIsPaused(true);
    setIsPlaying(false);
  }, [stopKeepAlive]);

  const stop = useCallback(() => {
    shouldStopRef.current = true;
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    stopKeepAlive();
    activeUtterancesRef.current.clear();

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSpeechId(null);
  }, [stopKeepAlive]);

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
    if (isPlaying) {
      playItemAtIndex(currentIndexRef.current);
    }
  }, [isPlaying, playItemAtIndex]);

  // Reproducir un tema individual puntual
  const speakSingleTopic = useCallback((topicId: string, title: string, text: string) => {
    if (typeof window === 'undefined') return;

    if (activeSpeechId === topicId && (isPlaying || isPaused)) {
      stop();
      return;
    }

    // Cancelar cualquier reproducción previa
    shouldStopRef.current = true;
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    stopKeepAlive();
    activeUtterancesRef.current.clear();

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Iniciar nuevo tema individual
    setActiveSpeechId(topicId);
    setIsPlaying(true);
    setIsPaused(false);

    const fullText = `${title}. ${cleanMarkdownForSpeech(text)}`;
    const sentences = splitIntoSentences(fullText);

    speakSentences(sentences, () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveSpeechId(null);
    });
  }, [activeSpeechId, isPlaying, isPaused, stop, stopKeepAlive, speakSentences]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    currentIndex,
    totalItems: items.length,
    activeItem: items[currentIndex] || null,
    activeSpeechId,
    rate,
    autoScroll,
    voices,
    selectedVoice,
    errorMessage,
    clearError: () => setErrorMessage(null),
    play,
    pause,
    stop,
    next,
    prev,
    setRate: changeRate,
    setAutoScroll,
    setSelectedVoice: (voice: SpeechSynthesisVoice | null) => {
      setSelectedVoice(voice);
      selectedVoiceRef.current = voice;
      useHttpAudioRef.current = false;
    },
    playItemAtIndex,
    speakSingleTopic
  };
}
