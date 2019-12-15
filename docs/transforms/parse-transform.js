const jsdom = require('@tbranyen/jsdom');
const { JSDOM } = jsdom;
const minify = require('../utils/minify.js');
const slugify = require('slugify');

// function parseCodeBlocks(text) {
//   //  const regEx = /(```([a-z]*)\n([\s\S]*?\n)```)/g;
//   //^`{3}([\S]+)?\n([\s\S]+)\n`{3}
//   // const codeblock = /```\s*([^]+?.*?[^]+?[^]+?)```/g;
//   const myRe = new RegExp(/(```([a-z]*)\n([\s\S]*?\n)```)/g);
//   const hasCode = myRe.exec(text);
//   if (hasCode) {
//     return {
//       language: hasCode[1],
//       code: hasCode[2]
//     };
//   }
//   return hasCode;
// }

function restoreCoded(input) {
  return decodeURIComponent(input)
    .replace(/%2F/g, '/')
    .replace(/%3B/g, ';')
    .replace(/%23/g, '#')
    .replace(/%20/g, ' ')
    .replace(/%2C/g, ',')
    .replace(/%2F/g, '/')
    .replace(/%3F/g, '?')
    .replace(/%3A/g, ':')
    .replace(/%40/g, '@')
    .replace(/%26/g, '&')
    .replace(/%3D/g, '=')
    .replace(/%2B/g, '+')
    .replace(/%24/g, '$');
}

module.exports = function (value, outputPath) {
  if (outputPath.endsWith('.html')) {
    const DOM = new JSDOM(value, {
      resources: 'usable'
    });

    const document = DOM.window.document;
    const articleImages = [...document.querySelectorAll('main article img')];
    const articleHeadings = [
      ...document.querySelectorAll('main article h2, main article h3')
    ];
    const articleEmbeds = [...document.querySelectorAll('main article iframe')];
    const pens = [...document.querySelectorAll('.codepen')];

    if (articleImages.length) {
      articleImages.forEach(image => {
        image.setAttribute('loading', 'lazy');

        // If an image has a title it means that the user added a caption
        // so replace the image with a figure containing that image and a caption
        if (image.hasAttribute('title')) {
          const figure = document.createElement('figure');
          const figCaption = document.createElement('figcaption');

          figCaption.innerHTML = image.getAttribute('title');

          image.removeAttribute('title');

          figure.appendChild(image.cloneNode(true));
          figure.appendChild(figCaption);

          image.replaceWith(figure);
        }
      });
    }

    if (articleHeadings.length) {
      // Loop each heading and add a little anchor and an ID to each one
      articleHeadings.forEach(heading => {
        const headingSlug = slugify(heading.textContent.toLowerCase());
        const anchor = document.createElement('a');

        anchor.setAttribute('href', `#heading-${headingSlug}`);
        anchor.classList.add('heading-permalink');
        anchor.innerHTML = minify(`
        <span class='visually-hidden'> permalink</span>
        <svg fill='currentColor' aria-hidden='true' focusable='false' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <path d='M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z'/>
        </svg>`);

        heading.setAttribute('id', `heading-${headingSlug}`);
        heading.appendChild(anchor);
      });
    }

    // Look for videos are wrap them in a container element
    if (articleEmbeds.length) {
      articleEmbeds.forEach(embed => {
        if (embed.hasAttribute('allowfullscreen')) {
          const player = document.createElement('div');

          player.classList.add('video-player');

          player.appendChild(embed.cloneNode(true));

          embed.replaceWith(player);
        }
      });
    }

    // Create the codepen examples
    if (pens.length) {
      const value = {
        // All Optional
        title: 'Formally.js Example',
        description: 'Seeing is believing',
        private: false, // true || false - When the Pen is saved, it will save as Private if logged in user has that privledge, otherwise it will save as public
        // tags: [], // an array of strings
        editors: '100', // Set which editors are open. In this example HTML open, CSS closed, JS open
        layout: 'left', // top | left | right
        html_pre_processor: 'none',
        css_pre_processor: 'none',
        css_starter: 'neither',
        css_prefix: 'neither',
        js_pre_processor: 'none',
        html_classes: '',
        head: '<meta name="viewport" content="width=device-width">',
        css_external: 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css', // semi-colon separate multiple files
        js_external: 'https://formally.netlify.com/dist/bootstrap4/nocode-bootstrap4.iffe.es5.min.js', // semi-colon separate multiple files

        // These go in the CSS itself now, like `@import 'compass';`
        css_pre_processor_lib: '',

        // Link up in js_external if needed
        js_modernizr: 'false',
        js_library: '',
        js_module: true
      };

      pens.forEach(pen => {
        const codes = [...pen.querySelectorAll('pre')];

        codes.forEach(cd => {
          if (cd.classList.contains('language-html')) {
            value.html = restoreCoded(cd.dataset.html);
            cd.removeAttribute('data-html');
          }
          if (cd.classList.contains('language-css')) {
            value.css = restoreCoded(cd.dataset.css);
            cd.removeAttribute('data-css');
          }
          if (cd.classList.contains('language-js')) {
            value.js = restoreCoded(cd.dataset.js);
            cd.removeAttribute('data-js');
          }
        });

        const form = document.createElement('form');
        form.action = 'https://codepen.io/pen/define';
        form.method = 'POST';
        form.target = '_blank';
        const button = document.createElement('input');
        button.type = 'submit';
        button.value = 'Create New Pen with the showcased example';
        button.setAttribute('class', '[ button ] [ font-base text-base weight-bold ]');
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(value);

        form.appendChild(input);
        form.appendChild(button);
        pen.appendChild(form);
      });
    }
    return '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
  }
  return value;
};
