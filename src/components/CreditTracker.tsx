import { Coins } from 'lucide-react';
import { useCreditsStore } from '@/hooks/use-credits-store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export function CreditTracker() {
  const credits = useCreditsStore((state) => state.credits);
  const handleUpgrade = () => {
    toast.info('Upgrade to Pro!', {
      description: 'More features and unlimited credits are coming soon.',
      action: {
        label: 'Notify Me',
        onClick: () => toast.success("We'll let you know when Pro is available!"),
      },
    });
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-secondary px-3 py-1.5 rounded-full">
        <Coins className="h-4 w-4 text-primary" />
        <span>{credits} Credits Left</span>
      </div>
      {credits < 5 && (
        <Button size="sm" onClick={handleUpgrade}>
          Upgrade
        </Button>
      )}
    </div>
  );
}