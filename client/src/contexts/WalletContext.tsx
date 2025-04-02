import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { connectWallet as connectEthereumWallet } from '@/lib/ethereum';
import { useToast } from '@/hooks/use-toast';

type WalletContextType = {
  address: string | null;
  isConnected: boolean;
  isWalletModalOpen: boolean;
  isCreateShoutModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  openCreateShoutModal: () => void;
  closeCreateShoutModal: () => void;
  connectWallet: (type: string) => Promise<void>;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isWalletModalOpen: false,
  isCreateShoutModalOpen: false,
  openWalletModal: () => {},
  closeWalletModal: () => {},
  openCreateShoutModal: () => {},
  closeCreateShoutModal: () => {},
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isCreateShoutModalOpen, setIsCreateShoutModalOpen] = useState(false);
  const { toast } = useToast();

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if we have a stored wallet address
        const storedAddress = localStorage.getItem('walletAddress');
        if (storedAddress) {
          setAddress(storedAddress);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkConnection();
  }, []);

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  const openCreateShoutModal = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      openWalletModal();
      return;
    }
    setIsCreateShoutModalOpen(true);
  };

  const closeCreateShoutModal = () => {
    setIsCreateShoutModalOpen(false);
  };

  const connectWallet = async (type: string) => {
    try {
      const walletAddress = await connectEthereumWallet(type);
      if (walletAddress) {
        setAddress(walletAddress);
        setIsConnected(true);
        localStorage.setItem('walletAddress', walletAddress);
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected",
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    localStorage.removeItem('walletAddress');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isWalletModalOpen,
        isCreateShoutModalOpen,
        openWalletModal,
        closeWalletModal,
        openCreateShoutModal,
        closeCreateShoutModal,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
