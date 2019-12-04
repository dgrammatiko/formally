import { describe, it } from 'mocha';
import { expect, assert } from 'chai';
import sinon from 'sinon';

import { FormValidatorBase } from '../src/formvalidatorbase';

describe('Basic', () => {
  it('should throw on wrong element', () => {
    // Mock the form Element
    const form = {
      constructor: {
        name: 'wrong'
      }
    };

    expect(function () { new FormValidatorBase(form); }).to.throw(Error);
  });

  it('should work on form element with novalidate attribute', () => {
    // Mock the form Element
    const form = {
      constructor: {
        name: 'HTMLFormElement',
      },
      hasAttribute: () => {
        return true;
      }
    };

    const stub = sinon.stub(FormValidatorBase.prototype, 'init').callsFake(() => true);

    expect(function () { new FormValidatorBase(form); }).to.not.throw(Error);
    // We didn't call the init function
    assert(stub, false);

    stub.restore();
  });

  it('should work on form element with validate attribute', () => {
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

    const stub = sinon.stub(FormValidatorBase.prototype, 'init').callsFake(() => true);

    expect(function () { new FormValidatorBase(form); }).to.not.throw(Error);
    // We called the init function
    assert(stub, true);

    stub.restore();
  });
});