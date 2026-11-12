import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ShoppingCartPage } from "../pages/shopping_cartPage";
import testData from "../fixtures/testdata.local.json";

const standardUser = testData.users.standard_user;
const titleShoppingCart = testData.titleShoppingCart;
const baseUrl = testData.baseUrl;

async function ToShoppingCartInformation(page: Page) {
  const shoppingCartPage = new ShoppingCartPage(page);
  await expect(shoppingCartPage.inventoryContainer).toBeVisible();

  await shoppingCartPage.prepareShoppingCart();

  const shoppingCartBadge = shoppingCartPage.shoppingCartBadge;
  await expect(shoppingCartBadge).toHaveText("4");

  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(page.getByText(titleShoppingCart.titleMessage)).toBeVisible();
}

test.describe("Scenario 2: Shopping Cart ", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(baseUrl);
    await loginPage.login(standardUser.username, standardUser.password);
  });

  test("add item to shopping cart", async ({ page }) => {
    const shoppingCartPage = new ShoppingCartPage(page);
    await expect(shoppingCartPage.inventoryContainer).toBeVisible();

    await shoppingCartPage.addMultipleItemsToCart();

    const shoppingCartBadge = shoppingCartPage.shoppingCartBadge;
    await expect(shoppingCartBadge).toHaveText("4");
  });

  test("Verify the quantity and name of the products", async ({ page }) => {
    const shoppingCartPage = new ShoppingCartPage(page);

    await ToShoppingCartInformation(page);

    await expect(shoppingCartPage.cartItemNames).toHaveText([
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
      "Sauce Labs Fleece Jacket",
    ]);

    await expect(shoppingCartPage.cartItemNames).toHaveCount(4);

    await expect(page.locator(".cart_quantity")).toHaveText([
      "1",
      "1",
      "1",
      "1",
    ]);

    await expect(shoppingCartPage.shoppingCartBadge).toHaveText("4");
  });

  test("remove item from shopping cart", async ({ page }) => {
    const shoppingCartPage = new ShoppingCartPage(page);

    await ToShoppingCartInformation(page);

    await shoppingCartPage.removeItemFromCart("sauce-labs-backpack");

    await expect(shoppingCartPage.shoppingCartBadge).toHaveText("3");
    await expect(shoppingCartPage.cartItemNames).toHaveText([
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
      "Sauce Labs Fleece Jacket",
    ]);
    await expect(shoppingCartPage.cartItemNames).toHaveCount(3);
  });
});
