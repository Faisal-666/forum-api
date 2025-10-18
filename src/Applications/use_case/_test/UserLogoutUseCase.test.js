const AuthRepository = require('../../../Domains/auth/AuthRepository');
const UserLogoutUseCase = require('../UserLogoutUseCase');

describe('User logout usecase', () => {
  it('should orchestrate usecase correctly', async () => {
    //arrange
    const payload = {
      refreshToken : 'dj1292hs.e209ei3e219ek22eq2esodawx.213e21',
    };

    //dependencies
    const mockAuthRepository = new AuthRepository();

    //mock
    mockAuthRepository.verifyToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve());


    //Usecase instances
    const deleteRefreshToken = new UserLogoutUseCase({
      authRepository: mockAuthRepository,
    });

    //act
    await deleteRefreshToken.execute(payload);

    //assert
    expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(payload.refreshToken);
    expect(mockAuthRepository.deleteToken).toHaveBeenCalledWith(payload.refreshToken);
  });
});