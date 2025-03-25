// Dashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress, Box, Checkbox, FormControlLabel, Paper, Slider } from '@mui/material';
import ResultsTable from './ResultsTable';
import ArbitrageResultsTable from './ArbitrageResultsTable'; // Import the new component
import AWS from 'aws-sdk';
import Papa from 'papaparse';
import fetchOddsData from '../scripts/OddsApiScript';
import processOddsData from '../scripts/JSONFilter';
import { detectArbitrage } from '../scripts/ArbitrageDetector';
import { Tooltip } from '@mui/material';

// AWS SDK Configuration (as before)
AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

const s3 = new AWS.S3();

function Dashboard() {
    // State variables
    const [scrapingData, setScrapingData] = useState([]);
    const [arbitrageResults, setArbitrageResults] = useState([]);
    const [sport, setSport] = useState(''); // Sport for scraping
    const [sportsbook, setSportsbook] = useState(''); // Sportsbook for scraping
    const [date, setDate] = useState(''); // Date for scraping
    const [loading, setLoading] = useState(false); // Loading state for Scrape Now button
    const [scrapingStatus, setScrapingStatus] = useState('idle'); // Scraping status indicator
    const [lastScrapedTime, setLastScrapedTime] = useState(null); // Last scraped timestamp
    const [sportsFilter, setSportsFilter] = useState([]); // Filter by sports
    const [sportsbooksFilter, setSportsbooksFilter] = useState([]); // Filter by sportsbooks
    const [betTypeFilter, setBetTypeFilter] = useState(''); // Filter by bet type
    const [oddsRangeFilter, setOddsRangeFilter] = useState([-500, 500]); // Filter by odds range
    const [tableFilter, setTableFilter] = useState(''); // State for table filter text

    const sportsOptions = ['football', 'basketball', 'baseball']; // Example sports options
    const sportsbookOptions = ['sportsbook1', 'sportsbook2', 'sportsbook3']; // Example sportsbook options
    const betTypeOptions = ['Moneyline', 'Spread', 'Totals', 'Props']; // Example bet types

    const bucketName = 'combined-odds';
    const key = 'OddsAPI_combined_odds-2.csv';

    // Function to fetch data from S3
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
            const parsedData = Papa.parse(csvString, { header: true }).data;
            setScrapingData(parsedData);
            console.log('Data fetched from S3:', parsedData);
        } catch (error) {
            console.error('Failed to fetch data from S3:', error.message);
        }
    };

    // Fetch data from S3 on component mount
    useEffect(() => {
        fetchDataFromS3();
    }, []);

    // Function to handle the entire scrape and upload process
    const handleScrapeNow = async () => {
        setLoading(true);
        setScrapingStatus('scraping');
        try {
            console.log(`[Scrape Now] Starting...`);
            setScrapingStatus('fetching');
            const oddsData = await fetchOddsData();
            console.log('[Scrape Now] Raw Odds Data:', oddsData);

            if (!oddsData || oddsData.length === 0) {
                console.warn(' No odds data returned. Skipping upload.');
                setScrapingStatus('no-data');
                return;
            }

            setScrapingStatus('processing');
            const csvData = processOddsData(oddsData);
            console.log('[Scrape Now] Processed CSV:\n', csvData);

            if (!csvData || csvData.trim() === '') {
                console.warn(' CSV data is empty. Aborting upload.');
                setScrapingStatus('empty-csv');
                return;
            }

            console.log(`[Scrape Now] Uploading to S3: bucket="${bucketName}", key="${key}"`);
            setScrapingStatus('uploading');
            await s3
                .putObject({
                    Bucket: bucketName,
                    Key: key,
                    Body: csvData,
                    ContentType: 'text/csv',
                })
                .promise();

            console.log("S3 Upload successful");
            setScrapingStatus('complete');
            setLastScrapedTime(new Date());
            await fetchDataFromS3();
        } catch (error) {
            console.error('Error during scraping or S3 upload:', error.message);
            setScrapingStatus('error');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle arbitrage detection
    const handleDetectArbitrage = async () => {
        console.log('Detecting arbitrage opportunities...');
        const results = await detectArbitrage(scrapingData);
        setArbitrageResults(results.map(result => ({ ...result, isArbitrageRow: true }))); // Mark arbitrage rows
        console.log('Arbitrage results:', results);
    };


    // Filter data based on selected filters
    const filteredScrapingData = useMemo(() => {
        let filteredData = scrapingData;

        if (sportsFilter.length > 0) {
            filteredData = filteredData.filter(item => sportsFilter.includes(item.sport));
        }
        if (sportsbooksFilter.length > 0) {
            filteredData = filteredData.filter(item => sportsbooksFilter.includes(item.sportsbookName));
        }
        if (betTypeFilter) {
            filteredData = filteredData.filter(item => item.betType === betTypeFilter);
        }
        if (oddsRangeFilter) {
            filteredData = filteredData.filter(item => {
                const oddsValue = parseInt(item.odds, 10);
                if (isNaN(oddsValue)) return true;
                return oddsValue >= oddsRangeFilter[0] && oddsValue <= oddsRangeFilter[1];
            });
        }
        return filteredData;
    }, [scrapingData, sportsFilter, sportsbooksFilter, betTypeFilter, oddsRangeFilter]);

    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Live Odds and Arbitrage Dashboard
            </Typography>


            {/* Arbitrage Detection Button */}
            <Grid item xs={12} md={3} sx={{ textAlign: 'left' }}>
                <Button variant="contained" color="primary" onClick={handleScrapeNow} disabled={loading}>
                    {loading  ? <CircularProgress size={24} /> : 'Scrape Now'}
                </Button>
            </Grid>
            <Box sx={{ mb: 3, textAlign: 'right' }}>
                <Tooltip title="Click to scan the current live odds data for potential arbitrage betting opportunities." placement="top" arrow>
                    <Button variant="contained" color="secondary" onClick={handleDetectArbitrage}>
                        Detect Arbitrage Opportunities
                    </Button>
                </Tooltip>
            </Box>

            {/* Arbitrage Results Section - Now using ArbitrageResultsTable */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Arbitrage Opportunities
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                        {arbitrageResults.length > 0 ? (
                            <ArbitrageResultsTable data={arbitrageResults} title="Arbitrage Opportunities" />
                        ) : (
                            <Typography>No arbitrage opportunities detected.</Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Live Odds Data Filter Input */}
            <TextField
                fullWidth
                label="Filter Live Odds Table"
                variant="outlined"
                margin="normal"
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
                placeholder="Enter text to filter table"
            />

            {/* Scraping Results Table Section */}
            <Typography variant="h6" gutterBottom>
                Live Odds Data
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ResultsTable data={filteredScrapingData} title="Live Odds Data" filterText={tableFilter} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Dashboard;