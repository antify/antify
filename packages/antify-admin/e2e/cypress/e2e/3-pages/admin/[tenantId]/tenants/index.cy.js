/// <reference types="cypress" />

describe('Test tenants listing page', () => {
  before(() => {
    // cy.exec('cd ../src && pnpm app:rebuild', { timeout: 20000 });
  });

  it('Should show page correct', () => {
    cy.login();

    cy.visit('/admin/1039fc07-7be9-4dd4-b299-26addb875111/tenants');
    cy.get('table > tbody > tr:first-child').should('have.text', 'Beahan Inc');
    cy.get('table > tbody > tr:first-child > td:first-child a').click();
    cy.location('pathname').should(
      'eq',
      '/admin/1039fc07-7be9-4dd4-b299-26addb875111/tenants/b52145be-1a0d-43bb-b85c-eb962c4a4a25'
    );
  });
});
