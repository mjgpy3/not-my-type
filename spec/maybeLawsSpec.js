var T = require('../index.js'),
  Maybe = T.Maybe,
  Just = T.Just,
  Nothing = T.Nothing,
  jsc = require('jsverify'),
  R = require('ramda');

describe('Maybe', function () {
  describe('functor laws', function () {
    jsc.property('obeys identity map', 'nat',
      function (a) {
        var m = arbMaybeFrom(a);

        return m.map(R.identity).equals(m);
      }
    );

    jsc.property('obeys composition', 'nat', 'nat -> string', 'string -> nat',
      function (a, f, g) {
        var m = arbMaybeFrom(a);

        return m.map(R.compose(g, f)).equals(m.map(f).map(g));
      }
    );
  });

  describe('applicative laws', function () {
    jsc.property('obeys identity', 'nat',
      function (x) {
        var v = arbMaybeFrom(x);

        return Maybe.of(R.identity).ap(v).equals(v);
      }
    );

    jsc.property('obeys homomorphism', 'nat', 'nat -> string',
      function (x, f) {
        return Maybe.of(f).ap(Maybe.of(x)).equals(Maybe.of(f(x)));
      }
    );

    jsc.property('obeys interchange', 'nat', 'nat -> string',
      function (y, f) {
        var u = arbMaybeFrom(f);

        return u.ap(Maybe.of(y)).equals(Maybe.of(function (f) { return f(y); }).ap(u));
      }
    );

    jsc.property('obeys composition', 'nat', 'nat -> string', 'string -> number',
      function (v, f1, f2) {
        var w = arbMaybeFrom(v),
          v = arbMaybeFrom(f1),
          u = arbMaybeFrom(f2);

        return Maybe.of(compose2).ap(u).ap(v).ap(w).equals(u.ap(v.ap(w)));
      }
    );
  });

  describe('monad laws', function () {
    jsc.property('obeys left identity', 'nat', 'nat -> nat',
      function (a, f) {
        var f = arbMaybeFnFrom(f)

        return Maybe.of(a).chain(f).equals(f(a));
      }
    );

    jsc.property('obeys right identity', 'nat',
      function (a) {
        var m = arbMaybeFrom(a);

        return m.chain(Maybe.of).equals(m);
      }
    );

    jsc.property('obeys associativity', 'nat', 'nat -> nat', 'nat -> nat',
      function (a, f1, f2) {
        var m = arbMaybeFrom(a),
          f = arbMaybeFnFrom(f1),
          g = arbMaybeFnFrom(f2);

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

function arbMaybeFrom(v) {
  return Math.random() < 0.25 ? Nothing() : Just(v);
}

function arbMaybeFnFrom(f) {
  var n = Math.random();

  return function (v) {
    if (n < 0.25) {
      return Nothing();
    }
    return Just(f(v));
  };
}
