import { afterAll, beforeEach, beforeAll, describe, expect, it } from 'vitest';
import { startServer } from './static-server.js';
import puppeteer from 'puppeteer';

describe('Dispose and mutation observer', () => {
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

  it('Mutation observer should add newly added input elements to validation', async () => {
    const result = await page.evaluate(async () => {
      const form = document.querySelector('form');
      const formally = window.Formally.get(form);
      const beforeCount = formally.elementsForValidation.length;

      const newInput = document.createElement('input');
      newInput.type = 'text';
      newInput.id = 'dynamically-added';
      newInput.required = true;
      form.appendChild(newInput);

      await new Promise((resolve) => setTimeout(resolve, 50));

      return {
        beforeCount,
        afterCount: formally.elementsForValidation.length,
        hasNewElement: formally.elementsForValidation.some((el) => el.id === 'dynamically-added'),
      };
    });

    expect(result.afterCount).toBe(result.beforeCount + 1);
    expect(result.hasNewElement).toBe(true);
  });

  it('dispose() should clear elementsForValidation and disconnect observer', async () => {
    const result = await page.evaluate(() => {
      const form = document.querySelector('form');
      const formally = window.Formally.get(form);
      const beforeCount = formally.elementsForValidation.length;
      formally.dispose();
      return {
        beforeCount,
        afterCount: formally.elementsForValidation.length,
        observer: formally.observer,
      };
    });

    expect(result.beforeCount).toBeGreaterThan(0);
    expect(result.afterCount).toBe(0);
    expect(result.observer).toBeNull();
  });
}, 10000);
