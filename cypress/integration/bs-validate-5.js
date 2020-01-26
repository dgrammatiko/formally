/// <reference types="Cypress" />

describe('Bootstrap Validate, Invalid messages for input type text', () => {
    it('successfully loads', function () {
        cy.visit('/cypress/server/bs-validate-5.html')
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

    // Required
    it('Form element with required attribute has correct message below', () => {
        cy.get('#text1').then((element) => {
            const msg = element.parent().find('[aria-live="polite"]')
            expect(msg.text()).to.equal('The Text Input cannot be empty')
        });
    });

    // Pattern mismarch
    it('Form element with Pattern mismarched value has correct message below', () => {
        cy.get('#text2').then((element) => {
            const msg = element.parent().find('[aria-live="polite"]')
            expect(msg.text()).to.equal('Only lowercase letters here')
        });
    });

    // Too short
    it('Form element with Too short value has correct message below', () => {
        cy.get('#text3').then((element) => {
            const msg = element.parent().find('[aria-live="polite"]')
            expect(msg.text()).to.equal('Not smaller than 5 letters')
        });
    });
});
