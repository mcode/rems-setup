import { type Page, type Locator, expect } from "@playwright/test";

/** Fills out all visible input fields on a Lforms-based page. 
 *  This function handles checkboxes, numeric fields, date fields, dropdowns, and text fields.
 *  It then clicks the submit button.
 */
export async function testUtilFillOutForm(props: {
  number?: string;
  text?: string;
  date?: string;
  page: Page;
}) {
  const {
    page,
    number = "25",
    text = "TEST",
    date = "10/31/2024",
  } = props;

  // scroll to the bottom of the page, load entire form
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await page.waitForTimeout(1000); // Small buffer


  // If some checkboxes must remain in a given state (e.g. "Only Show Unfilled Fields" should be unchecked)
  await page.locator('label:has-text("Only Show Unfilled Fields")')
    .locator('..')
    .locator('input[type="checkbox"]')
    .first().uncheck();

  let checkboxLocators = await page.locator('input[type="checkbox"]').all();

  for (let i = 0; i < checkboxLocators.length; i++) {
    const field = checkboxLocators[i]
    const checkboxId = await field.getAttribute('id');

    if (checkboxId && (checkboxId.startsWith('filterCheckbox') || checkboxId.startsWith('required-fields-checkbox'))) {
      continue; // Skip these checkboxes
    }

    await field.check();

    await page.waitForTimeout(500);

    // handle new checkboxes that appear
    const newCheckboxes = await page.locator('input[type="checkbox"]').all();
    if (newCheckboxes.length > checkboxLocators.length) {
      // Update our array with the new full set
      checkboxLocators = newCheckboxes;
    }
  }

  await page.getByText('Form Loaded:').click();


  // --- Fill numeric fields ---
  const numericFields = await page.locator('input[placeholder="Type a number"]').all();
  for (const field of numericFields) {
    const value = await field.inputValue(); // Get current value
    if (!value) { // Check if empty
      await field.fill(number);
    }
  }
  await page.getByText('Form Loaded:').click();

  // --- Fill date fields ---
  // Matches both native date fields and text fields with MM/DD/YYYY placeholder.
  const dateFields = await page.locator('input[type="date"]:visible, input[placeholder*="MM/DD/YYYY"]').all();
  for (const field of dateFields) {
    const value = await field.inputValue(); // Get current value
    if (!value) { // Check if empty
      await field.fill(date);
    }
  }
  await page.getByText('Form Loaded:').click();

  // --- Handle dropdowns (autocomplete/CWE style) ---
  const dropdowns = await page.locator('input[placeholder^="Select one"]').all();
  for (const dropdown of dropdowns) {
    const value = await dropdown.inputValue();
    if (!value) { // Check if empty
      await dropdown.click()

      // Wait for the dropdown to appear
      await page.waitForSelector('#completionOptions ul li');

      // Select the first option from the list
      const firstOption = await page.locator('#completionOptions ul li').first();
      await firstOption.click(); // Click the first option

      await dropdown.press('Escape');
    }
  }
  await page.getByText('Form Loaded:').click();

  // --- Fill text fields ---
  const textFields = await page.locator('input[placeholder="Type a value"]').all();

  for (const field of textFields) {

    const fieldName = await field.getAttribute('name');

    // Skip signature fields explicitly
    if (fieldName && fieldName.toLowerCase().includes('signature')) {
      continue; // Skip signature fields
    }

    const currentValue = await field.inputValue();
    if (!currentValue) {
      await field.fill(text);
    }
  }
  await page.getByText('Form Loaded:').click();

  await page.locator('label:has-text("Only Show Unfilled Fields")')
    .locator('..')
    .locator('input[type="checkbox"]')
    .first().check();

  await page.getByText('Form Loaded:').click();
}
