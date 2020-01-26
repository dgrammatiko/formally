/// <reference types="Cypress" />

describe('Bootstrap Validate, Valid form check [isValid]', () => {
    it('successfully loads', function () {
        cy.visit('/cypress/server/bs-validate-3.html')
    })

    it('Form should not have a novalidate attribute', () => {
        cy.get('form').should('not.have.attr', 'novalidate')
    });

    it('Form should have a Formally property', () => {
        cy.get('form').should('have.prop', 'Formally')
    });

    it('Form should be valid', () => {
        cy.get('form').then((element) => {
            const form = element.get(0); // Freaking jQuery?
            console.log(form.Formally)
            expect(form.Formally.isValid()).to.equal(true)
        });
    });
});
