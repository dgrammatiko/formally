import { defaultSettings } from '../src/defaults.js'

describe('Input text', () => {
  let browser = global.__BROWSER__;
  let page

//   beforeAll(async () => {
//       browser = await puppeteer.launch({
//           product: 'firefox'
//       });
//   })

//   afterEach(async () => {
//       await page.close()
//     })

//   afterAll(async () => {
//     await browser.close()
//   })

  describe('Form Validate, options from data attributes', () => {
        beforeEach(async () => {
            page = await browser.newPage()
            await page.goto(`${URL}/tests/fixtures/input-text.html`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('form');
        });

        it('Form should not have a novalidate attribute', async () => {
            const novalidate = await page.evaluate(() => {
                const form = document.querySelector('form');
                return form.hasAttribute('novalidate');
            });
            expect(novalidate).toBeFalsy();
        });

        it('Form should have a Formally object', async () => {
            const Formally = await page.evaluate(() => {
                const form = document.querySelector('form');
                return Formally.get(form);
            });

            expect(Formally).toBeTruthy();
        });

        it('Form should be invalid', async () => {
            const isValid = await page.evaluate(() => {
                form = document.querySelector('form');
                return window.Formally.get(form).isValid();
            });

            expect(isValid).toBeFalsy();
        });

        it('Form should have invalid message below', async () => {
            await page.focus('#text')
            await page.keyboard.type('FFFFF', { delay: 100 })
            await page.focus('[type=submit]')
            const label = await page.evaluate(() => {
                form = document.querySelector('form');
                window.Formally.get(form).isValid();
                const element = document.querySelector('#text');
                const msg = element.parentNode.querySelector('[aria-live="polite"]');

                return msg.innerText;
            });

            expect(label).toBe('Pattern Missmatch');
        });
    });

}, 10000);
