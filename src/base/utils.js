/* eslint no-undef: 0 */
export const guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4();
};

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