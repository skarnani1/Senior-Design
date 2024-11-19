#Loop through cvs 
import csv
import pandas as pd

#Check if arbitrage exist
def check_arbitrage(odd1, odd2, betType):
    if odd1 < 0:
        percentage1 = 1 - (100 / (100 + abs(odd1)))
    else: 
        percentage1 = 100 / (100 + odd1)
    
    if odd2 < 0:
        percentage2 = 1 - (100 / (100 + abs(odd2)))
    else: 
        percentage2 = 100 / (100 + odd2)
    
    return percentage1 + percentage2 < 100

    return Fal
def check_moneyline(row1, row2): 
    #Check that it is the same game and that you are on different sportsbooks
    if (row1[0] == row2[0] and row1[1] == row2[1] and row1[5] == row2[5] 
    and row1[7] == row2[7] and row1[6] != row2[6]):
        return check_arbitrage(int(row1[4]), int(row2[4]), 'MoneyLine')
    return False

# Specify the path to your CSV file
csv_file_path = "./OddsAPI_combined_odds.csv"

df = pd.read_csv(csv_file_path, header=None)

for index1, row1 in df.iterrows():
    for index2, row2 in df.iterrows():
        #Check if moneline bets, and that its nto the same bet and that you're betting on differnet team
        if row1[2] == 'MoneyLine' and row2[2] == 'MoneyLine' and index1 < index2 and row1[3] != row2[3]:
            if check_moneyline(row1, row2):
                print("Arbitrage detected")
                print(row1)
                print(row2)

        
