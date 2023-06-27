import { Fragment, useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export interface Option {
  id: number;
  name: string;
  value: string;
}

interface SelectProps {
  defaultValue?: Option[];
  options: Option[];
  onChange: (selectedOption: Option[]) => void;
}

export function Select({ options, defaultValue, onChange }: SelectProps) {
  const localDefaultValue = defaultValue ? defaultValue : [options[0]];
  const [selected, setSelected] = useState(localDefaultValue);
  const [isSelectAllSelected, setIsSelectAllSelected] = useState(false);

  const handleOptionChange = (option: Option) => {
    if (option.id === -1) {
      if (isSelectAllSelected) {
        setIsSelectAllSelected(false);
        setSelected([]);
      } else {
        setIsSelectAllSelected(true);
        setSelected(options.filter((opt) => opt.id !== -1));
      }
    } else {
      const localSelected = [...selected];
      const index = localSelected.findIndex((item) => item.id === option.id);
      if (index !== -1) {
        setIsSelectAllSelected(false);
        localSelected.splice(index, 1);
      } else {
        localSelected.push(option);
        localSelected.length === options.length
          ? setIsSelectAllSelected(true)
          : setIsSelectAllSelected(false);
      }
      setSelected(localSelected);
    }
  };

  const selectAllOption: Option = {
    id: -1,
    name: "Select All",
    value: "select-all",
  };

  return (
    <div className="absolute  ">
      <Listbox value={selected} onChange={handleOptionChange}>
        <Listbox.Button className="border w-full text-left bg-white border-gray-300 rounded-md px-2 py-2  focus:ring-blue-500 focus:border-blue-500">
          <div className="flex items-center justify-between">
            {isSelectAllSelected ? (
              "All Selected"
            ) : (
              <>
                {selected.map((selection) => selection.name + ", ")}
                {selected.length === 0 ? "Select an option" : ""}
              </>
            )}
            <ArrowDownIcon className="w-5 h-5 text-gray-400" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="border border-gray-300 rounded-md  relative  w-auto">
          <Listbox.Option
            key={selectAllOption.id}
            value={selectAllOption}
            as={Fragment}>
            {({ active }) => (
              <li
                className={`py-2 ${
                  active ? "bg-blue-500 text-white" : "bg-white text-black"
                }`}
                onClick={() => handleOptionChange(selectAllOption)}>
                <div className="flex items-center justify-between px-2 py-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelectAllSelected}
                      onChange={() => handleOptionChange(selectAllOption)}
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
                  onClick={() => handleOptionChange(option)}>
                  <div className="flex items-center justify-between px-2 py-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          selected.find((sel) => sel.id === option.id) !==
                          undefined
                        }
                        onChange={() => handleOptionChange(option)}
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
