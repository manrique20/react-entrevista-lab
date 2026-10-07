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
    .replace(/```[\s\S]*?```/g, ' Código de ejemplo disponible en pantalla. ')
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
    .replace(/\s*\?\.s*/g, ' optional chaining ')
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rate, setRate] = useState(1.0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentIndexRef = useRef(0);
  const itemsRef = useRef(items);
  const rateRef = useRef(rate);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const autoScrollRef = useRef(autoScroll);

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

  // Cargar voces del sistema
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filtrar voces en español
      const spanishVoices = allVoices.filter(v => v.lang.startsWith('es') || v.lang.startsWith('ES'));
      const voiceList = spanishVoices.length > 0 ? spanishVoices : allVoices;
      setVoices(voiceList);

      // Seleccionar voz por defecto preferida (Google Español, Mónica, Paulina, etc.)
      if (!selectedVoiceRef.current && voiceList.length > 0) {
        const preferred =
          voiceList.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')) ||
          voiceList[0];
        setSelectedVoice(preferred);
        selectedVoiceRef.current = preferred;
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Función interna para hablar un texto
  const speakText = useCallback((textToSpeak: string, onEndCallback: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rateRef.current;
    utterance.lang = selectedVoiceRef.current?.lang || 'es-ES';
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }

    utterance.onend = () => {
      onEndCallback();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        onEndCallback();
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

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

    speakText(fullText, () => {
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
  }, [speakText]);

  const play = useCallback(() => {
    if (isPaused) {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.resume();
      }
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    playItemAtIndex(currentIndexRef.current);
  }, [isPaused, playItemAtIndex]);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
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
    if (isPlaying) {
      // Reiniciar tema actual con nueva velocidad
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

    stop();
    setActiveSpeechId(topicId);
    setIsPlaying(true);
    setIsPaused(false);

    const fullText = `${title}. ${cleanMarkdownForSpeech(text)}`;

    speakText(fullText, () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveSpeechId(null);
    });
  }, [activeSpeechId, isPlaying, isPaused, stop, speakText]);

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
