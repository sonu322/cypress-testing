
describe("Login to Jira", () => {
  before(() => {
    cy.login();
    cy.wait(2000);
  });

  it("should interact with link explorer dropdown options", () => {
    
    cy.visit("http://localhost:8080/browse/PM-1");
    
    cy.contains("Links Explorer").click();

    cy.wait(1000);
   
    cy.contains('Issue Link Type').click();
  
  cy.wait(1000);

   cy.get('#10000-blocks').should('exist').click();

cy.wait(1000);

cy.contains('Issue Type').click();

cy.contains('button', 'Bug').click();

 cy.wait(1000);

    cy.contains('Issue Card Fields').click();

    cy.get('#status').click();

    cy.get('span div:contains("Priority")').click();
    cy.wait(1000);
    cy.get('button[role="checkbox"][type="button"]').contains("Lowest").click();

    cy.wait(1000);
   
cy.get('span[title="Click here to export CSV file"] button').should('be.visible').click();

   cy.wait(1000);

cy.get('span[title="Get Help"] a').should('be.visible').click();

  });
});



