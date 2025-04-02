import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from 'lucide-react';
import MessageCard from '@/components/MessageCard';
import type { Message } from '@shared/schema';

export default function TopShouts() {
  const [timeFrame, setTimeFrame] = useState<string>("all");
  const [minEth, setMinEth] = useState<number>(1);

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages', minEth, 'eth'],
    queryFn: async () => {
      const res = await fetch(`/api/messages?minEth=${minEth}&sortBy=eth`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json();
    }
  });

  const handleMinEthChange = (value: string) => {
    setMinEth(parseFloat(value));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Top Earthshouts</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Top Messages</CardTitle>
          <CardDescription>
            View the most impactful Earthshouts based on ETH burned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Time Frame</label>
              <Tabs defaultValue="all" value={timeFrame} onValueChange={setTimeFrame} className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="day">Last Day</TabsTrigger>
                  <TabsTrigger value="week">Last Week</TabsTrigger>
                  <TabsTrigger value="all">All Time</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Minimum ETH Burned</label>
              <Select defaultValue="1" onValueChange={handleMinEthChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select minimum ETH" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1 ETH</SelectItem>
                  <SelectItem value="1">1 ETH</SelectItem>
                  <SelectItem value="5">5 ETH</SelectItem>
                  <SelectItem value="10">10 ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <TabsContent value={timeFrame} forceMount={true} className="mt-0">
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
        </TabsContent>
      </div>
    </div>
  );
}
