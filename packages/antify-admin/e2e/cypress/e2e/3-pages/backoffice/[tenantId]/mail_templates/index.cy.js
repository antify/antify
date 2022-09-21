/// <reference types="cypress" />

describe('Test mail templates listing page', () => {
  before(() => {
    // cy.exec('cd ../src && pnpm app:rebuild', { timeout: 20000 });
  });

  it('Should show page correct', () => {
    cy.login();

    cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/mail-templates');
    
    cy.wait(100);

    cy.get('table > tbody > tr:first-child').should(
      'have.text',
      'Neuen Benutzer einladen'
    );
    cy.get('table > tbody > tr:first-child > td:first-child div')
      .first()
      .click();
    cy.wait(100);
    cy.location('pathname').should(
      'eq',
      '/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/mail-templates/INVITE_USER'
    );
  });
});
