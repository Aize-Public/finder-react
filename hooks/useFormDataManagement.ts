//@ts-nocheck
import { generateHash } from "@/utilities/hash-generator.utility";
import { keyBy } from "lodash";
import { useState, useEffect } from "react";
import { FormField } from "./filters-hooks";

type UseFormDataProps = {
  resultsData: ResultsData | null;
  isLoading: boolean;
  isLoadingMetaData: boolean;
  metaData: MetaData | null;
};

const useFormData = (resultsData, isLoading, isLoadingMetaData, metaData) => {
  const [formData, setFormData] = useState<FormField[]>([]);

  const generateStringOptions = (aggregations, label) => {
    const options = [];
    for (const [key, count] of Object.entries(aggregations[label])) {
      options.push({
        id: generateHash(key),
        name: `${key} (${count})`,
        value: key,
      });
    }
    return options;
  };

  const getRangeFieldData = (stats, label, lookup, update) => {
    return {
      rangeMin: stats[label]?.min,
      rangeMax: stats[label]?.max,
      min: update ? lookup[label]?.min : undefined,
      max: update ? lookup[label]?.max : undefined,
      value: update ? lookup[label]?.value : undefined,
    };
  };

  const getCombinedLabels = (prevFormData, aggregations, stats) => {
    const aggregationLabels = Object.keys(aggregations);
    const statsLabel = Object.keys(stats);
    const existingLabels = prevFormData?.map((data) => data.label);
    return existingLabels && existingLabels.length > 0
      ? existingLabels
      : [...aggregationLabels, ...statsLabel];
  };

  useEffect(() => {
    if (isLoading || isLoadingMetaData || !metaData || !resultsData) {
      return;
    }

    const combinedLabels = getCombinedLabels(
      formData,
      resultsData.aggregations,
      resultsData.stats
    );
    const labelToFormFieldLookup = keyBy(formData, "label");
    const updateSelection =
      formData &&
      combinedLabels.every((label) => labelToFormFieldLookup[label]);

    const updatedFormData = combinedLabels.map((label) => {
      const meta = metaData[label];
      const dataType = meta.dataType;
      const baseField = {
        label: label,
        type: dataType,
      };

      switch (dataType) {
        case "string":
          return {
            ...baseField,
            options: generateStringOptions(resultsData.aggregations, label),
            selection: updateSelection
              ? labelToFormFieldLookup[label].selection
              : [],
          };
        case "date":
        case "number":
          return {
            ...baseField,
            ...getRangeFieldData(
              resultsData.stats,
              label,
              labelToFormFieldLookup,
              updateSelection
            ),
          };
        default:
          return baseField;
      }
    });

    setFormData(updatedFormData);
  }, [resultsData, isLoading, isLoadingMetaData, metaData]);

  return formData;
};

export default useFormData;
