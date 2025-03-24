from flask import Flask, jsonify, request
from flask_cors import CORS
import boto3
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# AWS S3 Configuration
s3 = boto3.client("s3")
S3_BUCKET_NAME = "combined-odds"  # Ensure this is the correct bucket name
S3_CSV_FILE = "OddsAPI_combined_odds-2.csv"
LOCAL_CSV_PATH = "/Users/dewaynebarnes/Downloads/Projects/Senior-Design/OddsAPI_combined_odds_2.csv"

# AWS DynamoDB Configuration
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
nfl_table = dynamodb.Table("NFL_EloRatings")
nba_table = dynamodb.Table("NBA_EloRatings")

# Convert American odds to implied probability
def convert_odds_to_prob(odds):
    if odds > 0:
        return 100 / (odds + 100)
    else:
        return abs(odds) / (abs(odds) + 100)

# Fetch ELO ratings from DynamoDB
def get_elo_rating(team_name, sport):
    """
    Fetches the ELO rating for a given team by extracting the relevant part of the team name.
    """
    # Special case mapping for teams with multiple-word names
    team_name_mapping = {
        # NBA exceptions
        "Trail Blazers": "Trail Blazers",
        "76ers": "76ers",

        # NFL exceptions
        "LA Rams": "LA Rams",
        "LA Chargers": "LA Chargers",
        "NY Jets": "NY Jets",
        "NY Giants": "NY Giants",
        "San Francisco": "San Francisco",
        "Kansas City": "Kansas City",
        "New England": "New England",
        "Tampa Bay": "Tampa Bay",
        "New Orleans": "New Orleans",
    }

    # Ensure sport is uppercase
    sport = sport.upper()

    # Extract the relevant part of the team name
    if sport == "NBA":
        last_word = team_name_mapping.get(team_name, team_name.split()[-1])  # Use last word for NBA
    elif sport == "NFL":
        first_word = team_name.split()[0]  # Use first word for NFL
        last_word = team_name_mapping.get(team_name, first_word)  # Map if special case exists
    else:
        print(f"⚠️ Unknown sport type: {sport}")
        return None

    # Select the correct table (NBA or NFL)
    table = nba_table if sport == "NBA" else nfl_table

    # Query DynamoDB for the ELO rating
    response = table.get_item(Key={"Team": last_word})

    if "Item" in response:
        return float(response["Item"]["Elo"])
    
    # Debugging print statement
    print(f"⚠️ No ELO found for {team_name} ({last_word}) in {sport}!")
    return None


# Download CSV from S3
def download_csv_from_s3():
    try:
        print(f"⬇️ Downloading latest CSV from S3: {S3_CSV_FILE}")
        s3.download_file(S3_BUCKET_NAME, S3_CSV_FILE, LOCAL_CSV_PATH)

        # Check if file is empty
        if os.path.exists(LOCAL_CSV_PATH) and os.path.getsize(LOCAL_CSV_PATH) == 0:
            print(f"⚠️ Warning: {S3_CSV_FILE} downloaded but is empty!")
        else:
            print(f"✅ Successfully downloaded {S3_CSV_FILE} from S3")
    except Exception as e:
        print(f"❌ Error downloading CSV from S3: {e}")

# Load and filter the latest moneyline bets from the CSV
def load_moneyline_bets():
    download_csv_from_s3()  # Ensure we have the latest file

    try:
        print(f"📂 Loading CSV from: {LOCAL_CSV_PATH}")

        # Check if file exists
        if not os.path.exists(LOCAL_CSV_PATH):
            print("❌ Error: CSV file not found!")
            return []

        df = pd.read_csv(LOCAL_CSV_PATH)

        # Check if DataFrame is empty
        if df.empty:
            print("⚠️ CSV file is empty after loading. Check S3 data.")
            return []

        df = df[df["betType"] == "MoneyLine"]  # Filter only moneyline bets
        print(df.head())  # Debugging
        return df.to_dict(orient="records")
    except Exception as e:
        print(f"❌ Error loading CSV: {e}")
        return []

# Update CSV via API request
@app.route("/update-odds-csv", methods=["POST"])
def update_odds_csv():
    try:
        data = request.json.get("oddsData", [])

        if not data:
            print("⚠️ No data received from Odds API script")
            return jsonify({"error": "No data received"}), 400

        print(f"📊 Received {len(data)} odds events from frontend")
        print(f"🔍 Sample data: {data[:2]}")  # Debugging

        df = pd.DataFrame([
            {
                "team1": event["home_team"],
                "team2": event["away_team"],
                "betType": market["key"],
                "betInfo": outcome["name"],
                "odds": outcome["price"],
                "dateOfGame": event["commence_time"],
                "sportsbookName": bookmaker["title"],
                "sport": event["sport_key"],
            }
            for event in data
            for bookmaker in event["bookmakers"]
            for market in bookmaker["markets"]
            for outcome in market["outcomes"]
        ])

        if df.empty:
            print("⚠️ Dataframe is empty! Check API response.")
            return jsonify({"error": "Dataframe is empty"}), 500

        print(f"📁 Attempting to write CSV at: {LOCAL_CSV_PATH}")
        df.to_csv(LOCAL_CSV_PATH, index=False)
        print(f"✅ File successfully written: {LOCAL_CSV_PATH} with {len(df)} rows")

        return jsonify({"message": "CSV updated successfully", "rows": len(df)})
    except Exception as e:
        print(f"❌ Error in update_odds_csv: {e}")
        return jsonify({"error": str(e)}), 500

# Find mispriced odds
@app.route("/find-mispriced-odds", methods=["GET"])
def find_mispriced_odds():
    moneyline_bets = load_moneyline_bets()
    mispriced = []
    threshold = 0.10  # Changed threshold from 5% to 10%

    for bet in moneyline_bets:
        team1_elo = get_elo_rating(bet["team1"], bet["sport"])
        team2_elo = get_elo_rating(bet["team2"], bet["sport"])

        print(f"Processing bet: {bet['team1']} vs {bet['team2']} | Odds: {bet['odds']} | Sportsbook: {bet['sportsbookName']}")
        print(f"  -> Team1 ELO: {team1_elo}, Team2 ELO: {team2_elo}")

        if team1_elo and team2_elo:
            # Calculate intrinsic probability using ELO ratings
            intrinsic_win_prob = team1_elo / (team1_elo + team2_elo)

            # Convert betting odds to implied probability
            odd_win_prob = convert_odds_to_prob(bet["odds"])

            # Calculate the difference
            difference = intrinsic_win_prob - odd_win_prob
            print(f"  -> Intrinsic Win Prob: {intrinsic_win_prob:.3f}, Odds Win Prob: {odd_win_prob:.3f}, Diff: {difference:.3f}")

            # Only include bets where the intrinsic probability is at least 10% greater
            if difference >= threshold:
                mispriced.append({
                    "team1": bet["team1"],
                    "team2": bet["team2"],
                    "sport": bet["sport"],
                    "sportsbook": bet["sportsbookName"],
                    "odds": bet["odds"],
                    "odd_win_prob": odd_win_prob,
                    "intrinsic_win_prob": intrinsic_win_prob,
                    "difference": difference
                })
                print(f"✅ Mispriced bet found: {bet['team1']} with difference {difference:.3f}")

    # Sort by difference in descending order
    mispriced = sorted(mispriced, key=lambda x: x["difference"], reverse=True)

    return jsonify(mispriced)

if __name__ == "__main__":
    app.run(debug=True)