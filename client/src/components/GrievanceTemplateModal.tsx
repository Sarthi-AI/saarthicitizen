import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, X } from 'lucide-react';
import { Scheme, UserInfo } from '@shared/schema';
import { generateGrievanceTemplate } from '@/lib/schemeUtils';

interface GrievanceTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: Scheme;
  userInfo: UserInfo;
}

export default function GrievanceTemplateModal({
  isOpen,
  onClose,
  scheme,
  userInfo
}: GrievanceTemplateModalProps) {
  const [template, setTemplate] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  useEffect(() => {
    if (isOpen && scheme) {
      fetchTemplate();
    }
  }, [isOpen, scheme]);
  
  const fetchTemplate = async () => {
    try {
      const result = await generateGrievanceTemplate(scheme, userInfo);
      if (result && result.template) {
        setTemplate(result.template);
      }
    } catch (error) {
      console.error('Error generating template:', error);
    }
  };
  
  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(template).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  
  const handleDownloadTemplate = () => {
    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grievance_template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold text-[#424242]">Grievance Template</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-[#757575] hover:text-[#424242]">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="border border-[#E0E0E0] rounded-lg p-4 mb-4 bg-[#F5F5F5] bg-opacity-50">
          <div className="mb-4">
            <Label className="block text-sm font-medium text-[#757575] mb-1">To:</Label>
            <Input
              value={`The Grievance Officer, ${scheme.title}`}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg bg-white"
              readOnly
            />
          </div>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-[#757575] mb-1">Subject:</Label>
            <Input
              value={`Grievance Regarding ${scheme.title}`}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg bg-white"
              readOnly
            />
          </div>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-[#757575] mb-1">Content:</Label>
            <Textarea
              rows={8}
              value={template}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg bg-white"
              readOnly
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleCopyTemplate}
            className="flex-1 bg-[#1A73E8] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#64B5F6] transition flex items-center justify-center"
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>{isCopied ? 'Copied!' : 'Copy Template'}</span>
          </Button>
          <Button
            onClick={handleDownloadTemplate}
            className="flex-1 bg-[#0E8A3E] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#046930] transition flex items-center justify-center"
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Download as Text</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
