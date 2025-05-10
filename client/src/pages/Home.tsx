import { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Scheme, UserInfo } from '@shared/schema';
import WelcomeScreen from '@/components/WelcomeScreen';
import UserInfoForm from '@/components/UserInfoForm';
import SchemeResults from '@/components/SchemeResults';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AccessibilityControls from '@/components/AccessibilityControls';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, FileText } from 'lucide-react';
import { LanguageContext } from '@/App';
import { getTranslation } from '@/lib/languageSystem';

export default function Home() {
  const { language } = useContext(LanguageContext);
  const [step, setStep] = useState<'welcome' | 'form' | 'results'>('welcome');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
  
  // Query to fetch all schemes
  const { data: schemes } = useQuery<Scheme[]>({
    queryKey: ['/api/schemes'],
    enabled: step === 'form',
  });
  
  // Mutation to filter schemes
  const filterSchemesMutation = useMutation({
    mutationFn: (userData: UserInfo) => {
      return apiRequest('POST', '/api/schemes/filter', userData).then(res => res.json());
    },
    onSuccess: (data: Scheme[]) => {
      setFilteredSchemes(data);
      setStep('results');
    },
  });
  
  const handleStart = () => {
    setStep('form');
  };
  
  const handleFormSubmit = (formData: UserInfo) => {
    setUserInfo(formData);
    
    // Filter schemes based on user info
    filterSchemesMutation.mutate(formData);
  };
  
  const handleBackToForm = () => {
    setStep('form');
  };
  
  return (
    <div className="min-h-screen bg-[#f8f9fa] py-4">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <LanguageSwitcher />
        
        {step === 'welcome' && (
          <>
            <WelcomeScreen onStart={handleStart} />
            
            {/* Conversational Form Option Card */}
            <div className="mt-8">
              <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {getTranslation('conversationalModeTitle', language) || 'Conversational Mode'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>
                    {getTranslation('conversationalModeDescription', language) || 
                    'Try our new voice-based conversational interface to submit your information without filling forms.'}
                  </p>
                </CardContent>
                <CardFooter className="border-t bg-muted/20 p-3">
                  <Link href="/conversation">
                    <Button className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {getTranslation('tryConversationalMode', language) || 'Try Conversational Mode'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
        
        {step === 'form' && (
          <UserInfoForm onSubmit={handleFormSubmit} />
        )}
        
        {step === 'results' && userInfo && (
          <SchemeResults 
            userInfo={userInfo}
            schemes={filteredSchemes}
            onBack={handleBackToForm}
          />
        )}
        
        <AccessibilityControls />
      </div>
    </div>
  );
}
