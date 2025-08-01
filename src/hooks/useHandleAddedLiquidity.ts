import { useCallback, useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import config from "@/config";
import flashbetAbi from "@/abis/flashbet.json";
import { toast } from "sonner";
import useReadState from "./useReadState";
import { useQueryClient } from "@tanstack/react-query";
import { parseUnits } from "viem";

const useHandleAddedLiquidity = ({
  addedAmount,
  callbackOnSuccess,
}: {
  addedAmount?: number | string;
  callbackOnSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { qkUserLiquidity, qkUsdcBalance } = useReadState();
  const [tx, setTx] = useState<`0x${string}` | undefined>(undefined);
  const { data, isSuccess, isFetching } = useWaitForTransactionReceipt({
    hash: tx,
    query: { enabled: !!tx },
  });

  useEffect(() => {
    if (isSuccess && data) {
      toast.success("Liquidity added successfully!");
      callbackOnSuccess?.();
      setTx(undefined);
      queryClient.invalidateQueries({ queryKey: qkUserLiquidity });
      queryClient.invalidateQueries({ queryKey: qkUsdcBalance });
    }
  }, [
    callbackOnSuccess,
    isSuccess,
    qkUserLiquidity,
    queryClient,
    data,
    qkUsdcBalance,
  ]);

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: (data) => {
        setTx(data);
      },
    },
  });

  const handleAddedLiquidity = useCallback(() => {
    if (addedAmount) {
      writeContractAsync({
        address: config.flashbetAddress as `0x${string}`,
        abi: flashbetAbi,
        functionName: "addLiquidity",
        args: [addedAmount ? parseUnits(String(addedAmount), 6) : 0n],
      });
    }
  }, [addedAmount, writeContractAsync]);

  return { handleAddedLiquidity, isFetching };
};

export default useHandleAddedLiquidity;
