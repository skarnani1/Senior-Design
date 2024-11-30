import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo from '../assets/logo.svg'; // Import your logo
import './Header.css'; // Import the CSS file

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Add the logo with the CSS class */}
        <img src={logo} alt="Logo" className="logo" style={{ marginRight: 'auto' }} />
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Sports Betting Arbitrage
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          <AccountCircle />
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
