import { Button } from '@/components/ui/button';
import { Info, Phone, ExternalLink, Check } from 'lucide-react';
import { Scheme } from '@shared/schema';
import { getTranslation } from '@/lib/schemeUtils';

interface SchemeCardProps {
  scheme: Scheme;
  onMoreInfo: () => void;
  onApplyNow: () => void;
  onCallHelpline: () => void;
  language: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function SchemeCard({
  scheme,
  onMoreInfo,
  onApplyNow,
  onCallHelpline,
  language,
  isActive = false,
  onClick
}: SchemeCardProps) {
  // Helper function to get sector-specific icon
  const getSectorIcon = (sector: string) => {
    switch (sector.toLowerCase()) {
      case 'housing':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
      case 'agriculture':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        );
      case 'education':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        );
      case 'health':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        );
    }
  };
  
  return (
    <div 
      className={`scheme-card bg-white border ${isActive ? 'border-[#0E8A3E]' : 'border-[#E0E0E0]'} rounded-xl p-4 transition duration-300 hover:border-[#0E8A3E] ${isActive ? 'shadow-md' : 'shadow-sm hover:shadow'} cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-[#0E8A3E] flex items-center">
          {isActive && <Check className="mr-1 h-4 w-4 text-[#0E8A3E]" />}
          {scheme.title}
        </h3>
        <div className="bg-[#4CAF50] bg-opacity-10 text-[#0E8A3E] px-2 py-1 rounded-full text-xs font-medium flex items-center">
          {getSectorIcon(scheme.sector)}
          <span className="ml-1">{scheme.sector}</span>
        </div>
      </div>
      
      <p className="text-[#424242] mb-3">{scheme.description}</p>
      
      <div className="mb-3">
        <h4 className="text-sm font-medium text-[#424242] mb-1">{getTranslation('eligibility', language)}:</h4>
        <p className="text-sm text-[#757575]">{scheme.eligibility}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-[#424242] mb-1">{getTranslation('benefits', language)}:</h4>
        <p className="text-sm text-[#757575]">{scheme.benefits}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onMoreInfo();
          }}
          className="flex-1 bg-[#1A73E8] text-white text-center py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#64B5F6] transition flex items-center justify-center"
        >
          <Info className="mr-1 h-4 w-4" />
          <span>{getTranslation('moreInfo', language)}</span>
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onApplyNow();
          }}
          className="flex-1 bg-[#F05A23] text-white text-center py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#FF7043] transition flex items-center justify-center"
        >
          <ExternalLink className="mr-1 h-4 w-4" />
          <span>{getTranslation('applyNow', language)}</span>
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onCallHelpline();
          }}
          size="icon"
          className="flex-none bg-[#F5F5F5] text-[#424242] w-10 h-10 rounded-lg hover:bg-[#E0E0E0] transition flex items-center justify-center"
        >
          <Phone className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
