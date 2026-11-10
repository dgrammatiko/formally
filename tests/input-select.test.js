import { afterAll, beforeEach, beforeAll, describe, expect, it } from 'vitest';
import { startServer } from './static-server.js';
import puppeteer from 'puppeteer';

describe('Input select', () => {
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

  it('Form should have a Formally object', async () => {
    const FormallyObj = await page.evaluate(() => {
      const form = document.querySelector('form');
      return window.Formally.get(form);
    });

    expect(FormallyObj).toBeTruthy();
  });

  it('Select (required, no selection) should have invalid class after isValid', async () => {
    const className = await page.evaluate(() => {
      form = document.querySelector('form');
      window.Formally.get(form).isValid();
      const element = document.querySelector('select');
      return element.className;
    });

    expect(className).toContain('is-invalid');
    expect(className).not.toContain('is-valid');
  });
}, 10000);
