import { useState } from "react";
import { Option } from "../components/filters/select";

export interface FormField {
  label: string;
  type: string;
  options?: Option[];
  rangeMin?: number;
  rangeMax?: number;
  selection?: Option[];
  min?: number;
  max?: number;
  value?: number;
}

export type FormFields = FormField[];

export interface FormHook {
  formData: FormFields | null;
  setFormData: (data: FormFields) => void;
  updateFormField: (label: string, field: Partial<FormField>) => void;
  deleteFormField: (label: string) => void; // Added the delete function
  resetFormData: () => void;
}

const useFiltersHook = (initialData: FormFields | null): FormHook => {
  const [formData, setFormData] = useState<FormFields | null>(
    initialData !== null ? initialData : []
  );

  const updateFormField = (label: string, field: Partial<FormField>) => {
    setFormData((prevData) => {
      if (prevData) {
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
      }
      return prevData;
    });
  };

  const deleteFormField = (label: string) => {
    setFormData((prevData) => {
      if (prevData) {
        const updatedFormData = prevData.filter(
          (formField) => formField.label !== label
        );
        return updatedFormData;
      }
      return prevData;
    });
  };

  const resetFormData = () => {
    setFormData(initialData !== null ? initialData : []);
  };

  return {
    formData,
    setFormData,
    updateFormField,
    deleteFormField, // Include the delete function in the returned object
    resetFormData,
  };
};

export default useFiltersHook;
