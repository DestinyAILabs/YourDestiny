'use client';

import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Wallet, Coins, Trophy, Brain } from 'lucide-react';
import Image from 'next/image';
import { WalletButton } from "./WalletButton";
const features = [
  {
    icon: <Wallet size={32} color="#00BFFF" />,
    title: "Connect & Play",
    description: "Join the adventure by connecting your wallet"
  },
  {
    icon: <Coins size={32} color="#FFD700" />,
    title: "Discover & Decide",
    description: "Explore the crypto universe and make strategic decisions"
  },
  {
    icon: <Trophy size={32} color="#C0C0C0" />,
    title: "Compete & Win",
    description: "Climb the leaderboard and prove your crypto trading skills"
  }
];

export function LandingPage({ onConnect, isConnected }) {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #212121, #7e57c2)',
      color: 'white'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ py: 12 }}>
          {/* Hero Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                You Will Decide the Fate of the Crypto Universe
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
                Embark on an epic journey through the crypto universe. Trade, learn, and compete in this immersive blockchain experience.
              </Typography>
              <WalletButton isConnected={isConnected} onConnect={onConnect} />
            </Box>
          </Grid>

          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              position: 'relative',
              height: '400px',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              <Image
                src="/logo.svg"
                alt="Your Destiny"
                layout="fill"
                objectFit="contain"
              />
            </Box>
          </Grid>

          {/* Features Section */}
          <Grid item xs={12}>
            <Grid container spacing={4} sx={{ mt: 4 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper sx={{
                    p: 4,
                    height: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>{feature.title}</Typography>
                    <Typography color="rgba(255,255,255,0.8)">{feature.description}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}