/// <reference types="Cypress" />

import { Formally } from '../../src/formally.js';

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
