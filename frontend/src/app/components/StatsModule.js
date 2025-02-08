import React from 'react';
import { Box, Paper, Typography, LinearProgress, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Battery, Star, Brain, Globe } from 'lucide-react';

export function StatsModule({ stats, globalEffects }) {
  const getProgressColor = (value) => {
    if (value > 70) return 'success';
    if (value > 30) return 'warning';
    return 'error';
  };

  return (
    <Paper sx={{ p: 3, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: 2 }}>
      <Typography variant="h6" color="white" gutterBottom>Player Stats</Typography>
      
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp size={16} />
              <Typography color="white">Balance</Typography>
            </Box>
            <Typography color="white">{stats.balance}</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(stats.balance / 200) * 100} 
            color={getProgressColor((stats.balance / 200) * 100)}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Battery size={16} />
              <Typography color="white">Energy</Typography>
            </Box>
            <Typography color="white">{stats.energy}</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={stats.energy} 
            color={getProgressColor(stats.energy)}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star size={16} />
              <Typography color="white">Reputation</Typography>
            </Box>
            <Typography color="white">{stats.reputation}</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(stats.reputation / 20) * 100} 
            color={getProgressColor((stats.reputation / 20) * 100)}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Brain size={16} />
              <Typography color="white">Knowledge</Typography>
            </Box>
            <Typography color="white">{stats.knowledge}</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(stats.knowledge / 20) * 100} 
            color={getProgressColor((stats.knowledge / 20) * 100)}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" color="white" gutterBottom>Global Status</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            icon={<Globe size={16} />}
            label={`Market: ${globalEffects.marketTrend}`}
            sx={{ background: 'rgba(103, 58, 183, 0.4)', color: 'white' }}
          />
          <Chip 
            icon={<Globe size={16} />}
            label={`Earth: ${globalEffects.earthStatus}`}
            sx={{ background: 'rgba(103, 58, 183, 0.4)', color: 'white' }}
          />
          <Chip 
            icon={<Globe size={16} />}
            label={`Mars: ${globalEffects.marsStatus}`}
            sx={{ background: 'rgba(103, 58, 183, 0.4)', color: 'white' }}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" color="white" gutterBottom>Inventory</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {stats.nfts.map((nft, index) => (
            <Chip 
              key={index}
              label={nft}
              sx={{ background: 'rgba(103, 58, 183, 0.4)', color: 'white' }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}