import React, { useState } from 'react';
import { Container, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import ResultsTable from './ResultsTable';
import AWS from 'aws-sdk';
import Papa from 'papaparse';

// AWS SDK Configuration
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1', // Replace with your region
});

const s3 = new AWS.S3();

function Dashboard() {
  const [scrapingData, setScrapingData] = useState([]); // Start with an empty array
  const [sport, setSport] = useState('');
  const [sportsbook, setSportsbook] = useState('');
  const [date, setDate] = useState('');

  const readCsvFromS3 = async (bucketName, key) => {
    try {
      const params = { Bucket: bucketName, Key: key };
      const s3Object = await s3.getObject(params).promise();

      const csvData = [];
      const csvString = new TextDecoder('utf-8').decode(new Uint8Array(s3Object.Body));

      Papa.parse(csvString, {
        header: true, // Automatically parse headers
        complete: (results) => {
          results.data.forEach((row) => {
            csvData.push({
              team1: row['Team 1'],
              team2: row['Team 2'],
              betType: row['Bet Type'],
              betInfo: row['Bet Info'],
              odds: row['Odds'],
              dateOfGame: row['Date of Game'],
              sportsbookName: row['Sportsbook Name'],
              sport: row['Sport'],
            });
          });
        },
      });

      return csvData;
    } catch (error) {
      console.error('Error reading or parsing CSV:', error);
      throw error;
    }
  };

  const handleScrapeNow = async () => {
    const bucketName = 'combined-odds'; // Replace with your bucket name
    const key = 'OddsAPI_combined_odds-1.csv'; // Replace with your file's key in the bucket

    try {
      console.log(`Scraping data for sport: ${sport}, sportsbook: ${sportsbook}, on date: ${date}`);
      console.log('Fetching data from S3...');
      const csvData = await readCsvFromS3(bucketName, key);
      console.log('Data fetched:', csvData);
      setScrapingData(csvData); // Update state with the loaded data
    } catch (error) {
      console.error('Failed to fetch data from S3:', error);
    }
  };

  return (
    <Container component="main" maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Sports Betting Arbitrage Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl style={{ marginRight: '10px', minWidth: '120px' }}>
            <InputLabel>Sport</InputLabel>
            <Select value={sport} onChange={(e) => setSport(e.target.value)}>
              <MenuItem value="football">Football</MenuItem>
              <MenuItem value="basketball">Basketball</MenuItem>
              <MenuItem value="baseball">Baseball</MenuItem>
              {/* Add more sports as needed */}
            </Select>
          </FormControl>

          <FormControl style={{ marginRight: '10px', minWidth: '120px' }}>
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
            style={{ marginRight: '10px' }}
          />

          <Button variant="contained" color="primary" onClick={handleScrapeNow}>
            Scrape Now
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ResultsTable data={scrapingData} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;