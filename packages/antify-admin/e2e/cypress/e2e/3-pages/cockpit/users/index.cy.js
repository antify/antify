/// <reference types="cypress" />

describe('Test user listing page', () => {
  it('Should show page correct', () => {
    cy.login();

    cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/users');
    cy.get('table > tbody > tr:first-child').should(
      'have.text',
      'Test Useradmin@admin.de'
    );

    cy.get('table > tbody > tr:first-child > td:first-child a').click();

    cy.location('pathname').should('match', /\/backoffice\/.*\/users\/.*/);
  });

  it('Should invite new user', () => {
    cy.login();

    cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/users');

    cy.wait(200);

    cy.get('[data-cy=invite-user-button]')
      .should('have.text', ' Benutzer einladen ')
      .click();

    cy.wait(200);

    cy.get('[data-cy=invite-email').clear().type(' ').blur();
    cy.get('[data-cy=error]').should('have.text', 'Should not be blank');

    cy.get('[data-cy=invite-email').clear().type('qsldfkjajöj.de').blur();
    cy.get('[data-cy=error]').should('have.text', 'Invalid email');

    cy.get('[data-cy=invite-email').clear().type('a@b.de').blur();
    cy.get('[data-cy=role-select]').select('Administrator');

    cy.get('[data-cy=invite-user-submit]').click();

    cy.wait(100);

    cy.get('[data-cy=toaster]').should(
      'have.text',
      'Einladung wurde versendet'
    );
  });
});
