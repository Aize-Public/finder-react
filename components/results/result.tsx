import React from "react";
import { useQuery } from "react-query";
import "./result.scss";
import { SearchRequest } from "@/pages/api/search";

interface Result {
  [key: string]: any;
}

interface ResultProps {
  query: SearchRequest;
}

const Result: React.FC<ResultProps> = ({ query }: ResultProps) => {
  console.log(query);
  const { data, isLoading, isError, error } = useQuery("searchResults", () =>
    fetch("http://localhost:3000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "I",
        aggregate: "source,System,I/O TYPE",
      }),
    }).then((response) => response.json())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      <h1 className="px-2 pb-4">Search Results ({data.hits})</h1>
      <div className="flex headers py-2 border-b  bg-gray-200">
        {Object.entries(data.results[0])
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
  );
};

export default Result;
