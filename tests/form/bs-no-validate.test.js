const timeout = 5000;

describe(
    'No validate',
    () => {
        beforeAll(async () => {
            await page.goto(`${URL}/tests/fixtures/bs-no-validate.html`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('form');
        }, timeout);

        it('Form should have a no validate', async () => {
            const novalidate = await page.evaluate(() => {
                const form = document.querySelector('form');
                return form.hasAttribute('novalidate');
            });
            expect(novalidate).toBeTruthy();
        })

        it('Form should not have a Formally object', async () => {
            const Formally = await page.evaluate(() => {
                const form = document.querySelector('form');
                return form.Formally;
            });
            expect(Formally).toBeUndefined();
        })
    },
    timeout,
);


//await page.focus('#email')
// await page.keyboard.type('test54')
