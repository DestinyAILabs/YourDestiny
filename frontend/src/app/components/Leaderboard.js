import React from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import { Trophy, Zap, Coins, Star, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Example leaderboard data - in production, this would come from your API
const exampleleaderboardData = [
  {
      "walletAddress": "0x0C907d9e4909D48a1cba6be2b95dC46546ce27af",
      "balance": 130,
      "energy": 0,
      "reputation": 125,
      "knowledge": 35,
      "avatar": "https://api.dicebear.com/7.x/pixel-art/svg?seed=553",
      "rank": 1
  },
  {
      "walletAddress": "0x0C907d9e4909D48a1cba6be2b95dC46546ce2782",
      "balance": 120,
      "energy": 45,
      "reputation": 0,
      "knowledge": 10,
      "avatar": "https://api.dicebear.com/7.x/pixel-art/svg?seed=933",
      "rank": 2
  },
  {
      "walletAddress": "0x0C907d9e4909D48a1cba6be2b95dC46546ce2788",
      "balance": 115,
      "energy": 40,
      "reputation": 13,
      "knowledge": 12,
      "avatar": "https://api.dicebear.com/7.x/pixel-art/svg?seed=520",
      "rank": 3
  },
  {
      "walletAddress": "0x11445a3E3F88b1EF19a83740AAda1311801757F2",
      "balance": 110,
      "energy": 20,
      "reputation": 160,
      "knowledge": 40,
      "avatar": "https://api.dicebear.com/7.x/pixel-art/svg?seed=936",
      "rank": 4
  },
  {
      "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
      "balance": 100,
      "energy": 40,
      "reputation": 11,
      "knowledge": 1,
      "avatar": "https://api.dicebear.com/7.x/pixel-art/svg?seed=521",
      "rank": 5
  },
  {
      "walletAddress": "0x0C907d9e4909D48a1cba6be2b95dC46546ce27ah",
      "balance": 100,
      "energy": 50,
      "reputation": 1,
      "knowledge": 1,
      "avatar": "https://api.dicebear.com/7.x/pixel-art/svg?seed=902",
      "rank": 6
  },
  {
      "walletAddress": "0x0C907d9e4909D48a1cba6be2b95dC46546ce27ad",
      "balance": 80,
      "energy": 40,
      "reputation": 50,
      "knowledge": 10,
      "avatar": "https://api.dicebear.com/7.x/pixel-art/svg?seed=744",
      "rank": 7
  }
]



export function Leaderboard() {
  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return 'white';
    }
  };
  const [leaderboardData, setLeaderboardData] = useState([]);

useEffect(() => {
  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get('https://0x7cebaf36996a9ee3bb1bee91fcb49b80470aa413.diode.link/destiny/leaderboard');
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setLeaderboardData(exampleleaderboardData);
    }
  };

  fetchLeaderboardData();
}, []);

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
              <TableRow key={player.walletAddress} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ color: getRankColor(player.rank) }}>
                  #{player.rank}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={player.avatar} sx={{ width: 32, height: 32 }} />
                    <Typography color="white">
                      <a href={`https://sepolia.basescan.org/address/${player.walletAddress}`} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>
                        {`${player.walletAddress.slice(0, 6)}...${player.walletAddress.slice(-4)}`}
                      </a>
                    </Typography>
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