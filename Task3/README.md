# Login Validation – Playwright Tests

Automated tests for the login page of  
https://freelance-learn-automation.vercel.app/login

## Files

| File | Purpose |
|------|---------|
| `loginValidation.spec.js` | The 4 test cases |
| `playwright.config.js` | Playwright settings (Chromium, HTML report, screenshots on failure) |
| `package.json` | Dependencies and shortcut scripts |
| `README.md` | This file |

## Setup

1. Install Node.js (v18 or newer).
2. In this folder run:

```bash
npm install
npx playwright install chromium
```

## Run the tests

```bash
npx playwright test loginValidation.spec.js
```

Other options:

```bash
npx playwright test loginValidation.spec.js --headed   # see the browser
npx playwright show-report                             # open HTML report
```

## Test cases

| ID | Scenario | Input | Expected message |
|----|----------|-------|------------------|
| TC1 | Empty login | Email empty, Password empty | `Email and Password is required` |
| TC2 | Email only | Email = `sibi@gmail.com`, Password empty | `Password is required` |
| TC3 | Password only | Email empty, Password = `sibi@gmail.com` | `Email is required` |
| TC4 | Invalid credentials | Email = `sibi@gmail.com`, Password = `sibi@gmail.com` | `Email and Password Doesn't match` |

## Locators used

| Element | Locator |
|---------|---------|
| Email field | `#email1` |
| Password field | `#password1` |
| Sign In button | `getByRole('button', { name: /sign in/i })` |
| Error message | `getByText('<message>', { exact: true })` |

All locators are defined at the top of the spec file. If the site changes an id, edit it in one place.

## Assertions used

- `toHaveURL` – login page loaded
- `toBeVisible` / `toBeEnabled` – fields and Sign In button are ready and clickable
- `toBeEmpty` / `toHaveValue` – inputs hold the expected data
- `toBeVisible` + `toHaveText` – the correct error message is shown and matches the expected text

## Independence

- `beforeEach` opens a fresh page for every test.
- No test depends on another test's data or order.
- `fullyParallel: true` is enabled, so tests can run in any order.

## Marks mapping

| Evaluation component | Covered by |
|----------------------|-----------|
| Empty login attempt | TC1 |
| Email-only and password-only | TC2, TC3 |
| Invalid credentials | TC4 |
| Assertions and independent structure | `beforeEach`, assertions in all tests |

## Troubleshooting

- **Locator not found:** open the login page, right-click the field → Inspect, and update the locator at the top of the spec.
- **Error text differs:** copy the exact text shown on the page into the test.
- **Browser missing:** run `npx playwright install chromium`.
