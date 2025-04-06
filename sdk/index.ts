import { ethers } from 'ethers';

// ABI for the EarthShout contract
const EARTHSHOUT_ABI = [
  "function shout(string message) external payable",
  "event Shout(address indexed sender, string message, uint256 amount, uint256 timestamp)"
];

// This would be the deployed contract address in production
const EARTHSHOUT_CONTRACT_ADDRESS =
  "0xDB875C7987584ED9Ccec95da132501eCeB145b13";

export class EarthshoutSDK {
  private provider: ethers.Provider;
  private contract: ethers.Contract;

  /**
   * Create a new Earthshout SDK instance
   * @param {string} providerUrl - The Ethereum provider URL (e.g., Infura, Alchemy)
   */
  constructor(providerUrl: string) {
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    this.contract = new ethers.Contract(EARTHSHOUT_CONTRACT_ADDRESS, EARTHSHOUT_ABI, this.provider);
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

    // Create a filter for the Shout event
    const filter = this.contract.filters.Shout();

    // Event handler for the Shout event
    const handleShout = (sender: string, message: string, amount: bigint, timestamp: bigint, event: any) => {
      const ethAmount = ethers.formatEther(amount);
      
      // Filter messages by minimum ETH burned
      if (parseFloat(ethAmount) >= minEthBurned) {
        callback({
          sender,
          content: message,
          ethBurned: ethAmount,
          timestamp: new Date(Number(timestamp) * 1000),
          transactionHash: event.log.transactionHash
        });
      }
    };

    // Start listening for events
    this.contract.on(filter, handleShout);

    // Return unsubscribe function
    return () => {
      this.contract.off(filter, handleShout);
    };
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
      toBlock?: number | string;
    } = {}
  ) {
    const {
      minEthBurned = 0,
      fromBlock = 0,
      toBlock = 'latest'
    } = options;

    // Create a filter for the Shout event
    const filter = this.contract.filters.Shout();

    // Query historical events
    const events = await this.contract.queryFilter(
      filter,
      fromBlock,
      toBlock
    );

    // Process and filter the events
    const messages = await Promise.all(
      events.map(async (event: any) => {
        const [sender, message, amount, timestamp] = event.args || [];
        const ethAmount = ethers.formatEther(amount);
        
        // Filter by minimum ETH burned
        if (parseFloat(ethAmount) >= minEthBurned) {
          const block = await event.getBlock();
          
          return {
            sender,
            content: message,
            ethBurned: ethAmount,
            timestamp: new Date(Number(timestamp) * 1000),
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            blockTimestamp: new Date(block.timestamp * 1000)
          };
        }
        
        return null;
      })
    );

    // Filter out null values and sort by timestamp (newest first)
    return messages
      .filter(msg => msg !== null)
      .sort((a, b) => b!.timestamp.getTime() - a!.timestamp.getTime());
  }

  /**
   * Calculate the total ETH burned through Earthshout
   * @returns {Promise<string>} Total ETH burned in ETH
   */
  async getTotalEthBurned(): Promise<string> {
    // Get all Shout events
    const filter = this.contract.filters.Shout();
    const events = await this.contract.queryFilter(filter);
    
    // Sum up the ETH burned
    const totalBurned = events.reduce((total, event) => {
      const amount = event.args![2]; // The amount is the third argument
      return total + BigInt(amount.toString());
    }, BigInt(0));
    
    return ethers.formatEther(totalBurned);
  }

  /**
   * Get the top Earthshout messages by ETH burned
   * @param {number} limit - Maximum number of messages to return
   * @returns {Promise<Array>} Array of message objects
   */
  async getTopMessages(limit: number = 10) {
    // Get all Shout events
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
