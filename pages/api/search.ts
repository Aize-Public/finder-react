import { NextApiRequest, NextApiResponse } from "next";
import dummyData from "../../dummy_data.json";

export interface SearchRequest {
  query: string;
  aggregate: string;
  size?: number;
  offset?: number;
}

export interface Aggregations {
  [key: string]: Record<string, number>;
}

export interface SearchResponse {
  hits: number;
  results: object[];
  aggregations: Aggregations;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  const defaultSize = 15;
  let results: SearchResponse[] = [];
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    query,
    aggregate,
    size = defaultSize,
    offset = 0,
  }: SearchRequest = req.body;

  if (!query) {
    dummyData.slice(offset, defaultSize);
  } else {
    results = dummyData.filter((item) =>
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

  const aggregations: Aggregations = {};

  if (aggregate) {
    const aggregateFields = aggregate.split(",");
    aggregateFields.forEach((field) => {
      aggregations[field] = {};
    });

    filteredResults.forEach((item) => {
      aggregateFields.forEach((field) => {
        const value = item[field];
        if (value) {
          aggregations[field][value] = (aggregations[field][value] || 0) + 1;
        }
      });
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
  };

  res.status(200).json(response);
}
