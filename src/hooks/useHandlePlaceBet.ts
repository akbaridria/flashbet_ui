import config from "@/config";
import { getBtcPrice } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import flashbetAbi from "@/abis/flashbet.json";
import { hexToNumber, parseUnits } from "viem";
import { toast } from "sonner";
import useReadState from "./useReadState";
import { useQueryClient } from "@tanstack/react-query";

const pushBetToQueue = async ({
  betId,
  betDuration,
}: {
  betId: number;
  betDuration: number;
}) => {
  fetch(config.flashBetApiUrl + "/add-job", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      betId: betId,
      expiryTime: Math.floor(Date.now() / 1000) + betDuration,
    }),
  });
};

const useHandlePlaceBet = ({
  betAmount,
  betDuration,
  betDirection,
  cancelDialog,
}: {
  betAmount: string;
  betDuration: number;
  betDirection: "up" | "down";
  cancelDialog: () => void;
}) => {
  const queryClient = useQueryClient();
  const [tx, setTx] = useState<`0x${string}` | undefined>(undefined);
  const { data, isFetching, isSuccess } = useWaitForTransactionReceipt({
    hash: tx,
    query: {
      enabled: !!tx,
    },
  });
  const { address } = useAccount();
  const { writeContractAsync: placeBetAsync } = useWriteContract();
  const { qkUserBets } = useReadState();

  useEffect(() => {
    if (data && isSuccess) {
      console.log("Transaction data:", data);
      if (data.status === "success") {
        toast.success("Bet placed successfully");
        cancelDialog();
        const topic = data?.logs?.[2]?.topics?.[1];
        if (!topic) {
          toast.error("Failed to retrieve bet ID");
          return;
        }
        const betId = hexToNumber(topic);
        pushBetToQueue({ betId, betDuration });
        setTx(undefined);
        queryClient.invalidateQueries({ queryKey: qkUserBets });
      } else {
        toast.error("Failed to place bet");
      }
    }
  }, [betDuration, cancelDialog, data, isSuccess, qkUserBets, queryClient]);

  const handlePlaceBet = useCallback(async () => {
    if (!address || !betAmount || !betDuration) return;

    const priceUpdates = await getBtcPrice();
    const priceUpdateData = priceUpdates.binary.data.map((d: string) =>
      d.startsWith("0x") ? d : `0x${d}`
    );

    const tx = await placeBetAsync({
      address: config.flashbetAddress as `0x${string}`,
      abi: flashbetAbi,
      functionName: "placeBet",
      args: [
        parseUnits(betAmount, 6),
        betDuration,
        betDirection === "up",
        priceUpdateData,
      ],
      value: BigInt(100),
    });
    setTx(tx);
  }, [address, betAmount, betDirection, betDuration, placeBetAsync]);

  return {
    handlePlaceBet,
    isPlacingBet: isFetching,
  };
};

export default useHandlePlaceBet;
