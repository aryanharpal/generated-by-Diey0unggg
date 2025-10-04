import { Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/hooks/use-settings-store';
import { CreditTracker } from '@/components/CreditTracker';
export function AppHeader() {
  const openModal = useSettingsStore((state) => state.openModal);
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">AmplifyAI</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <CreditTracker />
            <Button variant="ghost" size="icon" onClick={openModal} aria-label="Open settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}