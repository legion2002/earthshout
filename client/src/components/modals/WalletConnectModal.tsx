import { useWallet } from '@/contexts/WalletContext';
import { X, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function WalletConnectModal() {
  const { isWalletModalOpen, closeWalletModal, connectWallet } = useWallet();

  const handleConnectMetaMask = async () => {
    await connectWallet('metamask');
    closeWalletModal();
  };

  const handleConnectWalletConnect = async () => {
    await connectWallet('walletconnect');
    closeWalletModal();
  };

  const handleConnectCoinbase = async () => {
    await connectWallet('coinbase');
    closeWalletModal();
  };

  return (
    <Dialog open={isWalletModalOpen} onOpenChange={closeWalletModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium font-display">Connect Your Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-4">
          <Button
            variant="outline"
            className="flex items-center justify-between w-full p-6 hover:bg-muted"
            onClick={handleConnectMetaMask}
          >
            <div className="flex items-center">
              <div className="bg-amber-500 p-1 rounded-full h-8 w-8 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.527 4.5L12.0603 8.31163L13.3968 6.10496L18.527 4.5Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.42969 4.5L11.8375 8.36067L10.603 6.10496L5.42969 4.5Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.1732 15.8683L14.4062 18.8171L18.0992 20.0031L19.1582 15.9271L16.1732 15.8683Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.85156 15.9271L5.90078 20.0031L9.59383 18.8171L7.83672 15.8683L4.85156 15.9271Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.32602 10.5527L8.21973 12.3L11.8539 12.4863L11.7069 8.5293L9.32602 10.5527Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.6738 10.5527L12.2441 8.48022L12.0586 12.4863L15.6928 12.3L14.6738 10.5527Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.59375 18.8173L11.5595 17.5627L9.86328 15.9564L9.59375 18.8173Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.4395 17.5627L14.4053 18.8173L14.1358 15.9564L12.4395 17.5627Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="ml-3 font-medium">MetaMask</span>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-between w-full p-6 hover:bg-muted"
            onClick={handleConnectWalletConnect}
          >
            <div className="flex items-center">
              <div className="bg-blue-500 p-1 rounded-full h-8 w-8 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12.4895C9.31371 9.17578 14.6863 9.17578 18 12.4895M8.00002 14.4895C9.86288 12.6266 14.1372 12.6266 16 14.4895M2.00002 8.48948C7.52287 2.96663 16.4772 2.96663 22 8.48948" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="ml-3 font-medium">WalletConnect</span>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-between w-full p-6 hover:bg-muted"
            onClick={handleConnectCoinbase}
          >
            <div className="flex items-center">
              <div className="bg-blue-600 p-1 rounded-full h-8 w-8 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="white"/>
                  <path d="M8.57007 8.57007C7.61051 9.52963 7.08301 10.7295 7.00391 12.0001C6.92481 13.2706 7.30248 14.4705 8.05025 15.4301C8.79803 16.3897 9.8558 17.0312 11.0004 17.2403C12.145 17.4495 13.3151 17.208 14.2694 16.5665C15.2237 15.925 15.8955 14.9333 16.152 13.8057C16.4084 12.6781 16.2314 11.5015 15.6548 10.4991C15.0783 9.49672 14.1436 8.74926 13.0573 8.39051C11.9709 8.03176 10.8062 8.08649 9.75407 8.54607L11.3341 10.126C11.7973 10.032 12.2782 10.0911 12.6992 10.2941C13.1201 10.4971 13.4536 10.8319 13.6469 11.2426C13.8403 11.6534 13.882 12.1152 13.7651 12.5533C13.6482 12.9914 13.38 13.3784 13.0056 13.6527C12.6312 13.9271 12.1731 14.0724 11.7087 14.0651C11.2444 14.0578 10.7917 13.8982 10.427 13.6127C10.0623 13.3272 9.80742 12.9323 9.70513 12.4917C9.60284 12.0511 9.66002 11.5933 9.86807 11.1921L8.57007 9.89407V8.57007Z" fill="#0052FF"/>
                </svg>
              </div>
              <span className="ml-3 font-medium">Coinbase Wallet</span>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <DialogFooter className="flex justify-end">
          <Button variant="ghost" onClick={closeWalletModal}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
