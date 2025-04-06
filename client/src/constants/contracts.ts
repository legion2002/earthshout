// Importing the full ABI and address from the SDK
import { EARTHSHOUT_ABI, VOID_CONTRACT_ADDRESS } from "../../../sdk/abi";

// Re-export the address and ABI for consistency
export { VOID_CONTRACT_ADDRESS };
export const VOID_CONTRACT_ABI = EARTHSHOUT_ABI;

// Helper function to create a type-safe contract config
export const getVoidContractConfig = () => ({
  address: VOID_CONTRACT_ADDRESS as `0x${string}`,
  abi: VOID_CONTRACT_ABI,
});
