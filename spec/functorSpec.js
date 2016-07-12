var T = require('../index.js'),
  R = require('ramda'),
  subject;

function add1(n) { return n + 1; }

describe('Functor', function () {
  beforeEach(function () {
    jasmine.addCustomEqualityTester(R.equals);
  });

  describe('.map()', function () {
    beforeEach(function () {
      subject = T.Functor.map
    });

    describe('given a function', function () {
      beforeEach(function () {
        subject = subject(add1);
      });

      describe('and a Just', function () {
        it('returns a new Just with the inner value modified by the given function', function () {
          expect(subject(T.Just(42))).toEqual(T.Just(43));
        });
      });

      describe('and Nothing', function () {
        it('returns Nothing', function () {
          expect(subject(T.Nothing())).toEqual(T.Nothing());
        });
      });

      describe('and a Right', function () {
        it('returns a new Right with the inner value modified by the given function', function () {
          expect(subject(T.Right(42))).toEqual(T.Right(43));
        });
      });

      describe('and a Left', function () {
        it('returns an equal left, unmodified', function () {
          expect(subject(T.Left(43))).toEqual(T.Left(43));
        });
      });

      describe('and a Tuple', function () {
        it('returns a new Tuple, with the second value modified by the given function', function () {
          expect(subject(T.Tuple(43, 41))).toEqual(T.Tuple(43, 42));
        });
      });

      describe('and an Array', function () {
        it('returns a new Array with the value modified by the given function', function () {
          expect(subject([1, 2, 3])).toEqual([2, 3, 4]);
        });
      });
    });
  });
});
