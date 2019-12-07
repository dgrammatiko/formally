import { describe, it } from 'mocha';
import { expect } from 'chai'
import sinon from 'sinon';
import { FormValidatorBase } from '../src/base/formvalidatorbase';

describe('Initialise on form element', () => {
  it('should throw on wrong element', () => {
    // Mock the form Element
    const form = {
      constructor: {
        name: 'wrong'
      }
    };

    expect(function () { new FormValidatorBase(form); }).to.throw(Error);
  });

  it('should work on form elements with novalidate attribute', () => {
    // Mock the form Element
    const form = {
      constructor: {
        name: 'HTMLFormElement',
      },
      hasAttribute: () => {
        return true;
      }
    };

    expect(function () { new FormValidatorBase(form); }).to.not.throw(Error);
  });

  it('should work on form elements with validate attribute', () => {
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

    expect(function () { new FormValidatorBase(form); }).to.not.throw(Error);
  });
});