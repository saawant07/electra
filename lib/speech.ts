import type { SupportedLanguage } from "@/lib/types";

const SPEECH_LANG: Record<SupportedLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
};

export function speakText(text: string, language: SupportedLanguage) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG[language] ?? "en-IN";
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
