const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const axios = require('axios');
const NBA_TEAM_IDS = require('../../utils/nbaTeamIds');

router.get('/injuries/:team', async (req, res) => {
    const API_KEY = process.env.SPORTRADAR_API_KEY;
    const teamName = req.params.team;

    try {
        console.log(`Fetching injuries for team: ${teamName}`);
        const response = await fetch(
            `https://api.sportradar.com/nba/trial/v5/en/league/injuries.json?api_key=${API_KEY}`,
            { headers: { accept: 'application/json' } }
        );

        if (!response.ok) {
            console.error(`API Error: ${response.status} - ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data from Sportradar API');
        
        const team = data.teams.find(team => 
            team.name === teamName || 
            `${team.market} ${team.name}` === teamName
        );

        if (!team) {
            console.log(`No team found matching: ${teamName}`);
            return res.json([]);
        }

        const injuries = team.players
            .filter(player => player.injuries && player.injuries.length > 0)
            .map(player => ({
                player: player.full_name,
                position: player.position,
                injury: player.injuries[0].desc,
                status: player.injuries[0].status,
                lastUpdate: player.injuries[0].update_date,
                details: player.injuries[0].comment
            }));

        console.log(`Found ${injuries.length} injuries for ${teamName}`);
        res.json(injuries);

    } catch (error) {
        console.error('Error fetching injury data:', error);
        res.status(500).json({ error: 'Failed to fetch injury data' });
    }
});

router.get('/odds', async (req, res) => {
    const API_KEY = '6448192984900355b8ceaf3388466e6b';
    const SPORT = 'basketball_nba';
    const REGIONS = 'us';
    const MARKETS = 'h2h,spreads,totals';
    const ODDS_FORMAT = 'american';
    const DATE_FORMAT = 'iso';

    try {
        console.log(`Fetching odds for ${SPORT} in ${REGIONS} with ${MARKETS} and ${ODDS_FORMAT} format and ${DATE_FORMAT} date format`);
        const response = await axios.get(
            `https://api.the-odds-api.com/v4/sports/${SPORT}/odds`,
            {
                params: {
                    api_key: API_KEY,
                    regions: REGIONS,
                    markets: MARKETS,
                    oddsFormat: ODDS_FORMAT,
                    dateFormat: DATE_FORMAT,
                }
            }
        );

        console.log(`Found ${response.data.length} upcoming games with odds`);
        res.json(response.data);

    } catch (error) {
        console.error('Error fetching odds data:', error);
        res.status(500).json({ error: 'Failed to fetch odds data' });
    }
});

// Helper function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Modified fetch function with delay
async function fetchTeamStats(teamId) {
    try {
        // Increase delay to 5 seconds between requests
        await delay(5000);
        
        const API_KEY = process.env.SPORTRADAR_API_KEY;
        const response = await fetch(
            `https://api.sportradar.com/nba/trial/v5/en/seasons/2024/REG/teams/${teamId}/statistics.json?api_key=${API_KEY}`,
            { headers: { accept: 'application/json' } }
        );

        if (!response.ok) {
            // If we still get rate limited, wait even longer and retry once
            if (response.status === 429) {
                console.log('Rate limited, waiting 10 seconds before retry...');
                await delay(10000);
                const retryResponse = await fetch(
                    `https://api.sportradar.com/nba/trial/v5/en/seasons/2024/REG/teams/${teamId}/statistics.json?api_key=${API_KEY}`,
                    { headers: { accept: 'application/json' } }
                );
                if (!retryResponse.ok) {
                    throw new Error(`HTTP error! status: ${retryResponse.status}`);
                }
                return await retryResponse.json();
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching team statistics: ${error}`);
        throw error;
    }
}

router.get('/team-stats/:team', async (req, res) => {
    const teamName = req.params.team;
    const teamId = NBA_TEAM_IDS[teamName];

    if (!teamId) {
        return res.status(400).json({ error: `Team "${teamName}" not found` });
    }

    try {
        console.log(`Fetching statistics for team: ${teamName} (${teamId})`);
        const stats = await fetchTeamStats(teamId);
        console.log(`Successfully retrieved stats for ${teamName}`);
        res.json(stats);

    } catch (error) {
        console.error('Error fetching team statistics:', error);
        res.status(500).json({ error: 'Failed to fetch team statistics' });
    }
});

// Add a test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

module.exports = router; 