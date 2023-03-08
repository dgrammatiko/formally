import { afterAll, beforeEach, beforeAll, describe, expect, it, test } from 'vitest';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

let server
let browser
let page

describe('NUMBER: Pattern missmatch, Invalid form check [isValid]', () => {
  beforeAll(async () => {
    server = await preview({ preview: { port: 5432 } })
    browser = await puppeteer.launch()
    page = await browser.newPage()
    await page.setViewport({ width: 600, height: 400 });
    await page.goto(`http://localhost:5432/tests/fixtures/input-number.html`, { waitUntil: 'domcontentloaded' });
  })

  afterAll(async () => {
    await browser.close()
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()))
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

  it('Form should be invalid', async () => {
      const isValid = await page.evaluate(() => {
          form = document.querySelector('form');
          return window.Formally.get(form).isValid();
      });

      expect(isValid).toBeFalsy();
  });

  // it('Input number should have invalid message below', async () => {
  //     await page.waitForSelector('#number', { visible: true })
  //     await page.focus("#number");
  //     await page.keyboard.type('aaa')

  //     await page.focus('[type=submit]');

  //     const label = await page.evaluate(() => {
  //         form = document.querySelector('form');
  //         window.Formally.get(form).isValid();
  //         const element = document.querySelector('#number');
  //         const msg = element.parentNode.querySelector('[aria-live="polite"]');

  //         return msg.innerText;
  //     });

  //     expect(label).toBe('Value Missing'); // Chrome doesnt alow non numeric values
  // }, 1000);
});
