function curryN(n, fn, args) {
  args = args || [];

  return n - args.length === 0 ?
    fn.apply(null, args) :
    function () {
      var args2 = [].slice.call(arguments);

      return curryN(n, fn, args.concat(args2));
    }
};

module.exports = {
};
