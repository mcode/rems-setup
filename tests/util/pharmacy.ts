import { Page, expect, Locator } from "@playwright/test";

export class PharmacyPage {
  constructor(private page: Page) { }

  /**
   * Navigate to the pharmacy application
   */
  async navigate() {
    await this.page.goto("http://localhost:5050/");
    await this.page.waitForLoadState("networkidle");

    // Verify pharmacy page loaded
    await expect(this.page.getByRole("heading", { name: "Pharmacy" })).toBeVisible();
  }

  /**
   * Navigate to the Doctor Orders section
   */
  async navigateToDoctorOrders() {
    await this.page.getByRole("button", { name: /doctor orders/i }).click();
  }

  /**
   * Find a medication card by name
   */
  async findMedicationCard(searchTerm: string) {
    const medCard = this.page.locator(".MuiPaper-root", { hasText: searchTerm }).first();
    await expect(medCard).toBeVisible();
    return medCard;
  }

  /**
   * Verify ETASU requirements
   * Returns the number of checkmarks found
   */
  async verifyETASU() {
    await this.page.getByRole('button', { name: 'VIEW ETASU' }).click();
    await expect(this.page.getByText('✅').first()).toBeVisible();
    const numChecks = await this.page.getByText('✅').count();

    // Close the dialog
    await this.page.getByRole('button', { name: 'Close' }).click();

    return numChecks;
  }

  /**
   * Verify the current order
   */
  async verifyOrder() {
    await this.page.getByRole('button', { name: 'VERIFY ORDER' }).click();
  }

  /**
   * Switch to a different tab in the pharmacy UI
   */
  async switchTab(tabName: string) {
    await this.page.getByRole('tab', { name: tabName }).click();
  }

  /**
   * Mark the current order as picked up
   */
  async markAsPickedUp() {
    await this.page.getByRole('button', { name: 'Mark as Picked Up' }).click();
  }

  /**
   * Verify the status of a medication
   */
  async verifyMedicationStatus(searchTerm: string, status: string) {
    const medCard = await this.findMedicationCard(searchTerm);
    await expect(medCard.getByText(status)).toBeVisible();
  }
}
