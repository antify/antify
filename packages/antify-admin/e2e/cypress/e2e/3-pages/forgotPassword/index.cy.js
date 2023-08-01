/// <reference types="cypress" />

describe('Test forgot password page', () => {
  before(() => {
    cy.exec('cd ../src && pnpm ant-db load-fixtures core', { timeout: 20000 });
  });

  it('Should show errors on empty from', () => {
    cy.visit('/forgot-password');
    cy.get('[data-cy=email] input').clear();
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=error]').should('have.text', 'Should not be blank');
  });

  it('Should show errors on typing invalid input', () => {
    cy.visit('/forgot-password');
    cy.get('[data-cy=email] input').clear().type(' ').blur();

    cy.get('[data-cy=error]').should('have.text', 'Should not be blank');
  });

  it('Should show modal', () => {
    cy.visit('/forgot-password');
    cy.get('[data-cy=email] input').clear().type('admin@admin.de');
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=modal]').should(($div) => {
      expect($div).to.have.length(1);
    });
  });
});
