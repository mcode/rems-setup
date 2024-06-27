# How to generate a test request

1. Access the EHR gateway at <http://localhost:3000>. Click Launch with the default FHIR Server Endpoint, Client ID, and Scope values.
2. You'll be redirected to <http://localhost:8180>. Authenticate with `alice` as the username and password. You'll then be redirected back to the EHR UI at <http://localhost:3000> to play the role of a prescriber.
3. Click **Select a Patient** in the middle of the page.
4. Locate **Jon Snow** in the list of patients and click the "Select a medication request" dropdown.
5. Locate **Turalio 200 MG Oral Capsule (Medication request: 2183126)**.
6. Click **Select** to assign Jon Snow as the medication request recipient.
7. Click **Send Rx to Pharmacy** to dispatch the prescription.
8. Click **Sign Order**, which demonstrates the case where an EHR has CDS Hooks natively.
9. Await the arrival of two **CDS cards**.
10. Click **Patient Enrollment Form** on the returned CDS card titled **Turalio REMS Patient Requirements**.
11. A questionnaire will appear at <http://localhost:4040> in a new tab.
12. Complete and submit the questionnaire via **Submit REMS Bundle**.
    - 12a. For demonstrating an asynchronous workflow, partially complete the questionnaire and click **Save to EHR**.
    - 12b. Visit the Patient Portal at <http://localhost:3000/#/patient-portal> as the patient.
    - 12c. Login with **JonSnow** as the username and **jon** for the password.
    - 12d. Select the saved Questionnaire, complete it, and click **Save to EHR**.
    - 12e. Return to the EHR UI at <http://localhost:3000>, select the latest saved questionnaire from the second
      dropdown next to Jon Snow's name, and continue as the prescriber.
    - 12f. Click **Launch SMART on FHIR App** and fill out the remainder of the questionnaire, including the prescriber signature, then click **Submit REMS Bundle**.
13. A new UI will appear with REMS Admin Status and Medication Status.
14. Visit the Pharmacy Information Management System at <http://localhost:5050> to play the role of a pharmacist.
15. Click **Doctor Orders** in the top navigation.
16. View the Doctor Order that was sent to the pharmacist from the prescriber and use the **Verify ETASU** button to get
    a status update of the REMS requirements submitted.
17. Return to the EHR UI at <http://localhost:3000> and play the role of the prescriber again. Select patient Jon Snow
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

Congratulations! The REMS Integration prototype is fully installed and ready for you to use!
