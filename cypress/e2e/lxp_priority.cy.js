const config = require('../util/config');
const util = require('../util/util');
const selectors = require('../selector/selectorfile');

describe('Jira login Test', () => {
  it('should log in, open an issue, and select priority', () => {
    util.loginToJira();

    cy.wait(4000);

    cy.visit(config.firstIssueURL());
    cy.wait(3000);

    // Click on the "link explorer" tab
    cy.get(selectors.linksExplorer).click();
    cy.wait(4000);

    // Click on the "Priority" button
    cy.get('span div:contains("Priority")').click();
    cy.get(selectors.priorityOptions).should('be.visible');
    cy.contains('button', 'Clear All').click();
    cy.get(selectors.priorityOptions).find('button[aria-checked="true"]').should('not.exist');
    cy.wait(3000);

    // Select multiple priority values
    cy.get(selectors.priorityOptions).contains("Lowest").click();
    cy.get(selectors.priorityOptions).contains("Highest").click();
    cy.get(selectors.priorityOptions).contains("Not Set").click();

    // Interaction with the search bar
    cy.get(selectors.searchInput).type('Medium');
    cy.get(selectors.searchInput).should('have.value', 'Medium');
    cy.get(selectors.searchInput).clear();
    cy.wait(3000);

    cy.get(selectors.priorityOptions).contains("High").should('be.visible');
    cy.get(selectors.priorityOptions).contains("Medium").should('be.visible');
    cy.get(selectors.priorityOptions).contains("Low").should('be.visible');

    cy.wait(2000);

    // Uncheck the options
    cy.get(selectors.priorityOptions).contains("Lowest").click();
    cy.get(selectors.priorityOptions).contains("Highest").click();
    
    // Click on the "Export CSV" button
    cy.get(selectors.exportCSVButton).click();
    cy.wait(2000);

    // Click on the "Get Help" link
    cy.get(selectors.getHelpLink).click();
  });
});
