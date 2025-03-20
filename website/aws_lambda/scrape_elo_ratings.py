import requests
from bs4 import BeautifulSoup
import boto3
from decimal import Decimal
import re

# AWS DynamoDB Setup
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
nfl_table = dynamodb.Table("NFL_EloRatings")
nba_table = dynamodb.Table("NBA_EloRatings")

def clear_table(table):
    """Deletes all items from a DynamoDB table before inserting fresh data."""
    print(f"🧹 Clearing table {table.name} before inserting fresh data...")
    scan = table.scan(ProjectionExpression="Team")
    with table.batch_writer() as batch:
        for item in scan["Items"]:
            batch.delete_item(Key={"Team": item["Team"]})
    print(f"✅ {table.name} cleared.")

def extract_team_name(raw_team_name):
    """Cleans up the team name by removing numbers but keeping '76ers' intact."""
    raw = raw_team_name.strip()
    if "76ers" in raw.lower():
        return "76ers"
    # Remove leading digits and spaces.
    cleaned = re.sub(r"^\d+\s*", "", raw)
    return cleaned

def scrape_elo(sport, url, table):
    print(f"🔎 Fetching {sport} Elo Ratings from {url}...")

    # Clear old data from DynamoDB
    clear_table(table)

    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    # Find the div that contains the table
    table_div = soup.find("div", class_="dataTable")
    if not table_div:
        print(f"⚠️ No table found for {sport}. The website structure may have changed.")
        return
    
    # The table rows are within the table element inside the div
    rows = table_div.find_all("tr")[1:]  # Skip the header row

    for row in rows:
        columns = row.find_all("td")
        if len(columns) < 3:
            continue  # Skip rows that don't have the expected number of columns

        # Extract the raw team name from the first column
        raw_team_name = columns[0].get_text(strip=True)
        team_name = extract_team_name(raw_team_name)
        
        # Extract the Elo rating from the third column (the "Average" column)
        elo_rating_str = columns[2].get_text(strip=True).replace(",", "")
        try:
            elo_rating = Decimal(elo_rating_str)
        except Exception as e:
            print(f"⚠️ Error converting Elo rating for {team_name}: {elo_rating_str}")
            continue

        # Upload to DynamoDB
        table.put_item(Item={"Team": team_name, "Elo": elo_rating})
        print(f"Uploaded: {team_name} - Elo: {elo_rating}")

    print(f"✅ {sport} Elo Ratings updated in DynamoDB")

# Run for both NFL and NBA
scrape_elo("NFL", "https://www.aussportstipping.com/sports/nfl/elo_ratings/", nfl_table)
scrape_elo("NBA", "https://www.aussportstipping.com/sports/nba/elo_ratings/", nba_table)