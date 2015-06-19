describe('Routing', function () {
  var $state;
  var $stateParams;
  beforeEach(module('app'));

  beforeEach(inject(function($injector){
    $state = $injector.get('$state');
    $stateParams = $injector.get('$stateParams');
  }));

  it('Should have /signup route, view and controller', function () {
    var state = $state.get('signup');
    expect(state.url).to.be('/signup');
    expect(state.name).to.be('signup');
    expect(state.templateUrl).to.be('app/user/signup.html');
    expect(state.controller).to.be('userController');
  });


  it('Should have /login route, view and controller', function () {
    var state = $state.get('login');
    expect(state.url).to.be('/login');
    expect(state.name).to.be('login');
    expect(state.templateUrl).to.be('app/user/login.html');
    expect(state.controller).to.be('userController');
  });

});