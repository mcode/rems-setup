
import { test as base, expect } from '@playwright/test';
import { EhrPage } from './ehr';
import { PharmacyPage } from './pharmacy';
import { SmartAppPage } from './smartApp';
import { PatientPortalPage } from './paitentPortal';
import { NurseEhrPage } from './nurseEhr';
import { TEST_USERS, TEST_PATIENTS } from './configs';

// Define the fixture types
type WorkflowFixtures = {
  ehrPage: EhrPage;
  pharmacyPage: PharmacyPage;
  nurseEhrPage: NurseEhrPage;
  patientPortalPage: PatientPortalPage;
  setupEnvironment: void;
};

/**
 * Create properly typed test fixture extension
 */
export const test = base.extend<WorkflowFixtures>({
  /**
   * Sets up an EhrPage object for the test
   */
  ehrPage: async ({ page }, use) => {
    const ehrPage = new EhrPage(page);
    await use(ehrPage);
  },

  /**
   * Creates a pharmacy page in a new tab
   */
  pharmacyPage: async ({ context }, use) => {
    const pharmacyPage = await context.newPage();
    const pharmacy = new PharmacyPage(pharmacyPage);
    await use(pharmacy);
  },

  /**
   * Sets up a nurse context with logged-in EHR using NurseEhrPage
   */
  nurseEhrPage: async ({ browser }, use) => {
    // Create new context and page for nurse
    const nurseContext = await browser.newContext();
    const nursePage = await nurseContext.newPage();

    // Create NurseEhrPage instead of EhrPage
    const nurseEhr = new NurseEhrPage(nursePage);

    await use(nurseEhr);

    // Clean up
    await nurseContext.close();
  },

  /**
   * Sets up a patient portal with login
   */
  patientPortalPage: async ({ browser }, use) => {
    // Create new context and page for patient
    const patientContext = await browser.newContext();
    const patientPageObj = await patientContext.newPage();

    // Create and set up patient portal
    const patientPortal = new PatientPortalPage(patientPageObj);

    await use(patientPortal);

    // Clean up
    await patientContext.close();
  }
});

