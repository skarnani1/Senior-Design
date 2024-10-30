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
    page.wait_for_selector('.grid-event.grid-six-pack-event.ms-active-highlight.two-lined-name.ng-star-inserted', timeout=20000)

    # Get the full page content
    html = page.content()
    browser.close()

    # Parse HTML with BeautifulSoup
    soup = BeautifulSoup(html, 'html.parser')

    # Initialize data storage
    odds_data = []

    # Find each game container
    games = soup.find_all('ms-six-pack-event', class_='grid-event grid-six-pack-event ms-active-highlight two-lined-name ng-star-inserted')

    for game in games:
        # Extract team names
        participants = game.find_all('div', class_='participant')
        if len(participants) < 2:
            continue  # Skip if we don't find both teams

        team_a = participants[0].get_text().strip()
        team_b = participants[1].get_text().strip()

        # Extract all custom-odds-value-style spans to check order
        odds_spans = game.find_all('span', class_='custom-odds-value-style ng-star-inserted')

        # Spread, Total, Moneyline information with corrected indexing
        try:
            # Spread values and odds
            spread_line_a = game.find_all('div', class_='option-attribute ng-star-inserted')[0].get_text().strip()
            spread_odds_a = odds_spans[0].get_text().strip()

            spread_line_b = game.find_all('div', class_='option-attribute ng-star-inserted')[1].get_text().strip()
            spread_odds_b = odds_spans[1].get_text().strip()

            # Total values and odds
            total_line_a = game.find_all('div', class_='option-attribute option-group-attribute ng-star-inserted')[0].get_text().strip()
            total_odds_a = odds_spans[3].get_text().strip()

            total_line_b = game.find_all('div', class_='option-attribute option-group-attribute ng-star-inserted')[1].get_text().strip()
            total_odds_b = odds_spans[4].get_text().strip()

            # Moneyline odds
            moneyline_a = odds_spans[5].get_text().strip()
            moneyline_b = odds_spans[6].get_text().strip()

        except IndexError as e:
            print("Index Error: Not enough odds data found for one or more bet types in this game.")
            print(f"Error details: {e}")
            continue

        # Append data for Team A
        odds_data.append([team_a, team_b, 'Spread', spread_line_a, spread_odds_a, datetime.datetime.now(), 'BetMGM', 'NFL'])
        odds_data.append([team_a, team_b, 'Total', total_line_a, total_odds_a, datetime.datetime.now(), 'BetMGM', 'NFL'])
        odds_data.append([team_a, team_b, 'MoneyLine', '', moneyline_a, datetime.datetime.now(), 'BetMGM', 'NFL'])

        # Append data for Team B
        odds_data.append([team_b, team_a, 'Spread', spread_line_b, spread_odds_b, datetime.datetime.now(), 'BetMGM', 'NFL'])
        odds_data.append([team_b, team_a, 'Total', total_line_b, total_odds_b, datetime.datetime.now(), 'BetMGM', 'NFL'])
        odds_data.append([team_b, team_a, 'MoneyLine', '', moneyline_b, datetime.datetime.now(), 'BetMGM', 'NFL'])

    # Create DataFrame and export to CSV
    odds_df = pd.DataFrame(odds_data, columns=['Team 1', 'Team 2', 'Bet Type', 'Bet Info', 'Odds', 'DateTime', 'Sportsbook Name', 'Sport'])
    odds_df.to_csv('BetMGM_odds_playwright.csv', index=False)
    print("Data extraction complete and saved to CSV.")

with sync_playwright() as playwright:
    run(playwright)
