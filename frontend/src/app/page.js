"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { WalletButton } from "./components/WalletButton";
import { GameScreen } from "./components/GameScreen";
import { Blocks } from 'lucide-react';
import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const latestMessageResponse = await axios.post('http://localhost:3000/destiny/getLatestMessage', {
          walletAddress: '0x1234567890abcdef1234567890abcdef12345678'
        });

        if (Object.keys(latestMessageResponse.data).length === 0) {
          const startGameResponse = await axios.post('http://localhost:3000/destiny/interact', {
            walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
            message: 'Start Game'
          });
          setGameData(startGameResponse.data);
        } else {
          setGameData(latestMessageResponse.data);
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #212121, #7e57c2)' }}>
      <AppBar position="static" sx={{ p: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Image src="/logo1.svg" alt="Logo" width={0} height={0} style={{ width: 'auto', height: '50px' }} />
          <WalletButton />
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ py: 8 }}>
        {gameData ? <GameScreen gameData={gameData} /> : <Typography>Loading...</Typography>}
      </Container>
    </Box>
  );
}
