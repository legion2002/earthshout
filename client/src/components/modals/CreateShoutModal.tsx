import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWallet } from '@/contexts/WalletContext';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { createEarthshout } from '@/lib/ethereum';
import { Send, Info, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const createShoutSchema = z.object({
  ethAmount: z.string()
    .min(1, { message: "ETH amount is required" })
    .refine(value => !isNaN(parseFloat(value)), { message: "ETH amount must be a number" })
    .refine(value => parseFloat(value) >= 0.01, { message: "ETH amount must be at least 0.01" }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(500, { message: "Message cannot exceed 500 characters" }),
  confirmBurn: z.boolean().refine(value => value === true, {
    message: "You must confirm you want to burn ETH"
  })
});

type CreateShoutFormValues = z.infer<typeof createShoutSchema>;

export default function CreateShoutModal() {
  const { isCreateShoutModalOpen, closeCreateShoutModal, address, isConnected } = useWallet();
  const [currentEthPrice, setCurrentEthPrice] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch current ETH price
  const { data: ethPriceData } = useQuery({
    queryKey: ['/api/eth-price'],
    queryFn: async () => {
      const response = await fetch('/api/eth-price');
      if (!response.ok) throw new Error('Failed to fetch ETH price');
      return response.json();
    },
    enabled: isCreateShoutModalOpen
  });

  useEffect(() => {
    if (ethPriceData) {
      setCurrentEthPrice(ethPriceData.usd);
    }
  }, [ethPriceData]);

  const form = useForm<CreateShoutFormValues>({
    resolver: zodResolver(createShoutSchema),
    defaultValues: {
      ethAmount: '0.1',
      message: '',
      confirmBurn: false
    }
  });

  const { mutate: createMessage, isPending } = useMutation({
    mutationFn: async (data: {
      senderAddress: string;
      content: string;
      ethBurned: number;
      transactionHash: string;
    }) => {
      return apiRequest('POST', '/api/messages', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      toast({
        title: "Earthshout created!",
        description: "Your message has been broadcast to the world.",
      });
      form.reset();
      closeCreateShoutModal();
    },
    onError: (error) => {
      toast({
        title: "Failed to create Earthshout",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = async (data: CreateShoutFormValues) => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an Earthshout.",
        variant: "destructive",
      });
      return;
    }

    try {
      const ethAmount = parseFloat(data.ethAmount);
      // Call the contract to burn ETH
      const tx = await createEarthshout(ethAmount, data.message);
      
      // Save the message to our database
      createMessage({
        senderAddress: address,
        content: data.message,
        ethBurned: ethAmount,
        transactionHash: tx.hash
      });
    } catch (error: any) {
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to send transaction",
        variant: "destructive",
      });
    }
  };

  const ethAmount = parseFloat(form.watch('ethAmount') || '0');
  const messageText = form.watch('message') || '';
  const usdValue = isNaN(ethAmount) || !currentEthPrice ? 0 : ethAmount * currentEthPrice;

  return (
    <Dialog open={isCreateShoutModalOpen} onOpenChange={closeCreateShoutModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium font-display">Create New Earthshout</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="ethAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">ETH Amount to Burn</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        min="0.01" 
                        step="0.01"
                        {...field}
                        className="pr-12"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-muted-foreground">ETH</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    ≈ ${usdValue.toFixed(2)} USD
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Your Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What do you want to tell the world?" 
                      maxLength={500}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-muted-foreground">{messageText.length}/500</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert variant="outline" className="bg-background">
              <Info className="h-4 w-4 text-accent" />
              <AlertDescription>
                <h3 className="font-medium text-foreground mb-1">Important Information</h3>
                <p className="text-sm text-muted-foreground">ETH sent will be permanently burned, and cannot be recovered.</p>
                <p className="text-sm text-muted-foreground mt-1">Your message will be publicly viewable on the blockchain forever.</p>
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="confirmBurn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I understand and confirm I want to burn ETH
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={closeCreateShoutModal}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="bg-primary"
              >
                <Send className="h-4 w-4 mr-2" />
                Broadcast Earthshout
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
