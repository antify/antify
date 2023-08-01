/// <reference types="cypress" />

describe('Test login page', () => {
  before(() => {
    cy.exec('cd ../src && pnpm ant-db load-fixtures core', { timeout: 20000 });
  });

  it('Should show errors on empty from', () => {
    cy.visit('/login');
    cy.get('[data-cy=email] input').clear();
    cy.get('[data-cy=password] input').clear();
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=login-errors]').should(
      'have.text',
      'Should not be blankShould not be blank'
    );
  });

  it('Should show errors on typing invalid credentials', () => {
    cy.visit('/login');
    cy.get('[data-cy=email] input').clear().type(' ');
    cy.get('[data-cy=password] input').clear().type(' ');

    cy.get('[data-cy=login-errors]').should('have.text', 'Should not be blank');
  });

  it('Should show errors on submit wrong credentials', () => {
    cy.visit('/login');
    cy.get('[data-cy=email] input').clear().type('unkown@mail.de');
    cy.get('[data-cy=password] input').clear().type('wrongPassword!!!');
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=login-errors]').should(
      'have.text',
      'E-Mail oder Passwort falsch - Bitte prüfen Sie Ihre Eingaben.'
    );
  });

  it('Should login', () => {
    cy.visit('/login');
    cy.get('[data-cy=email] input').clear().type('admin@admin.de');
    cy.get('[data-cy=password] input').clear().type('admin');
    cy.get('[data-cy=submit]').click();

    cy.location('pathname').should('match', /cockpit\/dashboard/);
  });
});
