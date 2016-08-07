var T = require('../index.js'),
  Either = T.Either,
  Left = T.Left,
  Right = T.Right,
  jsc = require('jsverify'),
  R = require('ramda');

describe('Either', function () {
  describe('functor laws', function () {
    jsc.property('obeys identity map', 'nat', 'string',
      function (a, b) {
        var m = arbEitherFrom(a, b);

        return m.map(R.identity).equals(m);
      }
    );

    jsc.property('obeys composition', 'nat', 'number', 'nat -> string', 'string -> nat',
      function (right, left, f, g) {
        var m = arbEitherFrom(left, right);

        return m.map(R.compose(g, f)).equals(m.map(f).map(g));
      }
    );
  });

  describe('applicative laws', function () {
    jsc.property('obeys identity', 'nat', 'string',
      function (x, y) {
        var v = arbEitherFrom(y, x);

        return Either.of(R.identity).ap(v).equals(v);
      }
    );

    jsc.property('obeys homomorphism', 'nat', 'nat -> string',
      function (x, f) {
        return Either.of(f).ap(Either.of(x)).equals(Either.of(f(x)));
      }
    );

    jsc.property('obeys interchange', 'nat', 'string', 'nat -> string',
      function (y, str, f) {
        var u = arbEitherFrom(str, f);

        return u.ap(Either.of(y)).equals(Either.of(function (f) { return f(y); }).ap(u));
      }
    );

    jsc.property('obeys composition', 'nat', 'string', 'string', 'string', 'nat -> string', 'string -> number',
      function (v, a, b, c, f1, f2) {
        var w = arbEitherFrom(a, v),
          v = arbEitherFrom(b, f1),
          u = arbEitherFrom(c, f2);

        return Either.of(compose2).ap(u).ap(v).ap(w).equals(u.ap(v.ap(w)));
      }
    );
  });

  describe('monad laws', function () {
    jsc.property('obeys left identity', 'nat', 'string', 'nat -> nat',
      function (a, b, f) {
        var f = arbEitherFnFrom(b, f)

        return Either.of(a).chain(f).equals(f(a));
      }
    );

    jsc.property('obeys right identity', 'nat', 'string',
      function (a, b) {
        var m = arbEitherFrom(b, a);

        return m.chain(Either.of).equals(m);
      }
    );

    jsc.property('obeys associativity', 'nat', 'string', 'string', 'string', 'nat -> nat', 'nat -> nat',
      function (a, l1, l2, l3, f1, f2) {
        var m = arbEitherFrom(l1, a),
          f = arbEitherFnFrom(l2, f1),
          g = arbEitherFnFrom(l3, f2);

        return m.chain(f).chain(g).equals(m.chain(function (x) { return f(x).chain(g); }));
      }
    );
  });
});

function compose2(f1) {
  return function(f2) {
    return function(x) {
      return f1(f2(x));
    }
  }
}

function arbEitherFrom(a, b) {
  return Math.random() < 0.5 ? Left(a) : Right(b);
}

function arbEitherFnFrom(leftValue, f) {
  var n = Math.random();

  return function (v) {
    if (n < 0.5) {
      return Left(leftValue);
    }
    return Right(f(v));
  };
}
