const RefreshTokenUseCase = require('../RefreshTokenUseCase');
const AuthRepository = require('../../../Domains/auth/AuthRepository');
const Tokenize = require('../../tokenize/Tokenize');

describe('Refresh token usecase', () => {
  it('Should orchestrate usecase correctly', async () => {
    //Arrange
    const id = 'user-123';
    const payload = {
      refreshToken : 'dj1292hs.e209ei3e219ek22eq2esodawx.213e21',
    };

    const mockAccessToken = {
      accessToken: 'xasi021.dj2913u129ue902u2901.93eusj'
    };
    const mockAuthRepository = new AuthRepository();
    const mockTokenize = new Tokenize();

    //mock
    mockTokenize.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve({ id }));
    mockAuthRepository.verifyToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTokenize.generateAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAccessToken));

    //usecase instance
    const refreshAccessToken = new RefreshTokenUseCase({
      authRepository: mockAuthRepository,
      tokenize: mockTokenize,
    });

    //act
    const accessToken = await refreshAccessToken.execute(payload);

    //assert
    expect(accessToken).toEqual({ accessToken: mockAccessToken });
    expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(payload.refreshToken);
    expect(mockTokenize.verifyRefreshToken).toHaveBeenCalledWith(payload.refreshToken);
    expect(mockTokenize.generateAccessToken).toHaveBeenCalledWith({ id });
  });
});