import config from "../config";

describe("template spec", () => {
  it("login", () => {
    cy.loginJira();
    cy.origin(config.baseURL, () => {
      cy.openJiraIssue("SSPA-10");
    });
  });
});