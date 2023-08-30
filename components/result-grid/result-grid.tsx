import { SearchResponse } from "@/pages/api/search";
import LoadingBox from "../filters/filters-loader/filters-loader";
import { memo } from "react";

export interface ResultsGridProps {
  results: SearchResponse | null;
  isLoading: boolean;
}
export const NUMBER_OF_COLUMNS = 12;

const ResultsGridComponent: React.FC<ResultsGridProps> = ({
  results,
  isLoading,
}) => {
  if (isLoading) {
    return <LoadingBox items={15} orientation="vertical" />;
  }
  if (!results?.results.length) {
    return <div>No results</div>;
  }
  return (
    <div>
      <h1 className="px-2 pb-4">Search Results ({results?.hits})</h1>
      <div className="flex headers py-2 border-b bg-gray-200">
        {results &&
          results.hits > 0 &&
          Object.entries(results?.results[0])
            .slice(0, NUMBER_OF_COLUMNS)
            .map(([key, _]) => (
              <div
                key={key}
                className="header px-2 overflow-hidden whitespace-nowrap overflow-ellipsis border-r">
                {key}
              </div>
            ))}
      </div>
      {results?.results.map((result: any, index: number) => (
        <div key={index} className="flex results bg-gray-100">
          {Object.entries(result)
            .slice(0, NUMBER_OF_COLUMNS)
            .map(([key, value]: [key: string, value: any]) => (
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

export const ResultsGrid = memo(ResultsGridComponent);
