import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, MicOff, Send, RefreshCw, 
  VolumeX, Volume2, CheckCircle, 
  ChevronRight, Loader2, Globe
} from 'lucide-react';
import { LanguageContext, SpeechContext } from '@/App';
import { getTranslation, supportedLanguages } from '@/lib/languageSystem';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define the UserData interface for collected information
interface UserData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

// Define conversation step type to track where we are in the flow
type ConversationStep = 'intro' | 'name' | 'phone' | 'email' | 'message' | 'confirm' | 'complete';

// Define translations for our conversational interface
const conversationTranslations = {
  'en-IN': {
    intro: "Hi there! I'm here to help you submit your information. You can speak or type your answers. Let's start with your name.",
    askName: "What is your name?",
    askPhone: "Great! Now, what's your phone number?",
    askEmail: "Thanks! What's your email address?",
    askMessage: "Almost done! Please share a brief message about what you need help with.",
    confirm: "Here's what I've collected. Is this correct?",
    complete: "Thank you! Your information has been submitted successfully.",
    speakNow: "Speak now",
    startOver: "Start over",
    edit: "Edit",
    submit: "Submit",
    listening: "Listening...",
    typeHere: "Type here...",
    nameLabel: "Name",
    phoneLabel: "Phone",
    emailLabel: "Email",
    messageLabel: "Message",
    yes: "Yes, submit",
    no: "No, edit",
    changeLanguage: "Change language",
    invalidPhone: "Please enter a valid 10-digit phone number",
    invalidEmail: "Please enter a valid email address",
    tryAgain: "Let's try again",
    tapToSpeak: "Tap to speak"
  },
  'hi-IN': {
    intro: "नमस्ते! मैं आपकी जानकारी जमा करने में मदद करने के लिए यहां हूं। आप अपने उत्तर बोल या टाइप कर सकते हैं। आइए आपके नाम से शुरू करें।",
    askName: "आपका नाम क्या है?",
    askPhone: "बहुत अच्छा! अब, आपका फ़ोन नंबर क्या है?",
    askEmail: "धन्यवाद! आपका ईमेल पता क्या है?",
    askMessage: "लगभग हो गया! कृपया संक्षेप में बताएं कि आपको किस विषय में मदद चाहिए।",
    confirm: "यहां वह जानकारी है जो मैंने एकत्र की है। क्या यह सही है?",
    complete: "धन्यवाद! आपकी जानकारी सफलतापूर्वक जमा कर दी गई है।",
    speakNow: "अब बोलें",
    startOver: "फिर से शुरू करें",
    edit: "संपादित करें",
    submit: "जमा करें",
    listening: "सुन रहा हूँ...",
    typeHere: "यहां टाइप करें...",
    nameLabel: "नाम",
    phoneLabel: "फोन",
    emailLabel: "ईमेल",
    messageLabel: "संदेश",
    yes: "हां, जमा करें",
    no: "नहीं, संपादित करें",
    changeLanguage: "भाषा बदलें",
    invalidPhone: "कृपया एक वैध 10-अंकों का फोन नंबर दर्ज करें",
    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
    tryAgain: "फिर से प्रयास करें",
    tapToSpeak: "बोलने के लिए टैप करें"
  },
  'ta-IN': {
    intro: "வணக்கம்! உங்கள் தகவலை சமர்ப்பிக்க உதவ நான் இங்கே இருக்கிறேன். நீங்கள் பேசலாம் அல்லது உங்கள் பதில்களை தட்டச்சு செய்யலாம். உங்கள் பெயரில் தொடங்குவோம்.",
    askName: "உங்கள் பெயர் என்ன?",
    askPhone: "நன்று! இப்போது, உங்கள் தொலைபேசி எண் என்ன?",
    askEmail: "நன்றி! உங்கள் மின்னஞ்சல் முகவரி என்ன?",
    askMessage: "கிட்டத்தட்ட முடிந்தது! உங்களுக்கு எந்த விஷயத்தில் உதவி தேவை என்பதைப் பற்றிய சிறிய செய்தியைப் பகிரவும்.",
    confirm: "நான் சேகரித்த தகவல் இதோ. இது சரியா?",
    complete: "நன்றி! உங்கள் தகவல் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.",
    speakNow: "இப்போது பேசுங்கள்",
    startOver: "மீண்டும் தொடங்கவும்",
    edit: "திருத்து",
    submit: "சமர்ப்பி",
    listening: "கேட்கிறேன்...",
    typeHere: "இங்கே தட்டச்சு செய்யவும்...",
    nameLabel: "பெயர்",
    phoneLabel: "தொலைபேசி",
    emailLabel: "மின்னஞ்சல்",
    messageLabel: "செய்தி",
    yes: "ஆம், சமர்ப்பிக்கவும்",
    no: "இல்லை, திருத்தவும்",
    changeLanguage: "மொழியை மாற்றவும்",
    invalidPhone: "சரியான 10-இலக்க தொலைபேசி எண்ணை உள்ளிடவும்",
    invalidEmail: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்",
    tryAgain: "மீண்டும் முயற்சி செய்யுங்கள்",
    tapToSpeak: "பேச தட்டவும்"
  },
  'te-IN': {
    intro: "నమస్కారం! మీ సమాచారాన్ని సమర్పించడంలో సహాయపడటానికి నేను ఇక్కడ ఉన్నాను. మీరు మీ సమాధానాలను మాట్లాడవచ్చు లేదా టైప్ చేయవచ్చు. మీ పేరుతో ప్రారంభిద్దాం.",
    askName: "మీ పేరు ఏమిటి?",
    askPhone: "చాలా బాగుంది! ఇప్పుడు, మీ ఫోన్ నంబర్ ఏమిటి?",
    askEmail: "ధన్యవాదాలు! మీ ఇమెయిల్ చిరునామా ఏమిటి?",
    askMessage: "దాదాపు పూర్తయింది! మీకు ఏ విషయంలో సహాయం కావాలో కుదించి చెప్పండి.",
    confirm: "నేను సేకరించిన సమాచారం ఇదిగో. ఇది సరియైనదేనా?",
    complete: "ధన్యవాదాలు! మీ సమాచారం విజయవంతంగా సమర్పించబడింది.",
    speakNow: "ఇప్పుడు మాట్లాడండి",
    startOver: "మళ్ళీ ప్రారంభించండి",
    edit: "సవరించు",
    submit: "సమర్పించు",
    listening: "వింటున్నాను...",
    typeHere: "ఇక్కడ టైప్ చేయండి...",
    nameLabel: "పేరు",
    phoneLabel: "ఫోన్",
    emailLabel: "ఇమెయిల్",
    messageLabel: "సందేశం",
    yes: "అవును, సమర్పించు",
    no: "కాదు, సవరించు",
    changeLanguage: "భాష మార్చు",
    invalidPhone: "దయచేసి చెల్లుబాటు అయ్యే 10-అంకెల ఫోన్ నంబర్‌ను నమోదు చేయండి",
    invalidEmail: "దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామాను నమోదు చేయండి",
    tryAgain: "మళ్లీ ప్రయత్నించండి",
    tapToSpeak: "మాట్లాడటానికి నొక్కండి"
  },
  'bn-IN': {
    intro: "হ্যালো! আমি আপনার তথ্য জমা দিতে সাহায্য করতে এখানে আছি। আপনি আপনার উত্তরগুলি বলতে বা টাইপ করতে পারেন। আসুন আপনার নাম দিয়ে শুরু করি।",
    askName: "আপনার নাম কী?",
    askPhone: "দারুণ! এখন, আপনার ফোন নম্বর কী?",
    askEmail: "ধন্যবাদ! আপনার ইমেইল ঠিকানা কী?",
    askMessage: "প্রায় শেষ! আপনি কোন বিষয়ে সাহায্য চান তা সংক্ষেপে জানান।",
    confirm: "এই তথ্যগুলি আমি সংগ্রহ করেছি। এটা কি সঠিক?",
    complete: "ধন্যবাদ! আপনার তথ্য সফলভাবে জমা দেওয়া হয়েছে।",
    speakNow: "এখন বলুন",
    startOver: "আবার শুরু করুন",
    edit: "সম্পাদনা করুন",
    submit: "জমা দিন",
    listening: "শুনছি...",
    typeHere: "এখানে টাইপ করুন...",
    nameLabel: "নাম",
    phoneLabel: "ফোন",
    emailLabel: "ইমেইল",
    messageLabel: "বার্তা",
    yes: "হ্যাঁ, জমা দিন",
    no: "না, সম্পাদনা করুন",
    changeLanguage: "ভাষা পরিবর্তন করুন",
    invalidPhone: "অনুগ্রহ করে একটি বৈধ 10-ডিজিটের ফোন নম্বর লিখুন",
    invalidEmail: "অনুগ্রহ করে একটি বৈধ ইমেল ঠিকানা লিখুন",
    tryAgain: "আবার চেষ্টা করুন",
    tapToSpeak: "কথা বলতে ট্যাপ করুন"
  }
};

