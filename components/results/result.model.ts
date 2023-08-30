import { SearchRequest, SearchResponse } from "@/pages/api/search";

export interface Result {
  [key: string]: any;
}
export interface ResultProps {
  request: SearchRequest;
}

export interface ResultsContext {
  results: SearchResponse | null;
  setResults: (arg0: SearchResponse) => void;
}

type MetaData = {
  [key: string]: {
    dataType: "string" | "date" | "number";
  };
};

type Aggregations = {
  [key: string]: {
    [key: string]: number;
  };
};

type Stats = {
  [key: string]: {
    min?: number;
    max?: number;
  };
};
