/// <reference types="Cypress" />

import { defaultSettings } from '../../src/defaults.js'

describe('Bootstrap Validate, default options', () => {
    it('successfully loads', function () {
        cy.visit('/cypress/server/bs-validate-1.html')
    })

    it('Form should not have a novalidate attribute', () => {
        cy.get('form').should('not.have.attr', 'novalidate')
    });

    it('Form should have a Formally property', () => {
        cy.get('form').should('have.prop', 'Formally')
    });

    it('Form should have a Formally property with default values', () => {
        cy.get('form').then((element) => {
            const form = element.get(0); // Freaking jQuery?
            expect(form.Formally.options.validClass).to.equal(defaultSettings.validClass)
            expect(form.Formally.options.invalidClass).to.equal(defaultSettings.invalidClass)
            expect(form.Formally.options.indicator).to.equal(defaultSettings.indicator)
            expect(form.Formally.options.indicatorElement).to.equal(defaultSettings.indicatorElement)
            expect(form.Formally.options.indicatorPosition).to.equal(defaultSettings.indicatorPosition)
            expect(form.Formally.options.indicatorClass).to.equal(defaultSettings.indicatorClass)
            expect(form.Formally.options.invalidForm).to.equal(defaultSettings.invalidForm)
            expect(form.Formally.options.invalidFormAlert).to.equal(defaultSettings.invalidFormAlert)
        });
    });
});
