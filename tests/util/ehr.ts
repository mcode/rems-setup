import { Page, expect, Locator } from "@playwright/test";
import { testUtilKeycloakLogin } from "./keycloakLogin";

/**
 * EhrPage: Represents interactions with the Electronic Health Record (EHR) application
 */
export class EhrPage {
    // Make page protected so it can be accessed by child classes
    protected page: Page;

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Navigate to the EHR application
     */
    async navigate() {
        await this.page.goto("localhost:3000");
        await this.page.waitForLoadState("networkidle");
    }

    /**
     * Login to the EHR application
     */
    async login(username: string, password: string) {
        await this.page.getByRole('button', { name: 'Launch', exact: true }).click();
        await this.page.waitForTimeout(1000); // Small buffer

        if (await this.page.getByText('Sign in to your account').isVisible()) {
            await testUtilKeycloakLogin({ page: this.page, username, password });
        }

        await this.page.waitForLoadState("networkidle");

        // Verify successful login
        await expect(this.page).toHaveTitle(/EHR/);
        await expect(this.page.getByText("Select A Patient")).toBeVisible();
        await expect(this.page.getByRole("button", { name: "Send RX to PIMS" })).not.toBeVisible();
    }

    /**
     * Reset all databases to ensure clean test state
     */
    async resetDatabases() {
        await this.page.getByRole('button', { name: 'Settings' }).click();
        await this.page.getByRole('button', { name: 'Reset PIMS Database' }).click();
        await this.page.getByRole('button', { name: 'Clear EHR In-Progress Forms' }).click();
        await this.page.getByRole('button', { name: 'Reset REMS-Admin Database' }).click();
        await this.page.getByRole('button', { name: 'Clear EHR Dispense Statuses' }).click();
        await this.page.getByRole('button', { name: 'Clear EHR Tasks' }).click();
        await this.page.getByRole('button', { name: 'Reconnect EHR' }).click();
    }

    /**
     * Select a patient in the EHR
     */
    async selectPatient(patientName: string) {
        await this.page.getByRole('button', { name: 'Select a Patient' }).click();
        const searchField = await this.page.getByLabel('Search');
        await searchField.fill(patientName);
        await this.page.getByRole('option', { name: patientName }).click();

        // Verify patient selection - check first name
        await expect(this.page.getByText(`Full Name: ${patientName.split(' ')[0]}`)).toBeVisible();
    }

    /**
     * Select a medication for the current patient
     */
    async selectMedication(medicationName: string) {
        await this.page.getByRole('button', { name: 'Request New Medication' }).click();
        await this.page.getByRole('rowheader', { name: new RegExp(medicationName, 'i') }).click();

        // Verify medication selection
        await expect(this.page.getByText(`Display: ${medicationName}`)).toBeVisible();
    }

    /**
     * Send the prescription to the pharmacy
     */
    async sendPrescriptionToPharmacy() {
        await this.page.getByRole('button', { name: 'Send Rx to Pharmacy' }).click();
        await this.page.getByText('Success! NewRx Received By').click();
    }

    /**
     * Sign the medication order
     */
    async signOrder() {
        await this.page.getByRole("button", { name: "Sign Order" }).click();
    }

    /**
     * Verify CDS cards are displayed correctly
     */
    async verifyCDSCards(medication: string) {
        await expect(this.page.getByText("No Cards")).not.toBeVisible({ timeout: 500 });

        const patientRequirementsCard = this.page.locator(".MuiCardContent-root", {
            hasText: `${medication} REMS Patient Requirements`,
        });

        const prescriberRequirementsCard = this.page.locator(".MuiCardContent-root", {
            hasText: `${medication} REMS Prescriber Requirements`,
        });

        await expect(patientRequirementsCard).toBeInViewport();
        await expect(prescriberRequirementsCard).toBeVisible();

        return { patientRequirementsCard, prescriberRequirementsCard };
    }

    /**
     * Launch SMART on FHIR app from a button
     */
    async launchSmartOnFhirApp(buttonText: string = "Patient Enrollment Form") {
        const smartOnFHIRPagePromise = this.page.waitForEvent("popup");
        await this.page.getByRole("button", { name: new RegExp(buttonText, "i") }).click();
        const smartPage = await smartOnFHIRPagePromise;
        await smartPage.waitForLoadState("networkidle");
        return smartPage;
    }

