/// <reference types="cypress" />

describe('Test tenants listing page', () => {
  it('Should show page correct', () => {
    cy.login();

    cy.visit('/cockpit/tenants');
    cy.get('table > tbody > tr:first-child')
      .invoke('text')
      .should('match', /.*/);
    cy.get('table > tbody > tr:first-child > td:first-child a').click();
    cy.location('pathname').should('match', /cockpit\/tenants\/.*/);
  });
});
