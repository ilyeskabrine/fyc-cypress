describe("Créer un compte", () => {
    beforeEach(() => {
        //intercepter et ignorer les call de stripe
        cy.intercept("https://js.stripe.com/**", {
          statusCode: 200,
          body: {},// Reponse vide simulée
        }).as("stripeCalls");
    
        cy.viewport("macbook-16");
        cy.visit('https://parfums-esgi.store/inscription', {
          onBeforeLoad: (window) => {
            window.localStorage.setItem('cookieConsent', 'accepted');
          }
        });
      });

    it("Créer un compte", () => {
        cy.intercept('POST', '/api/register').as('register');
        cy.get('input[placeholder="Enter votre Nom"]').type("Test");
        cy.get('input[placeholder="Enter votre Prénom"]').type("Test");
        cy.get('input[placeholder="22 Rue de la Ville 75000 Paris .."]').type("22 Rue de la Ville 75000 Paris");
        cy.get('input[placeholder="+33751125896"]').type("0751125896");
        cy.get('input[placeholder="exemple@gmail.com"]').type("Testexemple11@gmail.com");
        cy.get('input[type="password"]').type("TestTest@12345");
        cy.get('#rgpd').click();
        cy.get('input[type="submit"]').contains('Inscription').click();
        cy.wait('@register').its('response.statusCode').should('eq', 200);
        cy.get("h1").contains("Activation de votre compte").should("be.visible");
    });
});