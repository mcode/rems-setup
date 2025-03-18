/**

# Test Plan: Demo Workflow

User: The test is acting as the Prescriber role.


 */

import { expect, test } from "@playwright/test";
import { testUtilFillOutForm } from "../util/fillOutForm";
import { testUtilKeycloakLogin } from "../util/keycloakLogin";

/* Ideally these would be sourced from the testing environment, but constants are fine too. */
const patientName = "Jon Snow";
const medication = "TIRF";

// test.slow();

test("UC2: Task Workflow Happy Path", async ({ context, page }) => {
  // 1. Go to the EHR UI at <http://localhost:3000>
  await page.goto("localhost:3000");
  await page.waitForLoadState("networkidle");

  // 1a. Sign in 
  await page.getByRole('button', { name: /Launch/ }).click();
  await testUtilKeycloakLogin({ page: page, username: "janedoe", password: "jane" });

  // 1c1. Expect blank state.
  await expect(page).toHaveTitle(/EHR/);
  await expect(page.getByText("Select A Patient")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send RX to PIMS" })).not.toBeVisible();

  // 1b. Clear any lingering state in the database.
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Reset PIMS Database' }).click();
  await page.getByRole('button', { name: 'Clear EHR In-Progress Forms' }).click();
  await page.getByRole('button', { name: 'Reset REMS-Admin Database' }).click();
  await page.getByRole('button', { name: 'Clear EHR Dispense Statuses' }).click();
  await page.getByRole('button', { name: 'Clear EHR Tasks' }).click();
  await page.getByRole('button', { name: 'Reconnect EHR' }).click();


  // 2. Click **Patient Select** button in upper left.
  await page.getByRole('button', { name: 'Select a Patient' }).click();
  const searchField = await page.getByLabel('Search');
  await searchField.fill(patientName);
  await page.getByRole('option', { name: patientName }).click();

  // 3. Find **Jon Snow** in the list of patients and click the first dropdown menu next to his name.
  await expect(page.getByText("ID").first()).toBeVisible();
  await page.getByRole('button', { name: 'Request New Medication' }).click();


  // 4. Select **TIRF 200 UG Oral Transmucosal Lozenge	1237051** in the dropdown menu.
  await page.getByRole('rowheader', { name: 'TIRF 200 UG Oral Transmucosal' }).click();


  // 5c. Expect the search dialog to have closed.
  await expect(page.getByText("Bobby Tables")).not.toBeVisible();

  // 5c2. Check that patient got selected
  await expect(page.getByText(`Name: ${patientName}`)).toBeVisible();

  // 5c3. Check that medication got selected
  const medicationRE = new RegExp(`MedicationRequest.*${medication}`, "i");
  await expect(page.getByText(medicationRE)).toBeVisible();

  // 6. Click **Send Rx to PIMS** at the bottom of the page to send a prescription to the Pharmacist.
  await page.getByRole('button', { name: 'Send Rx to Pharmacy' }).click();

  await page.getByText('Success! NewRx Received By').click();

  // 7. Click **Submit to REMS-Admin** at the bottom of the page, which demonstrates the case where an EHR has CDS Hooks
  //    implemented natively.
  await page.getByRole("button", { name: "Sign Order" }).click();

  // 8. After several seconds you should receive a response in the form of two **CDS cards**:
  // ??? what is the right timeout here?
  // TODO: Can we make this slightly more specific in a way that's meaningful / visible to the user?
  //       e.g. `page.getByRole("warning", { name: "No Cards" })...`
  await expect(page.getByText("No Cards")).not.toBeVisible({ timeout: 5000 });

  // TODO: These are fragile selectors--fix the GUI to be more testable / user friendly (e.g. by adding title to a card)
  const patientRequirementsCard = page.locator(".MuiCardContent-root", {
    hasText: `${medication} REMS Patient Requirements`,
  });

  const prescriberRequirementsCard = page.locator(".MuiCardContent-root", {
    hasText: `${medication} REMS Prescriber Requirements`,
  });

  await expect(patientRequirementsCard).toBeInViewport();
  await expect(prescriberRequirementsCard).toBeVisible();



  // 9. Add each form as a task to complete later

  await page.getByRole('button', { name: 'Add "Completion of Patient' }).click();
  await page.getByRole('button', { name: 'Add "Completion of Prescriber Enrollment Questionnaire" to task list' }).click();
  await page.getByRole('button', { name: 'Add "Completion of Prescriber Knowledge Assessment Questionnaire" to task list' }).click();

  // go to tasks
  await page.locator('div:nth-child(2) > .MuiButtonBase-root').first().click();
  await page.getByRole('button', { name: 'Refresh' }).click();

  await page.getByRole('tab', { name: 'UNASSIGNED TASKS (3)' }).click();

  await expect(page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Knowledge Assessment Questionnaire")').first()).toBeVisible()
  await expect(page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Patient Enrollment Questionnaire")').first()).toBeVisible()
  await expect(page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Enrollment Questionnaire")').first()).toBeVisible()


  // ToDO: Enable Assigning from prescriber to Nurse - corresponds to line 226

  // assign patient enrollment form to nurse
  // await page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Patient Enrollment Questionnaire")')
  // .locator('..')// Move up a level to the main container of the card
  // .locator('button:has-text("Assign")').first().click();
  // await page.getByRole('menuitem', { name: 'Assign to nurse (Alice Nurse)' }).click();

   // assign prescriber enrollment form to nurse
  // await page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Enrollment Questionnaire")')
  // .locator('..')// Move up a level to the main container of the card
  // .locator('button:has-text("Assign")').first().click();

  // await page.getByRole('menuitem', { name: 'Assign to nurse (Alice Nurse)' }).click();


  // assign prescriber knowledge assessment
  await page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Knowledge Assessment Questionnaire")')
  .locator('..')// Move up a level to the main container of the card
  .locator('button:has-text("Assign")').first().click();
  await page.getByRole('menuitem', { name: 'Assign to me (Jane Doe)' }).click();

  // go to my tasks 
  await page.getByRole('tab', { name: 'MY TASKS' }).click();
  
  await expect(page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Knowledge Assessment Questionnaire")').first()).toBeVisible()
  
  await expect(page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Knowledge Assessment Questionnaire")')
  .locator('..')// Move up a level to the main container of the card
  .locator('div.RequestDashboard-taskTabHeader-18').last()).toContainText('STATUS: READY');

  // BEFORE the click, set up promise to listen for new tab being opened. see <https://playwright.dev/docs/pages#handling-new-pages>
  const knowledgeAssessmentSmartOnFHIRPagePromise = page.waitForEvent("popup");

  await page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Knowledge")')
  .locator('..')// Move up a level to the main container of the card
  .locator('button:has-text("Launch")').first().click();

  // Actually wait for the new page, and use it for the next part of the test.
  const knowledgeAssessmentSmartPage = await knowledgeAssessmentSmartOnFHIRPagePromise;


//   // 10. If you are asked for login credentials, use **alice** for username and **alice** for password
//   // NOTE: You cannot have a conditional in a test, so this is written to always require login.
//   // await testUtilKeycloakLogin({ page: smartPage });

//   // 11. A webpage should open in a new tab, and after a few seconds, a questionnaire should appear.
  await knowledgeAssessmentSmartPage.waitForLoadState("networkidle");
  await expect(knowledgeAssessmentSmartPage).toHaveTitle("REMS SMART on FHIR app");

  // 12c1: Error if form not completely filled out.
  await expect(knowledgeAssessmentSmartPage.getByRole('button', { name: '*You must include a value for' })).toBeVisible();
  await knowledgeAssessmentSmartPage.getByRole('button', { name: '*You must include a value for' }).click();
  await expect(knowledgeAssessmentSmartPage.getByRole('button', { name: 'Submit REMS Bundle' })).toBeDisabled();

  // 12c1.2: dismiss error dialog to continue
  // await nurseSmartPage.getByRole("button", { name: "OK" }).click();

  //////////// 12. Fill out the questionnaire and hit **Submit REMS Bundle**. ////////////////
    // expect(smartPage.getByText("Patient Enrollment")).toBeVisible();
    const knowledgeAssessmentSubmitButton = knowledgeAssessmentSmartPage.getByRole("button", { name: "Submit REMS Bundle" });

    const firstField = knowledgeAssessmentSmartPage.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker NPI *' }).getByLabel('Signature *');
    await firstField.fill('Jane Doe');

    await knowledgeAssessmentSmartPage.getByText('Form Loaded:').click();
    await testUtilFillOutForm({ page: knowledgeAssessmentSmartPage, submitButton: knowledgeAssessmentSubmitButton });

    await expect(page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Knowledge Assessment Questionnaire")').first()).toBeVisible()
  
    await expect(page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Knowledge Assessment Questionnaire")')
    .locator('..')// Move up a level to the main container of the card
    .locator('div.RequestDashboard-taskTabHeader-18').last()).toContainText('STATUS: IN-PROGRESS');

    await page.getByRole('button', { name: 'Status' }).click();
    await page.getByRole('menuitem', { name: 'completed' }).click();

    await expect(page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Knowledge Assessment Questionnaire")')
    .locator('..')// Move up a level to the main container of the card
    .locator('div.RequestDashboard-taskTabHeader-18').last()).toContainText('STATUS: COMPLETED');

    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('button', { name: 'Refresh' }).click();

    await expect(page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Knowledge Assessment Questionnaire")')
    .locator('..')// Move up a level to the main container of the card
    .locator('#simple-tabpanel-0').getByText('Complete Prescriber Knowledge')).toBeHidden();


  // nurse context
  const nurseContext = await context.browser()!.newContext();
  const nursePage = await nurseContext.newPage(); // Create new page in Playwright's browser
  await nursePage.goto('http://localhost:3000/');
  await nursePage.waitForLoadState("networkidle");

  await nursePage.getByRole('button', { name: /Launch/ }).click();
  await testUtilKeycloakLogin({ page: nursePage, username: "alice", password: "alice" });

  // 1c1. Expect blank state.
  await expect(page).toHaveTitle(/EHR/);

  await nursePage.getByRole('button', { name: 'Select a patient All Patients' }).click();
  await nursePage.getByLabel('Search').click();
  await nursePage.getByRole('combobox', { name: 'Search' }).fill('jon snow');
  await nursePage.getByRole('button', { name: 'Select Patient' }).click();
  await nursePage.getByRole('button', { name: 'Refresh' }).click();
  await nursePage.getByRole('tab', { name: 'UNASSIGNED TASKS' }).click();

  // ToDO: Remove once prescriber can assign to nurse - corresponds to line 111

  // assign patient enrollment form to nurse
  await nursePage.locator('div.RequestDashboard-taskTabDescription-22:has-text("Complete Patient Enrollment Questionnaire")')
  .locator('..')// Move up a level to the main container of the card
  .locator('button:has-text("Assign")').first().click();
  await nursePage.getByRole('menuitem', { name: 'Assign to me (Alice Nurse)' }).click();

   // assign prescriber enrollment form to nurse
  await nursePage.locator('div.RequestDashboard-taskTabDescription-22:has-text("Complete Prescriber Enrollment Questionnaire")')
  .locator('..')// Move up a level to the main container of the card
  .locator('button:has-text("Assign")').first().click();

  await nursePage.getByRole('menuitem', { name: 'Assign to me (Alice Nurse)' }).click();

  await nursePage.getByRole('tab', { name: 'MY TASKS' }).click();

  // BEFORE the click, set up promise to listen for new tab being opened. see <https://playwright.dev/docs/pages#handling-new-pages>
  const nurseSmartOnFHIRPagePrescriberEnrollmentPromise = nursePage.waitForEvent("popup");

  await nursePage.locator('div.RequestDashboard-taskTabDescription-22:has-text("Complete Prescriber Enrollment Questionnaire")')
  .locator('..')// Move up a level to the main container of the card
  .locator('button:has-text("Launch")').first().click();

  // Actually wait for the new page, and use it for the next part of the test.
  const nurseSmartPagePrescriberEnrollment = await nurseSmartOnFHIRPagePrescriberEnrollmentPromise;


//   // 10. If you are asked for login credentials, use **alice** for username and **alice** for password
//   // NOTE: You cannot have a conditional in a test, so this is written to always require login.
//   // await testUtilKeycloakLogin({ page: smartPage });

//   // 11. A webpage should open in a new tab, and after a few seconds, a questionnaire should appear.
  await nurseSmartPagePrescriberEnrollment.waitForLoadState("networkidle");
  await expect(nurseSmartPagePrescriberEnrollment).toHaveTitle("REMS SMART on FHIR app");

  // 12c1: Error if form not completely filled out.
  await expect(nurseSmartPagePrescriberEnrollment.getByRole('button', { name: '*You must include a value for' })).toBeVisible();
  await nurseSmartPagePrescriberEnrollment.getByRole('button', { name: '*You must include a value for' }).click();
  await expect(nurseSmartPagePrescriberEnrollment.getByText('Signature', { exact: true })).toBeVisible();
  await expect(nurseSmartPagePrescriberEnrollment.getByRole('button', { name: 'Submit REMS Bundle' })).toBeDisabled();

  // 12c1.2: dismiss error dialog to continue
  // await nurseSmartPage.getByRole("button", { name: "OK" }).click();

  //////////// 12. Fill out the questionnaire and hit **Submit REMS Bundle**. ////////////////
    // expect(smartPage.getByText("Patient Enrollment")).toBeVisible();
    const nurseSaveButton = nurseSmartPagePrescriberEnrollment.getByRole("button", { name: "Save to EHR" });

    // const firstField = smartPage.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker NPI *' }).getByLabel('Signature *');
    // await firstField.fill('Jane Doe');

    // const field = smartPage.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker', exact: true }).getByLabel('Signature *');
    // await field.fill('John Doe');

    // await smartPage.getByText('Form Loaded:').click();
    await testUtilFillOutForm({ page: nurseSmartPagePrescriberEnrollment, submitButton: nurseSaveButton });
    await nurseSmartPagePrescriberEnrollment.getByRole('button', { name: 'OK' }).click();

    // return to back office page

    // await expect(page.locator('#simple-tabpanel-0').getByText('Complete Prescriber Enrollment')).toBeVisible()
   
    // await page.getByRole('button', { name: 'Status' }).click();
    // await page.getByRole('menuitem', { name: 'ready' }).click();

    await nursePage.locator('div.RequestDashboard-taskTabDescription-22:has-text("Complete Prescriber Enrollment Questionnaire")')
    .locator('..')// Move up a level to the main container of the card
    .locator('button:has-text("Assign")').first().click();
    await nursePage.getByRole('menuitem', { name: 'Assign to requester (Jane' }).click();

    await expect(page.locator('#simple-tabpanel-0').getByText('Complete Prescriber Enrollment')).toBeHidden()

    // practitioner enrollment form 
    await page.getByRole('button', { name: 'Refresh' }).click();

    await expect(page.locator('#simple-tabpanel-0').getByText('Complete Prescriber Enrollment')).toBeVisible()


    // BEFORE the click, set up promise to listen for new tab being opened. see <https://playwright.dev/docs/pages#handling-new-pages>
  const prescriberEnrollmentSmartOnFHIRPagePromise = page.waitForEvent("popup");

  await page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Prescriber Enrollment")')
  .locator('..')// Move up a level to the main container of the card
  .locator('button:has-text("Launch")').first().click();

  // Actually wait for the new page, and use it for the next part of the test.
  const prescriberEnrollmentSmartPage = await prescriberEnrollmentSmartOnFHIRPagePromise;


//   // 10. If you are asked for login credentials, use **alice** for username and **alice** for password
//   // NOTE: You cannot have a conditional in a test, so this is written to always require login.
//   // await testUtilKeycloakLogin({ page: smartPage });

//   // 11. A webpage should open in a new tab, and after a few seconds, a questionnaire should appear.
  await prescriberEnrollmentSmartPage.waitForLoadState("networkidle");
  await expect(prescriberEnrollmentSmartPage).toHaveTitle("REMS SMART on FHIR app");

  // load the most recent in progress form 
  await prescriberEnrollmentSmartPage.waitForSelector('div[role="dialog"]');
  await prescriberEnrollmentSmartPage.locator('div[role="dialog"] .MuiButtonBase-root').nth(-2).click()
  
  // 12c1: Error if form not completely filled out.
  await expect(prescriberEnrollmentSmartPage.getByRole('button', { name: '*You must include a value for' })).toBeVisible();
  await prescriberEnrollmentSmartPage.getByRole('button', { name: '*You must include a value for' }).click();
  await expect(prescriberEnrollmentSmartPage.getByRole('button', { name: 'Submit REMS Bundle' })).toBeDisabled();

  // 12c1.2: dismiss error dialog to continue
  // await nurseSmartPage.getByRole("button", { name: "OK" }).click();

  //////////// 12. Fill out the questionnaire and hit **Submit REMS Bundle**. ////////////////
    // expect(smartPage.getByText("Patient Enrollment")).toBeVisible();
    const prescriberEnrollmentSubmitButton = prescriberEnrollmentSmartPage.getByRole("button", { name: "Submit REMS Bundle" });

    const peSignatureField = prescriberEnrollmentSmartPage.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker NPI *' }).getByLabel('Signature *');
    await peSignatureField.fill('Jane Doe');

    await prescriberEnrollmentSmartPage.getByText('Form Loaded:').click();
    await testUtilFillOutForm({ page: prescriberEnrollmentSmartPage, submitButton: prescriberEnrollmentSubmitButton });

    await expect(page.locator('#simple-tabpanel-0').getByText('Complete Prescriber Enrollment')).toBeVisible()
    await page.getByRole('button', { name: 'Status' }).click();
    await page.getByRole('menuitem', { name: 'completed' }).click();

    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('button', { name: 'Refresh' }).click();

    await expect(page.locator('#simple-tabpanel-0').getByText('Complete Prescriber Enrollment')).toBeHidden()

    const nurseSmartOnFHIRPagePatientEnrollmentPromise = nursePage.waitForEvent("popup");

    // back to nurse view for patient enrollment form 
    await nursePage.locator('div.RequestDashboard-taskTabDescription-22:has-text("Complete Patient Enrollment Questionnaire")')
    .locator('..')// Move up a level to the main container of the card
    .locator('button:has-text("Launch")').first().click();

    // Actually wait for the new page, and use it for the next part of the test.
    const nurseSmartPagePatientEnrollment = await nurseSmartOnFHIRPagePatientEnrollmentPromise;


  //   // 10. If you are asked for login credentials, use **alice** for username and **alice** for password
  //   // NOTE: You cannot have a conditional in a test, so this is written to always require login.
  //   // await testUtilKeycloakLogin({ page: smartPage });
  
  //   // 11. A webpage should open in a new tab, and after a few seconds, a questionnaire should appear.
    await nurseSmartPagePatientEnrollment.waitForLoadState("networkidle");
    await expect(nurseSmartPagePatientEnrollment).toHaveTitle("REMS SMART on FHIR app");
  
    // 12c1: Error if form not completely filled out.
    await expect(nurseSmartPagePatientEnrollment.getByRole('button', { name: '*You must include a value for' })).toBeVisible();
    await nurseSmartPagePatientEnrollment.getByRole('button', { name: '*You must include a value for' }).click();
    await expect(nurseSmartPagePatientEnrollment.getByText('Signature', { exact: true }).first()).toBeVisible();
    await expect(nurseSmartPagePatientEnrollment.getByRole('button', { name: 'Submit REMS Bundle' })).toBeDisabled();
  
    // 12c1.2: dismiss error dialog to continue
    // await nurseSmartPage.getByRole("button", { name: "OK" }).click();
  
    //////////// 12. Fill out the questionnaire and hit **Submit REMS Bundle**. ////////////////
      // expect(smartPage.getByText("Patient Enrollment")).toBeVisible();
      const nurseSavePatientButton = nurseSmartPagePatientEnrollment.getByRole("button", { name: "Save to EHR" });
  
      // const firstField = smartPage.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker NPI *' }).getByLabel('Signature *');
      // await firstField.fill('Jane Doe');
  
      // const field = smartPage.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker', exact: true }).getByLabel('Signature *');
      // await field.fill('John Doe');
  
      // await smartPage.getByText('Form Loaded:').click();
      await testUtilFillOutForm({ page: nurseSmartPagePatientEnrollment, submitButton: nurseSavePatientButton });
      await nurseSmartPagePatientEnrollment.getByRole('button', { name: 'OK' }).click();
  
      // return to back office page
  
      // await expect(page.locator('#simple-tabpanel-0').getByText('Complete Prescriber Enrollment')).toBeVisible()
     
      // await page.getByRole('button', { name: 'Status' }).click();
      // await page.getByRole('menuitem', { name: 'ready' }).click();
  
      await nursePage.locator('div.RequestDashboard-taskTabDescription-22:has-text("Complete Patient Enrollment Questionnaire")')
      .locator('..')// Move up a level to the main container of the card
      .locator('button:has-text("Assign")').first().click();
      await nursePage.getByRole('menuitem', { name: 'Assign to patient (Jon Stark Snow)' }).click();

      // patient context
      const patientContext = await context.browser()!.newContext();
      const patientPage = await patientContext.newPage(); // Create new page in Playwright's browser
      await patientPage.goto('http://localhost:3000/patient-portal');
      await patientPage.waitForLoadState("networkidle");

      await patientPage.getByLabel('Username').click();
      await patientPage.getByLabel('Username').fill('jonsnow');
      await patientPage.getByLabel('Password').click();
      await patientPage.getByLabel('Password').fill('jon');

      await patientPage.getByRole('button', { name: 'Log In' }).click();
  
      await patientPage.getByRole('button', { name: 'Tasks' }).click();

    
  
      //   // BEFORE the click, set up promise to listen for new tab being opened. see <https://playwright.dev/docs/pages#handling-new-pages>
      const patientEnrollmentSmartOnFHIRPagePromise = patientPage.waitForEvent("popup");
  

      // await patientPage.locator('div.RequestDashboard-taskTabDescription-125:has-text("Complete Patient Enrollment")')
      // .locator('..')// Move up a level to the main container of the card
      // .locator('button:has-text("Launch")').first().click();
      await patientPage.getByRole('button', { name: 'Launch' }).click();


      // Actually wait for the new page, and use it for the next part of the test.
      const smartPagePatientEnrollment = await patientEnrollmentSmartOnFHIRPagePromise;


    //   // 10. If you are asked for login credentials, use **alice** for username and **alice** for password
    //   // NOTE: You cannot have a conditional in a test, so this is written to always require login.
    
    //   // 11. A webpage should open in a new tab, and after a few seconds, a questionnaire should appear.
      await smartPagePatientEnrollment.waitForLoadState("networkidle");
      await testUtilKeycloakLogin({ page: smartPagePatientEnrollment, username: "jonsnow", password: "jon" });

      await expect(smartPagePatientEnrollment).toHaveTitle("REMS SMART on FHIR app");

      
      await smartPagePatientEnrollment.locator('div[role="dialog"] .MuiButtonBase-root').nth(-2).click()

      // 12c1: Error if form not completely filled out.
      await expect(smartPagePatientEnrollment.getByRole('button', { name: '*You must include a value for' })).toBeVisible();
      await smartPagePatientEnrollment.getByRole('button', { name: '*You must include a value for' }).click();
      await expect(smartPagePatientEnrollment.getByText('Signature', { exact: true }).first()).toBeVisible();
      await expect(smartPagePatientEnrollment.getByRole('button', { name: 'Submit REMS Bundle' })).toBeDisabled();
    
      // 12c1.2: dismiss error dialog to continue
      // await nurseSmartPage.getByRole("button", { name: "OK" }).click();
    
      //////////// 12. Fill out the questionnaire and hit **Submit REMS Bundle**. ////////////////
      // expect(smartPage.getByText("Patient Enrollment")).toBeVisible();
      const savePatientButton = smartPagePatientEnrollment.getByRole("button", { name: "Save to EHR" });
  
      // const firstField = smartPage.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker NPI *' }).getByLabel('Signature *');
      // await firstField.fill('Jane Doe');
  
      const field = smartPagePatientEnrollment.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker', exact: true }).getByLabel('Signature *');
      await field.fill('John Doe');
  
      // await smartPage.getByText('Form Loaded:').click();
      await testUtilFillOutForm({ page: smartPagePatientEnrollment, submitButton: savePatientButton });
      await smartPagePatientEnrollment.getByRole('button', { name: 'OK' }).click();

      // await patientPage.locator('div.RequestDashboard-taskTabDescription-125:has-text("Complete Patient Enrollment Questionnaire")')
      // .locator('..')// Move up a level to the main container of the card
      // .locator('button:has-text("Assign")').first().click();
      await patientPage.getByRole('button', { name: 'Assign' }).click();
      await patientPage.getByRole('menuitem', { name: 'Assign to requester (Jane' }).click();

      await expect(patientPage.locator('#simple-tabpanel-0').getByText('Complete Patient Enrollment')).toBeHidden()

      await expect(page.locator('#simple-tabpanel-0').getByText('Complete Patient Enrollment')).toBeHidden()

    // practitioner enrollment form 
    await page.getByRole('button', { name: 'Refresh' }).click();

    await expect(page.locator('#simple-tabpanel-0').getByText('Complete Patient Enrollment')).toBeVisible()


    // BEFORE the click, set up promise to listen for new tab being opened. see <https://playwright.dev/docs/pages#handling-new-pages>
  const prescriberPatientEnrollmentSmartOnFHIRPagePromise = page.waitForEvent("popup");

  await page.locator('div.RequestDashboard-taskTabDescription-19:has-text("Complete Patient Enrollment")')
  .locator('..')// Move up a level to the main container of the card
  .locator('button:has-text("Launch")').first().click();

  // Actually wait for the new page, and use it for the next part of the test.
  const prescriberPatientEnrollmentSmartPage = await prescriberPatientEnrollmentSmartOnFHIRPagePromise;


//   // 10. If you are asked for login credentials, use **alice** for username and **alice** for password
//   // NOTE: You cannot have a conditional in a test, so this is written to always require login.
//   // await testUtilKeycloakLogin({ page: smartPage });

//   // 11. A webpage should open in a new tab, and after a few seconds, a questionnaire should appear.
  await prescriberPatientEnrollmentSmartPage.waitForLoadState("networkidle");
  await expect(prescriberPatientEnrollmentSmartPage).toHaveTitle("REMS SMART on FHIR app");

  // load the most recent in progress form 
  await prescriberPatientEnrollmentSmartPage.waitForSelector('div[role="dialog"]');
  await prescriberPatientEnrollmentSmartPage.locator('div[role="dialog"] .MuiButtonBase-root').nth(-2).click()
  
  // 12c1: Error if form not completely filled out.
  await expect(prescriberPatientEnrollmentSmartPage.getByRole('button', { name: '*You must include a value for' })).toBeVisible();
  await prescriberPatientEnrollmentSmartPage.getByRole('button', { name: '*You must include a value for' }).click();
  await expect(prescriberPatientEnrollmentSmartPage.getByRole('button', { name: 'Submit REMS Bundle' })).toBeDisabled();

  // 12c1.2: dismiss error dialog to continue
  // await nurseSmartPage.getByRole("button", { name: "OK" }).click();

  //////////// 12. Fill out the questionnaire and hit **Submit REMS Bundle**. ////////////////
    // expect(smartPage.getByText("Patient Enrollment")).toBeVisible();
    const prescriberPatientEnrollmentSubmitButton = prescriberPatientEnrollmentSmartPage.getByRole("button", { name: "Submit REMS Bundle" });

    const pePatientSignatureField = prescriberPatientEnrollmentSmartPage.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker NPI *' }).getByLabel('Signature *');
    await pePatientSignatureField.fill('Jane Doe');

    await prescriberPatientEnrollmentSmartPage.getByText('Form Loaded:').click();
    await testUtilFillOutForm({ page: prescriberPatientEnrollmentSmartPage, submitButton: prescriberPatientEnrollmentSubmitButton });

    await expect(page.locator('#simple-tabpanel-0').getByText('Complete Patient Enrollment')).toBeVisible()
    await page.getByRole('button', { name: 'Status' }).click();
    await page.getByRole('menuitem', { name: 'completed' }).click();

    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('button', { name: 'Refresh' }).click();

    await expect(page.locator('#simple-tabpanel-0').getByText('Complete Patient Enrollment')).toBeHidden()

        const pharmacyPage = await context.newPage(); // Create new page in Playwright's browser
        await pharmacyPage.goto("http://localhost:5050/");
        await pharmacyPage.waitForLoadState("networkidle");
      
        /* 21a: Make sure pharmacy page loaded. */
        await expect(pharmacyPage.getByRole("heading", { name: "Pharmacy" })).toBeVisible();
      
        /* 21b. Log in again -- is this necessary?. */
        //await testUtilKeycloakLogin({ page: pharmacyPage });
      
        /* 21c. Click **Doctor Orders** in the top hand navigation menu on the screen */
        await pharmacyPage.getByRole("button", { name: /doctor orders/i }).click();
        const pharmacyMedCard = pharmacyPage.locator(".MuiPaper-root", { hasText: medication }).first();
      
        /* 21d: Verify we are looking at New Orders */
        await expect(pharmacyMedCard).toBeVisible();
        await expect(pharmacyMedCard.getByText("Pending")).toBeVisible();
    
        /* 21e: View etasu, ensure its been met and hit verify order */
        await pharmacyPage.getByRole('button', { name: 'VIEW ETASU' }).click();
        await expect(pharmacyPage.getByText('✅').first()).toBeVisible();
        const numChecks = await pharmacyPage.getByText('✅').count();
        expect(
          (numChecks),
          `REMS Status panel showed wrong number of green check icons (${numChecks} checks)`
        ).toEqual(5);
        
        await pharmacyPage.getByRole('button', { name: 'Close' }).click();
    
        await pharmacyPage.getByRole('button', { name: 'VERIFY ORDER' }).click();
    
        await expect(pharmacyMedCard).not.toBeVisible();
    
        /* 21f: Go to verify order tab */
        await pharmacyPage.getByRole('tab', { name: 'Verified Orders' }).click();
        await expect(pharmacyMedCard).toBeVisible();
    
        await expect(pharmacyMedCard.getByText("Approved")).toBeVisible();
        await pharmacyPage.getByRole('button', { name: 'Mark as Picked Up' }).click();
        await expect(pharmacyMedCard).not.toBeVisible();
    
    
        /* 21g: Go to mark as pickedup */
        await pharmacyPage.getByRole('tab', { name: 'Picked Up Orders' }).click();
        await expect(pharmacyMedCard).toBeVisible();
    
        await expect(pharmacyMedCard.getByText("Picked Up")).toBeVisible();
  
});