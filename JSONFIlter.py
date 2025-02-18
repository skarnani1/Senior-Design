import pandas as pd
import json
from datetime import date

# Specify the file path
file_path = 'oddsapi_raw_data.json'

# Open and load the JSON file
with open(file_path, 'r') as file:
    data = json.load(file)  # Parses JSON into Python objects

# Get the current date
rows = []

for game in data:
    sport = game["sport_title"]
    home_team = game["home_team"]
    away_team = game["away_team"]
    datetime_of_game = game["commence_time"]
    
    for bookmaker in game["bookmakers"]:
        sportsbook_name = bookmaker["title"]
        
        for market in bookmaker["markets"]:
            bet_type = market["key"]
            
            for outcome in market["outcomes"]:
                if bet_type == "h2h":
                    # MoneyLine bets
                    bet_info = outcome["name"]
                    odds = outcome["price"]
                    rows.append([
                        outcome["name"],  # Team 1
                        away_team if outcome["name"] == home_team else home_team,  # Team 2
                        "MoneyLine", bet_info, odds, datetime_of_game, sportsbook_name, sport
                    ])
                elif bet_type == "spreads":
                    # Spread bets
                    bet_info = f"{outcome['point']}"
                    odds = outcome["price"]
                    rows.append([
                        outcome["name"],  # Team 1
                        away_team if outcome["name"] == home_team else home_team,  # Team 2
                        "Spread", bet_info, odds, datetime_of_game, sportsbook_name, sport
                    ])
                elif bet_type == "totals":
                    # Totals bets
                    bet_info = f"{'O' if outcome['name'] == 'Over' else 'U'}{outcome['point']}"
                    odds = outcome["price"]
                    rows.append([
                        home_team,  # Team 1
                        away_team,  # Team 2
                        "Total", bet_info, odds, datetime_of_game, sportsbook_name, sport
                    ])

# Create the DataFrame
df = pd.DataFrame(rows, columns=[
    "Team 1", "Team 2", "Bet Type", "Bet Info", "Odds", "Date of Game", "Sportsbook Name", "Sport"
])

df.to_csv('OddsAPI_combined_odds.csv', index=False)

