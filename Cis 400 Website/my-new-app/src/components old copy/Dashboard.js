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
        <Container component="main" maxWidth="lg" style={{marginTop: '20px'}}>
            {/* Form Controls for Scraping */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl style={{marginRight: '10px', minWidth: '120px'}}>
                        <InputLabel>Sport</InputLabel>
                        <Select value={sport} onChange={(e) => setSport(e.target.value)}>
                            <MenuItem value="football">Football</MenuItem>
                            <MenuItem value="basketball">Basketball</MenuItem>
                            <MenuItem value="baseball">Baseball</MenuItem>
                            {/* Add more sports as needed */}
                        </Select>
                    </FormControl>

                    <FormControl style={{marginRight: '10px', minWidth: '120px'}}>
                        <InputLabel>Sportsbook</InputLabel>
                        <Select value={sportsbook} onChange={(e) => setSportsbook(e.target.value)}>
                            <MenuItem value="sportsbook1">Sportsbook 1</MenuItem>
                            <MenuItem value="sportsbook2">Sportsbook 2</MenuItem>
                            <MenuItem value="sportsbook3">Sportsbook 3</MenuItem>
                            {/* Add more sportsbooks as needed */}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        style={{marginRight: '10px'}}
                    />

                    <Button variant="contained" color="primary" onClick={handleScrapeNow} disabled={loading}>
                        {loading ? <CircularProgress size={24}/> : 'Scrape Now'}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDetectArbitrage}
                            style={{marginLeft: '10px'}}>
                        Detect Arbitrage
                    </Button>
                </Grid>
            </Grid>

            {/* Sports Betting Arbitrage Dashboard */}
            <Typography component="h1" variant="h6" gutterBottom style={{marginTop: '20px'}}>
                Sports Betting Arbitrage Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Arbitrage Results */}
                <Grid item xs={12}>
                    {arbitrageResults.length > 0 ? (
                        arbitrageResults.map((result, index) => (
                            <Box key={index} border={1} borderColor="grey.400" borderRadius={4} padding={2}
                                 marginBottom={4}>
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

                {/* Scraping Results */}
                <Grid item xs={12}>
                    <ResultsTable data={scrapingData}/>
                </Grid>
            </Grid>
        </Container>
    );

}

    export default Dashboard;