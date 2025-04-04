import { useWallet } from '@/contexts/WalletContext';
import { Radio, Info, Flame, Zap } from 'lucide-react';
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
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full px-3 py-1 text-sm font-medium">
          <Flame className="h-4 w-4 mr-1" />
          Decentralized Messaging
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
        Broadcast your message to the <span className="text-primary relative">world
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
        </span>
      </h1>
      <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-6">
        <span className="text-amber-500 font-semibold">Burn ETH</span> to amplify your voice. The more you burn, the <span className="text-red-500 font-semibold">further your message travels</span>.
      </p>
      <div className="flex items-center justify-center mb-8 text-sm text-muted-foreground">
        <Zap className="h-4 w-4 mr-1 text-yellow-500" />
        <span>Powered by Ethereum Blockchain</span>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button 
          onClick={handleCreateShout}
          variant="default"
          size="lg"
          className="font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
        >
          <Radio className="h-4 w-4 mr-2" />
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
