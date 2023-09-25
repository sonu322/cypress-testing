
describe("Login to Jira", () => {
  before(() => {
    cy.login();
    cy.wait(2000);
  });

  it("should interact with checkboxes and verify issue link type dropdown options", () => {
    cy.visit("http://localhost:8080/browse/PM-1");
    cy.contains("Links Explorer").click();

    cy.wait(1000);
   
    cy.contains('Issue Link Type').click();
  
  cy.wait(1000);

    cy.get('#Issue\\ Link\\ Type-options').should('be.visible'); 

  
cy.get('#PARENT').should('exist').click(); 

cy.get('#CHILD_ISSUES').should('exist').click();

   cy.wait(1000);

cy.contains('span.css-178ag6o', 'Clear All').click();

   cy.wait(1000);

  });
});



