import { supportedLanguages } from './languageSystem';

// Define the interfaces for speech recognition (for TypeScript compatibility)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: (event: Event) => void;
  start(): void;
  stop(): void;
  abort(): void;
}

// Universal Speech Recognition Service
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported = false;
  private lang = 'en-IN';
  private isListening = false;
  private continuous = true;
  private interimResults = true;
  private commandMode = false; // For voice command support
  private commands: Map<string, () => void> = new Map();
  private commandTriggerPhrases: { [lang: string]: string } = {
    'en-IN': 'saarthi',
    'hi-IN': 'साथी',
    'kn-IN': 'ಸಾಥಿ',
    'ta-IN': 'சாத்தி',
    'te-IN': 'సాతి',
    'mr-IN': 'साथी',
    'bn-IN': 'সাথী',
    'gu-IN': 'સાથી',
    'ml-IN': 'സാഥി',
    'pa-IN': 'ਸਾਥੀ',
    'ur-IN': 'ساتھی',
    'or-IN': 'ସାଥୀ'
  };

  constructor() {
    if (typeof window !== 'undefined') {
      // Check if browser supports SpeechRecognition
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition || 
        (window as any).mozSpeechRecognition || 
        (window as any).msSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.isSupported = true;
        this.setupRecognition();
        console.log(`Speech recognition initialized with language: ${this.lang}`);
      } else {
        this.isSupported = false;
        console.warn('Speech recognition is not supported in this browser');
      }
    } else {
      this.isSupported = false;
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = this.continuous;
    this.recognition.interimResults = this.interimResults;
    this.recognition.lang = this.lang;
    this.recognition.maxAlternatives = 1;
  }

  public setLanguage(lang: string) {
    if (!supportedLanguages.find(l => l.code === lang)) {
      console.warn(`Language ${lang} not supported, falling back to en-IN`);
      lang = 'en-IN';
    }
    
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  // Enable command mode to listen for specific voice commands
  public enableCommandMode(enabled: boolean) {
    this.commandMode = enabled;
  }

  // Register a voice command with a callback function
  public registerCommand(phrase: string, callback: () => void, language: string = 'en-IN') {
    // Store commands in lowercase for case-insensitive matching
    this.commands.set(`${language}:${phrase.toLowerCase()}`, callback);
  }

  // Start speech recognition
  public start(onResult: (text: string, isFinal: boolean) => void, onError?: (error: any) => void): boolean {
    if (!this.isSupported || !this.recognition) {
      if (onError) onError({ message: 'Speech recognition not supported' });
      return false;
    }

    if (this.isListening) {
      this.stop();
    }

    // Make sure the language is set correctly
    if (this.recognition.lang !== this.lang) {
      this.recognition.lang = this.lang;
      console.log(`Updated recognition language to: ${this.lang}`);
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log(`Started listening in ${this.lang}`);
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      try {
        const result = event.results[event.resultIndex];
        const transcript = result[0].transcript.trim();
        const isFinal = result.isFinal;
        
        console.log(`Speech recognized: "${transcript}", isFinal: ${isFinal}`);
        
        if (this.commandMode && isFinal) {
          this.checkForCommands(transcript);
        }
        
        onResult(transcript, isFinal);
      } catch (error) {
        console.error('Error processing speech result:', error);
        if (onError) onError({ message: 'Error processing speech result' });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event);
      
      // Only report the error if it's not "aborted" (which happens when we call stop())
      if (event.error !== 'aborted' && onError) {
        onError(event);
      }
      
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Speech recognition ended');
    };

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      if (onError) onError(error);
      return false;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  public isRecognitionActive(): boolean {
    return this.isListening;
  }
  
  // Check if transcript contains any registered commands
  private checkForCommands(transcript: string) {
    const lowerTranscript = transcript.toLowerCase();
    
    // Check if the command starts with a trigger phrase
    let triggered = false;
    Object.entries(this.commandTriggerPhrases).forEach(([lang, phrase]) => {
      if (lowerTranscript.includes(phrase.toLowerCase())) {
        triggered = true;
      }
    });
    
    if (!triggered) return;
    
    // Check for registered commands
    this.commands.forEach((callback, commandKey) => {
      const [lang, command] = commandKey.split(':');
      if (lowerTranscript.includes(command)) {
        callback();
      }
    });
  }
}

// Enhanced Text-to-Speech Service with fallback mechanisms
export class TextToSpeechService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSupported = false;
  private voiceMap: Map<string, SpeechSynthesisVoice> = new Map();
  private isSpeaking = false;
  private paused = false;
  private currentText = '';
  private currentLang = 'en-IN';
  private volume = 1.0;
  private rate = 1.0;
  private pitch = 1.0;
  
  constructor() {
    // Check if browser supports Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isSupported = true;
      this.utterance = new SpeechSynthesisUtterance();
      this.loadVoices();
      
      // Handle dynamic voice loading in Chrome
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
      }
    } else {
      console.warn('Text-to-speech is not supported in this browser');
    }
  }
  
  // Load and catalog available voices
  private loadVoices() {
    if (!this.isSupported) return;
    
    const voices = window.speechSynthesis.getVoices();
    
    // Map language codes to their corresponding voices
    voices.forEach(voice => {
      const langCode = voice.lang.toLowerCase();
      
      // Prefer native voices when available
      if (!this.voiceMap.has(langCode) || voice.localService) {
        this.voiceMap.set(langCode, voice);
      }
      
      // Keep a generic mapping for partial matches
      const baseLang = langCode.split('-')[0];
      if (!this.voiceMap.has(baseLang) || voice.localService) {
        this.voiceMap.set(baseLang, voice);
      }
    });
    
    console.log(`Loaded ${voices.length} speech synthesis voices`);
  }
  
  // Find the best voice for a given language
  private getBestVoiceForLanguage(lang: string): SpeechSynthesisVoice | null {
    if (!this.isSupported) return null;
    
    lang = lang.toLowerCase();
    
    // Try exact match
    if (this.voiceMap.has(lang)) {
      return this.voiceMap.get(lang) || null;
    }
    
    // Try language base match (e.g., 'en' for 'en-IN')
    const baseLang = lang.split('-')[0];
    if (this.voiceMap.has(baseLang)) {
      return this.voiceMap.get(baseLang) || null;
    }
    
    // Fall back to any locale for the language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(baseLang));
    if (matchingVoice) {
      return matchingVoice;
    }
    
    // Last resort: use default voice
    return voices[0] || null;
  }
  
  // Set the language for speech synthesis
  public setLanguage(lang: string) {
    this.currentLang = lang;
  }
  
  // Configure speech parameters
  public configure({ volume, rate, pitch }: { volume?: number; rate?: number; pitch?: number }) {
    if (volume !== undefined) this.volume = Math.max(0, Math.min(1, volume));
    if (rate !== undefined) this.rate = Math.max(0.1, Math.min(10, rate));
    if (pitch !== undefined) this.pitch = Math.max(0, Math.min(2, pitch));
  }
  
  // Speak text with the current language
  public speak(text: string, onStart?: () => void, onEnd?: () => void, onError?: (error: any) => void): boolean {
    if (!this.isSupported || !this.utterance) {
      if (onError) onError({ message: 'Text-to-speech not supported' });
      return false;
    }
    
    // Cancel any ongoing speech
    this.cancel();
    
    this.currentText = text;
    this.utterance.text = text;
    this.utterance.lang = this.currentLang;
    this.utterance.volume = this.volume;
    this.utterance.rate = this.rate;
    this.utterance.pitch = this.pitch;
    
    // Set the best available voice
    const voice = this.getBestVoiceForLanguage(this.currentLang);
    if (voice) {
      this.utterance.voice = voice;
    }
    
    // Set event handlers
    this.utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };
    
    this.utterance.onend = () => {
      this.isSpeaking = false;
      this.paused = false;
      if (onEnd) onEnd();
    };
    
    this.utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.paused = false;
      if (onError) onError(event);
    };
    
    // Start speaking
    window.speechSynthesis.speak(this.utterance);
    return true;
  }
  
  // Pause ongoing speech
  public pause(): boolean {
    if (!this.isSupported || !this.isSpeaking) return false;
    
    window.speechSynthesis.pause();
    this.paused = true;
    return true;
  }
  
  // Resume paused speech
  public resume(): boolean {
    if (!this.isSupported || !this.paused) return false;
    
    window.speechSynthesis.resume();
    this.paused = false;
    return true;
  }
  
  // Cancel all speech
  public cancel(): boolean {
    if (!this.isSupported) return false;
    
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    this.paused = false;
    return true;
  }
  
  // Check if speech synthesis is supported
  public isSpeechSupported(): boolean {
    return this.isSupported;
  }
  
  // Check if currently speaking
  public isSpeechActive(): boolean {
    return this.isSpeaking;
  }
  
  // Check if speech is paused
  public isSpeechPaused(): boolean {
    return this.paused;
  }
  
  // Get list of available voice languages
  public getAvailableLanguages(): string[] {
    if (!this.isSupported) return [];
    
    const voices = window.speechSynthesis.getVoices();
    const languages = new Set<string>();
    
    voices.forEach(voice => {
      languages.add(voice.lang);
    });
    
    return Array.from(languages);
  }
  
  // Speak selected text from the page
  public speakSelectedText(onStart?: () => void, onEnd?: () => void, onError?: (error: any) => void): boolean {
    if (!this.isSupported) {
      if (onError) onError({ message: 'Text-to-speech not supported' });
      return false;
    }
    
    const selectedText = window.getSelection()?.toString();
    if (!selectedText) {
      if (onError) onError({ message: 'No text selected' });
      return false;
    }
    
    return this.speak(selectedText, onStart, onEnd, onError);
  }
}

// Create singleton instances
export const speechRecognition = new SpeechRecognitionService();
export const textToSpeech = new TextToSpeechService();