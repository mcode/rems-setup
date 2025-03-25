import { type Page, type Locator, expect } from "@playwright/test";
import { EhrPage } from "./ehr";


/**
 * PatientPortalPage: Represents interactions with the Patient Portal
 */
export class PatientPortalPage extends EhrPage {
  constructor(page: Page) {
    super(page);
  }

  /**
 * Override getTaskCardByDescription to use patient-specific routes
 */
  async navigate() {
    await this.page.goto('http://localhost:3000/patient-portal');
    await this.page.waitForLoadState("networkidle");
  }

  /**
 * Override getTaskCardByDescription to use patient-specific class names
 */
  async login(username: string, password: string) {
    await this.page.getByLabel('Username').click();
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').click();
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Log In' }).click();
  }

  /**
 * Override getTaskCardByDescription to use patient-specific class names
 */
  async goToTasks() {
    await this.page.getByRole('button', { name: 'Tasks' }).click();
    await this.page.waitForLoadState("networkidle");
  }

  /**
 * Override getTaskCardByDescription to use patient-specific class names
 */
  async refreshTasks() {
    await this.goToMedications()
    await this.goToTasks()
  }

  // go to the medications page
  async goToMedications() {
    await this.page.getByRole('button', { name: 'Medications' }).click();
  }


}