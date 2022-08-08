/// <reference types="cypress" />

describe('Test mail templates detail page', () => {
  it('Should show page correct', () => {
    cy.login();
    cy.visit(
      '/admin/1039fc07-7be9-4dd4-b299-26addb875111/mail-templates/RESET_PASSWORD'
    );

    cy.wait(200);

    cy.get('[data-cy=title] input').clear().type(' ').blur();
    cy.get('[data-cy=title] [data-cy=error]').should(
      'have.text',
      'Should not be blank'
    );

    cy.get('[data-cy=title] input').clear().type('Neuen Benutzer einladen');
    cy.get('[data-cy=content] div.ProseMirror')
      .clear()
      .type('Neuen Benutzer einladen');

    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=title] [data-cy=error]').should('not.exist');
    cy.get('[data-cy=content] [data-cy=error]').should('not.exist');
  });
});
