import axios from 'axios';

const fetchOddsData = async () => {
  const API_KEY = '6448192984900355b8ceaf3388466e6b'; // Replace with your API key
  const SPORT = 'basketball_nba';
  const REGIONS = 'us';
  const MARKETS = 'h2h,spreads,totals';
  const ODDS_FORMAT = 'american';
  const DATE_FORMAT = 'iso';

  try {
    const response = await axios.get(
      `https://api.the-odds-api.com/v4/sports/${SPORT}/odds`,
      {
        params: {
          api_key: API_KEY,
          regions: REGIONS,
          markets: MARKETS,
          oddsFormat: ODDS_FORMAT,
          dateFormat: DATE_FORMAT,
        },
      }
    );

    console.log('✅ Number of events:', response.data.length);

    // Send this data to Flask API for CSV writing
    sendOddsToFlask(response.data);

    return response.data; // Keep original functionality
  } catch (error) {
    console.error('❌ Failed to fetch odds:', error.message);
    throw error;
  }
};

// 📌 Send Odds Data to Flask API to Write CSV
const sendOddsToFlask = async (oddsData) => {
  try {
    await axios.post('http://127.0.0.1:5000/update-odds-csv', { oddsData });
    console.log('✅ Odds data sent to Flask for CSV writing');
  } catch (error) {
    console.error('❌ Failed to send odds data to Flask:', error.message);
  }
};

// Run function
fetchOddsData();

export default fetchOddsData;