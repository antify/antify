/// <reference types="cypress" />

describe('Test refresh token api endpoint', () => {
    before(() => {
        cy.exec('cd ../src && pnpm ant-db load-fixtures core', { timeout: 20000 });
    });

    it('Should throw unautorized error on missing cookie', () => {
        cy.request({
            method: 'post',
            url: '/api/auth/refresh_token',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Should generate a new token', () => {
        cy.login()
            .then((token) => {
                // Wait that between the token which is created from login and the refresh token is a time delay.
                // Therefore the loginToken.exp should be an other value as the refreshToken.exp
                cy.wait(1000);

                cy.request({
                    method: 'post',
                    url: '/api/auth/refresh_token',
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property('default');
                    expect(response.body.default).to.have.property('token');
                    expect(response.body.default.token).to.not.eq(token);
                });
            });
    });
});