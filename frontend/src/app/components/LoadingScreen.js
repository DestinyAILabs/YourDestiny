'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Bitcoin, Feather as Ethereum, DollarSign, Coins, Wallet, BarChart2 } from 'lucide-react';
import { keyframes } from '@mui/system';

const float = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const icons = [
  { Icon: Bitcoin, color: '#F7931A' },
  { Icon: Ethereum, color: '#627EEA' },
  { Icon: DollarSign, color: '#85bb65' },
  { Icon: Coins, color: '#FFD700' },
  { Icon: Wallet, color: '#9945FF' },
  { Icon: BarChart2, color: '#00ff88' }
];

export function LoadingScreen() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #212121, #7e57c2)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '200px',
          height: '200px',
        }}
      >
        {icons.map(({ Icon, color }, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: '0',
              animation: `${float} 2s infinite`,
              animationDelay: `${index * 0.3}s`,
              transform: 'translateX(-50%)',
            }}
          >
            <Icon size={32} color={color} />
          </Box>
        ))}
      </Box>
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          mt: 4,
          animation: `${pulse} 2s infinite ease-in-out`,
          textAlign: 'center',
        }}
      >
        Crypto Gods are Deciding your Destiny...
      </Typography>
    </Box>
  );
}