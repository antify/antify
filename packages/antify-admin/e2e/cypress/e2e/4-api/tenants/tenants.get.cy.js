/// <reference types="cypress" />

describe('Test get tenants api endpoint', () => {
    before(() => {
        cy.exec('cd ../src && pnpm ant-db load-fixtures core', { timeout: 20000 });
    });

    it('Should not allow to get tenants without token', () => {
        cy.request({
            url: '/api/tenants/tenants',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Should not allow to get tenants with wrong token', () => {
        cy.setCookie('antt', 'randomInvalidString')
        cy.request({
            url: '/api/tenants/tenants',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    // TODO:: finish use cases
});