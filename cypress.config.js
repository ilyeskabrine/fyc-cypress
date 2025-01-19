const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path'); 
const pdf = require('pdf-parse');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        // Tâche pour lire et analyser un PDF
        readPdf(filePath) {
          const fullPath = path.resolve(filePath);
          const pdfBuffer = fs.readFileSync(fullPath); // Lit le fichier PDF
          return pdf(pdfBuffer).then((data) => data.text); // Analyse le PDF et retourne son contenu texte
        },
      });
      require('cypress-mochawesome-reporter/plugin')(on);
      
    },
    baseUrl: 'https://parfums-esgi.store/',
    chromeWebSecurity: false, // désactive les restrictions CORS
    reporter: 'cypress-mochawesome-reporter', // Définir le reporter
    reporterOptions: {
      reportDir: 'cypress/reports', // Dossier où les rapports seront générés
      overwrite: false, // Ne pas écraser les anciens rapports
      html: true, 
      json: false, 
    },
  },
  video: true,
  videoUploadOnPasses: false,
});