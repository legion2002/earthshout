import {
  createPublicClient,
  http,
  decodeEventLog,
  formatEther,
  parseAbiItem,
  toHex,
  getAddress,
  type PublicClient,
  decodeAbiParameters,
  getContract,
  toBytes,
  stringToHex,
  hexToString,
} from "viem";
import { mainnet } from "viem/chains";
import { storage } from "./storage";
import {
  VOID_CONTRACT_ADDRESS,
  VOID_CONTRACT_ABI,
  DEFAULT_CHAIN_ID,
  POLLING_INTERVAL,
  CONFIRMATION_BLOCKS,
} from "./constants/contracts";

// Helper functions for event signatures
const YEET_EVENT = parseAbiItem(
  "event Yeet(address indexed token, uint256 indexed amount, address indexed from, uint256 yeetId)"
);
const GIFT_EVENT = parseAbiItem(
  "event Gift(address indexed token, uint256 indexed amount, address indexed to, address from, uint256 yeetId)"
);
const BOOST_EVENT = parseAbiItem(
  "event Boost(uint256 indexed yeetId, address indexed token, uint256 indexed amount)"
);

export class VoidIndexer {
  private client: PublicClient;
  private chainId: number;
  private isRunning = false;
  private unwatch?: () => void;

  constructor(rpcUrl: string, chainId: number = DEFAULT_CHAIN_ID) {
    this.client = createPublicClient({
      chain:
        chainId === 1
          ? mainnet
          : {
              id: chainId,
              name: `Chain ${chainId}`,
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: {
                default: { http: [rpcUrl] },
                public: { http: [rpcUrl] },
              },
            },
      transport: http(rpcUrl),
    });
    this.chainId = chainId;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log(`Starting Void Indexer on chain ${this.chainId}`);

    // Get the last indexed block from the database
    const indexerState = await storage.getLatestIndexerState(this.chainId);
    let lastBlockNumber = indexerState?.lastBlockNumber || 0;

    // If starting fresh, use current block - 1000 blocks
    if (lastBlockNumber === 0) {
      const currentBlock = await this.client.getBlockNumber();
      lastBlockNumber = Math.max(0, Number(currentBlock) - 1000);
      console.log(`Starting indexing from block ${lastBlockNumber}`);
    }

    // Start listening for new events
    this.setupEventListeners();

    // Initial catch-up indexing
    await this.indexHistoricalEvents(lastBlockNumber);

    // Continue polling for new blocks
    this.startPolling();
  }

  private setupEventListeners() {
    // Create a combined unwatcher for all event listeners
    const unwatchYeet = this.client.watchEvent({
      address: VOID_CONTRACT_ADDRESS,
      event: YEET_EVENT,
      onLogs: async (logs: any[]) => {
        for (const log of logs) {
          try {
            const { token, amount, from, yeetId } = log.args;
            if (token && amount && from && yeetId !== undefined) {
              await this.handleYeetEvent(token, amount, from, yeetId, log);
            }
          } catch (error) {
            console.error("Error processing Yeet event:", error);
          }
        }
      },
    });

    const unwatchGift = this.client.watchEvent({
      address: VOID_CONTRACT_ADDRESS,
      event: GIFT_EVENT,
      onLogs: async (logs: any[]) => {
        for (const log of logs) {
          try {
            const { token, amount, to, from, yeetId } = log.args;
            if (token && amount && to && from && yeetId !== undefined) {
              await this.handleGiftEvent(token, amount, to, from, yeetId, log);
            }
          } catch (error) {
            console.error("Error processing Gift event:", error);
          }
        }
      },
    });

    const unwatchBoost = this.client.watchEvent({
      address: VOID_CONTRACT_ADDRESS,
      event: BOOST_EVENT,
      onLogs: async (logs: any[]) => {
        for (const log of logs) {
          try {
            const { yeetId, token, amount } = log.args;
            if (yeetId !== undefined && token && amount) {
              await this.handleBoostEvent(yeetId, token, amount, log);
            }
          } catch (error) {
            console.error("Error processing Boost event:", error);
          }
        }
      },
    });

    // Combine unwatch functions
    this.unwatch = () => {
      unwatchYeet();
      unwatchGift();
      unwatchBoost();
    };
  }

  private async handleYeetEvent(
    token: `0x${string}`,
    amount: bigint,
    from: `0x${string}`,
    yeetId: bigint,
    log: any
  ) {
    const eventBlock = await this.client.getBlock({
      blockNumber: log.blockNumber,
    });

    const tx = await this.client.getTransaction({
      hash: log.transactionHash,
    });

    // Decode message from calldata
    let content = null;
    if (tx && tx.input && tx.input.length > 2) {
      // If input contains more than just the function selector, extract the message
      try {
        // For Ethereum transfers (calldata without function selector)
        if (
          tx.to?.toLowerCase() === VOID_CONTRACT_ADDRESS.toLowerCase() &&
          tx.input !== "0x"
        ) {
          try {
            content = hexToString(tx.input);
          } catch (error) {
            content = tx.input;
          }
        } else {
          // This is a complex case - we'd need to decode based on the function signature
          // For simplicity, we'll just store the raw calldata for now
          content = tx.input;
        }
      } catch (error) {
        console.warn("Could not decode message from calldata:", error);
      }
    }

    // Convert amount to a number (this is simplified - in production, handle large numbers carefully)
    const amountNumber = parseFloat(formatEther(amount));

    await storage.createEarthshout({
      senderAddress: from,
      content,
      yeetId: Number(yeetId),
      tokenAddress: token,
      amountBurned: amountNumber,
      transactionHash: log.transactionHash,
      blockNumber: Number(log.blockNumber),
      timestamp: new Date(
        eventBlock?.timestamp ? Number(eventBlock.timestamp) * 1000 : Date.now()
      ),
    });

    console.log(
      `Indexed Yeet event: YeetId=${yeetId}, From=${from}, Token=${token}, Amount=${amountNumber}`
    );
  }

