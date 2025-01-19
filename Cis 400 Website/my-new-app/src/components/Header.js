import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo from '../assets/logo black.png'; // Import your logo
// import './Header.css'; // Import the CSS file

import 'bootstrap/dist/css/bootstrap.css';

const pagesLink = 
  {'Dashboard': '/dashboard', 
    'About': '/about', 
    'Contact': '/contact'}

function Header() {
  return (
      <>
        <AppBar position='static'>
          <Toolbar
            sx={{
              backgroundColor: 'white',
              boxShadow: 'none'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Box
                component='img'
                sx={{
                  maxHeight: '150px',
                  width: 'auto'
                }}
                src={logo}
              />
            </Box>
          </Toolbar>

          <Toolbar
            sx={{
              backgroundColor: '#15253F'
            }}
          >
            <Box 
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}
            >
              {Object.entries(pagesLink).map(([page, link]) => (
                <Button
                  key={page}
                  component={Link} to={link}
                  sx={{
                    color: 'white',
                  }}
                >
                  {page}
                </Button>
              ))}

              <Typography
                sx={{
                  position: 'absolute',
                  left: 0,
                  color: 'white'
                }}
              >
                Welcome!
              </Typography>

              <Box
                sx={{
                  position: 'absolute', 
                  right: 0
                }}
              >
                <Button
                  component={Link} to="/login"
                  sx={{
                    color: 'white'
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link} to="/signup"
                  sx={{
                    color: 'white'
                  }}
                >
                  Signup
                </Button>

              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </>
  );
}

export default Header;
