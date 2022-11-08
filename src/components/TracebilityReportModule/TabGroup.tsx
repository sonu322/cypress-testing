import React from "react";
import Tabs, { TabList, Tab } from "@atlaskit/tabs";
import { SelectedType } from "@atlaskit/tabs/types";

interface Props {
  options: string[];
  handleOptionSelect: (tabIndex: SelectedType) => void;
  selectedTabIndex: SelectedType;
  id: string;
}

export const TabGroup = ({
  options,
  handleOptionSelect,
  selectedTabIndex,
  id,
}: Props): JSX.Element => {
  const onChange = (tabIndex: SelectedType): void => {
    handleOptionSelect(tabIndex);
  };
  return (
    <Tabs id={id} onChange={onChange} selected={selectedTabIndex}>
      <TabList>
        {options.map((option) => (
          <Tab key={option}>{option}</Tab>
        ))}
      </TabList>
    </Tabs>
  );
};
