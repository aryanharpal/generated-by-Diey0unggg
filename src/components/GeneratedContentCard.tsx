import { motion } from 'framer-motion';
import { Lightbulb, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
interface GeneratedContentCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  contentToCopy: string;
  contentToDownload: {
    filename: string;
    data: string;
  };
}
export function GeneratedContentCard({
  icon = <Lightbulb className="h-6 w-6 text-primary" />,
  title,
  description,
  contentToCopy,
  contentToDownload,
}: GeneratedContentCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(contentToCopy);
    toast.success('Copied to clipboard!');
  };
  const handleDownload = () => {
    const blob = new Blob([contentToDownload.data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contentToDownload.filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.info('Download started!');
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">{icon}</div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <Separator />
        <CardFooter className="p-4 flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy content">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download content">
            <Download className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}