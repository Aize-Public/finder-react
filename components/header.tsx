import { SearchRequest } from "@/pages/api/search";
import { ChangeEvent, useState } from "react";

interface SearchProps {
  query: SearchRequest;
  queryHandler: (query: SearchRequest) => void;
}

const SearchBar: React.FC<SearchProps> = ({ queryHandler, query }) => {
  const [searchQuery, setSearchQuery] = useState<SearchRequest>(query);
  const queryStringHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedQuery = { ...searchQuery, query: event.target.value };
    setSearchQuery(updatedQuery);
    queryHandler(updatedQuery);
  };

  return (
    <>
      <div className=" w-full">
        <div className="flex items-center">
          <input
            type="text"
            className="w-full h-10 px-4 mr-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
            placeholder={searchQuery?.query}
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
