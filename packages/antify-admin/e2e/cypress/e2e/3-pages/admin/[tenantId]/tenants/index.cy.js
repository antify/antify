/// <reference types="cypress" />

describe('Test tenants listing page', () => {
  it('Should show page correct', () => {
    cy.login();

    cy.visit('/admin/1039fc07-7be9-4dd4-b299-26addb875111/tenants');
    cy.get('table > tbody > tr:first-child')
      .invoke('text')
      .should('match', /.*/);
    cy.get('table > tbody > tr:first-child > td:first-child a').click();
    cy.location('pathname').should('match', /\/admin\/.*\/tenants\/.*/);
  });
});
