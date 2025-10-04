import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingsStore, Settings } from '@/hooks/use-settings-store';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
const settingsSchema = z.object({
  niche: z.string().min(3, { message: 'Niche must be at least 3 characters long.' }),
  platforms: z.array(z.string()).min(1, { message: 'Please select at least one platform.' }),
  tone: z.string().min(1, { message: 'Please select a tone.' }),
});
const PLATFORMS = ['Instagram', 'TikTok', 'Threads', 'YouTube', 'X (Twitter)', 'LinkedIn', 'Blog'];
const TONES = ['Funny', 'Educational', 'Motivational', 'Inspirational', 'Professional', 'Casual', 'Sarcastic'];
export function SettingsModal() {
  const { isModalOpen, closeModal, setSettings, niche, platforms, tone } = useSettingsStore(
    useShallow((state) => ({
      isModalOpen: state.isModalOpen,
      closeModal: state.closeModal,
      setSettings: state.setSettings,
      niche: state.niche,
      platforms: state.platforms,
      tone: state.tone,
    }))
  );
  const settings = { niche, platforms, tone };
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Settings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });
  useEffect(() => {
    reset({ niche, platforms, tone });
  }, [niche, platforms, tone, reset]);
  const onSubmit = (data: Settings) => {
    setSettings(data);
    closeModal();
    toast.success('Settings Saved!', {
      description: 'Your content preferences have been updated.',
    });
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Content Preferences</DialogTitle>
          <DialogDescription>
            Tell us about your content. This helps us generate more relevant ideas for you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="niche">Your Niche / Topic</Label>
            <Input
              id="niche"
              placeholder="e.g., Fitness, SaaS, Digital Art"
              {...register('niche')}
            />
            {errors.niche && <p className="text-sm text-red-500">{errors.niche.message}</p>}
          </div>
          <div className="grid gap-3">
            <Label>Target Platforms</Label>
            <Controller
              name="platforms"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  {PLATFORMS.map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={field.value?.includes(platform)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), platform]
                            : (field.value || []).filter((p) => p !== platform);
                          field.onChange(newValue);
                        }}
                      />
                      <Label htmlFor={platform} className="font-normal">
                        {platform}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.platforms && <p className="text-sm text-red-500">{errors.platforms.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tone">Tone of Voice</Label>
            <Controller
              name="tone"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tone && <p className="text-sm text-red-500">{errors.tone.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">Save Preferences</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}