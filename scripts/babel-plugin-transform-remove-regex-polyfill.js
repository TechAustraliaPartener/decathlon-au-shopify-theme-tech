module.exports = function() {
  return {
    name: 'transform-remove-regex-polyfill',
    visitor: {
      ImportDeclaration(path) {
        const importPath = path.node.source.value;
        // These polyfills are being injected unnecessarily and seem to be
        // broken in IE11, causing this error: "Syntax error in regular expression"
        if (importPath.match(/core-js\/modules\/es6.regexp/)) {
          path.remove();
        }
      }
    }
  };
};
