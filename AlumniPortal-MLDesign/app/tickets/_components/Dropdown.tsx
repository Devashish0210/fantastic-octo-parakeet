import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export default function DropdownCustom({
  selectedKeys,
  setSelectedKeys,
  options,
}: {
  selectedKeys: Set<string>;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  options: string[];
}) {
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  return (
    <Dropdown classNames={{ trigger: "w-full" }}>
      <DropdownTrigger>
        <div className="flex justify-between items-center text-sm p-2 bg-[#F4F4F5]">
          <span className="">{selectedValue}</span>
          <span className="material-symbols-outlined">arrow_drop_down</span>
        </div>
      </DropdownTrigger>
      <DropdownMenu
        classNames={{ base: "h-64 overflow-auto w-[81vw]" }}
        aria-label="Select the category"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        //@ts-ignore
        onSelectionChange={setSelectedKeys}
      >
        {options.map((value) => (
          <DropdownItem key={value}>{value}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
