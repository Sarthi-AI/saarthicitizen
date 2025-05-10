import { useContext, useState, useRef, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LanguageContext } from '@/App';
import { Mic, MicOff, Search, Pause } from 'lucide-react';
import { speechRecognition } from '@/lib/speechRecognition';
import { getTranslation, indianStates, sectors, UserInfo } from '@/lib/schemeUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
}

export default function UserInfoForm({ onSubmit }: UserInfoFormProps) {
  const { language } = useContext(LanguageContext);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textDescription, setTextDescription] = useState('');
  const [formData, setFormData] = useState<UserInfo>({
    age: 0,
    gender: 'Male',
    state: '',
    sector: '',
    description: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'age') {
      setFormData({
        ...formData,
        [name]: parseInt(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleStartRecording = () => {
    if (!speechRecognition.isRecognitionSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    
    setIsRecording(true);
    speechRecognition.setLanguage(language);
    speechRecognition.start(
      (text, isFinal) => {
        if (isFinal) {
          setTranscript(text);
          setTextDescription(text);
          setFormData({
            ...formData,
            description: text
          });
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsRecording(false);
      }
    );
  };
  
  const handleStopRecording = () => {
    speechRecognition.stop();
    setIsRecording(false);
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Combine transcript and text description
    const finalDescription = transcript || textDescription;
    
    onSubmit({
      ...formData,
      description: finalDescription
    });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-[#424242]">
        {getTranslation('tellAboutYourself', language)} | <span className="hindi">अपने बारे में बताएं</span>
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Age Input */}
          <div>
            <Label htmlFor="age" className="text-sm font-medium text-[#757575]">
              {getTranslation('age', language)} | <span className="hindi">उम्र</span>
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              min={0}
              max={120}
              required
              className="mt-1 w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#0E8A3E] focus:border-[#0E8A3E]"
              value={formData.age || ''}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Gender Selection */}
          <div>
            <Label className="text-sm font-medium text-[#757575]">
              {getTranslation('gender', language)} | <span className="hindi">लिंग</span>
            </Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="gender-male"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#0E8A3E] focus:ring-[#0E8A3E]"
                  required
                />
                <Label htmlFor="gender-male" className="text-sm">{getTranslation('male', language)}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="gender-female"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#0E8A3E] focus:ring-[#0E8A3E]"
                />
                <Label htmlFor="gender-female" className="text-sm">{getTranslation('female', language)}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="gender-other"
                  name="gender"
                  value="Other"
                  checked={formData.gender === 'Other'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#0E8A3E] focus:ring-[#0E8A3E]"
                />
                <Label htmlFor="gender-other" className="text-sm">{getTranslation('other', language)}</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* State Selection */}
          <div>
            <Label htmlFor="state" className="text-sm font-medium text-[#757575]">
              {getTranslation('state', language)} | <span className="hindi">राज्य</span>
            </Label>
            <Select 
              name="state"
              value={formData.state}
              onValueChange={(value) => handleSelectChange('state', value)}
              required
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder={getTranslation('selectState', language)} />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Sector Selection */}
          <div>
            <Label htmlFor="sector" className="text-sm font-medium text-[#757575]">
              {getTranslation('sector', language)} | <span className="hindi">क्षेत्र</span>
            </Label>
            <Select 
              name="sector"
              value={formData.sector}
              onValueChange={(value) => handleSelectChange('sector', value)}
              required
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder={getTranslation('selectSector', language)} />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector.value} value={sector.value}>
                    {sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Voice or Text Description */}
        <div>
          <Label className="block text-sm font-medium text-[#757575] mb-2">
            {getTranslation('describeNeeds', language)} | <span className="hindi">अपनी जरूरतों का वर्णन करें (वैकल्पिक)</span>
          </Label>
          
          <div className="flex flex-col space-y-3">
            {/* Voice Input Button */}
            {!isRecording ? (
              <Button
                type="button"
                onClick={handleStartRecording}
                className="flex items-center justify-center space-x-2 bg-[#F05A23] hover:bg-[#FF7043] text-white font-medium py-3 px-4 rounded-lg shadow transition duration-300"
              >
                <Mic className="mr-2 h-4 w-4" />
                <span>
                  {getTranslation('speakNow', language)} | <span className="hindi">अब बोलें</span>
                </span>
              </Button>
            ) : (
              /* Voice Recording Indicator */
              <div className="flex items-center justify-center space-x-3 p-3 bg-[#F5F5F5] rounded-lg border border-[#F05A23]">
                <div className="voice-btn-pulse w-8 h-8 rounded-full bg-[#F05A23] flex items-center justify-center">
                  <Mic className="h-4 w-4 text-white" />
                </div>
                <span className="text-[#424242]">
                  {getTranslation('listening', language)} | <span className="hindi">सुन रहा हूँ...</span>
                </span>
                <Button
                  type="button"
                  onClick={handleStopRecording}
                  variant="outline"
                  size="icon"
                  className="ml-auto bg-white text-[#F05A23] p-1 rounded-full"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Voice Transcript Display */}
            {transcript && (
              <div className="p-3 bg-white border border-[#E0E0E0] rounded-lg text-[#424242]">
                {transcript}
              </div>
            )}
            
            {/* Text Input Alternative */}
            <div className="relative">
              <Textarea
                id="text-description"
                name="description"
                rows={3}
                className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#0E8A3E] focus:border-[#0E8A3E]"
                placeholder={`${getTranslation('typeNeeds', language)}...`}
                value={textDescription}
                onChange={(e) => {
                  setTextDescription(e.target.value);
                  setFormData({
                    ...formData,
                    description: e.target.value
                  });
                }}
                maxLength={200}
              />
              <div className="absolute right-2 bottom-2 text-xs text-[#757575]">
                <span>{textDescription.length}</span>/200
              </div>
            </div>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-[#0E8A3E] hover:bg-[#046930] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>
            {getTranslation('findSchemes', language)} | <span className="hindi">योजनाएँ खोजें</span>
          </span>
        </Button>
      </form>
    </div>
  );
}
