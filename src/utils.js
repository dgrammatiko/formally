/**
 * Method that returns a unique string
 *
 * @return {string} Can be used for unique id's
 */
/* eslint no-undef: 0 */
export const guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  return s4() + s4() + '-' + s4() + s4();
};

/**
 * Initialize new store and apply all modules to the store.
 *
 * @param {number} delay The delay for the debounced function to be called
 * @param {function} fn The debounced function to be called

 * @return {void}
 */
export const debounce = function (delay, fn) {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
};
