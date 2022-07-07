/// <reference types="cypress" />

describe('Test mail templates listing page', () => {
    before(() => {
        // cy.exec('cd ../src && pnpm app:rebuild', { timeout: 20000 });
    });

    it('Should show page correct', () => {
        cy.login();

        cy.visit('/admin/1039fc07-7be9-4dd4-b299-26addb875111/mail-templates');
        cy.get('table > tbody > tr:first-child').should('have.text', 'Passwort zurücksetzen');
        cy.get('table > tbody > tr:first-child > td:first-child a').click();
        cy.location('pathname').should('eq', '/admin/1039fc07-7be9-4dd4-b299-26addb875111/mail-templates/RESET_PASSWORD');
    });
});