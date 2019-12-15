/// <reference types="Cypress" />

import { Formally } from '../../src/formvalidatorbase';

describe('Basic', () => {
  it('should throw on wrong element', () => {
    // Mock the form Element
    const form = {
      constructor: {
        name: 'wrong'
      }
    };

    expect(function () { new Formally(form); }).to.throw(Error);
  });

  it('should not initialize on form element with novalidate attribute', () => {
    // Mock the form Element
    const form = {
      constructor: {
        name: 'HTMLFormElement',
      },
      hasAttribute: () => {
        return true;
      }
    };

    let initCalled = false;

    cy.stub(Formally.prototype, 'init', () => {
      initCalled = true;
    });

    expect(() => { new Formally(form); }).to.not.throw(Error);
    // We didn't call the init function
    expect(initCalled).to.be.false;
  });

  it('should initialize on form element with validate attribute', () => {
    // Mock the form Element
    const form = {
      constructor: {
        name: 'HTMLFormElement',
      },
      hasAttribute: () => {
        return false;
      },
      dataset: {},
      elements: []
    };

    let initCalled = false;

    cy.stub(Formally.prototype, 'init', () => {
      initCalled = true;
    });

    expect(() => { new Formally(form); }).to.not.throw(Error);
    // We did call the init function
    expect(initCalled).to.be.true;
  });
});








describe('My First Test', function () {
  it('Does not do much!', function () {
    expect(true).to.equal(true);
    expect(true).to.not.equal(false)
  });
});

describe('My Second Test', function () {
  it('Visits the Kitchen Sink', function () {
    cy.visit('https://example.cypress.io')
  })
})

describe('My Third Test', function () {
  it('finds the content "type"', function () {
    cy.visit('https://example.cypress.io')

    cy.contains('type')
  })
})


describe('My Fourth Test', function () {
  it('clicks the link "type"', function () {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()
  })
})


describe('My Fifth Test', function () {
  it('Gets, types and asserts', function () {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})

describe('My Sixth Test', function () {
  it('clicking "type" shows the right headings', function () {
    cy.visit('https://example.cypress.io')

    // cy.pause(4)

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})