import { Page, expect, Locator } from "@playwright/test";
import { testUtilFillOutForm } from "./fillOutForm";


/**
 * SmartAppPage: Represents interactions with a SMART on FHIR app
 */
export class SmartAppPage {
  constructor(private page: Page) { }

  /**
   * Verify that the SMART on FHIR app loaded correctly
   */
  async verifyAppLoaded() {
    await this.page.waitForTimeout(1000); // Small buffer

    await expect(this.page).toHaveTitle("REMS SMART on FHIR app");
  }

  /**
   * Handle any in-progress forms dialog that might appear
   */
  async handleInProgressForms() {
    // Check if dialog is present
    const dialog = await this.page.waitForSelector('div[role="dialog"]');

    // Click the second to last button (usually the most recent form)
    await this.page.locator('div[role="dialog"] .MuiButtonBase-root').nth(-2).click();

  }

  /**
   * Fill out a form and submit it or save it
   */
  async fillOutForm() {
    // Use the utility to fill out the rest of the form
    await testUtilFillOutForm({ page: this.page });
  }

  async submitForm(submitButtonText: string = "Submit REMS Bundle") {
    // locate the submit button
    const submitButton = this.page.getByRole("button", { name: submitButtonText });
    // --- Click the submit button ---
    await submitButton.click();
    // close the dialog if present
    // Check if the dialog is visible, with a short timeout
    const isDialogVisible = await this.page.getByRole('button', { name: 'OK' })
      .isVisible({ timeout: 500 })
      .catch(() => false); // If any error occurs (like timeout), return false

    // Only click if it's visible
    if (isDialogVisible) {
      await this.page.getByRole('button', { name: 'OK' }).click();

    }
  }

  /**
   * Fill in any prescriber signature fields found on the form
   */
  async fillPrescriberSignatureFields(name: string) {
    // find the prescriber signature field
    const prescriberSignatureSection = this.page.locator('div.lf-form-horizontal-table-title:has-text("Provider Signature")');
    const doctorSignatureSection = this.page.locator('div.lf-de-label-button:has-text("Doctor Signature")');


    // Check if either is visible
    const isDoctorVisible = await doctorSignatureSection.isVisible();

    // Use the one that's visible
    const prescriberSectionToUse = isDoctorVisible ? doctorSignatureSection : prescriberSignatureSection

    // Get the parent container
    const container = prescriberSectionToUse.locator('..');

    // Find the signature input within this container (first input in the table)
    const signatureInput = container.locator('input[name*="signature" i]');
    await signatureInput.fill(name);

    await this.page.getByText('Form Loaded:').click();
  }

  /**
* Fill in any patient signature fields found on the form
*/
  async fillPatientSignatureFields(name: string) {
    // find the prescriber signature field
    const patientSignatureSection = this.page.locator('div.lf-form-horizontal-table-title:has-text("Patient Signature")');

    const patientSignatureAltSection = this.page.locator('div.lf-de-label-button:has-text("Patient Signature")');


    // Check if either is visible
    const isPatientAltVisible = await patientSignatureAltSection.isVisible();

    // Use the one that's visible
    const patientSectionToUse = isPatientAltVisible ? patientSignatureAltSection : patientSignatureSection;

    // Get the parent container
    const container = patientSectionToUse.locator('..');

    // Find the signature input within this container (first input in the table)
    const signatureInput = container.locator('input[name*="signature" i]');
    await signatureInput.fill(name);


    await this.page.getByText('Form Loaded:').click();
  }

  /**
   * Check ETASU status
   * Returns counts of checkmarks and close icons
   */
  async checkEtasuStatus() {
    await this.page.getByRole("button", { name: /ETASU:/i }).click();
    await this.page.waitForLoadState("networkidle");

    const remsPopup = this.page.locator(".MuiBox-root", { hasText: "REMS Status" });
    await expect(remsPopup.getByText("Patient Enrollment")).toBeVisible();

    const checksCount = await remsPopup.getByTestId("CheckCircleIcon").count();
    const closeCount = await remsPopup.getByTestId("CloseIcon").count();

    // Dismiss popup
    await remsPopup.press("Escape");

    return { checksCount, closeCount };
  }

  /**
   * Navigate to a specific tab in the SMART app
   */
  async navigateToTab(tabName: string) {
    await this.page.getByRole('tab', { name: new RegExp(tabName, 'i') }).click();
  }
}