# How to generate a test request

1. Go to the EHR UI at <http://localhost:3000>. You will be redirected to <http://localhost:8180>. Authenticate with the username `alice` and password `alice`. You will then be redirected back to <http://localhost:3000> to play the role of a prescriber.
2. Click **Select a Patient** button in upper left.
3. Find **Jon Snow** in the list of patients and click the "Select a medication request" dropdown menu next to his name.
4. Select **Turalio 200 MG Oral Capsule (Medication request: 2183126)**.
5. Click the Select button to select Jon Snow as the patient to send the medication request to.
6. Click **Send Rx to Pharmacy** at the bottom of the page to send a prescription to the pharmacist.
7. Click **Sign Order** at the bottom of the page, which demonstrates the case where an EHR has CDS Hooks
   implemented natively.
8. You should receive a response in the form of two **CDS cards**:
9. Select **Patient Enrollment Form** on the returned CDS card with summary **Turalio REMS Patient Requirements**.
10. A webpage at <http://localhost:4040> should open in a new tab, and after a few seconds, a questionnaire should appear.
11. Fill out the questionnaire and hit **Submit REMS Bundle**.
    - 11a. Alternatively fill out only some of the questionnaire for an asynchronous workflow and hit **Save to EHR**.
    - 11b. Visit the Patient Portal at <http://localhost:3000/#/patient-portal> and play the role of the patient.
    - 11c. Login to the Patient Portal, use **JonSnow** for the username and **jon** for the password.
    - 11d. Select the saved Questionnaire and fill out the rest of the questionnaire as well as the patient signature in
      the questionnaire and hit **Save to EHR** again.
    - 11e. Go back to the EHR UI at <http://localhost:3000> and select the latest saved questionnaire from the second
      dropdown next to Jon Snow's name and continue in the role of the prescriber.
    - 11f. Click **Launch SMART on FHIR App** and fill out the remainder of the questionnaire, including the prescriber signature,
      then click **Submit REMS Bundle**.
12. A new UI will appear with REMS Admin Status and Pharmacy Status.
13. Go to <http://localhost:5050> and play the role of a pharmacist.
14. Click **Doctor Orders** in the top hand navigation menu on the screen.
15. See the Doctor Order that was sent to the pharmacist from the prescriber and use the **Verify ETASU** button to get
    a status update of the REMS requirements submitted.
16. Go back to the EHR UI at <http://localhost:3000> and play the role of the prescriber again. Select patient Jon Snow
    from the patient select UI and click **Launch SMART on FHIR App**, which will open the SMART on FHIR App in its own
    view and demonstrate the case where an EHR does not have CDS Hooks implemented natively.
17. From the medications dropdown select **Turalio 200 MG Oral Capsule**, which should populate the screen with cards
    similar to those seen in step 7.
18. Use the **Check ETASU** and **Check Pharmacy** buttons to get status updates on the prescription and REMS request.
19. Use the links for the **Prescriber Enrollment Form** and **Prescriber Knowledge Assessment** Questionnaires and
    repeat steps 9-11 to submit those ETASU requirements and see how the ETASU status changes in both the pharmacist UI
    and Prescriber UI.
20. Once all the REMS ETASU are met, go back to <http://localhost:5050> and play the role of the pharmacist, using the
    **Verify Order** button to move the prescription over to the **Verified Orders** Tab. Click on the **Verified
    Orders** Tab and from there use the **Mark as Picked Up** button to move the prescription over to the **Picked Up
    Orders** Tab.
21. Go back to the SMART on FHIR App launched in step 16 and play the role of the prescriber using the **Check
    Pharmacy** button to see the status change of the prescription.
22. Lastly, repeat step 19 to open the **Patient Status Update Form** in the returned cards to submit follow
    up/monitoring requests on an as need basis. These forms can be submitted as many times as need be in the prototype
    and will show up as separate ETASU elements each time.

Congratulations! The REMS Integration prototype is fully installed and ready for you to use!
