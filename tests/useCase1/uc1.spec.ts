/**

# Test Plan: Demo Workflow

User: The test is acting as the Prescriber role.


 */

import { expect, test } from "@playwright/test";
import { testUtilFillOutForm } from "../util/fillOutForm";
import { testUtilKeycloakLogin } from "../util/keycloakLogin";

/* Ideally these would be sourced from the testing environment, but constants are fine too. */
const patientName = "John Snow";
const medication = "Turalio";

// test.slow();

test("UC1: content appears in SMART on FHIR, fill out patient enroll form", async ({ context, page }) => {
  // 1. Go to the EHR UI at <http://localhost:3000>
  await page.goto("localhost:3000");
  await page.waitForLoadState("networkidle");

  // 1a. Sign in 
  await page.getByRole('button', { name: /Launch/ }).click();
  await testUtilKeycloakLogin({ page: page });

  // 1c1. Expect blank state.
  await expect(page).toHaveTitle(/EHR/);
  await expect(page.getByText("Select A Patient")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send RX to PIMS" })).not.toBeVisible();

  // 1b. Clear any lingering state in the database.
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Reset PIMS Database' }).click();
  await page.getByRole('button', { name: 'Clear In-Progress Forms' }).click();
  await page.getByRole('button', { name: 'Reset REMS-Admin Database' }).click();
  await page.getByRole('button', { name: 'Clear EHR MedicationDispenses' }).click();
  await page.getByRole('button', { name: 'Reconnect EHR' }).click();


  // 2. Click **Patient Select** button in upper left.
  await page.getByRole('button', { name: 'Select a Patient' }).click();
  const searchField = await page.getByLabel('Search');
  await searchField.fill(patientName);
  await page.getByRole('option', { name: patientName }).click();

  // 3. Find **John Snow** in the list of patients and click the first dropdown menu next to his name.
  await expect(page.getByText("ID").first()).toBeVisible();
  await page.getByRole('button', { name: 'Request New Medication' }).click();


  // 4. Select **2183126 (MedicationRequest) Turalio 200 MG Oral Capsule** in the dropdown menu.
  await page.getByRole('rowheader', { name: 'Turalio 200 MG Oral Capsule' }).click();


  // 5c. Expect the search dialog to have closed.
  await expect(page.getByText("Bobby Tables")).not.toBeVisible();

  // 5c2. Check that patient got selected
  await expect(page.getByText(`Name: ${patientName}`)).toBeVisible();

  // 5c3. Check that medication got selected
  const medicationRE = new RegExp(`MedicationRequest.*${medication}`, "i");
  await expect(page.getByText(medicationRE)).toBeVisible();

  // 6. Click **Send Rx to PIMS** at the bottom of the page to send a prescription to the Pharmacist.
  await page.getByRole('button', { name: 'Send Rx to Pharmacy' }).click();

  // TODO: Expect feedback! but GUI doesn't show any yet.

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

  // BEFORE the click, set up promise to listen for new tab being opened. see <https://playwright.dev/docs/pages#handling-new-pages>
  const smartOnFHIRPagePromise = page.waitForEvent("popup");

  // 9. Select **Patient Enrollment Form** on the returned CDS card with summary **Drug Has REMS: Documentation Required**.
  await page.getByRole("button", { name: /Patient Enrollment Form/i }).click();

  // Actually wait for the new page, and use it for the next part of the test.
  const smartPage = await smartOnFHIRPagePromise;


  // 10. If you are asked for login credentials, use **alice** for username and **alice** for password
  // NOTE: You cannot have a conditional in a test, so this is written to always require login.
  // await testUtilKeycloakLogin({ page: smartPage });

  // 11. A webpage should open in a new tab, and after a few seconds, a questionnaire should appear.
  await smartPage.waitForLoadState("networkidle");
  await expect(smartPage).toHaveTitle("REMS SMART on FHIR app");

  /*
    // This is somehow passing right now?
    // 12c1: Error if form not completely filled out.
    await submitButton.click();
    await expect(smartPage.getByText(/Error: Partially completed form/)).toBeVisible();
    // 12c1.2: dismiss error dialog to continue
    await smartPage.getByRole("button", { name: "OK" }).click();
  */

  //////////// 12. Fill out the questionnaire and hit **Submit REMS Bundle**. ////////////////
  expect(smartPage.getByText("Patient Enrollment")).toBeVisible();
  const peSubmitButton = smartPage.getByRole("button", { name: "Submit REMS Bundle" });
  const firstField = smartPage.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker NPI *' }).getByLabel('Signature *');
  await firstField.fill('Jane Doe');

  const field = smartPage.getByRole('row', { name: 'Signature * Name (Printed) * Date * Show date picker', exact: true }).getByLabel('Signature *');
  await field.fill('John Doe');

  await smartPage.getByText('Form Loaded:').click();
  await testUtilFillOutForm({ page: smartPage, submitButton: peSubmitButton });

  /*
    - 12a. Alternatively fill out only some of the questionnaire for an asynchronous workflow and hit **Save to EHR**.
    - 12b. Visit the Patient Portal at <http://localhost:3000/patient-portal> and lay the role of the patient.
    - 12c. Login to the Patient Portal, use **JohnSnow** for the username and **john** for the password.
    - 12d. Select the saved Questionnaire and fill out the rest of the questionnaire as well as the patient signature in
      the questionnaire and hit **Save to EHR** again.
    - 12e. Go back to the EHR UI at <http://localhost:3000> and select the latest saved questionnaire from the second
      dropdown next to John Snow's name and continue in the role of the prescriber.
    - 12f. Click **Relaunch DTR** and fill out the remainder of the questionnaire, including the prescriber signature,
      then click **Submit REMS Bundle**. */

  /* 13. A new UI will appear with REMS Admin Status and Medication Status. */ 
  // Bug: this page does not show etasu status anymore
  // await expect(smartPage.getByRole("heading", { name: "REMS Admin Status" })).toBeVisible();
  // await expect(smartPage.getByRole("heading", { name: "Medication Status" })).toBeVisible();

  // // hit rems admin status button here to see etasu status
  // await smartPage.getByRole("button", { name: /view etasu/i }).click();
  // await expect(smartPage.getByText("Prescriber").first()).toBeVisible();

  /* 14. Go to <http://localhost:5050> in a new tab, and play the role of a pharmacist. */
  const pharmacyPage = await context.newPage(); // Create new page in Playwright's browser
  await pharmacyPage.goto("http://localhost:5050/");
  await pharmacyPage.waitForLoadState("networkidle");

  /* 14c1: Make sure pharmacy page loaded. */
  await expect(pharmacyPage.getByRole("heading", { name: "Pharmacy" })).toBeVisible();

  /* 14b. Log in again -- is this necessary?. */
  //await testUtilKeycloakLogin({ page: pharmacyPage });

  /* 15. Click **Doctor Orders** in the top hand navigation menu on the screen */
  await pharmacyPage.getByRole("button", { name: /doctor orders/i }).click();

  /* 16. See the Doctor Order that was sent to the pharmacist from the prescriber and use the **Verify ETASU** button to get
    a status update of the REMS requirements submitted */

  /* 16c1: Verify we are looking at New Orders */
  // TODO: can't figure out this step.
  // await expect(pharmacyPage.getByRole("button", { name: "New Orders" })).toHaveClass("MuiTab-textColorPrimary");

  /* Find the specific medication's card. */
  // TODO: Update code to make more testable and user-friendly
  const pharmacyMedCard = pharmacyPage.locator(".MuiPaper-root", { hasText: medication }).first();

  /* 16c2: Verify we are looking at New Orders */
  await expect(pharmacyMedCard).toBeVisible();

  /* 16c3: Verify medication order is Pending status. */
  /* TODO: This is a 'lazy' selector; Pending could match somewhere else. But the code as written doesn't
   * label the table columns, so the alternative is something fragile to changes in the order of cells. */
  await expect(pharmacyMedCard.getByText("Pending")).toBeVisible();

  /* 17. Go Back to the EHR UI at <http://localhost:3000> and play the role of the prescriber again, select patient John Snow
    from the patient select UI.*/

  // Back to CRD App on :3000
  await page.goto("http://localhost:3000/");
  await page.waitForLoadState("networkidle");
  await page.getByRole('button', { name: 'Launch', exact: true }).click();
  await page.getByRole('button', { name: 'Select a Patient' }).click();
  const searchField2 = await page.getByLabel('Search');
  await searchField2.fill(patientName);
  await page.getByRole('option', { name: patientName }).click();

  // Find **John Snow** in the list of patients and click the first dropdown menu next to his name.
  await expect(page.getByText("ID").first()).toBeVisible();
  await page.getByRole('button', { name: 'Request New Medication' }).click();


  // Select **2183126 (MedicationRequest) Turalio 200 MG Oral Capsule** in the dropdown menu.
  await page.getByRole('rowheader', { name: 'Turalio 200 MG Oral Capsule' }).click();


  //. Expect the search dialog to have closed.
  await expect(page.getByText("Bobby Tables")).not.toBeVisible();

  // . Check that patient got selected
  await expect(page.getByText(`Name: ${patientName}`)).toBeVisible();

  //  Check that medication got selected
  const medicationRE2 = new RegExp(`MedicationRequest.*${medication}`, "i");
  await expect(page.getByText(medicationRE)).toBeVisible();


  const smartOnFHIRPagePromise2 = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Launch SMART on FHIR App" }).click();
  const page3 = await smartOnFHIRPagePromise2;
  await page3.waitForLoadState("networkidle");

  /* 18. From the medications dropdown select **Turalio 200 MG Oral Capsule**, which should populate the screen with cards
    similar to those seen in step 7. */

  await page3.getByLabel("Select Medication Request").click();

  await page3.getByRole('option', { name: 'Turalio 200 MG Oral Capsule' }).click();
  /* 19aw. Wait for the network accesses to complete, otherwise we'll hit the popup before the status loads. */
  await page3.waitForLoadState("networkidle");

  /* 19a. Use the **Check ETASU** button to get status updates on the REMS request */
  await page3.getByRole("button", { name: /ETASU:/i }).click();

  await page3.waitForLoadState("networkidle");
  // TODO: fragile use of class selector
  const remsPopup = page3.locator(".MuiBox-root", { hasText: "REMS Status" });

  await expect(remsPopup.getByText("Patient Enrollment")).toBeVisible();

  /* 19.c1. Number of checks and x's should sum to four...not sure if I like this 'check'.
   * But it also demonstrates how to do custom error strings and computation-based testing.
   */
  const checksCount = remsPopup.getByTestId("CheckCircleIcon").count();
  const closeCount = remsPopup.getByTestId("CloseIcon").count();
  expect(
    (await checksCount) + (await closeCount),
    `REMS Status panel showed wrong number of total icons (${checksCount} checks, ${closeCount} closes)`
  ).toEqual(4);

  /** Dismiss the modal */
  await remsPopup.press("Escape");

  await expect(remsPopup).not.toBeVisible();

  /* 19b. Use the **Check Pharmacy** buttons to get status updates on the prescription  */

  await page3.getByRole("button", { name: /MEDICATION:/i }).click();
  await page3.waitForLoadState("networkidle");

  // TODO: fragile use of class selector
  const pharmacyPopup = page3.locator(".MuiBox-root", { hasText: "Medication Status" });

  await expect(pharmacyPopup.getByRole("heading", { name: "Medication Status" })).toBeVisible();
  // await expect(pharmacyPopup.getByText("Status: Not Started")).toBeVisible();

  /** Dismiss the modal */
  await pharmacyPopup.press("Escape");

  await expect(pharmacyPopup).not.toBeVisible();

  /* 20. Use the links for the **Prescriber Enrollment Form** and **Prescriber Knowledge Assessment** Questionnaires and
    repeat steps 9-12 to submit those ETASU requirements and see how the ETASU status changes in both the Pharmacist UI
    and Prescriber UI. */

  /** 20a: Fill out prescriber knowledge assessment. */
  
  await page3.getByRole('button', { name: 'Prescriber Knowledge Assessment Form' }).click();
  const pkaPage = page3;
  await page3.waitForLoadState("networkidle");

  const pkaSubmitButton = pkaPage.getByRole("button", { name: "Submit REMS Bundle" });
  await testUtilFillOutForm({ page: pkaPage, submitButton: pkaSubmitButton });

  /** 20b: Return to home to click button */
  await pkaPage.getByRole('tab', { name: 'Home' }).click();

  /** 20c: Fill out presscriber enrollment form */
  await page3.getByRole('button', { name: 'Prescriber Enrollment Form' }).click();
  const pefPage = page3;
  await pefPage.waitForLoadState("networkidle");
  // TODO: maybe conditionallyi check load state
  // await testUtilKeycloakLogin({ page: pefPage });

  const pefSubmitButton = pefPage.getByRole("button", { name: "Submit REMS Bundle" });
  const firstField3 = pefPage.getByLabel('Signature *');
  await firstField3.fill('Jane Doe');

  await pefPage.getByText('Form Loaded:').click();
  await testUtilFillOutForm({ page: pefPage, submitButton: pefSubmitButton });

  /* 21. Once all the REMS ETASU are met, go back to <http://localhost:5050> and play the role of the Pharmacist, using the
    **Verify Order** button to move the prescription over to the **Verified Orders** Tab. Click on the **Verified
    Orders** Tab and from there use the **Mark as Picked Up** button to move the prescription over to the **Picked Up
    Orders** Tab. */

    const pharmacyPage2 = await context.newPage(); // Create new page in Playwright's browser
    await pharmacyPage2.goto("http://localhost:5050/");
    await pharmacyPage2.waitForLoadState("networkidle");
  
    /* 21a: Make sure pharmacy page loaded. */
    await expect(pharmacyPage2.getByRole("heading", { name: "Pharmacy" })).toBeVisible();
  
    /* 21b. Log in again -- is this necessary?. */
    //await testUtilKeycloakLogin({ page: pharmacyPage });
  
    /* 21c. Click **Doctor Orders** in the top hand navigation menu on the screen */
    await pharmacyPage2.getByRole("button", { name: /doctor orders/i }).click();
    const pharmacyMedCard2 = pharmacyPage2.locator(".MuiPaper-root", { hasText: medication }).first();
  
    /* 21d: Verify we are looking at New Orders */
    await expect(pharmacyMedCard2).toBeVisible();
    await expect(pharmacyMedCard2.getByText("Pending")).toBeVisible();

    /* 21e: View etasu, ensure its been met and hit verify order */
    await pharmacyPage2.getByRole('button', { name: 'VIEW ETASU' }).click();
    await expect(pharmacyPage2.getByText('✅').first()).toBeVisible();
    const numChecks = await pharmacyPage2.getByText('✅').count();
    expect(
      (numChecks),
      `REMS Status panel showed wrong number of green check icons (${numChecks} checks)`
    ).toEqual(4);
    
    await pharmacyPage2.getByRole('button', { name: 'Close' }).click();

    await pharmacyPage2.getByRole('button', { name: 'VERIFY ORDER' }).click();

    await expect(pharmacyMedCard2).not.toBeVisible();

    /* 21f: Go to verify order tab */
    await pharmacyPage2.getByRole('tab', { name: 'Verified Orders' }).click();
    await expect(pharmacyMedCard2).toBeVisible();

    await expect(pharmacyMedCard2.getByText("Approved")).toBeVisible();
    await pharmacyPage2.getByRole('button', { name: 'Mark as Picked Up' }).click();
    await expect(pharmacyMedCard2).not.toBeVisible();


    /* 21g: Go to mark as pickedup */
    await pharmacyPage2.getByRole('tab', { name: 'Picked Up Orders' }).click();
    await expect(pharmacyMedCard2).toBeVisible();

    await expect(pharmacyMedCard2.getByText("Picked Up")).toBeVisible();
  
  /* 22. Go back to the SMART on FHIR App launched in step 17 and play the role of the prescriber using the **Check
    Pharmacy** button to see the status change of the prescription. */
    // Return to home page and check Medication Status
    await page3.getByRole('tab', { name: 'Home' }).click();

    await page3.getByRole("button", { name: /MEDICATION:/i }).click();
    await page3.waitForLoadState("networkidle");

    const popup = page3.locator(".MuiBox-root", { hasText: "Medication Status" });

    await expect(popup.getByRole("heading", { name: "Medication Status" })).toBeVisible();
    // await expect(popup.getByText("Status: Picked Up")).toBeVisible();

    /** Dismiss the modal */
    await popup.press("Escape");

  /* 23. Lastly, repeat step 20 to open the **Patient Status Update Form** in the returned cards to submit follow
    up/monitoring requests on an as need basis. These forms can be submitted as many times as need be in the prototype
    and will show up as separate ETASU elements each time.*/

    await page3.getByRole('button', { name: 'Patient Status Update Form' }).click();
    const psfPage = page3;
    await psfPage.waitForLoadState("networkidle");
    // TODO: maybe conditionallyi check load state
    // await testUtilKeycloakLogin({ page: pefPage });
  
    const psfSubmitButton = psfPage.getByRole("button", { name: "Submit REMS Bundle" });
    const firstField4 = psfPage.getByLabel('Signature *');
    await firstField4.fill('Jane Doe');
  
    await psfPage.getByText('Form Loaded:').click();
    await testUtilFillOutForm({ page: pefPage, submitButton: pefSubmitButton });

    await page3.getByRole('tab', { name: /HOME/i }).click();


    // hit rems admin status button here to see etasu status
    await page3.getByRole("button", { name: /ETASU:/i }).click();
    await page3.waitForLoadState("networkidle");
    await expect(page3.getByRole('list')).toContainText('Patient Status Update');

});
