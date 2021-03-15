import { defaultSettings } from '../src/defaults.js'

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
            const Formally = await page.evaluate(() => Formally.get(form));
            expect(Formally).toBeUndefined();
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
            const Formally = await page.evaluate(() => {
                const form = document.querySelector('form');
                return Formally.get(form);
            });

            expect(Formally).toBeTruthy();
        });

        it('Form should have a Formally property with default values', async () => {
            const FormallyO = await page.evaluate(() => {
                const form = document.querySelector('form');
                const FormallyN = Formally.get(form);
                return {
                    validClass: FormallyN.options.validClass,
                    invalidClass: FormallyN.options.invalidClass,
                    indicator: FormallyN.options.indicator,
                    indicatorElement: FormallyN.options.indicatorElement,
                    indicatorPosition: FormallyN.options.indicatorPosition,
                    indicatorClass: FormallyN.options.indicatorClass,
                    invalidForm: FormallyN.options.invalidForm,
                    invalidFormAlert: FormallyN.options.invalidFormAlert,
                };
            });

            expect(FormallyO.validClass).toBe(defaultSettings.validClass)
            expect(FormallyO.invalidClass).toBe(defaultSettings.invalidClass)
            expect(FormallyO.indicator).toBe(defaultSettings.indicator)
            expect(FormallyO.indicatorElement).toBe(defaultSettings.indicatorElement)
            expect(FormallyO.indicatorPosition).toBe(defaultSettings.indicatorPosition)
            expect(FormallyO.indicatorClass).toBe(defaultSettings.indicatorClass)
            expect(FormallyO.invalidForm).toBe(defaultSettings.invalidForm)
            expect(FormallyO.invalidFormAlert).toBe(defaultSettings.invalidFormAlert)
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
            const Formally = await page.evaluate(() => {
                const form = document.querySelector('form');
                return Formally.get(form);
            });

            expect(Formally).toBeTruthy();
        });

        it('Form should have a Formally.options property that differs from the default values', async () => {
                const FormallyO = await page.evaluate(() => {
                const form = document.querySelector('form');
                const FormallyN = Formally.get(form);
                return {
                    validClass: FormallyN.options.validClass,
                    invalidClass: FormallyN.options.invalidClass,
                    indicator: FormallyN.options.indicator,
                    indicatorElement: FormallyN.options.indicatorElement,
                    indicatorPosition: FormallyN.options.indicatorPosition,
                    indicatorClass: FormallyN.options.indicatorClass,
                    invalidForm: FormallyN.options.invalidForm,
                    invalidFormAlert: FormallyN.options.invalidFormAlert,
                };
            });

            expect(FormallyO.validClass).not.toBe(defaultSettings.validClass);
            expect(FormallyO.invalidClass).not.toBe(defaultSettings.invalidClass);
            expect(FormallyO.indicator).not.toBe(defaultSettings.indicator);
            expect(FormallyO.indicatorElement).not.toBe(defaultSettings.indicatorElement);
            expect(FormallyO.indicatorPosition).not.toBe(defaultSettings.indicatorPosition);
            expect(FormallyO.indicatorClass).not.toBe(defaultSettings.indicatorClass);
            expect(FormallyO.invalidForm).not.toBe(defaultSettings.invalidForm);
            expect(FormallyO.invalidFormAlert).not.toBe(defaultSettings.invalidFormAlert);
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
            const Formally = await page.evaluate(() => {
                const form = document.querySelector('form');
                return Formally.get(form);
            });

            expect(Formally).toBeTruthy();
        });

        it('Form should be valid', async () => {
            const isValid = await page.evaluate(() => {
                form = document.querySelector('form');
                return Formally.get(form).isValid();
            });

            expect(isValid).toBeTruthy();
        });
    }, 10000)
}, 10000);
