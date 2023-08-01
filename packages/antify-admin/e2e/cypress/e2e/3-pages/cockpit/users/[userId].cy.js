/// <reference types="cypress" />

describe('Test user listing page', () => {
  before(() => {
    cy.exec('cd ../src && pnpm ant-db load-fixtures core && pnpm ant-db load-fixtures tenant', { timeout: 20000 });
  });

  it('Should show page correct', () => {
    cy.login();

    cy.visit('/cockpit/users');

    cy.wait(200);

    cy.get('[data-cy=user-link]').first().click();

    cy.wait(200);

    cy.get('[data-cy=name] input').should('have.value', 'Admin');
    cy.get('[data-cy=email] input').should('have.value', 'admin@admin.de');

    cy.get('[data-cy=submit]').click();

    cy.wait(100);

    cy.get('[data-cy=toaster]').should('have.text', 'Gespeichert');
  });
});
