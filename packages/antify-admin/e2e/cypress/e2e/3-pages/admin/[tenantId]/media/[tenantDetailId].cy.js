/// <reference types="cypress" />

describe('Test tenant detail page', () => {
  it('Should show page correct', () => {
    cy.login();
    cy.visit(
      '/admin/1039fc07-7be9-4dd4-b299-26addb875111/media/1039fc07-7bf9-4dd4-b299-26addb875123'
    );

    cy.wait(200);

    cy.get('[data-cy=title] input').clear().type(' ').blur();
    cy.get('[data-cy=title] [data-cy=error]').should(
      'have.text',
      'Should not be blank'
    );

    cy.get('[data-cy=title] input').clear().type('__test image');

    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=title] [data-cy=error]').should('not.exist');
  });
});
