import { NextApiRequest, NextApiResponse } from "next";
import dummyData from "../../dummy_data.json";
import { FormFields } from "@/hooks/filters-hooks";

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
  filters: FormFields;
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
  res: NextApiResponse<SearchResponse | { message: string }>
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
    filters,
    size = defaultSize,
    offset = 0,
  }: SearchRequest = req.body;

  if (!query) {
    results = searchData.slice(offset, -1);
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
  let filteredResults = applyFilters(results, filters);

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

    filteredResults.forEach((item: ISearchData) => {
      aggregateFields.forEach((field) => {
        const value = item[field];
        if (value) {
          // @ts-ignore
          aggregations[field][value] = (aggregations[field][value] || 0) + 1;
        }
      });

      statsFields.forEach((field) => {
        const value = item[field];
        // @ts-ignore
        if (isDateValid(value)) {
          // @ts-ignore
          statsData[field].push(new Date(item[field]).getTime());
        } else if (value) {
          // @ts-ignore
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

function applyFilters(results: ISearchData[], filters: FormFields) {
  if (!filters || filters.length === 0) {
    return results;
  }
  const applicableFilters = filters.filter(
    (filter) =>
      //@ts-ignore
      filter?.selection?.length > 0 ||
      filter.value ||
      (filter.min && filter.max)
  );
  if (!applicableFilters || applicableFilters.length === 0) {
    return results;
  }

  return results.filter((data) => {
    return applicableFilters.every((filter) => {
      switch (filter.type) {
        case "string": {
          const values = filter.selection?.map((data) => data.value) || [];
          //@ts-ignore
          return values.length === 0 || values.includes(data[filter.label]);
        }
        case "number": {
          const valueInData = data[filter.label];
          return (
            !filter.value ||
            //@ts-ignore
            (valueInData > filter.rangeMin && valueInData <= filter.value)
          );
        }
        case "date": {
          //@ts-ignore
          const valueInData = new Date(data[filter.label]).getTime();
          //@ts-ignore
          const minDate = new Date(filter.min).getTime();
          //@ts-ignore
          const maxDate = new Date(filter.max).getTime();
          return (
            !filter.min ||
            !filter.max ||
            (valueInData > minDate && valueInData <= maxDate)
          );
        }
        default: {
          return true;
        }
      }
    });
  });
}
