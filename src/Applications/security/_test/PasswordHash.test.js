const PasswordHash = require('../PasswordHash');

describe('PasswordHash interface', () => {
  it('shoud throw error when invoke abstract behavior', async () => {
    //Arrange
    const passwordHash = new PasswordHash();

    //Act & assert
    expect(passwordHash.hash('dummy_password')).rejects.toThrow('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', async () => {
    //arrange
    const passwordHash = new PasswordHash();

    //act & assert
    expect(passwordHash.compare('$2JPw.UU0RC1OoRDQOgV/Rsv.Osbf9S.3TK')).rejects.toThrow('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});