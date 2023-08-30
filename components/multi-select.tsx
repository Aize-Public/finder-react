// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

export interface Option {
  id: string;
  name: string;
  value: string;
}

const defaultData: Option[] = [
  {
    id: "Wade Cooper",
    name: "Wade Cooper",
    value: "Wade Cooper",
  },
  {
    id: "Arlene Mccoy",
    name: "Arlene Mccoy",
    value: "Arlene Mccoy",
  },
  {
    id: "Devon Webb",
    name: "Devon Webb",
    value: "Devon Webb",
  },
];

interface MultiSelectProps {
  label: string;
  defaultValue: Option[];
  options: Option[];
  onChange: (selectedOption: Option[], label: string) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options = [],
  defaultValue = [],
  onChange = (sel) => console.log(sel),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selection, setSelection] = useState<Option[]>(defaultValue);
  const dropdownRef = useRef<HTMLElement>(null);

  //@ts-ignore
  const handleClickOutside = (event: React.MouseEvent<HTMLElement>) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen && selection.length > 0) {
      onChange(selection, label);
      setSelection([]);
    }
  }, [isOpen, selection]);

  function isSelected(value: Option) {
    return selection.find((el) => el === value) ? true : false;
  }

  function handleSelect(value: Option) {
    let selectedItemUpdated;
    if (!isSelected(value)) {
      selectedItemUpdated = [
        ...selection,
        options.find((el) => el.id === value.id),
      ];
      setSelection(selectedItemUpdated);
    } else {
      selectedItemUpdated = selection.filter((el) => el.id !== value.id);
      setSelection(selectedItemUpdated);
    }
    setIsOpen(true);
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-xs mx-auto">
        <Listbox
          as="div"
          className="space-y-1"
          value={selection}
          onChange={(value) => handleSelect(value)}
          ref={dropdownRef}
          open={isOpen}>
          {() => (
            <>
              <div className="relative">
                <span className="inline-block w-full rounded-md shadow-sm">
                  <Listbox.Button
                    className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    onClick={() => setIsOpen(!isOpen)}
                    open={isOpen}>
                    <span className="block truncate">
                      {selection.length < 1
                        ? `${label}`
                        : ` ${label} is (${selection
                            .map((data) => data.value)
                            .join(",")})`}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor">
                        <path
                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Listbox.Button>
                </span>

                <Transition
                  unmount={false}
                  show={isOpen}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  className="absolute mt-1 z-10 w-full rounded-md bg-white shadow-lg">
                  <Listbox.Options
                    static
                    className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
                    {options.map((person) => {
                      const selected = isSelected(person);
                      return (
                        <Listbox.Option key={person.id} value={person}>
                          {({ active }) => (
                            <div
                              className={`${
                                active
                                  ? "text-white bg-blue-600"
                                  : "text-gray-900"
                              } cursor-default select-none relative py-2 pl-8 pr-4`}>
                              <span
                                className={`${
                                  selected ? "font-semibold" : "font-normal"
                                } block truncate`}>
                                {person.value}
                              </span>
                              {selected && (
                                <span
                                  className={`${
                                    active ? "text-white" : "text-blue-600"
                                  } absolute inset-y-0 left-0 flex items-center pl-1.5`}>
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          )}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
    </div>
  );
};
