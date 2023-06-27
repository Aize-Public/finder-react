import React, { useState } from "react";
import BooleanComponent from "./filters/boolean";
import DateSelector from "./filters/date";
import { Select, Option } from "./filters/select";

const Filters: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date("28-Jun-2023"));
  const [booleanValue, setBooleanValue] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option[] | null>(null);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleBooleanChange = (value: boolean) => {
    setBooleanValue(value);
  };

  const handleOptionChange = (option: Option[]) => {
    setSelectedOption(option);
  };

  const options: Option[] = [
    { id: 1, name: "Durward Reynolds", value: "Durward Reynolds" },
    { id: 2, name: "Kenton Towne", value: "Kenton Towne" },
    { id: 3, name: "Therese Wunsch", value: "Therese Wunsch" },
    { id: 4, name: "Benedict Kessler", value: "Benedict Kessler" },
    { id: 5, name: "Katelyn Rohan", value: "Katelyn Rohan" },
  ];

  return (
    <>
      <div className="flex flex-row">
        <div className="w-2/6">
          <DateSelector
            selectedDate={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="w-1/6">
          <BooleanComponent
            value={booleanValue}
            onChange={handleBooleanChange}
          />
        </div>

        <div className="w-3/6">
          <Select options={options} onChange={handleOptionChange} />
        </div>
      </div>
    </>
  );
};

export default Filters;
