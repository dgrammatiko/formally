import test from 'ava';
import withPage from './_setup';
import httpServer from 'http-server/lib/http-server';
const root = process.cwd();

var server = httpServer.createServer({
  root: `${root}/test`,
});

server.listen(8080);


const url = 'http://127.0.0.1:8080/input/input.text.html';

test('page title should contain "Some"', withPage, async (t, page) => {
  await page.goto(url);
  t.true((await page.title()).includes('Some'));
});

// test('page should contain an element with `#hplogo` selector', withPage, async (t, page) => {
//   await page.goto(url);
//   t.not(await page.$('#hplogo'), null);
// });

// test('search form should match the snapshot', withPage, async (t, page) => {
//   await page.goto(url);
//   const innerHTML = await page.evaluate(form => form.innerHTML, await page.$('#searchform'));
//   t.snapshot(innerHTML);


// });