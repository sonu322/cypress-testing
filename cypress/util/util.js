// import selectors from '../selector/selectorfile';

// export function login(username, password) {
//   cy.visit('http://localhost:8080/');
//   cy.get(selectors.UserFieldName).type(sonu);
//   cy.get(selectors.passwordFieldName).type(admin);
//   cy.wait(2000);
//   cy.get(selectors.loginButton).click();
//   cy.get(selectors.linksExplorer, { timeout: 10000 }).should('be.visible');
// }

const config = require('./config');
const selectors = require('../selector/selectorfile'); 
const loginToJira = () => {
  cy.visit(config.baseURL+"/login.jsp");
  // cy.url().should('eq', config.baseURL);
  cy.get(selectors.userFieldName).type(config.jiraUsername);
  cy.get(selectors.passwordFieldName).type(config.jiraPassword);
  cy.get(selectors.loginButton).click();
};

module.exports = {
  loginToJira
};


