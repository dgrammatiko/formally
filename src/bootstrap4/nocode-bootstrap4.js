/* eslint no-undef: 0 */
import { Formally } from './bootstrap4';

const forms = [].slice.call(document.querySelectorAll('form:not([novalidate]'));

forms.forEach(form => { new Formally(form); });

export { Formally };
