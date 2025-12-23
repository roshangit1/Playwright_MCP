import { test, expect } from '@playwright/test';

const BASE = 'https://www.saucedemo.com/';

test.describe('SauceDemo end-to-end', () => {
  test('Login with valid credentials', async ({ page }) => {
    await page.goto(BASE);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('Login with invalid credentials', async ({ page }) => {
    await page.goto(BASE);
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    const err = page.locator('[data-test="error"]');
    await expect(err).toBeVisible();
    await expect(err).toContainText('Username and password do not match');
  });

  test('Add product to cart', async ({ page }) => {
    await page.goto(BASE);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    const firstAdd = page.locator('.inventory_item button').first();
    await firstAdd.click();
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('Remove product from cart', async ({ page }) => {
    await page.goto(BASE);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    const firstAdd = page.locator('.inventory_item button').first();
    await firstAdd.click();
    await page.click('.shopping_cart_link');
    await page.click('.cart_item button');
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('Complete checkout flow', async ({ page }) => {
    await page.goto(BASE);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.locator('.inventory_item button').first().click();
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await page.click('[data-test="finish"]');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
});
