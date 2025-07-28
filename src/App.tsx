import { ThemeProvider } from "@/components/theme-provider";
import {
  DropletsIcon,
  GithubIcon,
  InfoIcon,
  Wallet2Icon,
  ZapIcon,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import TradingViewWidget from "./components/tradingview-widget";
import PlaceBet from "./components/place-bet";
import LiquidityManagement from "./components/liquidity-management";
import RecentActivity from "./components/recent-activity";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main>
        <div className="border-b border-dashed border-primary sticky top-0 bg-background">
          <div className="max-w-[1200px] mx-auto p-4 border-x border-dashed border-primary">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZapIcon className="h-6 w-6" />
                <div className="text-xl font-bold">FlashBet</div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <DropletsIcon className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="min-h-4" />
                <Button variant="ghost" size="icon">
                  <InfoIcon className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="min-h-4" />
                <Button variant="ghost" size="icon">
                  <GithubIcon className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="min-h-4" />
                <Button variant="ghost" size="icon">
                  <Wallet2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto p-4 min-h-screen border-x border-dashed border-primary space-y-6">
          <div className="bg-secondary border border-primary border-dashed rounded-lg p-6">
            <h1 className="text-xl font-bold mb-2">FlashBet</h1>
            <p className="text-muted-foreground text-sm">
              FlashBet lets you predict whether the{" "}
              <span className="font-bold text-white">Bitcoin (BTC)</span> price
              will go up or down over short time periods. Just choose your
              direction (<span className="font-bold text-white">up</span> or{" "}
              <span className="font-bold text-white">down</span>), choose a time
              period from{" "}
              <span className="font-bold text-white">2 to 10 minutes</span>, and
              bet. You win <span className="font-bold text-white">1.75x</span>{" "}
              if you're correct! Fast, simple, and supported by{" "}
              <span className="font-bold text-white">on-chain price feeds</span>
              .
            </p>
          </div>
          <div>
            <TradingViewWidget />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PlaceBet />
            <LiquidityManagement />
            <RecentActivity />
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
