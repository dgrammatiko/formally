import { afterAll, beforeEach, beforeAll, describe, expect, it } from 'vitest';
import { startServer } from './static-server.js';
import puppeteer from 'puppeteer';

describe('Input textarea', () => {
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
    await page.goto(`http://localhost:${port}/tests/fixtures/form-validate-1.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('form');
    await page.waitForFunction(() => typeof window.Formally !== 'undefined');
  })

  afterAll(async () => {
    await browser.close()
    await new Promise((resolve) => server.close(resolve))
  })

  it('Form should not have a novalidate attribute', async () => {
    const novalidate = await page.evaluate(() => {
      const form = document.querySelector('form');
      return form.hasAttribute('novalidate');
    });
    expect(novalidate).toBeFalsy();
  });

  it('Form should have a Formally object', async () => {
    const FormallyObj = await page.evaluate(() => {
      const form = document.querySelector('form');
      return window.Formally.get(form);
    });

    expect(FormallyObj).toBeTruthy();
  });

  it('Form should be invalid (textarea required, empty)', async () => {
    const isValid = await page.evaluate(() => {
      form = document.querySelector('form');
      return window.Formally.get(form).isValid();
    });

    expect(isValid).toBeFalsy();
  });

  it('Textarea should have invalid class after isValid', async () => {
    const className = await page.evaluate(() => {
      form = document.querySelector('form');
      window.Formally.get(form).isValid();
      const element = document.querySelector('#validationTextarea');
      return element.className;
    });

    expect(className).toContain('is-invalid');
  });
}, 10000);
