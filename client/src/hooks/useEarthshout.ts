import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { createYeet } from "@/lib/ethereum";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";

export function useEarthshout() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: createMessage } = useMutation({
    mutationFn: async (data: {
      senderAddress: string;
      content: string;
      ethBurned: number;
      transactionHash: string;
    }) => {
      return apiRequest("POST", "/api/earthshouts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/earthshouts"] });
      toast({
        title: "Earthshout created!",
        description: "Your message has been broadcast to the world.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create Earthshout",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const sendEarthshout = async (message: string, ethAmount: number) => {
    if (!address) {
      toast({
        title: "No wallet connected",
        description: "Please connect your wallet to create an Earthshout",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      // Use ETH address (zero address) as token
      const zeroAddress =
        "0x0000000000000000000000000000000000000000" as `0x${string}`;
      // Call contract to burn ETH
      const tx = await createYeet(zeroAddress, ethAmount.toString(), message);

      // Save the message to our database
      createMessage({
        senderAddress: address,
        content: message,
        ethBurned: ethAmount,
        transactionHash: tx.hash,
      });

      setIsSubmitting(false);
      return true;
    } catch (error: any) {
      console.error("Error sending Earthshout:", error);
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to send transaction",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    sendEarthshout,
    isSubmitting,
  };
}
