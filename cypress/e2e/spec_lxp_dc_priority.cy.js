
describe("Login to Jira", () => {
  before(() => {
    cy.login();
    cy.wait(2000);
  });

  it("should interact with checkboxes and verify priority dropdown options", () => {
    cy.visit("http://localhost:8080/browse/PM-1");
    cy.contains("Links Explorer").click();

    cy.wait(1000);
    //cy.get('iframe').its('0.contentDocument.body').should('be.visible').then(cy.wrap).contains("Priority").click();
    cy.get('span div:contains("Priority")').click();
    cy.get('#Priority-options').should('be.visible'); 
    cy.wait(1000);
    cy.get('button[role="checkbox"][type="button"]').contains("Lowest");
    cy.get('button[role="checkbox"][type="button"]').contains("High");
    cy.get('button[role="checkbox"][type="button"]').contains("Highest");
    cy.get('button[role="checkbox"][type="button"]').contains("Medium");
    cy.get('button[role="checkbox"][type="button"]').contains("Low");

    cy.contains('span.css-178ag6o', 'Clear All').click();

    cy.get('button[role="checkbox"][type="button"]').contains("Low").click();
    cy.get('button[role="checkbox"][type="button"]').contains("Medium").click();
    cy.get('#1').click();

   cy.wait(1000);  

  });
});