  private async handleGiftEvent(
    token: `0x${string}`,
    amount: bigint,
    to: `0x${string}`,
    from: `0x${string}`,
    yeetId: bigint,
    log: any
  ) {
    const eventBlock = await this.client.getBlock({
      blockNumber: log.blockNumber,
    });

    const tx = await this.client.getTransaction({
      hash: log.transactionHash,
    });

    // Decode message and gift amount from calldata
    let content = null;
    let giftAmount = 0;

    if (tx && tx.input) {
      try {
        // This is a complex case requiring proper ABI decoding
        // For now, we'll store raw calldata as content
        content = tx.input;

        // In a real implementation, we would decode the gift amount from the transaction data
        // This would require parsing the function parameters based on the ABI
      } catch (error) {
        console.warn("Could not decode gift data from calldata:", error);
      }
    }

    // Convert amount to a number
    const amountNumber = parseFloat(formatEther(amount));

    await storage.createEarthshout({
      senderAddress: from,
      content,
      yeetId: Number(yeetId),
      tokenAddress: token,
      amountBurned: amountNumber,
      transactionHash: log.transactionHash,
      blockNumber: Number(log.blockNumber),
      timestamp: new Date(
        eventBlock?.timestamp ? Number(eventBlock.timestamp) * 1000 : Date.now()
      ),
      recipientAddress: to,
      giftAmount: giftAmount, // We would get this from the calldata in a complete implementation
    });

    console.log(
      `Indexed Gift event: YeetId=${yeetId}, From=${from}, To=${to}, Token=${token}, Amount=${amountNumber}`
    );
  }

  private async handleBoostEvent(
    yeetId: bigint,
    token: `0x${string}`,
    amount: bigint,
    log: any
  ) {
    const eventBlock = await this.client.getBlock({
      blockNumber: log.blockNumber,
    });

    const tx = await this.client.getTransaction({
      hash: log.transactionHash,
    });

    // Get the sender address from the transaction
    const receipt = await this.client.getTransactionReceipt({
      hash: log.transactionHash,
    });

    const from = receipt?.from || "";

    // Convert amount to a number
    const amountNumber = parseFloat(formatEther(amount));

    await storage.createEarthshout({
      senderAddress: from,
      content: null, // No direct message for boosts
      yeetId: 0, // This will be a new yeetId in the sequence
      tokenAddress: token,
      amountBurned: amountNumber,
      transactionHash: log.transactionHash,
      blockNumber: Number(log.blockNumber),
      timestamp: new Date(
        eventBlock?.timestamp ? Number(eventBlock.timestamp) * 1000 : Date.now()
      ),
      boostForYeetId: Number(yeetId),
    });

    console.log(
      `Indexed Boost event: BoostForYeetId=${yeetId}, From=${from}, Token=${token}, Amount=${amountNumber}`
    );
  }

  private async indexHistoricalEvents(fromBlock: number) {
    const currentBlock = await this.client.getBlockNumber();
    const toBlock = Number(currentBlock) - CONFIRMATION_BLOCKS;

    if (fromBlock >= toBlock) {
      console.log("No new blocks to index");
      return;
    }

    console.log(
      `Indexing historical events from block ${fromBlock} to ${toBlock}`
    );

    try {
      // Process Yeet events
      const yeetLogs = await this.client.getLogs({
        address: VOID_CONTRACT_ADDRESS,
        event: YEET_EVENT,
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });

      for (const log of yeetLogs) {
        const { token, amount, from, yeetId } = log.args;
        if (token && amount && from && yeetId !== undefined) {
          await this.handleYeetEvent(token, amount, from, yeetId, log);
        }
      }

      // Process Gift events
      const giftLogs = await this.client.getLogs({
        address: VOID_CONTRACT_ADDRESS,
        event: GIFT_EVENT,
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });

      for (const log of giftLogs) {
        const { token, amount, to, from, yeetId } = log.args;
        if (token && amount && to && from && yeetId !== undefined) {
          await this.handleGiftEvent(token, amount, to, from, yeetId, log);
        }
      }

      // Process Boost events
      const boostLogs = await this.client.getLogs({
        address: VOID_CONTRACT_ADDRESS,
        event: BOOST_EVENT,
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });

      for (const log of boostLogs) {
        const { yeetId, token, amount } = log.args;
        if (yeetId !== undefined && token && amount) {
          await this.handleBoostEvent(yeetId, token, amount, log);
        }
      }

      // Update the last indexed block
      await storage.updateIndexerState(this.chainId, toBlock);

      console.log(`Successfully indexed events up to block ${toBlock}`);
    } catch (error) {
      console.error("Error indexing historical events:", error);
    }
  }

  private startPolling() {
    setInterval(async () => {
      try {
        // Get the last indexed block
        const indexerState = await storage.getLatestIndexerState(this.chainId);
        const lastBlockNumber = indexerState?.lastBlockNumber || 0;

        // Index any new blocks
        await this.indexHistoricalEvents(lastBlockNumber + 1);
      } catch (error) {
        console.error("Error in indexer polling:", error);
      }
    }, POLLING_INTERVAL);
  }

  async stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.unwatch) {
      this.unwatch();
    }
    console.log("Void Indexer stopped");
  }
}

export const createIndexer = (
  rpcUrl: string,
  chainId: number = DEFAULT_CHAIN_ID
) => {
  return new VoidIndexer(rpcUrl, chainId);
};
