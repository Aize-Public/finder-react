import React, { useState } from "react";

interface DateSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onChange,
}) => {
  const [date, setDate] = useState(
    selectedDate ? selectedDate : new Date().toISOString().slice(0, 10)
  );
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateString = event.target.value;
    const selectedDate = new Date(selectedDateString);
    setDate(selectedDate.toISOString().slice(0, 10));
    onChange(selectedDate);
  };

  return (
    <input
      type="date"
      value={selectedDate.toISOString().slice(0, 10)}
      onChange={handleDateChange}
      className="px-2 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default DateSelector;
