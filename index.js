function curryN(n, fn, args) {
  args = args || [];

  return n - args.length === 0 ?
    fn.apply(null, args) :
    function () {
      var args2 = [].slice.call(arguments);

      return curryN(n, fn, args.concat(args2));
    }
};

var Functor = {
  map: curryN(2, function (fn, functor) {
    return functor.map(fn);
  })
};

var Monad = {
  chain: curryN(2, function (fn, monad) {
    return monad.chain(fn);
  })
};

var Maybe = {
  of: Just,
  flatten: flattenWrappers(Just),
  fromUndefinable: function (value) {
    return value === undefined ? Nothing() : Just(value);
  },
  toEither: curryN(2, function (def, maybe) {
    return maybe.toEither(def);
  })
};

function Nothing() {
  return {
    map: function (_) {
      return Nothing();
    },
    chain: function (_) {
      return Nothing();
    },
    ap: function (_) {
      return Nothing();
    },
    equals: function (other) {
      return other.isNothing;
    },
    withDefault: function (def) {
      return def;
    },
    maybe: curryN(2, function (def, _) {
      return def;
    }),
    fromJust: function () {
      throw Error('fromJust called on Nothing');
    },
    toMaybe: function () {
      return Nothing();
    },
    toEither: function (leftValue) {
      return Left(leftValue);
    },
    isJust: false,
    isNothing: true
  };
}

function Just(value) {
  return {
    map: function (fn) {
      return Just(fn(value));
    },
    chain: function (fn) {
      return fn(value);
    },
    ap: function (other) {
      return other.map(value);
    },
    equals: function (other) {
      return other.isJust &&
        ((value.equals && value.equals(other)) || value === other.fromJust());
    },
    withDefault: function (_) {
      return value;
    },
    maybe: curryN(2, function (_, fn) {
      return fn(value);
    }),
    fromJust: function () {
      return value;
    },
    toMaybe: function () {
      return Just(value);
    },
    toEither: function (_) {
      return Right(value);
    },
    isJust: true,
    isNothing: false
  };
}

var append = curryN(2, function (values, value) {
  return values.concat([value]);
});

function flattenWrappers(constructor) {
  return function (values) {
    return values
      .reduce(
        function (result, value) {
          return result.map(append).ap(value)
        },
        constructor([])
      );
  };
}

var Either = {
  of: Right,
  flatten: flattenWrappers(Right),
  toMaybe: function (value) {
    return value.toMaybe();
  }
};

function Left(value) {
  return {
    map: function (_) {
      return Left(value);
    },
    bimap: function (fn, _) {
      return new Left(fn(value));
    },
    chain: function (_) {
      return Left(value);
    },
    ap: function () {
      return Left(value);
    },
    equals: function (other) {
      return other.isLeft &&
        ((value.equals && value.equals(other)) || value === other.fromLeft());
    },
    either: curryN(2, function (left, _) {
      return left(value);
    }),
    fromRight: function () {
      throw Error('fromRight called on a Left');
    },
    fromLeft: function () {
      return value;
    },
    toEither: function () {
      return Left(value);
    },
    toMaybe: function () {
      return Nothing()
    },
    withDefault: function (def) {
      return def;
    },
    isLeft: true,
    isRight: false
  };
}

function Right(value) {
  return {
    map: function (fn) {
      return new Right(fn(value));
    },
    bimap: function (_, fn) {
      return new Right(fn(value));
    },
    chain: function (fn) {
      return fn(value);
    },
    ap: function (arg) {
      return arg.map(value);
    },
    equals: function (other) {
      return other.isRight &&
        ((value.equals && value.equals(other)) || value === other.fromRight());
    },
    either: curryN(2, function (_, right) {
      return right(value);
    }),
    fromRight: function () {
      return value;
    },
    fromLeft: function () {
      throw Error('fromLeft called on a Right');
    },
    toEither: function () {
      return Right(value);
    },
    toMaybe: function () {
      return Just(value);
    },
    withDefault: function (_) {
      return value;
    },
    isLeft: false,
    isRight: true
  };
}

var Tuple = curryN(2, function (fst, snd) {
  return {
    map: function (f) {
      return Tuple(fst, f(snd));
    },
    bimap: function (fstFn, sndFn) {
      return Tuple(fstFn(fst), sndFn(snd));
    },
    equals: function (other) {
      return other.isTuple &&
        ((fst.equals && fst.equals(other.fst)) || fst === other.fst) &&
        ((snd.equals && snd.equals(other.snd)) || snd === other.snd);
    },
    chain: function (fn) {
      return fn(snd).bimap(
        function (_) { return fst; },
        function (a) { return a; }
      );
    },
    fst: fst,
    snd: snd,
    isTuple: true
  };
});

if (module && module.exports) {
  module.exports = {
    Functor: Functor,
    Monad: Monad,

    Left: Left,
    Right: Right,
    Either: Either,

    Just: Just,
    Nothing: Nothing,
    Maybe: Maybe,

    Tuple: Tuple
  };
}
