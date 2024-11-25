import { chromium, webkit, firefox, Page, Browser, Locator, expect } from '@playwright/test';

export class ItemsPage {
    readonly page: Page;
    readonly url = 'https://todo.ly/';
    readonly loginButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitLoginButton: Locator;
    readonly projectTab: Locator;
    readonly newItemInput: Locator;
    readonly addButton: Locator;
    readonly optionsButton: Locator;
    readonly priorityMenu: Locator;
    readonly itemList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.locator('.HPHeaderLogin > a');
        this.emailInput = page.locator('#ctl00_MainContent_LoginControl1_TextBoxEmail');
        this.passwordInput = page.locator('#ctl00_MainContent_LoginControl1_TextBoxPassword');
        this.submitLoginButton = page.getByRole('button', { name: 'Submit' });
        this.projectTab = page.getByRole('cell', { name: 'Proyecto de prueba Alex Quiroga Pérez', exact: true });
        this.newItemInput = page.locator('#NewItemContentInput');
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.optionsButton = page.getByRole('img', { name: 'Options' });
        this.priorityMenu = page.locator('#itemContextMenu');
        this.itemList = page.locator('.ItemContent'); // Selector para los ítems creados
        this.optionsButton = page.locator('Options'); // Usa un selector más específico si es posible
    }

    static async launchWebKitWithLowResources(): Promise<Browser> {
        return webkit.launch({
            headless: true,
            args: [
                '--disable-gpu',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--disable-background-networking',
                '--disable-breakpad',
                '--disable-client-side-phishing-detection',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-sync',
                '--hide-scrollbars',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-first-run',
                '--safebrowsing-disable-auto-update'
            ]
        });
    }

    static async launchFirefoxWithLowResources(): Promise<Browser> {
        return firefox.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--disable-extensions',
                '--disable-sync',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-first-run'
            ],
            firefoxUserPrefs: {
                'browser.cache.disk.enable': false,
                'browser.cache.memory.enable': false,
                'media.memory_cache_max_size': 0,
                'network.http.use-cache': false
            }
        });
    }

    async goto() {
        await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    }

    async login(email: string, password: string) {
        await this.loginButton.click();
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitLoginButton.click();
    }

    async navigateToProject() {
        await this.projectTab.click();
    }

    async addItemWithRandomPriority(): Promise<string> {
        const priorities = ['1', '2', '3', '4'];
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
        const itemName = `item-${Date.now()}`; 
        await this.newItemInput.fill(itemName);
        await this.addButton.click();
        await this.page.waitForTimeout(2000); // Espera 2 segundos antes de hacer clic en el botón de opciones
        await this.optionsButton.waitFor({ state: 'visible', timeout: 60000 }); // Espera hasta 60 segundos a que el botón sea visible
        await this.optionsButton.click();
        await this.priorityMenu.getByText(randomPriority).click();

        return itemName;
    }

    async validateItemExists(itemName: string) {
        const itemLocator = this.page.locator('.ItemContent', { hasText: itemName });
        await expect(itemLocator).toBeVisible(); // Verifica que el ítem es visible en la lista
    }
}
