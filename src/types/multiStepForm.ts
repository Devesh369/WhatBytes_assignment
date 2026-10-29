export interface PersonalInfo {
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface AddressDetails {
  streetAddress: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface AccountCredentials {
  username: string;
  password: string;
  confirmPassword: string;
}

export type MultiStepFormData = PersonalInfo & AddressDetails & AccountCredentials;

export interface MultiStepFormStore {
  currentStep: number;
  formData: MultiStepFormData;
  isSubmitted: boolean;
  submittedData: MultiStepFormData | null;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<MultiStepFormData>) => void;
  resetForm: () => void;
  submitForm: (data: MultiStepFormData) => void;
  fillSampleData: () => void;
}
