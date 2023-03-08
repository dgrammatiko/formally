import { defaultSettings } from '../src/defaults.js'
/**

validityState.valueMissing
validityState.typeMismatch
validityState.patternMismatch
validityState.tooLong
validityState.tooShort
validityState.rangeUnderflow
validityState.rangeOverflow
validityState.stepMismatch
validityState.badInput
validityState.valid
validityState.customError

 */
describe('Form', () => {
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

  describe('Form No validate', () => {
        beforeEach(async () => {
            page = await browser.newPage()
            await page.goto(`${URL}/tests/fixtures/form-no-validate.html`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('form');
        });

        it('Form should have a no validate', async () => {
            const novalidate = await page.evaluate(() => {
                const form = document.querySelector('form');
                return form.hasAttribute('novalidate');
            });
            expect(novalidate).toBeTruthy();
        })

        it('Form should not have a Formally object', async () => {
            const form = await page.evaluate(() => {
                return document.querySelector('form');
            });
            const FormallyObj = await page.evaluate(() => window.Formally.get(form));
            expect(FormallyObj).toBeUndefined();
        })
   }, 10000)

     describe('Form Validate, default options', () => {
        beforeEach(async () => {
            page = await browser.newPage()
            await page.goto(`${URL}/tests/fixtures/form-validate-1.html`, { waitUntil: 'domcontentloaded' });
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
            const FormallyObj = await page.evaluate(() => {
                const form = document.querySelector('form');
                return window.Formally.get(form);
            });

            expect(FormallyObj).toBeTruthy();
        });

        it('Form should have a Formally property with default values', async () => {
            const FormallyObj = await page.evaluate(() => {
                const form = document.querySelector('form');
                const FormallyN = window.Formally.get(form);
                return {
                    validClass: FormallyN.options.validClass,
                    invalidClass: FormallyN.options.invalidClass,
                };
            });

            expect(FormallyObj.validClass).toBe(defaultSettings.validClass)
            expect(FormallyObj.invalidClass).toBe(defaultSettings.invalidClass)
        })
   }, 10000)

  describe('Form Validate, options from data attributes', () => {
        beforeEach(async () => {
            page = await browser.newPage()
            await page.goto(`${URL}/tests/fixtures/form-validate-2.html`, { waitUntil: 'domcontentloaded' });
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
            const FormallyObj = await page.evaluate(() => {
                const form = document.querySelector('form');
                return window.Formally.get(form);
            });

            expect(FormallyObj).toBeTruthy();
        });

        it('Form should have a Formally.options property that differs from the default values', async () => {
            const FormallyObj = await page.evaluate(() => {
                const form = document.querySelector('form');
                const FormallyN = window.Formally.get(form);
                return {
                    validClass: FormallyN.options.validClass,
                    invalidClass: FormallyN.options.invalidClass,
                };
            });

            expect(FormallyObj.validClass).not.toBe(defaultSettings.validClass);
            expect(FormallyObj.invalidClass).not.toBe(defaultSettings.invalidClass);
        });
   }, 10000)

   describe('Form Validate, Valid form check [isValid]', () => {
        beforeEach(async () => {
            page = await browser.newPage()
            await page.goto(`${URL}/tests/fixtures/form-validate-3.html`, { waitUntil: 'domcontentloaded' });
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
            const FormallyObj = await page.evaluate(() => {
                const form = document.querySelector('form');
                return window.Formally.get(form);
            });

            expect(FormallyObj).toBeTruthy();
        });

        it('Form should be valid', async () => {
            const isValid = await page.evaluate(() => {
                form = document.querySelector('form');
                return window.Formally.get(form).isValid();
            });

            expect(isValid).toBeTruthy();
        });
    }, 10000)
}, 10000);
