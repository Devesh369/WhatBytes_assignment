import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MultiStepFormData, MultiStepFormStore } from '../types/multiStepForm';

const INITIAL_FORM_DATA: MultiStepFormData = {
  // Step 1
  fullName: '',
  email: '',
  phoneNumber: '',
  // Step 2
  streetAddress: '',
  city: '',
  zipCode: '',
  country: 'United States',
  // Step 3
  username: '',
  password: '',
  confirmPassword: '',
};

export const useMultiStepFormStore = create<MultiStepFormStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: INITIAL_FORM_DATA,
      isSubmitted: false,
      submittedData: null,

      setStep: (step: number) => {
        set({ currentStep: Math.min(Math.max(1, step), 4) });
      },

      nextStep: () => {
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 4),
        }));
      },

      prevStep: () => {
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        }));
      },

      updateFormData: (data: Partial<MultiStepFormData>) => {
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
          },
        }));
      },

      resetForm: () => {
        set({
          currentStep: 1,
          formData: INITIAL_FORM_DATA,
          isSubmitted: false,
          submittedData: null,
        });
      },

      submitForm: (finalData: MultiStepFormData) => {
        console.log('✅ [WhatBytes Assignment] Final Multi-Step Form Submission:', finalData);
        set({
          isSubmitted: true,
          submittedData: finalData,
        });
      },

      fillSampleData: () => {
        set({
          formData: {
            fullName: 'Alex Morgan Rivers',
            email: 'alex.rivers@whatbytes.com',
            phoneNumber: '+1 (555) 234-5678',
            streetAddress: '742 Evergreen Terrace',
            city: 'Springfield',
            zipCode: '97477',
            country: 'United States',
            username: 'alex_rivers26',
            password: 'StrongP@ssw0rd2026!',
            confirmPassword: 'StrongP@ssw0rd2026!',
          },
        });
      },
    }),
    {
      name: 'whatbytes_multistep_form',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
