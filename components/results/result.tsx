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

interface Result {
  [key: string]: any;
}

interface ResultProps {
  query: SearchRequest;
}

const SearchResultsContext = createContext<any>(null);

const useSearchResults = (query: SearchRequest) => {
  return useQuery(
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
        }),
      }).then((response) => response.json()),
    {
      enabled: !!query,
    }
  );
};

const Result: React.FC<ResultProps> = ({ query }: ResultProps) => {
  const [updatedQuery, setUpdatedQuery] = useState(query);
  const { data, isLoading, isError, error } = useSearchResults(updatedQuery);

  useEffect(() => {
    setUpdatedQuery((prevUpdatedQuery) => ({
      ...prevUpdatedQuery,
      query: query.query,
    }));
  }, [query]);
  const memoizedContextValue = useMemo(() => data, [data]);

  const aggChangeHandler = (aggregations: string, stats: string) => {
    setUpdatedQuery({ ...query, aggregate: aggregations, stats: stats });
  };

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
    <SearchResultsContext.Provider value={memoizedContextValue}>
      <div className="py-4 px-4 bg-gray-200">
        <Filters
          onChangeHandler={aggChangeHandler}
          value={memoizedContextValue}
        />
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
        {data.results.map((result: any, index: number) => (
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

const useSearchResultsContext = (): SearchResponse => {
  const context = useContext(SearchResultsContext);
  if (!context) {
    throw new Error(
      "useSearchResultsContext must be used within a SearchResultsContextProvider"
    );
  }
  return context;
};

export { Result, useSearchResultsContext };
