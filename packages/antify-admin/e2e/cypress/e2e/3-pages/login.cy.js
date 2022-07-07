/// <reference types="cypress" />

describe('Test login page', () => {
  before(() => {
    cy.exec('cd ../src && pnpm app:rebuild', { timeout: 20000 });
  });

  it('Should show errors on empty from', () => {
    cy.visit('/login');
    cy.get('[data-cy=email] input').clear();
    cy.get('[data-cy=password] input').clear();
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=email] [data-cy=error]').should('have.text', 'Should not be blank');
    cy.get('[data-cy=password] [data-cy=error]').should('have.text', 'Should not be blank');
  });

  it('Should show errors on typing invalid credentials', () => {
    cy.visit('/login');
    cy.get('[data-cy=email] input').clear().type(' ');
    cy.get('[data-cy=password] input').clear().type(' ');

    cy.get('[data-cy=email] [data-cy=error]').should('have.text', 'Should not be blank');
    cy.get('[data-cy=password] [data-cy=error]').should('have.text', 'Should not be blank');
  });

  it('Should show errors on submit wrong credentials', () => {
    cy.visit('/login');
    cy.get('[data-cy=email] input').clear().type('unkown@mail.de');
    cy.get('[data-cy=password] input').clear().type('wrongPassword!!!');
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=response-errors]').should('have.text', 'Invalid credentials - please try again');
  });

  it('Should login', () => {
    cy.visit('/login');
    cy.get('[data-cy=email] input').clear().type('admin@admin.de');
    cy.get('[data-cy=password] input').clear().type('admin');
    cy.get('[data-cy=submit]').click();

    cy.location('pathname').should('eq', '/admin/1039fc07-7be9-4dd4-b299-26addb875111/dashboard');
  });
});