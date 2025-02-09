'use client';

import React from 'react';
import { Box, Button, Typography, Card, CardMedia, CardContent, Grid, Chip } from '@mui/material';
import { AlertTriangle, Zap, Coins, Star, Brain } from 'lucide-react';
import axios from 'axios';
import { StatsModule } from './StatsModule';
import { Leaderboard } from './Leaderboard';
import erc20Abi from '../utils/erc20.abi';

export function GameScreen({ currentScenario, handleChoice, web3 }) {
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);


  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#757575';
    }
  };

  if (showLeaderboard) {
    return (
      <Box>
        <Button 
          variant="contained" 
          onClick={() => setShowLeaderboard(false)}
          sx={{ mb: 3, background: 'rgba(103, 58, 183, 0.6)' }}
        >
          Back to Game
        </Button>
        <Leaderboard />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        

        <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          {currentScenario.generatedImage && (
            <CardMedia
              component="img"
              image={currentScenario.generatedImage}
              alt="Scenario"
              sx={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
          )}
        </Card>

        <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: 2, p: 3 }}>
          <Typography variant="h5" component="h2" color="white" gutterBottom>
            {currentScenario.story}
          </Typography>
        </Card>

        <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: 2, p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {currentScenario.options.map((choice, index) => (
              <Button
                key={index}
                onClick={async () => {
                  if (choice.balance < 0 && web3) {
                    try {
                      const contract = new web3.eth.Contract(erc20Abi, '0x064E63D332049D750573f4a31c3075E44bA586a7');
                      const accounts = await web3.eth.getAccounts();
                      await contract.methods.transfer('0x11445a3E3F88b1EF19a83740AAda1311801757F2', 
                        web3.utils.toWei(choice.balance, 'ether')).send({
                        from: accounts[0],
                      });
                    } catch (error) {
                      console.error('Transaction failed:', error);
                      alert('Transaction failed. Please try again.');
                    }
                  } else {
                    handleChoice(choice);
                  }
                }}
                variant="contained"
                sx={{
                  textAlign: 'left',
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(103, 58, 183, 0.4)',
                  '&:hover': { background: 'rgba(103, 58, 183, 0.6)' },
                  display: 'block'
                }}
              >
                <Typography color="white" gutterBottom>{choice.text}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {choice.energy && (
                    <Chip
                      icon={<Zap size={16} />}
                      label={`Energy ${choice.energy}`}
                      size="small"
                      sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                    />
                  )}
                  {choice.balance && (
                    <Chip
                      icon={<Coins size={16} />}
                      label={`Balance ${choice.balance > 0 ? '+' : ''}${choice.balance}`}
                      size="small"
                      sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                    />
                  )}
                  {choice.reputation && (
                    <Chip
                      icon={<Star size={16} />}
                      label={`Rep ${choice.reputation > 0 ? '+' : ''}${choice.reputation}`}
                      size="small"
                      sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                    />
                  )}
                  {choice.knowledge && (
                    <Chip
                      icon={<Brain size={16} />}
                      label={`Knowledge ${choice.knowledge > 0 ? '+' : ''}${choice.knowledge}`}
                      size="small"
                      sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                    />
                  )}
                  <Chip
                    icon={<AlertTriangle size={16} />}
                    label={`Risk: ${choice.risk}`}
                    size="small"
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: getRiskColor(choice.risk),
                      borderColor: getRiskColor(choice.risk),
                      borderWidth: 1,
                      borderStyle: 'solid'
                    }}
                  />
                </Box>
              </Button>
            ))}
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => setShowLeaderboard(true)}
            sx={{ background: 'rgba(103, 58, 183, 0.6)' }}
          >
            View Leaderboard
          </Button>
        </Box>
        <StatsModule stats={currentScenario.userStats} globalEffects={currentScenario.globalEffects} />
      </Grid>
    </Grid>
  );
}