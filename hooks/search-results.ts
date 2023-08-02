import { SearchRequest } from "@/pages/api/search";
import { useQuery } from "react-query";

export const useSearchResults = (query: SearchRequest) => {
  return useQuery(
    ["searchResults", query],
    () =>
      fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.query,
          aggregate: "source,System,I/O TYPE",
        }),
      }).then((response) => response.json()),
    {
      enabled: !!query,
    }
  );
};
