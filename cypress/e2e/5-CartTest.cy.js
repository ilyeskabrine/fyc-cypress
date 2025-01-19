describe("Tester le panier", () => {
  beforeEach(() => {
    //intercepter et ignorer les call de stripe
    cy.intercept("https://js.stripe.com/**", {
      statusCode: 200,
      body: {}, // Reponse vide simulée
    }).as("stripeCalls");

    cy.viewport("macbook-16");
    cy.visit("https://parfums-esgi.store/", {
      onBeforeLoad: (window) => {
        window.localStorage.setItem("cookieConsent", "accepted");
      },
    });
  });

  it("Tester le panier", () => {
    context("Ajouter un produit homme au panier", () => {
      cy.visit("https://parfums-esgi.store/homme");
      cy.get("span").contains("MON PANIER").click();
      cy.get("div").contains("Votre panier est vide.").should("be.visible");
      cy.get('div[class*="max-w-xs"]').first().click();
      cy.get("button").contains("Ajouter au panier").click();
      cy.get("span").contains("MON PANIER").click();
      cy.get("div ul").find("li").should("have.length", 1);
    });

    context("Ajouter un produit femme au panier", () => {
      cy.visit("https://parfums-esgi.store/femme");
      cy.get('div[class*="max-w-xs"]').first().click();
      cy.get("button").contains("Ajouter au panier").click();
    });

    context("Vérifier si les 2 produits sont bien ajoutés", () => {
      cy.get("span").contains("MON PANIER").click();
      cy.get("div ul").find("li").should("have.length", 2);
    });

    context("Augmenter la quantité du premier produit", () => {
      cy.wait(1000);
      cy.get("div ul").find("li").first().find('button:contains("+")').click();
      cy.get("div ul")
        .find("li")
        .first()
        .find("span")
        .contains("2")
        .should("be.visible");
    });

    context("Vider le panier", () => {
      cy.get("div ul").find("li").first().find('button:contains("-")').click();
      cy.get("div ul").find("li").first().find('button:contains("-")').click();
      cy.get("div ul").find("li").first().find('button:contains("-")').click();
      cy.get("div").contains("Votre panier est vide.").should("be.visible");
    });
  });
});
