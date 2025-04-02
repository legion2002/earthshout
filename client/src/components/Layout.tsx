import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WalletConnectModal from './modals/WalletConnectModal';
import CreateShoutModal from './modals/CreateShoutModal';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <WalletConnectModal />
      <CreateShoutModal />
      <Footer />
    </div>
  );
}
