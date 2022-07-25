/// <reference types="cypress" />

describe('Test tenants listing page', () => {
    before(() => {
        // cy.exec('cd ../src && pnpm app:rebuild', { timeout: 20000 });
    });

    it('Should show page correct', () => {
        cy.login();

        cy.visit('/admin/1039fc07-7be9-4dd4-b299-26addb875111/media');
        cy.get('table > tbody > tr:first-child').should('have.text', '__test image');
        cy.get('table > tbody > tr:first-child > td:first-child a').click();
        cy.location('pathname').should('eq', '/admin/1039fc07-7be9-4dd4-b299-26addb875111/media/1039fc07-7bf9-4dd4-b299-26addb875123');
    });
});