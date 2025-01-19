describe("Navigation dans le menu principal", () => {
  beforeEach(() => {
    //intercepter et ignorer les call de stripe
    cy.intercept("https://js.stripe.com/**", {
      statusCode: 200,
      body: {},// Reponse vide simulée
    }).as("stripeCalls");

    cy.viewport("macbook-16");
    cy.visit('https://parfums-esgi.store/', {
      onBeforeLoad: (window) => {
        window.localStorage.setItem('cookieConsent', 'accepted');
      }
    });
  });

  it("Navigation vers la page d'accueil", () => {
    //cy.get("nav a").contains("ACCUEIL").click();
    cy.get("nav").children().contains("ACCUEIL").click();
    cy.get("h1").contains("Qui sommes-nous").should("be.visible");
  });
  
  it("Navigation vers la page des produits Homme", () => {
    cy.get("nav").children().contains("HOMME").click();
    cy.get("h1").contains("NOS PRODUITS PARFUM HOMME").should("be.visible");
  });

  it("Navigation vers la page des produits Femme", () => {
    cy.get("nav").children().contains("FEMME").click();
    cy.get("h1").contains("NOS PRODUITS PARFUM FEMME").should("be.visible");
  });

  it("Navigation vers la page des marques", () => {
    cy.get("nav").children().contains("MARQUE").click();
    cy.get("h1").contains("Parfums vous propose les marques").should("be.visible");
  });

  it("Navigation vers la page contact", () => {
    cy.get("nav").children().contains("CONTACT").click();
    cy.get("h2").contains("Contactez-Nous").should("be.visible");
  });

});
