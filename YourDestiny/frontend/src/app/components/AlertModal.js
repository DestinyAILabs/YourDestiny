import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const AlertModal = ({ open, message, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-description"
    >
      <Box sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        p: 4, 
        maxWidth: 400, 
        margin: 'auto', 
        mt: '20%', 
        boxShadow: 24 
      }}>
        <Typography id="alert-modal-title" variant="h6" component="h2">
          Alert
        </Typography>
        <Typography id="alert-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>
        <Button 
          variant="contained" 
          onClick={onClose} 
          sx={{ mt: 3 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default AlertModal;