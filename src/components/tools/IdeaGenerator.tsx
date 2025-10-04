import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettingsStore } from '@/hooks/use-settings-store';
import { useCreditsStore } from '@/hooks/use-credits-store';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import { GeneratedContentCard } from '@/components/GeneratedContentCard';
interface Idea {
  id: string;
  title: string;
  description: string;
}
export function IdeaGenerator() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
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
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (resultsRef.current && ideas.length > 0) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [ideas]);
  const handleGenerateIdeas = async () => {
    if (!niche || platforms.length === 0 || !tone) {
      toast.error('Missing Preferences', {
        description: 'Please set your niche, platforms, and tone in the settings first.',
        action: {
          label: 'Open Settings',
          onClick: openModal,
        },
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
    setIdeas([]);
    try {
      const response = await fetch(`/api/chat/${chatService.getSessionId()}/generate-ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { niche, platforms, tone } }),
      });
      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      deductCredit();
      toast.success('Ideas generated!', { description: '1 credit was used.' });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('___IDEA_SEPARATOR___');
        buffer = parts.pop() || '';
        for (const part of parts) {
          if (part.trim()) {
            try {
              const newIdea = JSON.parse(part);
              setIdeas((prev) => [...prev, { ...newIdea, id: crypto.randomUUID() }]);
            } catch (e) {
              console.error('Failed to parse idea JSON:', part, e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      toast.error('Generation Failed', {
        description: 'Could not connect to the AI service. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <Card className="flex-shrink-0">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold">Generate Content Ideas</h2>
            <p className="text-muted-foreground text-sm">
              Click the button to generate 10 fresh content ideas based on your settings.
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleGenerateIdeas}
            disabled={isLoading}
            className="w-full md:w-auto transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
          >
            {isLoading ? 'Generating...' : <><Sparkles className="mr-2 h-5 w-5" /> Generate Ideas</>}
          </Button>
        </CardContent>
      </Card>
      <div className="flex-grow mt-8 overflow-y-auto" ref={resultsRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading && ideas.length === 0 && Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-start gap-4 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardHeader>
            </Card>
          ))}
          {ideas.map((idea) => (
            <GeneratedContentCard
              key={idea.id}
              title={idea.title}
              description={idea.description}
              contentToCopy={`Title: ${idea.title}\n\nDescription: ${idea.description}`}
              contentToDownload={{
                filename: idea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
                data: `Content Idea\n\nTitle: ${idea.title}\n\nDescription: ${idea.description}`,
              }}
            />
          ))}
        </div>
        {!isLoading && ideas.length === 0 && (
          <div className="text-center py-16">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Your ideas will appear here</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "Generate Ideas" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}