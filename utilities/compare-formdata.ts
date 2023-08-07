import { FormField, FormFields } from "@/hooks/filters-hooks";

function compareFields(field1: FormField, field2: FormField): boolean {
  if (field1.type === "string") {
    //@ts-ignore
    return (
      field1.label === field2.label &&
      field1.selection?.length === field2.selection?.length &&
      field1.selection?.every(
        //@ts-ignore
        (option, index) => option.name === field2.selection[index]?.name
      )
    );
  } else if (field1.type === "number") {
    return (
      field1.label === field2.label &&
      field1.min === field2.min &&
      field1.max === field2.max &&
      field1.value === field2.value
    );
  } else if (field1.type === "date") {
    return (
      field1.label === field2.label &&
      field1.min === field2.min &&
      field1.max === field2.max
    );
  }

  return false;
}

export function compareFormData(
  array1: FormFields,
  array2: FormFields
): boolean {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (!compareFields(array1[i], array2[i])) {
      return false;
    }
  }

  return true;
}
