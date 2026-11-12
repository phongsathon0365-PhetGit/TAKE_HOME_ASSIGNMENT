import { Page, Locator, expect } from "@playwright/test";
import testData from "../fixtures/testdata.local.json";

const titleShoppingCart = testData.titleShoppingCart;

export class ShoppingCartPage {
  private page: Page;
  readonly inventoryContainer: Locator;
  readonly cartItemNames: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryContainer = this.page.locator(
      '[data-test="inventory-container"]',
    );
    this.cartItemNames = this.page.locator('[data-test="inventory-item-name"]');
    this.shoppingCartLink = this.page.locator(
      '[data-test="shopping-cart-link"]',
    );
    this.shoppingCartBadge = this.page.locator(".shopping_cart_badge");
  }

  async addItemToCart(itemName: string) {
    await this.page.click(`[data-test="add-to-cart-${itemName}"]`);
  }

  async addMultipleItemsToCart() {
    await this.addItemToCart("sauce-labs-backpack");
    await this.addItemToCart("sauce-labs-bike-light");
    await this.addItemToCart("sauce-labs-bolt-t-shirt");
    await this.addItemToCart("sauce-labs-fleece-jacket");
  }

  async prepareShoppingCart() {
    await this.addMultipleItemsToCart();
    await this.goToShoppingCart();
    return this;
  }

  async removeItemFromCart(itemName: string) {
    await this.page.click(`[data-test="remove-${itemName}"]`);
  }

  async goToShoppingCart() {
    await this.shoppingCartLink.click();
  }
}
