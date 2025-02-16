import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material'; // Ensure IconButton is also imported if you use it later
import { Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo from '../assets/Logo.png';
import './Header.css';

function Header() {
    return (
        <AppBar position="fixed" className="header">
            <Toolbar className="toolbar">
                {/* Logo and Title - Keep in a Box on the Left */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}> {/* Added mr: 2 for right margin */}
                        <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 1, padding: 0 }}> {/* IconButton for clickable logo if needed, adjust padding */}
                            <img src={logo} alt="Logo" className="logo" />
                        </IconButton>
                        <Typography variant="h6" className="title" noWrap>
                            Sports Betting Arbitrage
                        </Typography>
                    </Box>
                </Box>

                {/* Navigation Buttons - Keep in a Box on the Right */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}> {/* ml: 'auto' pushes buttons to the right */}
                    <Button color="inherit" component={Link} to="/" className="nav-button">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/dashboard" className="nav-button">
                        Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/arbitrage" className="nav-button">
                        Arbitrage
                    </Button>
                    <Button color="inherit" component={Link} to="/bonus-bets-calculator" className="nav-button">
                        Bonus Bets Calculator
                    </Button>
                    <Button color="inherit" component={Link} to="/profile" className="nav-button">
                        <AccountCircle className="icon" sx={{ marginRight: 0.5 }} />
                        Profile
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;