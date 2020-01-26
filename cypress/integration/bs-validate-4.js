/// <reference types="Cypress" />

describe('Bootstrap Validate, Invalid form check [isValid]', () => {
    it('successfully loads', function () {
        cy.visit('/cypress/server/bs-validate-4.html')
    })

    it('Form should not have a novalidate attribute', () => {
        cy.get('form').should('not.have.attr', 'novalidate')
    });

    it('Form should have a Formally property', () => {
        cy.get('form').should('have.prop', 'Formally')
    });

    it('Form should be invalid', () => {
        cy.get('form').then((element) => {
            const form = element.get(0); // Freaking jQuery?
            expect(form.Formally.isValid()).to.equal(false)
        });
    });

    it('Form should have invalid message below', () => {
        cy.get('[aria-live="polite"]').then((element) => {
            expect(element.text()).to.equal('Only lowercase letters here')
        });
    });
});
