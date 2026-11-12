import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ShoppingCartPage } from "../pages/shopping_cartPage";
import { CheckoutPage } from "../pages/checkoutPage";
import testData from "../fixtures/testdata.local.json";

const standardUser = testData.users.standard_user;
const baseUrl = testData.baseUrl;
const buyerInfo = {
  firstName: "John",
  lastName: "Doe",
  postalCode: "12345",
};
const expectedCartItems = [
  "Sauce Labs Backpack",
  "Sauce Labs Bike Light",
  "Sauce Labs Bolt T-Shirt",
  "Sauce Labs Fleece Jacket",
];

async function openCheckout(page: Page){
  const shoppingCartPage = new ShoppingCartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await shoppingCartPage.prepareShoppingCart();

    const shoppingCartBadge = shoppingCartPage.shoppingCartBadge;
    await expect(shoppingCartBadge).toHaveText("4");

    await checkoutPage.goToCheckoutPage();

    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(
      page.getByText(testData.titleCheckoutPage.titleMessage),
    ).toBeVisible();
}

async function submitBuyerInformation(page: Page, checkoutPage: CheckoutPage) {
  await checkoutPage.fillCheckoutInformation(
    buyerInfo.firstName,
    buyerInfo.lastName,
    buyerInfo.postalCode,
  );
  await checkoutPage.submitCheckoutInformation();

  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(
    page.getByText(testData.titleCheckoutOverviewPage.titleMessage),
  ).toBeVisible();
}

async function expectOrderSummary(page: Page) {
  const itemTotal = testData.Itemtotal;
  const tax = testData.Tax;
  const totalAmount = testData.totalAmount;

  await expect(page.getByText(itemTotal)).toBeVisible();
  await expect(page.getByText(tax)).toBeVisible();
  await expect(page.getByText(totalAmount)).toBeVisible();
}

test.describe("Scenario 3: Checkout", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(baseUrl);
    await loginPage.login(standardUser.username, standardUser.password);
  });

  test("Proceed to checkout", async ({ page }) => {
    await openCheckout(page);
  });

  test("buyer information", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await openCheckout(page);

    await submitBuyerInformation(page, checkoutPage);
  });

  test("Check the items and the total amount before confirming your order", async ({
    page,
  }) => {
    const checkoutPage = new CheckoutPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    await openCheckout(page);

    await submitBuyerInformation(page, checkoutPage);

    await expect(shoppingCartPage.cartItemNames).toHaveText(expectedCartItems);

    await expect(shoppingCartPage.cartItemNames).toHaveCount(4);

    await expectOrderSummary(page);
  });

  test("Confirm the order and verify the success message", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);

    await openCheckout(page);

    await submitBuyerInformation(page, checkoutPage);

    await expect(shoppingCartPage.cartItemNames).toHaveText(expectedCartItems);

    await expect(shoppingCartPage.cartItemNames).toHaveCount(4);

    await expectOrderSummary(page);

    await checkoutPage.finishCheckout();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);

    const orderSuccessMessage = testData.orderSuccessMessage;

    await expect(page.getByText(orderSuccessMessage.thankYou)).toBeVisible();
    await expect(page.getByText(orderSuccessMessage.dispatched)).toBeVisible();
    await expect(page.getByText(orderSuccessMessage.backHome)).toBeVisible();
    await expect(
      page.getByText(orderSuccessMessage.generatePdfOrder),
    ).toBeVisible();
  });
});
