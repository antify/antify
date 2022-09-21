/// <reference types="cypress" />

describe('Test tenant detail page', () => {
  it('Should show page correct', () => {
    cy.login();

    cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/tenants');
    cy.wait(200);
    cy.get('table > tbody > tr:first-child > td:first-child a').click();
    cy.wait(200);

    cy.get('[data-cy=name] input').clear().type(' ').blur();
    cy.get('[data-cy=name] [data-cy=error]').should(
      'have.text',
      'Should not be blank'
    );

    cy.get('[data-cy=name] input').clear().type('Demo Mandant');

    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=name] [data-cy=error]').should('not.exist');

    cy.get('[data-cy=toaster]').should('have.text', 'Gespeichert');
  });
});
