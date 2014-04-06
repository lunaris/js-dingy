(function(root, module) {
  if (typeof define === 'function' && define.amd) {
    define([], module);
  }
  else if (typeof exports === 'object') {
    module.exports = module();
  }
  else {
    root.Dingy = module();
  }
})(this, function() {
  var Dingy = function(registrations) {
    var self = this;

    self.resolve = function(name) {
      var registration = registrations[name];

      return typeof registration === 'function' ?
        registration(registration.dependencies.map(self.resolve)) :
        registration;
    };
  };

  Dingy.Builder = function() {
    var self = this,
        registrations = {};

    self.inflate = function() {
      return new Dingy(registrations);
    };

    self.registerInstance = function(name, instance) {
      registrations[name] = instance;
    };

    self.registerFunction = function(name, f) {
      var g = function(args) { return f.apply(null, args); };
      g.dependencies = getDependencies(f);

      registrations[name] = g;
      return new Dingy.Builder.Registration(registrations, name, g);
    };

    self.registerClass = function(name, klass) {
      var constructor = getConstructor(klass);
      constructor.dependencies = getDependencies(klass);

      registrations[name] = constructor;
      return new Dingy.Builder.Registration(
        registrations, name, constructor);
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
  };

  Dingy.Builder.Registration = function(registrations, name, implementation) {
    var self = this;

    self.asSingleton = function() {
      var memoizedImplementation = function(args) {
        return registrations[name] = implementation(args);
      };

      memoizedImplementation.dependencies =
        implementation.dependencies;

      registrations[name] = memoizedImplementation;
      return self;
    };
  };

  return Dingy;
});
