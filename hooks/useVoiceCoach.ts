"use client";

import { useEffect } from "react";
import { speakText, stopSpeech } from "@/lib/speech";

export function useVoiceCoach(enabled: boolean, text: string, language: string) {
  useEffect(() => {
    if (!enabled || !text) {
      stopSpeech();
      return;
    }

    speakText(text, language as never);

    return () => stopSpeech();
  }, [enabled, language, text]);
}
