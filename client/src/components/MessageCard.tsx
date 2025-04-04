import { Share, Eye, CheckCircle2, User, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn, truncateAddress } from '@/lib/utils';
import type { Message } from '@shared/schema';

type MessageCardProps = {
  message: Message;
};

export default function MessageCard({ message }: MessageCardProps) {
  const formattedDate = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });
  
  // Get color based on ETH burned amount
  const getUrgencyColor = (ethAmount: number) => {
    if (ethAmount >= 10) return 'text-red-600 border-red-600'; // Very urgent
    if (ethAmount >= 5) return 'text-orange-500 border-orange-500'; // Urgent
    if (ethAmount >= 2) return 'text-yellow-600 border-yellow-600'; // Important
    if (ethAmount >= 1) return 'text-green-600 border-green-600'; // Moderate
    return 'text-primary border-primary/30'; // Regular
  };
  
  // Get background highlight for cards with high ETH amount
  const getCardHighlight = (ethAmount: number) => {
    if (ethAmount >= 10) return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10';
    if (ethAmount >= 5) return 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
    if (ethAmount >= 2) return 'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
    if (ethAmount >= 1) return 'border-l-4 border-l-green-500';
    return '';
  };
  
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
    <div className={cn(
      "bg-background rounded-md overflow-hidden border border-border hover:shadow-sm transition-all duration-200",
      getCardHighlight(message.ethBurned)
    )}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className={cn(
              "border rounded-full w-8 h-8 flex items-center justify-center",
              message.ethBurned >= 5 ? "border-red-400" : "border-border"
            )}>
              {message.ethBurned >= 5 ? (
                <Flame className="text-red-500 h-4 w-4" />
              ) : (
                <User className="text-primary h-4 w-4" />
              )}
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
          <div className={cn(
            "flex items-center px-2.5 py-1.5 rounded-md text-sm font-mono font-semibold shadow-sm",
            message.ethBurned >= 10 ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse" :
            message.ethBurned >= 5 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" :
            message.ethBurned >= 2 ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" :
            message.ethBurned >= 1 ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
            "bg-primary/10 text-primary"
          )}>
            <Flame className="h-3.5 w-3.5 mr-1.5" />
            {message.ethBurned.toFixed(1)} ETH
          </div>
        </div>
        <div className="mb-3">
          <p className={cn(
            "text-foreground py-1 px-2 rounded",
            message.ethBurned >= 10 ? "font-medium text-lg" : "",
            message.ethBurned >= 5 ? "bg-white dark:bg-gray-800 shadow-sm" : ""
          )}>
            {message.ethBurned >= 10 && <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-1.5 py-0.5 rounded-full mr-2 align-middle">URGENT</span>}
            {message.content}
          </p>
        </div>
        <div className="flex items-center justify-between text-muted-foreground text-xs border-t pt-3 mt-3 border-dashed border-border">
          <div className="flex items-center space-x-3">
            <button 
              className="flex items-center hover:text-foreground transition-colors duration-200 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded"
              onClick={handleShare}
            >
              <Share className="h-3 w-3 mr-1" /> Share
            </button>
            
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1 inline-block" /> 
              <span className="font-medium">{message.views.toLocaleString()}</span> views
            </span>
          </div>
          
          <span className={cn(
            "flex items-center px-2 py-0.5 rounded-full text-xs",
            message.ethBurned >= 5 
              ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400" 
              : "bg-primary/10 text-primary"
          )}>
            <CheckCircle2 className="h-3 w-3 mr-1 inline-block" /> Verified on Chain
          </span>
        </div>
      </div>
    </div>
  );
}
