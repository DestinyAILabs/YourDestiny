'use client';

import Web3 from 'web3';

let web3;

export async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14A34' }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x14A34',
            chainName: 'Base Sepolia',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia-explorer.base.org']
          }]
        });
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x14A34' }]
        });
      } else {
        throw switchError;
      }
    }

    // Add ERC20 token to MetaMask
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: '0x064E63D332049D750573f4a31c3075E44bA586a7',
            symbol: 'DST',
            decimals: 18
          },
        },
      });
    } catch (error) {
      console.error('Error adding token to MetaMask:', error);
    }

    return web3;
  } else {
    console.error("No web3 provider found");
  }
}