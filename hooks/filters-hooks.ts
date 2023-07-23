import { useState } from "react";

interface FormField {
  label: string;
  type: string;
  value1: string | number;
  value2: string | number;
}

export type FormFields = FormField[];

export interface FormHook {
  formData: FormFields;
  setFormData: (data: FormFields) => void;
  updateFormField: (label: string, field: Partial<FormField>) => void;
  resetFormData: () => void;
}

const useFiltersHook = (initialData: FormFields | null): FormHook => {
  const [formData, setFormData] = useState<FormFields>(
    initialData !== null ? initialData : []
  );

  const updateFormField = (label: string, field: Partial<FormField>) => {
    setFormData((prevData) => {
      const updatedFormData = prevData.map((formField) => {
        if (formField.label === label) {
          return {
            ...formField,
            ...field,
          };
        }
        return formField;
      });
      return updatedFormData;
    });
  };

  const resetFormData = () => {
    setFormData(initialData !== null ? initialData : []);
  };

  return {
    formData,
    setFormData,
    updateFormField,
    resetFormData,
  };
};

export default useFiltersHook;
