const timeout = 50000;

describe(
    'Bootstrap Validate, Invalid messages for input type text',
    () => {
        beforeAll(async () => {
            jest.setTimeout(35000);
            await page.goto(`http://localhost:8888/tests/fixtures/bs-validate-5.html`, { waitUntil: 'networkidle2' });
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

        // Required
        it('Form element with required attribute has correct message below', async () => {
            const label = await page.evaluate(() => {
                const element = document.querySelector('#text1');
                const msg = element.parentNode.querySelector('[aria-live="polite"]');

                return msg.innerText;
            });

            expect(label).toBe('The Text Input cannot be empty');
        });

        //     // Pattern mismarch
        //     it('Form element with Pattern mismarched value has correct message below', () => {
        //         cy.get('#text2').then((element) => {
        //             const msg = element.parent().find('[aria-live="polite"]')
        //             expect(msg.text()).to.equal('Only lowercase letters here')
        //         });
        //     });

        // Too short
        it('Form element with Too short value has correct message below', async () => {
            await page.focus('#text3')
            await page.keyboard.type('fail', { delay: 100 })
            await page.focus('#text2')
            const label = await page.evaluate(() => {
                const element = document.querySelector('#text3');
                const msg = element.parentNode.querySelector('[aria-live="polite"]');

                return msg.innerText;
            });

            expect(label).toBe('Not smaller than 5 letters');
        });

        // Too big
        it('Form element with Too big value has correct message below', async () => {
            await page.focus('#text4')
            await page.keyboard.type('failfailfail', { delay: 100 })
            await page.focus('#text3')
            const label = await page.evaluate(() => {
                const element = document.querySelector('#text4');
                if (element.value.length === parseInt(element.getAttribute('maxlength'))) {
                    return true;
                }
                // else {
                //     const msg = element.parentNode.querySelector('[aria-live="polite"]');
                //     return msg.innerText;
                // }
            });


            expect(label).toBeTruthy();
        });
    },
    timeout,
);


//await page.focus('#email')
// await page.keyboard.type('test54')

// describe('Bootstrap Validate, Invalid messages for input type text', () => {


//     // Required
//     it('Form element with required attribute has correct message below', () => {
//         cy.get('#text1').then((element) => {
//             const msg = element.parent().find('[aria-live="polite"]')
//             expect(msg.text()).to.equal('The Text Input cannot be empty')
//         });
//     });




// });
