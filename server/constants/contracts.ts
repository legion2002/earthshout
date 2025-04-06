// Import the full ABI and address from the SDK
import { EARTHSHOUT_ABI, VOID_CONTRACT_ADDRESS } from "../../sdk/abi";

// Re-export the address and ABI for consistency
export { VOID_CONTRACT_ADDRESS };
export const VOID_CONTRACT_ABI = EARTHSHOUT_ABI;

// Network constants
export const DEFAULT_CHAIN_ID = 1; // Mainnet, adjust as needed
export const POLLING_INTERVAL = 15000; // 15 seconds
export const CONFIRMATION_BLOCKS = 2;
