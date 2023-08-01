import config from "../config";
import * as u from "../util";
import s from "../selectors";
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.addAll({
  loginJira(){
    console.log(config.baseURL);
    cy.visit(config.baseURL);
    console.log("u: ", u);
    u.typeInput(s.loginDialog, s.emailFieldName, config.jiraUsername);
    cy.get(s.loginSubmit).click();
    u.typeInput(s.loginDialog, s.passwordFieldName, config.jiraPassword);
    cy.get(s.loginSubmit).click();
    cy.wait(10000);
  },
  
  openJiraIssue(issueKey: string){
    const issueURL = `${config.baseURL}/browse/${issueKey}`;
    cy.visit(issueURL);
    cy.get(s.lxpTabId).contains("Links Explorer");
  }
});