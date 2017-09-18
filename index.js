// using: regex, capture groups, and capture group variables.
var templateUrlRegex = /templateUrl( *: *string)? *=(.*)$/gm;
var stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function replaceStringsWithRequires(string) {
  return string.replace(stringRegex, function (match, quote, url) {
    if (url.charAt(0) !== ".") {
      url = "./" + url;
    }
    return "require('" + url + "')";
  });
}

module.exports = function(source, sourcemap) {
  // Not cacheable during unit tests;
  this.cacheable && this.cacheable();

  var newSource = source.replace(templateUrlRegex, function (match, optionalType, url) {
                 if (match.indexOf('require(') !== -1) return match;

                 // replace: templateUrl = './path/to/template.html'
                 // with: templateUrl = require('./path/to/template.html')
                 return "templateUrl =" + replaceStringsWithRequires(url);
               });

  // Support for tests
  if (this.callback) {
    this.callback(null, newSource, sourcemap)
  } else {
    return newSource;
  }
};
