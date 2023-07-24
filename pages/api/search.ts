import { NextApiRequest, NextApiResponse } from "next";
import dummyData from "../../dummy_data.json";

function isDateValid(dateString: string) {
  const parsedDate = new Date(dateString);
  return !isNaN(parsedDate.getTime());
}

export interface SearchRequest {
  query: string;
  aggregate: string;
  stats: string;
  size?: number;
  offset?: number;
}

export interface AggregationsOrStats {
  [key: string]: Record<string, number> | MinMaxValues;
}

export interface MinMaxValues {
  min: number;
  max: number;
}

export interface SearchResponse {
  hits: number;
  results: object[];
  aggregations: AggregationsOrStats;
  stats: AggregationsOrStats;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  const defaultSize = 15;
  const searchData = dummyData as ISearchData[];
  let results: ISearchData[] = [];
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    query,
    aggregate,
    stats,
    size = defaultSize,
    offset = 0,
  }: SearchRequest = req.body;

  if (!query) {
    results = searchData.slice(offset, defaultSize);
  } else {
    results = searchData.filter((item) =>
      Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(query.toLowerCase());
        }
        return false;
      })
    );
  }
  if (offset && query) {
    results = results.slice(offset);
  }

  let filteredResults = results;

  const aggregations: AggregationsOrStats = {};
  const stat: AggregationsOrStats = {};
  const statsData: { [key: string]: number[] } = {};

  if (aggregate || stats) {
    const aggregateFields = aggregate.split(",");
    const statsFields = stats.split(",");
    aggregateFields.forEach((field) => {
      aggregations[field] = {};
    });
    statsFields.forEach((field) => {
      statsData[field] = [];
    });

    filteredResults.forEach((item) => {
      aggregateFields.forEach((field) => {
        const value = item[field];
        if (value) {
          aggregations[field][value] = (aggregations[field][value] || 0) + 1;
        }
      });

      statsFields.forEach((field) => {
        const value = item[field];
        if (isDateValid(value)) {
          statsData[field].push(new Date(item[field]).getTime());
        } else if (value) {
          statsData[field].push(item[field]);
        }
      });
    });

    Object.keys(statsData).forEach((data) => {
      const minMax: MinMaxValues = {
        min: Math.min(...statsData[data]),
        max: Math.max(...statsData[data]),
      };
      stat[data] = minMax;
    });
  }

  const hits = filteredResults.length;

  if (size && size !== 0) {
    filteredResults = filteredResults.slice(0, size);
  } else {
    filteredResults = [];
  }

  const response: SearchResponse = {
    hits,
    results: filteredResults,
    aggregations,
    stats: stat,
  };

  res.status(200).json(response);
}
