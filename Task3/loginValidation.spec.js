// loginValidation.spec.js
// Login validation tests for the Freelance Learn Automation login page
// Run: npx playwright test loginValidation.spec.js

const { test, expect } = require('@playwright/test');

const LOGIN_URL = 'https://freelance-learn-automation.vercel.app/login';

// Assignment test data
const EMAIL = 'sibi@gmail.com';
const PASSWORD = 'sibi@gmail.com';

// ---- Locators (kept in one place so they are easy to fix) ----
const emailInput = (page) => page.locator('#email1');
const passwordInput = (page) => page.locator('#password1');
const signInButton = (page) => page.getByRole('button', { name: /sign in/i });
// Error text is matched exactly, so "Password is required" will not
// accidentally match "Email and Password is required".
const errorMessage = (page, text) => page.getByText(text, { exact: true });

test.describe('Login page validation', () => {
  // Fresh page for every test -> each test is independent.
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    // Assertion: login page loads successfully
    await expect(page).toHaveURL(/\/login/);
    await expect(emailInput(page)).toBeVisible();
    await expect(passwordInput(page)).toBeVisible();
    await expect(signInButton(page)).toBeVisible();
    await expect(signInButton(page)).toBeEnabled();
  });

  test('TC1: Empty login attempt shows "Email and Password is required"', async ({ page }) => {
    // Both fields are empty
    await expect(emailInput(page)).toBeEmpty();
    await expect(passwordInput(page)).toBeEmpty();

    await signInButton(page).click();

    const error = errorMessage(page, 'Email and Password is required');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Email and Password is required');
  });

  test('TC2: Email only shows "Password is required"', async ({ page }) => {
    // Enter email only, leave password empty
    await emailInput(page).fill(EMAIL);
    await expect(emailInput(page)).toHaveValue(EMAIL);
    await expect(passwordInput(page)).toBeEmpty();

    await signInButton(page).click();

    const error = errorMessage(page, 'Password is required');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Password is required');
  });

  test('TC3: Password only shows "Email is required"', async ({ page }) => {
    // Leave email empty, enter password only
    await expect(emailInput(page)).toBeEmpty();
    await passwordInput(page).fill(PASSWORD);
    await expect(passwordInput(page)).toHaveValue(PASSWORD);

    await signInButton(page).click();

    const error = errorMessage(page, 'Email is required');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Email is required');
  });

  test("TC4: Invalid credentials show \"Email and Password Doesn't match\"", async ({ page }) => {
    // Enter email and password that do not match any user
    await emailInput(page).fill(EMAIL);
    await passwordInput(page).fill(PASSWORD);
    await expect(emailInput(page)).toHaveValue(EMAIL);
    await expect(passwordInput(page)).toHaveValue(PASSWORD);

    await signInButton(page).click();

    const error = errorMessage(page, "Email and Password Doesn't match");
    await expect(error).toBeVisible();
    await expect(error).toHaveText("Email and Password Doesn't match");
  });
});
