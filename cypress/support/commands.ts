import config from "../config";
import * as u from "../util";
import s from "../selectors";
import { verifyTree } from "./verifyTree";
import { Tree } from "../types";

Cypress.Commands.addAll({
  visitAndLoginJira(){
    cy.visit(config.baseURL);
    cy.loginJira();
  },

  loginJira(){
    u.typeInput(s.loginDialog, s.emailFieldName, config.jiraUsername);
    u.typeInput(s.loginDialog, s.passwordFieldName, config.jiraPassword);
    cy.get(s.loginSubmit).click();
  },
  
  openJiraIssue(issueKey: string){
    const issueURL = `${config.baseURL}/browse/${issueKey}`;
    cy.visit(issueURL);
    cy.loginJira();
    cy.get(s.lxpTabId).contains("Links Explorer");
    cy.get(s.lxpTabId).click();
  },

  verifyTreeNodes(el: string, expected: Tree){
    verifyTree(el, expected);
  }
});