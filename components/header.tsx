import { SearchRequest } from "@/pages/api/search";
import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";

interface SearchProps {
  query: SearchRequest;
  queryHandler: (query: SearchRequest) => void;
}

const SearchBar: React.FC<SearchProps> = ({ queryHandler, query }) => {
  const debouncedQueryHandler = debounce(queryHandler, 500);
  const queryStringHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedQuery = { ...query, query: event.target.value };
    debouncedQueryHandler(updatedQuery);
  };

  return (
    <>
      <div className=" w-full">
        <div className="flex items-center">
          <input
            type="text"
            className="w-full h-10 px-4 mr-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
            placeholder="Enter your search query..."
            onChange={queryStringHandler}
          />
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
