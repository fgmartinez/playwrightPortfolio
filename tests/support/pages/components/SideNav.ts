import { Locator, Page } from "@playwright/test";

export class SideNav {
    readonly username: Locator;
    constructor(private readonly page: Page) {
        this.username = page.getByTestId("sidenav-username");
    }
}