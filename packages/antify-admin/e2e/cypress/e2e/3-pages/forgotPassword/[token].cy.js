/// <reference types="cypress" />

describe('Test set new password page', () => {
  before(() => {
    cy.exec('cd ../src && pnpm ant-db load-fixtures core', { timeout: 20000 });
  });

  it('Should show errors on empty from', () => {
    cy.visit('/forgot-password/abcdefghijklmn');
    cy.get('[data-cy=password] input').clear();
    cy.get('[data-cy=repeatPassword] input').clear();
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=error]').should('have.text', 'Should not be blankShould not be blank');
  });

  it('Should show errors on typing invalid input', () => {
    cy.visit('/forgot-password/abcdefghijklmn');
    cy.get('[data-cy=repeatPassword] input').clear().type(' ').blur();

    cy.get('[data-cy=error]').should('have.text', 'Should not be blank');
  });

  it('Should show modal', () => {
    cy.visit('/forgot-password/abcdefghijklmn');
    cy.get('[data-cy=password] input').clear().type('Test123!');
    cy.get('[data-cy=repeatPassword] input').clear().type('Test123!');
    cy.get('[data-cy=submit]').click();

    cy.location('pathname').should('eq', '/login');
  });
});
