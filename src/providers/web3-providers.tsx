import { WagmiProvider, createConfig, http } from "wagmi";
import { etherlinkTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import config from "../config";

const wagmiConfig = createConfig(
  getDefaultConfig({
    chains: [etherlinkTestnet],
    transports: {
      [etherlinkTestnet.id]: http(config.rpcUrl),
    },

    walletConnectProjectId: config.rewoundProjectId,
    appName: "FlashBet",
  })
);

const queryClient = new QueryClient();

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
