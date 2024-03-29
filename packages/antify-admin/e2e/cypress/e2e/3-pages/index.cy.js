/// <reference types="cypress" />

describe('Test index page', () => {
  it('Should redirect an unauthenticated client to login page', () => {
    cy.visit('http://localhost:3000/');

    cy.location('pathname').should('eq', '/login');
  });
});