    /**
 * Check medication status
 * Returns the status text
 */
    async checkMedicationStatus() {
        await this.page.reload();
        await this.page.waitForLoadState("networkidle");

        await this.page.getByRole("button", { name: /MEDICATION:/i }).click();
        await this.page.waitForTimeout(3000); // Small buffer
        await this.page.waitForLoadState("networkidle");

        const pharmacyPopup = this.page.locator(".MuiBox-root", { hasText: "Medication Status" });
        await expect(pharmacyPopup.getByRole("heading", { name: "Medication Status" })).toBeVisible();

        // Get status text
        const statusText = await pharmacyPopup.getByText(/Status:/i).textContent() || '';

        // Dismiss popup
        await pharmacyPopup.press("Escape");

        return statusText;
    }

    /**
     * Verify that a specific ETASU requirement appears in the list
     */
    async verifyEtasuRequirement(requirementName: string) {
        await this.page.getByRole("button", { name: /ETASU:/i }).click();
        await this.page.waitForLoadState("networkidle");
        await expect(this.page.getByRole('list')).toContainText(requirementName);

        // Dismiss popup
        await this.page.locator(".MuiBox-root", { hasText: "REMS Status" }).press("Escape");
    }

    /**
     * Add forms as tasks to the task list
     */
    async addTaskToList(formName: string) {
        // Try to find and click all available "Add to task list" buttons
        await this.page.getByRole('button', {
            name: `Add "Completion of ${formName}" to task list`
        }).click();
    }

    /**
     * Navigate to the tasks view
     */
    async goToTasks() {
        await this.page.locator('div:nth-child(2) > .MuiButtonBase-root').first().click();
        await this.refreshTasks();
    }

    async refreshTasks() {
        await this.page.getByRole('button', { name: 'Refresh' }).click();
        await this.page.waitForLoadState("networkidle");
    }

    /**
     * Switch to a specific task tab
     */
    async switchToTaskTab(tabName: string) {
        await this.page.getByRole('tab', { name: new RegExp(tabName, 'i') }).click();
    }

    /**
     * Assign a task to a user
     */
    async assignTask(taskDescription: string, assignTo: string) {
        // Find the task card by its description
        const taskCard = this.getTaskCardByDescription(taskDescription);

        // Click the assign button and select the target
        await taskCard.locator('button:has-text("Assign")').first().click();
        await this.page.getByRole('menuitem', { name: assignTo }).click();
    }

    /**
     * Launch a form from a task
     */
    async launchTaskForm(taskDescription: string) {
        const smartOnFHIRPagePromise = this.page.waitForEvent("popup");

        const taskCard = this.getTaskCardByDescription(taskDescription);
        await taskCard.locator('button:has-text("Launch")').first().click();

        const smartPage = await smartOnFHIRPagePromise;
        await smartPage.waitForLoadState("networkidle");
        return smartPage;
    }

    /**
     * Update the status of the current task
     */
    async updateTaskStatus(status: 'completed' | 'in-progress' | 'ready') {
        await this.page.getByRole('button', { name: 'Status' }).click();
        await this.page.getByRole('menuitem', { name: status }).click();
    }

    /**
     * Delete the current task
     */
    async deleteTask() {
        await this.page.getByRole('button', { name: 'Delete' }).click();
        await this.page.getByRole('button', { name: 'Yes' }).click();
        this.refreshTasks();
    }
    /**
     * Verify a task is present in the nurse UI
     */
    async verifyTaskPresent(taskDescription: string, shouldBePresent = true) {
        const taskCard = this.getTaskCardByDescription(taskDescription).first();

        if (shouldBePresent) {
            await expect(taskCard).toBeVisible();
        } else {
            await expect(taskCard).toBeHidden();
        }
    }

    /**
     * Verify the status of a task
     */
    async verifyTaskStatus(taskDescription: string, status: string) {
        const taskCard = this.getTaskCardByDescription(taskDescription);

        // Find the header element inside the task card that contains the status
        const statusHeader = taskCard.locator('div[class*="taskTabHeader"]').last();
        await expect(statusHeader).toContainText(`STATUS: ${status}`);
    }

    /**
     * Helper to get a task card based on its description
     * This uses structure and content rather than specific class names
     */
    protected getTaskCardByDescription(taskDescription: string): Locator {
        // Find the text content first
        const textElement = this.page
            .getByText(`Complete ${taskDescription}`)
            .first();

        // Then navigate up to the card container (usually 2 levels up)
        // This is more reliable than using class names
        return textElement.locator('xpath=./ancestor::div[contains(@class, "MuiGrid-container")][1]');
    }
}