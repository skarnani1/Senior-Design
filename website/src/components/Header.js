import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';      
import Insights from '@mui/icons-material/Insights';
import logo from '../assets/Logo-NoText.png';
import './Header.css';

function Header() {
    return (
        <AppBar position="fixed" className="header">
            <Toolbar className="toolbar">
                {/* Logo and Title on the Left */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Box
                        component={Link}
                        to="/"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            textDecoration: 'none',
                            color: 'white',
                            '&:hover': { 
                                opacity: 0.9,
                                '& .logo': {
                                    transform: 'scale(1.05)'
                                }
                            }
                        }}
                    >
                        <img src={logo} alt="Logo" className="logo" />
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                ml: 2,
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                letterSpacing: '0.5px'
                            }}
                        >
                            RiskyBusiness
                        </Typography>
                    </Box>
                </Box>

                {/* Navigation Buttons on the Right */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button color="inherit" component={Link} to="/dashboard" className="nav-button" sx={{ textTransform: 'none' }}>
                        Dashboard
                    </Button>
                    {/* <Button color="inherit" component={Link} to="/arbitrage" className="nav-button" sx={{ textTransform: 'none' }}>
                        Arbitrage
                    </Button> */}
                    <Button color="inherit" component={Link} to="/bonus-bets-calculator" className="nav-button" sx={{ textTransform: 'none' }}>
                        Bonus Bets Calculator
                    </Button>
                    <Button color="inherit" component={Link} to="/betgpt" className="nav-button" sx={{ textTransform: 'none' }}>
                        <Insights sx={{ marginRight: 0.5 }} />
                        BetGPT
                    </Button>
                    <Button color="inherit" component={Link} to="/profile" className="nav-button" sx={{ textTransform: 'none' }}>
                        <AccountCircle sx={{ marginRight: 0.5 }} />
                        Profile
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;