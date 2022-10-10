const timeout = 50000;

describe(
    'Bootstrap Validate, Valid form check [isValid]',
    () => {
        beforeAll(async () => {
            jest.setTimeout(35000);
            await page.goto(`http://localhost:8888/tests/fixtures/bs-validate-3.html`, { waitUntil: 'networkidle2' });
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

        it('Form should be valid', async () => {
            const isValid = await page.evaluate(() => {
                form = document.querySelector('form');
                return form.Formally.isValid();
            });

            expect(isValid).toBeTruthy();
        });
    },
    timeout,
);
