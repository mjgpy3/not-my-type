const T = require('../index.js'),
  Either = T.Either,
  Left = T.Left,
  Right = T.Right;

var subject;

function add5UnlessZero(value) {
  return value === 0 ?
    Left('Value cannot be zero') :
    Right(value + 5);
}

describe('Either', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester((a, b) => a.equals(b));
  });

  describe('Right()', () => {
    beforeEach(() => {
      subject = Right(42);
    });

    it('equals itself', () => {
      expect(subject).toEqual(subject);
    });

    it('equals another Right around the same value', () => {
      expect(subject).toEqual(Right(42));
    });

    it('is a Right', () => {
      expect(subject.isRight).toBe(true);
    });

    it('is not a Left', () => {
      expect(subject.isLeft).toBe(false);
    });

    describe('.either()', () => {
      it('returns the inner value modified by the right function', () => {
        expect(subject.either(() => _, a => a + 1)).toBe(43);
      });
    });

    describe('.map()', () => {
      it('modifies the inner value', () => {
        expect(subject.map(a => a + 1)).toEqual(Right(43));
      });
    });

    describe('.chain()', () => {
      it('modifies the inner value, bubbling the callback result', () => {
        expect(subject.chain(add5UnlessZero)).toEqual(Right(47));
      });
    });

    describe('.withDefault()', () => {
      it('returns the inner value', () => {
        expect(subject.withDefault({ any: 'thing' })).toBe(42);
      });
    });

    describe('.fromRight()', () => {
      it('returns the inner value', () => {
        expect(subject.fromRight()).toBe(42);
      });
    });

    describe('.fromLeft()', () => {
      it('throws an error', () => {
        expect(subject.fromLeft).toThrow();
      });
    });

    describe('.toMaybe()', () => {
      it('returns a Just wrapping the inner value', () => {
        expect(subject.toMaybe()).toEqual(T.Just(42));
      });
    });

    describe('.toEither()', () => {
      it('returns an equal value', () => {
        expect(subject.toEither({ any: 'thing' })).toEqual(subject);
      });
    });
  });

  describe('Left()', () => {
    beforeEach(() => {
      subject = Left(35);
    });

    it('equals itself', () => {
      expect(subject).toEqual(subject);
    });

    it('equals another Left wrapping the same value', () => {
      expect(subject).toEqual(Left(35));
    });

    it('is a Left', () => {
      expect(subject.isLeft).toBe(true);
    });

    it('is not a Right', () => {
      expect(subject.isRight).toBe(false);
    });

    describe('.either()', () => {
      it('returns the inner value modified by the left function', () => {
        expect(subject.either(a => a + 1, () => _)).toBe(36);
      });
    });

    describe('.map()', () => {
      it('does not modify the inner value', () => {
        expect(subject.map(a => a + 1)).toEqual(Left(35));
      });
    });

    describe('.chain()', () => {
      it('does not modify the inner value', () => {
        expect(subject.chain(add5UnlessZero)).toEqual(Left(35));
      });
    });

    describe('.withDefault()', () => {
      it('returns the passed default', () => {
        expect(subject.withDefault(35)).toBe(35);
      });
    });

    describe('.fromRight()', () => {
      it('throws an error', () => {
        expect(subject.fromRight).toThrow();
      });
    });

    describe('.fromLeft()', () => {
      it('returns the inner value', () => {
        expect(subject.fromLeft()).toBe(35);
      });
    });

    describe('.toMaybe()', () => {
      it('returns Nothing', () => {
        expect(subject.toMaybe()).toEqual(T.Nothing());
      });
    });

    describe('.toEither()', () => {
      it('returns an equal value', () => {
        expect(subject.toEither()).toEqual(subject);
      });
    });
  });

  describe('.of()', () => {
    it('returns a Right of the given value', () => {
      expect(Either.of(42)).toEqual(Right(42));
    });
  });
});
