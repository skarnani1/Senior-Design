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
    page.goto("https://pa.betrivers.com/?page=sportsbook&l=RiversPittsburgh&group=1000093656&type=matches")
     # other actions...
    soup = BeautifulSoup(page.content(), 'html.parser')
    browser.close()


    Sport = 'NFL'
    Sportsbook_Name = 'BetRivers'


    Team1 = soup.find('div', class_='sc-hGzUJM eWfhtJ')
    
    print(Team1)
    return Team1
    SpreadLine1 = soup.find('div', class_='sc-fXPgIJ kOKdhF')
    SpreadOdd1 = soup.find('li', class_='sc-eBhLNR dTqwJf')

    MoneyLine = SpreadOdd1.find_next('li', class_='sc-eBhLNR dTqwJf')

    TotalLine1 = SpreadLine1.find_next('div', class_='sc-fXPgIJ kOKdhF')
    TotalOdd1 = MoneyLine.find_next('li', class_='sc-eBhLNR dTqwJf')

    CurrentGameDate = soup.find('time', class_='sc-gcitqq edFCby')

    odds_data = []

    odds_data.append([Team1.get_text(), '', 'Spread', SpreadLine1.get_text(), SpreadOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(),'DraftKings', 'NFL'])
    odds_data.append([Team1.get_text(), '', 'Total', TotalLine1.get_text(), TotalOdd1.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(),'DraftKings', 'NFL'])
    odds_data.append([Team1.get_text(), '', 'MoneyLine', Team1.get_text(), MoneyLine.get_text(), CurrentGameDate.get_text(), datetime.datetime.now(),'DraftKings', 'NFL'])

    while Team1 != None: 
        Team1 = Team1.find_next('div', class_='sc-hGzUJM eWfhtJ')
        if Team1 != None:
            SpreadLine1 = soup.find('div', class_='sc-fXPgIJ kOKdhF')
            SpreadOdd1 = soup.find('li', class_='sc-eBhLNR dTqwJf')

            MoneyLine = SpreadOdd1.find_next('li', class_='sc-eBhLNR dTqwJf')

            TotalLine1 = SpreadLine1.find_next('div', class_='sc-fXPgIJ kOKdhF')
            TotalOdd1 = MoneyLine.find_next('li', class_='sc-eBhLNR dTqwJf')

            CurrentGameDate = soup.find('time', class_='sc-gcitqq edFCby')


    #team2 = team1.find_next('div', class_='event-cell__name-text')
    #SpreadLine2 = soup.find('span', class_='sportsbook-outcome-cell__line')
    update_paired_teams(odds_data)


    odds_df = pd.DataFrame(odds_data, columns=['Team 1', 'Team 2', 'Bet Type', 'Bet Info', 'Odds', 'Date of game', 'DateTime(when got odds)', 'Sportsbook Name', 'Sport'])
    odds_df.to_csv('BetRivers_odds_playwright.csv', index=False)
    
    #



with sync_playwright() as playwright:
    run(playwright)