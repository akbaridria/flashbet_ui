import { Separator } from "@/components/ui/separator";
import { ZapIcon, DropletsIcon, InfoIcon, GithubIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ConnectKitButton } from "connectkit";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { etherlinkTestnet } from "viem/chains";
import config from "@/config";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import UsdcAbi from "@/abis/mock-erc20.json";
import { toast } from "sonner";
import useWaitForTx from "@/hooks/useWaitTx";
import useReadState from "@/hooks/useReadState";
import { useQueryClient } from "@tanstack/react-query";

interface ToolTipButtonProps {
  content: string;
  trigger: React.ReactNode;
}
const TooltipButton: React.FC<ToolTipButtonProps> = ({ content, trigger }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};

interface FaucetButtonProps {
  onClaim: () => void;
}

const FaucetButton: React.FC<FaucetButtonProps> = ({ onClaim }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <TooltipButton
          content="Get USDC from the faucet"
          trigger={
            <Button variant="ghost" size="icon">
              <DropletsIcon className="h-4 w-4" />
            </Button>
          }
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Get USDC from the faucet</AlertDialogTitle>
          <AlertDialogDescription>
            Get USDC from the faucet to use in FlashBet. This is a testnet
            faucet, so the USDC you receive is not real and can only be used on
            the Etherlink testnet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClaim}>
            Claim (100 USDC)
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Header = () => {
  const queryClient = useQueryClient();
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { qkUsdcBalance } = useReadState();
  const { writeContractAsync } = useWriteContract({
    mutation: {
      onMutate: () => {
        toast.loading("Confirm transaction in your wallet", {
          id: "claim-toast",
        });
      },
      onSuccess: () => {
        toast.dismiss("claim-toast");
        toast.success("Confirmed!");
      },
    },
  });

  useEffect(() => {
    if (!isConnected || !chainId) return;

    if (etherlinkTestnet.id !== chainId) {
      switchChain({ chainId: etherlinkTestnet.id });
    }
  }, [isConnected, chainId, switchChain]);

  useWaitForTx({
    hash,
    callbackOnSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qkUsdcBalance });
    },
  });

  const onClaim = useCallback(async () => {
    const hashClaim = await writeContractAsync({
      address: config.usdcAddress as `0x${string}`,
      abi: UsdcAbi,
      functionName: "mint",
    });
    setHash(hashClaim);
  }, [writeContractAsync]);

  return (
    <div className="border-b border-dashed border-primary sticky top-0 bg-background">
      <div className="max-w-[1200px] mx-auto p-4 border-x border-dashed border-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ZapIcon className="h-6 w-6" />
            <div className="text-xl font-bold">FlashBet</div>
          </div>
          <div className="flex items-center gap-1">
            <FaucetButton onClaim={onClaim} />
            <Separator orientation="vertical" className="min-h-4" />
            <TooltipButton
              content="Learn more about FlashBet"
              trigger={
                <Button variant="ghost" size="icon">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              }
            />
            <Separator orientation="vertical" className="min-h-4" />
            <TooltipButton
              content="View on GitHub"
              trigger={
                <a
                  href={config.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon">
                    <GithubIcon className="h-4 w-4" />
                  </Button>
                </a>
              }
            />
            <Separator orientation="vertical" className="min-h-4" />
            <ConnectKitButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
