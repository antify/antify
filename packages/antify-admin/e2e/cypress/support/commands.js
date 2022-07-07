// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email = 'admin@admin.de', password = 'admin') => {
    cy.request({
        method: 'post',
        url: '/api/auth/login',
        body: {
            email,
            password
        }
    }).then((response) => {
        cy.setCookie('antt', response.body.default.token);
        cy.setCookie('anttid', '1039fc07-7be9-4dd4-b299-26addb875111');
        cy.wrap(response.body.default.token + '').as('token');

        return cy.wrap(response.body.default.token, { log: false });
    });
})