import React from 'react';
import { TextField, Box, Button, Typography } from '@mui/material';

function Signup() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Box
          sx={{
            padding: '5px'
          }}
        >
          <TextField
            label="Name"
            sx={{
              maxWidth: '200px'
            }}
          />
        </Box>

        <Box
          sx={{
            padding: '5px'
          }}
        >
          <TextField
            label="Email"
            sx={{
              maxWidth: '200px'
            }}
          />
        </Box>

        <Box
          sx={{
            padding: '5px'
          }}
        >
          <TextField
            label="Username"
            sx={{
              maxWidth: '200px'
            }}
          />
        </Box>
        <Box
          sx={{
            padding: '5px'
          }}
        >
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            sx={{
              maxWidth: '200px'
            }}
          />
        </Box>
        <Box
          sx={{
            padding: '5px',
            marginBottom: '50px'
          }}
        >
          <Button
            sx={{
              width: '200px',
              color: 'white',
              backgroundColor: '#15253F',
              marginBottom: '5px'
            }}
          >
            Signup
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default Signup;