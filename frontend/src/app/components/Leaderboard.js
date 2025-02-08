import React from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import { Trophy, Zap, Coins, Star, Brain } from 'lucide-react';

// Example leaderboard data - in production, this would come from your API
const leaderboardData = [
  {
    rank: 1,
    address: '0x1234...5678',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=1',
    balance: 1500,
    energy: 85,
    reputation: 18,
    knowledge: 15,
  },
  {
    rank: 2,
    address: '0x8765...4321',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=2',
    balance: 1200,
    energy: 75,
    reputation: 15,
    knowledge: 12,
  },
  {
    rank: 3,
    address: '0x9876...1234',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=3',
    balance: 1000,
    energy: 65,
    reputation: 12,
    knowledge: 10,
  },
];

export function Leaderboard() {
  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return 'white';
    }
  };

  return (
    <Paper sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: 2, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Trophy size={24} color="#FFD700" />
        <Typography variant="h5" color="white">Leaderboard</Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Rank</TableCell>
              <TableCell sx={{ color: 'white' }}>Player</TableCell>
              <TableCell sx={{ color: 'white' }}><Coins size={16} /></TableCell>
              <TableCell sx={{ color: 'white' }}><Zap size={16} /></TableCell>
              <TableCell sx={{ color: 'white' }}><Star size={16} /></TableCell>
              <TableCell sx={{ color: 'white' }}><Brain size={16} /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((player) => (
              <TableRow key={player.address} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ color: getRankColor(player.rank) }}>
                  #{player.rank}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={player.avatar} sx={{ width: 32, height: 32 }} />
                    <Typography color="white">{player.address}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{player.balance}</TableCell>
                <TableCell sx={{ color: 'white' }}>{player.energy}</TableCell>
                <TableCell sx={{ color: 'white' }}>{player.reputation}</TableCell>
                <TableCell sx={{ color: 'white' }}>{player.knowledge}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}