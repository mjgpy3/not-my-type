var T = require('../index.js'),
  Tuple = T.Tuple,
  R = require('ramda'),
  subject;

function add1(n) { return n + 1; } 
function add42(n) { return n + 42; } 

function add1ToRight(n) { return Tuple(99, n + 1); }

describe('Tuple', function () {
  beforeEach(function () {
    jasmine.addCustomEqualityTester(R.equals);
  });

  it('is curried', function () {
    expect(Tuple(1)(2)).toEqual(Tuple(1, 2));
  });

  describe('when constructed with two values', function () {
    beforeEach(function () {
      subject = Tuple(2, 3);
    });

    describe('.equals()', function () {
      describe('given different tuples wrapping the same values', function () {
        it('returns true', function () {
          expect(Tuple(1, 2).equals(Tuple(1, 2))).toBe(true);
        });
      });

      describe('given nested tuples wrapping the same values', function () {
        it('returns true', function () {
          expect(Tuple(Tuple(1, 3), 2).equals(Tuple(Tuple(1, 3), 2)))
            .toBe(true);
        });
      });

      describe('given different tuples wrapping different values', function () {
        it('returns false', function () {
          expect(Tuple(1, 2).equals(Tuple(7, 9))).toBe(false);
        });
      });
    });

    describe('.fst', function () {
      it('returns the value on the left from construction', function () {
        expect(subject.fst).toBe(2);
      });
    });

    describe('.snd', function () {
      it('returns the value on the right from construction', function () {
        expect(subject.snd).toBe(3);
      });
    });

    describe('.map()', function () {
      it('applies a function to the second value', function () {
        expect(subject.map(add1)).toEqual(Tuple(2, 4));
      });
    });

    describe('.bimap()', function () {
      it('modifies the left and right values with the left and right functions, respectively', function () {
        expect(subject.bimap(add42, add1)).toEqual(Tuple(44, 4));
      });
    });

    describe('.chain()', function () {
      it('modifies the right values with passed function returning the function\'s result', function () {
        expect(subject.chain(add1ToRight)).toEqual(Tuple(subject.fst, 4));
      });
    });
  });
});
