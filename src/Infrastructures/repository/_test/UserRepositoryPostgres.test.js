const UserTableTestHelper = require('../../../../tests/UserTableTestHelper');
const InvariantError = require('../../../Commons/execptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../../Infrastructures/database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const TruncateTableHelper = require('../../../../tests/TruncateTable');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await TruncateTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvaliableUsername', () => {
    it('should throw error when username not available', async () => {
      //Arrange
      await UserTableTestHelper.addUser({ username: 'awikwok' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      //act & assert
      await expect(userRepositoryPostgres.verifyAvaliableUsername('awikwok')).rejects.toThrow(InvariantError);
    });

    it('should not throw error when username available', async () => {
      //Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      //act & assert
      await expect(userRepositoryPostgres.verifyAvaliableUsername('awikwok')).resolves.not.toThrow(InvariantError);
    });
  });

  describe('addUser funct', () => {
    it('should persist register user', async () => {
      //arrange
      const registerUser = new RegisterUser({
        username: 'awikwok',
        password: 'secret_password',
        fullname: 'awikawok awokwik',
      });
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      
      //act
      await userRepositoryPostgres.addUser(registerUser);

      //assert
      const user = await UserTableTestHelper.findUserById('user-123');
      expect(user).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      //arrange
      const registerUser = new RegisterUser({
        username: 'awikwok',
        password: 'secret_password',
        fullname: 'awikawok awokwik',
      });
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      
      //act
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      //assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'awikwok',
        fullname: 'awikawok awokwik',
      }));
    });
  });

  describe('getUsername with user id func', () => {
    it('should return usernamecorrectly', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'bobpants' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      
      //act
      const username = await userRepositoryPostgres.getUsername('user-123');

      //assert
      expect(username).toEqual('bobpants');
    });
  });
});