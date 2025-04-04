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
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/">
                  <a className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}>
                    <Flame className="h-4 w-4 mr-2" />
                    Listen
                  </a>
                </Link>
                <Link href="/create-shout">
                  <a className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location === '/create-shout' ? 'text-primary' : 'text-primary hover:text-foreground'
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/">
              <a className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                location === '/' ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                <Flame className="h-5 w-5 mr-2" />
                Listen
              </a>
            </Link>
            <Link href="/create-shout">
              <a className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                location === '/create-shout' ? 'text-primary' : 'text-primary'
              }`}>
                <PlusCircle className="h-5 w-5 mr-2" />
                Shout
              </a>
            </Link>
            {!isConnected && (
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
