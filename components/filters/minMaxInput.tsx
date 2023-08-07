import React, { useState, ChangeEvent } from "react";

interface MinMaxSliderProps {
  minValue: number;
  maxValue: number;
  step?: number;
  onChange: (inputVal: number) => void;
  defaultValue: number;
  label: string;
}

const MinMaxSlider: React.FC<MinMaxSliderProps> = ({
  minValue,
  maxValue,
  step = 1,
  defaultValue,
  onChange,
  label,
}) => {
  const [value, setValue] = useState<number>(defaultValue);

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(Number(value));
  };

  const handleBlur = () => {
    onChange(value);
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm">{label}</span>
      <div className="flex">
        <input
          type="range"
          value={value}
          min={minValue}
          max={maxValue}
          step={step}
          onChange={handleSliderChange}
          onBlur={handleBlur}
          className="w-5/6"
        />
        <label className="w-1/6">{value}</label>
      </div>
    </div>
  );
};

export default MinMaxSlider;
