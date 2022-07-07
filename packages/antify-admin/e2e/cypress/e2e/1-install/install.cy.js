/// <reference types="cypress" />

describe('Test install page', () => {
  before(() => {
    cy.exec('cd ../src && pnpm app:db:reinit', { timeout: 10000 });
  });

  it('Should show errors on empty from', () => {
    cy.visit('/install');
    cy.get('[data-cy=name] input').clear();
    cy.get('[data-cy=email] input').clear();
    cy.get('[data-cy=password] input').clear();
    cy.get('[data-cy=password-repeat] input').clear();
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=name] [data-cy=error]').should('have.text', 'Should not be blank');
    cy.get('[data-cy=email] [data-cy=error]').should('have.text', 'Should not be blank');
    cy.get('[data-cy=password] [data-cy=error]').should('have.text', 'Should not be blank');
  });

  it('Should show errors on typing invalid data', () => {
    cy.visit('/install');
    cy.get('[data-cy=name] input').clear().type(' ');
    cy.get('[data-cy=email] input').clear().type(' ');
    cy.get('[data-cy=password] input').clear().type(' ');

    cy.get('[data-cy=name] [data-cy=error]').should('have.text', 'Should not be blank');
    cy.get('[data-cy=email] [data-cy=error]').should('have.text', 'Should not be blank');
    cy.get('[data-cy=password] [data-cy=error]').should('have.text', 'Should not be blank');
  });

  it('Should install correctly', () => {
    cy.visit('/install');
    cy.get('[data-cy=name] input').clear().type('Test User');
    cy.get('[data-cy=email] input').clear().type('admin@admin.de');
    cy.get('[data-cy=password] input').clear().type('admin');
    cy.get('[data-cy=password-repeat] input').clear().type('admin');
    cy.get('[data-cy=submit]').click();

    cy.location('pathname').should('match', /\/admin\/(((\w{4,12}-?)){5})\/dashboard/);
  });

  it('Should redirect to login if app is installed', () => {
    cy.clearCookies();
    cy.visit('/install');
    cy.location('pathname').should('eq', '/login');
  });

  it('Should login with installed user data', () => {
    cy.clearCookies();
    cy.visit('/login');
    cy.get('[data-cy=email] input').clear().type('admin@admin.de');
    cy.get('[data-cy=password] input').clear().type('admin');
    cy.get('[data-cy=submit]').click();

    cy.location('pathname').should('match', /\/admin\/(((\w{4,12}-?)){5})\/dashboard/);
  });
});