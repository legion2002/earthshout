import { useWallet } from '@/contexts/WalletContext';
import { Broadcast, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const { openCreateShoutModal, openWalletModal, isConnected } = useWallet();
  
  const handleCreateShout = () => {
    if (isConnected) {
      openCreateShoutModal();
    } else {
      openWalletModal();
    }
  };

  return (
    <section className="mb-12 text-center py-8">
      <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
        Broadcast your message to the <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">world</span>
      </h1>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
        Burn ETH to amplify your voice. The more you burn, the further your message travels.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button 
          onClick={handleCreateShout}
          className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3"
        >
          <Broadcast className="h-5 w-5 mr-2" />
          Create Earthshout
        </Button>
        <Button 
          variant="outline"
          className="px-6 py-3"
        >
          <Info className="h-5 w-5 mr-2" />
          Learn More
        </Button>
      </div>
    </section>
  );
}
