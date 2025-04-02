import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { WalletProvider } from '@/contexts/WalletContext';
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import TopShouts from "@/pages/TopShouts";
import CreateShout from "@/pages/CreateShout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/top-shouts" component={TopShouts} />
        <Route path="/create-shout" component={CreateShout} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Router />
        <Toaster />
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
