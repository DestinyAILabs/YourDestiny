'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { initWeb3 } from '../utils/web3auth';
import Web3 from 'web3';

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
      initWeb3().then(web3 => {
        web3.eth.getAccounts().then(accounts => {
            setWalletAddress(accounts[0]);
        });
      });
    }
    
    const init = async () => {
      try {
        await initWeb3();
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing Wallet:", error);
      }
    };
    init();
  }, []);

  const handleClick = async () => {
    try {
      if (!isConnected) {
        const web3 = await initWeb3();
        
        onConnect();
      } else {
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