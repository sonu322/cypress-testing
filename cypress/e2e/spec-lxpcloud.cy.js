
describe('Login to Atlassian Jira and Navigate to issue Page', () => {

  it('Login to Jira and navigate to the specified page', () => {
    cy.viewport(1200, 800);
    cy.visit('https://sonuk3.atlassian.net/login');
    cy.get('#username').should('be.visible').type('sonum931@gmail.com');
    cy.get('#login-submit').click({ force: true });
    cy.get('#password').should('be.visible').type('@tlassian@12');
    cy.get('#login-submit').click();
    
    cy.wait(15000); 
    cy.visit('https://sonuk3.atlassian.net/browse/KAN-6')
    cy.wait(10000);
    cy.origin('https://sonuk3.atlassian.net/browse/KAN-6', () => {
      cy.contains("Links Explorer").click()
      cy.wait(5000);
      cy.get('iframe').its('0.contentDocument.body').should('be.visible').then(cy.wrap).contains("Priority").click()
    });  
    cy.wait(10000);
    });
});
