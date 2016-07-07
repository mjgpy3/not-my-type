const T = require('../index.js'),
  Maybe = T.Maybe,
  Just = T.Just,
  Nothing = T.Nothing;

var subject;

describe('Maybe', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester((a, b) => a.equals(b));
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

    describe('.withDefault()', () => {
      it('returns the inner value', () => {
        expect(subject.withDefault({ any: 'thing' })).toBe(42);
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

    describe('.withDefault()', () => {
      it('returns the passed default', () => {
        expect(subject.withDefault(35)).toBe(35);
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
});
