import React, { useState } from "react";

interface BooleanProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const BooleanComponent: React.FC<BooleanProps> = ({ value, onChange }) => {
  const [booleanValue, setBooleanValue] = useState(value ? value : false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setBooleanValue(newValue);
    onChange(newValue);
  };

  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        checked={value}
        onChange={handleCheckboxChange}
        className="form-checkbox h-5 w-5 text-blue-500"
      />
      <span className="ml-2 text-sm text-gray-700">Label Text</span>
    </label>
  );
};

export default BooleanComponent;
