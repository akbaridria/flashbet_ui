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
  return {
    usdcBalance: usdcBalance as bigint | undefined,
    qkUsdcBalance: qkUsdcBalance as string[],
    isLoadingUsdcBalance,
    userBets: userBets as number[] | undefined,
    isLoadingUserBets,
    qkUserBets: qkUserBets as string[],
  };
};

export default useReadState;
