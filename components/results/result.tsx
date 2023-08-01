import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "react-query";
import "./result.scss";
import { SearchRequest, SearchResponse } from "@/pages/api/search";
import Filters from "../filters/filters";
import useFiltersHook, { FormField, FormFields } from "@/hooks/filters-hooks";
import { fetchMetaData } from "@/utilities/filters-fetch.utility";
import { Metadata } from "@/pages/api/meta";
import { generateHash } from "@/utilities/hash-generator.utility";
import { useRequestContext } from "@/pages";

interface Result {
  [key: string]: any;
}

interface ResultProps {
  request: SearchRequest;
}

interface ResultsContext {
  results: SearchResponse;
  setResults: (arg0: SearchResponse) => void;
}

const emptyData = null;

export const SearchResultsContext = createContext<ResultsContext>(null);

const useSearchResults = (query: SearchRequest) => {
  return useQuery<SearchResponse>(
    ["searchResults", query],
    () =>
      fetch("http://localhost:3000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.query,
          aggregate: query.aggregate,
          stats: query.stats,
          filters: query.filters,
        }),
      }).then((response) => response.json()),
    {
      enabled: !!query,
    }
  );
};

const Result: React.FC<ResultProps> = () => {
  const { request, setRequest } = useRequestContext();

  const {
    data: metaData,
    isLoading: isLoadingMetaData,
    isError: isErrorMetaData,
    error: errorMetaData,
  } = useQuery<{ [key: string]: Metadata }>("searchMetaData", fetchMetaData);
  const {
    data = emptyData,
    isLoading,
    isError,
    error,
  } = useSearchResults(request);

  const { formData, setFormData, updateFormField } = useFiltersHook(null);

  const [results, setResults] = useState<SearchResponse>(data);

  const [availableFormData, setAvailableFormData] = useState<FormFields>([]);

  useEffect(() => {
    setResults(data);
  }, [data]);

  useEffect(() => {
    setFormData((prevFormData) => {
      const formData: FormFields = [];
      if (!isLoading && !isLoadingMetaData && metaData && data) {
        const aggregationLabels = Object.entries(data?.aggregations).map(
          ([label, _]) => label
        );
        const statsLabel = Object.entries(data?.stats).map(
          ([label, _]) => label
        );
        Object.entries(metaData).forEach(([label, meta]) => {
          // if aggregation label is included in meta
          if (aggregationLabels.includes(label) || statsLabel.includes(label)) {
            switch (meta.dataType) {
              case "string": {
                formData.push({
                  label: label,
                  type: meta.dataType,
                  options: Object.entries(data?.aggregations[label]).map(
                    ([label, count]) => ({
                      id: generateHash(label),
                      name: `${label} (${count})`,
                      value: label,
                    })
                  ),
                } as unknown as FormField);
                break;
              }
              case "date":
              case "number": {
                formData.push({
                  label: label,
                  type: meta.dataType,
                  rangeMin: data?.stats[label].min,
                  rangeMax: data?.stats[label].max,
                } as unknown as FormField);
              }
            }
          }
        });
        return formData;
      }
      return prevFormData;
    });
  }, [data, isLoading, isLoadingMetaData, metaData, setFormData]);

  useEffect(() => {
    if (formData?.length > 0 && metaData) {
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
      setAvailableFormData(diff);
    }
  }, [formData, metaData, results]);

  useEffect(() => {
    if (formData?.length > 1) {
      const aggregate = formData
        ?.filter((data) => data.type === "string")
        .map((data) => data.label)
        .join(",");
      const stats = formData
        ?.filter((data) => data.type === "number" || data.type === "date")
        .map((data) => data.label)
        .join(",");
      setRequest((prevRequest) => ({ ...prevRequest, aggregate, stats }));
    }
  }, [formData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (!data?.results.length) {
    return <div>No results</div>;
  }

  return (
    <SearchResultsContext.Provider value={{ results, setResults }}>
      <div className="py-4 px-4 bg-gray-200">
        {formData && results && (
          <Filters
            formData={formData}
            setFormData={setFormData}
            updateFormField={updateFormField}
            availableFormData={availableFormData}
            setAvailableFormData={setAvailableFormData}
          />
        )}
      </div>
      <div>
        <h1 className="px-2 pb-4">Search Results ({data.hits})</h1>
        <div className="flex headers py-2 border-b bg-gray-200">
          {Object.entries(data?.results[0])
            .slice(0, 8)
            .map(([key, value]) => (
              <div
                key={key}
                className="header px-2 overflow-hidden whitespace-nowrap overflow-ellipsis border-r">
                {key}
              </div>
            ))}
        </div>
        {data?.results.map((result: any, index: number) => (
          <div key={index} className="flex results bg-gray-100">
            {Object.entries(result)
              .slice(0, 8)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="result px-2 py-2 overflow-hidden whitespace-nowrap overflow-ellipsis border-r">
                  {value}
                </div>
              ))}
          </div>
        ))}
      </div>
    </SearchResultsContext.Provider>
  );
};

const useSearchResultsContext = (): ResultsContext => {
  const context = useContext(SearchResultsContext);
  if (!context) {
    throw new Error(
      "useSearchResultsContext must be used within a SearchResultsContextProvider"
    );
  }
  return context;
};

export { Result, useSearchResultsContext };
