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
    <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors duration-200 hover:shadow-lg hover:shadow-primary/10">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-background rounded-full w-10 h-10 flex items-center justify-center">
              <User className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="ml-3">
              <div className="font-medium text-foreground">
                {message.senderAddress.includes('.eth') 
                  ? message.senderAddress 
                  : truncateAddress(message.senderAddress)
                }
              </div>
              <div className="text-xs text-muted-foreground">{formattedDate}</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-primary to-primary/80 px-3 py-1 rounded-full text-primary-foreground text-sm font-mono font-medium">
            {message.ethBurned.toFixed(1)} ETH
          </div>
        </div>
        <div className="mb-4">
          <p className="text-foreground">{message.content}</p>
        </div>
        <div className="flex items-center text-muted-foreground text-sm">
          <button 
            className="flex items-center hover:text-foreground transition-colors duration-200"
            onClick={handleShare}
          >
            <Share className="h-4 w-4 mr-1" /> Share
          </button>
          <span className="mx-2">•</span>
          <span>
            <Eye className="h-4 w-4 mr-1 inline-block" /> {message.views.toLocaleString()} views
          </span>
          <span className="mx-2">•</span>
          <span className="text-emerald-500">
            <CheckCircle2 className="h-4 w-4 mr-1 inline-block" /> Verified
          </span>
        </div>
      </div>
    </div>
  );
}
