import { Formally as FormallyMod } from './formally.js';

window.Formally = window.Formally || new WeakMap();

document.querySelectorAll('form.validate:not([novalidate]').forEach(form => window.Formally.set(form, new FormallyMod(form)));
