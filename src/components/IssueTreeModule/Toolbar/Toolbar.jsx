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
}) => {
  return (
    <div>
      <Grid spacing="compact">
        <GridColumn medium={10}>
          <ButtonGroup>
            <Dropdown
              options={options}
              filter={filter}
              keyName={"issueTypes"}
              updateKeyOptions={updateKeyOptions}
              updateFilteredKeyOptions={updateFilteredKeyOptions}
              api={IssueTypeAPI}
            />
            <Dropdown
              options={options}
              filter={filter}
              keyName={"linkTypes"}
              updateKeyOptions={updateKeyOptions}
              updateFilteredKeyOptions={updateFilteredKeyOptions}
              api={LinkTypeAPI}
            />
            <Dropdown
              options={options}
              filter={filter}
              keyName={"priorities"}
              updateKeyOptions={updateKeyOptions}
              updateFilteredKeyOptions={updateFilteredKeyOptions}
              api={PriorityAPI}
            />
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
