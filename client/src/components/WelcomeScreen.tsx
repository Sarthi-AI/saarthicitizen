import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageContext } from '@/App';
import { ArrowRight } from 'lucide-react';
import { getTranslation } from '@/lib/schemeUtils';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { language } = useContext(LanguageContext);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-[#4CAF50] opacity-10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 -mb-8 -ml-8 bg-[#F05A23] opacity-10 rounded-full"></div>
      
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full shadow-md mr-4 bg-[#f8f9fa] flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#0E8A3E]">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#424242]">SaarthiAI</h1>
          <p className="text-[#757575]"><span className="hindi">आपका डिजिटल साथी</span> | Your Digital Assistant</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-[#424242]">
          {getTranslation('welcome', language)} <span className="hindi">{getTranslation('namaste', language)}</span>
        </h2>
        <p className="mb-2 text-[#424242]">I'm SaarthiAI, your assistant for discovering government schemes and resolving issues.</p>
        <p className="mb-2 hindi text-[#424242]">मैं SaarthiAI हूँ, सरकारी योजनाओं को खोजने और समस्याओं को हल करने में आपकी सहायता करने वाला आपका सहायक।</p>
      </div>
      
      <Button 
        onClick={onStart}
        className="w-full bg-[#0E8A3E] hover:bg-[#046930] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
      >
        <ArrowRight className="mr-2 h-4 w-4" />
        <span>
          {getTranslation('getStarted', language)} | <span className="hindi">शुरू करें</span>
        </span>
      </Button>
    </div>
  );
}
