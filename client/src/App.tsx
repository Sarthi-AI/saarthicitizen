import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ConversationalForm from "@/pages/ConversationalForm";
import { createContext, useState, useEffect } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { 
  useLanguageInitialization, 
  saveLanguagePreference, 
  updateDocumentMetadata 
} from "@/lib/languageSystem";
import { textToSpeech } from "@/lib/speechServices";

// Create language context
export const LanguageContext = createContext<{
  language: string;
  setLanguage: (lang: string) => void;
}>({
  language: 'en-IN',
  setLanguage: () => {},
});

// Create font size context
export const FontSizeContext = createContext<{
  fontSize: number;
  setFontSize: (size: number) => void;
}>({
  fontSize: 1,
  setFontSize: () => {},
});

// Create speech context
export const SpeechContext = createContext<{
  isSpeaking: boolean;
  startSpeaking: (text: string) => void;
  stopSpeaking: () => void;
  isListening: boolean;
  startListening: (callback: (text: string, isFinal: boolean) => void) => void;
  stopListening: () => void;
}>({
  isSpeaking: false,
  startSpeaking: () => {},
  stopSpeaking: () => {},
  isListening: false,
  startListening: () => {},
  stopListening: () => {},
});

// Create theme context (dark/light mode)
export const ThemeContext = createContext<{
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}>({
  theme: 'light',
  setTheme: () => {},
});

// Our ConversationalForm is already imported at the top

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/conversation" component={ConversationalForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function LanguageInitializer() {
  useLanguageInitialization();
  return null;
}

function App() {
  const [language, setLanguage] = useState<string>('en-IN');
  const [fontSize, setFontSize] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        return savedTheme;
      }
    }
    return 'light';
  });

  // Update language-related state when language changes
  useEffect(() => {
    // Save language preference to localStorage
    saveLanguagePreference(language);
    
    // Update document metadata
    updateDocumentMetadata(language);
    
    // Configure TTS to use the selected language
    textToSpeech.setLanguage(language);
  }, [language]);

  // Save theme preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);
  
  // Helper functions for speech context
  const startSpeaking = (text: string) => {
    textToSpeech.speak(
      text, 
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      (error) => {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
      }
    );
  };
  
  const stopSpeaking = () => {
    textToSpeech.cancel();
    setIsSpeaking(false);
  };
  
  const startListening = (callback: (text: string, isFinal: boolean) => void) => {
    import('@/lib/speechServices').then(({ speechRecognition }) => {
      // Set the current language for speech recognition
      speechRecognition.setLanguage(language);
      
      // Start recognition
      const success = speechRecognition.start(
        callback,
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
        }
      );
      
      if (success) {
        setIsListening(true);
      }
    });
  };
  
  const stopListening = () => {
    import('@/lib/speechServices').then(({ speechRecognition }) => {
      speechRecognition.stop();
      setIsListening(false);
    });
  };

  // Function to update language with side effects
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme={theme as 'light' | 'dark' | 'system'}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <LanguageContext.Provider value={{ 
            language, 
            setLanguage: handleLanguageChange 
          }}>
            <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
              <SpeechContext.Provider value={{
                isSpeaking,
                startSpeaking,
                stopSpeaking,
                isListening,
                startListening,
                stopListening
              }}>
                <TooltipProvider>
                  <LanguageInitializer />
                  <Toaster />
                  <div 
                    style={{ fontSize: `${fontSize}rem` }}
                    className="transition-all duration-300"
                    lang={language.split('-')[0]} // Set the language attribute for accessibility
                  >
                    <Router />
                  </div>
                </TooltipProvider>
              </SpeechContext.Provider>
            </FontSizeContext.Provider>
          </LanguageContext.Provider>
        </ThemeContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
