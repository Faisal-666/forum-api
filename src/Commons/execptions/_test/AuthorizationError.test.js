const AuthorizationError = require('../AuthorizationError');

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    //Arrange
    const authorizationError = new AuthorizationError('authorization error!');

    //act & assert
    expect(authorizationError.statusCode).toEqual(403);
    expect(authorizationError.message).toEqual('authorization error!');
    expect(authorizationError.name).toEqual('AuthorizationError');
  });
});