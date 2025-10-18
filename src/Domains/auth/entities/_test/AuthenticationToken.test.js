const AuthenticationToken = require('../AuthenticationToken');

describe('a authenticationToken entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    //arrange
    const payload = {
      refreshToken: 'dummytoken1234567891abcdefghijklmnopqrstuvwxyz',
    };

    //Act & assert
    expect(() => new AuthenticationToken(payload)).toThrow('AUTHENTICATION_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    //arrange
    const payload = {
      accessToken: 1234,
      refreshToken: ['123','sss'],
    };

    //Act & assert
    expect(() => new AuthenticationToken(payload)).toThrow('AUTHENTICATION_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create registeredUser obj correctly', () => {
    //arrange
    const payload = {
      accessToken: 'dummytoken1234567891abcdefghijklmnopqrstuvwxyz',
      refreshToken: 'dummytoken1234567891abcdefghijklmnopqrstuvwxyz',
    };

    //Act
    const authenticationToken = new AuthenticationToken(payload);

    //assert
    expect(authenticationToken.accessToken).toEqual(payload.accessToken);
    expect(authenticationToken.refreshToken).toEqual(payload.refreshToken);
  });
});