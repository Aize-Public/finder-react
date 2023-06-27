import { NextApiRequest, NextApiResponse } from "next";
import dummyData from "../../dummy_data.json";

interface Data {
  [key: string]: any;
}

interface Metadata {
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = dummyData as Data[];

    const metadata: { [key: string]: Metadata } = {};

    data.forEach((row) => {
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

          const { dataType, parsedValue } = parseValue(value);

          switch (dataType) {
            case "number":
              metadata[key].dataType = dataType;
              metadata[key].values = metadata[key].values.map((val) =>
                val === value ? parsedValue : val
              );
              metadata[key].min = Math.min(...metadata[key].values);
              metadata[key].max = Math.max(...metadata[key].values);
              break;
            case "date":
              metadata[key].dataType = dataType;
              metadata[key].values = metadata[key].values.map((val) =>
                val === value ? parsedValue : val
              );
              metadata[key].min = Math.min(...metadata[key].values);

              metadata[key].max = Math.max(...metadata[key].values);
              break;
            case "boolean":
              metadata[key].dataType = dataType;
              metadata[key].values = metadata[key].values.map((val) =>
                val === value ? parsedValue : val
              );
              const trueCount = metadata[key].values.filter(Boolean).length;
              const falseCount = metadata[key].values.length - trueCount;
              metadata[key].trueCount = trueCount;
              metadata[key].falseCount = falseCount;
              break;
            default:
              metadata[key].dataType = dataType;
              break;
          }
        }
      }
    });

    // Return the metadata as JSON response
    res.status(200).json(metadata);
  } catch (error) {
    console.error(error);
  }
}
