var T = require('../index.js'),
  R = require('ramda'),
  subject;

describe('Monad', function () {
  beforeEach(function () {
    jasmine.addCustomEqualityTester(R.equals);
  });

  describe('.chain()', function () {
    describe('given a function that returns a Maybe', function () {
      function fn(v) {
        return T.Just(v + 1);
      }

      beforeEach(function () {
        subject = T.Monad.chain(fn);
      });

      describe('given a Just', function () {
        it('applies the given function to the wrapped value, returning the function\'s result', function () {
          expect(subject(T.Just(41))).toEqual(T.Just(42));
        });
      });
      
      describe('given Nothing', function () {
        it('return Nothing', function () {
          expect(subject(T.Nothing())).toEqual(T.Nothing());
        });
      });
    });

    describe('given a function that returns an Either', function () {
      function fn(v) {
        return T.Right(v + 1);
      }

      beforeEach(function () {
        subject = T.Monad.chain(fn);
      });

      describe('given a Right', function () {
        it('applies the given function to the wrapped value, returning the function\'s result', function () {
          expect(subject(T.Right(41))).toEqual(T.Right(42));
        });
      });
      
      describe('given a Left', function () {
        it('return the Left, unmodified', function () {
          expect(subject(T.Left(99))).toEqual(T.Left(99));
        });
      });
    });

    describe('given a function that returns a Tuple', function () {
      function fn(v) {
        return T.Tuple(99, v + 1);
      }

      beforeEach(function () {
        subject = T.Monad.chain(fn);
      });

      describe('given a Tuple', function () {
        it('applies the given function to the second value, returning the function\'s result', function () {
          expect(subject(T.Tuple(1, 41))).toEqual(T.Tuple(1, 42));
        });
      });
    });
  });
});
