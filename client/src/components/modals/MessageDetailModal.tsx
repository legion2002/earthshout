import { Share, User, ExternalLink, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { truncateAddress } from "@/lib/utils";
import type { Message } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type MessageDetailModalProps = {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function MessageDetailModal({
  message,
  isOpen,
  onClose,
}: MessageDetailModalProps) {
  if (!message) return null;

  const formattedDate = message.timestamp
    ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
    : "Unknown date";

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Earthshout from ${message.senderAddress}`,
          text: message.content,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(message.content);
      alert("Message copied to clipboard!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <DialogHeader>
          <DialogTitle className="text-base font-medium font-display">
            Earthshout
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detailed view of an Earthshout message
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="bg-muted/40 border border-border rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                <User className="text-primary h-6 w-6" />
              </div>
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <div className="font-medium text-foreground text-lg">
                    {message.senderAddress.includes(".eth")
                      ? message.senderAddress
                      : truncateAddress(message.senderAddress)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formattedDate}
                  </div>
                </div>

                <div className="flex-shrink-0 bg-primary/5 border border-primary/30 px-3 py-1.5 rounded-full text-primary font-mono font-medium">
                  {message.amountBurned.toFixed(2)} ETH
                </div>
              </div>

              <div className="mb-5 px-1 py-2">
                <p className="text-foreground whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>

              <div className="flex items-center text-muted-foreground text-sm mt-4 border-t border-border pt-4">
                <button
                  className="flex items-center hover:text-foreground transition-colors duration-200"
                  onClick={handleShare}
                >
                  <Share className="h-4 w-4 mr-2" /> Share
                </button>
                <span className="mx-3">•</span>
                <a
                  href={`https://etherscan.io/address/${message.senderAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-foreground transition-colors duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> View on Etherscan
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
