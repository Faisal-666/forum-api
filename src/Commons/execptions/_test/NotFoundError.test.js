const NotFoundError = require('../NotFoundError');

describe('NotFoundError', () => {
  it('should create AuthenticationError correctly', () => {
    //Arrange
    const notFoundError = new NotFoundError('not found!');

    //act & assert
    expect(notFoundError.statusCode).toEqual(404);
    expect(notFoundError.message).toEqual('not found!');
    expect(notFoundError.name).toEqual('NotFoundError');
  });
});