import { ClockIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const LiquidityManagement = () => {
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const isWithdrawalOpen = true;
  return (
    <div className="p-4 bg-secondary rounded-lg border border-primary border-dashed space-y-4">
      <div>
        <div className="text-lg font-semibold">Your Liquidity</div>
        <div className="text-xs text-muted-foreground">
          Manage your liquidity positions
        </div>
      </div>
      <div className="rounded-lg border p-4">
        <div className="text-2xl font-bold">$1,250.00</div>
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
          <Button disabled={!liquidityAmount}>
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
            disabled={!withdrawAmount || !isWithdrawalOpen}
            variant="outline"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <ClockIcon className="h-3 w-3" />
          <span>Withdrawal Window: 9PM-10PM UTC</span>
        </div>
        <p className="text-xs mt-1">36h 53m until next withdrawal window</p>
      </div>
    </div>
  );
};

export default LiquidityManagement;
