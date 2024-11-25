import { expect, test } from '@playwright/test';
import { ItemsPage } from '../pages/Items.pages';
import { SortPage } from '../pages/Sort.pages';

test('Ordenar ítems por prioridad y validar', async ({ page }) => {
    const itemsPage = new ItemsPage(page);
    const sortPage = new SortPage(page);

    await itemsPage.goto();
    await itemsPage.login('alex.quiroga.p@ucb.edu.bo', 'AlexQuirogaPass');
    await itemsPage.navigateToProject();
    await sortPage.sortByPriority();

    // Validar que los ítems estén ordenados por prioridad
    const items = await page.locator('.ItemContent').allTextContents();
    const priorities = items.map(item => parseInt(item.match(/\b[1-4]\b/)?.[0] || '0'));
    const isSorted = priorities.every((val, i, arr) => !i || arr[i - 1] <= val);
    expect(isSorted).toBeTruthy(); // Verifica que están ordenados
});
