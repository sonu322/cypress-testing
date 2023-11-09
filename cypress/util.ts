import { Filter } from "./types";
import s from "./selectors";

export const typeInput = (prefix: string, fieldName: string, value): void => {
  if (value === "") {
    cy.get(prefix + `[name="${fieldName}"]`).clear();
  } else {
    cy.get(prefix + `[name="${fieldName}"]`).clear();
    cy.get(prefix + `[name="${fieldName}"]`).type(value, { parseSpecialCharSequences: false });
  }
};

export const selectDropdownValues = (dropdownId: string, values: string[], prefix?: string): void => {
  prefix = prefix === undefined ? "" : prefix;
  dropdownId = dropdownId.trim();
  const dropdownBodyId = prefix + dropdownId + "-container ";
  cy.get(prefix + dropdownId).click();
  cy.get(dropdownBodyId + s.clearAllClassName).click();
  values.forEach(value => {
    cy.get(dropdownBodyId + dropdownId + "-" + value.toLowerCase().split(" ").join("-")).click();
  });
};

export const selectAllDropdownValues = (dropdownId: string, prefix?: string): void => {
  prefix = prefix === undefined ? "" : prefix;
  dropdownId = dropdownId.trim();
  const dropdownBodyId = prefix + dropdownId + "-container ";
  cy.get(prefix + dropdownId).click();
  cy.get(dropdownBodyId + s.selectAllClassName).click();
};

export const selectFilter = (filter: Filter, prefix?: string): void => {
  if(filter.priority !== undefined){
    selectDropdownValues(s.priorityDropdown, filter.priority, prefix);
  } else {
    selectAllDropdownValues(s.priorityDropdown, prefix);
  }
  cy.wait(1000);
  if(filter.issueType !== undefined){
    selectDropdownValues(s.issueTypeDropdown, filter.issueType, prefix);
  } else {
    selectAllDropdownValues(s.issueTypeDropdown, prefix);
  }
  cy.wait(1000);
  if(filter.linkType !== undefined){
    selectDropdownValues(s.linkTypeDropdown, filter.linkType, prefix);
  } else {
    selectAllDropdownValues(s.linkTypeDropdown, prefix);
  }
};

export const selectIssueCardFields = (fields: string[], prefix?: string): void => {
  if(fields !== undefined){
    selectDropdownValues(s.issueCardFieldsDropdown, fields, prefix);
  } else {
    selectAllDropdownValues(s.issueCardFieldsDropdown, prefix);
  }
};