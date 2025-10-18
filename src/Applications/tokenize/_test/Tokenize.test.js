const Tokenize = require('../Tokenize');

describe('Tokenize interface', () => {
  //Arrange
  const tokenize = new Tokenize();

  it('shoud throw error when invoke abstract behavior', () => {
    //Act & assert
    expect(() => tokenize.generateAccessToken({ id: '123-user' })).toThrow('TOKENIZE.METHOD_NOT_IMPLEMENTED');
  });

  it('shoud throw error when invoke abstract behavior', () => {
    //Act & assert
    expect(() => tokenize.generateRefreshToken({ id: '123-user' })).toThrow('TOKENIZE.METHOD_NOT_IMPLEMENTED');
  });

  it('shoud throw error when invoke abstract behavior', () => {
    //Act & assert
    expect(() => tokenize.verifyRefreshToken({ id: '123-user' })).toThrow('TOKENIZE.METHOD_NOT_IMPLEMENTED');
  });

});