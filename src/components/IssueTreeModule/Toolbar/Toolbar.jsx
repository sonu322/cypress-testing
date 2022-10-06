import Page, { Grid, GridColumn } from "@atlaskit/page";
import React, { useState } from "react";
import { IssueTypeAPI, LinkTypeAPI, PriorityAPI } from "../../api";
import { Dropdown } from "./Dropdown";
import Button, { ButtonGroup } from "@atlaskit/button";
export const Toolbar = ({
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
              filter={filter}
              keyName={"issueTypes"}
              updateFilteredKeyOptions={updateFilteredKeyOptions}
              api={IssueTypeAPI}
            />
            <Dropdown
              filter={filter}
              keyName={"linkTypes"}
              updateKeyOptions={updateKeyOptions}
              updateFilteredKeyOptions={updateFilteredKeyOptions}
              api={LinkTypeAPI}
            />
            <Dropdown
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
