
describe("Login to Jira", () => {
  before(() => {
    cy.login();
    cy.wait(2000);
  });

  it("should interact with checkboxes and verify priority dropdown options", () => {
     cy.visit("http://localhost:8080/browse/PM-1");
    cy.contains("Links Explorer").click();

  
    cy.get('span.css-178ag6o div:contains("Priority")').click();

   
    cy.get('#Priority-Options').should('be.visible'); 

    cy.get('button[role="checkbox"][type="button"]').contains("Lowest").click();
    cy.get('button[role="checkbox"][type="button"]').contains("High").click();
    cy.get('button[role="checkbox"][type="button"]').contains("Highest").click();
    cy.get('button[role="checkbox"][type="button"]').contains("Medium").click();
    cy.get('button[role="checkbox"][type="button"]').contains("Low").click();

  
    cy.wait(2000); 

    
    cy.get('button[role="checkbox"][type="button"]').should(($checkboxes) => {
  
      const checkedCheckboxes = $checkboxes.filter('[aria-checked="true"]');
      expect(checkedCheckboxes).to.have.length(5);
    });
  });
});