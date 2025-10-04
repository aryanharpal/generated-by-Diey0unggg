import React, { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/hooks/use-settings-store';
import { useCreditsStore } from '@/hooks/use-credits-store';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import { GeneratedContentCard } from '@/components/GeneratedContentCard';
import { Skeleton } from '@/components/ui/skeleton';
interface OptimizedContent {
  caption: string;
  hashtags: string[];
}
export function CaptionOptimizer() {
  const [draft, setDraft] = useState('');
  const [optimizedContent, setOptimizedContent] = useState<OptimizedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { niche, platforms, tone, openModal } = useSettingsStore(
    useShallow((state) => ({
      niche: state.niche,
      platforms: state.platforms,
      tone: state.tone,
      openModal: state.openModal,
    }))
  );
  const { credits, deductCredit } = useCreditsStore(
    useShallow((state) => ({
      credits: state.credits,
      deductCredit: state.deductCredit,
    }))
  );
  const handleOptimize = async () => {
    if (!niche || platforms.length === 0 || !tone) {
      toast.error('Missing Preferences', {
        description: 'Please set your niche, platforms, and tone in the settings first.',
        action: { label: 'Open Settings', onClick: openModal },
      });
      return;
    }
    if (!draft.trim()) {
      toast.warning('Draft caption is empty', {
        description: 'Please enter a caption to optimize.',
      });
      return;
    }
    if (credits <= 0) {
      toast.error("You're out of credits!", {
        description: 'Your credits will reset tomorrow. Upgrade for more.',
      });
      return;
    }
    setIsLoading(true);
    setOptimizedContent(null);
    try {
      const response = await fetch(`/api/chat/${chatService.getSessionId()}/generate-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft, settings: { niche, platforms, tone } }),
      });
      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      deductCredit();
      toast.success('Caption optimized!', { description: '1 credit was used.' });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }
      const parsedResult = JSON.parse(result);
      setOptimizedContent(parsedResult);
    } catch (error) {
      console.error('Failed to optimize caption:', error);
      toast.error('Optimization Failed', {
        description: 'Could not connect to the AI service. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="grid md:grid-cols-2 gap-8 h-full">
      <Card className="flex flex-col">
        <CardContent className="p-6 flex-grow flex flex-col">
          <div className="space-y-2 mb-4">
            <h2 className="text-lg font-semibold">Optimize Your Caption</h2>
            <p className="text-muted-foreground text-sm">
              Enter your draft caption below. We'll enhance it and suggest relevant hashtags.
            </p>
          </div>
          <div className="flex-grow flex flex-col">
            <Label htmlFor="draft-caption" className="mb-2">Draft Caption</Label>
            <Textarea
              id="draft-caption"
              placeholder="Write your caption here..."
              className="flex-grow resize-none text-base"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            size="lg"
            onClick={handleOptimize}
            disabled={isLoading}
            className="w-full mt-4 transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
          >
            {isLoading ? 'Optimizing...' : <><Sparkles className="mr-2 h-5 w-5" /> Optimize Caption</>}
          </Button>
        </CardContent>
      </Card>
      <div className="flex flex-col">
        {isLoading && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-1/4" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardContent>
          </Card>
        )}
        {optimizedContent && (
          <GeneratedContentCard
            icon={<Wand2 className="h-6 w-6 text-primary" />}
            title="Optimized Caption"
            description={optimizedContent.caption}
            contentToCopy={`Caption:\n${optimizedContent.caption}\n\nHashtags:\n${optimizedContent.hashtags.join(' ')}`}
            contentToDownload={{
              filename: 'optimized_caption',
              data: `Optimized Caption:\n\n${optimizedContent.caption}\n\nSuggested Hashtags:\n${optimizedContent.hashtags.join(' ')}`,
            }}
          />
        )}
        {!isLoading && !optimizedContent && (
          <Card className="w-full h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
            <div className="mx-auto bg-secondary p-3 rounded-full mb-4">
              <Wand2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Your optimized content will appear here</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter a draft and click "Optimize Caption".
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}