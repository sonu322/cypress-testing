const config = require('../util/config');
const util = require('../util/util');
const selectors = require('../selector/selectorfile');

describe('Jira login Test', () => {
  it('should log in, open an issue, and select issue link type', () => {
    util.loginToJira();

    cy.wait(5000);

    cy.visit(config.firstIssueURL());
    cy.wait(5000);

    // Click on the "link explorer" tab
    cy.get(selectors.linksExplorer).click();
    cy.wait(4000);

    // Click on the "Issue Link Type" button
    cy.contains('Issue Link Type').click();
    cy.get(selectors.issueLinkTypeOptions).should('be.visible');
    cy.wait(3000);
    cy.contains('button', 'Clear All').click();
    cy.wait(2000);
    
    // Select multiple issue link types
    cy.get(selectors.issueLinkTypeOptions).contains('Parent').click();
    cy.get(selectors.issueLinkTypeOptions).contains('Clones').click();
    cy.get(selectors.issueLinkTypeOptions).contains('Blocks').click();
    cy.wait(3000);

    // Interaction with the search bar
    const searchText = 'x'; // Replace with your search query
    cy.get(selectors.searchInput).type(searchText);

    // Verify the input value
    cy.get(selectors.searchInput).should('have.value', searchText);

    // Check for mismatch text in the search input
    if (searchText !== 'x') {
      // Display a mismatch text message
      cy.get('div[style*="border-top"]').contains('Select All').should('exist');
      cy.log('Mismatch text: Text "x" not found in search input');
      return;
    }
  cy.wait(3000);
  cy.get(selectors.searchInput).clear();
  });
});
