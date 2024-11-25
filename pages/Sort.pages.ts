import { Locator, Page } from '@playwright/test';

export class SortPage {
    readonly page: Page;
    readonly sortMenu: Locator;
    readonly sortByPriorityOption: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sortMenu = page.locator('#SortMenu');
        this.sortByPriorityOption = page.getByRole('link', { name: 'Sort by Priority' });
    }

    async sortByPriority() {
        await this.sortMenu.click();
        await this.sortByPriorityOption.click();
    }
}