import { expect } from "@playwright/test";
import { test } from './util/test-fixture';
import { DRUG_CONFIGS, TEST_USERS, TEST_PATIENTS, TEST_PRESCRIBERS } from "./util/configs";
import { SmartAppPage } from "./util/smartApp";
import { testUtilKeycloakLogin } from "./util/keycloakLogin";

/**
 * Test suite for REMS workflow tests
 */
test.describe('REMS Workflows', () => {
  /**
   * Tests for each drug/patient configuration
   */
  for (const drugConfig of DRUG_CONFIGS) {
    for (const patient_key in TEST_PATIENTS) {
      const patient_name = TEST_PATIENTS[patient_key]
      /**
       * Synchronous workflow test
       * Tests the direct completion of forms without using the task system
       */
      test(`EHR workflow for ${patient_name} - ${drugConfig.name}`, async ({
        ehrPage,
        pharmacyPage,
      }) => {

        // Setup and login
        await ehrPage.navigate();
        await ehrPage.login(TEST_USERS.PRESCRIBER.username, TEST_USERS.PRESCRIBER.password);
        await ehrPage.resetDatabases();

        // Select patient and medication
        await ehrPage.selectPatient(patient_name);
        await ehrPage.selectMedication(drugConfig.searchTerm);

        // Send prescription to pharmacy and sign the order
        await ehrPage.sendPrescriptionToPharmacy();
        await ehrPage.signOrder();

        // Verify CDS cards
        await ehrPage.verifyCDSCards(drugConfig.name);

        // Complete all required forms in synchronous workflow
        for (const form of drugConfig.forms) {
          // Skip Patient Status Update - we'll do this later as a follow-up
          if (form.name === "Patient Status Update" || !form.buttonText) continue;

          // Launch SMART app for the form
          const smartPage = await ehrPage.launchSmartOnFhirApp(form.buttonText);
          const smartAppPage = new SmartAppPage(smartPage);
          await smartAppPage.verifyAppLoaded();

          // Fill out and submit the form
          await smartAppPage.fillOutForm();

          if (form.requiresPatientSignature) {
            await smartAppPage.fillPatientSignatureFields(patient_name)
          }

          if (form.requiresPrescriberSignature) {
            await smartAppPage.fillPrescriberSignatureFields(TEST_PRESCRIBERS.JANE_DOE)
          }

          await smartAppPage.submitForm()
        }

        // Open pharmacy and verify prescription
        await pharmacyPage.navigate();
        await pharmacyPage.navigateToDoctorOrders();

        // Verify ETASU requirements
        await pharmacyPage.findMedicationCard(drugConfig.searchTerm);
        const etasuChecks = await pharmacyPage.verifyETASU();

        // Calculate expected checks based on completed forms
        const expectedChecks = drugConfig.forms.filter(f => f.name !== "Patient Status Update").length;
        expect(etasuChecks).toEqual(expectedChecks);

        // Process order through pharmacy workflow
        await pharmacyPage.verifyOrder();
        await pharmacyPage.switchTab("Verified Orders");
        await pharmacyPage.verifyMedicationStatus(drugConfig.searchTerm, "Approved");
        await pharmacyPage.markAsPickedUp();
        await pharmacyPage.switchTab("Picked Up Orders");
        await pharmacyPage.verifyMedicationStatus(drugConfig.searchTerm, "Picked Up");

        // Return to EHR to check status
        await ehrPage.navigate();
        await ehrPage.login(TEST_USERS.PRESCRIBER.username, TEST_USERS.PRESCRIBER.password);
        await ehrPage.selectPatient(patient_name);
        await ehrPage.selectMedication(drugConfig.searchTerm);
        await ehrPage.signOrder();

        // Check medication status
        const medicationStatus = await ehrPage.checkMedicationStatus();
        expect(medicationStatus).toContain("Picked Up");

        // If the drug has a Patient Status Update form, submit it as a follow-up
        const patientStatusForm = drugConfig.forms.find(f => f.name === "Patient Status Update");
        if (patientStatusForm) {
          // Launch and fill out the Patient Status Update form
          const updatePage = await ehrPage.launchSmartOnFhirApp(patientStatusForm.buttonText);
          const updateAppPage = new SmartAppPage(updatePage);
          await updateAppPage.verifyAppLoaded();

          // Fill out and submit the form
          await updateAppPage.fillOutForm();

          if (patientStatusForm.requiresPatientSignature) {
            await updateAppPage.fillPatientSignatureFields(patient_name)
          }

          if (patientStatusForm.requiresPrescriberSignature) {
            await updateAppPage.fillPrescriberSignatureFields(TEST_PRESCRIBERS.JANE_DOE)
          }

          await updateAppPage.submitForm()

          // Verify the Patient Status Update appears in ETASU list
          await ehrPage.verifyEtasuRequirement("Patient Status Update");

          // Verify pharmacy sees the update
          const updatedEtasuChecks = await pharmacyPage.verifyETASU();
          expect(updatedEtasuChecks).toEqual(drugConfig.forms.length);
        }
      });

      /**
       * Task-based workflow test
       * Tests completion of forms using the task system with different roles
       */
      test(`Task workflow for ${patient_name} - ${drugConfig.name}`, async ({
        ehrPage,
        nurseEhrPage,
        patientPortalPage,
        pharmacyPage,
      }) => {

        // Setup and login
        await ehrPage.navigate();
        await ehrPage.login(TEST_USERS.PRESCRIBER.username, TEST_USERS.PRESCRIBER.password);
        await ehrPage.resetDatabases();

        // Select patient and medication
        await ehrPage.selectPatient(patient_name);
        await ehrPage.selectMedication(drugConfig.searchTerm);

        // Send prescription to pharmacy and sign the order
        await ehrPage.sendPrescriptionToPharmacy();
        await ehrPage.signOrder();

        // Verify CDS cards
        await ehrPage.verifyCDSCards(drugConfig.name);

        // Filter forms that are task-enabled
        const taskForms = drugConfig.forms.filter(form => form.taskDescription);

        // Add forms to task list
        for (const form of taskForms) {
          // Skip Patient Status Update - we'll do this later as a follow-up
          if (form.name === "Patient Status Update") continue;

          if (form.taskDescription) {
            await ehrPage.addTaskToList(form.taskDescription)
          }
        }

        // Go to tasks tab and verify tasks were created
        await ehrPage.goToTasks();
        await ehrPage.switchToTaskTab("UNASSIGNED TASKS");

        // Verify all expected tasks are present
        for (const form of taskForms) {
          // Skip Patient Status Update - we'll do this later as a follow-up
          if (form.name === "Patient Status Update") continue;

          if (form.taskDescription) {
            await ehrPage.verifyTaskPresent(form.taskDescription);
          }
        }

        // ToDo: Once implemented, directly assign tasks to the nurse

        // Handle Prescriber Knowledge Assessment task as the prescriber
        const pkaForm = taskForms.find(f => f.name === "Prescriber Knowledge Assessment");
        if (pkaForm && pkaForm.taskDescription) {

          // Assign to self and verify
          await ehrPage.assignTask(pkaForm.taskDescription, `Assign to me (${TEST_PRESCRIBERS.JANE_DOE})`);
          await ehrPage.switchToTaskTab("MY TASKS");
          await ehrPage.verifyTaskPresent(pkaForm.taskDescription);
          await ehrPage.verifyTaskStatus(pkaForm.taskDescription, "READY");

          // Launch and complete the form
          const pkaPage = await ehrPage.launchTaskForm(pkaForm.taskDescription);
          const pkaApp = new SmartAppPage(pkaPage);

          await pkaApp.verifyAppLoaded();

          // Fill out and submit the form
          await pkaApp.fillOutForm();

          if (pkaForm.requiresPrescriberSignature) {
            await pkaApp.fillPrescriberSignatureFields(TEST_PRESCRIBERS.JANE_DOE)
          }

          await pkaApp.submitForm()

          // Update task status and delete it
          await ehrPage.verifyTaskStatus(pkaForm.taskDescription, "IN-PROGRESS");
          await ehrPage.updateTaskStatus("completed");
          await ehrPage.verifyTaskStatus(pkaForm.taskDescription, "COMPLETED");
          await ehrPage.deleteTask();
          await ehrPage.verifyTaskPresent(pkaForm.taskDescription, false);
        }


        // Set up nurse view
        await nurseEhrPage.navigate();
        await nurseEhrPage.login(TEST_USERS.NURSE.username, TEST_USERS.NURSE.password);
        await nurseEhrPage.selectPatient(patient_name);
        await nurseEhrPage.refreshTasks();

        // Set up patient portal
        await patientPortalPage.navigate();
        await patientPortalPage.login(TEST_USERS.PATIENT[patient_key].username, TEST_USERS.PATIENT[patient_key].password);

        // Handle Prescriber Enrollment
        const peForm = taskForms.find(f => f.name === "Prescriber Enrollment");
        if (peForm && peForm.taskDescription) {
          // Handle Prescriber Enrollment completion as nurse

          // go to unassigned tasks
          await nurseEhrPage.switchToTaskTab("UNASSIGNED TASKS");

          // Nurse assigns to self and partially completes
          await nurseEhrPage.assignTask(peForm.taskDescription, "Assign to me (Alice Nurse)");
          await nurseEhrPage.switchToTaskTab("MY TASKS");

          // Launch and save (not submit) the form
          const pePage = await nurseEhrPage.launchTaskForm(peForm.taskDescription);
          const peApp = new SmartAppPage(pePage);

          await peApp.verifyAppLoaded();

          // Fill out and submit the form
          await peApp.fillOutForm();

          await peApp.submitForm("Save to EHR")


          // Assign back to prescriber
          await nurseEhrPage.assignTask(peForm.taskDescription, `Assign to requester (${TEST_PRESCRIBERS.JANE_DOE})`);

          //verify the task is no longer present
          await nurseEhrPage.refreshTasks();
          await nurseEhrPage.verifyTaskPresent(peForm.taskDescription, false);




          // Handle Prescriber Enrollment completion as prescriber
          // validate the task 
          await ehrPage.switchToTaskTab("MY TASKS");
          await ehrPage.refreshTasks()
          await ehrPage.verifyTaskPresent(peForm.taskDescription);
          await ehrPage.verifyTaskStatus(peForm.taskDescription, "IN-PROGRESS");

          // Complete the form
          const peCompletePage = await ehrPage.launchTaskForm(peForm.taskDescription);
          const peCompleteApp = new SmartAppPage(peCompletePage);
          await peCompleteApp.verifyAppLoaded();
          await peCompleteApp.handleInProgressForms();

          if (peForm.requiresPrescriberSignature) {
            await peCompleteApp.fillPrescriberSignatureFields(TEST_PRESCRIBERS.JANE_DOE)
          }

          await peCompleteApp.submitForm()

          // Mark as completed and delete
          await ehrPage.updateTaskStatus("completed");
          await ehrPage.verifyTaskStatus(peForm.taskDescription, "COMPLETED");
          await ehrPage.deleteTask();
          await ehrPage.verifyTaskPresent(peForm.taskDescription, false);
        }


        // Handle Patient Enrollment
        const patientForm = taskForms.find(f => f.name === "Patient Enrollment");
        if (patientForm && patientForm.taskDescription) {
          // Handle Patient Enrollment completion as nurse
          // go to unassigned tasks
          await nurseEhrPage.switchToTaskTab("UNASSIGNED TASKS");

          // Nurse assigns to self and partially completes
          await nurseEhrPage.assignTask(patientForm.taskDescription, "Assign to me (Alice Nurse)");
          await nurseEhrPage.switchToTaskTab("MY TASKS");

          // validate the task 
          await nurseEhrPage.switchToTaskTab("MY TASKS");
          await nurseEhrPage.refreshTasks()
          await nurseEhrPage.verifyTaskPresent(patientForm.taskDescription);
          await nurseEhrPage.verifyTaskStatus(patientForm.taskDescription, "READY");


          // Launch and save the form
          const patientPage = await nurseEhrPage.launchTaskForm(patientForm.taskDescription);
          const patientApp = new SmartAppPage(patientPage);

          await patientApp.verifyAppLoaded();

          // Fill out and submit the form
          await patientApp.fillOutForm();

          await patientApp.submitForm("Save to EHR")

          // Assign to patient
          await nurseEhrPage.assignTask(patientForm.taskDescription, `Assign to patient (${patient_name})`);

          //verify the task is no longer present
          await nurseEhrPage.refreshTasks();
          await nurseEhrPage.verifyTaskPresent(patientForm.taskDescription, false);


          // Patient continues the enrollment form
          // go to the tasks page
          await patientPortalPage.goToTasks();
          await patientPortalPage.refreshTasks();

          // validate the task 
          await patientPortalPage.verifyTaskPresent(patientForm.taskDescription);
          await patientPortalPage.verifyTaskStatus(patientForm.taskDescription, "IN-PROGRESS");

          // Launch patient enrollment form
          const enrollmentPage = await patientPortalPage.launchTaskForm(patientForm.taskDescription);

          // Login to keycloak as patient if needed
          await testUtilKeycloakLogin({
            page: enrollmentPage,
            username: TEST_USERS.PATIENT[patient_key].username,
            password: TEST_USERS.PATIENT[patient_key].password
          });

          // Fill out form
          const enrollmentApp = new SmartAppPage(enrollmentPage);
          await enrollmentApp.verifyAppLoaded();
          await enrollmentApp.handleInProgressForms();

          if (patientForm.requiresPatientSignature) {
            await enrollmentApp.fillPatientSignatureFields(patient_name)
          }

          await enrollmentApp.submitForm("Save to EHR")

          // Assign back to prescriber
          await patientPortalPage.assignTask(patientForm.taskDescription, `Assign to requester (${TEST_PRESCRIBERS.JANE_DOE})`);

          // verify that the task is removed
          // refresh the page 
          await patientPortalPage.refreshTasks()
          await patientPortalPage.verifyTaskPresent(patientForm.taskDescription, false);



          // Handle Patient Enrollment completion as prescriber

          // validate the task 
          await ehrPage.switchToTaskTab("MY TASKS");
          await ehrPage.refreshTasks()
          await ehrPage.verifyTaskPresent(patientForm.taskDescription);
          await ehrPage.verifyTaskStatus(patientForm.taskDescription, "IN-PROGRESS");

          // Complete the form
          const patientCompletePage = await ehrPage.launchTaskForm(patientForm.taskDescription);
          const patientCompleteApp = new SmartAppPage(patientCompletePage);
          await patientCompleteApp.verifyAppLoaded();
          await patientCompleteApp.handleInProgressForms();

          if (patientForm.requiresPrescriberSignature) {
            await patientCompleteApp.fillPrescriberSignatureFields(TEST_PRESCRIBERS.JANE_DOE)
          }

          await patientCompleteApp.submitForm()

          // Mark as completed and delete
          // Mark as completed and delete
          await ehrPage.updateTaskStatus("completed");
          await ehrPage.verifyTaskStatus(patientForm.taskDescription, "COMPLETED");
          await ehrPage.deleteTask();
          await ehrPage.verifyTaskPresent(patientForm.taskDescription, false);
        }

        // Open pharmacy and verify prescription
        await pharmacyPage.navigate();
        await pharmacyPage.navigateToDoctorOrders();

        // Verify ETASU requirements
        await pharmacyPage.findMedicationCard(drugConfig.searchTerm);
        const etasuChecks = await pharmacyPage.verifyETASU();

        // Calculate expected checks based on completed forms
        const expectedChecks = drugConfig.forms.filter(f => f.name !== "Patient Status Update").length;
        expect(etasuChecks).toEqual(expectedChecks);

        // Process order through pharmacy workflow
        await pharmacyPage.verifyOrder();
        await pharmacyPage.switchTab("Verified Orders");
        await pharmacyPage.verifyMedicationStatus(drugConfig.searchTerm, "Approved");
        await pharmacyPage.markAsPickedUp();
        await pharmacyPage.switchTab("Picked Up Orders");
        await pharmacyPage.verifyMedicationStatus(drugConfig.searchTerm, "Picked Up");

        // Return to EHR to check status
        await ehrPage.navigate();
        await ehrPage.login(TEST_USERS.PRESCRIBER.username, TEST_USERS.PRESCRIBER.password);
        await ehrPage.selectPatient(patient_name);
        await ehrPage.selectMedication(drugConfig.searchTerm);
        await ehrPage.signOrder();

        // Check medication status
        const medicationStatus = await ehrPage.checkMedicationStatus();
        expect(medicationStatus).toContain("Picked Up");

        // If the drug has a Patient Status Update form, submit it as a follow-up
        const patientStatusForm = drugConfig.forms.find(f => f.name === "Patient Status Update");
        if (patientStatusForm && patientStatusForm.taskDescription) {
          // assigning the patient status form to the nurse
          await ehrPage.addTaskToList(patientStatusForm.taskDescription)


          // Handle Patient Status Update completion as nurse
          // go to unassigned tasks
          await nurseEhrPage.refreshTasks()
          await nurseEhrPage.switchToTaskTab("UNASSIGNED TASKS");

          // Nurse assigns to self and partially completes
          await nurseEhrPage.assignTask(patientStatusForm.taskDescription, "Assign to me (Alice Nurse)");
          await nurseEhrPage.switchToTaskTab("MY TASKS");

          // validate the task 
          await nurseEhrPage.switchToTaskTab("MY TASKS");
          await nurseEhrPage.refreshTasks()
          await nurseEhrPage.verifyTaskPresent(patientStatusForm.taskDescription);
          await nurseEhrPage.verifyTaskStatus(patientStatusForm.taskDescription, "READY");


          // Launch and save the form
          const patientPage = await nurseEhrPage.launchTaskForm(patientStatusForm.taskDescription);
          const patientApp = new SmartAppPage(patientPage);

          await patientApp.verifyAppLoaded();

          // Fill out and submit the form
          await patientApp.fillOutForm();

          await patientApp.submitForm("Save to EHR")

          // Assign to patient
          await nurseEhrPage.assignTask(patientStatusForm.taskDescription, `Assign to patient (${patient_name})`);

          //verify the task is no longer present
          await nurseEhrPage.refreshTasks();
          await nurseEhrPage.verifyTaskPresent(patientStatusForm.taskDescription, false);

          // Patient continues the status form
          // go to the tasks page
          await patientPortalPage.refreshTasks();

          // validate the task 
          await patientPortalPage.verifyTaskPresent(patientStatusForm.taskDescription);
          await patientPortalPage.verifyTaskStatus(patientStatusForm.taskDescription, "IN-PROGRESS");

          // Launch patient enrollment form
          const enrollmentPage = await patientPortalPage.launchTaskForm(patientStatusForm.taskDescription);

          // Fill out form
          const enrollmentApp = new SmartAppPage(enrollmentPage);
          await enrollmentApp.verifyAppLoaded();
          await enrollmentApp.handleInProgressForms();

          if (patientStatusForm.requiresPatientSignature) {
            await enrollmentApp.fillPatientSignatureFields(patient_name)
          }

          await enrollmentApp.submitForm("Save to EHR")

          // Assign back to prescriber
          await patientPortalPage.assignTask(patientStatusForm.taskDescription, `Assign to requester (${TEST_PRESCRIBERS.JANE_DOE})`);

          // verify that the task is removed
          // refresh the page 
          await patientPortalPage.refreshTasks()
          await patientPortalPage.verifyTaskPresent(patientStatusForm.taskDescription, false);


          // Handle Patient Enrollment completion as prescriber            
          // validate the task 
          await ehrPage.goToTasks();
          await ehrPage.switchToTaskTab("MY TASKS");
          await ehrPage.refreshTasks()
          await ehrPage.verifyTaskPresent(patientStatusForm.taskDescription);
          await ehrPage.verifyTaskStatus(patientStatusForm.taskDescription, "IN-PROGRESS");

          // Complete the form
          const patientCompletePage = await ehrPage.launchTaskForm(patientStatusForm.taskDescription);
          const patientCompleteApp = new SmartAppPage(patientCompletePage);
          await patientCompleteApp.verifyAppLoaded();
          await patientCompleteApp.handleInProgressForms();

          // Bug Fix: make sure all fields are filled out
          await patientCompleteApp.fillOutForm();

          if (patientStatusForm.requiresPrescriberSignature) {
            await patientCompleteApp.fillPrescriberSignatureFields(TEST_PRESCRIBERS.JANE_DOE)
          }

          await patientCompleteApp.submitForm()

          // Mark as completed and delete
          // Mark as completed and delete
          await ehrPage.updateTaskStatus("completed");
          await ehrPage.verifyTaskStatus(patientStatusForm.taskDescription, "COMPLETED");
          await ehrPage.deleteTask();
          await ehrPage.verifyTaskPresent(patientStatusForm.taskDescription, false);


          // Return to EHR to check status
          await ehrPage.navigate();
          await ehrPage.login(TEST_USERS.PRESCRIBER.username, TEST_USERS.PRESCRIBER.password);
          await ehrPage.selectPatient(patient_name);
          await ehrPage.selectMedication(drugConfig.searchTerm);
          await ehrPage.signOrder();

          // Verify the Patient Status Update appears in ETASU list
          await ehrPage.verifyEtasuRequirement("Patient Status Update");

          // Verify pharmacy sees the update
          const updatedEtasuChecks = await pharmacyPage.verifyETASU();
          expect(updatedEtasuChecks).toEqual(drugConfig.forms.length);
        }
      });
    }
  }
});