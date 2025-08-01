"use client";

import type React from "react";

import { TrendingUpIcon, TrendingDownIcon, Activity } from "lucide-react";
import { Badge } from "./ui/badge";
import useReadState from "@/hooks/useReadState";
import { useReadContract } from "wagmi";
import config from "@/config";
import flashbetAbi from "@/abis/flashbet.json";
import { useMemo } from "react";
import { formatUnits } from "viem";
import { formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const StatusBet = ["Pending", "Resolved", "Cancelled"];

interface BetInfo {
  amount: bigint;
  entryPrice: bigint;
  entryTime: bigint;
  expiryTime: bigint;
  isLong: boolean;
  priceId: string;
  resolver: string;
  status: number;
  user: string;
  won: boolean;
}

const ItemActivity: React.FC<{ betId: bigint }> = ({ betId }) => {
  const { data } = useReadContract({
    address: config.flashbetAddress as `0x${string}`,
    abi: flashbetAbi,
    functionName: "getBetInfo",
    args: [betId],
  }) as { data: BetInfo | undefined };

  console.log("data", data);

  const duration = useMemo(() => {
    return data?.expiryTime !== undefined && data?.entryTime !== undefined
      ? `${(data.expiryTime - data.entryTime) / BigInt(60)}m`
      : "N/A";
  }, [data]);

  console.log("duration", duration);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {data?.isLong ? (
          <TrendingUpIcon className="h-4 w-4 text-green-400" />
        ) : (
          <TrendingDownIcon className="h-4 w-4 text-red-400" />
        )}
        <div>
          <p className="text-sm font-medium">
            {formatCurrency(formatUnits(data?.amount ?? 0n, 6))}
          </p>
          <p className="text-xs text-muted-foreground">{duration}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge
          variant={
            data?.status === 1
              ? "default"
              : data?.status === 0
              ? "outline"
              : "destructive"
          }
        >
          {typeof data?.status === "number" ? StatusBet[data.status] : "-"}
        </Badge>
        <div className="text-right">
          <p
            className={`text-sm font-medium ${
              (data?.won && data?.status === 1) || data?.status === 0
                ? "text-green-400"
                : data?.status === 2
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {data?.won === false && data?.status === 1 ? "-" : "+"}
            {data?.amount !== undefined
              ? formatCurrency(Number(formatUnits(data.amount, 6)) * 1.75)
              : "-"}
          </p>
          <p className="text-xs text-muted-foreground">
            {data?.entryTime
              ? formatDistanceToNow(new Date(Number(data.entryTime) * 1000), {
                  addSuffix: true,
                })
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const { userBets } = useReadState();
  console.log("User Bets:", userBets);

  const hasNoBets = !userBets || userBets.length === 0;

  return (
    <div className="p-4 bg-secondary rounded-lg border border-primary border-dashed space-y-4">
      <div>
        <div className="text-lg font-semibold">Recent Activity</div>
        <div className="text-xs text-muted-foreground">
          View your recent bets
        </div>
      </div>

      {hasNoBets ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <div className="p-3 bg-muted rounded-full">
            <Activity className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              No recent activity
            </p>
            <p className="text-xs text-muted-foreground">
              Your betting history will appear here once you place your first
              bet
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {userBets
            ?.slice()
            .reverse()
            .map((betId) => (
              <ItemActivity key={betId} betId={betId} />
            ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
