
describe("Login to Jira", () => {
  before(() => {
    cy.login();
    cy.wait(2000);
  });

  it("should interact with checkboxes and verify issue card fields", () => {
    cy.visit("http://localhost:8080/browse/PM-1");
    cy.contains("Links Explorer").click();

    cy.wait(1000);
   
    cy.contains('Issue Card Fields').click();
  
cy.wait(1000);
 cy.contains('button', 'Clear All').click();

 
cy.contains('button', 'Select All').click();

  cy.wait(1000);

cy.get('#priority').click(); 

cy.wait(1000);

cy.get('#summary').click();

cy.wait(1000);

cy.get('#issueType').click();
cy.wait(1000);


cy.get('#storyPoints').click();

cy.wait(1000);

 });
});





