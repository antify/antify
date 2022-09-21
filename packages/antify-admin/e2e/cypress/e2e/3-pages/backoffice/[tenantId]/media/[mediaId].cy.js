/// <reference types="cypress" />

describe('Test tenant detail page', () => {
  beforeEach(() => {
    // upload test image
    const image = 'UploadTestImage.jpg';
    cy.login();

    cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/media');
    cy.wait(200);

    cy.get('[data-cy=media-upload-input]').attachFile(image);
    cy.wait(100);
    cy.get('[data-cy=media-upload-button]').click();
  });

  it('Should show page correct', () => {
    cy.visit('/backoffice/1039fc07-7be9-4dd4-b299-26addb875111/media');
    cy.wait(200);

    cy.get('[data-cy=media-link]').should('have.text', 'UploadTestImage.jpg');
    cy.get('[data-cy=media-link]').click();
    cy.location('pathname').should(
      'match',
      /\/backoffice\/1039fc07-7be9-4dd4-b299-26addb875111\/media\/.*/
    );

    cy.get('[data-cy=title] input').clear().type(' ').blur();
    cy.get('[data-cy=title] [data-cy=error]').should(
      'have.text',
      'Should not be blank'
    );

    cy.get('[data-cy=title] input').clear().type('UploadTestImage.jpg');

    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=title] [data-cy=error]').should('not.exist');

    // test delete on detail page
    cy.get('[data-cy=media-detail-delete]').click();
    cy.wait(100);
    cy.get('[data-cy=media-delete-dialog-text]').should(
      'have.text',
      ' Sind sie sicher das Sie diese Datei wirklich, sicherlich und unwiederruflich löschen wollen? '
    );

    cy.get('[data-cy=media-detail-delete-dialog-button]').click();
    cy.wait(100);
    cy.location('pathname').should(
      'match',
      /\/backoffice\/1039fc07-7be9-4dd4-b299-26addb875111\/media/
    );
  });
});
