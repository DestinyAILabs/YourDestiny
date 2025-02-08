'use client';

import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";

const clientId = "BKsQBHiF4w2RKyMpi-sVybhUYgjrMsyvqK5hxy8VGN3E5XYNTRrFsNtVQ7YXu2FXRHxNw8egKs1V2SrDiDDVMbw"; // Get this from Web3Auth Dashboard

export const web3auth = new Web3Auth({
  clientId,
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1", // Ethereum mainnet
    rpcTarget: "https://rpc.ankr.com/eth",
  },
  web3AuthNetwork: "cyan",
});

const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: "none",
  },
  adapterSettings: {
    whiteLabel: {
      name: "Crypto Adventure",
      logoLight: "https://your-logo-url.com/logo.png",
      logoDark: "https://your-logo-url.com/logo-dark.png",
      defaultLanguage: "en",
      dark: true,
    },
  },
});

web3auth.configureAdapter(openloginAdapter);

export const initWeb3Auth = async () => {
  try {
    await web3auth.initModal();
    return web3auth;
  } catch (error) {
    console.error("Error initializing Web3Auth:", error);
    throw error;
  }
};