import React from "react";
import Tabs, { TabList, Tab } from "@atlaskit/tabs";
import { SelectedType } from "@atlaskit/tabs/types";
import { TooltipContainer } from "../common/TooltipContainer";

interface Props {
  options: Array<{
    name: string;
    description: string;
  }>;
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
          <TooltipContainer key={option.name} content={option.description}>
            <Tab>{option.name}</Tab>
          </TooltipContainer>
        ))}
      </TabList>
    </Tabs>
  );
};
