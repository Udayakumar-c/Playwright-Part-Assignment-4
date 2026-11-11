# Task 1: BlazeDemo Flight Purchase (Playwright JS)

## Files
- `flightPurchase.spec.js` – single end-to-end test
- `playwright.config.js` – basic config

## Setup
```
npm init -y
npm i -D @playwright/test
npx playwright install
```

## Run
```
npx playwright test flightPurchase.spec.js
npx playwright test flightPurchase.spec.js --headed
npx playwright show-report
```

## What the test does
1. Opens BlazeDemo, selects Boston -> New York, clicks Find Flights
2. Picks the Lufthansa flight
3. Checks URL and title contain "purchase"
4. Checks airline, flight number, price, fees, total
5. Fills passenger and payment form (and asserts values)
6. Clicks Remember me and asserts it is checked
7. Clicks Purchase Flight, checks URL has "confirmation"
8. Reads Order ID, checks not null / not empty, prints it

