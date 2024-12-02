const convertToCsv = (data, fields) => {
  const headers = fields.join(',');
  const rows = data.map((row) =>
    fields.map((fieldName) => JSON.stringify(row[fieldName] || '')).join(',')
  );
  return [headers, ...rows].join('\n');
};

const processOddsData = (data) => {
  const rows = [];

  data.forEach((game) => {
    const sport = game.sport_title;
    const homeTeam = game.home_team;
    const awayTeam = game.away_team;
    const dateTimeOfGame = game.commence_time;

    game.bookmakers.forEach((bookmaker) => {
      const sportsbookName = bookmaker.title;

      bookmaker.markets.forEach((market) => {
        const betType = market.key;

        market.outcomes.forEach((outcome) => {
          if (betType === 'h2h') {
            rows.push({
              team1: outcome.name,
              team2: outcome.name === homeTeam ? awayTeam : homeTeam,
              betType: 'MoneyLine',
              betInfo: outcome.name,
              odds: outcome.price,
              dateOfGame: dateTimeOfGame,
              sportsbookName,
              sport,
            });
          } else if (betType === 'spreads') {
            rows.push({
              team1: outcome.name,
              team2: outcome.name === homeTeam ? awayTeam : homeTeam,
              betType: 'Spread',
              betInfo: `${outcome.point}`,
              odds: outcome.price,
              dateOfGame: dateTimeOfGame,
              sportsbookName,
              sport,
            });
          } else if (betType === 'totals') {
            rows.push({
              team1: homeTeam,
              team2: awayTeam,
              betType: 'Total',
              betInfo: `${outcome.name === 'Over' ? 'O' : 'U'}${outcome.point}`,
              odds: outcome.price,
              dateOfGame: dateTimeOfGame,
              sportsbookName,
              sport,
            });
          }
        });
      });
    });
  });

  const fields = ['team1', 'team2', 'betType', 'betInfo', 'odds', 'dateOfGame', 'sportsbookName', 'sport'];
  return convertToCsv(rows, fields); // Return the CSV string
};

export default processOddsData;
