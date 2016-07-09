var T = require('../index.js'),
  Either = T.Either,
  Left = T.Left,
  Right = T.Right,
  R = require('ramda'),
  subject;

function add5UnlessZero(value) {
  return value === 0 ?
    Left('Value cannot be zero') :
    Right(value + 5);
}

function add1(n) { return n + 1; }

function anyFn() {
  throw Error('A function was called that should not have been');
}

describe('Either', function () {
  beforeEach(function () {
    jasmine.addCustomEqualityTester(R.equals);
  });

  describe('Right()', function () {
    beforeEach(function () {
      subject = Right(42);
    });

    it('equals itself', function () {
      expect(subject).toEqual(subject);
    });

    it('equals another Right around the same value', function () {
      expect(subject).toEqual(Right(42));
    });

    it('is a Right', function () {
      expect(subject.isRight).toBe(true);
    });

    it('is not a Left', function () {
      expect(subject.isLeft).toBe(false);
    });

    describe('.either()', function () {
      it('returns the inner value modified by the right function', function () {
        expect(subject.either(anyFn, add1)).toBe(43);
      });

      it('can be partially applied', function () {
        expect(subject.either(anyFn)(add1)).toBe(43);
      });
    });

    describe('.map()', function () {
      it('modifies the inner value', function () {
        expect(subject.map(add1)).toEqual(Right(43));
      });
    });

    describe('.ap()', function () {
      it('applies the wrapped function to a given value', function () {
        expect(Right(add1).ap(Right(42))).toEqual(Right(43));
      });
    });

    describe('.chain()', function () {
      it('modifies the inner value, bubbling the callback result', function () {
        expect(subject.chain(add5UnlessZero)).toEqual(Right(47));
      });
    });

    describe('.withDefault()', function () {
      it('returns the inner value', function () {
        expect(subject.withDefault({ any: 'thing' })).toBe(42);
      });
    });

    describe('.fromRight()', function () {
      it('returns the inner value', function () {
        expect(subject.fromRight()).toBe(42);
      });
    });

    describe('.fromLeft()', function () {
      it('throws an error', function () {
        expect(subject.fromLeft).toThrow();
      });
    });

    describe('.toMaybe()', function () {
      it('returns a Just wrapping the inner value', function () {
        expect(subject.toMaybe()).toEqual(T.Just(42));
      });
    });

    describe('.toEither()', function () {
      it('returns an equal value', function () {
        expect(subject.toEither({ any: 'thing' })).toEqual(subject);
      });
    });
  });

  describe('Left()', function () {
    beforeEach(function () {
      subject = Left(35);
    });

    it('equals itself', function () {
      expect(subject).toEqual(subject);
    });

    it('equals another Left wrapping the same value', function () {
      expect(subject).toEqual(Left(35));
    });

    it('is a Left', function () {
      expect(subject.isLeft).toBe(true);
    });

    it('is not a Right', function () {
      expect(subject.isRight).toBe(false);
    });

    describe('.either()', function () {
      it('returns the inner value modified by the left function', function () {
        expect(subject.either(add1, anyFn)).toBe(36);
      });

      it('can be partially applied', function () {
        expect(subject.either(add1)(anyFn)).toBe(36);
      });
    });

    describe('.map()', function () {
      it('does not modify the inner value', function () {
        expect(subject.map(add1)).toEqual(Left(35));
      });
    });

    describe('.ap()', function () {
      it('preserves the Left', function () {
        expect(Left(43).ap(Right(42))).toEqual(Left(43));
      });
    });

    describe('.chain()', function () {
      it('does not modify the inner value', function () {
        expect(subject.chain(add5UnlessZero)).toEqual(Left(35));
      });
    });

    describe('.withDefault()', function () {
      it('returns the passed default', function () {
        expect(subject.withDefault(35)).toBe(35);
      });
    });

    describe('.fromRight()', function () {
      it('throws an error', function () {
        expect(subject.fromRight).toThrow();
      });
    });

    describe('.fromLeft()', function () {
      it('returns the inner value', function () {
        expect(subject.fromLeft()).toBe(35);
      });
    });

    describe('.toMaybe()', function () {
      it('returns Nothing', function () {
        expect(subject.toMaybe()).toEqual(T.Nothing());
      });
    });

    describe('.toEither()', function () {
      it('returns an equal value', function () {
        expect(subject.toEither()).toEqual(subject);
      });
    });
  });

  describe('.of()', function () {
    it('returns a Right of the given value', function () {
      expect(Either.of(42)).toEqual(Right(42));
    });
  });

  describe('.flatten()', function () {
    describe('given an empty array', function () {
      it('returns a Right of an empty array', function () {
        expect(Either.flatten([]).fromRight().length).toBe(0);
      });
    });

    describe('given an array of Rights', function () {
      it('returns a Right of the values contained within each Right', function () {
        expect(Either.flatten([Right(1), Right(2), Right(3)]).fromRight())
          .toEqual([1, 2, 3]);
      });
    });

    describe('given an array of Rights and Lefts', function () {
      it('returns the first left', function () {
        expect(Either.flatten([Right(1), Left('first'), Right(2), Right(3), Left('second')]))
          .toEqual(Left('first'));
      });
    });
  });
});
