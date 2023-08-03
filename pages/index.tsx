import SearchBar from "@/components/header";
import "../app/globals.css";
import { Result } from "@/components/results/result";
import { QueryClient, QueryClientProvider } from "react-query";
import { createContext, useContext, useState } from "react";
import { SearchRequest } from "./api/search";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Analytics } from "@vercel/analytics/react";

interface RequestContextType {
  request: SearchRequest;
  setRequest: (request: SearchRequest) => void;
}

const RequestContext = createContext<RequestContextType | null>(null);

export const emptySearchRequest: SearchRequest = {
  query: " ",
  aggregate: "System,Discipline",
  stats: "CALIBRATED RANGE MAX",
  filters: [],
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1200000,
      cacheTime: 1200000,
    },
  },
});

const Home: React.FC = () => {
  const [request, setRequest] = useState<SearchRequest>(emptySearchRequest);

  return (
    <>
      <RequestContext.Provider value={{ request, setRequest }}>
        <QueryClientProvider client={queryClient}>
          <div className="finder">
            <header className="bg-gray-800 py-4">
              <div className="container mx-auto px-1">
                <h1 className="text-white text-3xl font-bold">Finder</h1>
              </div>
            </header>
            <main className="flex flex-col px-24 py-4">
              <div className="py-4 pb-12 px-4">
                <SearchBar
                  queryHandler={setRequest}
                  query={request}></SearchBar>
              </div>

              <div className="py-4 px-4 bg-gray-50">
                <Result request={request}></Result>
              </div>
            </main>
          </div>
        </QueryClientProvider>
      </RequestContext.Provider>
      <Analytics />
    </>
  );
};

export default Home;

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error(
      "useRequestContext must be used within a RequestContextProvider"
    );
  }
  return context;
};
