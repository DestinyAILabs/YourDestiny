import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const AlertModal = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity="info" 
        variant="filled"
        sx={{ 
          width: '100%',
          backgroundColor: '#7e57c2',
          '& .MuiAlert-icon': {
            color: 'white'
          },
          '& .MuiAlert-message': {
            color: 'white'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertModal;