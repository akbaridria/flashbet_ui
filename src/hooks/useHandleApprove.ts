import config from "@/config";
import { useCallback, useEffect, useMemo, useState } from "react";
import { parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import usdcAbi from "@/abis/mock-erc20.json";
import { useQueryClient } from "@tanstack/react-query";

const useHandleApprove = ({ betAmount }: { betAmount: string }) => {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const {
    data: allowance,
    isFetching: isFetchingAllowance,
    queryKey,
  } = useReadContract({
    address: config.usdcAddress as `0x${string}`,
    abi: usdcAbi,
    functionName: "allowance",
    args: [address, config.flashbetAddress],
  });

  const [tx, setTx] = useState<`0x${string}` | undefined>(undefined);

  const { writeContractAsync: approveAsync, isPending: isApproving } =
    useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: tx,
    query: { enabled: !!tx },
  });

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey });
      setTx(undefined);
    }
  }, [isSuccess, queryClient, queryKey]);

  const handleApprove = useCallback(async () => {
    if (!address) return;
    const tx = await approveAsync({
      address: config.usdcAddress as `0x${string}`,
      abi: usdcAbi,
      functionName: "approve",
      args: [config.flashbetAddress, parseUnits(betAmount, 6)],
    });
    setTx(tx);
  }, [address, betAmount, approveAsync]);

  const hasAllowance = useMemo(() => {
    if (allowance === undefined) return false;
    if (typeof allowance === "bigint")
      return allowance >= parseUnits(betAmount, 6);
    return false;
  }, [allowance, betAmount]);

  return {
    handleApprove,
    hasAllowance,
    isApproving,
    isFetchingAllowance,
  };
};

export default useHandleApprove;
