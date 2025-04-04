// No longer need useEffect
import { useLocation } from 'wouter';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Wallet, ArrowRight } from 'lucide-react';

export default function CreateShout() {
  const [, setLocation] = useLocation();
  const { isConnected, openWalletModal, openCreateShoutModal } = useWallet();

  // We no longer automatically open the modal when wallet is connected
  // Users will need to click the "Create Earthshout" button

  const handleCreateShout = () => {
    if (isConnected) {
      openCreateShoutModal();
    } else {
      openWalletModal();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Create Earthshout</h1>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              You need to connect your Ethereum wallet to create an Earthshout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={openWalletModal}
              className="w-full"
            >
              <Wallet className="h-5 w-5 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Creating an Earthshout involves burning ETH to broadcast your message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary/10 rounded-full p-2 mr-4">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">1. Connect Wallet</h3>
                  <p className="text-muted-foreground text-sm">
                    Connect your Ethereum wallet to get started.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary/10 rounded-full p-2 mr-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">2. Compose Message</h3>
                  <p className="text-muted-foreground text-sm">
                    Write your message and decide how much ETH to burn.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary/10 rounded-full p-2 mr-4">
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">3. Broadcast</h3>
                  <p className="text-muted-foreground text-sm">
                    Confirm the transaction to broadcast your message.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ready to Create?</CardTitle>
              <CardDescription>
                Create your Earthshout and broadcast it to the world
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleCreateShout}
                className="w-full"
              >
                Create Earthshout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
