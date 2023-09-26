
describe("Login to Jira", () => {
  before(() => {
    cy.login();
    cy.wait(2000);
  });

  it("should interact with checkboxes and verify issue card fields", () => {
    cy.visit("http://localhost:8080/browse/PM-1");
    
    cy.contains("Links Explorer").click();

    cy.wait(1000);
   
cy.get('span[title="Click here to export CSV file"] button').should('be.visible').click();

   cy.wait(1000);

cy.get('span[title="Get Help"] a').should('be.visible').click();

 });
  
});





