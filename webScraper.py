from playwright.sync_api import sync_playwright, Playwright
from bs4 import BeautifulSoup

import pandas as pd

# Function to scrape the BetMGM NFL odds page
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
    print(soup.prettify())
    



with sync_playwright() as playwright:
    run(playwright)






# Scrape the data
#page_content = scrape_nfl_odds()

# Parse the page content using BeautifulSoup
#from bs4 import BeautifulSoup
#soup = BeautifulSoup(page_content, 'html.parser')

# Scrape the relevant data (you'll need to inspect the site to find the correct tags/classes)
#games = soup.find_all('div', class_='event-row')
# Prepare a list to store the data
#odds_data = []

# Loop through the games and extract information


'''
for game in games:
    try:
        teams = game.find_all('span', class_='team-name')
        odds = game.find_all('span', class_='sportsbook-odds')

        # Get the teams and their odds
        if len(teams) == 2 and len(odds) >= 2:  # Ensure data exists
            team1 = teams[0].text.strip()
            team2 = teams[1].text.strip()
            odds_team1 = odds[0].text.strip()
            odds_team2 = odds[1].text.strip()

            # Add the scraped data to the list
            odds_data.append([team1, odds_team1, team2, odds_team2])
    except Exception as e:
        print(f"Error scraping game: {e}")

'''

# Create a DataFrame for better readability
#odds_df = pd.DataFrame(odds_data, columns=['Team 1', 'Odds 1', 'Team 2', 'Odds 2'])

# Display the DataFrame
#print(odds_df)

# Optionally, save to CSV
#odds_df.to_csv('nfl_odds_playwright.csv', index=False)
