import { defaultSettings } from '../../src/defaults.js'

const timeout = 5000;

describe(
    'Bootstrap Validate, options from data attributes',
    () => {
        beforeAll(async () => {
            await page.goto(`${URL}/tests/fixtures/bs-validate-2.html`, { waitUntil: 'networkidle2' });
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

        it('Form should have a Formally.options property that differs from the default values', async () => {
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

            expect(Formally.validClass).not.toBe(defaultSettings.validClass);
            expect(Formally.invalidClass).not.toBe(defaultSettings.invalidClass);
            expect(Formally.indicator).not.toBe(defaultSettings.indicator);
            expect(Formally.indicatorElement).not.toBe(defaultSettings.indicatorElement);
            expect(Formally.indicatorPosition).not.toBe(defaultSettings.indicatorPosition);
            expect(Formally.indicatorClass).not.toBe(defaultSettings.indicatorClass);
            expect(Formally.invalidForm).not.toBe(defaultSettings.invalidForm);
            expect(Formally.invalidFormAlert).not.toBe(defaultSettings.invalidFormAlert);
        });
    },
    timeout,
);
