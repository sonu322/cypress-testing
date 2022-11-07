import React from "react";
import styled from "styled-components";
import Tabs, { TabList, TabPanel, useTab } from "@atlaskit/tabs";
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
export const TableViewTabs = (): JSX.Element => {
  return (
    <Container>
      <Tabs
        tabs={tabs}
        selected={selectedTab}
        onSelect={(_tab, index) => this.selectTab(index)}
      />
    </Container>
  );
};
