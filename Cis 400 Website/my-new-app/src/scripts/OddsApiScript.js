import axios from 'axios';

const fetchOddsData = async () => {
  const API_KEY = 'b00dcb637ff2c90f0acf59dd1bf7fbac'; // Replace with your API key
  const SPORT = 'americanfootball_nfl';
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

    console.log('Number of events:', response.data.length);
    return response.data; // Return the JSON data
  } catch (error) {
    console.error('Failed to fetch odds:', error.message);
    throw error;
  }
};

export default fetchOddsData;
