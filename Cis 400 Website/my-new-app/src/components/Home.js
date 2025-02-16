import React from 'react';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material'; // Added Box import
import { Link } from 'react-router-dom';

function Home() {
    return (
        <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}> {/* Using sx for marginTop */}
            {/* Hero Section */}
            <Paper elevation={3} sx={{ p: 4, mb: 4, bgcolor: 'primary.light' }}> {/* Using sx for padding, marginBottom, bgcolor */}
                <Typography variant="h4" component="h1" gutterBottom color="white">
                    Unlock Your Betting Advantage
                </Typography>
                <Typography variant="subtitle1" paragraph color="white" sx={{ opacity: 0.9 }}> {/* Using sx for opacity */}
                    Discover real-time odds, arbitrage opportunities, and data-driven insights to make smarter sports bets.
                </Typography>
                <Button variant="contained" color="secondary" size="large" component={Link} to="/dashboard">
                    Explore Live Odds Dashboard
                </Button>
            </Paper>

            {/* Feature Highlights Section */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}> {/* Using sx for marginTop */}
                Key Features to Elevate Your Betting
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}> {/* Using sx for marginBottom */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'left' }}> {/* Using sx for padding, textAlign */}
                        <Typography variant="h6" gutterBottom>Live Odds Comparison</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Access real-time odds from multiple sportsbooks, side-by-side, ensuring you never miss the best value.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'left' }}> {/* Using sx for padding, textAlign */}
                        <Typography variant="h6" gutterBottom>Arbitrage Opportunity Detection</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Our advanced algorithms automatically detect arbitrage opportunities, highlighting potential profit.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'left' }}> {/* Using sx for padding, textAlign */}
                        <Typography variant="h6" gutterBottom>Personalized Betting Experience</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Customize your dashboard with favorite sports and sportsbooks for a tailored betting view.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Call to Action Section */}
            <Box sx={{ mt: 5, mb: 5 }}> {/* Using Box and sx for marginTop and marginBottom */}
                <Typography variant="h6" paragraph color="textSecondary">
                    Ready to bet smarter?
                </Typography>
                <Button variant="contained" color="primary" size="large" component={Link} to="/dashboard">
                    Get Started Now
                </Button>
            </Box>

            <Typography variant="caption" color="textSecondary">
                © 2024 Your Company Name. Data provided by Odds API. Please bet responsibly.
            </Typography>
        </Container>
    );
}

export default Home;