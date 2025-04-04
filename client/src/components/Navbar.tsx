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
    <nav className="sticky top-0 z-50 bg-background border-b border-muted">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Earth className="h-6 w-6 text-primary mr-2" />
                <span className="font-display font-bold text-xl">Earth<span className="text-primary">shout</span></span>
              </Link>
            </div>
          </div>
          
          {/* Centered navigation tabs */}
          <div className="hidden md:flex items-center justify-center flex-grow mx-4">
            <div className="inline-flex bg-muted/30 rounded-full p-1 shadow-sm border border-border">
              <Link 
                href="/"
                className={`flex items-center px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  location === '/' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                }`}
              >
                <Flame className="h-4 w-4 mr-2" />
                Listen
              </Link>
              <Link 
                href="/create-shout"
                className={`flex items-center px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  location === '/create-shout' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                }`}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Shout
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {location === '/create-shout' && (
                <>
                  {isConnected ? (
                    <div className="flex items-center">
                      <Button variant="default" className="mr-3">
                        <Wallet className="h-4 w-4 mr-2" />
                        {truncateAddress(address || '')}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-primary rounded-md"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={openWalletModal}>
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-muted">
          <div className="p-3 space-y-2">
            <div className="bg-muted/30 rounded-lg p-1.5 shadow-sm border border-border flex flex-col">
              <Link 
                href="/"
                className={`flex items-center px-4 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  location === '/' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                }`}
              >
                <Flame className="h-5 w-5 mr-2" />
                Listen
              </Link>
              <Link 
                href="/create-shout"
                className={`flex items-center px-4 py-2 rounded-md text-base font-medium transition-all duration-200 mt-1 ${
                  location === '/create-shout' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                }`}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Shout
              </Link>
            </div>
            {location === '/create-shout' && !isConnected && (
              <Button 
                onClick={openWalletModal}
                className="w-full mt-2"
              >
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
