import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

// ABI for the EarthShout contract (this would be a complete ABI in production)
const EARTHSHOUT_ABI = [
  "function shout(string message) external payable",
  "event Shout(address indexed sender, string message, uint256 amount, uint256 timestamp)"
];

// This would be the deployed contract address in production
const EARTHSHOUT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

export async function getProvider(): Promise<ethers.BrowserProvider | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error("Ethereum provider not found");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  } catch (error) {
    console.error("Failed to create provider:", error);
    return null;
  }
}

export async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
  const provider = await getProvider();
  if (!provider) return null;

  try {
    const signer = await provider.getSigner();
    return signer;
  } catch (error) {
    console.error("Failed to get signer:", error);
    return null;
  }
}

export async function connectWallet(providerType: string = 'metamask'): Promise<string | null> {
  const provider = await getProvider();
  if (!provider) {
    throw new Error("No Ethereum provider found. Please install MetaMask or another wallet.");
  }

  try {
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw new Error("Failed to connect wallet. Please try again.");
  }
}

export async function createEarthshout(ethAmount: number, message: string) {
  const signer = await getSigner();
  if (!signer) {
    throw new Error("Please connect your wallet to send an Earthshout");
  }

  try {
    // In a real implementation, this would be a deployed contract
    // For demo, we'll simulate the transaction
    const contract = new ethers.Contract(EARTHSHOUT_CONTRACT_ADDRESS, EARTHSHOUT_ABI, signer);
    
    // Convert ETH to wei
    const value = ethers.parseEther(ethAmount.toString());
    
    // Call the contract's shout function
    // In a real implementation, this would be:
    // const tx = await contract.shout(message, { value });
    
    // For the demo, we'll simulate the transaction
    // This is a mock of what the transaction would look like
    // In production, use the real contract call above
    const mockTx = {
      hash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      wait: async () => ({
        status: 1,
        events: [
          {
            event: "Shout",
            args: {
              sender: await signer.getAddress(),
              message,
              amount: value,
              timestamp: Math.floor(Date.now() / 1000)
            }
          }
        ]
      })
    };
    
    return mockTx;
  } catch (error: any) {
    console.error("Error creating Earthshout:", error);
    throw new Error(error.message || "Failed to create Earthshout");
  }
}

export async function getEthBalance(address: string): Promise<string> {
  const provider = await getProvider();
  if (!provider || !address) return "0.0";

  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting ETH balance:", error);
    return "0.0";
  }
}
