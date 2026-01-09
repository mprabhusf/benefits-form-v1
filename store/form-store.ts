import { create } from "zustand";
import type { FormData } from "@/types";

interface FormStore {
  currentStep: number;
  formData: Partial<FormData>;
  setCurrentStep: (step: number) => void;
  updateFormData: <K extends keyof FormData>(
    step: K,
    data: FormData[K]
  ) => void;
  getFormData: () => Partial<FormData>;
  resetForm: () => void;
}

const initialState: Partial<FormData> = {
  step1_programSelection: {
    programs: [],
    tanfNoSnap: false,
  },
};

export const useFormStore = create<FormStore>((set, get) => ({
  currentStep: 1,
  formData: initialState,
  setCurrentStep: (step) => set({ currentStep: step }),
  updateFormData: (step, data) =>
    set((state) => ({
      formData: { ...state.formData, [step]: data },
    })),
  getFormData: () => get().formData,
  resetForm: () => set({ formData: initialState, currentStep: 1 }),
}));

