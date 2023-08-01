/// <reference types="cypress" />

describe('Test get install required api endpoint', () => {
    it('Should return false on empty database', () => {
        cy.exec('cd ../src && pnpm ant-db drop-database core', { timeout: 10000 });

        cy.request({
            method: 'get',
            url: '/api/app/install_required'
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(JSON.stringify(response.body)).to.eq(JSON.stringify({ requireInstall: true }))
        });
    });

    it('Should return true on already initialized database', () => {
        cy.exec('cd ../src && pnpm ant-db load-fixtures core', { timeout: 20000 });

        cy.request({
            method: 'get',
            url: '/api/app/install_required'
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(JSON.stringify(response.body)).to.eq(JSON.stringify({ requireInstall: false }))
        });
    });
});