import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress, Box } from '@mui/material';
import ResultsTable from './ResultsTable';
import AWS from 'aws-sdk';
import Papa from 'papaparse';
import fetchOddsData from '../scripts/OddsApiScript'; // Script to fetch data
import processOddsData from '../scripts/JSONFilter'; // Script to process JSON to CSV
import { detectArbitrage } from '../scripts/ArbitrageDetector'; // Arbitrage detection logic

// AWS SDK Configuration
AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

const s3 = new AWS.S3();

function Dashboard() {
    const [scrapingData, setScrapingData] = useState([]); // State for table data
    const [arbitrageResults, setArbitrageResults] = useState([]); // State for arbitrage results
    const [sport, setSport] = useState(''); // Selected sport
    const [sportsbook, setSportsbook] = useState(''); // Selected sportsbook
    const [date, setDate] = useState(''); // Selected date
    const [loading, setLoading] = useState(false); // Loading state

    const bucketName = 'combined-odds'; // Replace with your bucket name
    const key = 'OddsAPI_combined_odds-2.csv'; // File key for S3

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
            const parsedData = Papa.parse(csvString, {header: true}).data;
            setScrapingData(parsedData);
            console.log('Data fetched from S3:', parsedData);
        } catch (error) {
            console.error('Failed to fetch data from S3:', error.message);
        }
    };

    // Fetch data from S3 when the page loads
    useEffect(() => {
        fetchDataFromS3();
    }, []);

    // Function to handle the entire scrape and upload process
    const handleScrapeNow = async () => {
        setLoading(true); // Set loading state
        try {
            console.log(`Scraping data for sport: ${sport}, sportsbook: ${sportsbook}, on date: ${date}`);

            // Step 1: Fetch data from the Odds API
            console.log('Fetching data from the Odds API...');
            const oddsData = await fetchOddsData();

            // Step 2: Process JSON data into CSV
            console.log('Processing JSON data into CSV...');
            const csvData = processOddsData(oddsData);

            // Step 3: Overwrite the CSV file in S3
            console.log(`Uploading file "${key}" to bucket "${bucketName}". If it already exists, it will be overwritten.`);
            await s3
                .putObject({
                    Bucket: bucketName,
                    Key: key,
                    Body: csvData,
                    ContentType: 'text/csv',
                })
                .promise();

            // Step 4: Fetch the updated CSV file back from S3
            await fetchDataFromS3();

            console.log('Scraping completed successfully!');
        } catch (error) {
            console.error('Error during scraping:', error.message);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Function to handle arbitrage detection
    const handleDetectArbitrage = async () => {
        console.log('Detecting arbitrage opportunities...');
        const results = await detectArbitrage(scrapingData);
        setArbitrageResults(results);
        console.log('Arbitrage results:', results);
    };

    return (
        <Container component="main" maxWidth="lg" style={{ marginTop: '5px' }}>
            {/* Dashboard Title */}
            <Typography
                component="h1"
                variant="h5"
                style={{
                    fontWeight: 'bold',
                    textAlign: 'left',
                    marginBottom: '10px',
                }}
            >
                Dashboard
            </Typography>

            {/* Filter and Button Section */}
            <Grid
                container
                spacing={2}
                alignItems="center"
                style={{
                    padding: '10px',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    marginBottom: '20px',
                }}
            >
                {/* Filters */}
                <Grid container item xs={12} md={9} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Sport</InputLabel>
                            <Select value={sport} onChange={(e) => setSport(e.target.value)} label="Sport">
                                <MenuItem value="football">Football</MenuItem>
                                <MenuItem value="basketball">Basketball</MenuItem>
                                <MenuItem value="baseball">Baseball</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Sportsbook</InputLabel>
                            <Select
                                value={sportsbook}
                                onChange={(e) => setSportsbook(e.target.value)}
                                label="Sportsbook"
                            >
                                <MenuItem value="sportsbook1">Sportsbook 1</MenuItem>
                                <MenuItem value="sportsbook2">Sportsbook 2</MenuItem>
                                <MenuItem value="sportsbook3">Sportsbook 3</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                </Grid>

                {/* Buttons */}
                <Grid
                    container
                    item
                    xs={12}
                    md={3}
                    spacing={2}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid item style={{ width: '100%' }}>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: '#2d4edb',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '10px 0',
                                borderRadius: '0',
                                width: '100%',
                                height: '50px',
                            }}
                            onClick={handleScrapeNow}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Scrape Now'}
                        </Button>
                    </Grid>
                    <Grid item style={{ width: '100%' }}>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: '#e53935',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '10px 0',
                                borderRadius: '0',
                                width: '100%',
                                height: '50px',
                            }}
                            onClick={handleDetectArbitrage}
                        >
                            Detect Arbitrage
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            {/* Arbitrage Results Section */}
            {arbitrageResults.length > 0 ? (
                <ResultsTable data={arbitrageResults} title="Arbitrage Results" />
            ) : (
                <Typography
                    variant="body1"
                    style={{
                        marginTop: '20px',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        color: 'grey',
                    }}
                >
                    No arbitrage detected.
                </Typography>
            )}

            {/* Scraping Results Section */}
            <ResultsTable data={scrapingData} title="Scraping Results" />
        </Container>
    );
}

    export default Dashboard;