import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
const DISCLAIMER_SESSION_KEY = 'amplify-ai-disclaimer-shown';
export function AiDisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const hasSeenDisclaimer = sessionStorage.getItem(DISCLAIMER_SESSION_KEY);
    if (!hasSeenDisclaimer) {
      setIsOpen(true);
    }
  }, []);
  const handleClose = () => {
    sessionStorage.setItem(DISCLAIMER_SESSION_KEY, 'true');
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Important Information
          </DialogTitle>
          <DialogDescription className="pt-2">
            Please read the following before you proceed.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-sm text-muted-foreground">
          <p>
            <strong>AI-Powered Functionality:</strong> This application uses AI to generate content. While powerful, the AI may occasionally produce inaccurate or unexpected results. Always review generated content.
          </p>
          <p>
            <strong>API Keys Required for Deployment:</strong> The live demo works out-of-the-box. However, if you deploy this project yourself, you <strong>must</strong> provide your own Cloudflare AI Gateway API keys for the AI features to function. This is a security measure to protect our keys.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}