export default () => {
  const API_KEY = 'AIzaSyAcTzkU5Oer4RHlNRuXvVbItDMRs14-Pcw';
  const CALLBACK_NAME = 'initMap';
  let initialized = window.google;
  let resolveInitPromise = null;
  let rejectInitPromise = null;

  const initPromise = new Promise((resolve, reject) => {
    resolveInitPromise = resolve;
    rejectInitPromise = reject;
  });

  // If Google Maps already is initialized
  // the `initPromise` should get resolved
  // eventually.
  if (initialized) return initPromise;

  initialized = true;
  // The callback function is called by
  // the Google Maps script if it is
  // successfully loaded.
  window[CALLBACK_NAME] = () => resolveInitPromise(window.google);

  // We inject a new script tag into
  // the `<head>` of our HTML to load
  // the Google Maps script.
  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('defer', '');
  script.setAttribute(
    'src',
    `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${CALLBACK_NAME}`
  );
  script.addEventListener('error', rejectInitPromise);
  document.querySelector('head').appendChild(script);

  return initPromise;
};
