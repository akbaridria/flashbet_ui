import config from "@/config";
import { useAccount, useReadContract } from "wagmi";
import UsdcAbi from "@/abis/mock-erc20.json";
import flashbetAbi from "@/abis/flashbet.json";

const useReadState = () => {
  const { address } = useAccount();
  const {
    data: usdcBalance,
    queryKey: qkUsdcBalance,
    isLoading: isLoadingUsdcBalance,
  } = useReadContract({
    address: config.usdcAddress as `0x${string}`,
    abi: UsdcAbi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const {
    data: userBets,
    isLoading: isLoadingUserBets,
    queryKey: qkUserBets,
  } = useReadContract({
    address: config.flashbetAddress as `0x${string}`,
    abi: flashbetAbi,
    functionName: "getUserBets",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const { data: timeUntilWithdrawalWindowOpens } = useReadContract({
    address: config.flashbetAddress as `0x${string}`,
    abi: flashbetAbi,
    functionName: "timeUntilWithdrawalWindowOpens",
    args: [],
    query: {
      refetchInterval: 10_000,
    },
  });

  const { data: userBalance, queryKey: qkUserLiquidity } = useReadContract({
    address: config.flashbetAddress as `0x${string}`,
    abi: flashbetAbi,
    functionName: "getProviderBalance",
    args: [address],
    query: {
      enabled: !!address,
    },
  });
  return {
    usdcBalance: usdcBalance as bigint | undefined,
    qkUsdcBalance: qkUsdcBalance as string[],
    isLoadingUsdcBalance,
    userBets: userBets as bigint[] | undefined,
    isLoadingUserBets,
    qkUserBets: qkUserBets as string[],
    timeUntilWithdrawalWindowOpens: timeUntilWithdrawalWindowOpens as
      | bigint
      | undefined,
    userBalance: userBalance as bigint | undefined,
    qkUserLiquidity: qkUserLiquidity as string[],
  };
};

export default useReadState;
