import { FormField, FormFields } from "@/hooks/filters-hooks";
import { Popover } from "@headlessui/react";

interface AddFilterProps {
  availableFormData: FormFields;
  addFilter: (arg0: FormField) => void;
}

export const AddFilter: React.FC<AddFilterProps> = ({
  availableFormData,
  addFilter,
}) => {
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="p-2 w-full bg-blue-200 text-blue-800 rounded-md shadow-md hover:bg-blue-300 focus:outline-none focus:ring focus:ring-blue-300">
            Add Filter{" "}
          </Popover.Button>

          <Popover.Panel className="border border-gray-300 bg-white	 rounded-md absolute max-h-60 z-20  overflow-y-auto w-full">
            {availableFormData.map((filter) => (
              <span key={filter.label}>
                <button
                  className="p-2 w-full text-left	  bg-white text-blue-800 hover:bg-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                  onClick={addFilter.bind(null, filter)}>
                  {filter.label}
                </button>
              </span>
            ))}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};
