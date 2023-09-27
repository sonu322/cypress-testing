import config from "../config";
import * as u from "../util";
import s from "../selectors";

Cypress.Commands.addAll({
  visitAndLoginJira(){
    cy.visit(config.baseURL);
    cy.loginJira();
  },

  loginJira(){
    u.typeInput(s.loginDialog, s.emailFieldName, config.jiraUsername);
    cy.get(s.loginSubmit).click();
    u.typeInput(s.loginDialog, s.passwordFieldName, config.jiraPassword);
    cy.get(s.loginSubmit).click();
    cy.wait(10000);
  },
  
  openJiraIssue(issueKey: string){
    const issueURL = `${config.baseURL}/browse/${issueKey}`;
    cy.visit(issueURL);
    cy.loginJira();
    cy.origin(config.baseURL, {args: {s}}, ({s}) => {
      cy.get(s.lxpTabId).contains("Links Explorer");
      cy.get(s.lxpTabId).click();
      cy.wait(10000);
    });
  }
});