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
                />
              ))}
          </ButtonGroup>
        </GridColumn>
      </Grid>
    </div>
  );
};
