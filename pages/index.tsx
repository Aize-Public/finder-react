import SearchBar from "@/components/header";
import "../app/globals.css";
import Filters from "@/components/filters";
import Result from "@/components/results/result";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { SearchRequest } from "./api/search";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

const emptySearchRequest: SearchRequest = {
  query: " ",
  aggregate: "",
};

const Home: React.FC = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1200000,
        cacheTime: 1200000,
      },
    },
  });
  const [query, setQuery] = useState<SearchRequest>(emptySearchRequest);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="finder">
        <header className="bg-gray-800 py-4">
          <div className="container mx-auto px-1">
            <h1 className="text-white text-3xl font-bold">Finder</h1>
          </div>
        </header>
        <main className="flex flex-col px-24 py-4">
          <div className="py-4 pb-12 px-4">
            <SearchBar queryHandler={setQuery} query={query}></SearchBar>
          </div>
          <div className="py-4 px-4  bg-gray-200">
            <Filters></Filters>
          </div>
          <div className="py-4 px-4 bg-gray-50">
            <Result query={query}></Result>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Home;
