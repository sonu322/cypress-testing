import { selectFilter } from "../util";
import s from "../selectors";
import { testcases } from "../fixtures/single_issue_tree"; // Import the test cases from the separate file
import { tcConfig } from "../fixtures/config";

describe("template spec", () => {
  before(() => {
    // This code will run once before the first test case
    cy.openJiraIssue(tcConfig.mainIssueId);
  });

  testcases.forEach((tc, index) => {
    it(`Test Case ${index + 1}`, () => {
      selectFilter(tc.filter);
      cy.wait(5000);
      cy.verifyTreeNodes(s.lxpContainerRoot + s.lxpTreeContainer, tc.expected);
    });
  });
});
