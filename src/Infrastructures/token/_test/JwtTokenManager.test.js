const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/execptions/InvariantError');


describe('JwtTokenManager', () => {
  const payload = {
    id: 'user-123',
  };
  const dummyConfig = {
    token: {
      acc_key: 'access-secret',
      ref_key: 'refresh-secret',
    },
  };
  describe('generate access token', () => {
    it('should generate access token correctly', () => {
      //arrange
      const spyGenerate = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt, dummyConfig);

      //act
      const accessToken = jwtTokenManager.generateAccessToken({ id: payload.id });

      //assert
      expect(typeof accessToken).toEqual('string');
      expect(accessToken).not.toEqual(payload.id);
      expect(spyGenerate).toHaveBeenCalledWith({ id: payload.id }, dummyConfig.token.acc_key);
    });
  });

  describe('generate refresh token', () => {
    it('should generate refresh token correctly', () => {
      //arrange
      const spyGenerate = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt, dummyConfig);

      //act
      const refreshToken = jwtTokenManager.generateRefreshToken({ id: payload.id });

      //assert
      expect(typeof refreshToken).toEqual('string');
      expect(refreshToken).not.toEqual(payload.id);
      expect(spyGenerate).toHaveBeenCalledWith({ id: payload.id }, dummyConfig.token.ref_key);
    });
  });

  describe('verify refresh token', () => {
    it('should throw invariant error when refresh token invalid', () => {
      //arrange
      const jwtTokenManager = new JwtTokenManager(Jwt, dummyConfig);

      //act & assert
      expect(() => {
        jwtTokenManager.verifyRefreshToken('invalid_token');
      }).toThrow(InvariantError);
    });
    it('should verify refresh token correctly', () => {
      //arrange
      const spyDecode = jest.spyOn(Jwt.token, 'decode');
      const spyVerify = jest.spyOn(Jwt.token, 'verifySignature');
      const jwtTokenManager = new JwtTokenManager(Jwt, dummyConfig);
      const refreshToken = jwtTokenManager.generateRefreshToken({ id: payload.id });

      //act
      const result = jwtTokenManager.verifyRefreshToken(refreshToken, dummyConfig.token.ref_key);

      //assert
      expect(result.id).toEqual(payload.id);
      expect(spyDecode).toHaveBeenCalledWith(refreshToken);
      expect(spyVerify).toHaveBeenCalled();
    });
  });
});
