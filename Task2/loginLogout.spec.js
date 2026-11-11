//loginLogout.spec.js
//Task 2: Login and Logout on SauceDemo
const { test, expect } = require('@playwright/test');

test('Login and logout on SauceDemo', async ({ page }) => {
  // Step 1: Open the login page
  await page.goto('https://www.saucedemo.com/'); 

  const usernameField = page.locator('[data-test="username"]');
  const passwordField = page.locator('[data-test="password"]');
  const loginButton = page.locator('[data-test="login-button"]');

  await expect(usernameField).toBeVisible();
  await expect(passwordField).toBeVisible();
  await expect(loginButton).toBeVisible();

  // Step 2: Enter credentials
  await usernameField.fill('standard_user');
  await passwordField.fill('secret_sauce');
  await expect(usernameField).toHaveValue('standard_user');
  await expect(passwordField).toHaveValue('secret_sauce');  

  // Step 3: Click Login
  await loginButton.click();

  // Steps 4-5: Verify inventory page
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');

  // Step 6: Open hamburger menu
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await expect(page.locator('.bm-menu-wrap')).toBeVisible(); 

  // Step 7: Click Logout
  const logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  await expect(logoutLink).toBeVisible();
  await logoutLink.click(); 

  // Steps 8-9: Back on login page
  await expect(page).toHaveURL(/index\.html|saucedemo\.com\/?$/);

  // Step 10: Login form visible again
  await expect(usernameField).toBeVisible();
  await expect(passwordField).toBeVisible();
  await expect(loginButton).toBeVisible();
});
