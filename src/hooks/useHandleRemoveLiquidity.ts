import { useCallback, useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import flashbetAbi from "@/abis/flashbet.json";
import config from "@/config";
import { toast } from "sonner";
import { parseUnits } from "viem";

const useHandleRemoveLiquidity = ({
  amount,
  callbackOnSuccess,
}: {
  amount?: string | number;
  callbackOnSuccess?: () => void;
}) => {
  const [tx, setTx] = useState<`0x${string}` | undefined>(undefined);
  const { writeContractAsync } = useWriteContract({
    mutation: { onSuccess: (data) => setTx(data) },
  });
  const { data, isSuccess, isFetching } = useWaitForTransactionReceipt({
    hash: tx,
    query: { enabled: !!tx },
  });

  useEffect(() => {
    if (isSuccess && data) {
      toast.success("Liquidity removed successfully!");
      setTx(undefined);
      callbackOnSuccess?.();
    }
  }, [isSuccess, data, callbackOnSuccess]);

  const handleRemoveLiquidity = useCallback(() => {
    if (amount) {
      writeContractAsync({
        address: config.flashbetAddress as `0x${string}`,
        abi: flashbetAbi,
        functionName: "removeLiquidity",
        args: [amount ? parseUnits(String(amount), 6) : 0n],
      });
    }
  }, [amount, writeContractAsync]);

  return { handleRemoveLiquidity, isFetching };
};

export default useHandleRemoveLiquidity;
