import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import MinMaxSlider from "./minMaxInput";
import { Select } from "./select";
import DateRangePicker from "./date";
import useFiltersHook, { FormFields } from "@/hooks/filters-hooks";
import { Popover } from "@headlessui/react";
import { fetchMetaData } from "@/utilities/filters-fetch.utility";
import { useSearchResultsContext } from "../results/result";
import { SearchResponse } from "@/pages/api/search";

interface FiltersProps {
  onChangeHandler: (arg0: string, agr1: string) => void;
  value: SearchResponse;
  initialFormState: FormFields;
}

const Filters: React.FC<FiltersProps> = ({
  onChangeHandler,
  value,
  initialFormState,
}) => {
  const { aggregations, stats } = value;
  const [availableFormData, setAvailableFormData] = useState<FormFields>([]);
  const { formData, setFormData, updateFormField } =
    useFiltersHook(initialFormState);
  const [aggregationsSelection, setAggregationsSelection] =
    useState<string>("");
  const searchData = useSearchResultsContext();

  const { data, isLoading, isError, error } = useQuery(
    "searchMetaData",
    fetchMetaData
  );

  useEffect(() => {
    if (formData?.length > 0) {
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
      setAggregationsSelection((agg) => {
        const aggregationData = formData
          .filter((data) => data.type === "string")
          .map((data) => data.label)
          .join(",");
        const statsData = formData
          .filter((data) => data.type === "date" || data.type === "number")
          .map((data) => data.label)
          .join(",");
        onChangeHandler(aggregationData, statsData, formData);
        return aggregationData;
      });
    }
  }, [formData]);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const initialFilters: FormFields = [
        ...Object.keys(searchData.aggregations),
        ...Object.keys(searchData.stats),
      ].map((key) => ({
        label: key,
        type: data[key]?.dataType,
        value1: "",
        value2: "",
      }));
      if (!formData || formData?.length < 1) {
        setFormData(initialFilters);
      }
    }
  }, [data]);

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
        {formData?.map(({ label, type, value1, value2 }) => {
          const metadata = data[label];
          if (type === "number") {
            return (
              <div className="w-2/6 p-2" key={label}>
                {stats[label] ? (
                  <MinMaxSlider
                    key={label}
                    minValue={stats[label].min}
                    maxValue={stats[label].max}
                    step={1}
                    onChange={(value) =>
                      updateFormField(label, {
                        value1: value,
                      })
                    }
                  />
                ) : (
                  <></>
                )}
              </div>
            );
          } else if (type === "string") {
            return (
              <div className="w-2/6 p-2 relative" key={label}>
                <Select
                  label={label}
                  options={
                    aggregations[label]
                      ? Object.entries(aggregations[label]).map(
                          ([key, val], index) => ({
                            id: key,
                            name: `${key} (${val})`,
                            value: `${key} (${val})`,
                          })
                        )
                      : []
                  }
                  defaultValue={value1
                    .toString()
                    .split(",")
                    .map((data) => ({
                      id: data,
                      name: `${data}`,
                      value: `${data}`,
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
                {stats[label] ? (
                  <DateRangePicker
                    label={label}
                    min={stats[label].min}
                    max={stats[label].max}
                    onChange={(startDate, endDate) =>
                      updateFormField(label, {
                        value1: startDate?.getTime(),
                        value2: endDate?.getTime(),
                      })
                    }
                  />
                ) : (
                  <></>
                )}
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
