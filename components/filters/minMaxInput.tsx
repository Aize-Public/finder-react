import React, { useState, ChangeEvent } from "react";

interface MinMaxSliderProps {
  minValue: number;
  maxValue: number;
  step?: number;
  onChange: (inputVal: number, key: string) => void;
  key: string;
}

const MinMaxSlider: React.FC<MinMaxSliderProps> = ({
  minValue,
  maxValue,
  step = 1,
  onChange,
  key,
}) => {
  const [value, setValue] = useState<number>(minValue);

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(Number(value));
  };

  const handleBlur = () => {
    const newValue = Math.max(minValue, Math.min(value, maxValue));
    setValue(newValue);
    onChange(newValue, key);
  };

  return (
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
  );
};

export default MinMaxSlider;
