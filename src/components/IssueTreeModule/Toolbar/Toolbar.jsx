import Page, { Grid, GridColumn } from "@atlaskit/page";
import React, { useState } from "react";
import { IssueTypeAPI, LinkTypeAPI, PriorityAPI } from "../../api";
import { Dropdown } from "./Dropdown";
import Button, { ButtonGroup } from "@atlaskit/button";
export const Toolbar = ({
  options,
  filter,
  updateKeyOptions,
  updateFilteredKeyOptions,
  keyNames,
}) => {
  return (
    <div>
      <Grid spacing="compact">
        <GridColumn medium={10}>
          <ButtonGroup>
            {options &&
              filter &&
              keyNames.map((keyName) => (
                <Dropdown
                  key={keyName}
                  keyName={keyName}
                  keyOptions={options[keyName]}
                  filteredKeyOptions={filter[keyName]}
                  updateFilteredKeyOptions={updateFilteredKeyOptions}
                  // api={IssueTypeAPI}
                />
              ))}
            {/* <Dropdown
              filter={filter}
              keyName={"issueTypes"}
              updateFilteredKeyOptions={updateFilteredKeyOptions}
              api={IssueTypeAPI}
              keyOptions={options.issueTypes}
            />
            <Dropdown
              filter={filter}
              keyName={"linkTypes"}
              updateKeyOptions={updateKeyOptions}
              updateFilteredKeyOptions={updateFilteredKeyOptions}
              api={LinkTypeAPI}
              keyOptions={options.linkTypes}
            />
            <Dropdown
              filter={filter}
              keyName={"priorities"}
              updateKeyOptions={updateKeyOptions}
              updateFilteredKeyOptions={updateFilteredKeyOptions}
              api={PriorityAPI}
              keyOptions={options.priorities}
            /> */}
          </ButtonGroup>
          {/* <LinkTypeDropdown
              filter={(data) => this.updateLinkTypeFilter(data)}
            />
            <PriorityDropdown
              filter={(data) => this.updatePriorityFilter(data)}
            /> */}
        </GridColumn>
      </Grid>
    </div>
  );
};
