import { useContext, useEffect } from 'react';
import { LanguageContext } from '@/App';

// Expanded language support
export const supportedLanguages = [
  { code: 'en-IN', name: 'English', nativeName: 'English' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur-IN', name: 'Urdu', nativeName: 'اردو' },
  { code: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
];

// Get user's browser language and find the closest match
export function detectUserLanguage(): string {
  const browserLang = navigator.language || 'en-IN';
  
  // First try for exact match
  const exactMatch = supportedLanguages.find(lang => lang.code === browserLang);
  if (exactMatch) return exactMatch.code;
  
  // Then try for language part match (e.g., 'hi' from 'hi-IN')
  const langPart = browserLang.split('-')[0];
  const partialMatch = supportedLanguages.find(lang => lang.code.startsWith(langPart + '-'));
  if (partialMatch) return partialMatch.code;
  
  // Default to English
  return 'en-IN';
}

// Comprehensive translation system
export const translations: Record<string, Record<string, string>> = {
  'en-IN': {
    // General UI
    appName: 'SaarthiAI',
    appTagline: 'Your Digital Assistant',
    welcome: 'Welcome!',
    namaste: 'Namaste!',
    getStarted: 'Get Started',
    
    // Conversational Mode
    conversationalModeTitle: 'Conversational Mode',
    conversationalModeDescription: 'Try our new voice-based conversational interface to submit your information without filling forms.',
    tryConversationalMode: 'Try Conversational Mode',
    
    // User info form
    tellAboutYourself: 'Tell us about yourself',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    state: 'State',
    sector: 'Sector',
    selectState: 'Select your state',
    selectSector: 'Select sector of interest',
    describeNeeds: 'Describe your needs (Optional)',
    speakNow: 'Speak Now',
    listening: 'Listening...',
    typeNeeds: 'Type your needs or issues here...',
    findSchemes: 'Find Schemes',
    
    // Results
    recommendedSchemes: 'Recommended Schemes',
    back: 'Back',
    moreInfo: 'More Info',
    applyNow: 'Apply Now',
    callHelpline: 'Call Helpline',
    fileGrievance: 'File a Grievance',
    generateTemplate: 'Generate Grievance Template',
    aiSuggestion: 'AI Suggestion',
    showMore: 'Show more suggestions',
    hideMore: 'Hide suggestions',
    eligibility: 'Eligibility:',
    benefits: 'Benefits:',
    
    // New additions
    detailedInformation: 'Detailed Information',
    aiSuggestionTab: 'AI Suggestion',
    additionalDetailsTab: 'Additional Details',
    fetchingInfo: 'Fetching latest information...',
    fetchInfo: 'Get Latest Info',
    noSchemesFound: 'No schemes found matching your criteria. Please try adjusting your search parameters.',
    documentTitle: 'SaarthiAI - Your Government Scheme Assistant',
    documentDescription: 'SaarthiAI is a multilingual voice-based assistant that helps Indian citizens discover and apply for government schemes and file grievances.',
    callHelplineLabel: 'Call Helpline',
    emailSupportLabel: 'Email Support',
    onlinePortalLabel: 'Online Portal',
    speechNotSupported: 'Speech recognition is not supported in your browser',
    basedOnProfile: 'Based on your profile, we\'ve found schemes that may be relevant for you.',
    clickToFetch: 'Click the tab to fetch the latest information about this scheme',
    poweredBy: 'Information updated via AI',
    documentList: 'For faster processing, I recommend keeping the following documents ready:',
    grievanceHeader: 'Grievance Template',
    copyTemplate: 'Copy Template',
    downloadAsText: 'Download as Text',
    copied: 'Copied!',
    requiredDocuments: 'Required Documents:',
    nextStepsLabel: 'Next Steps:',
    tooltipZoomIn: 'Increase Font Size',
    tooltipZoomOut: 'Decrease Font Size',
    tooltipReadAloud: 'Read Aloud',
    accessibilityOptions: 'Accessibility Options',
    darkModeToggle: 'Toggle Dark Mode',
    lightModeToggle: 'Toggle Light Mode',
    errorFetchingData: 'Error fetching data. Please try again.',
    tryAgain: 'Try Again'
  },
  'hi-IN': {
    appName: 'साथीऐआई',
    appTagline: 'आपका डिजिटल साथी',
    welcome: 'नमस्कार!',
    namaste: 'नमस्ते!',
    getStarted: 'शुरू करें',
    
    // Conversational Mode
    conversationalModeTitle: 'वार्तालाप मोड',
    conversationalModeDescription: 'फॉर्म भरने के बिना अपनी जानकारी सबमिट करने के लिए हमारे नए आवाज-आधारित वार्तालाप इंटरफेस का प्रयास करें।',
    tryConversationalMode: 'वार्तालाप मोड आजमाएं',
    tellAboutYourself: 'अपने बारे में बताएं',
    age: 'उम्र',
    gender: 'लिंग',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    state: 'राज्य',
    sector: 'क्षेत्र',
    selectState: 'अपना राज्य चुनें',
    selectSector: 'रुचि का क्षेत्र चुनें',
    describeNeeds: 'अपनी जरूरतों का वर्णन करें (वैकल्पिक)',
    speakNow: 'अब बोलें',
    listening: 'सुन रहा हूँ...',
    typeNeeds: 'यहां अपनी जरूरतों या समस्याओं को लिखें...',
    findSchemes: 'योजनाएँ खोजें',
    recommendedSchemes: 'अनुशंसित योजनाएँ',
    back: 'वापस',
    moreInfo: 'अधिक जानकारी',
    applyNow: 'अभी आवेदन करें',
    callHelpline: 'हेल्पलाइन पर कॉल करें',
    fileGrievance: 'शिकायत दर्ज करें',
    generateTemplate: 'शिकायत टेम्पलेट जनरेट करें',
    aiSuggestion: 'AI सुझाव',
    showMore: 'और सुझाव दिखाएं',
    hideMore: 'सुझाव छिपाएं',
    eligibility: 'योग्यता:',
    benefits: 'लाभ:',
    
    // New additions
    detailedInformation: 'विस्तृत जानकारी',
    aiSuggestionTab: 'AI सुझाव',
    additionalDetailsTab: 'अतिरिक्त विवरण',
    fetchingInfo: 'नवीनतम जानकारी प्राप्त कर रहे हैं...',
    fetchInfo: 'नवीनतम जानकारी प्राप्त करें',
    noSchemesFound: 'आपके मानदंडों से मेल खाती कोई योजना नहीं मिली। कृपया अपने खोज पैरामीटर समायोजित करें।',
    documentTitle: 'साथीऐआई - आपका सरकारी योजना सहायक',
    documentDescription: 'साथीऐआई एक बहुभाषी आवाज-आधारित सहायक है जो भारतीय नागरिकों को सरकारी योजनाओं का पता लगाने और शिकायतें दर्ज करने में मदद करता है।',
    callHelplineLabel: 'हेल्पलाइन पर कॉल करें',
    emailSupportLabel: 'ईमेल सपोर्ट',
    onlinePortalLabel: 'ऑनलाइन पोर्टल',
    speechNotSupported: 'आपके ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है',
    basedOnProfile: 'आपकी प्रोफ़ाइल के आधार पर, हमने ऐसी योजनाएँ पाई हैं जो आपके लिए प्रासंगिक हो सकती हैं।',
    clickToFetch: 'इस योजना के बारे में नवीनतम जानकारी प्राप्त करने के लिए टैब पर क्लिक करें',
    poweredBy: 'AI के माध्यम से अपडेट की गई जानकारी',
    documentList: 'तेज़ प्रोसेसिंग के लिए, मैं निम्नलिखित दस्तावेज़ तैयार रखने की सलाह देता हूँ:',
    grievanceHeader: 'शिकायत टेम्पलेट',
    copyTemplate: 'टेम्पलेट कॉपी करें',
    downloadAsText: 'टेक्स्ट के रूप में डाउनलोड करें',
    copied: 'कॉपी किया गया!',
    requiredDocuments: 'आवश्यक दस्तावेज़:',
    nextStepsLabel: 'अगले कदम:',
    tooltipZoomIn: 'फ़ॉन्ट आकार बढ़ाएँ',
    tooltipZoomOut: 'फ़ॉन्ट आकार घटाएँ',
    tooltipReadAloud: 'ज़ोर से पढ़ें',
    accessibilityOptions: 'सुलभता विकल्प',
    darkModeToggle: 'डार्क मोड टॉगल करें',
    lightModeToggle: 'लाइट मोड टॉगल करें',
    errorFetchingData: 'डेटा प्राप्त करने में त्रुटि। कृपया पुनः प्रयास करें।',
    tryAgain: 'पुनः प्रयास करें'
  },
  'kn-IN': {
    appName: 'ಸಾಥಿಐಐ',
    appTagline: 'ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸಹಾಯಕ',
    welcome: 'ಸ್ವಾಗತ!',
    namaste: 'ನಮಸ್ಕಾರ!',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    tellAboutYourself: 'ನಿಮ್ಮ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ',
    age: 'ವಯಸ್ಸು',
    gender: 'ಲಿಂಗ',
    male: 'ಪುರುಷ',
    female: 'ಮಹಿಳೆ',
    other: 'ಇತರೆ',
    state: 'ರಾಜ್ಯ',
    sector: 'ವಲಯ',
    selectState: 'ನಿಮ್ಮ ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    selectSector: 'ಆಸಕ್ತಿಯ ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    describeNeeds: 'ನಿಮ್ಮ ಅಗತ್ಯಗಳನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ)',
    speakNow: 'ಈಗ ಮಾತನಾಡಿ',
    listening: 'ಕೇಳುತ್ತಿದ್ದೇನೆ...',
    typeNeeds: 'ನಿಮ್ಮ ಅಗತ್ಯಗಳು ಅಥವಾ ಸಮಸ್ಯೆಗಳನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...',
    findSchemes: 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',
    recommendedSchemes: 'ಶಿಫಾರಸು ಮಾಡಿದ ಯೋಜನೆಗಳು',
    back: 'ಹಿಂದೆ',
    moreInfo: 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ',
    applyNow: 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    callHelpline: 'ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ',
    fileGrievance: 'ದೂರನ್ನು ಸಲ್ಲಿಸಿ',
    generateTemplate: 'ದೂರು ಟೆಂಪ್ಲೇಟ್ ರಚಿಸಿ',
    aiSuggestion: 'AI ಸಲಹೆ',
    showMore: 'ಹೆಚ್ಚಿನ ಸಲಹೆಗಳನ್ನು ತೋರಿಸಿ',
    hideMore: 'ಸಲಹೆಗಳನ್ನು ಮರೆಮಾಡಿ',
    eligibility: 'ಅರ್ಹತೆ:',
    benefits: 'ಪ್ರಯೋಜನಗಳು:',
    
    // New additions
    detailedInformation: 'ವಿವರವಾದ ಮಾಹಿತಿ',
    aiSuggestionTab: 'AI ಸಲಹೆ',
    additionalDetailsTab: 'ಹೆಚ್ಚುವರಿ ವಿವರಗಳು',
    fetchingInfo: 'ಇತ್ತೀಚಿನ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯುತ್ತಿದ್ದೇವೆ...',
    fetchInfo: 'ಇತ್ತೀಚಿನ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಿರಿ',
    noSchemesFound: 'ನಿಮ್ಮ ಮಾನದಂಡಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹುಡುಕಾಟ ಪ್ಯಾರಾಮೀಟರ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ.',
    documentTitle: 'ಸಾಥಿಐಐ - ನಿಮ್ಮ ಸರ್ಕಾರಿ ಯೋಜನೆ ಸಹಾಯಕ',
    documentDescription: 'ಸಾಥಿಐಐ ಒಂದು ಬಹುಭಾಷಾ ಧ್ವನಿ-ಆಧಾರಿತ ಸಹಾಯಕವಾಗಿದ್ದು, ಭಾರತೀಯ ನಾಗರಿಕರು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯಲು ಮತ್ತು ದೂರುಗಳನ್ನು ಸಲ್ಲಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    callHelplineLabel: 'ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ',
    emailSupportLabel: 'ಇಮೇಲ್ ಬೆಂಬಲ',
    onlinePortalLabel: 'ಆನ್‌ಲೈನ್ ಪೋರ್ಟಲ್',
    speechNotSupported: 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ',
    basedOnProfile: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಆಧಾರದ ಮೇಲೆ, ನಿಮಗೆ ಸಂಬಂಧಿಸಿದ ಯೋಜನೆಗಳನ್ನು ನಾವು ಕಂಡುಹಿಡಿದಿದ್ದೇವೆ.',
    clickToFetch: 'ಈ ಯೋಜನೆಯ ಬಗ್ಗೆ ಇತ್ತೀಚಿನ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಟ್ಯಾಬ್ ಕ್ಲಿಕ್ ಮಾಡಿ',
    poweredBy: 'AI ಮೂಲಕ ನವೀಕರಿಸಲಾದ ಮಾಹಿತಿ',
    documentList: 'ವೇಗವಾದ ಪ್ರಕ್ರಿಯೆಗಾಗಿ, ಈ ಕೆಳಗಿನ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧವಾಗಿರಿಸಿಕೊಳ್ಳಲು ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ:',
    grievanceHeader: 'ದೂರು ಟೆಂಪ್ಲೇಟ್',
    copyTemplate: 'ಟೆಂಪ್ಲೇಟ್ ನಕಲಿಸಿ',
    downloadAsText: 'ಪಠ್ಯವಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    copied: 'ನಕಲಿಸಲಾಗಿದೆ!',
    requiredDocuments: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು:',
    nextStepsLabel: 'ಮುಂದಿನ ಹಂತಗಳು:',
    tooltipZoomIn: 'ಫಾಂಟ್ ಗಾತ್ರ ಹೆಚ್ಚಿಸಿ',
    tooltipZoomOut: 'ಫಾಂಟ್ ಗಾತ್ರ ಕಡಿಮೆ ಮಾಡಿ',
    tooltipReadAloud: 'ಜೋರಾಗಿ ಓದಿ',
    accessibilityOptions: 'ಪ್ರವೇಶಿಸುವಿಕೆ ಆಯ್ಕೆಗಳು',
    darkModeToggle: 'ಡಾರ್ಕ್ ಮೋಡ್ ಟಾಗಲ್ ಮಾಡಿ',
    lightModeToggle: 'ಲೈಟ್ ಮೋಡ್ ಟಾಗಲ್ ಮಾಡಿ',
    errorFetchingData: 'ಡೇಟಾ ಪಡೆಯುವಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ'
  },
  'ta-IN': {
    appName: 'சார்தி ஏஐ',
    appTagline: 'உங்கள் டிஜிட்டல் உதவியாளர்',
    welcome: 'வரவேற்கிறோம்!',
    namaste: 'வணக்கம்!',
    getStarted: 'தொடங்குங்கள்',
    
    // Conversational Mode
    conversationalModeTitle: 'உரையாடல் முறை',
    conversationalModeDescription: 'படிவங்களை நிரப்பாமல் உங்கள் தகவலை சமர்ப்பிக்க எங்கள் புதிய குரல் அடிப்படையிலான உரையாடல் இடைமுகத்தை முயற்சிக்கவும்.',
    tryConversationalMode: 'உரையாடல் முறையை முயற்சிக்கவும்',
    
    // Basic translations for the conversational interface
    tellAboutYourself: 'உங்களைப் பற்றி எங்களுக்குச் சொல்லுங்கள்',
    speakNow: 'இப்போது பேசுங்கள்',
    listening: 'கேட்கிறேன்...',
    typeHere: 'இங்கே தட்டச்சு செய்யவும்...',
    submit: 'சமர்ப்பிக்கவும்',
    tryAgain: 'மீண்டும் முயற்சிக்கவும்'
  },
  'te-IN': {
    appName: 'సార్తి ఎఐ',
    appTagline: 'మీ డిజిటల్ సహాయకుడు',
    welcome: 'స్వాగతం!',
    namaste: 'నమస్కారం!',
    getStarted: 'ప్రారంభించండి',
    
    // Conversational Mode
    conversationalModeTitle: 'సంభాషణ మోడ్',
    conversationalModeDescription: 'ఫారమ్‌లను నింపకుండా మీ సమాచారాన్ని సమర్పించడానికి మా కొత్త వాయిస్-ఆధారిత సంభాషణ ఇంటర్‌ఫేస్‌ను ప్రయత్నించండి.',
    tryConversationalMode: 'సంభాషణ మోడ్‌ను ప్రయత్నించండి',
    
    // Basic translations for the conversational interface
    tellAboutYourself: 'మీ గురించి మాకు చెప్పండి',
    speakNow: 'ఇప్పుడు మాట్లాడండి',
    listening: 'వింటున్నాను...',
    typeHere: 'ఇక్కడ టైప్ చేయండి...',
    submit: 'సమర్పించండి',
    tryAgain: 'మళ్లీ ప్రయత్నించండి'
  },
  'bn-IN': {
    appName: 'সার্থি এআই',
    appTagline: 'আপনার ডিজিটাল সহায়ক',
    welcome: 'স্বাগতম!',
    namaste: 'নমস্কার!',
    getStarted: 'শুরু করুন',
    
    // Conversational Mode
    conversationalModeTitle: 'কথোপকথন মোড',
    conversationalModeDescription: 'ফর্ম পূরণ না করে আপনার তথ্য জমা দিতে আমাদের নতুন ভয়েস-ভিত্তিক কথোপকথন ইন্টারফেস ব্যবহার করুন।',
    tryConversationalMode: 'কথোপকথন মোড ব্যবহার করুন',
    
    // Basic translations for the conversational interface
    tellAboutYourself: 'আপনার সম্পর্কে আমাদের বলুন',
    speakNow: 'এখন বলুন',
    listening: 'শুনছি...',
    typeHere: 'এখানে টাইপ করুন...',
    submit: 'জমা দিন',
    tryAgain: 'আবার চেষ্টা করুন'
  },
  // More languages can be easily added following the same pattern
};

// Function to get translation
export function getTranslation(key: string, lang: string = 'en-IN'): string {
  // Default to English if language not supported or key not found
  if (!translations[lang] || !translations[lang][key]) {
    return translations['en-IN'][key] || key;
  }
  return translations[lang][key];
}

// Ensure language storage for persistence
export function saveLanguagePreference(lang: string): void {
  try {
    localStorage.setItem('saarthiai-language', lang);
  } catch (error) {
    console.error('Error saving language preference:', error);
  }
}

export function loadLanguagePreference(): string | null {
  try {
    return localStorage.getItem('saarthiai-language');
  } catch (error) {
    console.error('Error loading language preference:', error);
    return null;
  }
}

// Hook to initialize language
export function useLanguageInitialization() {
  const { setLanguage } = useContext(LanguageContext);
  
  useEffect(() => {
    // Try to load from storage first
    const savedLang = loadLanguagePreference();
    if (savedLang) {
      setLanguage(savedLang);
      return;
    }
    
    // Fall back to browser detection
    const detectedLang = detectUserLanguage();
    setLanguage(detectedLang);
    saveLanguagePreference(detectedLang);
  }, [setLanguage]);
}

// Update document metadata for the current language
export function updateDocumentMetadata(lang: string): void {
  // Update document title
  document.title = getTranslation('documentTitle', lang);
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', getTranslation('documentDescription', lang));
  }
  
  // Update Open Graph tags if they exist
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  
  if (ogTitle) {
    ogTitle.setAttribute('content', getTranslation('documentTitle', lang));
  }
  
  if (ogDescription) {
    ogDescription.setAttribute('content', getTranslation('documentDescription', lang));
  }
  
  // Set document language
  document.documentElement.lang = lang.split('-')[0]; // e.g., 'en-IN' -> 'en'
}