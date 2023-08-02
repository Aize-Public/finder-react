import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Import the styles for DateRange
import { CalendarIcon } from "@heroicons/react/20/solid";
export interface Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}

interface DateRangePickerProps {
  label: string;
  min?: number; // Make 'min' optional since it has a default value
  max?: number; // Make 'max' optional since it has a default value
  onChange: (range: Range) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  min,
  max,
  onChange,
}) => {
  const [showDateRange, setShowDateRange] = useState(false);
  const today = new Date();
  const minDate = min ? new Date(min) : today;
  const maxDate = max ? new Date(max) : new Date(today.getTime() + 86400000); // Adding 1 day in milliseconds

  const [dateRange, setDateRange] = useState<Range>({
    startDate: undefined,
    endDate: undefined,
    key: "selection",
  });

  const handleDateRangeChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    const newStartDate = startDate
      ? startDate < minDate
        ? minDate
        : startDate
      : null;
    const newEndDate = endDate ? (endDate > maxDate ? maxDate : endDate) : null;
    setDateRange({
      startDate: newStartDate,
      endDate: newEndDate,
      key: "selection",
    });
  };

  useEffect(() => {
    if (
      dateRange.startDate &&
      dateRange.endDate &&
      dateRange.endDate > dateRange.startDate
    ) {
      console.log("hide popover");
      setShowDateRange(false);
      onChange({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        key: label,
      });
    }
  }, [dateRange]);

  const handleDateRange = () => {
    setShowDateRange(!showDateRange);
  };

  return (
    <div className="relative">
      <input
        type="input"
        className="border w-full text-left bg-white border-gray-300 rounded-md px-2 py-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={handleDateRange}
        value={
          dateRange.endDate &&
          dateRange.startDate &&
          dateRange.endDate > dateRange.startDate
            ? `${label} is between ${dateRange.startDate?.toLocaleDateString()} - ${dateRange.endDate?.toLocaleDateString()}`
            : label
        }
      />
      <CalendarIcon className="absolute w-5 h-5 text-gray-400 top-2 right-2" />

      {showDateRange && (
        <div className="relative">
          <DateRange
            className="absolute top-0 left-0 z-10"
            ranges={[dateRange]}
            onChange={handleDateRangeChange}
            minDate={minDate}
            maxDate={maxDate}
            editableDateInputs // Allow manual date input
            dragSelectionEnabled // Enable drag selection of date range
            rangeColors={["#1E40AF"]} // Customize the range selection color
            showDateDisplay={false}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
