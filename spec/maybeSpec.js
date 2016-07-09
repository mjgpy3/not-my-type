var T = require('../index.js'),
  Maybe = T.Maybe,
  Just = T.Just,
  Nothing = T.Nothing,
  R = require('ramda'),
  subject;

function add5UnlessZero(value) {
  return value === 0 ?
    Nothing() :
    Just(value + 5);
}

describe('Maybe', function () {
  beforeEach(function () {
    jasmine.addCustomEqualityTester(R.equals);
  });

  describe('Just()', function () {
    beforeEach(function () {
      subject = Just(42);
    });

    it('equals itself', function () {
      expect(subject).toEqual(subject);
    });

    it('equals another Just around the same value', function () {
      expect(subject).toEqual(Just(42));
    });

    it('is a Just', function () {
      expect(subject.isJust).toBe(true);
    });

    it('is not a Nothing', function () {
      expect(subject.isNothing).toBe(false);
    });

    describe('.map()', function () {
      it('modifies the inner value', function () {
        expect(subject.map(function (a) { return a + 1; })).toEqual(Just(43));
      });
    });

    describe('.ap()', function () {
      it('applies the wrapped function to a given value', function () {
        expect(Just(function (a) { return a + 1; }).ap(Just(42))).toEqual(Just(43));
      });
    });

    describe('.chain()', function () {
      it('modifies the inner value, bubbling the callback result', function () {
        expect(subject.chain(add5UnlessZero)).toEqual(Just(47));
      });
    });

    describe('.withDefault()', function () {
      it('returns the inner value', function () {
        expect(subject.withDefault({ any: 'thing' })).toBe(42);
      });
    });

    describe('.maybe()', function () {
      it('modifies the inner value with the passed function', function () {
        expect(subject.maybe({ any: 'thing' }, function (a) { return a + 1; })).toBe(43);
      });

      it('can be partially applied', function () {
        expect(subject.maybe({ any: 'thing' })(function (a) { return a + 1; })).toBe(43);
      });
    });

    describe('.fromJust()', function () {
      it('returns the inner value', function () {
        expect(subject.fromJust()).toBe(42);
      });
    });

    describe('.toMaybe()', function () {
      it('returns an equal value', function () {
        expect(subject.toMaybe()).toEqual(subject);
      });
    });

    describe('.toEither()', function () {
      it('returns a Right wrapping the inner value', function () {
        expect(subject.toEither({ any: 'thing' })).toEqual(T.Right(42));
      });
    });
  });

  describe('Nothing()', function () {
    beforeEach(function () {
      subject = Nothing();
    });

    it('equals itself', function () {
      expect(subject).toEqual(subject);
    });

    it('equals another Nothing', function () {
      expect(subject).toEqual(Nothing());
    });

    it('is a Nothing', function () {
      expect(subject.isNothing).toBe(true);
    });

    it('is not a Just', function () {
      expect(subject.isJust).toBe(false);
    });

    describe('.map()', function () {
      it('returns a Nothing', function () {
        expect(subject.map(function (a) { return a + 1; })).toEqual(Nothing());
      });
    });

    describe('.ap()', function () {
      it('preserves the Nothing', function () {
        expect(Nothing().ap(Just(42))).toEqual(Nothing());
      });
    });

    describe('.chain()', function () {
      it('returns Nothing', function () {
        expect(subject.chain(add5UnlessZero)).toEqual(Nothing());
      });
    });

    describe('.withDefault()', function () {
      it('returns the passed default', function () {
        expect(subject.withDefault(35)).toBe(35);
      });
    });

    describe('.maybe()', function () {
      it('returns the given default', function () {
        expect(subject.maybe('default', function () {})).toBe('default');
      });

      it('can be partially applied', function () {
        expect(subject.maybe('default')(function () {})).toBe('default');
      });
    });

    describe('.fromJust()', function () {
      it('throws an error', function () {
        expect(subject.fromJust).toThrow();
      });
    });

    describe('.toMaybe()', function () {
      it('returns an equal value', function () {
        expect(subject.toMaybe()).toEqual(subject);
      });
    });

    describe('.toEither()', function () {
      it('returns a Left wrapping the passed value', function () {
        expect(subject.toEither(35)).toEqual(T.Left(35));
      });
    });
  });

  describe('.of()', function () {
    it('returns a Just of the given value', function () {
      expect(Maybe.of(42)).toEqual(Just(42));
    });
  });

  describe('.fromUndefinable()', function () {
    describe('given undefined', function () {
      it('returns Nothing()', function () {
        expect(Maybe.fromUndefinable(undefined)).toEqual(Nothing());
      });
    });

    describe('given a falsey value that is not undefined', function () {
      it('returns Just that value', function () {
        expect(Maybe.fromUndefinable(false)).toEqual(Just(false));
      });
    });

    describe('given a truthy value', function () {
      it('returns Just that value', function () {
        expect(Maybe.fromUndefinable(42)).toEqual(Just(42));
      });
    });
  });

  describe('.flatten()', function () {
    describe('given an empty array', function () {
      it('returns a Just of an empty array', function () {
        expect(Maybe.flatten([]).fromJust().length).toBe(0);
      });
    });

    describe('given an array of Justs', function () {
      it('returns a Just of the values contained within each Just', function () {
        expect(Maybe.flatten([Just(1), Just(2), Just(3)]).fromJust())
          .toEqual([1, 2, 3]);
      });
    });

    describe('given an array of Justs and Nothings', function () {
      it('returns Nothing', function () {
        expect(Maybe.flatten([Just(1), Nothing(), Just(2), Just(3), Nothing()]))
          .toEqual(Nothing());
      });
    });
  });
});
