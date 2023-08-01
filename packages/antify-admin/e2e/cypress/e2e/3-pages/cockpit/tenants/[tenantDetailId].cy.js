/// <reference types="cypress" />

describe('Test tenant detail page', () => {
  before(() => {
    cy.exec('cd ../src && pnpm ant-db load-fixtures core', { timeout: 20000 });
  });

  it('Should show page correct', () => {
    cy.login();

    cy.visit('/cockpit/tenants');
    cy.wait(200);
    cy.get('table > tbody > tr:first-child > td:first-child a').click();
    cy.wait(200);

    cy.get('[data-cy=name] input').clear().type(' ').blur();
    cy.get('[data-cy=name] [data-cy=error]').should(
      'have.text',
      'Should not be blank'
    );

    cy.get('[data-cy=name] input').clear().type('Demo Mandant');

    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=name] [data-cy=error]').should('not.exist');

    cy.get('[data-cy=toaster]').should('have.text', 'Gespeichert');
  });
});
