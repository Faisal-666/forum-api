const UserTableTestHelper = require('../../../../tests/UserTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthTableTestHelper');
const pool = require('../../../Infrastructures/database/postgres/pool');
const Credentials = require('../../../Domains/auth/entities/Credentials');
const BcryptPasswordHash = require('../../security/BcryptPasswordHash');
const bcrypt = require('bcrypt');
const InvariantError = require('../../../Commons/execptions/InvariantError');
const AuthRepositoryPostgres = require('../AuthRepositoryPostgres');
const AuthenticationError = require('../../../Commons/execptions/AuthenticationError');
const TruncateTableHelper = require('../../../../tests/TruncateTable');

describe('AuthRepository', () => {
  afterEach(async () => {
    await TruncateTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  const passwordHash = new BcryptPasswordHash(bcrypt);

  describe('verifyUserCredentials func', () => {
    it('should return invariant error when given invalid username', async () => {
    //arrange
      const credential = new Credentials({
        username: 'spongeSquare',
        password: 'teamSecret'
      });
      await UserTableTestHelper.addUser({ id: 'user-000', username: 'bobpants' });
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool, passwordHash);

      //act & assert
      await expect(authRepositoryPostgres.verifyUserCredentials(credential))
        .rejects.toThrow(InvariantError);
      
    });

    it('should return authError when given invalid password', async () => {
    //arrange
      const credential = new Credentials({
        username: 'spongeSquare',
        password: 'aaaaaaaa'
      });
      await UserTableTestHelper.addUser({ id: 'user-123', username: credential.username });
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool, passwordHash);

      //act & assert
      await expect(authRepositoryPostgres.verifyUserCredentials(credential))
        .rejects.toThrow(AuthenticationError);
    });

    it('should return id when given valid credentials', async () => {
    //arrange
      const credential = new Credentials({
        username: 'bobpants',
        password: 'teamSecret'
      });
      await UserTableTestHelper.addUser(credential);
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool, passwordHash);

      //act
      const result = await authRepositoryPostgres.verifyUserCredentials(credential);
      
      //assert
      expect(result).toEqual('user-123');
    });
  });

  describe('Add token func', () => {
    it('should add and persist token correctly', async () => {
      //arrange
      const token = 'token123.abcd098212.zxcvbbnm';
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool, {});
      
      //act
      await authRepositoryPostgres.addToken(token);
      const result = await AuthenticationsTableTestHelper.findToken(token);
   
      //assert
      expect(result).toEqual(token);
    });
  });

  describe('verify token func', () => {
    it('should return invariant error when given invalid token', async () => {
      //arrange
      const token = 'token123.abcd098212.zxcvbbnm';
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool, {});
      await AuthenticationsTableTestHelper.addToken(token);

      //act & assert
      await expect(authRepositoryPostgres.verifyToken('invalid_token')).rejects.toThrow(InvariantError);
    });

    it('should verify token correctly', async () => {
      //arrange
      const token = 'token123.abcd098212.zxcvbbnm';
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool, {});
      await AuthenticationsTableTestHelper.addToken(token);

      //act & assert
      await expect(authRepositoryPostgres.verifyToken(token)).resolves.not.toThrow();
    });
  });

  describe('delete token func', () => {
    it('should delete token correctly', async () => {
      //arrange
      const token = 'token123.abcd098212.zxcvbbnm';
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool, {});
      await AuthenticationsTableTestHelper.addToken(token);
      
      //act & assert
      await expect(authRepositoryPostgres.deleteToken(token)).resolves.not.toThrow();
      expect(AuthenticationsTableTestHelper.findToken(token)).resolves.not.toThrow();
    });
  });
});