import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'; // Added Box import
import { Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo from '../assets/Logo.png'; // Import your logo
import './Header.css';

function Header() {
    return (
        <AppBar position="fixed" className="header">
            <Toolbar className="toolbar">
                {/* Logo and Title in a Box for better alignment */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img src={logo} alt="Logo" className="logo" />
                    <Typography variant="h6" className="title" noWrap> {/* Added noWrap */}
                        Sports Betting Arbitrage
                    </Typography>
                </Box>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}> {/* Using Box for nav buttons layout */}
                    <Button color="inherit" component={Link} to="/" className="nav-button">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/dashboard" className="nav-button">
                        Live Odds
                    </Button>
                    <Button color="inherit" component={Link} to="/arbitrage" className="nav-button"> {/* Assuming you might add an Arbitrage page */}
                        Arbitrage
                    </Button>
                    <Button color="inherit" component={Link} to="/profile" className="nav-button">
                        <AccountCircle className="icon" sx={{ marginRight: 0.5 }} /> {/* Added sx for icon margin */}
                        Profile
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;