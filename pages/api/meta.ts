import { NextApiRequest, NextApiResponse } from "next";
import dummyData from "../../dummy_data.json";

interface Data {
  [key: string]: any;
}

export interface Metadata {
  dataType: string;
  values: any[];
  min?: string | number;
  max?: string | number;
  trueCount?: number;
  falseCount?: number;
}

interface ParsedValue {
  dataType: string;
  parsedValue: any;
}

function parseValue(value: any): ParsedValue {
  if (typeof value === "number") {
    return {
      dataType: "number",
      parsedValue: value,
    };
  }

  if (typeof value === "string") {
    if (!isNaN(Number(value))) {
      return {
        dataType: "number",
        parsedValue: parseFloat(value),
      };
    }

    if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
      return {
        dataType: "boolean",
        parsedValue: value.toLowerCase() === "true",
      };
    }

    try {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        return {
          dataType: "date",
          parsedValue: parsedDate.getTime(),
        };
      }
    } catch (error) {
      console.error("Error parsing date value:", value);
      console.error(error);
    }
  }

  return {
    dataType: "string",
    parsedValue: value.toString(),
  };
}

const metaCache: { [key: string]: any } = {};
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cacheRes = metaCache["metadata"];
  if (metaCache["metadata"]) {
    res.status(200).json(cacheRes);
  } else {
    try {
      const data = dummyData as Data[];
      const metadata: { [key: string]: Metadata } = {};

      for (const row of data) {
        for (const key in row) {
          if (row.hasOwnProperty(key)) {
            const value = row[key];

            if (!metadata[key]) {
              metadata[key] = {
                dataType: "",
                values: [],
              };
            }

            if (!metadata[key].values.includes(value)) {
              metadata[key].values.push(value);
            }

            if (metadata[key].dataType === "") {
              const { dataType } = parseValue(value);
              metadata[key].dataType = dataType;
            }

            if (
              metadata[key].dataType === "number" ||
              metadata[key].dataType === "date"
            ) {
              const parsedValue = parseValue(value).parsedValue;
              metadata[key].values = metadata[key].values.map((val) =>
                val === value ? parsedValue : val
              );
            }
          }
        }
      }

      for (const key in metadata) {
        const metadataItem = metadata[key];
        switch (metadataItem.dataType) {
          case "number":
          case "date":
            metadataItem.min = Math.min(...metadataItem.values);
            metadataItem.max = Math.max(...metadataItem.values);
            break;
          case "boolean":
            metadataItem.trueCount = metadataItem.values.filter(Boolean).length;
            metadataItem.falseCount =
              metadataItem.values.length - metadataItem.trueCount;
            break;
        }
      }
      metaCache["metadata"] = metadata;
      // Return the metadata as JSON response
      res.status(200).json(metadata);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the data." });
    }
  }
}
