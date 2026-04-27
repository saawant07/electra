import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appName: "Electra 2026",
      coPilot: "AI Election Co-Pilot",
      readiness: "Election Readiness",
      mythBuster: "Myth Buster",
      simulator: "EVM Simulator",
      confidenceJourney: "Confidence Journey",
      voiceCoach: "Voice Coach",
      exportPassport: "Export Passport",
      boothFinder: "Booth Finder",
      whatToCarry: "What to carry",
      startMission: "Start mission",
      concede: "Concede myth",
      defend: "Defend the myth",
      submitArgument: "Send argument",
      nextStep: "Next step",
      onboardingTitle: "Before we coach you, tell us who is voting.",
      install: "Install app",
      offlineReady: "Offline ready",
      phaseTwo: "Phase 2",
      language: "Language",
      darkMode: "Dark mode",
      lightMode: "Light mode"
    }
  },
  hi: {
    translation: {
      appName: "इलेक्ट्रा 2026",
      coPilot: "एआई चुनाव सहायक",
      readiness: "चुनाव तैयारी",
      mythBuster: "मिथ बस्टर",
      simulator: "ईवीएम सिम्युलेटर",
      confidenceJourney: "कॉन्फिडेंस जर्नी",
      voiceCoach: "वॉइस कोच",
      exportPassport: "पासपोर्ट निर्यात करें",
      boothFinder: "बूथ खोजें",
      whatToCarry: "क्या साथ लाना है",
      startMission: "मिशन शुरू करें",
      concede: "मिथ मान लें",
      defend: "मिथ का बचाव करें",
      submitArgument: "तर्क भेजें",
      nextStep: "अगला कदम",
      onboardingTitle: "कोचिंग शुरू करने से पहले, बताइए वोट कौन करेगा।",
      install: "ऐप इंस्टॉल करें",
      offlineReady: "ऑफलाइन तैयार",
      phaseTwo: "दूसरा चरण",
      language: "भाषा",
      darkMode: "डार्क मोड",
      lightMode: "लाइट मोड"
    }
  },
  bn: {
    translation: {
      appName: "ইলেক্ট্রা 2026",
      coPilot: "এআই নির্বাচন সহচর",
      readiness: "নির্বাচন প্রস্তুতি",
      mythBuster: "মিথ বাস্টার",
      simulator: "ইভিএম সিমুলেটর",
      confidenceJourney: "আত্মবিশ্বাস যাত্রা",
      voiceCoach: "ভয়েস কোচ",
      exportPassport: "পাসপোর্ট এক্সপোর্ট",
      boothFinder: "বুথ খুঁজুন",
      whatToCarry: "কী নিয়ে যাবেন",
      startMission: "মিশন শুরু",
      concede: "মিথ মেনে নিন",
      defend: "মিথের পক্ষে বলুন",
      submitArgument: "যুক্তি পাঠান",
      nextStep: "পরের ধাপ",
      onboardingTitle: "কোচিং শুরুর আগে, কে ভোট দিচ্ছেন জানাই।",
      install: "অ্যাপ ইনস্টল করুন",
      offlineReady: "অফলাইন প্রস্তুত",
      phaseTwo: "দ্বিতীয় ধাপ",
      language: "ভাষা",
      darkMode: "ডার্ক মোড",
      lightMode: "লাইট মোড"
    }
  },
  ta: {
    translation: {
      appName: "எலெக்ட்ரா 2026",
      coPilot: "ஏஐ தேர்தல் துணை",
      readiness: "தேர்தல் தயார்நிலை",
      mythBuster: "மித் பஸ்டர்",
      simulator: "EVM சிமுலேட்டர்",
      confidenceJourney: "நம்பிக்கை பயணம்",
      voiceCoach: "குரல் வழிகாட்டி",
      exportPassport: "பாஸ்போர்ட் ஏற்றுமதி",
      boothFinder: "வாக்குச்சாவடி தேடல்",
      whatToCarry: "எதை கொண்டு வர வேண்டும்",
      startMission: "பயணத்தை தொடங்கு",
      concede: "மித்தை ஒப்புக்கொள்",
      defend: "மித்தை பாதுகாப்பு",
      submitArgument: "வாதம் அனுப்பு",
      nextStep: "அடுத்த படி",
      onboardingTitle: "உங்களை வழிநடத்துவதற்கு முன், வாக்களிப்பவர் பற்றி சொல்லுங்கள்.",
      install: "அப்பை நிறுவு",
      offlineReady: "ஆஃப்லைனில் தயார்",
      phaseTwo: "இரண்டாம் கட்டம்",
      language: "மொழி",
      darkMode: "டார்க் மோடு",
      lightMode: "லைட் மோடு"
    }
  }
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
