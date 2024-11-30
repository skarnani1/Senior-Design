import React, { useState } from 'react';
import { Container, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import ScrapingControls from './ScrapingControls';
import ResultsTable from './ResultsTable';

const data = [
  { team1: "BAL Ravens", team2: "TB Buccaneers", betType: "Spread", betInfo: "-4.5", odds: "-110", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.762498", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "BAL Ravens", team2: "TB Buccaneers", betType: "Total", betInfo: "O51", odds: "-110", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.762516", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "BAL Ravens", team2: "TB Buccaneers", betType: "MoneyLine", betInfo: "BAL Ravens", odds: "-225", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.762526", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "TB Buccaneers", team2: "BAL Ravens", betType: "Spread", betInfo: "4.5", odds: "-110", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.763008", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "TB Buccaneers", team2: "BAL Ravens", betType: "Total", betInfo: "U51", odds: "-110", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.763017", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "TB Buccaneers", team2: "BAL Ravens", betType: "MoneyLine", betInfo: "TB Buccaneers", odds: "185", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.763026", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "LA Chargers", team2: "ARI Cardinals", betType: "Spread", betInfo: "-1", odds: "-112", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.763499", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "LA Chargers", team2: "ARI Cardinals", betType: "Total", betInfo: "O44", odds: "-112", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.763509", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "LA Chargers", team2: "ARI Cardinals", betType: "MoneyLine", betInfo: "LA Chargers", odds: "-118", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.763520", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "ARI Cardinals", team2: "LA Chargers", betType: "Spread", betInfo: "1", odds: "-108", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.763990", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "ARI Cardinals", team2: "LA Chargers", betType: "Total", betInfo: "U44", odds: "-108", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.764001", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "ARI Cardinals", team2: "LA Chargers", betType: "MoneyLine", betInfo: "ARI Cardinals", odds: "100", dateOfGame: "Today", dateTime: "2024-10-21 19:45:32.764012", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "MIN Vikings", team2: "LA Rams", betType: "Spread", betInfo: "-3", odds: "-112", dateOfGame: "THU OCT 24TH", dateTime: "2024-10-21 19:45:32.764999", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "MIN Vikings", team2: "LA Rams", betType: "Total", betInfo: "O48", odds: "-112", dateOfGame: "THU OCT 24TH", dateTime: "2024-10-21 19:45:32.765008", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "MIN Vikings", team2: "LA Rams", betType: "MoneyLine", betInfo: "MIN Vikings", odds: "-155", dateOfGame: "THU OCT 24TH", dateTime: "2024-10-21 19:45:32.765016", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "LA Rams", team2: "MIN Vikings", betType: "Spread", betInfo: "3", odds: "-108", dateOfGame: "THU OCT 24TH", dateTime: "2024-10-21 19:45:32.765448", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "LA Rams", team2: "MIN Vikings", betType: "Total", betInfo: "U48", odds: "-108", dateOfGame: "THU OCT 24TH", dateTime: "2024-10-21 19:45:32.765456", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "LA Rams", team2: "MIN Vikings", betType: "MoneyLine", betInfo: "LA Rams", odds: "130", dateOfGame: "THU OCT 24TH", dateTime: "2024-10-21 19:45:32.765463", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "TEN Titans", team2: "DET Lions", betType: "Spread", betInfo: "11", odds: "-112", dateOfGame: "SUN OCT 27TH", dateTime: "2024-10-21 19:45:32.766278", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "TEN Titans", team2: "DET Lions", betType: "Total", betInfo: "O45.5", odds: "-110", dateOfGame: "SUN OCT 27TH", dateTime: "2024-10-21 19:45:32.766286", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "TEN Titans", team2: "DET Lions", betType: "MoneyLine", betInfo: "TEN Titans", odds: "440", dateOfGame: "SUN OCT 27TH", dateTime: "2024-10-21 19:45:32.766293", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "DET Lions", team2: "TEN Titans", betType: "Spread", betInfo: "-11", odds: "-108", dateOfGame: "SUN OCT 27TH", dateTime: "2024-10-21 19:45:32.766803", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "DET Lions", team2: "TEN Titans", betType: "Total", betInfo: "U45.5", odds: "-110", dateOfGame: "SUN OCT 27TH", dateTime: "2024-10-21 19:45:32.766814", sportsbookName: "DraftKings", sport: "NFL" },
  { team1: "DET Lions", team2: "TEN Titans", betType: "MoneyLine", betInfo: "DET Lions", odds: "-600", dateOfGame: "SUN OCT 27TH", dateTime: "2024-10-21 19:45:32.766823", sportsbookName: "DraftKings", sport: "NFL" },
];

function Dashboard() {
  const [scrapingData, setScrapingData] = useState(data);
  const [sport, setSport] = useState('');
  const [sportsbook, setSportsbook] = useState('');
  const [date, setDate] = useState('');

  const handleScrapeNow = () => {
    // Add your scraping logic here
    console.log(`Scraping data for ${sport}, ${sportsbook}, on ${date}`);
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