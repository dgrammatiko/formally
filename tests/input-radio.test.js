import { afterAll, beforeEach, beforeAll, describe, expect, it } from 'vitest';
import { startServer } from './static-server.js';
import puppeteer from 'puppeteer';

describe('Input radio', () => {
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
    await page.goto(`http://localhost:${port}/tests/fixtures/input-radio.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('form');
    await page.waitForFunction(() => typeof window.Formally !== 'undefined');
  })

  afterAll(async () => {
    await browser.close()
    await new Promise((resolve) => server.close(resolve))
  })

  it('Form should have a Formally object', async () => {
    const FormallyObj = await page.evaluate(() => {
      const form = document.querySelector('form');
      return window.Formally.get(form);
    });

    expect(FormallyObj).toBeTruthy();
  });

  it('Form should be invalid (required radio group, none selected)', async () => {
    const isValid = await page.evaluate(() => {
      form = document.querySelector('form');
      return window.Formally.get(form).isValid();
    });

    expect(isValid).toBeFalsy();
  });

  it('All radios in a required group should have invalid class when none selected', async () => {
    const classes = await page.evaluate(() => {
      form = document.querySelector('form');
      window.Formally.get(form).isValid();
      return Array.from(document.querySelectorAll('input[type="radio"][name="color"]')).map(el => el.className);
    });

    classes.forEach(className => {
      expect(className).toContain('is-invalid');
      expect(className).not.toContain('is-valid');
    });
  });

  it('Form should be valid after selecting a radio', async () => {
    const isValid = await page.evaluate(() => {
      form = document.querySelector('form');
      document.querySelector('#color-blue').checked = true;
      return window.Formally.get(form).isValid();
    });

    expect(isValid).toBeTruthy();
  });

  it('All radios in a group should have valid class when one is selected', async () => {
    const classes = await page.evaluate(() => {
      form = document.querySelector('form');
      document.querySelector('#color-blue').checked = true;
      window.Formally.get(form).isValid();
      return Array.from(document.querySelectorAll('input[type="radio"][name="color"]')).map(el => el.className);
    });

    classes.forEach(className => {
      expect(className).toContain('is-valid');
      expect(className).not.toContain('is-invalid');
    });
  });
}, 10000);
