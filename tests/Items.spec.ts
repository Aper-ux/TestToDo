import { test } from '@playwright/test';
import { ItemsPage } from '../pages/Items.pages';

test('Prueba para agregar 3 ítems con prioridades aleatorias y validar su creación', async ({ page }) => {
    const itemsPage = new ItemsPage(page);

    await itemsPage.goto();
    await itemsPage.login('alex.quiroga.p@ucb.edu.bo', 'AlexQuirogaPass');
    await itemsPage.navigateToProject();

    for (let i = 0; i < 3; i++) {
        const itemName = await itemsPage.addItemWithRandomPriority(); // Crear el ítem
        await itemsPage.validateItemExists(itemName); // Validar que el ítem exista
    }
});
