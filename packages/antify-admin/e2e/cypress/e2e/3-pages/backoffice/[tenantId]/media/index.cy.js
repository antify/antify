/// <reference types="cypress" />

describe('Test tenants listing page', () => {
  it('Should upload Image', () => {
    const image = 'UploadTestImage.jpg';
    cy.login();

    cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/media');
    cy.wait(200);

    cy.get('[data-cy=media-upload-input]').attachFile(image);

    console.log('Image', image);

    cy.wait(100);
    cy.get('[data-cy=media-upload-button]').click();

    cy.wait(100);
    cy.get('[data-cy=toaster]').should('have.text', 'Gespeichert');
  });

  it('Should show page correct', () => {
    cy.login();

    cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/media');

    cy.wait(200);

    cy.get('[data-cy=media-link]').should('have.text', 'UploadTestImage.jpg');
    cy.get('[data-cy=media-link]').click();
    cy.location('pathname').should(
      'match',
      /\/backoffice\/1039fc07-7be9-4dd4-b299-26addb875111\/media\/.*/
    );
  });

  it('Should delete element', () => {
    cy.login();

    cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/media');

    cy.wait(200);

    cy.get('[data-cy=media-link]').should('have.text', 'UploadTestImage.jpg');

    cy.get('[data-cy=media-delete]').first().click();

    cy.wait(100);

    cy.get('[data-cy=media-delete-dialog-text]').should(
      'have.text',
      ' Sind sie sicher das Sie diese Datei wirklich, sicherlich und unwiederruflich löschen wollen? '
    );

    cy.get('[data-cy=media-delete-button]').click();

    cy.get('[data-cy=toaster]').should('have.text', 'Gelöscht');
  });
});
