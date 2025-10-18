const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entities', () => {
  it('should create registerUser obj correctly', () => {
    //Arrange
    const payload = {
      username: 'awikwok',
      fullname: 'mulyono awokwik',
      password: 'awikwok123.',
    };

    //act
    const { username, fullname, password } = new RegisterUser(payload);

    //Assert
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});