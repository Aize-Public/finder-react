import { Fragment, useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export interface Option {
  id: string;
  name: string;
  value: string;
}

interface SelectProps {
  label: string;
  defaultValue: Option[];
  options: Option[];
  onChange: (selectedOption: Option[], label: string) => void;
}

export function Select({
  label,
  options,
  defaultValue,
  onChange,
}: SelectProps) {
  const [selected, setSelected] = useState<Option[]>(defaultValue);
  const isSelectAllSelected = selected?.length === options.length;

  const toggleSelectAll = () => {
    const selection = isSelectAllSelected ? [] : options;
    setSelected(selection);
    onChange(selection, label);
  };

  const toggleOption = (option: Option) => {
    setSelected((prevSelected) => {
      const selection = prevSelected?.some((item) => item.id === option.id)
        ? prevSelected.filter((item) => item.id !== option.id)
        : [...prevSelected, option];
      onChange(selection, label);
      return selection;
    });
  };

  const selectAllOption: Option = {
    id: "-1",
    name: "Select All",
    value: "select-all",
  };

  return (
    <div className="relative select-component">
      <Listbox value={selected}>
        <Listbox.Button className="border w-full text-left bg-white border-gray-300 rounded-md px-2 py-2  focus:ring-blue-500 focus:border-blue-500">
          <div className="flex items-center justify-between  w-full">
            {selected?.length > 0 ? (
              <div className="overflow-hidden truncate">
                <span>{label} is </span>
                <span className="font-bold">
                  {selected.map((sel) => sel.name).join(", ")}
                </span>
              </div>
            ) : (
              label
            )}
            <ArrowDownIcon className="w-5 h-5 text-gray-400" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="border border-gray-300 rounded-md absolute max-h-60 z-20  overflow-y-auto w-full">
          <Listbox.Option
            key={selectAllOption.id}
            value={selectAllOption}
            as={Fragment}>
            {({ active }) => (
              <li
                className={`py-2 ${
                  active ? "bg-blue-500 text-white" : "bg-white text-black"
                }`}
                onClick={toggleSelectAll}>
                <div className="flex items-center justify-between px-2 py-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelectAllSelected}
                      onChange={toggleSelectAll}
                      className="form-checkbox h-5 w-5 text-blue-500"
                    />
                    <span>{selectAllOption.name}</span>
                  </label>
                </div>
              </li>
            )}
          </Listbox.Option>
          {options.map((option: Option) => (
            <Listbox.Option key={option.id} value={option} as={Fragment}>
              {({ active }) => (
                <li
                  className={`py-2 ${
                    active ? "bg-blue-500 text-white" : "bg-white text-black"
                  }`}
                  onClick={() => toggleOption(option)}>
                  <div className="flex items-center justify-between px-2 py-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected?.some((sel) => sel.id === option.id)}
                        onChange={() => toggleOption(option)}
                        className="form-checkbox h-5 w-5 text-blue-500"
                      />
                      <span>{option.name}</span>
                    </label>
                  </div>
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
