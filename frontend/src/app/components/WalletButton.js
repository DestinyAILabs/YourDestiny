'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { web3auth, initWeb3Auth } from '../utils/web3auth';
import { ethers } from 'ethers';

const StyledButton = styled(Button)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'linear-gradient(to right, #7e57c2, #42a5f5)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  '&:hover': {
    opacity: 0.9,
  },
});

export function WalletButton({ onConnect, isConnected }) {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState(null);

  React.useEffect(() => {
    if (isConnected) {
      const web3authProvider = web3auth.connect().then((provider) => {
        if (provider) {
          const web3Provider = new ethers.providers.Web3Provider(provider);
          
          const signer = web3Provider.getSigner();

          const address = signer.getAddress().then((address) => {
            console.log("Wallet address:", address);
            setWalletAddress(address);
          });
        } else {
          console.error("No provider found");
        }
      });
    }
    const init = async () => {
      try {
        await initWeb3Auth();

        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };
    init();
  }, []);

  const handleClick = async () => {
    try {
      if (!isConnected) {
        const web3authProvider = await web3auth.connect();
        if (web3authProvider) {
          const userInfo = await web3auth.getUserInfo();
          console.log("User info:", userInfo);
          onConnect();
        }
      } else {
        await web3auth.logout();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <StyledButton onClick={handleClick} >
      <Wallet className="w-5 h-5" />
      <span>{isConnected ? walletAddress : 'Connect Wallet'}</span>
    </StyledButton>
  );
}