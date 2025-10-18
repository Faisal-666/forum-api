const AuthRepository = require('../AuthRepository');

describe('AuthRepository interface', () => {
  it('should throw error when invoke abstract beahvior', async () =>{
    //arrange
    const authRepository = new AuthRepository();

    //act & assert
    await expect(authRepository.verifyUserCredentials({})).rejects.toThrow('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () =>{
    //arrange
    const authRepository = new AuthRepository();

    //act & assert
    await expect(authRepository.addToken({})).rejects.toThrow('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () =>{
    //arrange
    const authRepository = new AuthRepository();

    //act & assert
    await expect(authRepository.verifyToken({})).rejects.toThrow('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () =>{
    //arrange
    const authRepository = new AuthRepository();

    //act & assert
    await expect(authRepository.deleteToken({})).rejects.toThrow('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});