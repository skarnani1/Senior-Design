import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo from '../assets/Logo.png'; // Import your logo
import './Header.css'; // Import the CSS file

function Header() {
  return (
      <AppBar position="static" className="header">
        <Toolbar className="toolbar">
          {/* Logo */}
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
            <Typography variant="h6" className="title">
              Sports Betting Arbitrage
            </Typography>
          </div>

          {/* Navigation Buttons */}
          <div className="nav-buttons">
            <Button color="inherit" component={Link} to="/" className="nav-button">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/dashboard" className="nav-button">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/profile" className="nav-button">
              <AccountCircle className="icon" />
            </Button>
          </div>
        </Toolbar>
      </AppBar>
  );
}

export default Header;
