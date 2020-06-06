const timeout = 5000;

describe(
    'Bootstrap Validate, Invalid form check [isValid]',
    () => {
        beforeAll(async () => {
            await page.goto(`${URL}/tests/fixtures/bs-validate-4.html`, { waitUntil: 'networkidle2' });
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

        it('Form should be invalid', async () => {
            const isValid = await page.evaluate(() => {
                form = document.querySelector('form');
                return ('Formally' in form && form.Formally.isValid());
            });

            expect(isValid).toBeFalsy();
        });

        it('Form should have invalid message below', async () => {
            const label = await page.evaluate(() => {
                form = document.querySelector('[aria-live="polite"]');
                return form.innerText;
            });

            expect(label).toBe('Only lowercase letters here');
        });
    },
    timeout,
);


//await page.focus('#email')
// await page.keyboard.type('test54')

