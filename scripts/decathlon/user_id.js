import $ from 'jquery';

import {
  localStorageAvailable,
  sessionStorageAvailable,
  setObjectInLocalStorage,
  getObjectInLocalStorage,
  removeItemFromLocalStorage,
  cookiesAvailable
} from '../utilities/storage';

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var user_id = getParameterByName('user_id');

if (user_id) {
  if (cookiesAvailable) {
    Cookies.set(user_id, user_id);
    console.log(Cookies.get(user_id));
  } else if (localStorageAvailable) {
    setObjectInLocalStorage(user_id, user_id);
    console.log(getObjectInLocalStorage(user_id););
  }
}