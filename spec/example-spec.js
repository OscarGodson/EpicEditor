// require your source here

describe('this is a group', function (){
  var foo;

  before(function (){
    foo = { bar: 123 };
  });

  it('fails', function (){
    expect(foo.baz).toNot(beFalsy);
  });

  it('passes', function (){
    expect(foo.bar).to(be, 123);
  });

  xit('is pending', function (){
    throw new Error('this doesnt fail');
  });
});
