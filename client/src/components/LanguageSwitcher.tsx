import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { LanguageContext, SpeechContext, ThemeContext } from '@/App';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  supportedLanguages, 
  getTranslation,
  updateDocumentMetadata 
} from '@/lib/languageSystem';
import { 
  Languages, 
  Moon, 
  Sun, 
  VolumeX, 
  Volume2, 
  Mic, 
  MicOff,
  Search, 
  Maximize, 
  Minimize,
  Settings
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/components/theme-provider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);
  const { isSpeaking, startSpeaking, stopSpeaking } = useContext(SpeechContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { setTheme: setSystemTheme } = useTheme();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  
  // Get the current language details
  const currentLanguage = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];
  
  // Filter languages by search query
  const filteredLanguages = searchQuery 
    ? supportedLanguages.filter(lang => 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : supportedLanguages;
  
  // Handle language change
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    updateDocumentMetadata(newLang);
    setOpenDialog(false);
  };
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setSystemTheme(newTheme);
  };
  
  // Read page content aloud
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
  
  // Mobile-friendly language selector component
  const MobileLanguageSelector = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-sm border border-[#E0E0E0] dark:border-gray-700 hover:shadow-md transition"
          aria-label="Change language"
        >
          <Languages className="h-4 w-4 mr-2" />
          <span className="max-w-[100px] truncate">{currentLanguage.nativeName}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{getTranslation('selectLanguage', language)}</DrawerTitle>
          <Input 
            placeholder={getTranslation('searchLanguage', language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="my-2"
          />
        </DrawerHeader>
        <div className="max-h-[50vh] overflow-y-auto p-4 grid grid-cols-2 gap-2">
          {filteredLanguages.map(lang => (
            <Button
              key={lang.code}
              variant={lang.code === language ? "default" : "outline"}
              onClick={() => handleLanguageChange(lang.code)}
              className="justify-start"
            >
              <span className="flex items-center">
                {lang.nativeName}
                <span className="text-xs text-muted-foreground ml-2">
                  {lang.name !== lang.nativeName && `(${lang.name})`}
                </span>
              </span>
            </Button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{getTranslation('close', language)}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
  
  // Desktop language selector component
  const DesktopLanguageSelector = () => (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-sm border border-[#E0E0E0] dark:border-gray-700 hover:shadow-md transition"
          aria-label="Change language"
        >
          <Languages className="h-4 w-4 mr-2" />
          <span>{currentLanguage.nativeName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>{getTranslation('selectLanguage', language)}</DialogTitle>
        <Input 
          placeholder={getTranslation('searchLanguage', language)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="my-2"
        />
        <div className="max-h-[50vh] overflow-y-auto grid grid-cols-2 gap-2 mt-4">
          {filteredLanguages.map(lang => (
            <Button
              key={lang.code}
              variant={lang.code === language ? "default" : "outline"}
              onClick={() => handleLanguageChange(lang.code)}
              className="justify-start"
            >
              <span className="flex flex-col items-start">
                <span>{lang.nativeName}</span>
                {lang.name !== lang.nativeName && (
                  <span className="text-xs text-muted-foreground">{lang.name}</span>
                )}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
  
  // Main toolbar component
  return (
    <div className="flex justify-end items-center mb-4 gap-2">
      {/* Language Switcher */}
      {isMobile ? <MobileLanguageSelector /> : <DesktopLanguageSelector />}
      
      {/* Additional Options Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="bg-white dark:bg-gray-800 rounded-full shadow-sm border border-[#E0E0E0] dark:border-gray-700 hover:shadow-md transition"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{getTranslation('accessibilityOptions', language)}</DropdownMenuLabel>
          <DropdownMenuGroup>
            {/* Theme Toggle */}
            <DropdownMenuItem onClick={handleThemeToggle}>
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>{getTranslation('lightModeToggle', language)}</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>{getTranslation('darkModeToggle', language)}</span>
                </>
              )}
            </DropdownMenuItem>
            
            {/* Text-to-Speech Toggle */}
            <DropdownMenuItem onClick={handleReadAloud}>
              {isSpeaking ? (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  <span>{getTranslation('stopReading', language)}</span>
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  <span>{getTranslation('tooltipReadAloud', language)}</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
