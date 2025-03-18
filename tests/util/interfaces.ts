export interface DrugConfig {
  name: string;  // Display name for the drug
  searchTerm: string;  // Term to use in row header search
  forms: FormConfig[];  // Forms required for this drug
}

export interface FormConfig {
  name: string;  // Display name of the form
  buttonText?: string;  // Text on the button to launch the form
  taskDescription?: string;  // Description shown in task list
  requiresPatientSignature?: boolean;  // Whether patient must sign
  requiresPrescriberSignature?: boolean;  // Whether prescriber must sign
}

export interface FormConfig {
  name: string;  // Display name of the form
  buttonText?: string;  // Text on the button to launch the form
  taskDescription?: string;  // Description shown in task list
  requiresPatientSignature?: boolean;  // Whether patient must sign
  requiresPrescriberSignature?: boolean;  // Whether prescriber must sign
}

export interface WorkflowOptions {
  useTaskWorkflow?: boolean;
  skipLogin?: boolean;
  resetDatabases?: boolean;
}