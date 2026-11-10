import { afterAll, beforeEach, beforeAll, describe, expect, it } from 'vitest';
import { startServer } from './static-server.js';
import puppeteer from 'puppeteer';

describe('JFormally', () => {
  let server
  let browser
  let page
  let port

  beforeAll(async () => {
    const { server: srv, port: p } = await startServer()
    server = srv
    port = p
    browser = await puppeteer.launch()
    page = await browser.newPage()
    await page.goto(`http://localhost:${port}/tests/fixtures/j-formally.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('form');
    await page.waitForFunction(() => typeof window.JFormally !== 'undefined');
  })

  afterAll(async () => {
    await browser.close()
    await new Promise((resolve) => server.close(resolve))
  })

  describe('custom getter/setter', () => {
    it('should return customValidators object', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        return typeof jf.custom === 'object' && Object.keys(jf.custom).length === 0;
      });
      expect(result).toBe(true);
    });

    it('should set customValidators via setter', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        jf.custom = { myValidator: { exec: () => true } };
        return Object.keys(jf.custom).length === 1 && jf.custom.myValidator.exec() === true;
      });
      expect(result).toBe(true);
    });
  });

  describe('setHandler', () => {
    it('should register a handler', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        jf.setHandler('custom-test', (value) => value === 'hello');
        return jf.handlers['custom-test'].exec('hello') === true && jf.handlers['custom-test'].enabled === true;
      });
      expect(result).toBe(true);
    });

    it('should respect enabled flag', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        jf.setHandler('disabled-handler', (value) => false, false);
        return jf.handlers['disabled-handler'].enabled === false;
      });
      expect(result).toBe(true);
    });

    it('default username handler should reject special chars', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        return jf.handlers.username.exec('user<name') === false && jf.handlers.username.exec('username') === true;
      });
      expect(result).toBe(true);
    });

    it('default password handler should enforce length', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        return jf.handlers.password.exec('ab') === false && jf.handlers.password.exec('valid pass 123') === true;
      });
      expect(result).toBe(true);
    });

    it('default numeric handler should validate numbers', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        return jf.handlers.numeric.exec('123') === true && jf.handlers.numeric.exec('-1,2.3') === true && jf.handlers.numeric.exec('abc') === false;
      });
      expect(result).toBe(true);
    });

    it('default email handler should validate emails', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        return jf.handlers.email.exec('test@example.com') === true && jf.handlers.email.exec('not-an-email') === false;
      });
      expect(result).toBe(true);
    });
  });

  describe('validate()', () => {
    it('should return true for disabled element', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#disabled');
        return jf.validate(el) === true;
      });
      expect(result).toBe(true);
    });

    it('should invalidate required empty input', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        el.value = '';
        return jf.validate(el) === false;
      });
      expect(result).toBe(true);
    });

    it('should validate required input with value', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        el.value = 'john';
        return jf.validate(el) === true;
      });
      expect(result).toBe(true);
    });

    it('should invalidate unchecked required checkbox', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#agree');
        el.checked = false;
        return jf.validate(el) === false;
      });
      expect(result).toBe(true);
    });

    it('should validate checked required checkbox', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#agree');
        el.checked = true;
        return jf.validate(el) === true;
      });
      expect(result).toBe(true);
    });

    it('should invalidate required select with no value', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#select');
        el.value = '';
        return jf.validate(el) === false;
      });
      expect(result).toBe(true);
    });

    it('should validate required select with value', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#select');
        el.value = '1';
        return jf.validate(el) === true;
      });
      expect(result).toBe(true);
    });

    it('should validate pattern match', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#pattern');
        el.value = 'abcdef';
        return jf.validate(el) === true;
      });
      expect(result).toBe(true);
    });

    it('should invalidate pattern mismatch', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#pattern');
        el.value = 'ABC123';
        return jf.validate(el) === false;
      });
      expect(result).toBe(true);
    });

    it('should validate via username handler', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        el.value = 'validuser';
        el.classList.add('validate-username');
        return jf.validate(el) === true;
      });
      expect(result).toBe(true);
    });

    it('should invalidate via username handler with special chars', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        el.value = 'bad<user';
        el.classList.add('validate-username');
        return jf.validate(el) === false;
      });
      expect(result).toBe(true);
    });

    it('should validate via email handler', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#email');
        el.value = 'test@example.com';
        el.classList.add('validate-email');
        return jf.validate(el) === true;
      });
      expect(result).toBe(true);
    });

    it('should invalidate via email handler with bad email', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#email');
        el.value = 'not-an-email';
        el.classList.add('validate-email');
        return jf.validate(el) === false;
      });
      expect(result).toBe(true);
    });

    it('should validate via numeric handler', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#numeric');
        el.value = '42';
        el.classList.add('validate-numeric');
        return jf.validate(el) === true;
      });
      expect(result).toBe(true);
    });

    it('should invalidate via numeric handler with text', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#numeric');
        el.value = 'abc';
        el.classList.add('validate-numeric');
        return jf.validate(el) === false;
      });
      expect(result).toBe(true);
    });

    it('should treat validate-none as valid', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        el.value = 'anything';
        el.classList.add('validate-none');
        return jf.validate(el) === true;
      });
      expect(result).toBe(true);
    });
  });

  describe('markValid / markInvalid / removeMarking', () => {
    it('markValid should add success classes and aria-invalid=false', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        el.value = 'test';
        jf.markValid(el);
        return el.classList.contains('form-control-success') &&
          !el.classList.contains('form-control-danger') &&
          !el.classList.contains('invalid') &&
          el.getAttribute('aria-invalid') === 'false' &&
          el.parentNode.classList.contains('has-success');
      });
      expect(result).toBe(true);
    });

    it('markInvalid should add danger classes and aria-invalid=true', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        jf.markInvalid(el, 'value');
        return el.classList.contains('form-control-danger') &&
          el.classList.contains('invalid') &&
          !el.classList.contains('form-control-success') &&
          el.getAttribute('aria-invalid') === 'true' &&
          el.parentNode.classList.contains('has-danger');
      });
      expect(result).toBe(true);
    });

    it('removeMarking should add valid class and remove danger/success', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        jf.removeMarking(el);
        return el.classList.contains('valid') &&
          !el.classList.contains('form-control-danger') &&
          !el.classList.contains('form-control-success') &&
          !el.parentNode.classList.contains('has-danger') &&
          !el.parentNode.classList.contains('has-success');
      });
      expect(result).toBe(true);
    });

    it('markInvalid should append feedback span to label', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        const label = document.querySelector('label[for="username"]');
        jf.markInvalid(el, 'value');
        return label.querySelector('span.form-control-feedback') !== null;
      });
      expect(result).toBe(true);
    });
  });

  describe('notify / switchClasses', () => {
    it('notify should call handleResponse and reportValidity', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        el.value = 'test';
        jf.notify(el, true);
        return el.classList.contains('form-control-success');
      });
      expect(result).toBe(true);
    });

    it('switchClasses with valid should call markValid', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        jf.switchClasses(el, true);
        return el.classList.contains('form-control-success');
      });
      expect(result).toBe(true);
    });

    it('switchClasses with invalid should call markInvalid', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        jf.switchClasses(el, false);
        return el.classList.contains('form-control-danger');
      });
      expect(result).toBe(true);
    });
  });

  describe('isValid(form)', () => {
    it('should return true for fully valid form', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        document.querySelector('#username').value = 'user';
        document.querySelector('#password').value = 'Valid Pass1';
        document.querySelector('#email').value = 'test@example.com';
        document.querySelector('#pattern').value = 'abcdef';
        document.querySelector('#agree').checked = true;
        document.querySelector('#select').value = '1';
        document.querySelector('#numeric').value = '123';
        return jf.isValid(form);
      });
      expect(result).toBe(true);
    });
    it('should return false for form with invalid fields', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        document.querySelector('#username').value = '';
        return jf.isValid(form);
      });
      expect(result).toBe(false);
    });

    it('should run customValidators', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        jf.custom = { alwaysFail: { exec: () => false } };
        document.querySelector('#username').value = 'user';
        document.querySelector('#password').value = 'Valid Pass1';
        document.querySelector('#email').value = 'test@example.com';
        document.querySelector('#pattern').value = 'abcdef';
        document.querySelector('#agree').checked = true;
        document.querySelector('#select').value = '1';
        return jf.isValid(form);
      });
      expect(result).toBe(false);
    });

    it('should call Joomla.renderMessages on invalid form', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        document.querySelector('#username').value = '';
        jf.isValid(form);
        return window.__joomla_messages !== undefined;
      });
      expect(result).toBe(true);
    });
  });

  describe('attachToForm', () => {
    it('should wire up blur/focus/submit events', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        el.value = 'testuser';
        el.dispatchEvent(new Event('blur'));
        return el.classList.contains('form-control-success');
      });
      expect(result).toBe(true);
    });

    it('should remove marking on focus', async () => {
      const result = await page.evaluate(() => {
        const form = document.querySelector('form');
        const jf = new window.JFormally(form);
        const el = document.querySelector('#username');
        jf.markInvalid(el, 'value');
        el.dispatchEvent(new Event('focus'));
        return el.classList.contains('valid') && !el.classList.contains('form-control-danger');
      });
      expect(result).toBe(true);
    });
  });
}, 10000);
