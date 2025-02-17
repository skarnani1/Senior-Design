import boto3

dynamodb = boto3.resource("dynamodb", region_name="us-east-1")  # Replace with your AWS region
table = dynamodb.Table("EloRatings")

response = table.put_item(
    Item={"Team": "Test Team", "Elo": 1500}
)

print("Test data inserted:", response)