import boto3
import pandas as pd

# Initialize DynamoDB client
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("EloRatings")

# Load latest Elo rankings
df = pd.read_csv("nfl_elo.csv", delimiter="\t")  # Assuming it's tab-separated

# Standardize column names if necessary
df.columns = ["Rank", "Team", "Elo", "Record"]  # Adjust based on actual column names

# Upload data to DynamoDB
for _, row in df.iterrows():
    team = row["Team"]
    elo_rating = int(row["Elo"])  # Convert Elo to integer

    table.put_item(Item={"Team": team, "Elo": elo_rating})

print("✅ Latest Elo ratings uploaded to DynamoDB.")
