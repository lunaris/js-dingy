var Dingy = function() {
  var self = this;

  var registrations = {};

  self.registerInstance = function(name, instance) {
    registrations[name] = instance;
  };

  self.registerFunction = function(name, f) {
    var registration = function() { return f.apply(null, arguments); };
    registration.dependencies = getDependencies(f);

    registrations[name] = registration;
  };

  self.registerClass = function(name, klass) {
    var registration = getConstructor(klass);
    registration.dependencies = getDependencies(klass);

    registrations[name] = registration;
  };

  var getConstructor = function(klass) {
    function Proxy(args) {
      return klass.apply(this, args);
    }

    Proxy.prototype = klass.prototype;

    return function(args) {
      return new Proxy(args);
    };
  };

  var getDependencies = function(f) {
    return getDependenciesFromArguments(f);
  };

  var getDependenciesFromArguments = (function() {
    var ARGUMENTS_PATTERN = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
        trim = function(s) { return s.trim(); };

    return function(f) {
      var functionDefinition = f.toString(),
          argsDefinition = functionDefinition.match(ARGUMENTS_PATTERN)[1],
          args = argsDefinition ? argsDefinition.split(',').map(trim) : [];

      return args;
    };
  })();

  self.resolve = function(name) {
    var registration = registrations[name];

    return typeof registration === 'function' ?
      registration(registration.dependencies.map(self.resolve)) :
      registration;
  };
};
