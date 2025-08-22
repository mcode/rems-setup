import { DrugConfig } from "./interfaces";

/**
 * Drugs configuration for testing
 */
export const DRUG_CONFIGS: DrugConfig[] = [
  {
    name: "Turalio",
    searchTerm: "Turalio 200 MG Oral Capsule",
    forms: [
      {
        name: "Patient Enrollment",
        buttonText: "Patient Enrollment Form",
        taskDescription: "Patient Enrollment Questionnaire",
        requiresPatientSignature: true,
        requiresPrescriberSignature: true
      },
      {
        name: "Prescriber Enrollment",
        buttonText: "Prescriber Enrollment Form",
        taskDescription: "Prescriber Enrollment Questionnaire",
        requiresPrescriberSignature: true
      },
      {
        name: "Prescriber Knowledge Assessment",
        buttonText: "Prescriber Knowledge Assessment Form",
        taskDescription: "Prescriber Knowledge Assessment Questionnaire",
      },
      {
        name: "Patient Status Update",
        buttonText: "Patient Status Update Form",
        requiresPrescriberSignature: true,
        taskDescription: "Patient Status Update Questionnaire"
      },
      {
        name: "Pharmacist Enrollment",
      }
    ]
  },
  {
    name: "TIRF",
    searchTerm: "TIRF 200 UG Oral Transmucosal",
    forms: [
      {
        name: "Patient Enrollment",
        buttonText: "Patient Enrollment Form",
        taskDescription: "Patient Enrollment Questionnaire",
        requiresPatientSignature: true,
        requiresPrescriberSignature: true
      },
      {
        name: "Prescriber Enrollment",
        buttonText: "Prescriber Enrollment Form",
        taskDescription: "Prescriber Enrollment Questionnaire",
        requiresPrescriberSignature: true
      },
      {
        name: "Prescriber Knowledge Assessment",
        buttonText: "Prescriber Knowledge Assessment Form",
        taskDescription: "Prescriber Knowledge Assessment Questionnaire",
        requiresPrescriberSignature: true
      },
      {
        name: "Pharmacist Enrollment",
      },
      {
        name: "Pharmacist Knowledge Assessment",
      }
    ]
  },
  {
    name: "iPledge/Isotretinoin",
    searchTerm: "Isotretinoin 20 MG Oral Capsule",
    forms: [
      {
        name: "Patient Enrollment",
        buttonText: "Patient Enrollment Form",
        taskDescription: "Patient Enrollment Questionnaire",
        requiresPatientSignature: true,
        requiresPrescriberSignature: true
      },
      {
        name: "Prescriber Enrollment",
        buttonText: "Prescriber Enrollment Form",
        taskDescription: "Prescriber Enrollment Questionnaire",
      },
      {
        name: "Pharmacist Enrollment",
      }
    ]
  }
];

// Common user accounts for testing
export const TEST_USERS = {
  PRESCRIBER: { username: "janedoe", password: "jane" },
  NURSE: { username: "alice", password: "alice" },
  PATIENT: { JON_SNOW: { username: "jonsnow", password: "jon" }, ALICE_SMITH: { username: "alicesmith", password: "alice" }}
};

// Common patient data
export const TEST_PATIENTS = {
  JON_SNOW: "Jon Snow",
  ALICE_SMITH: "Alice Smith"
};

// Common patient data
export const TEST_PRESCRIBERS = {
  JANE_DOE: "Jane Doe"
};
