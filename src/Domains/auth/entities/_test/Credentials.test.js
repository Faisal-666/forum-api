const Credentials = require('../Credentials');

describe('a userCredentials entities', () => {
  it('should create userCredtentials obj correctly', () => {
    //arrange
    const payload = {
      username: 'bobpants',
      password: 'leafErricson123',
    };

    //act
    const { username, password } = new Credentials(payload);

    //assert
    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
});