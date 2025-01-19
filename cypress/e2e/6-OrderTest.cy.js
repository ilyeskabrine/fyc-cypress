describe("Tester la commande", () => {
  beforeEach(() => {
    cy.on("window:before:load", (win) => {
      const stub = cy.stub(win, "open").as("windowOpen");
      stub.callsFake((url) => {
        win.location.href = url;
        return {
          location: {
            href: url,
          },
        };
      });
    });
    cy.viewport("macbook-16");
    cy.visit("https://parfums-esgi.store/", {
      onBeforeLoad: (window) => {
        window.localStorage.setItem("cookieConsent", "accepted");
      },
    });
  });

  it("Tester la commande", () => {
    cy.window().then((win) => {
      const newTabUrl = win.location.href;
      cy.visit(newTabUrl); // Charger l'URL dans Cypress
    });

    context("Ajouter un produit homme au panier", () => {
      cy.visit("https://parfums-esgi.store/homme");
      cy.get('div[class*="max-w-xs"]').first().click();
      cy.get("button").contains("Ajouter au panier").click();
    });

    context("Ajouter un produit femme au panier", () => {
      cy.visit("https://parfums-esgi.store/femme");
      cy.get('div[class*="max-w-xs"]').first().click();
      cy.get("button").contains("Ajouter au panier").click();
    });

    context("Ajouter un produit homme au panier", () => {
      cy.visit("https://parfums-esgi.store/homme");
      cy.get('div[class*="max-w-xs"]').first().click();
      cy.get("button").contains("Ajouter au panier").click();
    });

    context("Passer la commande avant la connexion", () => {
      cy.get("span").contains("MON PANIER").click();
      cy.get("button").contains("Commander").click();
      cy.get("p")
        .contains("Vous devez être connecté pour pouvoir commander.")
        .should("be.visible");
    });

    context("Se connecter pour pour pouvoir passer la commande", () => {
      cy.get("a").contains("Se connecter").click();
      cy.intercept("POST", "/api/login").as("login");
      cy.get('input[type="email"]').type("fycesgi.cypress2024@gmail.com");
      cy.get('input[type="password"]').type("Azerty@12345");
      cy.get('input[type="submit"]').contains("Se connecter").click();
      cy.wait("@login").its("response.statusCode").should("eq", 200);
    });

    context("Passer la commande aprés la connexion", () => {
      cy.get("span").contains("MON PANIER").click();
      cy.get("button").contains("Commander").realClick();
      cy.get("button").contains("Passer au paiement").should("exist");                                                            cy.visit("https://checkout.stripe.com/c/pay/cs_test_b1wbqp5k8JQj4TiyfXV4x7brKgDClU5Do3DUYsiw3LLJbpzfqJhsBL2yUG#fidkdWxOYHwnPyd1blpxYHZxWjA0SGNXQ0JGSEdzVGNRd0kwf2REXF9kM2B2ZGdTV1JrTEhvMHwzZ1VSUDNpNFdCaFxRbH93Yl9nRDxfaHBtf2dtdXZWR3BQTU1hPWlQZj1OV3VoX0ZfamdMNTVXSlV0aGR0XCcpJ2hsYXYnP34naHBsYSc%2FJ0tEJykndmxhJz8nS0QnKSdicGxhJz8nS0QneCknZ2BxZHYnP15YKSdpZHxqcHFRfHVgJz8naHBpcWxabHFgaCcpJ3dgY2B3d2B3SndsYmxrJz8nbXFxdXY%2FKip1ZHdjcGh2KGB2YmwrdnFqd2AneCUl");
      cy.get("#email").type("test@gmail.com");  
      cy.get("#cardNumber").type("4242424242424242");
      cy.get("#cardExpiry").type("12/27");
      cy.get("#cardCvc").type("123");
      cy.get("#billingName").type("Test Test");
      cy.get(".SubmitButton-IconContainer").click();
      cy.get("h1").contains("Paiement réussi").should("be.visible");
    });
  });
});
