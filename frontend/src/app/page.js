import Image from "next/image";
import styles from "./page.module.css";
import { WalletButton } from "./components/WalletButton";
import { GameScreen } from "./components/GameScreen";
import { Blocks } from 'lucide-react';
import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #212121, #7e57c2)' }}>
      <AppBar position="static" sx={{ p: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
            <Blocks className="w-8 h-8" />
            <Typography variant="h6" component="h1">
              Your Destiny
            </Typography>
          </Box>
          <WalletButton />
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ py: 8 }}>
        <GameScreen />
      </Container>
    </Box>
  );
}
