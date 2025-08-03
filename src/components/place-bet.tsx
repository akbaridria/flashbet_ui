import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency, getBtcPrice } from "@/lib/utils";
// import config from "@/config";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import useReadState from "@/hooks/useReadState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import useHandleApprove from "@/hooks/useHandleApprove";
import useHandlePlaceBet from "@/hooks/useHandlePlaceBet";
import WalletOverlay from "./wallet-overlay";

const durationOptions = [
  { label: "2m", value: 60 * 2 },
  { label: "3m", value: 60 * 3 },
  { label: "5m", value: 60 * 5 },
  { label: "10m", value: 60 * 10 },
];

const CurrentBtcPrice = () => {
  const { data: priceUpdates } = useQuery({
    queryKey: ["btcPrice"],
    queryFn: getBtcPrice,
    refetchInterval: 5_000,
  });
  const priceObj = priceUpdates?.parsed?.[0]?.price;
  let btcPrice = "";
  if (priceObj?.price && typeof priceObj.expo === "number") {
    btcPrice = formatCurrency(
      formatUnits(BigInt(priceObj.price), Math.abs(priceObj.expo))
    );
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">Current BTC Price</span>
      <span className="font-medium">{btcPrice || "Loading..."}</span>
    </div>
  );
};

interface DialogConfirmationBetProps {
  betDirection: "up" | "down";
  betAmount: string;
  betDuration: number;
}

const DialogConfirmationBet: React.FC<DialogConfirmationBetProps> = ({
  betDirection,
  betAmount,
  betDuration,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleApprove, hasAllowance, isApproving, isFetchingAllowance } =
    useHandleApprove({ betAmount });
  const { handlePlaceBet, isPlacingBet } = useHandlePlaceBet({
    betAmount,
    betDuration,
    betDirection,
    cancelDialog: () => setIsOpen(false),
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          disabled={!betDirection || !betDuration || !betAmount}
        >
          Place Bet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Bet</DialogTitle>
          <DialogDescription>
            Please review your bet details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bet Direction */}
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <span className="text-sm font-medium">Direction</span>
            <div className="flex items-center gap-2">
              {betDirection === "up" ? (
                <>
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-green-500">UP</span>
                </>
              ) : (
                <>
                  <TrendingDownIcon className="h-4 w-4 text-red-500" />
                  <span className="font-semibold text-red-500">DOWN</span>
                </>
              )}
            </div>
          </div>

          {/* Bet Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">
                {
                  durationOptions.find((option) => option.value === betDuration)
                    ?.label
                }
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">${betAmount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Potential Profit</span>
              <span className="font-medium text-green-400">
                +$
                {betAmount ? (parseFloat(betAmount) * 1.75).toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Multiplier</span>
              <span className="font-medium">1.75x</span>
            </div>
          </div>
          <div className="border rounded-lg p-3">
            <CurrentBtcPrice />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            className="flex-1"
            variant="secondary"
            disabled={hasAllowance || isFetchingAllowance || isApproving}
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button
            className="flex-1"
            disabled={!hasAllowance || isPlacingBet}
            onClick={handlePlaceBet}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PlaceBet = () => {
  const [betDirection, setBetDirection] = useState<"up" | "down">("up");
  const [betAmount, setBetAmount] = useState("");
  const [betDuration, setBetDuration] = useState(0);
  const { usdcBalance } = useReadState();
  const yourBalance = useMemo(() => {
    if (usdcBalance === undefined) return "0.00";
    return formatCurrency(formatUnits(usdcBalance, 6));
  }, [usdcBalance]);
  return (
    <WalletOverlay description="Connect your wallet to start a prediction">
      <div className="p-4 bg-secondary rounded-lg border border-primary border-dashed space-y-4">
        <div className="flex flex-col">
          <div className="text-lg font-semibold">Place Your Bet</div>
          <div className="text-xs text-muted-foreground">
            Enter your trading position
          </div>
        </div>
        <div className="space-y-2">
          <Label>Direction</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={betDirection === "up" ? "default" : "outline"}
              onClick={() => setBetDirection("up")}
              className="transition-all duration-300"
            >
              <TrendingUpIcon className="mr-2 h-4 w-4" />
              Up
            </Button>
            <Button
              variant={betDirection === "down" ? "destructive" : "outline"}
              onClick={() => setBetDirection("down")}
              className="transition-all duration-300"
            >
              <TrendingDownIcon className="mr-2 h-4 w-4" />
              Down
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <div className="flex items-center gap-2 flex-wrap">
            {durationOptions.map((option) => (
              <div
                key={option.label}
                className={cn(
                  "bg-input/20 border rounded-lg px-4 py-1 hover:bg-input/30 hover:border-primary transition-colors cursor-pointer",
                  {
                    "border-primary bg-input/30": betDuration === option.value,
                  }
                )}
                onClick={() => setBetDuration(option.value)}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />
          <p className="text-right text-xs">Your balance: {yourBalance}</p>
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <CurrentBtcPrice />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Potential Profit</span>
            <span className="font-medium text-green-400">
              +${betAmount ? (parseFloat(betAmount) * 1.75).toFixed(2) : "0.00"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Multiplier</span>
            <span className="font-medium">1.75x</span>
          </div>
        </div>

        <DialogConfirmationBet
          betDirection={betDirection}
          betAmount={betAmount}
          betDuration={betDuration}
        />
      </div>
    </WalletOverlay>
  );
};

export default PlaceBet;
