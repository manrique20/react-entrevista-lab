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
 * Esto evita el conocido bug de Chromium donde utterances de más de 15 segundos se silencian o cancelan.
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
    if (s.length > 200) {
      const parts = s.split(/([,;:])\s+/);
      let current = '';
      for (let i = 0; i < parts.length; i++) {
        if ((current + parts[i]).length < 200) {
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
  const [isSupported, setIsSupported] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const currentIndexRef = useRef(0);
  const itemsRef = useRef(items);
  const rateRef = useRef(rate);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const autoScrollRef = useRef(autoScroll);

  // Referencias para manejo robusto de ciclo de vida de Web Speech API
  const activeUtterancesRef = useRef<Set<SpeechSynthesisUtterance>>(new Set());
  const speakTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldStopRef = useRef(false);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    rateRef.current = rate;
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

  // Cargar voces del sistema operativo y navegador
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      const spanishVoices = allVoices.filter(v =>
        v.lang.toLowerCase().startsWith('es')
      );
      const voiceList = spanishVoices.length > 0 ? spanishVoices : allVoices;
      setVoices(voiceList);

      if (!selectedVoiceRef.current) {
        const preferred =
          voiceList.find(v =>
            v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Paulina') ||
            v.name.includes('Mónica') ||
            v.name.includes('Jorge')
          ) || voiceList[0];
        setSelectedVoice(preferred);
        selectedVoiceRef.current = preferred;
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
    };
  }, []);

  // Función para narrar un conjunto de oraciones secuencialmente
  const speakSentences = useCallback((sentences: string[], onEndCallback: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (sentences.length === 0) {
      onEndCallback();
      return;
    }

    shouldStopRef.current = false;

    // Cancelar cualquier audio anterior y limpiar timeouts
    window.speechSynthesis.cancel();
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

      // Retardo de 60ms: esencial en Chrome para que no descarte el nuevo speak() tras un cancel()
      speakTimeoutRef.current = setTimeout(() => {
        if (shouldStopRef.current) return;

        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = rateRef.current;

          // Resolver la voz a usar
          const allVoices = window.speechSynthesis.getVoices();
          let voiceToUse = selectedVoiceRef.current;

          if (!voiceToUse && allVoices.length > 0) {
            voiceToUse =
              allVoices.find(v => v.lang.toLowerCase().startsWith('es')) ||
              allVoices[0];
          }

          if (voiceToUse) {
            utterance.voice = voiceToUse;
            utterance.lang = voiceToUse.lang;
          } else {
            utterance.lang = 'es-ES';
          }

          // Mantener referencia contra Garbage Collection
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
            console.warn('[AudioReader] Error de síntesis de voz:', e.error);
            if (!shouldStopRef.current && e.error !== 'canceled' && e.error !== 'interrupted') {
              speakNext();
            }
          };

          window.speechSynthesis.speak(utterance);
          window.speechSynthesis.resume();
          startKeepAlive();
        } catch (err) {
          console.warn('[AudioReader] Fallo al reproducir fragmento:', err);
          speakNext();
        }
      }, 60);
    };

    speakNext();
  }, [startKeepAlive, stopKeepAlive]);

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
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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
    if (isPlaying) {
      playItemAtIndex(currentIndexRef.current);
    }
  }, [isPlaying, playItemAtIndex]);

  // Reproducir un tema individual puntual
  const speakSingleTopic = useCallback((topicId: string, title: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

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
    window.speechSynthesis.cancel();

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
    play,
    pause,
    stop,
    next,
    prev,
    setRate: changeRate,
    setAutoScroll,
    setSelectedVoice,
    playItemAtIndex,
    speakSingleTopic
  };
}
