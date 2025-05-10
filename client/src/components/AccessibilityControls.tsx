import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { FontSizeContext, SpeechContext, ThemeContext } from '@/App';
import { getTranslation } from '@/lib/languageSystem';
import { LanguageContext } from '@/App';
import { useTheme } from '@/components/theme-provider';
import { Volume2, VolumeX, ZoomIn, ZoomOut, Moon, Sun } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function AccessibilityControls() {
  const { language } = useContext(LanguageContext);
  const { fontSize, setFontSize } = useContext(FontSizeContext);
  const { isSpeaking, startSpeaking, stopSpeaking } = useContext(SpeechContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { setTheme: setSystemTheme } = useTheme();
  
  // Handle font size increase/decrease
  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(0.8, Math.min(1.6, fontSize + delta));
    setFontSize(newSize);
  };
  
  // Toggle between light and dark themes
  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setSystemTheme(newTheme);
  };
  
  // Read the current page aloud
  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    
    // Get the main content text
    const mainContent = document.querySelector('main')?.textContent || 
                      document.body.textContent || 
                      'No content to read';
    
    startSpeaking(mainContent);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition"
              onClick={() => handleFontSizeChange(0.1)}
            >
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">{getTranslation('tooltipZoomIn', language)}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTranslation('tooltipZoomIn', language)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition"
              onClick={() => handleFontSizeChange(-0.1)}
            >
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">{getTranslation('tooltipZoomOut', language)}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTranslation('tooltipZoomOut', language)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={isSpeaking ? "secondary" : "outline"}
              size="icon"
              className={`rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition ${isSpeaking ? 'animate-pulse' : ''}`}
              onClick={handleReadAloud}
            >
              {isSpeaking ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span className="sr-only">{getTranslation('tooltipReadAloud', language)}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSpeaking ? getTranslation('stopReading', language) : getTranslation('tooltipReadAloud', language)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition"
              onClick={handleThemeToggle}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {theme === 'dark' 
                  ? getTranslation('lightModeToggle', language) 
                  : getTranslation('darkModeToggle', language)}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {theme === 'dark' 
                ? getTranslation('lightModeToggle', language) 
                : getTranslation('darkModeToggle', language)}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}