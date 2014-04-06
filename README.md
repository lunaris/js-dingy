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

## Externally-managed singleton instances

```javascript
var greeter = { sayHello: function() { console.log('Hello!'); } };

var builder = new Dingy.Builder();

builder.registerInstance('Greeter', greeter);
builder.registerClass('GreeterUser', GreeterUser);

var dingy = builder.inflate();

var greeterUser = dingy.resolve('GreeterUser');
greeterUser.useGreeter();
```

## Function-based factories

```javascript
var greeterFactory = function() {
  return {
    sayHello: function() { console.log('Hello!'); }
  };
};

var builder = new Dingy.Builder();

builder.registerFunction('Greeter', greeterFactory);
builder.registerClass('GreeterUser', GreeterUser);

var dingy = builder.inflate();

var greeterUser = dingy.resolve('GreeterUser');
greeterUser.useGreeter();
```

## Class-based factories

```javascript
var GreeterImpl = function() {
  this.sayHello = function() { console.log('Hello!'); };
};

var builder = new Dingy.Builder();

builder.registerClass('Greeter', GreeterImpl);
builder.registerClass('GreeterUser', GreeterUser);

var dingy = builder.inflate();

var greeterUser = dingy.resolve('GreeterUser');
greeterUser.useGreeter();
```

## Container-managed singleton instances

```javascript
var GreeterImpl = function() {
  this.sayHello = function() { console.log('Hello!'); };
};

var builder = new Dingy.Builder();

builder.registerClass('Greeter', GreeterImpl);
builder.registerClass('GreeterUser', GreeterUser).asSingleton();

var dingy = builder.inflate();

var firstGreeterUser = dingy.resolve('GreeterUser');
var secondGreeterUser = dingy.resolve('GreeterUser);

expect(firstGreeterUser).toBe(secondGreeterUser);
```
