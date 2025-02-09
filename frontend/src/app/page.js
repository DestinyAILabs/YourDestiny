"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { WalletButton } from "./components/WalletButton";
import { GameScreen } from "./components/GameScreen";
import { LoadingScreen } from "./components/LoadingScreen";
import { LandingPage } from "./components/LandingPage";
import { Box, Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useEffect, useState } from 'react';
import axios from 'axios';
import exampleData from './exampleData.json';
import { initWeb3 } from './utils/web3auth';
import AlertModal from './components/AlertModal';

export default function Home() {
  const [gameData, setGameData] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [blockchainMessage, setBlockchainMessage] = useState('');
  const [web3Instance, setWeb3Instance] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudio(new Audio('/themeSong.mp3'));
    }
  }, []);


  useEffect(() => {
    const checkConnection = async () => {
      const web3 = await initWeb3();
      if (web3) {
        setWeb3Instance(web3);
        const accounts = await web3.eth.getAccounts();
        if (accounts && accounts.length > 0) {
          setIsWalletConnected(true);
          fetchGameData(accounts[0]);
        }
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (isWalletConnected && audio) {
      audio.loop = true;
      audio.play().catch(e => console.log('Audio play failed:', e));
    } else if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isWalletConnected, audio]);

  useEffect(() => {
    if (gameData?.blockchainResponse) {
      setBlockchainMessage(gameData.blockchainResponse);
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [gameData]);

  useEffect(() => {
    if (audio) {
      audio.muted = isMuted;
    }
  }, [isMuted, audio]);

  const handleConnect = async () => {
    if (web3Instance) {
      
      const accounts = await web3Instance.eth.getAccounts();
      if (accounts && accounts.length > 0) {
        try {
          await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: '0x1421fD518C872a21671e9AC909B716F631Fe3b05',
                symbol: 'DST',
                decimals: 18
              },
            },
          });
        } catch (error) {
          console.error('Error adding token to MetaMask:', error);
        }
        setIsWalletConnected(true);
        fetchGameData(accounts[0]);
      }
    }
  };

  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setGameData(null);
    setWeb3Instance(null);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const fetchGameData = async (walletAddress) => {
    try {
      const latestMessageResponse = await axios.post('https://0x7cebaf36996a9ee3bb1bee91fcb49b80470aa413.diode.link/destiny/getLatestMessage', {
        walletAddress
      });
      if (Object.keys(latestMessageResponse.data).length === 0) {
        const startGameResponse = await axios.post('https://0x7cebaf36996a9ee3bb1bee91fcb49b80470aa413.diode.link/destiny/interact', {
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
      const accounts = await web3Instance.eth.getAccounts();
      const response = await axios.post('https://0x7cebaf36996a9ee3bb1bee91fcb49b80470aa413.diode.link/destiny/interact', {
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
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #212121,rgba(103, 87, 194, 0.81))' }}>
      <AppBar position="static" sx={{ p: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Image src="/logo.svg" alt="Logo" width={0} height={0} style={{ width: 'auto', height: '50px' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isWalletConnected && (
              <IconButton 
                color="inherit" 
                onClick={handleMuteToggle}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            )}
            <WalletButton 
              isConnected={isWalletConnected} 
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              web3={web3Instance}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ py: 5 }} style={{alignContent: 'center', maxWidth: '90%' }}>
        {gameData ? (
          <GameScreen 
            currentScenario={gameData} 
            handleChoice={handleChoice}
            web3={web3Instance}
          />
        ) : (
          <LoadingScreen />
        )}
      </Container>
      <AlertModal 
        open={showAlert}
        message={blockchainMessage}
        onClose={() => setShowAlert(false)}
      />
    </Box>
  );
}