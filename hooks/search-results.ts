import { SearchRequest, SearchResponse } from "@/pages/api/search";
import { useQuery } from "react-query";

export const useSearchResults = (query: SearchRequest) => {
  return useQuery<SearchResponse>(
    ["searchResults", query],
    () =>
      fetch("/api/search", {
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
