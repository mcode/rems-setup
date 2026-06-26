# How to generate a test request

1. Access the EHR gateway at <http://localhost:3000>. Click Launch with the default FHIR Server Endpoint, Client ID, and Scope values.
2. You'll be redirected to <http://localhost:8180>. Authenticate with `alice` as the username and password. You'll then be redirected back to the EHR UI at <http://localhost:3000> to play the role of a prescriber.
3. Click **Select a Patient** in the middle of the page.
4. Locate **John Snow** in the list of patients and click the "Select a medication request" dropdown.
5. Locate **Turalio 200 MG Oral Capsule (Medication request: 2183126)**.
6. Click **Select** to assign John Snow as the medication request recipient.
7. Click **Send Rx to Pharmacy** to dispatch the prescription.
8. Click **Sign Order**, which demonstrates the case where an EHR has CDS Hooks natively.
9. Await the arrival of two **CDS cards**.
10. Click **Patient Enrollment Form** on the returned CDS card titled **Turalio REMS Patient Requirements**.
11. A questionnaire will appear at <http://localhost:4040> in a new tab.
12. Complete and submit the questionnaire via **Submit REMS Bundle**.
    - 12a. For demonstrating an asynchronous workflow, partially complete the questionnaire and click **Save to EHR**.
    - 12b. Visit the Patient Portal at <http://localhost:3000/#/patient-portal> as the patient.
    - 12c. Login with **johnsnow** as the username and **john** for the password.
    - 12d. Select the saved Questionnaire, complete it, and click **Save to EHR**.
    - 12e. Return to the EHR UI at <http://localhost:3000>, select the latest saved questionnaire from the second
      dropdown next to John Snow's name, and continue as the prescriber.
    - 12f. Click **Launch SMART on FHIR App** and fill out the remainder of the questionnaire, including the prescriber signature, then click **Submit REMS Bundle**.
13. A new UI will appear with REMS Admin Status and Medication Status.
14. Visit the Pharmacy Information Management System at <http://localhost:5050> to play the role of a pharmacist.
15. Click **Doctor Orders** in the top navigation.
16. View the Doctor Order that was sent to the pharmacist from the prescriber and use the **Verify ETASU** button to get
    a status update of the REMS requirements submitted.
17. Return to the EHR UI at <http://localhost:3000> and play the role of the prescriber again. Select patient John Snow
    from the patient select UI and click **Launch SMART on FHIR App**, which will open the SMART on FHIR App in its own
    view and demonstrate the case where an EHR does not have CDS Hooks implemented natively.
18. From the medications dropdown select **Turalio 200 MG Oral Capsule**, which should populate the screen with cards
    similar to those seen in step 9.
19. Click **Check ETASU** and **Check Pharmacy** buttons to get status updates on the prescription and REMS request.
20. Use the **Prescriber Enrollment Form** and **Prescriber Knowledge Assessment** links and
    repeat steps 10-12 to submit those ETASU requirements and see how the ETASU status changes in both the pharmacist UI
    and prescriber UI.
21. Once all the REMS ETASU are met, return to <http://localhost:5050> as the pharmacist, and click **Verify Order** to move the prescription over to the **Verified Orders** tab. Click on the **Verified Orders** tab and click **Mark as Picked Up** to move the prescription over to the **Picked Up Orders** tab.
22. Return to the SMART on FHIR App launched in step 17, assume the prescriber role, and click **Check Pharmacy** to view the prescription status.
23. Repeat step 20 to submit followup/monitoring requests via the **Patient Status Update Form**, on an as need basis. These forms can be submitted multiple times in the prototype, with each submission appearing as a distinct ETASU element.

## Verify Product Availability and Generic REMS Routing

The local Docker topology starts two pharmacy systems:

- PIMS Pharmacy A: <http://localhost:5050>, backend NCPDP endpoint `http://localhost:5051/ncpdp/script`
- PIMS Pharmacy B: <http://localhost:5150>, backend NCPDP endpoint `http://localhost:5151/ncpdp/script`

The default inventory is configured so brand Turalio (`65597-407-20`) is unavailable at Pharmacy A, while generic Pexidartinib (`99999-407-20`) is available at Pharmacy B. Brand Turalio routes to REMS Admin 1; generic Pexidartinib routes to REMS Admin 2.

1. Start from the EHR UI at <http://localhost:3000> as the prescriber.
2. If you have used this browser with older settings, click **Settings**, click **Reset Settings**, then click **Save Settings**. This clears stale endpoint settings from browser local storage.
3. In **Settings**, verify these Product Availability settings:
   - **Use Product Locator Across Pharmacies** is checked.
   - **Allow Product Substitution in Availability Lookup** is checked.
   - **Use Pharmacy Intermediary** is unchecked for the direct-pharmacy test.
   - The **PPA Pharmacy Endpoints** table has enabled rows for `Pharmacy123` and `Pharmacy456`, and both URL columns use `/ncpdp/script`.
4. Return to the request screen.
5. Click **Select a Patient** and choose **John Snow**.
6. In the medication request dropdown, choose **Turalio 200 MG Oral Capsule**.
7. Click **Select**.
8. Click **Check Availability**.
9. Verify the availability result shows `KA: Pexidartinib Hydrochloride 200 MG Oral Capsule available at PIMS Pharmacy B`.
10. Verify the result list includes `PIMS Pharmacy A: Turalio 200 MG Oral Capsule - BJ` and `PIMS Pharmacy B: Turalio 200 MG Oral Capsule -> Pexidartinib Hydrochloride 200 MG Oral Capsule - KA`.
11. Click **Sign Order**. This creates the REMS case for the selected product. If the selected product is generic Pexidartinib, the case should be created at REMS Admin 2.
12. Click **Send Rx to Pharmacy**.
13. Open PIMS Pharmacy B at <http://localhost:5150>.
14. Click **Doctor Orders** and verify the new order appears in Pharmacy B, not Pharmacy A.
15. Verify the order medication display and NDC are the selected generic Pexidartinib product and its REMS routing/status comes from REMS Admin 2.
16. Click **View ETASU** and verify the modal shows the selected generic product's REMS requirements instead of a failed GuidanceResponse.
17. Continue the pharmacist workflow using **Verify ETASU**, **Verify Order**, and **Mark as Picked Up** as needed.

### Optional Intermediary Product Availability Check

1. Return to the EHR UI at <http://localhost:3000>.
2. Open **Settings**.
3. Check **Use Pharmacy Intermediary**.
4. Confirm **Pharmacy Intermediary URL (NCPDP Endpoint)** is `http://localhost:3003/ncpdp/script`.
5. Click **Save Settings**.
6. Repeat the direct test steps from selecting John Snow through **Check Availability**.
7. Verify the same `KA` generic availability result from PIMS Pharmacy B. Request Generator still uses the pharmacy endpoint table to populate `Header.To`, and the intermediary forwards by that value.
8. Click **Send Rx to Pharmacy** and verify the order still arrives at PIMS Pharmacy B.

Congratulations! The REMS Integration prototype is fully installed and ready for you to use!
