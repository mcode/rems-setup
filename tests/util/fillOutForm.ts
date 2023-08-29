import { type Page, type Locator, expect } from "@playwright/test";

/** Fills out all blank text, numeric, and date fields found on the given page, then clicks the submit button. */
export async function testUtilFillOutForm(props: {
  number?: string;
  text?: string;
  date?: string;
  page: Page;
  submitButton: Locator;
}) {
  const { page, submitButton, number = "1", text = "TEST", date = "12/31/2000" } = props;
  const emptyNumericFields = page.locator("input:visible").getByPlaceholder("Type a number").getByText("").all();
  for (const emptyField of await emptyNumericFields) {
    await emptyField.fill(number);
  }
  expect(await emptyNumericFields, `Unable to fill all numeric fields with ${number}`).toHaveLength(0);

  const emptyTextFields = page.locator("input:visible").getByPlaceholder("Type a number").getByText("").all();
  for (const emptyField of await emptyTextFields) {
    await emptyField.fill(text);
  }
  expect(await emptyTextFields).toHaveLength(0);

  const emptyDateFields = page.locator("input:visible").getByPlaceholder("MM/DD/YYYY").getByText("").all();
  for (const emptyField of await emptyDateFields) {
    await emptyField.fill(date);
  }
  expect(await emptyDateFields).toHaveLength(0);

  await submitButton.click();
}
