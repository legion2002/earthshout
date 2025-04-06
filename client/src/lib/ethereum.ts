import {
  createWalletClient,
  createPublicClient,
  http,
  custom,
  parseEther,
  formatEther,
  getContract,
  type WalletClient,
  type PublicClient,
} from "viem";
import { mainnet } from "viem/chains";
import {
  VOID_CONTRACT_ADDRESS,
  VOID_CONTRACT_ABI,
} from "@/constants/contracts";

// Add window.ethereum type declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}

export function getPublicClient(): PublicClient | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return createPublicClient({
      chain: mainnet,
      transport: http(),
    });
  } catch (error) {
    console.error("Failed to create public client:", error);
    return null;
  }
}

export function getWalletClient(): WalletClient | null {
  if (typeof window === "undefined" || !window.ethereum) {
    console.error("Ethereum provider not found");
    return null;
  }

  try {
    return createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum),
    });
  } catch (error) {
    console.error("Failed to create wallet client:", error);
    return null;
  }
}

export async function connectWallet(): Promise<`0x${string}` | null> {
  const walletClient = getWalletClient();
  if (!walletClient) {
    throw new Error(
      "No Ethereum provider found. Please install MetaMask or another wallet."
    );
  }

  try {
    const [address] = await walletClient.requestAddresses();
    return address;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw new Error("Failed to connect wallet. Please try again.");
  }
}

export async function createYeet(
  tokenAddress: `0x${string}`,
  amount: string,
  message: string
) {
  const walletClient = getWalletClient();
  const publicClient = getPublicClient();

  if (!walletClient || !publicClient) {
    throw new Error("Please connect your wallet to send a Yeet");
  }

  try {
    // Get the connected account
    const [account] = await walletClient.getAddresses();

    // Encode the message as bytes
    const messageBytes = message
      ? (`0x${Buffer.from(message).toString("hex")}` as `0x${string}`)
      : ("0x" as `0x${string}`);

    // Convert amount to wei
    const amountInWei = parseEther(amount);

    // Use type assertion to make TypeScript happy
    // The actual function name in the contract is "shout" but we're calling it "yeet" in our UI for consistency
    const hash = await walletClient.writeContract({
      account,
      address: VOID_CONTRACT_ADDRESS as `0x${string}`,
      abi: VOID_CONTRACT_ABI,
      functionName: "shout" as any,
      args: [tokenAddress, amountInWei, messageBytes] as any,
      chain: mainnet,
    });

    // Wait for the transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return {
      hash,
      receipt,
    };
  } catch (error: any) {
    console.error("Error creating Yeet:", error);
    throw new Error(error.message || "Failed to create Yeet");
  }
}

export async function getEthBalance(address: `0x${string}`): Promise<string> {
  const publicClient = getPublicClient();
  if (!publicClient || !address) return "0.0";

  try {
    const balance = await publicClient.getBalance({ address });
    return formatEther(balance);
  } catch (error) {
    console.error("Error getting ETH balance:", error);
    return "0.0";
  }
}
