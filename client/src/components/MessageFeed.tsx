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
  const [sortBy, setSortBy] = useState<string>("eth");

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
      <div className="flex justify-center items-center h-40">
        <Loader className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-40 flex-col">
        <p className="text-muted-foreground mb-3">Failed to load messages</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h2 className="text-xl font-display font-medium">
          {sortBy === 'eth' && 'Top Earthshouts'}
          {sortBy === 'recent' && 'Recent Earthshouts'}
        </h2>
        <div className="flex items-center">
          <span className="text-muted-foreground text-sm mr-2">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eth">Most Burned</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {messages && messages.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-border rounded-md">
          <p className="text-muted-foreground">No messages found matching your filter criteria.</p>
        </div>
      )}

      {messages && messages.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="text-sm">
            <RefreshCw className="h-3 w-3 mr-2" />
            Load More
          </Button>
        </div>
      )}
    </section>
  );
}
