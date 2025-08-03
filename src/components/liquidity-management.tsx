import { ClockIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import useReadState from "@/hooks/useReadState";
import { formatCurrency } from "@/lib/utils";
import { formatUnits } from "viem";
import useHandleApprove from "@/hooks/useHandleApprove";
import useHandleAddedLiquidity from "@/hooks/useHandleAddedLiquidity";
import useHandleRemoveLiquidity from "@/hooks/useHandleRemoveLiquidity";
import WalletOverlay from "./wallet-overlay";

interface DialogConfirmationAddLiquidityProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentLiquidity?: string | number;
  addedAmount?: string | number;
}

const DialogConfirmationAddLiquidity: React.FC<
  DialogConfirmationAddLiquidityProps
> = ({ isDialogOpen, setIsDialogOpen, currentLiquidity, addedAmount }) => {
  const { hasAllowance, isApproving, isFetchingAllowance, handleApprove } =
    useHandleApprove({
      betAmount: addedAmount ? String(addedAmount) : "0",
    });
  const { handleAddedLiquidity, isFetching } = useHandleAddedLiquidity({
    addedAmount,
    callbackOnSuccess: () => setIsDialogOpen(false),
  });
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Liquidity Addition</DialogTitle>
          <DialogDescription>
            You are about to add {formatCurrency(addedAmount)} USDC to your
            liquidity position. Please review the details and confirm your
            action.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Amount to add:
              </span>
              <span className="font-semibold">
                {formatCurrency(addedAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">
                Current liquidity:
              </span>
              <span className="font-semibold">
                {formatCurrency(currentLiquidity)}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">New total:</span>
              <span className="font-bold text-primary">
                {formatCurrency(
                  Number(addedAmount) + Number(currentLiquidity || 0)
                )}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            disabled={
              hasAllowance || isApproving || isFetchingAllowance || isFetching
            }
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button
            disabled={
              !hasAllowance || isApproving || isFetchingAllowance || isFetching
            }
            onClick={handleAddedLiquidity}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const LiquidityManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { timeUntilWithdrawalWindowOpens, userBalance } = useReadState();

  const { handleRemoveLiquidity, isFetching } = useHandleRemoveLiquidity({
    amount: withdrawAmount,
  });

  const isWithdrawalOpen = useMemo(() => {
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    return (
      (currentHour === 21 && currentMinute >= 15) ||
      (currentHour === 22 && currentMinute === 0)
    );
  }, []);
  return (
    <WalletOverlay description="Connect your wallet to manage liquidity">
      <div className="p-4 bg-secondary rounded-lg border border-primary border-dashed space-y-4">
        <div>
          <div className="text-lg font-semibold">Your Liquidity</div>
          <div className="text-xs text-muted-foreground">
            Manage your liquidity positions
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">
            {userBalance !== undefined
              ? formatCurrency(formatUnits(userBalance, 6))
              : "-"}
          </div>
          <p className="text-xs text-muted-foreground">Your liquidity</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="liquidity">Add Liquidity</Label>
          <div className="flex space-x-2">
            <Input
              id="liquidity"
              type="number"
              placeholder="0.00"
              value={liquidityAmount}
              onChange={(e) => setLiquidityAmount(e.target.value)}
            />
            <Button
              disabled={!liquidityAmount}
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="withdraw">Withdraw</Label>
          <div className="flex space-x-2">
            <Input
              id="withdraw"
              type="number"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              disabled={!isWithdrawalOpen}
            />
            <Button
              disabled={!withdrawAmount || !isWithdrawalOpen || isFetching}
              variant="outline"
              onClick={handleRemoveLiquidity}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogConfirmationAddLiquidity
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          currentLiquidity={formatUnits(userBalance || 0n, 6) || "0"}
          addedAmount={liquidityAmount}
        />

        <div className="rounded-lg border p-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <ClockIcon className="h-3 w-3" />
            <span>Withdrawal Window: 9.15PM-10PM UTC</span>
          </div>
          <p className="text-xs mt-1">
            {timeUntilWithdrawalWindowOpens !== undefined
              ? `${Math.floor(
                  Number(timeUntilWithdrawalWindowOpens) / 3600
                )}h ${Math.floor(
                  (Number(timeUntilWithdrawalWindowOpens) % 3600) / 60
                )}m until next withdrawal window`
              : "Time until withdrawal window is unavailable"}
          </p>
        </div>
      </div>
    </WalletOverlay>
  );
};

export default LiquidityManagement;
