import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid, Box } from '@mui/material';

function BonusBetsCalculator() {
    const [bonusBetAmount, setBonusBetAmount] = useState('');
    const [odds1, setOdds1] = useState('');
    const [odds2, setOdds2] = useState('');
    const [calculatedLayStake, setCalculatedLayStake] = useState('');
    const [potentialProfit, setPotentialProfit] = useState('');
    const [calculationError, setCalculationError] = useState('');

    const handleCalculate = () => {
        // Basic placeholder calculation - **REPLACE WITH YOUR ACTUAL BONUS BET CALCULATION LOGIC**
        const amount = parseFloat(bonusBetAmount);
        const odd1 = parseFloat(odds1);
        const odd2 = parseFloat(odds2);

        if (isNaN(amount) || isNaN(odd1) || isNaN(odd2)) {
            setCalculationError("Please enter valid numbers for all fields.");
            setCalculatedLayStake('');
            setPotentialProfit('');
            return;
        }

        setCalculationError(''); // Clear any previous errors

        // Example calculation (simplified - needs proper bonus bet logic)
        const layStake = (amount * odd1) / (odd2 + 1); // Placeholder formula
        const profit = amount - layStake; // Placeholder formula

        setCalculatedLayStake(layStake.toFixed(2));
        setPotentialProfit(profit.toFixed(2));
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Bonus Bets Calculator</Typography>
                {calculationError && (
                    <Typography color="error" sx={{ mb: 2 }}>{calculationError}</Typography>
                )}
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Bonus Bet Amount"
                            value={bonusBetAmount}
                            onChange={(e) => setBonusBetAmount(e.target.value)}
                            type="number"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Sportsbook 1 Odds (Bonus Bet)"
                            value={odds1}
                            onChange={(e) => setOdds1(e.target.value)}
                            type="number"
                            variant="outlined"
                            placeholder="e.g., 2.0 for decimal odds"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Sportsbook 2 Odds (Lay Bet)"
                            value={odds2}
                            onChange={(e) => setOdds2(e.target.value)}
                            type="number"
                            variant="outlined"
                            placeholder="e.g., 1.9 for decimal odds"
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                        <Button variant="contained" color="primary" onClick={handleCalculate}>
                            Calculate
                        </Button>
                    </Grid>
                </Grid>

                {calculatedLayStake && potentialProfit && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Calculation Results</Typography>
                        <Typography><strong>Lay Bet Stake:</strong> ${calculatedLayStake}</Typography>
                        <Typography><strong>Potential Profit:</strong> ${potentialProfit}</Typography>
                        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                            Note: This is a simplified calculation. Actual bonus bet strategies may vary.
                            **Replace the calculation logic in `BonusBetsCalculator.js` with your accurate formula.**
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default BonusBetsCalculator;