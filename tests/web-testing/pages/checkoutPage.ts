import { Page, Locator, expect } from "@playwright/test";
import { ShoppingCartPage } from "./shopping_cartPage";
import testData from "../fixtures/testdata.local.json";

export class CheckoutPage {
  private page: Page;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = this.page.locator('[data-test="checkout"]');
    this.continueShoppingButton = this.page.locator(
      '[data-test="continue-shopping"]',
    );

    this.continueButton = this.page.locator('[data-test="continue"]');
    this.cancelButton = this.page.locator('[data-test="cancel"]');

    this.firstNameInput = this.page.locator('[data-test="firstName"]');
    this.lastNameInput = this.page.locator('[data-test="lastName"]');
    this.postalCodeInput = this.page.locator('[data-test="postalCode"]');

    this.finishButton = this.page.locator('[data-test="finish"]');
  }

  async goToCheckoutPage() {
    await this.checkoutButton.click();
  }

  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async submitCheckoutInformation() {
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }
}
