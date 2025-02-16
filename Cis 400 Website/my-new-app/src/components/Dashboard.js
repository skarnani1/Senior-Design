import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress, Box, Checkbox, FormControlLabel, Paper } from '@mui/material'; // ADDED Paper import
import ResultsTable from './ResultsTable';
import AWS from 'aws-sdk';
import Papa from 'papaparse';
import fetchOddsData from '../scripts/OddsApiScript';
import processOddsData from '../scripts/JSONFilter';
import { detectArbitrage } from '../scripts/ArbitrageDetector';

// AWS SDK Configuration (as before) ...
AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

const s3 = new AWS.S3();

function Dashboard() {
    // State variables - DECLARED INSIDE COMPONENT
    const [scrapingData, setScrapingData] = useState([]);
    const [arbitrageResults, setArbitrageResults] = useState([]);
    const [sport, setSport] = useState('');
    const [sportsbook, setSportsbook] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [sportsFilter, setSportsFilter] = useState([]);
    const [sportsbooksFilter, setSportsbooksFilter] = useState([]);
    const [favoriteSports, setFavoriteSports] = useState([]);

    const sportsOptions = ['football', 'basketball', 'baseball'];
    const sportsbookOptions = ['sportsbook1', 'sportsbook2', 'sportsbook3'];
    const bucketName = 'combined-odds';
    const key = 'OddsAPI_combined_odds-2.csv';

    // Function to fetch data from S3 (as before)
    const fetchDataFromS3 = async () => {
        try {
            console.log('Fetching data from S3...');
            const response = await s3
                .getObject({
                    Bucket: bucketName,
                    Key: key,
                })
                .promise();

            const csvString = response.Body.toString('utf-8');
            const parsedData = Papa.parse(csvString, {header: true}).data;
            setScrapingData(parsedData);
            console.log('Data fetched from S3:', parsedData);
        } catch (error) {
            console.error('Failed to fetch data from S3:', error.message);
        }
    };

    // Fetch data from S3 when the page loads (as before)
    useEffect(() => {
        fetchDataFromS3();
    }, []);

    // Function to handle the entire scrape and upload process - DECLARED INSIDE COMPONENT
    const handleScrapeNow = async () => {
        setLoading(true);
        try {
            console.log(`Scraping data for sport: ${sport}, sportsbook: ${sportsbook}, on date: ${date}`);
            console.log('Fetching data from the Odds API...');
            const oddsData = await fetchOddsData();
            console.log('Processing JSON data into CSV...');
            const csvData = processOddsData(oddsData);
            console.log(`Uploading file "${key}" to bucket "${bucketName}".`);
            await s3
                .putObject({
                    Bucket: bucketName,
                    Key: key,
                    Body: csvData,
                    ContentType: 'text/csv',
                })
                .promise();
            await fetchDataFromS3();
            console.log('Scraping completed successfully!');
        } catch (error) {
            console.error('Error during scraping:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle arbitrage detection - DECLARED INSIDE COMPONENT
    const handleDetectArbitrage = async () => {
        console.log('Detecting arbitrage opportunities...');
        const results = await detectArbitrage(scrapingData);
        setArbitrageResults(results);
        console.log('Arbitrage results:', results);
    };

    // Function to toggle favorite sport - DECLARED INSIDE COMPONENT
    const handleToggleFavoriteSport = (sportOption) => {
        if (favoriteSports.includes(sportOption)) {
            setFavoriteSports(favoriteSports.filter(favSport => favSport !== sportOption));
        } else {
            setFavoriteSports([...favoriteSports, sportOption]);
        }
    };

    // Filter data based on selected filters and favorite sports - DECLARED INSIDE COMPONENT
    const filteredScrapingData = useMemo(() => {
        let filteredData = scrapingData;

        if (sportsFilter.length > 0) {
            filteredData = filteredData.filter(item => sportsFilter.includes(item.sport));
        }
        if (sportsbooksFilter.length > 0) {
            filteredData = filteredData.filter(item => sportsbooksFilter.includes(item.sportsbookName));
        }
        if (favoriteSports.length > 0) {
            filteredData = filteredData.filter(item => favoriteSports.includes(item.sport));
        }

        return filteredData;
    }, [scrapingData, sportsFilter, sportsbooksFilter, favoriteSports]);

    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Live Odds and Arbitrage Dashboard
            </Typography>

            {/* Scraping Controls Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Scrape Live Odds
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="sport-select-label">Sport to Scrape</InputLabel>
                            <Select
                                labelId="sport-select-label"
                                value={sport}
                                label="Sport to Scrape"
                                onChange={(e) => setSport(e.target.value)}
                            >
                                {sportsOptions.map((sportOption) => (
                                    <MenuItem key={sportOption} value={sportOption}>{sportOption}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="sportsbook-select-label">Sportsbook</InputLabel>
                            <Select
                                labelId="sportsbook-select-label"
                                value={sportsbook}
                                label="Sportsbook"
                                onChange={(e) => setSportsbook(e.target.value)}
                            >
                                {sportsbookOptions.map((bookOption) => (
                                    <MenuItem key={bookOption} value={bookOption}>{bookOption}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
                        <Button variant="contained" color="primary" onClick={handleScrapeNow} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Scrape Now'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Filters Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Filter Live Odds
                </Typography>
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="sports-filter-label">Filter by Sports</InputLabel>
                            <Select
                                labelId="sports-filter-label"
                                multiple
                                value={sportsFilter}
                                onChange={(e) => setSportsFilter(e.target.value)}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {sportsOptions.map((sportOption) => (
                                    <MenuItem key={sportOption} value={sportOption}>{sportOption}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="sportsbooks-filter-label">Filter by Sportsbooks</InputLabel>
                            <Select
                                labelId="sportsbooks-filter-label"
                                multiple
                                value={sportsbooksFilter}
                                onChange={(e) => setSportsbooksFilter(e.target.value)}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {sportsbookOptions.map((bookOption) => (
                                    <MenuItem key={bookOption} value={bookOption}>{bookOption}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Favorite Sports Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Favorite Sports
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    {sportsOptions.map((sportOption) => (
                        <FormControlLabel
                            key={sportOption}
                            control={
                                <Checkbox
                                    checked={favoriteSports.includes(sportOption)}
                                    onChange={() => handleToggleFavoriteSport(sportOption)}
                                    name={sportOption}
                                    color="primary"
                                />
                            }
                            label={sportOption}
                        />
                    ))}
                </Box>
            </Paper>

            {/* Arbitrage Detection Button */}
            <Box sx={{ mb: 3, textAlign: 'right' }}>
                <Button variant="contained" color="secondary" onClick={handleDetectArbitrage}>
                    Detect Arbitrage Opportunities
                </Button>
            </Box>

            {/* Arbitrage Results Section */}
            <Typography variant="h6" gutterBottom>
                Arbitrage Opportunities
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                    {arbitrageResults.length > 0 ? (
                        arbitrageResults.map((result, index) => (
                            <Box key={index} border={1} borderColor="grey.400" borderRadius={4} padding={2} mb={2}>
                                <Typography variant="h6" gutterBottom>
                                    Arbitrage Opportunity #{index + 1}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Percent:</strong> {result.percent.toFixed(2)}%
                                </Typography>

                                {/* Row 1 */}
                                <Typography variant="body1" gutterBottom>
                                    <strong>Row 1:</strong>
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}><strong>Team 1:</strong> {result.row1.team1}</Grid>
                                    <Grid item xs={4}><strong>Team 2:</strong> {result.row1.team2}</Grid>
                                    <Grid item xs={4}><strong>Bet Type:</strong> {result.row1.betType}</Grid>
                                    <Grid item xs={4}><strong>Bet Info:</strong> {result.row1.betInfo}</Grid>
                                    <Grid item xs={4}><strong>Odds:</strong> {result.row1.odds}</Grid>
                                    <Grid item xs={4}><strong>Date of Game:</strong> {result.row1.dateOfGame}</Grid>
                                    <Grid item xs={4}><strong>Sportsbook:</strong> {result.row1.sportsbookName}</Grid>
                                    <Grid item xs={4}><strong>Sport:</strong> {result.row1.sport}</Grid>
                                </Grid>

                                {/* Row 2 */}
                                <Typography variant="body1" gutterBottom style={{marginTop: '10px'}}>
                                    <strong>Row 2:</strong>
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}><strong>Team 1:</strong> {result.row2.team1}</Grid>
                                    <Grid item xs={4}><strong>Team 2:</strong> {result.row2.team2}</Grid>
                                    <Grid item xs={4}><strong>Bet Type:</strong> {result.row2.betType}</Grid>
                                    <Grid item xs={4}><strong>Bet Info:</strong> {result.row2.betInfo}</Grid>
                                    <Grid item xs={4}><strong>Odds:</strong> {result.row2.odds}</Grid>
                                    <Grid item xs={4}><strong>Date of Game:</strong> {result.row2.dateOfGame}</Grid>
                                    <Grid item xs={4}><strong>Sportsbook:</strong> {result.row2.sportsbookName}</Grid>
                                    <Grid item xs={4}><strong>Sport:</strong> {result.row2.sport}</Grid>
                                </Grid>
                            </Box>
                        ))
                    ) : (
                        <Typography>No arbitrage opportunities detected.</Typography>
                    )}
                </Grid>
            </Grid>

            {/* Scraping Results Table Section */}
            <Typography variant="h6" gutterBottom>
                Scraping Results
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ResultsTable data={filteredScrapingData} title="Live Odds Data"/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Dashboard;