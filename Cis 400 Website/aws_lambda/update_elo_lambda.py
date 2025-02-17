import boto3
import requests

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('EloRatings')

# API to fetch game results (Replace with a real sports API)
GAME_RESULTS_API = "https://api.sportsdata.io/v3/nfl/scores/json/GamesByDate/2025-FEB-12"
SPORTS_API_KEY = "YOUR_API_KEY"

# Function to retrieve Elo rating
def get_elo(team):
    response = table.get_item(Key={'Team': team})
    return response.get('Item', {}).get('Elo', 1500)

# Function to update Elo ratings
def update_elo(winner, loser, K=20):
    R_winner = get_elo(winner)
    R_loser = get_elo(loser)

    # Compute win probability
    P_winner = 1 / (1 + 10 ** ((R_loser - R_winner) / 400))

    # Update Elo ratings
    new_R_winner = R_winner + K * (1 - P_winner)
    new_R_loser = R_loser + K * (0 - (1 - P_winner))

    # Store updated values in DynamoDB
    table.put_item(Item={'Team': winner, 'Elo': int(new_R_winner)})
    table.put_item(Item={'Team': loser, 'Elo': int(new_R_loser)})

def fetch_game_results():
    headers = {"Ocp-Apim-Subscription-Key": SPORTS_API_KEY}
    response = requests.get(GAME_RESULTS_API, headers=headers)
    return response.json() if response.status_code == 200 else None

def lambda_handler(event, context):
    games = fetch_game_results()
    if not games:
        return "No new games to process."

    for game in games:
        team1, team2 = game["HomeTeam"], game["AwayTeam"]
        score1, score2 = game["HomeTeamScore"], game["AwayTeamScore"]

        if score1 > score2:
            update_elo(team1, team2)
        elif score2 > score1:
            update_elo(team2, team1)

    return "Elo Ratings Updated!"
