describe("Test de connexion", () => {
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

  it("Compte non activé", () => {
    cy.get('input[type="email"]').type("Testexemple11@gmail.com");
    cy.get('input[type="password"]').type("TestTest@12345");
    cy.get('input[type="submit"]').contains("Se connecter").click();
    cy.scrollTo("top");
    cy.get("h1")
      .contains(
        "L'email n'a pas été confirmé. Veuillez vérifier votre boîte de réception pour le lien de confirmation."
      )
      .should("be.visible");
  });

  it("Compte invalide", () => {
    cy.get('input[type="email"]').type("InvalidEmail@gmail.com");
    cy.get('input[type="passwod"]').type("Password@12345");
    cy.get('input[type="submit"]').contains("Se connecter").click();
    cy.scrollTo("top");
    cy.get("h1")
      .contains("Adresse email invalide ou mot de passe incorrect")
      .should("be.visible");
  });

  it("Compte valide", () => {
    cy.intercept("POST", "/api/login").as("login");
    cy.get('input[type="email"]').type("fycesgi.cypress2024@gmail.com");
    cy.get('input[type="password"]').type("Azety@12345");
    cy.get('input[type="submit"]').contains("Se connecter").click();
    cy.wait("@login").its("response.statusCode").should("eq", 200);
    cy.get('span').contains("MON COMPTE").should("be.visible").click();
    cy.get('h2').contains("Mes Commandes").should("be.visible");
    
  });
});
