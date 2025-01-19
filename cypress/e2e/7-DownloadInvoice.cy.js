describe("Télécharger la facture", () => {
  beforeEach(() => {
    //intercepter et ignorer les call de stripe
    cy.intercept("https://js.stripe.com/**", {
      statusCode: 200,
      body: {}, // Reponse vide simulée
    }).as("stripeCalls");

    cy.viewport("macbook-16");
    cy.visit("https://parfums-esgi.store/connexion", {
      onBeforeLoad: (window) => {
        window.localStorage.setItem("cookieConsent", "accepted");
      },
    });
  });

  it("Se connecter puis télécharger la facture", () => {
    cy.intercept("POST", "/api/login").as("login");
    cy.get('input[type="email"]').type("fycesgi.cypress2024@gmail.com");
    cy.get('input[type="password"]').type("Azerty@12345");
    cy.get('input[type="submit"]').contains("Se connecter").click();
    cy.wait("@login").its("response.statusCode").should("eq", 200);
    cy.get("span").contains("MON COMPTE").should("be.visible").click();
    cy.get("h2").contains("Mes Commandes").should("be.visible");
    cy.get("button").contains("Télécharger la facture").click();
    cy.readFile("cypress/downloads/facture.pdf").should("exist");

    const filePath = 'cypress/downloads/facture.pdf';

    cy.task('readPdf', filePath).then((pdfText) => {
      // Vérifie si le texte attendu est présent dans le PDF
      expect(pdfText).to.include('FactureParfums Entreprise'); 
      expect(pdfText).to.include('Numéro de commande: 17');
      expect(pdfText).to.include('Total:261.00'); 
    });
  });
});
