/**

# Test Plan: Demo Workflow

User: The test is acting as the Prescriber role.


 */

import { test, expect } from "@playwright/test";

const patientName = "Jon Snow";
const drugToAdd = "Turalio";

test("Demo workflow (all 23 steps)", async ({ page }) => {
  // 1. Go to the EHR UI at <http://localhlost:3000>
  await page.goto("/");

  // 1c1. Expect blank state.
  await expect(page).toHaveTitle(/EHR/);
  await expect(page.getByText("No Cards")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send RX to PIMS" })).toBeDisabled();

  // 2. Click **Patient Select** button in upper left.
  await page.getByRole("button", { name: /Patient Select/ }).click();

  // 3. Find **Jon Snow** in the list of patients and click the first dropdown menu next to his name.
  const patientBox = page.locator(".patient-selection-box", { hasText: patientName }); // FIXME: Fragile use of class selector
  await patientBox.getByLabel("Request:").locator("").click();

  // 4. Select **2183126 (MedicationRequest) Turalio 200 MG Oral Capsule** in the dropdown menu.
  await patientBox.getByText(drugToAdd).click();

  // 5. Dismiss the dialog by clicking anywhere in the row to select Jon Snow. FIXME
  await patientBox.click();

  // 5c1. Check that patient got selected
  await expect(page.getByText(`Name: ${patientName}`)).toBeVisible();

  // 5c2. Check that medication got selected
  const medicationRE = new RegExp(`MedicationRequest.*${drugToAdd}`, "i");
  await expect(page.getByText(medicationRE)).toBeVisible();

  // 6. Click **Send Rx to PIMS** at the bottom of the page to send a prescription to the Pharmacist.
  await page.getByRole("button", { name: "Send Rx to PIMS" }).click();

  // TODO: Expect feedback! but GUI doesn't show any yet.

  // 7. Click **Submit to REMS-Admin** at the bottom of the page, which demonstrates the case where an EHR has CDS Hooks
  //    implemented natively.
  await page.getByRole("button", { name: "Submit to REMS-Admin" }).click();

  // TODO: Expect feedback! but GUI doesn't show any yet.

  // 8. After several seconds you should receive a response in the form of two **CDS cards**:
  // ??? what is the right timeout here?
  await expect(page.getByText("No Cards")).not.toBeVisible({ timeout: 10000 });

  // 9. Select **Patient Enrollment Form** on the returned CDS card with summary **Drug Has REMS: Documentation Required**.

  // 10. If you are asked for login credentials, use **alice** for username and **alice** for password.
  // 11. A webpage should open in a new tab, and after a few seconds, a questionnaire should appear.
  /* 12. Fill out the questionnaire and hit **Submit REMS Bundle**.
    - 12a. Alternatively fill out only some of the questionnaire for an asynchronous workflow and hit **Save to EHR**.
    - 12b. Visit the Patient Portal at <http://localhost:3000/patient-portal> and lay the role of the patient.
    - 12c. Login to the Patient Portal, use **JonSnow** for the username and **jon** for the password.
    - 12d. Select the saved Questionnaire and fill out the rest of the questionnaire as well as the patient signature in
      the questionnaire and hit **Save to EHR** again.
    - 12e. Go back to the EHR UI at <http://localhost:3000> and select the latest saved questionnaire from the second
      dropdown next to Jon Snow's name and continue in the role of the prescriber.
    - 12f. Click **Relaunch DTR** and fill out the remainder of the questionnaire, including the prescriber signature,
      then click **Submit REMS Bundle**. */
  /* 13. A new UI will appear with REMS Admin Status and Pharmacy Status. */
  /* 14. Go to <http://localhost:5050> and play the role of a pharmacist. */
  /* 15. Click **Doctor Orders** in the top hand navigation menu on the screen */
  /* 16. See the Doctor Order that was sent to the pharmacist from the prescriber and use the **Verify ETASU** button to get
    a status update of the REMS requirements submitted */
  /* 17. Go Back to the EHR UI at <http://localhost:3000> and play the role of the prescriber again, select patient Jon Snow
    from the patient select UI and click **Launch SMART on FHIR App**, which will open the SMART on FHIR App in its own
    view and demonstrate the case where an EHR does not have CDS Hooks implemented natively. */
  /* 18. From the medications dropdown select **Turalio 200 MG Oral Capsule**, which should populate the screen with cards
    similar to those seen in step 7. */
  /* 19. Use the **Check ETASU** and **Check Pharmacy** buttons to get status updates on the prescription and REMS request */
  /* 20. Use the links for the **Prescriber Enrollment Form** and **Prescriber Knowledge Assessment** Questionnaires and
    repeat steps 9-12 to submit those ETASU requirements and see how the ETASU status changes in both the Pharmacist UI
    and Prescriber UI. */
  /* 21. Once all the REMS ETASU are met, go back to <http://localhost:5050> and play the role of the Pharmacist, using the
    **Verify Order** button to move the prescription over to the **Verified Orders** Tab. Click on the **Verified
    Orders** Tab and from there use the **Mark as Picked Up** button to move the prescription over to the **Picked Up
    Orders** Tab. */
  /* 22. Go back to the SMART on FHIR App launched in step 17 and play the role of the prescriber using the **Check
    Pharmacy** button to see the status change of the prescription. */
  /* 23. Lastly, repeat step 20 to open the **Patient Status Update Form** in the returned cards to submit follow
    up/monitoring requests on an as need basis. These forms can be submitted as many times as need be in the prototype
    and will show up as separate ETASU elements each time.*/
});
