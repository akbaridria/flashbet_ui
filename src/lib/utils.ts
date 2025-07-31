import config from "@/config";
import { HermesClient } from "@pythnetwork/hermes-client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value?: number | string) {
  if (value === undefined) return "-";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export const getBtcPrice = async () => {
  const connection = new HermesClient(config.hermesClientUrl);
  const priceIds = [config.btcPriceFeedId];
  return await connection.getLatestPriceUpdates(priceIds, {
    parsed: true,
  });
};
