from playwright.sync_api import sync_playwright, Playwright
from bs4 import BeautifulSoup
import datetime
import pandas as pd

def run(playwright: Playwright):
    # Open BetMGM's NFL odds page
    browser = playwright.chromium.launch(headless=False)  # Run in visible mode
    page = browser.new_page()
    page.goto("https://sports.pa.betmgm.com/en/sports/football-11/betting/usa-9/nfl-35")

    # Wait for the main grid container to ensure content is loaded
    page.wait_for_selector('.grid-group-container', timeout=20000)

    # Get the full page content
    html = page.content()
    browser.close()

    # Parse HTML with BeautifulSoup
    soup = BeautifulSoup(html, 'html.parser')

    # Initialize data storage
    odds_data = []

    # Find all participants (team names)
    participants = soup.find_all('div', class_='participant')

    if not participants:
        print("No participants found.")
        return

    # Find all odds blocks
    odds_blocks = soup.find_all('div', class_='option-indicator')

    # Loop through each participant block (team names)
    for i in range(0, len(participants), 2):  # Assuming two participants per game
        team_a = participants[i].get_text().strip()  # Team 1
        team_b = participants[i + 1].get_text().strip()  # Team 2

        if i < len(odds_blocks):
            # Spread values and odds
            spread_value_a = odds_blocks[i].find('span', class_='option-attribute ng-star-inserted')
            spread_odds_a = odds_blocks[i].find('span', class_='custom-odds-value-style ng-star-inserted')

            spread_value_b = odds_blocks[i + 1].find('span', class_='option-attribute ng-star-inserted')
            spread_odds_b = odds_blocks[i + 1].find('span', class_='custom-odds-value-style ng-star-inserted')

            # Total values and odds
            total_value_a = odds_blocks[i].find('span', class_='option-attribute option-group-attribute ng-star-inserted')
            total_odds_a = odds_blocks[i].find('span', class_='custom-odds-value-style ng-star-inserted')

            total_value_b = odds_blocks[i + 1].find('span', class_='option-attribute option-group-attribute ng-star-inserted')
            total_odds_b = odds_blocks[i + 1].find('span', class_='custom-odds-value-style ng-star-inserted')

            # Moneyline odds
            moneyline_a = odds_blocks[i].find('span', class_='custom-odds-value-style ng-star-inserted')
            moneyline_b = odds_blocks[i + 1].find('span', class_='custom-odds-value-style ng-star-inserted')

            # Clean up the text or assign 'N/A' if not found
            spread_value_a = spread_value_a.get_text().strip() if spread_value_a else "N/A"
            spread_odds_a = spread_odds_a.get_text().strip() if spread_odds_a else "N/A"

            spread_value_b = spread_value_b.get_text().strip() if spread_value_b else "N/A"
            spread_odds_b = spread_odds_b.get_text().strip() if spread_odds_b else "N/A"

            total_value_a = total_value_a.get_text().strip() if total_value_a else "N/A"
            total_odds_a = total_odds_a.get_text().strip() if total_odds_a else "N/A"

            total_value_b = total_value_b.get_text().strip() if total_value_b else "N/A"
            total_odds_b = total_odds_b.get_text().strip() if total_odds_b else "N/A"

            moneyline_a = moneyline_a.get_text().strip() if moneyline_a else "N/A"
            moneyline_b = moneyline_b.get_text().strip() if moneyline_b else "N/A"

            # Append Team A data
            odds_data.append([team_a, team_b, 'Spread', spread_value_a, spread_odds_a, datetime.datetime.now(), 'BetMGM', 'NFL'])
            odds_data.append([team_a, team_b, 'Total', total_value_a, total_odds_a, datetime.datetime.now(), 'BetMGM', 'NFL'])
            odds_data.append([team_a, team_b, 'MoneyLine', '', moneyline_a, datetime.datetime.now(), 'BetMGM', 'NFL'])

            # Append Team B data
            odds_data.append([team_b, team_a, 'Spread', spread_value_b, spread_odds_b, datetime.datetime.now(), 'BetMGM', 'NFL'])
            odds_data.append([team_b, team_a, 'Total', total_value_b, total_odds_b, datetime.datetime.now(), 'BetMGM', 'NFL'])
            odds_data.append([team_b, team_a, 'MoneyLine', '', moneyline_b, datetime.datetime.now(), 'BetMGM', 'NFL'])

    # Create DataFrame and export to CSV
    odds_df = pd.DataFrame(odds_data, columns=['Team 1', 'Team 2', 'Bet Type', 'Bet Info', 'Odds', 'DateTime', 'Sportsbook Name', 'Sport'])
    odds_df.to_csv('BetMGM_odds_playwright.csv', index=False)

with sync_playwright() as playwright:
    run(playwright)
