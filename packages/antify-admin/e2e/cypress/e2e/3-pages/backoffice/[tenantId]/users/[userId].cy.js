/// <reference types="cypress" />

describe('Test user listing page', () => {
  it('Should show page correct', () => {
    cy.login();

    cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/users');

    cy.wait(200);

    cy.get('[data-cy=user-link]').click();

    cy.wait(200);

    cy.get('[data-cy=name] input').should('have.value', 'Test User');
    cy.get('[data-cy=email] input').should('have.value', 'admin@admin.de');
    cy.get('[data-cy=roles]').select('Administrator');
    cy.get('[data-cy=roles] option:checked').should(
      'have.text',
      'Administrator'
    );

    cy.get('[data-cy=submit]').click();

    cy.wait(100);

    cy.get('[data-cy=toaster]').should('have.text', 'Gespeichert');
  });
});
