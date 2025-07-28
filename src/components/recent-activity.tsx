import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Badge } from "./ui/badge";

const mockBetHistory = [
  {
    id: 1,
    direction: "up",
    amount: 100,
    duration: "2m",
    result: "win",
    profit: 75,
    timestamp: "2 min ago",
  },
  {
    id: 2,
    direction: "down",
    amount: 50,
    duration: "5m",
    result: "loss",
    profit: -50,
    timestamp: "8 min ago",
  },
  {
    id: 3,
    direction: "up",
    amount: 200,
    duration: "3m",
    result: "win",
    profit: 150,
    timestamp: "15 min ago",
  },
  {
    id: 4,
    direction: "down",
    amount: 75,
    duration: "10m",
    result: "pending",
    profit: 0,
    timestamp: "1 min ago",
  },
];

const RecentActivity = () => {
  return (
    <div className="p-4 bg-secondary rounded-lg border border-primary border-dashed space-y-4">
      <div>
        <div className="text-lg font-semibold">Recent Activity</div>
        <div className="text-xs text-muted-foreground">
          View your recent bets
        </div>
      </div>
      <div className="space-y-4">
        {mockBetHistory.map((bet) => (
          <div key={bet.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {bet.direction === "up" ? (
                <TrendingUpIcon className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 text-red-400" />
              )}
              <div>
                <p className="text-sm font-medium">${bet.amount}</p>
                <p className="text-xs text-muted-foreground">{bet.duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  bet.result === "win"
                    ? "default"
                    : bet.result === "loss"
                    ? "destructive"
                    : "secondary"
                }
              >
                {bet.result}
              </Badge>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${
                    bet.profit > 0
                      ? "text-green-400"
                      : bet.profit < 0
                      ? "text-red-400"
                      : ""
                  }`}
                >
                  {bet.profit > 0 ? "+" : ""}${bet.profit}
                </p>
                <p className="text-xs text-muted-foreground">{bet.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
