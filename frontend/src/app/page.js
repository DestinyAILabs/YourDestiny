"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { WalletButton } from "./components/WalletButton";
import { GameScreen } from "./components/GameScreen";
import { LoadingScreen } from "./components/LoadingScreen";
import { LandingPage } from "./components/LandingPage";
import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import exampleData from './exampleData.json';
import { initWeb3 } from './utils/web3auth';

export default function Home() {
  const [gameData, setGameData] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const web3 = await initWeb3();
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        if (accounts && accounts.length > 0) {
          setIsWalletConnected(true);
          fetchGameData(accounts[0]);
        }
      }
    };
    checkConnection();
  }, []);

  const handleConnect = async () => {
    const web3 = await initWeb3();
    if (web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts && accounts.length > 0) {
        setIsWalletConnected(true);
        fetchGameData(accounts[0]);
      }
    }
  };

  const fetchGameData = async (walletAddress) => {
    try {
      const latestMessageResponse = await axios.post('http://localhost:3000/destiny/getLatestMessage', {
        walletAddress
      });
      if (Object.keys(latestMessageResponse.data).length === 0) {
        const startGameResponse = await axios.post('http://localhost:3000/destiny/interact', {
          walletAddress,
          message: 'Start Game'
        });
        setGameData(startGameResponse.data);
      } else {
        setGameData(latestMessageResponse.data);
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
      setGameData(exampleData);
    }
  };

  const handleChoice = async (choice) => {
    setGameData(null);
    try {
      const web3 = await initWeb3();
      const accounts = await web3.eth.getAccounts();
      const response = await axios.post('http://localhost:3000/destiny/interact', {
        walletAddress: accounts[0],
        message: choice.text
      });
      setGameData(response.data);
    } catch (error) {
      console.error('Error handling choice:', error);
      setGameData(exampleData);
    }
  };

  if (!isWalletConnected) {
    return <LandingPage onConnect={handleConnect} isConnected={isWalletConnected} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #212121, #7e57c2)' }}>
      <AppBar position="static" sx={{ p: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Image src="/logo.svg" alt="Logo" width={0} height={0} style={{ width: 'auto', height: '50px' }} />
          <WalletButton isConnected={isWalletConnected} onConnect={handleConnect} />
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ py: 8 }}>
        {gameData ? (
          <GameScreen currentScenario={gameData} handleChoice={handleChoice} />
        ) : (
          <LoadingScreen />
        )}
      </Container>
    </Box>
  );
}