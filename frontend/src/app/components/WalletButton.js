'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

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

export function WalletButton() {
  const [isConnected, setIsConnected] = React.useState(false);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  return (
    <StyledButton onClick={handleConnect}>
      <Wallet className="w-5 h-5" />
      <span>{isConnected ? 'Connected' : 'Connect Wallet'}</span>
    </StyledButton>
  );
}