# Dingy

Dingy is a simple dependency injection library for JavaScript.

# Examples

Let's assume an interface (here in TypeScript syntax):

```javascript
interface Greeter {
  function sayHello(): void;
}
```

and a class/function which depends on that interface:

```javascript
function GreeterUser(Greeter) {
  var _greeter = Greeter;

  this.useGreeter = function() { _greeter.sayHello(); };
}
```

We can use Dingy to wire these two pieces of code in several ways.

## Singleton instances

```javascript
var dingy = new Dingy();
var greeter = { sayHello: function() { console.log('Hello!'); } };

dingy.registerInstance('Greeter', greeter);
dingy.registerClass('GreeterUser', GreeterUser);

var greeterUser = dingy.resolve('GreeterUser');
greeterUser.useGreeter();
```

## Function-based factories

```javascript
var dingy = new Dingy();
var greeterFactory = function() {
  return {
    sayHello: function() { console.log('Hello!'); }
  };
};

dingy.registerFunction('Greeter', greeterFactory);
dingy.registerClass('GreeterUser', GreeterUser);

var greeterUser = dingy.resolve('GreeterUser');
greeterUser.useGreeter();
```

## Class-based factories

```javascript
var dingy = new Dingy();
var GreeterImpl = function() {
  this.sayHello = function() { console.log('Hello!'); };
};

dingy.registerClass('Greeter', GreeterImpl);
dingy.registerClass('GreeterUser', GreeterUser);

var greeterUser = dingy.resolve('GreeterUser');
greeterUser.useGreeter();
```
