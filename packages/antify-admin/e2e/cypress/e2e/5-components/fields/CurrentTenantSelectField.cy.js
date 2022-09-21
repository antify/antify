/// <reference types="cypress" />

describe('Test CurrentTenantSelectField component', () => {
    before(() => {
        // cy.exec('cd ../src && pnpm app:rebuild', { timeout: 20000 });
    });

    it('Should show component correct', () => {
        cy.login();

        cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/dashboard');
        cy.get('[data-cy=CurrentTenantSelectField] option:checked').should('have.text', 'Demo Mandant');
    });
});