import boto3
import pandas as pd
import requests

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('EloRatings')

# Function to retrieve Elo ratings from DynamoDB
def get_elo_rating(team):
    response = table.get_item(Key={'Team': team})
    return response.get('Item', {}).get('Elo', 1500)

# Function to convert American odds to implied probability
def american_odds_to_prob(odds):
    if odds > 0:
        return 100 / (odds + 100)
    else:
        return abs(odds) / (abs(odds) + 100)

# Function to compare Elo probabilities with sportsbook odds
def compare_elo_and_odds(odds_data):
    bets = []
    
    for bet in odds_data:
        team1 = bet["team1"]
        team2 = bet["team2"]
        bet_type = bet["betType"]
        bet_info = bet["betInfo"]
        odds = bet["odds"]
        sportsbook = bet["sportsbookName"]

        # Retrieve Elo ratings
        elo1 = get_elo_rating(team1)
        elo2 = get_elo_rating(team2)

        # Calculate Elo probability
        elo_prob1 = 1 / (1 + 10 ** ((elo2 - elo1) / 400))
        elo_prob2 = 1 - elo_prob1

        # Convert odds to implied probability
        implied_prob = american_odds_to_prob(odds)

        # Check if expected value is positive
        if implied_prob < elo_prob1 or implied_prob < elo_prob2:
            ev = max(elo_prob1 - implied_prob, elo_prob2 - implied_prob)
            bets.append({
                "team1": team1,
                "team2": team2,
                "betType": bet_type,
                "betInfo": bet_info,
                "odds": odds,
                "sportsbook": sportsbook,
                "elo_prob1": round(elo_prob1, 4),
                "elo_prob2": round(elo_prob2, 4),
                "implied_prob": round(implied_prob, 4),
                "expected_value": round(ev, 4)
            })

    return bets

# Example: Load odds data (replace with actual scraper)
odds_data = [
    {"team1": "Cleveland Browns", "team2": "Denver Broncos", "betType": "MoneyLine", "betInfo": "Cleveland Browns", "odds": 220, "sportsbookName": "DraftKings"},
    {"team1": "Denver Broncos", "team2": "Cleveland Browns", "betType": "MoneyLine", "betInfo": "Denver Broncos", "odds": -270, "sportsbookName": "DraftKings"}
]

# Run comparison
positive_ev_bets = compare_elo_and_odds(odds_data)
print("Positive EV Bets:", positive_ev_bets)
