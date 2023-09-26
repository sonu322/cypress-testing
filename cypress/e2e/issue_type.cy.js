
describe("Login to Jira", () => {
  before(() => {
    cy.login();
    cy.wait(2000);
  });

  it("should interact with checkboxes and verify issue type options", () => {
    cy.visit("http://localhost:8080/browse/PM-1");
    cy.contains("Links Explorer").click();

    cy.wait(1000);
   
    cy.contains('Issue Type').click();
  
  cy.wait(1000);
 cy.contains('span.css-178ag6o', 'Clear All').click();

 
cy.contains('button', 'Task').click();

  cy.wait(1000);

cy.contains('button', 'Epic').click();

cy.wait(1000);


cy.contains('button', 'Select All').click();

cy.contains('span.css-178ag6o', 'Clear All').click();



  });
});



