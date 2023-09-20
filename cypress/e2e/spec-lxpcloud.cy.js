

describe('Login to Atlassian Jira and Navigate to issue Page', () => {

  it('Login to Jira and navigate to the specified page', () => {
  
    cy.visit('https://sonuk3.atlassian.net/login');
      cy.viewport(1200, 800);

    
    cy.get('#username').type('sonum931@gmail.com');
    cy.get('#login-submit').click();
     //cy.wait(5000);

    cy.get('#password').type('@tlassian@12', { force: true });

     cy.wait(10000);
    cy.get('#login-submit').click();

    
    cy.wait(20000); 
    cy.visit('https://sonuk3.atlassian.net/browse/KAN-5');
    cy.wait(10000);

    cy.origin('https://sonuk3.atlassian.net/browse/KAN-5', () => {
       cy.wait(10000);
    cy.contains("Links Explorer").click();
     cy.wait(20000);


    })
    
      
  });
});
