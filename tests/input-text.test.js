import { defaultSettings } from '../src/defaults.js'

describe('Input text', () => {
  let browser = global.__BROWSER__;
  let page

  describe('TEXT: Pattern Missmatch, Invalid form check [isValid]', () => {
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

        // it('Form should have invalid message below', async () => {
        //     await page.waitForSelector('#text', { visible: true })
        //     await page.focus('#text')
        //     await page.keyboard.type('FFFFF', { delay: 100 })
        //     await page.focus('[type=submit]')
        //     const label = await page.evaluate(() => {
        //         form = document.querySelector('form');
        //         window.Formally.get(form).isValid();
        //         const element = document.querySelector('#text');
        //         const msg = element.parentNode.querySelector('[aria-live="polite"]');

        //         return msg.innerText;
        //     });

        //     expect(label).toBe('Pattern Missmatch');
        // });
    });

    describe('TEXT: Required, Invalid form check [isValid]', () => {
        beforeAll(async () => {
            jest.setTimeout(3500);
            await page.goto(`${URL}/tests/fixtures/input-text.html`, { waitUntil: 'domcontentloaded' });
        }, 10000);

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

        // it('Form should have invalid message below', async () => {
        //     await page.waitForSelector('#text', { visible: true })
        //     await page.focus('#text')
        //     await page.keyboard.type('', { delay: 100 })
        //     await page.focus('[type=submit]')
        //     const label = await page.evaluate(() => {
        //         form = document.querySelector('form');
        //         Formally.get(form).isValid();
        //         const element = document.querySelector('#text');
        //         const msg = element.parentNode.querySelector('[aria-live="polite"]');

        //         return msg.innerText;
        //     });

        //     expect(label).toBe('Value Missing');
        // });
    }, 10000);

    describe('TEXT: Too Long, Invalid form check [isValid]', () => {
        beforeAll(async () => {
            jest.setTimeout(3500);
            await page.goto(`${URL}/tests/fixtures/input-text.html`, { waitUntil: 'domcontentloaded' });
        }, 10000);

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

        // it('Form should have invalid message below', async () => {
        //     await page.waitForSelector('#text', { visible: true })
        //     await page.focus('#text')
        //     await page.keyboard.type('fffffffffffffffff', { delay: 100 })
        //     await page.focus('[type=submit]')
        //     const formIsValid = await page.evaluate(() => {
        //         form = document.querySelector('form');
        //         // const element = document.querySelector('#text');
        //         // const msg = element.parentNode.querySelector('[aria-live="polite"]');

        //         return Formally.get(form).isValid();
        //     });

        //     // Chrome and the rest Browsers disallow entering more than the max
        //     expect(formIsValid).toBeTruthy();
        // });
    }, 10000);


    describe('TEXT: Too short, Invalid form check [isValid]', () => {
        beforeAll(async () => {
            jest.setTimeout(3500);
            await page.goto(`${URL}/tests/fixtures/input-text.html`, { waitUntil: 'domcontentloaded' });
        }, 10000);

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

        // it('Form should have invalid message below', async () => {
        //     await page.waitForSelector('#text', { visible: true })
        //     await page.focus('#text')
        //     await page.keyboard.type('ff', { delay: 100 })
        //     await page.focus('[type=submit]')
        //     const label = await page.evaluate(() => {
        //         form = document.querySelector('form');
        //         Formally.get(form).isValid();
        //         const element = document.querySelector('#text');
        //         const msg = element.parentNode.querySelector('[aria-live="polite"]');

        //         return msg.innerText;
        //     });

        //     expect(label).toBe('Too Short');
        // });
    }, 10000);
}, 10000);
