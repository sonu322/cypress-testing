

describe("Login to Jira", () => {
  it("should log in with username 'sonu' and password 'admin'", () => {
    
    cy.visit("http://localhost:8080/login.jsp");

    
    cy.get("#login-form-username").type("sonu");
    cy.get("#login-form-password").type("admin");
    cy.get("#login-form-submit").click();

    
    //cy.url().should("include", "http://localhost:8080/secure/Dashboard.jspa");
     
     cy.visit("http://localhost:8080/browse/PM-1");

     cy.contains("Links Explorer").click();

        cy.get('span.css-178ag6o div:contains("Priority")').click();
   cy.get('.css-178ag6o').should('exist');

});

});






 