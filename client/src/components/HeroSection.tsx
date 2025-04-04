import { useWallet } from '@/contexts/WalletContext';
import { Megaphone, Info } from 'lucide-react';
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
    <section className="mb-10 text-center py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
        Broadcast your message to the <span className="text-primary">world</span>
      </h1>
      <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8">
        Burn ETH to amplify your voice. The more you burn, the further your message travels.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button 
          onClick={handleCreateShout}
          variant="default"
          size="lg"
          className="font-medium"
        >
          <Megaphone className="h-4 w-4 mr-2" />
          Create Earthshout
        </Button>
        <Button 
          variant="outline"
          size="lg"
          className="font-medium"
        >
          <Info className="h-4 w-4 mr-2" />
          Learn More
        </Button>
      </div>
    </section>
  );
}
