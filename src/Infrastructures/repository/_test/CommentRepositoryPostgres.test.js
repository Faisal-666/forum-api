const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/execptions/NotFoundError');
const AuthorizationError = require('../../../Commons/execptions/AuthorizationError');
const UserTableTestHelper = require('../../../../tests/UserTableTestHelper');
const TruncateTableHelper = require('../../../../tests/TruncateTable');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await TruncateTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment func', () => {
    it('should persist comment and return id and content correctly', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ username: 'bobpants' });
      const payload = {
        threadId: 'thread-123',
        content: 'ini komentar',
        username: 'bobpants',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //act
      const { id, content } = await commentRepositoryPostgres.addComment(payload);
      const comment = await CommentsTableTestHelper.findComment('comment-123');

      //assert
      expect(id).toEqual('comment-123');
      expect(content).toEqual(payload.content);
      expect(comment).toBeDefined();
      expect(comment[0].id).toEqual('comment-123');
      expect(comment[0].username).toEqual(payload.username);
      expect(comment[0].content).toEqual(payload.content);
      expect(comment[0].thread_id).toEqual(payload.threadId);
    });
  });

  describe('checkCommentWithId func', () => {
    it('should throw notfoundError when given invalid commentId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ username: 'bobpants' });
      await CommentsTableTestHelper.addComment({ thread_id:'thread-123', username: 'bobpants' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      //act & assert
      await expect(commentRepositoryPostgres.checkCommentWithId('comment-00000')).rejects.toThrow(NotFoundError);
    });

    it('should not to throw notfoundError when given valid commentId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ username: 'bobpants' });
      await CommentsTableTestHelper.addComment({ thread_id:'thread-123', username: 'bobpants' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      //act & assert
      await expect(commentRepositoryPostgres.checkCommentWithId('comment-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyAccess func', () => {
    it('should throw AuthorizationError when given invalid username', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ username: 'bobpants' });
      await CommentsTableTestHelper.addComment({ thread_id:'thread-123', username: 'bobpants' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const username = 'spongeSquare';
      const commentId = 'comment-123';
      //act & assert
      await expect(commentRepositoryPostgres.verifyAccess(username, commentId)).rejects.toThrow(AuthorizationError);
    });

    it('should throw notFoundError when verifying invalid commentId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ username: 'bobpants' });
      await CommentsTableTestHelper.addComment({ thread_id:'thread-123', username: 'bobpants' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const username = 'spongeSquare';
      const commentId = 'comment';
      
      //act & assert
      await expect(commentRepositoryPostgres.verifyAccess(username, commentId)).rejects.toThrow(NotFoundError);
    });

    it('should not to throw AuthorizationError when given valid username and commentId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ username: 'bobpants' });
      await CommentsTableTestHelper.addComment({ thread_id:'thread-123', username: 'bobpants' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const username = 'bobpants';
      const commentId = 'comment-123';
      
      //act & assert
      await expect(commentRepositoryPostgres.verifyAccess(username, commentId)).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment func', () => {
    it('should softDelete comment corretcly', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ username: 'bobpants' });
      await CommentsTableTestHelper.addComment({ thread_id:'thread-123', username: 'bobpants' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      
      //act
      await commentRepositoryPostgres.deleteComment(commentId);
      const result = await CommentsTableTestHelper.findComment(commentId);

      //assert
      expect(result).toBeDefined();
      expect(result[0].is_deleted).toBe(true);
    });
  });

  describe('getCommentsByThreadId func', () => {
    it('should return comments object corretcly when given threadId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'bobpants' });
      await UserTableTestHelper.addUser({ id: 'user-000', username: 'spongeSquare' });
      await ThreadTableTestHelper.addthread({ username: 'bobpants' });
      await CommentsTableTestHelper.addComment({ thread_id:'thread-123', username: 'bobpants' });
      await CommentsTableTestHelper.addComment({ id: 'comment-111', thread_id:'thread-123', username: 'spongeSquare' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'thread-123';
      
      //act
      const result = await commentRepositoryPostgres.getCommentsByThreadId(commentId);

      //assert
      expect(result).toBeDefined();
      expect(typeof result).toEqual('object');
      expect(result[0].id).toEqual('comment-123');
      expect(result[1].id).toEqual('comment-111');
      expect(result[0].content).toEqual('test content');
      expect(result[0].content).toEqual('test content');
      expect(typeof result[0].date).toEqual('object');
      expect(typeof result[0].date).toEqual('object');
      expect(result[0].username).toEqual('bobpants');
      expect(result[1].username).toEqual('spongeSquare');
    });
  });
});