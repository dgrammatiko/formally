import { afterAll, beforeEach, beforeAll, describe, expect, it } from 'vitest';
import { startServer } from './static-server.js';
import puppeteer from 'puppeteer';

describe('Form validate 5 (multiple inputs)', () => {
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
    await page.goto(`http://localhost:${port}/tests/fixtures/form-validate-5.html`, { waitUntil: 'domcontentloaded' });
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

  it('Form should be invalid (all inputs empty/pattern mismatch)', async () => {
    const isValid = await page.evaluate(() => {
      form = document.querySelector('form');
      return window.Formally.get(form).isValid();
    });

    expect(isValid).toBeFalsy();
  });

  it('All required empty inputs should have invalid class', async () => {
    const classes = await page.evaluate(() => {
      form = document.querySelector('form');
      window.Formally.get(form).isValid();
      return ['text1', 'text3', 'text4', 'text5'].map(id => {
        const el = document.querySelector(`#${id}`);
        return el.className;
      });
    });

    classes.forEach(className => {
      expect(className).toContain('is-invalid');
      expect(className).not.toContain('is-valid');
    });
  });

  it('Pattern-mismatched input (text2) should have invalid class', async () => {
    const className = await page.evaluate(() => {
      form = document.querySelector('form');
      window.Formally.get(form).isValid();
      const el = document.querySelector('#text2');
      return el.className;
    });

    expect(className).toContain('is-invalid');
    expect(className).not.toContain('is-valid');
  });
}, 10000);
