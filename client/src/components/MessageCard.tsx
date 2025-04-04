import { Share, Eye, CheckCircle2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { truncateAddress } from '@/lib/utils';
import type { Message } from '@shared/schema';

type MessageCardProps = {
  message: Message;
};

export default function MessageCard({ message }: MessageCardProps) {
  const formattedDate = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Earthshout from ${message.senderAddress}`,
        text: message.content,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(message.content);
      alert('Message copied to clipboard!');
    }
  };

  return (
    <div className="bg-background rounded-md overflow-hidden border border-border hover:shadow-sm transition-all duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="border border-border rounded-full w-8 h-8 flex items-center justify-center">
              <User className="text-primary h-4 w-4" />
            </div>
            <div className="ml-2">
              <div className="font-medium text-foreground">
                {message.senderAddress.includes('.eth') 
                  ? message.senderAddress 
                  : truncateAddress(message.senderAddress)
                }
              </div>
              <div className="text-xs text-muted-foreground">{formattedDate}</div>
            </div>
          </div>
          <div className="border border-primary/30 px-2 py-1 rounded-md text-primary text-sm font-mono font-medium">
            {message.ethBurned.toFixed(1)} ETH
          </div>
        </div>
        <div className="mb-3">
          <p className="text-foreground">{message.content}</p>
        </div>
        <div className="flex items-center text-muted-foreground text-xs">
          <button 
            className="flex items-center hover:text-foreground transition-colors duration-200"
            onClick={handleShare}
          >
            <Share className="h-3 w-3 mr-1" /> Share
          </button>
          <span className="mx-2">•</span>
          <span>
            <Eye className="h-3 w-3 mr-1 inline-block" /> {message.views.toLocaleString()} views
          </span>
          <span className="mx-2">•</span>
          <span className="text-primary">
            <CheckCircle2 className="h-3 w-3 mr-1 inline-block" /> Verified
          </span>
        </div>
      </div>
    </div>
  );
}
