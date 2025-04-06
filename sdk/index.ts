import {
  createPublicClient,
  http,
  formatEther,
  parseEther,
  getContract,
  type PublicClient,
  type Address,
} from "viem";
import { mainnet } from "viem/chains";
import { EARTHSHOUT_ABI, VOID_CONTRACT_ADDRESS } from "./abi";

export class EarthshoutSDK {
  private client: PublicClient;
  private contractAddress: Address;

  /**
   * Create a new Earthshout SDK instance
   * @param {string} providerUrl - The Ethereum provider URL (e.g., Infura, Alchemy)
   */
  constructor(providerUrl: string) {
    this.client = createPublicClient({
      chain: mainnet,
      transport: http(providerUrl),
    });
    this.contractAddress = VOID_CONTRACT_ADDRESS;
  }

  /**
   * Listen for Earthshout messages
   * @param {Object} options - Options for filtering messages
   * @param {number} options.minEthBurned - Minimum ETH burned to filter messages
   * @param {Function} callback - Callback function to handle messages
   * @returns {Function} Unsubscribe function
   */
  listenForMessages(
    options: { minEthBurned?: number } = {},
    callback: (message: {
      sender: string;
      content: string;
      ethBurned: string;
      timestamp: Date;
      transactionHash: string;
    }) => void
  ): () => void {
    const { minEthBurned = 0 } = options;

    // Watch for Yeet events
    const unwatch = this.client.watchEvent({
      address: this.contractAddress,
      event: {
        type: "event",
        name: "Yeet",
        inputs: [
          { name: "token", type: "address", indexed: true },
          { name: "amount", type: "uint256", indexed: true },
          { name: "from", type: "address", indexed: true },
          { name: "yeetId", type: "uint256", indexed: false },
        ],
      },
      onLogs: async (logs) => {
        for (const log of logs) {
          const { token, amount, from, yeetId } = log.args;
          if (token && amount && from) {
            const ethAmount = formatEther(amount);

            // Filter messages by minimum ETH burned
            if (parseFloat(ethAmount) >= minEthBurned) {
              // Get transaction for message content
              const tx = await this.client.getTransaction({
                hash: log.transactionHash,
              });

              // Attempt to extract content from input data
              let content = tx.input || "";

              // Get block timestamp
              const block = await this.client.getBlock({
                blockNumber: log.blockNumber,
              });

              callback({
                sender: from,
                content,
                ethBurned: ethAmount,
                timestamp: new Date(Number(block.timestamp) * 1000),
                transactionHash: log.transactionHash,
              });
            }
          }
        }
      },
    });

    // Return unsubscribe function
    return unwatch;
  }

  /**
   * Get historical Earthshout messages
   * @param {Object} options - Options for filtering messages
   * @param {number} options.minEthBurned - Minimum ETH burned to filter messages
   * @param {number} options.fromBlock - Starting block number
   * @param {number} options.toBlock - Ending block number (defaults to 'latest')
   * @returns {Promise<Array>} Array of message objects
   */
  async getHistoricalMessages(
    options: {
      minEthBurned?: number;
      fromBlock?: number;
      toBlock?: number | "latest";
    } = {}
  ) {
    const { minEthBurned = 0, fromBlock = 0, toBlock = "latest" } = options;

    // Query historical events
    const logs = await this.client.getLogs({
      address: this.contractAddress,
      event: {
        type: "event",
        name: "Yeet",
        inputs: [
          { name: "token", type: "address", indexed: true },
          { name: "amount", type: "uint256", indexed: true },
          { name: "from", type: "address", indexed: true },
          { name: "yeetId", type: "uint256", indexed: false },
        ],
      },
      fromBlock: BigInt(fromBlock),
      toBlock: toBlock === "latest" ? undefined : BigInt(toBlock),
    });

    // Process and filter the events
    const messages = await Promise.all(
      logs.map(async (log) => {
        const { token, amount, from, yeetId } = log.args;
        if (token && amount && from) {
          const ethAmount = formatEther(amount);

          // Filter by minimum ETH burned
          if (parseFloat(ethAmount) >= minEthBurned) {
            const block = await this.client.getBlock({
              blockNumber: log.blockNumber,
            });

            const tx = await this.client.getTransaction({
              hash: log.transactionHash,
            });

            return {
              sender: from,
              content: tx.input || "",
              ethBurned: ethAmount,
              timestamp: new Date(Number(block.timestamp) * 1000),
              transactionHash: log.transactionHash,
              blockNumber: Number(log.blockNumber),
              blockTimestamp: new Date(Number(block.timestamp) * 1000),
            };
          }
        }

        return null;
      })
    );

    // Filter out null values and sort by timestamp (newest first)
    return messages
      .filter((msg) => msg !== null)
      .sort((a, b) => b!.timestamp.getTime() - a!.timestamp.getTime());
  }

  /**
   * Calculate the total ETH burned through Earthshout
   * @returns {Promise<string>} Total ETH burned in ETH
   */
  async getTotalEthBurned(): Promise<string> {
    // Get all Yeet events
    const logs = await this.client.getLogs({
      address: this.contractAddress,
      event: {
        type: "event",
        name: "Yeet",
        inputs: [
          { name: "token", type: "address", indexed: true },
          { name: "amount", type: "uint256", indexed: true },
          { name: "from", type: "address", indexed: true },
          { name: "yeetId", type: "uint256", indexed: false },
        ],
      },
    });

    // Sum up the ETH burned
    const totalBurned = logs.reduce((total, log) => {
      const amount = log.args.amount;
      return amount ? total + amount : total;
    }, BigInt(0));

    return formatEther(totalBurned);
  }

  /**
   * Get the top Earthshout messages by ETH burned
   * @param {number} limit - Maximum number of messages to return
   * @returns {Promise<Array>} Array of message objects
   */
  async getTopMessages(limit: number = 10) {
    // Get all messages
    const allMessages = await this.getHistoricalMessages();

    // Sort by ETH burned (highest first) and limit results
    return allMessages
      .sort((a, b) => parseFloat(b!.ethBurned) - parseFloat(a!.ethBurned))
      .slice(0, limit);
  }
}

// Export a function to create a new SDK instance
export function createEarthshoutSDK(providerUrl: string): EarthshoutSDK {
  return new EarthshoutSDK(providerUrl);
}
