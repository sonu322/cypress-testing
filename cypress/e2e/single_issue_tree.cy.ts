import { selectFilter } from "../util";
import s from "../selectors";
import { testcases } from "../fixtures/single_issue_tree"; // Import the test cases from the separate file


describe("template spec", () => {
  // testcases.forEach((tc, index) => {
  //   it(`Test Case ${index + 1}`, () => {
  //     cy.openJiraIssue(tcConfig.mainIssueId);
  //     selectFilter(tc.filter);
  //     cy.wait(5000);
  //     cy.verifyTreeNodes(s.lxpContainerRoot + s.lxpTreeContainer, tc.expected);
  //   });
  // });

  it("Test Case", () => {
    const tc = testcases[0]; // Change the index number to run the specific test case
    cy.openJiraIssue(tc.issueId);
    selectFilter(tc.filter);
    cy.wait(5000);
    cy.verifyTreeNodes(s.lxpContainerRoot + s.lxpTreeContainer, tc.expected);
    cy.wait(5000);

  });

});
