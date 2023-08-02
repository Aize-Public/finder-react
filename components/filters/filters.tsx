import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import MinMaxSlider from "./minMaxInput";
import { Select } from "./select";
import DateRangePicker, { Range } from "./date";
import useFiltersHook, { FormField, FormFields } from "@/hooks/filters-hooks";
import { Popover } from "@headlessui/react";
import { useSearchResultsContext } from "../results/result";
import { useRequestContext } from "@/pages";

interface FiltersProps {
  formData: FormFields;
  updateFormField: (label: string, field: Partial<FormField>) => void;
  setFormData: (arg0: FormFields) => void;
  availableFormData: FormFields;
  setAvailableFormData: (arg0: FormFields) => void;
}

const Filters: React.FC<FiltersProps> = ({
  formData,
  updateFormField,
  setFormData,
  availableFormData,
  setAvailableFormData,
}) => {
  const { results, setResults } = useSearchResultsContext();
  const { request, setRequest } = useRequestContext();
  const { aggregations, stats } = results;

  const [aggregationsSelection, setAggregationsSelection] =
    useState<string>("");

  const addFilter = (filter: FormField) => {
    setFormData([...formData, filter]);
  };

  return (
    <>
      <div className="flex flex-wrap">
        {formData?.map(
          ({ label, type, options, rangeMin, rangeMax, selection, value }) => {
            if (type === "number" && rangeMin && rangeMax) {
              return (
                <div className="w-2/6 p-2" key={label}>
                  {
                    <MinMaxSlider
                      key={label}
                      minValue={rangeMin}
                      maxValue={rangeMax}
                      step={1}
                      defaultValue={value ? value : rangeMin}
                      onChange={(value) =>
                        updateFormField(label, { value, label, type })
                      }
                    />
                  }
                </div>
              );
            } else if (type === "string") {
              return (
                <div className="w-2/6 p-2 relative" key={label}>
                  <Select
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
              );
            } else if (type === "date") {
              return (
                <div className="w-2/6 p-2" key={label}>
                  {
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
                  }
                </div>
              );
            }
            return null;
          }
        )}
        <div className="w-2/6 p-2 relative">
          <Popover>
            {({ open }) => (
              <>
                <Popover.Button className="p-2 w-full bg-blue-200 text-blue-800 rounded-md shadow-md hover:bg-blue-300 focus:outline-none focus:ring focus:ring-blue-300">
                  Add Filter{" "}
                </Popover.Button>

                <Popover.Panel className="border border-gray-300 bg-white	 rounded-md absolute max-h-60 z-20  overflow-y-auto w-full">
                  {availableFormData.map((filter) => (
                    <span key={filter.label}>
                      <button
                        className="p-2 w-full text-left	  bg-white text-blue-800 hover:bg-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                        onClick={addFilter.bind(null, filter)}>
                        {filter.label}
                      </button>
                    </span>
                  ))}
                </Popover.Panel>
              </>
            )}
          </Popover>
        </div>
      </div>
    </>
  );
};

export default Filters;
