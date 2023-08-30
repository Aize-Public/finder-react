import React, { memo } from "react";
import MinMaxSlider from "./minMaxInput";
import DateRangePicker, { Range } from "./date";
import { FormField, FormFields } from "@/hooks/filters-hooks";
import { XCircleIcon } from "@heroicons/react/20/solid";
import LoadingBox from "./filters-loader/filters-loader";
import { AddFilter } from "./add-filter";
import { MultiSelect } from "../multi-select";

interface FiltersProps {
  formData: FormFields | null;
  isLoadingMeta: boolean;
  isLoading: boolean;
  updateFormField: (label: string, field: Partial<FormField>) => void;
  setFormData: (arg0: FormFields) => void;
  availableFormData: FormFields;
  setAvailableFormData: (arg0: FormFields) => void;
  deleteFormField: (label: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  formData,
  updateFormField,
  setFormData,
  availableFormData,
  isLoadingMeta,
  setAvailableFormData,
  deleteFormField,
  isLoading,
}) => {
  const addFilter = (filter: FormField) => {
    if (formData) {
      switch (filter.type) {
        case "string": {
          setFormData([...formData, { ...filter, selection: [] }]);
          break;
        }
        case "number":
        case "date": {
          setFormData([
            ...formData,
            { ...filter, min: undefined, max: undefined },
          ]);
        }
      }
    }
  };
  function deleteFilter(label: string): void {
    deleteFormField(label);
  }

  if (isLoadingMeta) {
    return (
      <div>
        <LoadingBox items={3} orientation="horizontal" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap">
        {formData?.map(
          ({ label, type, options, rangeMin, rangeMax, selection, value }) => {
            if (type === "number" && rangeMin && rangeMax) {
              return (
                <div
                  className="w-2/6 p-2 flex  bg-gray-100 mt-1  border-l-2 rounded-lg"
                  key={label}>
                  <div className="w-5/6">
                    <MinMaxSlider
                      key={label}
                      label={label}
                      minValue={rangeMin}
                      maxValue={rangeMax}
                      step={1}
                      defaultValue={value ? value : rangeMin}
                      onChange={(value) =>
                        updateFormField(label, { value, label, type })
                      }
                    />
                  </div>
                  <XCircleIcon
                    className="cursor-pointer mt-2 w-1/6 h-8 text-blue-500 hover:text-blue-600 top-2 right-2"
                    style={{ fill: "currentColor" }}
                    onClick={() => deleteFilter(label)}
                  />
                </div>
              );
            } else if (type === "string") {
              return (
                <div
                  className="w-2/6 p-2 flex bg-gray-100 mt-1 border-l-2 rounded-lg	"
                  key={label}>
                  <div className="w-5/6">
                    <MultiSelect
                      label={label}
                      options={options ? options : []}
                      defaultValue={selection ? selection : []}
                      onChange={(options) =>
                        updateFormField(label, {
                          selection: options,
                        })
                      }
                    />
                  </div>

                  <XCircleIcon
                    className="cursor-pointer mt-2 w-1/6 h-8 text-blue-500 hover:text-blue-600 top-2 right-2"
                    style={{ fill: "currentColor" }}
                    onClick={() => deleteFilter(label)}
                  />
                </div>
              );
            } else if (type === "date") {
              return (
                <div
                  className="w-2/6 p-2 flex bg-gray-100 mt-1 border-l-2 rounded-lg	"
                  key={label}>
                  {
                    <div className="w-5/6">
                      <DateRangePicker
                        label={label}
                        min={rangeMin}
                        max={rangeMax}
                        onChange={({ startDate, endDate }: Range) =>
                          updateFormField(label, {
                            min: startDate?.getTime(),
                            max: endDate?.getTime(),
                          })
                        }
                      />
                    </div>
                  }
                  <XCircleIcon
                    className="cursor-pointer mt-2 w-1/6 h-8 text-blue-500 hover:text-blue-600 top-2 right-2"
                    style={{ fill: "currentColor" }}
                    onClick={() => deleteFilter(label)}
                  />
                </div>
              );
            }
            return null;
          }
        )}
        <div className="w-2/6 p-2 relative">
          <AddFilter
            addFilter={addFilter}
            availableFormData={availableFormData}
          />
        </div>
      </div>
    </>
  );
};

export default memo(Filters);
