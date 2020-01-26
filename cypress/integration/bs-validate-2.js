/// <reference types="Cypress" />

import { defaultSettings } from '../../src/defaults.js'

describe('Bootstrap Validate, options from data attributes', () => {
    it('successfully loads', function () {
        cy.visit('/cypress/server/bs-validate-2.html')
    })

    it('Form should not have a novalidate attribute', () => {
        cy.get('form').should('not.have.attr', 'novalidate')
    });

    it('Form should have a Formally property', () => {
        cy.get('form').should('have.prop', 'Formally')
    });

    it('Form should have a Formally.options property that differs from the default values', () => {
        cy.get('form').then((element) => {
            const form = element.get(0); // Freaking jQuery?
            expect(form.Formally.options.validClass).not.to.equal(defaultSettings.validClass)
            expect(form.Formally.options.invalidClass).not.to.equal(defaultSettings.invalidClass)
            expect(form.Formally.options.indicator).not.to.equal(defaultSettings.indicator)
            expect(form.Formally.options.indicatorElement).not.to.equal(defaultSettings.indicatorElement)
            expect(form.Formally.options.indicatorPosition).not.to.equal(defaultSettings.indicatorPosition)
            expect(form.Formally.options.indicatorClass).not.to.equal(defaultSettings.indicatorClass)
            expect(form.Formally.options.invalidForm).not.to.equal(defaultSettings.invalidForm)
            expect(form.Formally.options.invalidFormAlert).not.to.equal(defaultSettings.invalidFormAlert)
        });
    });
});
