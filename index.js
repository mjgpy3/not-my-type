function curryN(n, fn, args) {
  args = args || [];

  return n - args.length === 0 ?
    fn.apply(null, args) :
    function () {
      var args2 = [].slice.call(arguments);

      return curryN(n, fn, args.concat(args2));
    }
};

var Maybe = {
  of: Just,
  flatten: flattenWrappers(Just),
  fromUndefinable: function (value) {
    return value === undefined ? Nothing() : Just(value);
  }
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
  flatten: flattenWrappers(Right)
};

function Left(value) {
  return {
    map: function (_) {
      return Left(value);
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

if (module && module.exports) {
  module.exports = {
    Left: Left,
    Right: Right,
    Either: Either,

    Just: Just,
    Nothing: Nothing,
    Maybe: Maybe
  };
}
