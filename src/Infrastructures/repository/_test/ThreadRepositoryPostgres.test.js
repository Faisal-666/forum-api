const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/execptions/NotFoundError');
const UserTableTestHelper = require('../../../../tests/UserTableTestHelper');
const TruncateTableHelper = require('../../../../tests/TruncateTable');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await TruncateTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread func', () => {
    it('should persist added thread and return id and title correctly', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id:'user-123', username:'bobpants' });
      const payload = {
        title: 'ini title',
        body: 'ini body',
        username: 'bobpants',
      };
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      //act
      const { id, title } = await threadRepositoryPostgres.addThread(payload);
      const thread = await ThreadTableTestHelper.findThread('thread-123');

      //assert
      expect(id).toEqual('thread-123');
      expect(title).toEqual(payload.title);
      expect(thread[0].title).toEqual(payload.title);
      expect(thread[0].body).toEqual(payload.body);
      expect(thread[0].username).toEqual(payload.username);
    });
  });

  describe('checkThreadWithId func', () => {
    it('should throw notfoundError when given invalid threadId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id:'user-123', username:'bobpants' });
      await ThreadTableTestHelper.addthread({ title: 'judul thread', body: 'ini isi thread', username: 'bobpants' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-000'; //default dari helper thread-123

      //act & assert
      await expect(threadRepositoryPostgres.checkThreadWithId(threadId)).rejects.toThrow(NotFoundError);
    });

    it('should not to throw notfoundError when given valid threadId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id:'user-123', username:'bobpants' });
      await ThreadTableTestHelper.addthread({ title: 'judul thread', body: 'ini isi thread', username: 'bobpants' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-123'; //default dari helper thread-123

      //act & assert
      await expect(threadRepositoryPostgres.checkThreadWithId(threadId)).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getDetailThread func', () => {
    it('should return detail data thread correctly when given valid threadId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id:'user-123', username:'bobpants' });
      await UserTableTestHelper.addUser({ id:'user-000', username:'spongeSquare' });
      await ThreadTableTestHelper.addthread({ title: 'judul thread', body: 'ini isi thread', username: 'bobpants' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-123'; //default dari helper thread-123

      //act
      const result = await threadRepositoryPostgres.getDetailThread(threadId);

      //assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.id).toEqual('thread-123');
      expect(result.title).toEqual('judul thread');
      expect(result.body).toEqual('ini isi thread');
      expect(typeof result.date).toEqual('object');
    });

  });
});

