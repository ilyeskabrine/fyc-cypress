describe("Tester les Filtres", () => {
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

        cy.intercept('GET', '/api/products/category/homme').as('getProductsHomme');
        cy.get("nav").children().contains("HOMME").click();
        cy.wait('@getProductsHomme').its('response.statusCode').should('eq', 200);
        cy.get('div[class*="w-5/6"]').find('div[class*="max-w-xs"]').should('have.length', 4);
      });

      it("Filtre par famille", () => {
        cy.get('#family_0').click();
        cy.get('div[class*="w-5/6"]').find('div[class*="max-w-xs"]').should('have.length', 2);
        cy.get('#family_1').click();
        cy.get('div[class*="w-5/6"]').find('div[class*="max-w-xs"]').should('have.length', 3);
        cy.get('#family_2').click();
        cy.get('div[class*="w-5/6"]').find('div[class*="max-w-xs"]').should('have.length', 4);
      });

      it("Filtre par marque",( ) => {
        const testBrand = (index) => {
            cy.get(`#brand_${index}`).invoke('attr', 'value').then((value) => {
              const brandName = value;
        
              // Clique sur la checkbox
              cy.get(`#brand_${index}`).click();
              
              // Vérifie que le nom du brand est visible après sélection
              cy.get('div[class*="max-w-xs"]').find('p').contains(brandName).should('be.visible');
              
              // Décoche la checkbox
              cy.get(`#brand_${index}`).click();
            });
            };
        
            // Boucle pour tester les trois brands
            for (let i = 0; i < 3; i++) {
                testBrand(i);
            }
     });

     it("Slider à 0 € : Aucun produit affiché", () => {  
        cy.get('.v-slider-thumb').eq(1).realMouseDown();

        // Simuler un mouvement vers la gauche
        cy.get('.v-slider-thumb')
          .eq(1)
          .realMouseMove(-200, 0); 
        // Relâcher la souris
        cy.get('.v-slider-thumb').eq(1).realMouseUp();
         // Vérifier l'affichage des produits
        cy.get('div[class*="max-w-xs"]').should('not.exist');

       });  

       it("Slider à 50 € : Aucun produit affiché", () => {  
        cy.get('.v-slider-thumb').eq(1).realMouseDown();

        // Simuler un mouvement vers la gauche
        cy.get('.v-slider-thumb')
          .eq(1)
          .realMouseMove(-185, 0); 
        // Relâcher la souris
        cy.get('.v-slider-thumb').eq(1).realMouseUp();
         // Vérifier l'affichage des produits
         cy.get('div[class*="w-5/6"]').find('div[class*="max-w-xs"]').should('have.length', 2);

       });


});
