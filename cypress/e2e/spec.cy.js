describe('My First Test', () => {

 it('Open index.html and find elements', () => {
    cy.visit('/index.html')
    cy.contains('LXP')
    cy.contains('Traceability')
      });
  });


describe("Iframe Text Test", () => {
  it("should find 'rmsis offers' text inside the iframe", () => {
    cy.visit("index.html");

    cy.get("iframe[title='Iframe Example']").should("be.visible").then(($iframe) => {
      const iframe = $iframe.contents();
      
      cy.log("Iframe Content:", iframe);

      if (iframe.find("h1:contains('RMsis Offers')").length > 0) {
        const text = iframe.find("h1:contains('RMsis Offers')").text();
        expect(text).to.include("RMsis Offers");
      } else {
        cy.log("No direct access to text found in the iframe.");
      }
    });
  });
});


const getIframeDocument = () => {
  return cy
    .get('iframe[data-cy="the-frame"]')
    .should('exist')
    .then(($iframe) => {
      if ($iframe.length === 0) {
        cy.log('Iframe not found'); 
        return null; 
      }
      return $iframe.get(0).contentDocument;
    });
}

const getIframeBody = () => {
  return getIframeDocument()
    .then((doc) => {
      if (doc) {
        return cy.wrap(doc.body);
      } else {
        
        return cy.wrap(null);
      }
    });
}

it('gets the text inside iframe', () => {
  cy.visit('index.html');

  getIframeBody().then(($iframeBody) => {
    if ($iframeBody) {
      $iframeBody.find('h1').should('include.text', 'RMsis Offers');
    } else {
      
      cy.log('Iframe body not found');
    }
  });
});
