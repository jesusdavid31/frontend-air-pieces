/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
// import FeatherIcon from 'feather-icons-react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';

const SimpleDialog = ({ text = 'Error', open, onClose, color = 'error' }) => {

  const handleClose = () => {
    onClose(true);
  };

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open} fullWidth>
      <DialogTitle id="simple-dialog-title">
        <Box
          sx={{
            display: {
              xs: 'block',
              sm: 'flex',
              lg: 'flex',
            },
            alignItems: 'center',
            color: `${color}.main`,
          }}
        >
          { color === 'error' && <ErrorIcon /> }
          { color === 'success' && <CheckCircleTwoToneIcon /> }
          <Typography
            variant="h4"
            sx={{
              ml: 2,
            }}
          >
            { text }
          </Typography>
          <Box
            sx={{
              ml: 'auto',
            }}
          >
            <Button color="error" onClick={handleClose} autoFocus>
              Cerrar
            </Button>
          </Box>
        </Box>
      </DialogTitle>
    </Dialog>
  );
}

export default SimpleDialog;