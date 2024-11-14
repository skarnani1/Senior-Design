from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import datetime
import pandas as pd

def extract_odds(page, url, sport_type):
    # Go to the specified URL
    page.goto(url)

    # Wait for the main grid container to ensure content is loaded
    page.wait_for_selector('.grid-event.grid-six-pack-event.ms-active-highlight.two-lined-name.ng-star-inserted', timeout=20000)

    # Get the full page content
    html = page.content()

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

        # Initialize odds variables
        spread_line_a = spread_odds_a = spread_line_b = spread_odds_b = None
        total_line_a = total_odds_a = total_line_b = total_odds_b = None
        moneyline_a = moneyline_b = None

        # Spread and moneyline odds extraction
        try:
            spread_line_a = game.find_all('div', class_='option-attribute ng-star-inserted')[0].get_text().strip()
            spread_odds_a = odds_spans[0].get_text().strip()
            spread_line_b = game.find_all('div', class_='option-attribute ng-star-inserted')[1].get_text().strip()
            spread_odds_b = odds_spans[1].get_text().strip()
            moneyline_a = odds_spans[5].get_text().strip()
            moneyline_b = odds_spans[6].get_text().strip()
        except IndexError:
            pass

        # Total (over/under) odds extraction using specific class for each sport type
        try:
            if sport_type == 'NBA':
                over_under_lines = game.find_all('div', class_='option-attribute small-font option-group-attribute ng-star-inserted')
            elif sport_type == 'NFL':
                over_under_lines = game.find_all('div', class_='option-attribute option-group-attribute ng-star-inserted')

            if len(over_under_lines) >= 2:
                total_line_a = over_under_lines[0].get_text().strip()  # Over line
                total_odds_a = odds_spans[3].get_text().strip()        # Over odds
                total_line_b = over_under_lines[1].get_text().strip()  # Under line
                total_odds_b = odds_spans[4].get_text().strip()        # Under odds
        except IndexError:
            pass

        # Append data for Team A if odds exist
        if spread_line_a and spread_odds_a:
            odds_data.append([team_a, team_b, 'Spread', spread_line_a, spread_odds_a, datetime.datetime.now(), 'BetMGM', sport_type])
        if total_line_a and total_odds_a:
            odds_data.append([team_a, team_b, 'Total (Over)', total_line_a, total_odds_a, datetime.datetime.now(), 'BetMGM', sport_type])
        if moneyline_a:
            odds_data.append([team_a, team_b, 'MoneyLine', '', moneyline_a, datetime.datetime.now(), 'BetMGM', sport_type])

        # Append data for Team B if odds exist
        if spread_line_b and spread_odds_b:
            odds_data.append([team_b, team_a, 'Spread', spread_line_b, spread_odds_b, datetime.datetime.now(), 'BetMGM', sport_type])
        if total_line_b and total_odds_b:
            odds_data.append([team_b, team_a, 'Total (Under)', total_line_b, total_odds_b, datetime.datetime.now(), 'BetMGM', sport_type])
        if moneyline_b:
            odds_data.append([team_b, team_a, 'MoneyLine', '', moneyline_b, datetime.datetime.now(), 'BetMGM', sport_type])

    return odds_data

def run():
    # URLs for both NFL and NBA odds
    nfl_url = "https://sports.pa.betmgm.com/en/sports/football-11/betting/usa-9/nfl-35"
    nba_url = "https://sports.pa.betmgm.com/en/sports/basketball-7/betting/usa-9/nba-6004"

    with sync_playwright() as playwright:
        # Launch the browser and open a new page
        browser = playwright.chromium.launch(headless=False)
        page = browser.new_page()

        # Extract data for both sports
        nfl_data = extract_odds(page, nfl_url, 'NFL')
        nba_data = extract_odds(page, nba_url, 'NBA')

        # Combine data and create DataFrame
        odds_data = nfl_data + nba_data
        if not odds_data:
            print("No data extracted for either NFL or NBA.")
        else:
            odds_df = pd.DataFrame(odds_data, columns=['Team 1', 'Team 2', 'Bet Type', 'Bet Info', 'Odds', 'DateTime', 'Sportsbook Name', 'Sport'])
            odds_df.to_csv('BetMGM_combined_odds.csv', index=False)
            print("Data extraction complete and saved to CSV.")

        # Close the browser
        browser.close()

# Run the function
run()
