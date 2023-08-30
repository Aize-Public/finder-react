import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import "./result.scss";
import Filters from "../filters/filters";
import useFiltersHook, { FormField, FormFields } from "@/hooks/filters-hooks";
import { fetchMetaData } from "@/utilities/filters-fetch.utility";
import { Metadata } from "@/pages/api/meta";
import { generateHash } from "@/utilities/hash-generator.utility";
import { useRequestContext } from "@/pages";
import { keyBy } from "lodash";
import { compareFormData } from "@/utilities/compare-formdata";
import { ResultsGrid } from "../result-grid/result-grid";
import { useSearchResults } from "@/hooks/search-results";
import { ResultProps } from "./result.model";

const Result: React.FC<ResultProps> = () => {
  const { request, setRequest } = useRequestContext();

  const {
    data: metaData,
    isLoading: isLoadingMetaData,
    isError: isErrorMetaData,
    error: errorMetaData,
  } = useQuery<{ [key: string]: Metadata }>("searchMetaData", fetchMetaData);

  const {
    data: resultsData = null,
    isLoading,
    isError,
    error,
  } = useSearchResults(request);

  const { formData, setFormData, updateFormField, deleteFormField } =
    useFiltersHook(null);
  const prevFormDataValue = useRef(formData);

  const [availableFormData, setAvailableFormData] = useState<FormFields | []>(
    []
  );

  useEffect(() => {
    // @ts-ignore
    setFormData((prevFormData: FormFields) => {
      const formData: FormFields = [];
      let updateSelection = false;
      if (!isLoading && !isLoadingMetaData && metaData && resultsData) {
        const aggregationLabels = Object.keys(resultsData.aggregations);
        const statsLabel = Object.keys(resultsData.stats);
        const combinedLabels =
          prevFormData?.length > 0
            ? prevFormData.map((data: FormField) => data.label)
            : [...aggregationLabels, ...statsLabel];
        const existingLabels = prevFormData?.map(
          (data: FormField) => data.label
        );
        const labelToFormFieldLookup = keyBy(prevFormData, "label");
        if (
          prevFormData &&
          combinedLabels.every((arr2Item: string) =>
            existingLabels.includes(arr2Item)
          )
        ) {
          updateSelection = true;
        }

        combinedLabels.forEach((label: string) => {
          const meta = metaData[label];
          const dataType = meta.dataType;

          switch (dataType) {
            case "string": {
              const options = [];
              for (const [key, count] of Object.entries(
                resultsData.aggregations[label]
              )) {
                options.push({
                  id: generateHash(key),
                  name: `${key} (${count})`,
                  value: key,
                });
              }
              formData.push({
                label: label,
                type: dataType,
                options: options,
                selection: updateSelection
                  ? labelToFormFieldLookup[label].selection
                  : [],
              });
              break;
            }
            case "date":
            case "number": {
              formData.push({
                label: label,
                type: dataType,
                rangeMin: resultsData.stats[label]?.min,
                rangeMax: resultsData.stats[label]?.max,
                min: updateSelection
                  ? labelToFormFieldLookup[label]?.min
                  : undefined,
                max: updateSelection
                  ? labelToFormFieldLookup[label]?.max
                  : undefined,
                value: updateSelection
                  ? labelToFormFieldLookup[label]?.value
                  : undefined,
              });
              break;
            }
          }
        });
        return formData;
      }
      return prevFormData;
    });
  }, [resultsData, isLoading, isLoadingMetaData, metaData, setFormData]);

  /**
   * This use effect takes care of fidd list for add filter functionality
   */
  useEffect(() => {
    if (formData && formData?.length > 0 && metaData) {
      const filteredData = Object.entries(metaData).filter(
        (item1) => !formData.some((item2) => item1[0] === item2["label"])
      );
      const diff = filteredData.map(([label, metadata]) => {
        switch (metadata.dataType) {
          case "string": {
            return {
              label: label,
              type: metadata.dataType,
              options: Object.entries(metaData[label].values).map(
                ([key, value]) => ({
                  id: generateHash(value),
                  name: `${value} `,
                  value: value,
                })
              ),
            } as unknown as FormField;
          }
          case "date":
          case "number": {
            return {
              label: label,
              type: metadata.dataType,
              rangeMin: metaData[label]?.min,
              rangeMax: metaData[label]?.max,
            } as unknown as FormField;
          }
        }
      });
      // @ts-ignore
      setAvailableFormData(diff);
    }
  }, [formData, metaData, resultsData]);

  /**
   * This useEffect takes care of the aggregation and stats for the request to http.
   */
  useEffect(() => {
    if (formData && formData?.length) {
      /**
       * Here we wrote a function to identify if the form data selection or min/max values are same,
       * then possibly there are no changes on the form selection,
       * only the options have changed according to new data from search results aggregations and stats.
       * So lets not change the request and not let the http call fire.
       */
      if (
        prevFormDataValue.current &&
        compareFormData(prevFormDataValue.current, formData)
      ) {
        return;
      }
      prevFormDataValue.current = formData;
      const aggregate = formData
        ?.filter((data) => data.type === "string")
        .map((data) => data.label)
        .join(",");
      const stats = formData
        ?.filter((data) => data.type === "number" || data.type === "date")
        .map((data) => data.label)
        .join(",");
      // @ts-ignore
      setRequest((prevRequest) => ({
        ...prevRequest,
        aggregate,
        stats,
        filters: formData,
      }));
    }
  }, [formData, setRequest]);

  if (isError) {
    // @ts-ignore
    return <div>Error: {error?.message}</div>;
  }

  return (
    <>
      <div className="py-4 px-4 bg-gray-200">
        <Filters
          formData={formData}
          isLoadingMeta={isLoadingMetaData}
          isLoading={isLoading}
          setFormData={setFormData}
          updateFormField={updateFormField}
          availableFormData={availableFormData}
          setAvailableFormData={setAvailableFormData}
          deleteFormField={deleteFormField}
        />
      </div>
      <ResultsGrid isLoading={isLoading} results={resultsData} />
    </>
  );
};

export { Result };
