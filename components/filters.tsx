import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import MinMaxSlider from "./filters/minMaxInput";
import { Select } from "./filters/select";
import DateRangePicker from "./filters/date";
import useFiltersHook, { FormFields } from "@/hooks/filters-hooks";
import { Popover } from "@headlessui/react";

const Filters: React.FC = () => {
  const [availableFormData, setAvailableFormData] = useState([]);
  const { formData, setFormData, updateFormField, resetFormData } =
    useFiltersHook([]);

  useEffect(() => {
    if (formData.length > 0) {
      const filteredData = Object.entries(data).filter(
        (item1) => !formData.some((item2) => item1[0] === item2["label"])
      );
      const diff = filteredData.map(([label, metadata]) => {
        return {
          label: label,
          type: metadata.dataType,
          value1: "",
          value2: "",
        };
      });
      setAvailableFormData(diff);
    }
  }, [formData]);

  const fetchMetaData = async () => {
    const response = await fetch("http://localhost:3000/api/meta", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };

  const { data, isLoading, isError, error } = useQuery(
    "searchMetaData",
    fetchMetaData
  );

  useEffect(() => {
    if (!isLoading && !isError && data) {
      // Set up initial filters when data is available
      const initialFilters: FormFields = Object.entries(data)
        .slice(0, 3)
        .map(([label, metadata]) => ({
          label: label,
          type: metadata.dataType,
          value1: "",
          value2: "",
        }));
      setFormData(initialFilters);
    }
  }, [isLoading, isError, data, setFormData]);

  const addFilter = (filter, data) => {
    setFormData([...formData, filter]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="flex flex-wrap">
        {formData.map(({ label, type }) => {
          const metadata = data[label];
          if (type === "number") {
            return (
              <div className="w-2/6 p-2" key={label}>
                <MinMaxSlider
                  key={label}
                  minValue={metadata.min}
                  maxValue={metadata.max}
                  step={1}
                  onChange={(value) =>
                    updateFormField(label, {
                      value1: value,
                    })
                  }
                />
              </div>
            );
          } else if (type === "string") {
            return (
              <div className="w-2/6 p-2 relative" key={label}>
                <Select
                  label={label}
                  options={metadata.values.map((val, index) => ({
                    id: index,
                    name: val,
                    value: val,
                  }))}
                  onChange={(options) =>
                    updateFormField(label, {
                      value1: options.map((opt) => opt.value).join(","),
                    })
                  }
                />
              </div>
            );
          } else if (type === "date") {
            return (
              <div className="w-2/6 p-2" key={label}>
                <DateRangePicker
                  label={label}
                  min={metadata.min}
                  max={metadata.max}
                  onChange={(startDate, endDate) =>
                    updateFormField(label, {
                      value1: startDate?.getTime(),
                      value2: endDate?.getTime(),
                    })
                  }
                />
              </div>
            );
          }
          return null;
        })}
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
                        onClick={addFilter.bind(
                          null,
                          filter,
                          data[filter.label]
                        )}>
                        {filter.label}({data[filter.label].values.length})
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
