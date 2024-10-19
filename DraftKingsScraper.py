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


def update_paired_teams(data):
    # Iterate through the data in chunks of 6
    for i in range(0, len(data), 6):
        group = data[i:i+6]
        if len(group) < 6:
            continue  # Skip incomplete groups
        
        team_a = group[0][0]       # First team's name (e.g., "NE Patriots")
        team_b = group[3][0]       # Paired team's name (e.g., "JAX Jaguars")
        
        # Update Team A's rows with Team B's name
        for j in range(3):
            data[i + j][1] = team_b
        
        # Update Team B's rows with Team A's name
        for j in range(3, 6):
            data[i + j][1] = team_a

# Update the data
def run(playwright: Playwright):
    #url = "https://sports.betmgm.com/en/sports/football-11/betting/usa/nfl-35"

    # Start Playwright
    # Launch a browser (headless mode by default)
    chromium = playwright.chromium # or "firefox" or "webkit".
    browser = chromium.launch()
    page = browser.new_page()
    page.goto("https://sportsbook.draftkings.com/leagues/football/nfl")
     # other actions...
    soup = BeautifulSoup(page.content(), 'html.parser')
    browser.close()

    Sport = 'NFL'
    Sportsbook_Name = 'DraftKings'


    Team1 = soup.find('div', class_='event-cell__name-text')

    Table1 = soup.find('table', class_='sportsbook-table')

    SpreadLine1 = soup.find('span', class_='sportsbook-outcome-cell__line')
    SpreadOdd1 = soup.find('span', class_='sportsbook-odds american default-color')


    TotalLabel1 = soup.find('span', class_='sportsbook-outcome-cell__label')
    TotalLine1 = SpreadLine1.find_next('span', class_='sportsbook-outcome-cell__line')
    TotalOdd1 = SpreadOdd1.find_next('span', class_='sportsbook-odds american default-color')

    MoneyLine = soup.find('span', class_='sportsbook-odds american no-margin default-color')
    CurrentGameDate = soup.find('th', class_='always-left column-header')

    odds_data = []

    odds_data.append([Team1.get_text(), '', 'Spread', SpreadLine1.get_text(), SpreadOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(),'DraftKings', 'NFL'])
    odds_data.append([Team1.get_text(), '', 'Total', TotalLabel1.get_text() + TotalLine1.get_text(), TotalOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(),'DraftKings', 'NFL'])
    odds_data.append([Team1.get_text(), '', 'MoneyLine', Team1.get_text(), MoneyLine.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(),'DraftKings', 'NFL'])

    while Team1 != None: 
        Team1 = Team1.find_next('div', class_='event-cell__name-text')
        if not is_div_in_table(Team1, Table1):
            CurrentGameDate = CurrentGameDate.find_next('th', class_='always-left column-header')
            Table1 = Table1.find_next('table', class_='sportsbook-table')

        if Team1 != None:
            SpreadLine1 = TotalLine1.find_next('span', class_='sportsbook-outcome-cell__line')
            SpreadOdd1 = TotalOdd1.find_next('span', class_='sportsbook-odds american default-color')


            TotalLabel1 = TotalLabel1.find_next('span', class_='sportsbook-outcome-cell__label')
            TotalLine1 = SpreadLine1.find_next('span', class_='sportsbook-outcome-cell__line')
            TotalOdd1 = SpreadOdd1.find_next('span', class_='sportsbook-odds american default-color')

            MoneyLine = MoneyLine.find_next('span', class_='sportsbook-odds american no-margin default-color')
            #GameDate = GameDate.find_next('div', class_='sportsbook-table-header__title')
            odds_data.append([Team1.get_text(), '', 'Spread', SpreadLine1.get_text(), SpreadOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(),'DraftKings', 'NFL'])
            odds_data.append([Team1.get_text(), '', 'Total', TotalLabel1.get_text() + TotalLine1.get_text(), TotalOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(),'DraftKings', 'NFL'])
            odds_data.append([Team1.get_text(), '', 'MoneyLine', Team1.get_text(), MoneyLine.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(),'DraftKings', 'NFL'])


    #team2 = team1.find_next('div', class_='event-cell__name-text')
    #SpreadLine2 = soup.find('span', class_='sportsbook-outcome-cell__line')
    update_paired_teams(odds_data)


    odds_df = pd.DataFrame(odds_data, columns=['Team 1', 'Team 2', 'Bet Type', 'Bet Info', 'Odds', 'Date of game', 'DateTime(when got odds)', 'Sportsbook Name', 'Sport'])
    odds_df.to_csv('DraftKings_odds_playwright.csv', index=False)
    
    #



with sync_playwright() as playwright:
    run(playwright)