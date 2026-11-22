/* ==========================================================================
   MANSANTULAN (मन संतुलन) — INTERNATIONALIZATION (i18n) ENGINE
   Languages: English (en), Hindi (hi), Marathi (mr)
   ========================================================================== */

(() => {
  "use strict";

  const TRANSLATIONS = {
    en: {
      "app.name": "ManSantulan",
      "app.tagline": "Balance of Mind",
      "nav.home": "Home",
      "nav.assessment": "Assessment",
      "nav.insights": "Insights",
      "nav.wellness": "Wellness",
      "nav.resources": "Resources",
      "nav.logout": "Log Out",
      "hero.badge": "AI-Powered Student Wellness",
      "hero.title": "Find your mind's natural equilibrium",
      "hero.subtitle": "A safe, calm space designed for students to understand how social media and daily habits influence mental balance.",
      "hero.cta": "Check My Balance",
      "hero.secondary": "Explore Insights",
      "steps.tag": "Simple & Safe Process",
      "steps.title": "How ManSantulan Works",
      "steps.desc": "Three quick steps to understand and nurture your mental wellbeing.",
      "steps.1.title": "1. Share Your Habits",
      "steps.1.desc": "Answer a few gentle questions about your screen time, sleep, and study routine.",
      "steps.2.title": "2. AI Analysis",
      "steps.2.desc": "Our trained machine learning model evaluates habits against wellness benchmarks.",
      "steps.3.title": "3. Actionable Insights",
      "steps.3.desc": "Receive a supportive, non-clinical score breakdown and practical self-care tips.",
      "wizard.privacy": "Privacy First: Your inputs are analyzed anonymously in-browser and never sold or permanently stored.",
      "wizard.step1.label": "Profile",
      "wizard.step2.label": "Digital Life",
      "wizard.step3.label": "Lifestyle",
      "wizard.step4.label": "Review",
      "wizard.step1.title": "Tell us about yourself",
      "wizard.step1.desc": "Demographic context helps personalize the baseline analysis.",
      "wizard.age.label": "Your Age",
      "wizard.gender.label": "Gender",
      "wizard.country.label": "Country of Residence",
      "wizard.step2.title": "Your Digital Environment",
      "wizard.step2.desc": "How you interact with screens, devices, and platforms.",
      "wizard.academic.label": "Academic Level",
      "wizard.platform.label": "Primary Social Media Platform",
      "wizard.purpose.label": "Primary Purpose of Use",
      "wizard.usage.label": "Daily Social Media Usage",
      "wizard.unlocks.label": "Estimated Daily Phone Unlocks",
      "wizard.step3.title": "Daily Routine & Lifestyle",
      "wizard.step3.desc": "Rest, study habits, and how your body and mind recharge.",
      "wizard.study.label": "Daily Study Hours",
      "wizard.activity.label": "Physical Activity / Movement",
      "wizard.sleep.label": "Average Nightly Sleep",
      "wizard.stress.label": "Current Perceived Stress Level",
      "wizard.step4.title": "Review Your Information",
      "wizard.step4.desc": "Verify your entries before computing your balance score.",
      "wizard.btn.back": "Back",
      "wizard.btn.next": "Next Step",
      "wizard.btn.submit": "Calculate Mental Balance",
      "result.score.label": "Mental Wellness Balance Score",
      "result.thriving": "Thriving & Balanced",
      "result.thriving.desc": "Your lifestyle habits show strong balance between screen usage, sleep, and physical activity.",
      "result.growing": "Good Baseline Balance",
      "result.growing.desc": "Your digital and lifestyle habits are largely healthy, with small opportunities for rest optimization.",
      "result.finding_balance": "Moderate Strain Detected",
      "result.finding_balance.desc": "Screen time and study pressure may be affecting your recovery. Gentle adjustments can help.",
      "result.needs_attention": "Support & Rest Recommended",
      "result.needs_attention.desc": "High stress or screen fatigue signals detected. Remember, you are not alone and resting is productive.",
      "result.factors.title": "Contributing Habit Factors",
      "result.tips.title": "Personalized Action Steps",
      "result.btn.retake": "Retake Assessment",
      "result.btn.download": "Save Report",
      "result.btn.share": "Share Awareness",
      "insights.title": "Student Wellness Data Insights",
      "insights.desc": "Patterns discovered from 5,000+ student digital lifestyle survey records.",
      "wellness.title": "Interactive Wellness Toolkit",
      "wellness.desc": "Immediate micro-practices you can do right now to reset your nervous system.",
      "breathing.title": "Box Breathing Reset",
      "breathing.desc": "Follow the expanding circle: inhale for 4s, hold, exhale for 4s.",
      "breathing.btn.start": "Start Breathing Exercise",
      "breathing.btn.stop": "Pause Exercise",
      "affirmation.title": "Daily Affirmation",
      "affirmation.desc": "A gentle reminder for student life.",
      "affirmation.btn": "New Affirmation",
      "detox.title": "Digital Detox Streak",
      "detox.desc": "Commit to 1 hour phone-free before sleep.",
      "detox.btn": "Log Today's Detox",
      "faq.title": "Frequently Asked Questions",
      "faq.desc": "Clear answers about data privacy, AI scoring, and student wellness.",
      "helpline.fab": "Need help now?",
      "helpline.modal.title": "24/7 Verified Student Support Helplines",
      "disclaimer.text": "Disclaimer: ManSantulan is an educational and self-awareness tool powered by machine learning, not a clinical diagnostic instrument. If you are experiencing distress, please reach out to licensed mental health professionals or trusted counselors."
    },
    hi: {
      "app.name": "मन संतुलन",
      "app.tagline": "मानसिक शांति और संतुलन",
      "nav.home": "मुख्य पृष्ठ",
      "nav.assessment": "मूल्यांकन",
      "nav.insights": "डेटा अंतर्दृष्टि",
      "nav.wellness": "कल्याण टूलकिट",
      "nav.resources": "संसाधन",
      "nav.logout": "लॉग आउट",
      "hero.badge": "छात्रों के लिए AI-आधारित कल्याण साधन",
      "hero.title": "अपने मन का प्राकृतिक संतुलन पहचानें",
      "hero.subtitle": "छात्रों के लिए एक शांत और सुरक्षित माध्यम, जो यह समझने में मदद करता है कि सोशल मीडिया और दैनिक आदतें मानसिक स्वास्थ्य को कैसे प्रभावित करती हैं।",
      "hero.cta": "संतुलन स्कोर जांचें",
      "hero.secondary": "डेटा अंतर्दृष्टि देखें",
      "steps.tag": "सरल और सुरक्षित प्रक्रिया",
      "steps.title": "मन संतुलन कैसे कार्य करता है",
      "steps.desc": "मानसिक स्वास्थ्य को समझने और संवारने के लिए तीन सरल चरण।",
      "steps.1.title": "1. अपनी आदतें बताएं",
      "steps.1.desc": "स्क्रीन समय, नींद और अध्ययन की दिनचर्या से जुड़े कुछ सरल प्रश्नों के उत्तर दें।",
      "steps.2.title": "2. AI विश्लेषण",
      "steps.2.desc": "हमारा प्रशिक्षित मशीन लर्निंग मॉडल स्थापित स्वास्थ्य मानकों के आधार पर विश्लेषण करता है।",
      "steps.3.title": "3. उपयोगी सुझाव",
      "steps.3.desc": "गैर-चिकित्सकीय स्कोर विवरण और दैनिक जीवन के लिए व्यावहारिक सुझाव प्राप्त करें।",
      "wizard.privacy": "गोपनीयता सर्वोपरि: आपकी जानकारी ब्राउज़र में सुरक्षित विश्लेषित होती है और कहीं भी स्थायी रूप से सहेजी नहीं जाती।",
      "wizard.step1.label": "प्रोफ़ाइल",
      "wizard.step2.label": "डिजिटल आदतें",
      "wizard.step3.label": "जीवनशैली",
      "wizard.step4.label": "समीक्षा",
      "wizard.step1.title": "अपने बारे में बताएं",
      "wizard.step1.desc": "बुनियादी जानकारी से सटीक विश्लेषण में सहायता मिलती है।",
      "wizard.age.label": "आपकी आयु",
      "wizard.gender.label": "लिंग",
      "wizard.country.label": "निवास देश",
      "wizard.step2.title": "आपका डिजिटल वातावरण",
      "wizard.step2.desc": "आप स्क्रीन और सोशल मीडिया का उपयोग किस तरह करते हैं।",
      "wizard.academic.label": "शैक्षणिक स्तर",
      "wizard.platform.label": "प्रमुख सोशल मीडिया प्लेटफॉर्म",
      "wizard.purpose.label": "उपयोग का मुख्य उद्देश्य",
      "wizard.usage.label": "दैनिक स्क्रीन समय",
      "wizard.unlocks.label": "दैनिक फोन अनलॉक अनुमान",
      "wizard.step3.title": "दैनिक दिनचर्या और आराम",
      "wizard.step3.desc": "अध्ययन, व्यायाम और नींद की आदतें।",
      "wizard.study.label": "दैनिक अध्ययन के घंटे",
      "wizard.activity.label": "शारीरिक गतिविधि / व्यायाम",
      "wizard.sleep.label": "प्रति रात औसत नींद",
      "wizard.stress.label": "वर्तमान तनाव स्तर",
      "wizard.step4.title": "अपनी जानकारी की समीक्षा करें",
      "wizard.step4.desc": "स्कोर की गणना करने से पहले विवरण की पुष्टि करें।",
      "wizard.btn.back": "पीछे",
      "wizard.btn.next": "अगला चरण",
      "wizard.btn.submit": "मानसिक संतुलन की गणना करें",
      "result.score.label": "मानसिक संतुलन स्कोर",
      "result.thriving": "उत्कृष्ट और संतुलित",
      "result.thriving.desc": "आपकी दिनचर्या में स्क्रीन समय, नींद और गतिविधि के बीच बहुत अच्छा संतुलन है।",
      "result.growing": "सकारात्मक और स्थिर संतुलन",
      "result.growing.desc": "आपकी आदतें स्वस्थ हैं। थोड़ी अतिरिक्त नींद से आप और बेहतर महसूस कर सकते हैं।",
      "result.finding_balance": "मध्यम तनाव का संकेत",
      "result.finding_balance.desc": "अत्यधिक स्क्रीन समय या पढ़ाई का दबाव थकान उत्पन्न कर सकता है। थोड़ा विराम लेना लाभकारी होगा।",
      "result.needs_attention": "विश्राम और सहायता की सलाह",
      "result.needs_attention.desc": "थकान या तनाव के संकेत अधिक हैं। याद रखें, आप अकेले नहीं हैं और आराम करना भी आवश्यक है।",
      "result.factors.title": "मुख्य प्रभावकारी आदतें",
      "result.tips.title": "आपके लिए व्यक्तिगत सुझाव",
      "result.btn.retake": "पुनः मूल्यांकन करें",
      "result.btn.download": "रिपोर्ट सहेजें",
      "result.btn.share": "जागरूकता साझा करें",
      "insights.title": "छात्र डेटा अंतर्दृष्टि",
      "insights.desc": "5,000+ छात्रों के सर्वेक्षण डेटा से प्राप्त महत्वपूर्ण निष्कर्ष।",
      "wellness.title": "इंटरएक्टिव वेलनेस टूलकिट",
      "wellness.desc": "तत्काल राहत और मानसिक शांति के लिए सूक्ष्म अभ्यास।",
      "breathing.title": "प्राणायाम एवं श्वास अभ्यास",
      "breathing.desc": "घटते-बढ़ते वृत्त के साथ सांस लें: 4 सेकंड अंदर, रोकें, 4 सेकंड बाहर छोड़ें।",
      "breathing.btn.start": "अभ्यास शुरू करें",
      "breathing.btn.stop": "रोकें",
      "affirmation.title": "दैनिक सकारात्मक विचार",
      "affirmation.desc": "छात्र जीवन के लिए एक प्रेरणादायक संदेश।",
      "affirmation.btn": "नया विचार देखें",
      "detox.title": "डिजिटल डिटॉक्स स्ट्रीक",
      "detox.desc": "सोने से 1 घंटा पहले फोन से दूरी बनाएं।",
      "detox.btn": "आज का डिटॉक्स दर्ज करें",
      "faq.title": "अक्सर पूछे जाने वाले प्रश्न",
      "faq.desc": "गोपनीयता, AI स्कोर और छात्र स्वास्थ्य से जुड़े उत्तर।",
      "helpline.fab": "तुरंत सहायता चाहिए?",
      "helpline.modal.title": "24/7 सत्यापित भारतीय सहायता हेल्पलाइन",
      "disclaimer.text": "अस्वीकरण: मन संतुलन एक शैक्षिक और जागरूकता साधन है, न कि कोई चिकित्सा निदान उपकरण। गंभीर तनाव की स्थिति में पेशेवर परामर्शदाता या चिकित्सक से संपर्क करें।"
    },
    mr: {
      "app.name": "मन संतुलन",
      "app.tagline": "मनाची शांतता आणि तोल",
      "nav.home": "मुख्यपृष्ठ",
      "nav.assessment": "मूल्यांकन",
      "nav.insights": "डेटा अंतर्दृष्टी",
      "nav.wellness": "कल्याण टूलकिट",
      "nav.resources": "संसाधने",
      "nav.logout": "लॉग आउट",
      "hero.badge": "विद्यार्थ्यांसाठी AI-आधारित मानसिक कल्याण साधन",
      "hero.title": "तुमच्या मनाचे नैसर्गिक संतुलन ओळखा",
      "hero.subtitle": "सोशल मीडिया आणि रोजच्या सवयी मानसिक आरोग्यावर कसा परिणाम करतात हे समजून घेण्यासाठी सुरक्षित आणि शांत व्यासपीठ.",
      "hero.cta": "माझे संतुलन तपासा",
      "hero.secondary": "अंतर्दृष्टी पहा",
      "steps.tag": "सोपी आणि सुरक्षित पद्धत",
      "steps.title": "मन संतुलन कसे कार्य करते",
      "steps.desc": "मानसिक स्वास्थ्य समजून घेण्यासाठी आणि सुधारण्यासाठी तीन टप्पे.",
      "steps.1.title": "1. सवयींची माहिती द्या",
      "steps.1.desc": "स्क्रीन वेळ, झोप आणि अभ्यास याबद्दलच्या सोप्या प्रश्नांची उत्तरे द्या.",
      "steps.2.title": "2. AI विश्लेषण",
      "steps.2.desc": "आमचे प्रशिक्षित मशीन लर्निंग मॉडेल निकषांनुसार सवयींचे विश्लेषण करते.",
      "steps.3.title": "3. उपयुक्त मार्गदर्शन",
      "steps.3.desc": "गैर-वैद्यकीय संतुलन गुण आणि दैनंदिन जीवनासाठी सोप्या टिप्स मिळवा.",
      "wizard.privacy": "गोपनीयता प्रथम: तुमची माहिती फक्त ब्राउझरमध्ये तपासली जाते आणि कुठेही साठवली जात नाही.",
      "wizard.step1.label": "माहिती",
      "wizard.step2.label": "डिजिटल जीवन",
      "wizard.step3.label": "दिनचर्या",
      "wizard.step4.label": "पुनरावलोकन",
      "wizard.step1.title": "तुमच्याबद्दल सांगा",
      "wizard.step1.desc": "वैयक्तिकृत विश्लेषणासाठी मूलभूत माहिती.",
      "wizard.age.label": "तुमचे वय",
      "wizard.gender.label": "लिंग",
      "wizard.country.label": "देश",
      "wizard.step2.title": "डिजिटल वापर",
      "wizard.step2.desc": "तुमचा स्क्रीन आणि सोशल मीडियाचा वापर.",
      "wizard.academic.label": "शैक्षणिक स्तर",
      "wizard.platform.label": "प्रमुख सोशल मीडिया",
      "wizard.purpose.label": "वापराचा मुख्य हेतू",
      "wizard.usage.label": "दैनिक स्क्रीन वेळ",
      "wizard.unlocks.label": "अंदाजे दैनिक फोन अनलॉक",
      "wizard.step3.title": "दैनिक दिनचर्या",
      "wizard.step3.desc": "अभ्यास, व्यायाम आणि विश्रांती.",
      "wizard.study.label": "दैनिक अभ्यास तास",
      "wizard.activity.label": "शारीरिक हालचाल / व्यायाम",
      "wizard.sleep.label": "सरासरी रात्रीची झोप",
      "wizard.stress.label": "सध्याचा ताणतणाव पातळी",
      "wizard.step4.title": "माहिती तपासा",
      "wizard.step4.desc": "गुण मोजण्यापूर्वी सर्व तपशील बरोबर असल्याची खात्री करा.",
      "wizard.btn.back": "मागे",
      "wizard.btn.next": "पुढील टप्पा",
      "wizard.btn.submit": "मानसिक संतुलन मोजा",
      "result.score.label": "मानसिक संतुलन गुण",
      "result.thriving": "उत्कृष्ट आणि संतुलित",
      "result.thriving.desc": "तुमच्या स्क्रीन वापर, झोप आणि व्यायामात उत्तम समतोल दिसून येतो.",
      "result.growing": "चांगले आणि स्थिर संतुलन",
      "result.growing.desc": "सवयी चांगल्या आहेत. थोडी अधिक विश्रांती तुम्हाला अधिक ताजेतवाने करेल.",
      "result.finding_balance": "मध्यम ताणाचा इशारा",
      "result.finding_balance.desc": "स्क्रीनचा अतिवापर किंवा अभ्यासाचा ताण थकवा आणू शकतो. शांत विश्रांती घ्या.",
      "result.needs_attention": "विश्रांती आणि सहकार्याची गरज",
      "result.needs_attention.desc": "थकवा किंवा ताणाचे संकेत जास्त आहेत. लक्षात ठेवा, तुम्ही एकटे नाही आहात.",
      "result.factors.title": "महत्त्वाचे घटक",
      "result.tips.title": "तुमच्यासाठी खास टिप्स",
      "result.btn.retake": "पुन्हा तपासा",
      "result.btn.download": "अहवाल जतन करा",
      "result.btn.share": "जागरूकता शेअर करा",
      "insights.title": "विद्यार्थी डेटा अंतर्दृष्टी",
      "insights.desc": "५,०००+ विद्यार्थ्यांच्या सर्वेक्षणातून मिळालेले महत्त्वाचे निष्कर्ष.",
      "wellness.title": "वेलनेस टूलकिट",
      "wellness.desc": "मनाला त्वरित शांतता मिळवून देणारे सोपे उपाय.",
      "breathing.title": "श्वसन व्यायाम",
      "breathing.desc": "वर्तुळाच्या लयीत श्वास घ्या: ४ सेकंद आत, धरा, ४ सेकंद सोडा.",
      "breathing.btn.start": "व्यायाम सुरू करा",
      "breathing.btn.stop": "थांबवा",
      "affirmation.title": "दैनिक प्रेरणा",
      "affirmation.desc": "विद्यार्थ्यांसाठी एक सकारात्मक विचार.",
      "affirmation.btn": "नवीन विचार",
      "detox.title": "डिजिटल डिटॉक्स स्ट्रीक",
      "detox.desc": "झोपण्यापूर्वी १ तास फोन न वापरण्याचा संकल्प करा.",
      "detox.btn": "आजचा दिवस नोंदवा",
      "faq.title": "वारंवार विचारले जाणारे प्रश्न",
      "faq.desc": "गोपनीयता आणि AI गुणांबद्दलची माहिती.",
      "helpline.fab": "मदत हवी आहे?",
      "helpline.modal.title": "२४/७ सत्यापित विद्यार्थी हेल्पलाइन",
      "disclaimer.text": "सूचना: मन संतुलन हे एक शैक्षणिक साधन असून कोणताही वैद्यकीय सल्ला नाही. तीव्र नैराश्य असल्यास कृपया वैद्यकीय तज्ज्ञांचा सल्ला घ्या."
    }
  };

  const AFFIRMATIONS = {
    en: [
      "Your worth is not defined by academic productivity or notification counts.",
      "Taking rest is not giving up; it is recharging for the journey ahead.",
      "One mindful breath at a time brings you back to your center.",
      "You are allowed to unplug and be at peace in your own space.",
      "Progress is rarely linear. Celebrate showing up today."
    ],
    hi: [
      "आपकी योग्यता केवल परीक्षा के अंकों या फ़ोन नोटिफिकेशन से तय नहीं होती।",
      "विश्राम लेना कमजोरी नहीं, बल्कि आगे बढ़ने की तैयारी है।",
      "एक गहरी और शांत सांस आपको तनावमुक्त कर सकती है।",
      "खुद को स्क्रीन से दूर रखकर मानसिक शांति पाना आपका अधिकार है।",
      "सफलता धीरे-धीरे मिलती है, आज के अपने प्रयास पर गर्व करें।"
    ],
    mr: [
      "तुमची किंमत फक्त परीक्षेचे गुण किंवा फोनचे नोटिफिकेशन ठरवत नाहीत.",
      "विश्रांती घेणे म्हणजे माघार नव्हे, तर पुढील प्रवासाची तयारी आहे.",
      "एक शांत दीर्घ श्वास तुम्हाला तणावमुक्त करू शकतो.",
      "काही वेळ स्क्रीनपासून दूर राहून शांतता मिळवणे तुमचा हक्क आहे.",
      "प्रगती हळूहळू होते. आजच्या प्रयत्नांवर विश्वास ठेवा."
    ]
  };

  let currentLang = localStorage.getItem("mansantulan_lang") || "en";

  function getTranslation(key) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  function applyLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = "en";
    currentLang = lang;
    localStorage.setItem("mansantulan_lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = getTranslation(key);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        if (el.hasAttribute("placeholder")) {
          el.setAttribute("placeholder", translation);
        }
      } else {
        el.textContent = translation;
      }
    });

    // Update document language tag
    document.documentElement.lang = lang;

    // Dispatch event for components that need custom rerendering
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
  }

  function getRandomAffirmation() {
    const list = AFFIRMATIONS[currentLang] || AFFIRMATIONS.en;
    return list[Math.floor(Math.random() * list.length)];
  }

  // Expose to window
  window.ManSantulani18n = {
    t: getTranslation,
    setLanguage: applyLanguage,
    getLanguage: () => currentLang,
    getRandomAffirmation,
    translations: TRANSLATIONS
  };

  // Initial load
  document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);
  });
})();
