import React from 'react';
import { Container, Typography, Grid, List, ListItem, ListItemText, Paper, Box } from '@mui/material';
import ResultsTable from './ResultsTable';

function Profile() {
    // Placeholder data - DECLARED INSIDE COMPONENT
    const favoriteSportsbooksData = [
        'Sportsbook 1',
        'Sportsbook 3',
        // ... more favorite sportsbooks ...
    ];

    const favoriteSportsData = [
        'Football',
        'Basketball',
        // ... more favorite sports ...
    ];

    const pastBetsData = [
        {
            team1: 'Team A',
            team2: 'Team B',
            betType: 'Moneyline',
            betInfo: 'Team A Win',
            odds: '+150',
            dateOfGame: '2024-03-15',
            sportsbookName: 'Sportsbook 1',
            sport: 'football',
            betAmount: '$20',
            result: 'Win',
        },
        {
            team1: 'Team X',
            team2: 'Team Y',
            betType: 'Spread',
            betInfo: 'Team X -3.5',
            odds: '-110',
            dateOfGame: '2024-03-20',
            sportsbookName: 'Sportsbook 2',
            sport: 'basketball',
            betAmount: '$30',
            result: 'Loss',
        },
        // ... more past bet data ...
    ];

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
                Your Profile
            </Typography>

            <Grid container spacing={3}>
                {/* Favorite Sportsbooks Section */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Favorite Sportsbooks
                        </Typography>
                        <List dense>
                            {favoriteSportsbooksData.map((book, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={book} />
                                </ListItem>
                            ))}
                        </List>
                        {favoriteSportsbooksData.length === 0 && (
                            <Typography variant="body2" color="textSecondary">
                                No favorite sportsbooks selected.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Favorite Sports Section */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Favorite Sports
                        </Typography>
                        <List dense>
                            {favoriteSportsData.map((sport, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={sport} />
                                </ListItem>
                            ))}
                        </List>
                        {favoriteSportsData.length === 0 && (
                            <Typography variant="body2" color="textSecondary">
                                No favorite sports selected.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Past Bets Section */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Past Bets
                        </Typography>
                        <Box sx={{ minHeight: 200 }}>
                            {pastBetsData.length > 0 ? (
                                <ResultsTable data={pastBetsData} title="Past Bets" />
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 2 }}>
                                    No past bets recorded.
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Profile;