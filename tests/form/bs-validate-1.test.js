import { defaultSettings } from '../../src/defaults.js'

const timeout = 50000;

describe(
    'Bootstrap Validate, default options',
    () => {
        beforeAll(async () => {
            jest.setTimeout(35000);
            await page.goto(`http://localhost:8888/tests/fixtures/bs-validate-1.html`, { waitUntil: 'networkidle2' });
        }, timeout);

        it('Form should not have a novalidate attribute', async () => {
            const novalidate = await page.evaluate(() => {
                const form = document.querySelector('form');
                return form.hasAttribute('novalidate');
            });
            expect(novalidate).toBeFalsy();
        });

        it('Form should have a Formally object', async () => {
            const Formally = await page.evaluate(() => {
                form = document.querySelector('form');
                return 'Formally' in form;
            });

            expect(Formally).toBeTruthy();
        });

        it('Form should have a Formally property with default values', async () => {
            const Formally = await page.evaluate(() => {
                form = document.querySelector('form');
                return {
                    validClass: form.Formally.options.validClass,
                    invalidClass: form.Formally.options.invalidClass,
                    indicator: form.Formally.options.indicator,
                    indicatorElement: form.Formally.options.indicatorElement,
                    indicatorPosition: form.Formally.options.indicatorPosition,
                    indicatorClass: form.Formally.options.indicatorClass,
                    invalidForm: form.Formally.options.invalidForm,
                    invalidFormAlert: form.Formally.options.invalidFormAlert,
                };
            });

            expect(Formally.validClass).toBe(defaultSettings.validClass)
            expect(Formally.invalidClass).toBe(defaultSettings.invalidClass)
            expect(Formally.indicator).toBe(defaultSettings.indicator)
            expect(Formally.indicatorElement).toBe(defaultSettings.indicatorElement)
            expect(Formally.indicatorPosition).toBe(defaultSettings.indicatorPosition)
            expect(Formally.indicatorClass).toBe(defaultSettings.indicatorClass)
            expect(Formally.invalidForm).toBe(defaultSettings.invalidForm)
            expect(Formally.invalidFormAlert).toBe(defaultSettings.invalidFormAlert)
        });
    },
    timeout,
);


//await page.focus('#email')
// await page.keyboard.type('test54')
