import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useWallet } from '@/contexts/WalletContext';
import { Earth, Home, Flame, PlusCircle, Wallet, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';

export default function Navbar() {
  const [location] = useLocation();
  const { isConnected, address, openWalletModal } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-muted shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <Earth className="h-7 w-7 text-primary mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary/10 rounded-full scale-125 animate-ping opacity-40 duration-1000"></div>
                </div>
                <span className="font-display font-bold text-xl tracking-tight">
                  Earth<span className="text-primary relative">shout
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/40 rounded-full"></span>
                  </span>
                </span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                <Link href="/">
                  <a className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-muted/50 ${
                    location === '/' 
                      ? 'text-foreground bg-muted/60' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                    <Flame className={`h-4 w-4 mr-2 ${location === '/' ? 'text-red-500' : ''}`} />
                    Listen
                  </a>
                </Link>
                <Link href="/create-shout">
                  <a className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary/10 ${
                    location === '/create-shout' 
                      ? 'text-primary bg-primary/10' 
                      : 'text-primary/80 hover:text-primary'
                  }`}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Shout
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isConnected ? (
                <div className="flex items-center">
                  <Button variant="default" className="mr-3 bg-green-500/90 hover:bg-green-600 text-white">
                    <Wallet className="h-4 w-4 mr-2" />
                    {truncateAddress(address || '')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-primary rounded-md hover:bg-primary/10 border-primary/20"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={openWalletModal} 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              aria-label="Menu"
              className="hover:bg-muted/50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-muted bg-background/95 backdrop-blur-sm animate-in slide-in-from-top-5 duration-300">
          <div className="px-4 pt-2 pb-3 space-y-2 sm:px-4">
            <Link href="/">
              <a className={`flex items-center px-4 py-2.5 rounded-md text-base font-medium transition-colors ${
                location === '/' 
                  ? 'bg-muted/60 text-foreground' 
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              }`}>
                <Flame className={`h-5 w-5 mr-3 ${location === '/' ? 'text-red-500' : ''}`} />
                Listen
              </a>
            </Link>
            <Link href="/create-shout">
              <a className={`flex items-center px-4 py-2.5 rounded-md text-base font-medium transition-colors ${
                location === '/create-shout' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-primary/80 hover:bg-primary/5 hover:text-primary'
              }`}>
                <PlusCircle className="h-5 w-5 mr-3" />
                Shout
              </a>
            </Link>
            
            <div className="pt-2 border-t border-border/50 mt-3">
              {isConnected ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">{truncateAddress(address || '')}</span>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Connected</span>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={openWalletModal}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
