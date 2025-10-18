const AuthenticationToken = require('../../../Domains/auth/entities/AuthenticationToken');
const AuthRepository = require('../../../Domains/auth/AuthRepository');
const Tokenize = require('../../tokenize/Tokenize');
const Credentials = require('../../../Domains/auth/entities/Credentials');
const UserLoginUseCase = require('../UserLoginUseCase');

describe('User login usecase', () => { 
  it('should orchestrate usecase correctly', async () => {
    //arrange
    const mockId = 'user-123';
    const credentials = new Credentials({
      username: 'bobpants',
      password: 'spongeSquare666'
    });
    const mockToken = new AuthenticationToken({
      accessToken: 'a12c3.c12xwads3i2122e.21312e',
      refreshToken: 'a1sad2c3.daw4431312.213121e',
    });

    //dependency
    const mockAuthRepository = new AuthRepository();
    const mockTokenize = new Tokenize();

    //mock
    mockAuthRepository.verifyUserCredentials = jest.fn()
      .mockImplementation(() => Promise.resolve(mockId));
    mockTokenize.generateAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockToken.accessToken));
    mockTokenize.generateRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockToken.refreshToken));
    mockAuthRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    //usecase instance
    const getTokenUseCase = new UserLoginUseCase({
      authRepository: mockAuthRepository,
      tokenize: mockTokenize,
    });

    //act
    const token = await getTokenUseCase.execute(credentials);
    
    //assert
    expect(token).toStrictEqual(new AuthenticationToken({
      accessToken: mockToken.accessToken,
      refreshToken: mockToken.refreshToken,
    }));
    expect(mockAuthRepository.verifyUserCredentials).toHaveBeenCalledWith(credentials);
    expect(mockAuthRepository.addToken).toHaveBeenCalledWith(mockToken.refreshToken);
  });
});