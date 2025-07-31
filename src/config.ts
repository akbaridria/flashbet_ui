const config = {
  rewoundProjectId: import.meta.env.VITE_REWOWN_PROJECT_ID,
  rpcUrl: `https://128123.rpc.thirdweb.com/${import.meta.env.VITE_THIRDWEB_CLIENT_ID}`,
  githubRepo: "https://github.com/akbaridria/flashbet_contract",
  usdcAddress: "0xCE6dB413feCaf31BAc37b47C7165E4da7cA72011",
  hermesClientUrl: "https://hermes.pyth.network",
  btcPriceFeedId:
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  flashbetAddress: "0x0f2D65102D6A313818B018212A18b713821C6195",
  flashBetApiUrl: import.meta.env.VITE_FLASHBET_API_URL,
};

export default config;
