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
 * Method to check is passive option is supported
 *
 * @return {boolean}
 */
export const uaSupportsPassive = () => {
  let isSupported = false;
  try {
    const options = {
      get passive() {
        isSupported = true;
        return true;
      }
    };

    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
  } catch (err) {
    isSupported = false;
    return false;
  }

  return isSupported;
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

/*
Events that form elements support
Supported
- blur fired when the form element loses focus
- change fired on form elements when the element value is changed. In the case of text input elements and textarea, it’s fired only once when the element loses focus (not for every single character typed)
- input fired on form elements when the element value is changed

Maybe
- cut fired when the user cuts text from the form element
- paste fired when the user pastes text into the form element
Maybe not
- copy fired when the user copies text from the form element
- focus fired when the form element gains focus
*/
