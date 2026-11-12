import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import testData from "../fixtures/testdata.local.json";

const standardUser = testData.users.standard_user;
const lockedOutUser = testData.users.locked_out_user;
const titleShoppingCart = testData.titleShoppingCart;
const baseUrl = testData.baseUrl;

test.describe("Scenario 1: Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test("login with successful credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.login(standardUser.username, standardUser.password);

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test("login with valid credentials reaches Inventory", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(standardUser.username, standardUser.password);

    await expect(page).toHaveURL(/\/inventory\.html$/);

    await expect(
      page.locator('[data-test="inventory-container"]'),
    ).toBeVisible();
  });

  test("locked out user cannot login and sees an error message", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(lockedOutUser.username, lockedOutUser.password);

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      "Epic sadface: Sorry, this user has been locked out.",
    );
  });

  test("login with invalid password shows an error message", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(standardUser.username, "invalid_password");

    await expect(page.getByText(titleShoppingCart.titleMessage)).toBeVisible();

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      "Epic sadface: Username and password do not match any user in this service",
    );
  });

  test("login with invalid username shows an error message", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login("invalid_username", standardUser.password);

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      "Epic sadface: Username and password do not match any user in this service",
    );
  });

  test("login with empty credentials shows an error message", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login("", "");

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      "Epic sadface: Username is required",
    );
  });
});
