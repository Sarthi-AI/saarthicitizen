import { useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageContext } from '@/App';
import { ArrowLeft, Info, Phone, LightbulbIcon, ChevronDown, ChevronUp, Search, Loader2 } from 'lucide-react';
import { Scheme, UserInfo } from '@shared/schema';
import { getTranslation, getSchemeExplanation, getAdditionalSchemeInfo } from '@/lib/schemeUtils';
import SchemeCard from './SchemeCard';
import GrievanceTemplateModal from './GrievanceTemplateModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SchemeResultsProps {
  userInfo: UserInfo;
  schemes: Scheme[];
  onBack: () => void;
}

export default function SchemeResults({ userInfo, schemes, onBack }: SchemeResultsProps) {
  const { language } = useContext(LanguageContext);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<{
    explanation: string;
    requiredDocuments: string[];
    nextSteps: string;
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
  const [loadingAdditionalInfo, setLoadingAdditionalInfo] = useState(false);
  const [activeSchemeIndex, setActiveSchemeIndex] = useState(0);
  
  useEffect(() => {
    if (schemes.length > 0) {
      setActiveSchemeIndex(0);
      fetchExplanation(schemes[0]);
    }
  }, [schemes]);
  
  const fetchExplanation = async (scheme: Scheme) => {
    try {
      const explanation = await getSchemeExplanation(scheme.id, userInfo);
      if (explanation) {
        setAiExplanation(explanation);
      }
    } catch (error) {
      console.error('Error fetching explanation:', error);
    }
  };
  
  const fetchAdditionalInfo = async (schemeId: string) => {
    setLoadingAdditionalInfo(true);
    try {
      const info = await getAdditionalSchemeInfo(schemeId);
      setAdditionalInfo(info);
    } catch (error) {
      console.error('Error fetching additional info:', error);
      setAdditionalInfo(null);
    } finally {
      setLoadingAdditionalInfo(false);
    }
  };
  
  const handleSelectScheme = (index: number) => {
    setActiveSchemeIndex(index);
    const scheme = schemes[index];
    fetchExplanation(scheme);
    // Reset additional info when changing schemes
    setAdditionalInfo(null);
  };
  
  const handleShowGrievance = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setShowModal(true);
  };
  
  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#424242]">
            {getTranslation('recommendedSchemes', language)} | <span className="hindi">अनुशंसित योजनाएँ</span>
          </h2>
          <Button
            onClick={onBack}
            variant="ghost"
            className="flex items-center text-[#1A73E8] hover:text-[#64B5F6] transition"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>{getTranslation('back', language)}</span>
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4 text-sm">
          <span className="px-2 py-1 bg-[#F5F5F5] rounded-full flex items-center">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#0E8A3E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Age: {userInfo.age}</span>
          </span>
          <span className="px-2 py-1 bg-[#F5F5F5] rounded-full flex items-center">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#0E8A3E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            <span>Gender: {userInfo.gender}</span>
          </span>
          <span className="px-2 py-1 bg-[#F5F5F5] rounded-full flex items-center">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#0E8A3E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>State: {userInfo.state}</span>
          </span>
          <span className="px-2 py-1 bg-[#F5F5F5] rounded-full flex items-center">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#0E8A3E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <span>Sector: {userInfo.sector}</span>
          </span>
        </div>
        
        <p className="text-[#757575] mb-4">
          Based on your profile, we've found {schemes.length} government schemes that may be relevant for you.
        </p>
        
        <div className="space-y-4">
          {schemes.map((scheme, index) => (
            <div key={scheme.id} className={`transition-all duration-300 ${activeSchemeIndex === index ? 'scale-103 shadow-md' : ''}`}>
              <SchemeCard 
                scheme={scheme}
                onCallHelpline={() => window.open(`tel:1800-11-1555`)}
                onMoreInfo={() => window.open(scheme.url, '_blank')}
                onApplyNow={() => window.open(scheme.url, '_blank')}
                language={language}
                isActive={activeSchemeIndex === index}
                onClick={() => handleSelectScheme(index)}
              />
            </div>
          ))}
          
          {schemes.length === 0 && (
            <div className="p-4 border border-[#E0E0E0] rounded-lg text-center">
              <p>No schemes found matching your criteria. Please try adjusting your search parameters.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Detailed Information Section */}
      {schemes.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-[#424242] flex items-center">
            <LightbulbIcon className="h-5 w-5 text-[#0E8A3E] mr-2" />
            <span>Detailed Information | <span className="hindi">विस्तृत जानकारी</span></span>
          </h2>
          
          <Tabs defaultValue="ai-suggestion" className="w-full">
            <TabsList className="w-full flex mb-4 bg-[#F5F5F5] p-1 rounded-lg">
              <TabsTrigger value="ai-suggestion" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#0E8A3E]">
                AI Suggestion
              </TabsTrigger>
              <TabsTrigger value="more-info" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#0E8A3E]" onClick={() => {
                if (!additionalInfo && !loadingAdditionalInfo && schemes.length > 0) {
                  fetchAdditionalInfo(schemes[activeSchemeIndex].id);
                }
              }}>
                Additional Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-suggestion" className="mt-0">
              {aiExplanation ? (
                <div className="p-4 bg-[#0E8A3E] bg-opacity-5 rounded-xl border border-[#0E8A3E] border-opacity-20">
                  <p className="text-[#424242] mb-3">{aiExplanation.explanation}</p>
                  
                  <p className="text-[#424242] font-medium">For faster processing, I recommend keeping the following documents ready:</p>
                  <ul className="list-disc list-inside text-[#757575] space-y-1 mt-2 mb-3">
                    {aiExplanation.requiredDocuments.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                  
                  {!isExpanded ? (
                    <Button
                      onClick={() => setIsExpanded(true)}
                      variant="ghost"
                      className="text-[#0E8A3E] hover:text-[#046930] font-medium flex items-center p-0"
                    >
                      <span>{getTranslation('showMore', language)}</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <p className="text-[#424242] mb-3">{aiExplanation.nextSteps}</p>
                      <Button
                        onClick={() => setIsExpanded(false)}
                        variant="ghost"
                        className="text-[#0E8A3E] hover:text-[#046930] font-medium flex items-center p-0"
                      >
                        <span>{getTranslation('hideMore', language)}</span>
                        <ChevronUp className="ml-1 h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-[#F5F5F5] rounded-lg flex justify-center items-center">
                  <Loader2 className="h-8 w-8 text-[#0E8A3E] animate-spin" />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="more-info" className="mt-0">
              {loadingAdditionalInfo ? (
                <div className="p-4 bg-[#F5F5F5] rounded-lg flex flex-col justify-center items-center space-y-2">
                  <Loader2 className="h-8 w-8 text-[#1A73E8] animate-spin" />
                  <p className="text-[#757575]">Fetching latest information...</p>
                </div>
              ) : additionalInfo ? (
                <div className="p-4 bg-[#1A73E8] bg-opacity-5 rounded-xl border border-[#1A73E8] border-opacity-20">
                  <p className="text-[#424242] mb-3 whitespace-pre-line">{additionalInfo}</p>
                  <div className="mt-4 text-sm text-[#757575] flex items-center">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Information updated via Perplexity</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#F5F5F5] rounded-lg flex flex-col justify-center items-center space-y-3">
                  <Search className="h-8 w-8 text-[#757575]" />
                  <p className="text-[#757575]">Click the tab to fetch the latest information about this scheme</p>
                  <Button 
                    onClick={() => fetchAdditionalInfo(schemes[activeSchemeIndex].id)}
                    className="bg-[#1A73E8] hover:bg-[#64B5F6] text-white"
                  >
                    Get Latest Info
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {/* Grievance Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[#424242]">
          {getTranslation('fileGrievance', language)} | <span className="hindi">शिकायत दर्ज करें</span>
        </h2>
        
        <p className="text-[#757575] mb-4">
          If you're facing issues with any government scheme or service, you can file a grievance through the following channels:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 border border-[#E0E0E0] rounded-xl bg-[#F5F5F5] bg-opacity-50 flex flex-col items-center text-center">
            <Phone className="h-8 w-8 text-[#0E8A3E] mb-2" />
            <h3 className="font-medium mb-1">Call Helpline</h3>
            <p className="text-sm text-[#757575]">Toll-Free: 1800-11-1555</p>
          </div>
          
          <div className="p-4 border border-[#E0E0E0] rounded-xl bg-[#F5F5F5] bg-opacity-50 flex flex-col items-center text-center">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="#0E8A3E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <h3 className="font-medium mb-1">Email Support</h3>
            <p className="text-sm text-[#757575]">help@pgportal.gov.in</p>
          </div>
          
          <div className="p-4 border border-[#E0E0E0] rounded-xl bg-[#F5F5F5] bg-opacity-50 flex flex-col items-center text-center">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="#0E8A3E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <h3 className="font-medium mb-1">Online Portal</h3>
            <a href="https://pgportal.gov.in" target="_blank" className="text-sm text-[#1A73E8] hover:underline">pgportal.gov.in</a>
          </div>
        </div>
        
        <Button
          onClick={() => schemes.length > 0 && handleShowGrievance(schemes[activeSchemeIndex])}
          disabled={schemes.length === 0}
          className="w-full bg-[#1A73E8] hover:bg-[#64B5F6] text-white font-medium py-3 rounded-lg transition duration-300"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>{getTranslation('generateTemplate', language)}</span>
        </Button>
      </div>
      
      {/* Grievance Template Modal */}
      {selectedScheme && (
        <GrievanceTemplateModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          scheme={selectedScheme}
          userInfo={userInfo}
        />
      )}
    </div>
  );
}
