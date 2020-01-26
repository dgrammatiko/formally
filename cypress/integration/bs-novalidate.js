/// <reference types="Cypress" />


describe('Bootstrap No Validate', () => {
    it('successfully loads', function () {
        cy.visit('/cypress/server/bs-no-validate.html')
    })

    it('Form should have a novalidate attribute', () => {
        cy.get('form').should('have.attr', 'novalidate')
    });

    it('Form should not have a Formally property', () => {
        cy.get('form').should('not.have.property', 'Formally')
    });
});
