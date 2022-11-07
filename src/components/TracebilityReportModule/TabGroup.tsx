import React from "react";
import styled from "styled-components";
import Tabs, {
  TabList,
  TabPanel,
  useTab,
  Tab,
  useTabPanel,
} from "@atlaskit/tabs";
import { SelectedType } from "@atlaskit/tabs/types";
const Container = styled.div``;
// const tabs = [
//   {
//     label: "Issue Type View",
//     content: <TableContainer>{this.renderIssueTypeTable(data)}</TableContainer>,
//   },
//   {
//     label: "Links View",
//     content: <TableContainer>{this.renderLinkTable(data)}</TableContainer>,
//   },
// ];
interface Props {
  options: string[];
  handleOptionSelect: (tabIndex: SelectedType) => void;
  selectedTabIndex: SelectedType;
  id: string;
}

const CustomTabPanel = () => {
  const tabPanelAttributes = useTabPanel();
  console.log(tabPanelAttributes);
  return <div {...tabPanelAttributes}>asdfasdfasf</div>;
};
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
      <CustomTabPanel>adf</CustomTabPanel>
      <CustomTabPanel>adf</CustomTabPanel>
    </Tabs>
  );
};
