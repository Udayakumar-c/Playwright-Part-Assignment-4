# Task 2: SauceDemo Login and Logout (Playwright JS)

## Files
- `loginLogout.spec.js` – the test
- `playwright.config.js` – config (includes a `chromium` project)

## Application
- URL: https://www.saucedemo.com/
- Username: `standard_user`
- Password: `secret_sauce`

## Setup (once)
```
npm init -y
npm i -D @playwright/test
npx playwright install
```

## Run
```
npx playwright test loginLogout.spec.js
npx playwright test loginLogout.spec.js --project=chromium
npx playwright test loginLogout.spec.js --headed
npx playwright show-report
```

## What the test does
1. Opens the login page and checks username, password and Login button are visible
2. Enters the credentials and checks the values
3. Clicks Login
4. Checks the URL contains `inventory.html` and the Products page is visible
5. Opens the hamburger menu and checks it is open
6. Clicks Logout
7. Checks the URL is back on the login page (`index.html` or site root)
8. Checks username, password and Login button are visible again

