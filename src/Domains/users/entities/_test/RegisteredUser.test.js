const RegisteredUser = require('../RegisteredUser');

describe('a registeredUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    //Arrange
    const payload = {
      username: 'awikwok',
      password: 'awikwok awokwik',
    };

    //act & assert
    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    //Arrange
    const payload = {
      id: 123,
      username: 'awikwok',
      fullname: 'awikwok awokwik',
    };

    //act & assert
    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create registeredUser obj correctly', () => {
    //Arrange
    const payload = {
      id: 'user-123',
      username: 'awikwok',
      fullname: 'awikwok awokwik',
    };

    //act
    const registeredUser = new RegisteredUser(payload);

    //assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});