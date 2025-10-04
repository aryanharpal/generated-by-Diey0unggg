import React, { useState } from 'react';
import { Repeat, Sparkles, Bot, FileText, Mic, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettingsStore } from '@/hooks/use-settings-store';
import { useCreditsStore } from '@/hooks/use-credits-store';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import { GeneratedContentCard } from '@/components/GeneratedContentCard';
import { Skeleton } from '@/components/ui/skeleton';
const FORMATS = [
  { id: 'twitter_thread', label: 'Twitter Thread', icon: <Bot className="h-4 w-4" /> },
  { id: 'blog_post', label: 'Blog Post', icon: <FileText className="h-4 w-4" /> },
  { id: 'linkedin_post', label: 'LinkedIn Post', icon: <Bot className="h-4 w-4" /> },
  { id: 'tiktok_script', label: 'TikTok Script', icon: <Mic className="h-4 w-4" /> },
  { id: 'youtube_script', label: 'YouTube Script', icon: <Film className="h-4 w-4" /> },
];
interface RepurposedContent {
  id: string;
  format: string;
  content: string;
}
export function Repurposer() {
  const [sourceContent, setSourceContent] = useState('');
  const [targetFormats, setTargetFormats] = useState<string[]>([]);
  const [repurposedContent, setRepurposedContent] = useState<RepurposedContent[]>([]);
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
  const handleFormatChange = (formatId: string, checked: boolean) => {
    setTargetFormats(prev =>
      checked ? [...prev, formatId] : prev.filter(id => id !== formatId)
    );
  };
  const handleRepurpose = async () => {
    if (!niche || platforms.length === 0 || !tone) {
      toast.error('Missing Preferences', {
        description: 'Please set your niche, platforms, and tone in the settings first.',
        action: { label: 'Open Settings', onClick: openModal },
      });
      return;
    }
    if (!sourceContent.trim()) {
      toast.warning('Source content is empty', { description: 'Please enter content to repurpose.' });
      return;
    }
    if (targetFormats.length === 0) {
      toast.warning('No formats selected', { description: 'Please select at least one target format.' });
      return;
    }
    if (credits < targetFormats.length) {
      toast.error("Not enough credits!", {
        description: `You need ${targetFormats.length} credits but only have ${credits}. Your credits will reset tomorrow.`,
      });
      return;
    }
    setIsLoading(true);
    setRepurposedContent([]);
    try {
      const response = await fetch(`/api/chat/${chatService.getSessionId()}/repurpose-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceContent,
          targetFormats,
          settings: { niche, platforms, tone },
        }),
      });
      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      for (let i = 0; i < targetFormats.length; i++) {
        deductCredit();
      }
      toast.success('Content repurposed!', { description: `${targetFormats.length} credits were used.` });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('___REPURPOSE_SEPARATOR___');
        buffer = parts.pop() || '';
        for (const part of parts) {
          if (part.trim()) {
            try {
              const newContent = JSON.parse(part);
              setRepurposedContent(prev => [...prev, { ...newContent, id: crypto.randomUUID() }]);
            } catch (e) {
              console.error('Failed to parse repurposed content JSON:', part, e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to repurpose content:', error);
      toast.error('Repurposing Failed', {
        description: 'Could not connect to the AI service. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full">
      <Card className="flex flex-col">
        <CardContent className="p-6 flex-grow flex flex-col">
          <div className="space-y-2 mb-4">
            <h2 className="text-lg font-semibold">Repurpose Content</h2>
            <p className="text-muted-foreground text-sm">
              Paste your content, select target formats, and let AI do the rest. Each format costs 1 credit.
            </p>
          </div>
          <div className="flex-grow flex flex-col mb-4">
            <Label htmlFor="source-content" className="mb-2">Source Content</Label>
            <Textarea
              id="source-content"
              placeholder="Paste your blog post, video transcript, or notes here..."
              className="flex-grow resize-none text-base"
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Target Formats</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FORMATS.map(format => (
                <div key={format.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={format.id}
                    onCheckedChange={(checked) => handleFormatChange(format.id, !!checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor={format.id} className="font-normal flex items-center gap-2">
                    {format.icon} {format.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleRepurpose}
            disabled={isLoading}
            className="w-full mt-6 transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
          >
            {isLoading ? 'Repurposing...' : <><Sparkles className="mr-2 h-5 w-5" /> Repurpose</>}
          </Button>
        </CardContent>
      </Card>
      <div className="flex flex-col space-y-4 overflow-y-auto">
        {isLoading && repurposedContent.length === 0 && Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
        {repurposedContent.map(item => (
          <GeneratedContentCard
            key={item.id}
            icon={<Repeat className="h-6 w-6 text-primary" />}
            title={FORMATS.find(f => f.id === item.format)?.label || 'Repurposed Content'}
            description={item.content}
            contentToCopy={item.content}
            contentToDownload={{
              filename: `repurposed_${item.format}`,
              data: `Format: ${item.format}\n\n${item.content}`,
            }}
          />
        ))}
        {!isLoading && repurposedContent.length === 0 && (
          <Card className="w-full h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
            <div className="mx-auto bg-secondary p-3 rounded-full mb-4">
              <Repeat className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Your repurposed content will appear here</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add content, select formats, and click "Repurpose".
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}