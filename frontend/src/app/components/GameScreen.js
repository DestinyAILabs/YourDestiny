'use client';

import React from 'react';
import { scenario } from '../data/scenario';
import { Box, Button, Typography, Card, CardMedia, CardContent } from '@mui/material';

export function GameScreen() {
  const [currentScenario, setCurrentScenario] = React.useState(scenario.start);

  const handleChoice = (choice) => {
    setCurrentScenario(scenario[choice.nextScenarioId]);
  };
 
  return (
    <Box maxWidth="lg" mx="auto" p={3} spacing={4}>
      <Card sx={{ position: 'relative', height: 400, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', zIndex: 10 }} />
        {currentScenario.image && (
          <CardMedia
            component="img"
            image={currentScenario.image}
            alt={currentScenario.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <CardContent sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 3, zIndex: 20 }}>
          <Typography variant="h4" component="h2" color="white" gutterBottom>
            {currentScenario.title}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: 2, p: 3, mt: 3 }}>
        <Typography variant="body1" color="textSecondary" paragraph>
          {currentScenario.description}
        </Typography>

        <Box spacing={2}>
          {currentScenario.choices.map((choice) => (
            <Button
              key={choice.id}
              onClick={() => handleChoice(choice)}
              fullWidth
              variant="contained"
              sx={{ textAlign: 'left', p: 2, borderRadius: 2, background: 'rgba(103, 58, 183, 0.4)', '&:hover': { background: 'rgba(103, 58, 183, 0.6)' }, color: 'white', borderColor: 'rgba(103, 58, 183, 0.3)' }}
            >
              {choice.text}
            </Button>
          ))}
        </Box>
      </Card>
    </Box>
  );
}