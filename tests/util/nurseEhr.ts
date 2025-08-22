/**
 * NurseEhrPage class specifically for the nurse view of the EHR application
 * Extends the base EhrPage with nurse-specific selectors and methods
 */

import { Page, expect, Locator } from "@playwright/test";
import { EhrPage } from "./ehr";

export class NurseEhrPage extends EhrPage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Override selectPatient method for nurse-specific UI
   */
  async selectPatient(patientName: string) {
    await this.page.getByRole('button', { name: 'Select a patient' }).first().click();
    await this.page.getByLabel('Search').click();
    await this.page.getByRole('combobox', { name: 'Search' }).fill(patientName);
    await this.page.getByRole('button', { name: 'Select Patient' }).click();

  }
}