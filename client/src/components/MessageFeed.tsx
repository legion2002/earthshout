import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, RefreshCw } from 'lucide-react';
import MessageCard from './MessageCard';
import type { Message } from '@shared/schema';

type MessageFeedProps = {
  minEth: number;
};

export default function MessageFeed({ minEth }: MessageFeedProps) {
  const [sortBy, setSortBy] = useState<string>("recent");

  const { data: messages, isLoading, isError, refetch } = useQuery<Message[]>({
    queryKey: ['/api/messages', minEth, sortBy],
    queryFn: async () => {
      const res = await fetch(`/api/messages?minEth=${minEth}&sortBy=${sortBy}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json();
    }
  });

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-60 flex-col">
        <p className="text-destructive mb-4">Failed to load messages</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-medium">Recent Earthshouts</h2>
        <div className="flex items-center">
          <span className="text-muted-foreground text-sm mr-2">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="eth">Highest ETH Burned</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {messages && messages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-muted rounded-lg">
          <p className="text-muted-foreground">No messages found matching your filter criteria.</p>
        </div>
      )}

      {messages && messages.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Load More
          </Button>
        </div>
      )}
    </section>
  );
}
