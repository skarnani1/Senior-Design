import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid, Box, Tooltip } from '@mui/material'; // Import Tooltip
function BonusBetsCalculator() {
    const [bonusBetAmount, setBonusBetAmount] = useState('');
    const [odds1, setOdds1] = useState('');
    const [odds2, setOdds2] = useState('');
    const [calculatedLayStake, setCalculatedLayStake] = useState('');
    const [potentialProfit, setPotentialProfit] = useState('');
    const [calculationError, setCalculationError] = useState('');

    const [bonusBetAmountComplex, setBonusBetAmountComplex] = useState('');
    const [odds1Complex, setOdds1Complex] = useState('');
    const [odds2Complex, setOdds2Complex] = useState('');
    const [odds3Complex, setOdds3Complex] = useState('');
    const [odds4Complex, setOdds4Complex] = useState('');
    const [calculatedLayStake1Complex, setCalculatedLayStake1Complex] = useState('');
    const [calculatedLayStake2Complex, setCalculatedLayStake2Complex] = useState('');
    const [potentialProfitComplex, setPotentialProfitComplex] = useState('');

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
        const bet1Payout = (amount * odd1) / 100;
        const layStake = odd2 > 0 ? (100 * bet1Payout) / (odd2 + 100) :  (-odd2 * bet1Payout) / (100 - odd2); // Placeholder formula
        const profit = bet1Payout - layStake; // Placeholder formula

        setCalculatedLayStake(layStake.toFixed(2));
        setPotentialProfit(profit.toFixed(2));
    };

    const handleCalculateComplex = () => {
        // Basic placeholder calculation - **REPLACE WITH YOUR ACTUAL BONUS BET CALCULATION LOGIC**
        const amount = parseFloat(bonusBetAmountComplex);
        const odd1 = parseFloat(odds1Complex);
        const odd2 = parseFloat(odds2Complex);
        const odd3 = parseFloat(odds3Complex);
        const odd4 = parseFloat(odds4Complex);

        if (isNaN(amount) || isNaN(odd1) || isNaN(odd2)) {
            setCalculationError("Please enter valid numbers for all fields.");
            setCalculatedLayStake1Complex('');
            setCalculatedLayStake2Complex('');
            setPotentialProfitComplex('');
            return;
        }

        setCalculationError(''); // Clear any previous errors

        // Example calculation (simplified - needs proper bonus bet logic)
        const bet1Payout = ((amount * odd3) / 100);
        const layStake2 = odd4 > 0 ? (100 * bet1Payout) / (odd4 + 100) :  (-odd4 * bet1Payout) / (100 - odd4);
        const bonusCashVal = bet1Payout - layStake2;
        const bet2Payout = ((amount * odd1) / 100) + amount;
        const bet2LessBonusVal = bet2Payout - bonusCashVal;
        const layStake1 = odd2 > 0 ? (100 * bet2LessBonusVal) / (odd2 + 100) : (-odd2 * bet2LessBonusVal) / (100 - odd2);
        const totalPayout = bet1Payout + bet2LessBonusVal;
        const totalSpent = amount + layStake1 + layStake2;
        const profit = totalPayout - totalSpent;

        setCalculatedLayStake1Complex(layStake1.toFixed(2));
        setCalculatedLayStake2Complex(layStake2.toFixed(2));
        setPotentialProfitComplex(profit.toFixed(2));
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Bonus Bets Calculator</Typography>
                {calculationError && (
                    <Typography color="error" sx={{ mb: 2 }}>{calculationError}</Typography>
                )}
                <Typography variant="h5" gutterBottom>Simple Bonus Bet</Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <Tooltip title="Enter the amount of the bonus bet you received." placement="top" arrow>
                            <TextField
                                fullWidth
                                label="Bonus Bet Amount"
                                value={bonusBetAmount}
                                onChange={(e) => setBonusBetAmount(e.target.value)}
                                type="number"
                                variant="outlined"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Tooltip title="Enter the decimal odds for the bet you will place with the bonus bet." placement="top" arrow>
                            <TextField
                                fullWidth
                                label="Sportsbook 1 Odds (Bonus Bet)"
                                value={odds1}
                                onChange={(e) => setOdds1(e.target.value)}
                                type="number"
                                variant="outlined"
                                placeholder="e.g., 2.0 for decimal odds"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Tooltip title="Enter the decimal odds for the lay bet you will place at an exchange (e.g., Betfair)." placement="top" arrow>
                            <TextField
                                fullWidth
                                label="Sportsbook 2 Odds (Lay Bet)"
                                value={odds2}
                                onChange={(e) => setOdds2(e.target.value)}
                                type="number"
                                variant="outlined"
                                placeholder="e.g., 1.9 for decimal odds"
                            />
                        </Tooltip>
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
                        </Typography>
                    </Box>
                )}

                <Typography variant="h5" gutterBottom>Money Back Bonus Bet</Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <Tooltip title="Enter the amount of the bonus bet you received for the Money Back offer." placement="top" arrow>
                            <TextField
                                fullWidth
                                label="Bonus Bet Amount"
                                value={bonusBetAmountComplex}
                                onChange={(e) => setBonusBetAmountComplex(e.target.value)}
                                type="number"
                                variant="outlined"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Tooltip title="Enter the decimal odds for the first bet you will place with the bonus bet." placement="top" arrow>
                            <TextField
                                fullWidth
                                label="Sportsbook 1 Odds (Bonus Bet)"
                                value={odds1Complex}
                                onChange={(e) => setOdds1Complex(e.target.value)}
                                type="number"
                                variant="outlined"
                                placeholder="e.g., 2.0 for decimal odds"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Tooltip title="Enter the decimal odds for the first lay bet you will place at an exchange." placement="top" arrow>
                            <TextField
                                fullWidth
                                label="Sportsbook 2 Odds (Lay Bet 1)"
                                value={odds2Complex}
                                onChange={(e) => setOdds2Complex(e.target.value)}
                                type="number"
                                variant="outlined"
                                placeholder="e.g., 1.9 for decimal odds"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Tooltip title="Enter the decimal odds for the second bet you will place with the bonus bet (to trigger the money back)." placement="top" arrow>
                            <TextField
                                fullWidth
                                label="Sportsbook 3 Odds (Bonus Bet)"
                                value={odds3Complex}
                                onChange={(e) => setOdds3Complex(e.target.value)}
                                type="number"
                                variant="outlined"
                                placeholder="e.g., 2.0 for decimal odds"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Tooltip title="Enter the decimal odds for the second lay bet you will place at an exchange." placement="top" arrow>
                            <TextField
                                fullWidth
                                label="Sportsbook 4 Odds (Lay Bet 2)"
                                value={odds4Complex}
                                onChange={(e) => setOdds4Complex(e.target.value)}
                                type="number"
                                variant="outlined"
                                placeholder="e.g., 1.9 for decimal odds"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                        <Button variant="contained" color="primary" onClick={handleCalculateComplex}>
                            Calculate
                        </Button>
                    </Grid>
                </Grid>
                {calculatedLayStake1Complex && calculatedLayStake2Complex && potentialProfitComplex && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Calculation Results</Typography>
                        <Typography><strong>Lay Bet Stake 1:</strong> ${calculatedLayStake1Complex}</Typography>
                        <Typography><strong>Lay Bet Stake 2:</strong> ${calculatedLayStake2Complex}</Typography>
                        <Typography><strong>Potential Profit:</strong> ${potentialProfitComplex}</Typography>
                        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                            Note: This is a simplified calculation. Actual bonus bet strategies may vary.
                        </Typography>
                    </Box>
                )}

            </Paper>
        </Container>
    );
}

export default BonusBetsCalculator;