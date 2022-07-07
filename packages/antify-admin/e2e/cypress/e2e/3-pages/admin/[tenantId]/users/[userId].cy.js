/// <reference types="cypress" />

describe('Test user listing page', () => {
    before(() => {
        // cy.exec('cd ../src && pnpm app:rebuild', { timeout: 20000 });
    });

    it('Should show page correct', () => {
        cy.login();

        cy.visit('/admin/1039fc07-7be9-4dd4-b299-26addb875111/users/1039fc07-7be9-4dd4-b299-26addb875771');
        cy.get('[data-cy=name] input').should('have.value', 'Demo Benutzer');
        cy.get('[data-cy=email] input').should('have.value', 'admin@admin.de');
        cy.get('[data-cy=roles] option:checked').should('have.text', 'Administrator');
    });
});