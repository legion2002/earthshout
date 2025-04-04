import { Share, User, ExternalLink } from 'lucide-react';
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
    <div className="bg-background rounded-lg overflow-hidden border border-border hover:shadow-sm transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="bg-muted/40 border border-border rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
              <User className="text-primary h-5 w-5" />
            </div>
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <div className="font-medium text-foreground flex items-center">
                  {message.senderAddress.includes('.eth') 
                    ? message.senderAddress 
                    : truncateAddress(message.senderAddress)
                  }

                </div>
                <div className="text-xs text-muted-foreground">{formattedDate}</div>
              </div>
              
              <div className="flex-shrink-0 bg-primary/5 border border-primary/30 px-2.5 py-1 rounded-full text-primary text-sm font-mono font-medium">
                {message.ethBurned.toFixed(1)} ETH
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-foreground">{message.content}</p>
            </div>
            
            <div className="flex items-center text-muted-foreground text-xs mt-2">
              <button 
                className="flex items-center hover:text-foreground transition-colors duration-200"
                onClick={handleShare}
              >
                <Share className="h-3 w-3 mr-1" /> Share
              </button>
              <span className="mx-2">•</span>
              <a 
                href={`https://etherscan.io/address/${message.senderAddress}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-foreground transition-colors duration-200"
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Etherscan
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
