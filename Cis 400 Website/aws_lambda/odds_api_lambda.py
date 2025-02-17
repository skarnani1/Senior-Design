import boto3
import requests

# AWS Services
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("EloRatings")

SPORTS_API_KEY = "YOUR_API_KEY"
ODDS_API_URL = "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=YOUR_ODDS_API_KEY"

def get_elo(team):
    """Retrieve Elo rating from DynamoDB"""
    response = table.get_item(Key={'Team': team})
    return response.get('Item', {}).get('Elo', 1500)

def fetch_live_odds():
    """Fetch live odds from API"""
    response = requests.get(ODDS_API_URL)
    return response.json() if response.status_code == 200 else None

def lambda_handler(event, context):
    """Lambda function to return processed odds with Elo data"""
    odds_data = fetch_live_odds()
    if not odds_data:
        return {"statusCode": 500, "body": "Could not fetch odds"}

    processed_data = []
    for game in odds_data:
        team1, team2 = game["home_team"], game["away_team"]
        best_odds = max(game["bookmakers"], key=lambda x: x["markets"][0]["outcomes"][0]["price"])
        
        processed_data.append({
            "team1": team1,
            "team2": team2,
            "betType": "MoneyLine",
            "betInfo": team1,
            "odds": best_odds["markets"][0]["outcomes"][0]["price"],
            "sportsbookName": best_odds["key"],
        })

    return {"statusCode": 200, "body": processed_data}
