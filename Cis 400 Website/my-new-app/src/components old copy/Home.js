import React from 'react';
import { Avatar, Button, TextField, Typography, Container, Grid } from '@mui/material';

function Profile() {
  const handleLogout = () => {
    // Logic for logging out the user
  };

  return (
    <Container component="main" maxWidth="xs">
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Avatar alt="User Name" src="/static/images/avatar/1.jpg" style={{ margin: 'auto', width: '100px', height: '100px' }} />
        <Typography component="h1" variant="h5" style={{ marginTop: '10px' }}>
          User Name
        </Typography>
        <Typography variant="body1" style={{ marginTop: '10px' }}>
          user@example.com
        </Typography>
        <form style={{ marginTop: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Full Name"
                name="fullName"
                autoComplete="name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
          >
            Update Profile
          </Button>
        </form>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          style={{ marginTop: '20px' }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </Container>
  );
}

export default Profile;