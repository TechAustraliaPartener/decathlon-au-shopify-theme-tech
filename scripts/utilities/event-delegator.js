/**
 * Very simple vanilla JS event delegator
 * @TODO - For some reason I can't figure out, removing listeners appears not
 * to be working
 * Leaving as-is for future debugging
 * In current use cases, we do not need to remove these event listeners, but
 * would be a nice-to-have for other use cases
 * @param {Object} params
 * @param {string} [params.base='document'] params.base - The base element to
 * delegate from
 * @param {string} params.selector - The selector to target
 * @param {string} params.type - The type of even to listen for or remove
 * @param {function} params.callback - The event listener callback to bind or
 * remove binding to
 * @param {string} params.listenerName - The name to use to register the
 * listener, which would otherwise be anonymous.
 * Allows removal of previously registered listeners
 * @param {Boolean} [params.remove=false] - Whether to remove this listener binding
 * @param {Boolean} [params.useCapture=false] - Whether to use only the capture
 * phase to register the listener
 */
export const delegateEvent = (function() {
  // Create a closure and an object to hold events to be registered and de-registered
  const events = {};
  return ({
    base = 'document',
    selector,
    type,
    callback,
    listenerName,
    remove = false,
    useCapture = false
  }) => {
    if (!selector || !type || !callback || !listenerName) {
      console.error('Event delegator missing required params');
      return;
    }
    events[listenerName] = function(e) {
      for (
        let target = e.target;
        target && target !== this;
        target = target.parentNode
      ) {
        if (target.matches(selector)) {
          callback.call(target, e);
          break;
        }
      }
    };
    if (remove) {
      window[base].removeEventListener(type, events[listenerName], useCapture);
      delete events[listenerName];
      return;
    }
    window[base].addEventListener(type, events[listenerName], useCapture);
  };
})();
