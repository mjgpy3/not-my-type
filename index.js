function curryN(n, fn, args) {
  args = args || [];

  return n - args.length === 0 ?
    fn.apply(null, args) :
    function () {
      var args2 = [].slice.call(arguments);

      return curryN(n, fn, args.concat(args2));
    }
};

function Left(value) {
  this.map = function (_) {
    return new Left(value);
  };

  this.equals = function (other) {
    return other.isLeft && value == other.fromLeft();
  };

  this.either = function (left, _) {
    return left(value);
  };

  this.fromLeft = function () {
    return value;
  };

  this.fromRight = function () {
    throw 'fromRight called on a Left';
  };

  this.isLeft = true;
  this.isRight = false;
}

function Right(value) {
  this.map = function (fn) {
    return new Right(fn(value));
  };

  this.equals = function (other) {
    return other.isRight && value == other.fromRight();
  };

  this.either = function (_, right) {
    return right(value);
  };

  this.fromRight = function () {
    return value;
  };

  this.fromLeft = function () {
    throw 'fromLeft called on a Right';
  };

  this.isLeft = false;
  this.isRight = true;
}

module.exports = {
};
