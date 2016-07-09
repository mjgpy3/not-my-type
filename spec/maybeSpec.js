const T = require('../index.js'),
  Maybe = T.Maybe,
  Just = T.Just,
  Nothing = T.Nothing,
  R = require('ramda');

var subject;

function add5UnlessZero(value) {
  return value === 0 ?
    Nothing() :
    Just(value + 5);
}

describe('Maybe', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(R.equals);
  });

  describe('Just()', () => {
    beforeEach(() => {
      subject = Just(42);
    });

    it('equals itself', () => {
      expect(subject).toEqual(subject);
    });

    it('equals another Just around the same value', () => {
      expect(subject).toEqual(Just(42));
    });

    it('is a Just', () => {
      expect(subject.isJust).toBe(true);
    });

    it('is not a Nothing', () => {
      expect(subject.isNothing).toBe(false);
    });

    describe('.map()', () => {
      it('modifies the inner value', () => {
        expect(subject.map(a => a + 1)).toEqual(Just(43));
      });
    });

    describe('.ap()', () => {
      it('applies the wrapped function to a given value', () => {
        expect(Just(a => a + 1).ap(Just(42))).toEqual(Just(43));
      });
    });

    describe('.chain()', () => {
      it('modifies the inner value, bubbling the callback result', () => {
        expect(subject.chain(add5UnlessZero)).toEqual(Just(47));
      });
    });

    describe('.withDefault()', () => {
      it('returns the inner value', () => {
        expect(subject.withDefault({ any: 'thing' })).toBe(42);
      });
    });

    describe('.maybe()', () => {
      it('modifies the inner value with the passed function', () => {
        expect(subject.maybe({ any: 'thing' }, a => a + 1)).toBe(43);
      });

      it('can be partially applied', () => {
        expect(subject.maybe({ any: 'thing' })(a => a + 1)).toBe(43);
      });
    });

    describe('.fromJust()', () => {
      it('returns the inner value', () => {
        expect(subject.fromJust()).toBe(42);
      });
    });

    describe('.toMaybe()', () => {
      it('returns an equal value', () => {
        expect(subject.toMaybe()).toEqual(subject);
      });
    });

    describe('.toEither()', () => {
      it('returns a Right wrapping the inner value', () => {
        expect(subject.toEither({ any: 'thing' })).toEqual(T.Right(42));
      });
    });
  });

  describe('Nothing()', () => {
    beforeEach(() => {
      subject = Nothing();
    });

    it('equals itself', () => {
      expect(subject).toEqual(subject);
    });

    it('equals another Nothing', () => {
      expect(subject).toEqual(Nothing());
    });

    it('is a Nothing', () => {
      expect(subject.isNothing).toBe(true);
    });

    it('is not a Just', () => {
      expect(subject.isJust).toBe(false);
    });

    describe('.map()', () => {
      it('returns a Nothing', () => {
        expect(subject.map(a => a + 1)).toEqual(Nothing());
      });
    });

    describe('.ap()', () => {
      it('preserves the Nothing', () => {
        expect(Nothing().ap(Just(42))).toEqual(Nothing());
      });
    });

    describe('.chain()', () => {
      it('returns Nothing', () => {
        expect(subject.chain(add5UnlessZero)).toEqual(Nothing());
      });
    });

    describe('.withDefault()', () => {
      it('returns the passed default', () => {
        expect(subject.withDefault(35)).toBe(35);
      });
    });

    describe('.maybe()', () => {
      it('returns the given default', () => {
        expect(subject.maybe('default', (_) => _)).toBe('default');
      });

      it('can be partially applied', () => {
        expect(subject.maybe('default')((_) => _)).toBe('default');
      });
    });

    describe('.fromJust()', () => {
      it('throws an error', () => {
        expect(subject.fromJust).toThrow();
      });
    });

    describe('.toMaybe()', () => {
      it('returns an equal value', () => {
        expect(subject.toMaybe()).toEqual(subject);
      });
    });

    describe('.toEither()', () => {
      it('returns a Left wrapping the passed value', () => {
        expect(subject.toEither(35)).toEqual(T.Left(35));
      });
    });
  });

  describe('.of()', () => {
    it('returns a Just of the given value', () => {
      expect(Maybe.of(42)).toEqual(Just(42));
    });
  });

  describe('.fromUndefinable()', () => {
    describe('given undefined', () => {
      it('returns Nothing()', () => {
        expect(Maybe.fromUndefinable(undefined)).toEqual(Nothing());
      });
    });

    describe('given a falsey value that is not undefined', () => {
      it('returns Just that value', () => {
        expect(Maybe.fromUndefinable(false)).toEqual(Just(false));
      });
    });

    describe('given a truthy value', () => {
      it('returns Just that value', () => {
        expect(Maybe.fromUndefinable(42)).toEqual(Just(42));
      });
    });
  });

  describe('.flatten()', () => {
    describe('given an empty array', () => {
      it('returns a Just of an empty array', () => {
        expect(Maybe.flatten([]).fromJust().length).toBe(0);
      });
    });

    describe('given an array of Justs', () => {
      it('returns a Just of the values contained within each Just', () => {
        expect(Maybe.flatten([Just(1), Just(2), Just(3)]).fromJust())
          .toEqual([1, 2, 3]);
      });
    });

    describe('given an array of Justs and Nothings', () => {
      it('returns Nothing', () => {
        expect(Maybe.flatten([Just(1), Nothing(), Just(2), Just(3), Nothing()]))
          .toEqual(Nothing());
      });
    });
  });
});