// More languages can be added...

export default function ConversationalForm() {
  // Context hooks
  const { language, setLanguage } = useContext(LanguageContext);
  const { isSpeaking, startSpeaking, stopSpeaking, isListening, startListening, stopListening } = useContext(SpeechContext);
  
  // State management
  const [step, setStep] = useState<ConversationStep>('intro');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  
  const [currentInput, setCurrentInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  
  // Translations helper function - fallback to English if language not supported
  const getConversationText = (key: keyof typeof conversationTranslations['en-IN']) => {
    const currentLanguage = language as keyof typeof conversationTranslations;
    if (conversationTranslations[currentLanguage] && conversationTranslations[currentLanguage][key]) {
      return conversationTranslations[currentLanguage][key];
    }
    return conversationTranslations['en-IN'][key];
  };
  
  // Validation functions
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handle user input submission
  const handleSubmit = () => {
    setIsThinking(true);
    setError(null);
    
    // Trim input
    const trimmedInput = currentInput.trim();
    
    if (!trimmedInput) {
      setIsThinking(false);
      return;
    }
    
    // Process input based on current step
    switch(step) {
      case 'intro':
        setStep('name');
        break;
        
      case 'name':
        if (trimmedInput.length > 1) {
          setUserData({...userData, name: trimmedInput});
          setStep('phone');
          speakPrompt('askPhone');
        }
        break;
        
      case 'phone':
        const phoneNumber = trimmedInput.replace(/\D/g, '');
        if (validatePhone(phoneNumber)) {
          setUserData({...userData, phone: phoneNumber});
          setStep('email');
          speakPrompt('askEmail');
        } else {
          setError(getConversationText('invalidPhone'));
        }
        break;
        
      case 'email':
        if (validateEmail(trimmedInput)) {
          setUserData({...userData, email: trimmedInput});
          setStep('message');
          speakPrompt('askMessage');
        } else {
          setError(getConversationText('invalidEmail'));
        }
        break;
        
      case 'message':
        setUserData({...userData, message: trimmedInput});
        setStep('confirm');
        speakPrompt('confirm');
        break;
        
      case 'confirm':
        // Check if the response is affirmative
        const affirmativeWords = ['yes', 'yeah', 'sure', 'ok', 'okay', 'confirm', 'submit', 
                                 'हां', 'हाँ', 'जी हां', 'ठीक है', 'हो', 'सही', 'बिलकुल', 
                                 'ஆம்', 'சரி', 'ஓகே', 'ஆமாம்',
                                 'అవును', 'సరే', 'ఓకే',
                                 'হ্যাঁ', 'ঠিক আছে', 'অবশ্যই'];
        
        const isAffirmative = affirmativeWords.some(word => 
          trimmedInput.toLowerCase().includes(word.toLowerCase())
        );
        
        if (isAffirmative) {
          handleFormSubmission();
        } else {
          // Go back to name step to edit
          setStep('name');
          speakPrompt('askName');
        }
        break;
    }
    
    setCurrentInput('');
    setIsThinking(false);
  };
  
  // Handle final form submission
  const handleFormSubmission = () => {
    setIsThinking(true);
    
    // Simulate API call to submit data
    setTimeout(() => {
      setStep('complete');
      setFormSubmitted(true);
      setIsThinking(false);
      speakPrompt('complete');
    }, 1500);
  };
  
  // Speech functions
  const speakPrompt = (promptKey: keyof typeof conversationTranslations['en-IN']) => {
    if (isSpeaking) {
      stopSpeaking();
    }
    
    const textToSpeak = getConversationText(promptKey);
    startSpeaking(textToSpeak);
  };
  
  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      return;
    }
    
    setCurrentInput('');
    
    startListening((text, isFinal) => {
      setCurrentInput(text);
      if (isFinal && autoAdvance) {
        // Slight delay to allow user to see what was recognized
        setTimeout(() => handleSubmit(), 500);
      }
    });
  };
  
  // Restart the conversation
  const handleRestart = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    if (isListening) {
      stopListening();
    }
    
    setStep('intro');
    setUserData({
      name: '',
      phone: '',
      email: '',
      message: ''
    });
    setCurrentInput('');
    setError(null);
    setFormSubmitted(false);
    
    // Speak the intro again
    setTimeout(() => {
      speakPrompt('intro');
    }, 300);
  };
  
  // Auto-scroll chat to bottom when new messages appear
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step, error]);
  
  // Initial greeting when component mounts
  useEffect(() => {
    setTimeout(() => {
      speakPrompt('intro');
    }, 500);
  }, []);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stopSpeaking();
      }
      if (isListening) {
        stopListening();
      }
    };
  }, [isSpeaking, isListening]);
  
  // Language change handler
  const handleLanguageChange = (newLang: string) => {
    // Stop any ongoing speech or listening
    if (isSpeaking) {
      stopSpeaking();
    }
    if (isListening) {
      stopListening();
    }
    
    // Set the new language
    setLanguage(newLang);
    
    // Update speech recognition language
    import('@/lib/speechServices').then(({ speechRecognition }) => {
      speechRecognition.setLanguage(newLang);
    });
    
    // Speak the current prompt in the new language after a short delay
    setTimeout(() => {
      if (step === 'intro') speakPrompt('intro');
      else if (step === 'name') speakPrompt('askName');
      else if (step === 'phone') speakPrompt('askPhone');
      else if (step === 'email') speakPrompt('askEmail');
      else if (step === 'message') speakPrompt('askMessage');
      else if (step === 'confirm') speakPrompt('confirm');
      else if (step === 'complete') speakPrompt('complete');
    }, 300);
  };
  
  // Get current prompt based on step
  const getCurrentPrompt = () => {
    switch(step) {
      case 'intro': return getConversationText('intro');
      case 'name': return getConversationText('askName');
      case 'phone': return getConversationText('askPhone');
      case 'email': return getConversationText('askEmail');
      case 'message': return getConversationText('askMessage');
      case 'confirm': return getConversationText('confirm');
      case 'complete': return getConversationText('complete');
      default: return '';
    }
  };
  
  // Render system message bubble
  const renderSystemMessage = (text: string) => (
    <div className="flex items-start mb-4">
      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[85%]">
        <p>{text}</p>
      </div>
    </div>
  );
  
  // Render user message bubble
  const renderUserMessage = (field: keyof UserData, value: string) => {
    if (!value) return null;
    
    return (
      <div className="flex flex-row-reverse items-start mb-4">
        <div className="bg-secondary text-secondary-foreground rounded-lg p-3 max-w-[85%]">
          <p className="text-xs opacity-70">{getConversationText(`${field}Label` as any)}</p>
          <p className="font-medium">{value}</p>
        </div>
      </div>
    );
  };
  
  // Render confirmation summary
  const renderConfirmationSummary = () => (
    <div className="border rounded-lg p-4 mb-4 bg-neutral-light dark:bg-neutral">
      <h3 className="font-medium mb-2">{getConversationText('confirm')}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs opacity-70">{getConversationText('nameLabel')}</p>
          <p>{userData.name}</p>
        </div>
        <div>
          <p className="text-xs opacity-70">{getConversationText('phoneLabel')}</p>
          <p>{userData.phone}</p>
        </div>
        <div>
          <p className="text-xs opacity-70">{getConversationText('emailLabel')}</p>
          <p>{userData.email}</p>
        </div>
        <div>
          <p className="text-xs opacity-70">{getConversationText('messageLabel')}</p>
          <p>{userData.message}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={() => handleFormSubmission()}
          className="flex items-center gap-2"
        >
          {getConversationText('yes')}
          <CheckCircle className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            setStep('name');
            speakPrompt('askName');
          }}
          className="flex items-center gap-2"
        >
          {getConversationText('no')}
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="overflow-hidden">
        <div className="bg-primary p-3 flex justify-between items-center">
          <h2 className="text-lg font-medium text-primary-foreground">
            {getTranslation('appName', language)}
          </h2>
          
          <div className="flex gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary-foreground">
                  <Globe className="h-4 w-4 mr-1" />
                  {supportedLanguages.find(lang => lang.code === language)?.nativeName || 'English'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {supportedLanguages.map(lang => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="ml-2 text-muted-foreground text-xs">({lang.name})</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Reset Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleRestart}
                    className="text-primary-foreground"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">{getConversationText('startOver')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getConversationText('startOver')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <CardContent className="p-0">
          {/* Conversation Area */}
          <div className="p-4 h-[50vh] overflow-y-auto">
            {/* System Messages */}
            {renderSystemMessage(getCurrentPrompt())}
            
            {/* Error Message if any */}
            {error && (
              <div className="flex items-start mb-4">
                <div className="bg-destructive text-destructive-foreground rounded-lg p-3 max-w-[85%]">
                  <p>{error}</p>
                  <Button 
                    variant="link" 
                    className="text-destructive-foreground p-0 underline"
                    onClick={() => {
                      setError(null);
                      setCurrentInput('');
                    }}
                  >
                    {getConversationText('tryAgain')}
                  </Button>
                </div>
              </div>
            )}
            
            {/* User inputs */}
            {step !== 'intro' && step !== 'complete' && renderUserMessage('name', userData.name)}
            {(step === 'phone' || step === 'email' || step === 'message' || step === 'confirm') && 
              renderUserMessage('phone', userData.phone)}
            {(step === 'email' || step === 'message' || step === 'confirm') && 
              renderUserMessage('email', userData.email)}
            {(step === 'message' || step === 'confirm') && 
              renderUserMessage('message', userData.message)}
            
            {/* Confirmation Summary */}
            {step === 'confirm' && renderConfirmationSummary()}
            
            {/* Successful submission message */}
            {step === 'complete' && (
              <div className="flex justify-center my-6">
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-primary mb-2" />
                  <h3 className="text-lg font-medium mb-2">{getConversationText('complete')}</h3>
                  <Button onClick={handleRestart} className="mt-2">
                    {getConversationText('startOver')}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Current speech recognition result */}
            {isListening && currentInput && (
              <div className="flex items-start mb-4">
                <div className="bg-muted rounded-lg p-3 max-w-[85%] italic">
                  <p>{currentInput}</p>
                </div>
              </div>
            )}
            
            {/* Auto scroll target */}
            <div ref={messageEndRef} />
          </div>
          
          {/* Input Area - Hide when complete */}
          {step !== 'complete' && !formSubmitted && (
            <div className="border-t p-3">
              <div className="flex items-center gap-2">
                {/* Voice input button */}
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="icon"
                  className={isListening ? "animate-pulse" : ""}
                  onClick={handleVoiceInput}
                  disabled={isSpeaking || isThinking}
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {isListening ? getConversationText('listening') : getConversationText('speakNow')}
                  </span>
                </Button>
                
                {/* Text input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    ref={inputRef}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isThinking) {
                        handleSubmit();
                      }
                    }}
                    placeholder={
                      isListening
                        ? getConversationText('listening')
                        : getConversationText('typeHere')
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isListening || isThinking}
                  />
                </div>
                
                {/* Submit button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!currentInput.trim() || isThinking || isListening}
                >
                  {isThinking ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span className="sr-only">{getConversationText('submit')}</span>
                    </>
                  )}
                </Button>
                
                {/* TTS toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakPrompt(step as keyof typeof conversationTranslations['en-IN']);
                    }
                  }}
                >
                  {isSpeaking ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                  </span>
                </Button>
              </div>
              
              {/* Auto-advance toggle */}
              <div className="flex items-center gap-2 mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoAdvance}
                    onChange={() => setAutoAdvance(!autoAdvance)}
                    className="rounded"
                  />
                  <span>Auto-advance after voice input</span>
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}