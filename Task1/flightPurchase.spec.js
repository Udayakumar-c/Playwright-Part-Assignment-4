// flightPurchase.spec.js
// Task 1: End-to-End Flight Purchase Automation on BlazeDemo
const { test, expect } = require('@playwright/test');

const EXPECTED_DETAILS = {
  airline: 'United',
  flightNumber: 'UA954',
  price: 400.0,
  fees: 514.76,
  total: 914.76,
};

const PASSENGER = {
  name: 'Playwright JS',
  address: 'Bangalore',
  state: 'Karnataka',
  cardType: 'amex', // option label: American Express
  cardNumber: '556622337788',
  year: '2025',
  nameOnCard: 'Playwright By Microsoft',
};

// Read text of the <p> that contains a label and strip the label out
async function readField(page, label) {
  const raw = await page.locator('p').filter({ hasText: label }).first().innerText();
  return raw.replace(label, '').trim();
}

// Turn "$400.00", " 514.76" etc. into a number
const toNumber = (text) => parseFloat(text.replace(/[^0-9.]/g, ''));

test('Complete flight purchase on BlazeDemo', async ({ page }) => {
  // ---------- Step 1: Open site and search ----------
  await page.goto('https://blazedemo.com/');

  const fromPort = page.locator('select[name="fromPort"]');
  const toPort = page.locator('select[name="toPort"]');

  await fromPort.selectOption('Boston');
  await toPort.selectOption('New York');
  await expect(fromPort).toHaveValue('Boston');
  await expect(toPort).toHaveValue('New York');

  await page.getByRole('button', { name: 'Find Flights' }).click();
  await expect(page).toHaveURL(/reserve/);

  // ---------- Step 2: Select the Lufthansa flight ----------
  const lufthansaRow = page
    .locator('table.table tbody tr')
    .filter({ hasText: 'Lufthansa' })
    .first();
  await expect(
    lufthansaRow,
    'No Lufthansa flight found in the search results'
  ).toBeVisible();

  await lufthansaRow.getByRole('button', { name: 'Choose This Flight' }).click();

  // ---------- Step 3: Verify purchase page ----------
  await expect(page).toHaveURL(/purchase/);
  await expect(page).toHaveTitle(/purchase/i);

  // ---------- Step 4: Verify flight details ----------
  // Soft assertions: every mismatch is reported (no silent switching of flights)
  const airline = await readField(page, 'Airline:');
  const flightNumber = await readField(page, 'Flight Number:');
  const price = toNumber(await readField(page, 'Price:'));
  const fees = toNumber(await readField(page, 'Arbitrary Fees and Taxes:'));
  const total = toNumber(await readField(page, 'Total Cost:'));

  console.log('Details on purchase page:', { airline, flightNumber, price, fees, total });

  expect.soft(airline, 'Airline mismatch').toBe(EXPECTED_DETAILS.airline);
  expect.soft(flightNumber, 'Flight number mismatch').toBe(EXPECTED_DETAILS.flightNumber);
  expect.soft(price, 'Flight price mismatch').toBeCloseTo(EXPECTED_DETAILS.price, 2);
  expect.soft(fees, 'Fees and taxes mismatch').toBeCloseTo(EXPECTED_DETAILS.fees, 2);
  expect.soft(total, 'Total cost mismatch').toBeCloseTo(EXPECTED_DETAILS.total, 2);

  // ---------- Step 5: Fill passenger and payment details ----------
  await page.locator('#inputName').fill(PASSENGER.name);
  await page.locator('#address').fill(PASSENGER.address);
  await page.locator('#state').fill(PASSENGER.state);
  await page.locator('#cardType').selectOption(PASSENGER.cardType);
  await page.locator('#creditCardNumber').fill(PASSENGER.cardNumber);
  await page.locator('#creditCardYear').fill(PASSENGER.year);
  await page.locator('#nameOnCard').fill(PASSENGER.nameOnCard);

  await expect(page.locator('#inputName')).toHaveValue(PASSENGER.name);
  await expect(page.locator('#address')).toHaveValue(PASSENGER.address);
  await expect(page.locator('#state')).toHaveValue(PASSENGER.state);
  await expect(page.locator('#cardType')).toHaveValue(PASSENGER.cardType);
  await expect(page.locator('#creditCardNumber')).toHaveValue(PASSENGER.cardNumber);
  await expect(page.locator('#creditCardYear')).toHaveValue(PASSENGER.year);
  await expect(page.locator('#nameOnCard')).toHaveValue(PASSENGER.nameOnCard);

  // ---------- Step 6: Remember me ----------
  const rememberMe = page.locator('#rememberMe');
  await rememberMe.click();
  await expect(rememberMe).toBeChecked();

  // ---------- Step 7: Purchase ----------
  await page.getByRole('button', { name: 'Purchase Flight' }).click();
  await expect(page).toHaveURL(/confirmation/);

  // ---------- Step 8: Order ID ----------
  const orderIdCell = page
    .locator('tr')
    .filter({ has: page.locator('td', { hasText: /^Id$/ }) })
    .locator('td')
    .nth(1);
  await expect(orderIdCell).toBeVisible();

  const orderId = await orderIdCell.textContent();
  expect(orderId, 'Order ID is null').not.toBeNull();
  expect(orderId.trim(), 'Order ID is empty').not.toBe('');

  console.log(`Generated Order ID: ${orderId.trim()}`);
});
