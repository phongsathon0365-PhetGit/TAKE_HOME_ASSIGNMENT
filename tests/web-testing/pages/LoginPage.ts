import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;

  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = this.page.locator('[data-test="username"]');
    this.passwordInput = this.page.locator('[data-test="password"]')
    this.loginButton = this.page.locator('[data-test="login-button"]');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isLoginButtonVisible() {
    return await this.loginButton.isVisible();
  }
}
