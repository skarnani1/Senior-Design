from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import datetime
import pandas as pd

# Function to check if a div is within a specific table
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

# Function to extract odds for a given sport type
def extract_draftkings_odds(page, url, sport_type):
    page.goto(url)
    soup = BeautifulSoup(page.content(), 'html.parser')

    Sport = sport_type
    Sportsbook_Name = 'DraftKings'

    odds_data = []

    # Extract the first game
    Team1 = soup.find('div', class_='event-cell__name-text')
    Table1 = soup.find('table', class_='sportsbook-table')
    SpreadLine1 = soup.find('span', class_='sportsbook-outcome-cell__line')
    SpreadOdd1 = soup.find('span', class_='sportsbook-odds american default-color')
    TotalLabel1 = soup.find('span', class_='sportsbook-outcome-cell__label')
    TotalLine1 = SpreadLine1.find_next('span', class_='sportsbook-outcome-cell__line')
    TotalOdd1 = SpreadOdd1.find_next('span', class_='sportsbook-odds american default-color')
    MoneyLine = soup.find('span', class_='sportsbook-odds american no-margin default-color')
    CurrentGameDate = soup.find('th', class_='always-left column-header')

    # Append initial odds data
    if Team1 and SpreadLine1 and SpreadOdd1 and TotalLabel1 and TotalLine1 and TotalOdd1 and MoneyLine and CurrentGameDate:
        odds_data.append([Team1.get_text(), '', 'Spread', SpreadLine1.get_text(), SpreadOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(), Sportsbook_Name, Sport])
        odds_data.append([Team1.get_text(), '', 'Total', TotalLabel1.get_text() + TotalLine1.get_text(), TotalOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(), Sportsbook_Name, Sport])
        odds_data.append([Team1.get_text(), '', 'MoneyLine', Team1.get_text(), MoneyLine.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(), Sportsbook_Name, Sport])

    # Loop through the games
    while Team1:
        Team1 = Team1.find_next('div', class_='event-cell__name-text')
        if not is_div_in_table(Team1, Table1):
            CurrentGameDate = CurrentGameDate.find_next('th', class_='always-left column-header')
            Table1 = Table1.find_next('table', class_='sportsbook-table')

        if Team1:
            SpreadLine1 = TotalLine1.find_next('span', class_='sportsbook-outcome-cell__line')
            SpreadOdd1 = TotalOdd1.find_next('span', class_='sportsbook-odds american default-color')
            TotalLabel1 = TotalLabel1.find_next('span', class_='sportsbook-outcome-cell__label')
            TotalLine1 = SpreadLine1.find_next('span', class_='sportsbook-outcome-cell__line')
            TotalOdd1 = SpreadOdd1.find_next('span', class_='sportsbook-odds american default-color')
            MoneyLine = MoneyLine.find_next('span', class_='sportsbook-odds american no-margin default-color')

            if SpreadLine1 and SpreadOdd1 and TotalLabel1 and TotalLine1 and TotalOdd1 and MoneyLine:
                odds_data.append([Team1.get_text(), '', 'Spread', SpreadLine1.get_text(), SpreadOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(), Sportsbook_Name, Sport])
                odds_data.append([Team1.get_text(), '', 'Total', TotalLabel1.get_text() + TotalLine1.get_text(), TotalOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(), Sportsbook_Name, Sport])
                odds_data.append([Team1.get_text(), '', 'MoneyLine', Team1.get_text(), MoneyLine.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(), Sportsbook_Name, Sport])

    update_paired_teams(odds_data)
    return odds_data

def run():
    # URLs for NFL and NBA
    nfl_url = "https://sportsbook.draftkings.com/leagues/football/nfl"
    nba_url = "https://sportsbook.draftkings.com/leagues/basketball/nba"

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=False)
        page = browser.new_page()

        # Extract data for NFL and NBA
        nfl_data = extract_draftkings_odds(page, nfl_url, 'NFL')
        nba_data = extract_draftkings_odds(page, nba_url, 'NBA')

        # Combine data and create DataFrame
        odds_data = nfl_data + nba_data
        if not odds_data:
            print("No data extracted for either NFL or NBA.")
        else:
            odds_df = pd.DataFrame(odds_data, columns=['Team 1', 'Team 2', 'Bet Type', 'Bet Info', 'Odds', 'Date of game', 'DateTime(when got odds)', 'Sportsbook Name', 'Sport'])
            odds_df.to_csv('DraftKings_combined_odds.csv', index=False)
            print("Data extraction complete and saved to CSV.")

        browser.close()

# Run the function
run()
