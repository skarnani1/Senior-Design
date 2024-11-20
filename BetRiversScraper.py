from playwright.sync_api import sync_playwright, Playwright
from bs4 import BeautifulSoup

import datetime

import pandas as pd

# Function to scrape the BetMGM NFL odds page
def is_div_in_table(div, table):
    if div is None or table is None:
        return False
    parent = div.find_parent('table')
    return parent == table


# Function to update paired teams in the data
def update_paired_teams(data):
    # Iterate through the data in chunks of 6
    for i in range(0, len(data), 6):
        group = data[i:i+6]
        if len(group) < 6:
            continue  # Skip incomplete groups

        team_a = group[0][0]       # First team's name
        team_b = group[3][0]       # Paired team's name

        # Update Team A's rows with Team B's name
        for j in range(3):
            data[i + j][1] = team_b

        # Update Team B's rows with Team A's name
        for j in range(3, 6):
            data[i + j][1] = team_a


# Update the data
def extract_betrivers_odds(page, url, sport_type):
    page.goto(url)
    soup = BeautifulSoup(page.content(), 'html.parser')

    Sport = sport_type
    Sportsbook_Name = 'BetRivers'
    odds_data = []
    Table = soup.find('main',class_='sc-eLHYIy gqOJVZ')
    Team1 = soup.find('div', class_='sc-fCUbSJ eWtAPV')
    if Table is None:
        print("Something is broken")
        return None
    else: 
        print(Table)
        return None
    SpreadLine1 = soup.find('div', class_='sc-gCpAwq.ggTSPo')
    SpreadOdd1 = soup.find('li', class_='sc-hynpEK jXujgx')
    MoneyLine = SpreadOdd1.find_next('li', class_='sc-hynpEK jXujgx')
    TotalLine1 = SpreadLine1.find_next('div', class_='sc-gCpAwq ggTSPo')
    TotalOdd1 = MoneyLine.find_next('li', class_='sc-hynpEK jXujgx')
    CurrentGameDate = soup.find('time', class_='sc-fniybn htHERL')

    if Team1 and SpreadLine1 and SpreadOdd1 and TotalLabel1 and TotalLine1 and TotalOdd1 and MoneyLine and CurrentGameDate:
        odds_data.append([Team1.get_text(), '', 'Spread', SpreadLine1.get_text(), SpreadOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(), Sportsbook_Name, Sport])
        odds_data.append([Team1.get_text(), '', 'Total', TotalLabel1.get_text() + TotalLine1.get_text(), TotalOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(), Sportsbook_Name, Sport])
        odds_data.append([Team1.get_text(), '', 'MoneyLine', Team1.get_text(), MoneyLine.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(), Sportsbook_Name, Sport])


    while Team1 != None: 
        Team1 = soup.find('div', class_='sc-fCUbSJ eWtAPV')
        if Team1 != None:
            SpreadLine1 = soup.find('div', class_='sc-gCpAwq ggTSPo')
            SpreadOdd1 = soup.find('li', class_='sc-hynpEK jXujgx')
            MoneyLine = SpreadOdd1.find_next('li', class_='sc-hynpEK jXujgx')
            TotalLine1 = SpreadLine1.find_next('div', class_='sc-gCpAwq ggTSPo')
            TotalOdd1 = MoneyLine.find_next('li', class_='sc-hynpEK jXujgx')
            CurrentGameDate = soup.find('time', class_='sc-fniybn htHERL')

    update_paired_teams(odds_data)
    return odds_data

def run():
    # URLs for NFL and NBA
    nfl_url = "https://pa.betrivers.com/?page=sportsbook&l=RiversPittsburgh&group=1000093656&type=matches"
    nba_url = "https://pa.betrivers.com/?page=sportsbook&l=RiversPittsburgh&group=1000093652&type=matches"

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=False)
        page = browser.new_page()

        # Extract data for NFL and NBA
        nfl_data = extract_betrivers_odds(page, nfl_url, 'NFL')
        nba_data = extract_betrivers_odds(page, nba_url, 'NBA')

        # Combine data and create DataFrame
        odds_data = nfl_data + nba_data
        if not odds_data:
            print("No data extracted for either NFL or NBA.")
        else:
            odds_df = pd.DataFrame(odds_data, columns=['Team 1', 'Team 2', 'Bet Type', 'Bet Info', 'Odds', 'Date of game', 'DateTime(when got odds)', 'Sportsbook Name', 'Sport'])
            odds_df.to_csv('DraftKings_combined_odds.csv', index=False)
            print("Data extraction complete and saved to CSV.")

        browser.close()


#Run the funciton 
run()