const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UserTableTestHelper');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/execptions/NotFoundError');
const AuthorizationError = require('../../../Commons/execptions/AuthorizationError');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const TruncateTableHelper = require('../../../../tests/TruncateTable');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await TruncateTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply func', () => {
    it('should persist reply and return id and content correctly', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants', body: 'ini Thread' });
      await CommentsTableTestHelper.addComment({thread_id: 'thread-000', content: 'ini komen', username: 'bobpants' });
      const payload = {
        commentId: 'comment-123', //helper default
        content: 'ini komentar',
        username: 'bobpants',
      };
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      //act
      const { id, content } = await replyRepositoryPostgres.addReply(payload);
      const reply = await ReplyTableTestHelper.findReply('reply-123');

      //assert
      expect(id).toEqual('reply-123');
      expect(content).toEqual(payload.content);
      expect(reply).toBeDefined();
      expect(reply[0].id).toEqual('reply-123');
      expect(reply[0].username).toEqual(payload.username);
      expect(reply[0].content).toEqual(payload.content);
      expect(reply[0].comment_id).toEqual(payload.commentId);
    });
  });

  describe('checkReplyWithId func', () => {
    it('should throw notfoundError when given invalid replyId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants', body: 'ini Thread' });
      await CommentsTableTestHelper.addComment({thread_id: 'thread-000', content: 'ini komen', username: 'bobpants' });
      await ReplyTableTestHelper.addReply({ comment_id: 'comment-123', username: 'bobpants', content: 'ini balasan' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      //act & assert
      await expect(replyRepositoryPostgres.checkReplyWithId('reply-00000')).rejects.toThrow(NotFoundError);
    });

    it('should not to throw notfoundError when given valid replyId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants', body: 'ini Thread' });
      await CommentsTableTestHelper.addComment({thread_id: 'thread-000', content: 'ini komen', username: 'bobpants' });
      await ReplyTableTestHelper.addReply({ comment_id: 'comment-123', username: 'bobpants', content: 'ini balasan' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      //act & assert
      await expect(replyRepositoryPostgres.checkReplyWithId('reply-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyAccess func', () => {
    it('should throw AuthorizationError when given invalid username', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants', body: 'ini Thread' });
      await CommentsTableTestHelper.addComment({thread_id: 'thread-000', content: 'ini komen', username: 'bobpants' });
      await ReplyTableTestHelper.addReply({ id:'reply-123' ,comment_id: 'comment-123', username: 'bobpants', content: 'ini balasan' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const username = 'spongeSquare';
      const replyId = 'reply-123';

      //act & assert
      await expect(replyRepositoryPostgres.verifyAccess(username, replyId)).rejects.toThrow(AuthorizationError);
    });

    it('should throw notFoundError when verifying invalid replyId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants', body: 'ini Thread' });
      await CommentsTableTestHelper.addComment({thread_id: 'thread-000', content: 'ini komen', username: 'bobpants' });
      await ReplyTableTestHelper.addReply({ id:'reply-123' ,comment_id: 'comment-123', username: 'bobpants', content: 'ini balasan' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const username = 'bobpants';
      const replyId = 'reply-69';
      
      //act & assert
      await expect(replyRepositoryPostgres.verifyAccess(username, replyId)).rejects.toThrow(NotFoundError);
    });

    it('should not to throw AuthorizationError when given valid username and commentId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants', body: 'ini Thread' });
      await CommentsTableTestHelper.addComment({thread_id: 'thread-000', content: 'ini komen', username: 'bobpants' });
      await ReplyTableTestHelper.addReply({ id:'reply-123' ,comment_id: 'comment-123', username: 'bobpants', content: 'ini balasan' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const username = 'bobpants';
      const replyId = 'reply-123';
      
      //act & assert
      await expect(replyRepositoryPostgres.verifyAccess(username, replyId)).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment func', () => {
    it('should softDelete comment corretcly', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants', body: 'ini Thread' });
      await CommentsTableTestHelper.addComment({thread_id: 'thread-000', content: 'ini komen', username: 'bobpants' });
      await ReplyTableTestHelper.addReply({ id:'reply-123' ,comment_id: 'comment-123', username: 'bobpants', content: 'ini balasan' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';
      
      //act
      await replyRepositoryPostgres.deleteReply(replyId);
      const result = await ReplyTableTestHelper.findReply(replyId);

      //assert
      expect(result).toBeDefined();
      expect(result[0].is_deleted).toBe(true);
    });
  });

  describe('getRepliesByThreadId func', () => {
    it('should return replies object corretcly when given threadId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants', body: 'ini Thread' });
      await CommentsTableTestHelper.addComment({thread_id: 'thread-000', content: 'ini komen', username: 'bobpants' });
      await ReplyTableTestHelper.addReply({ id:'reply-123', comment_id: 'comment-123', username: 'bobpants', content: 'ini balasan' });
      await ReplyTableTestHelper.addReply({ id:'reply-000', comment_id: 'comment-123', username: 'bobpants', content: 'ini balasan kedua' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const threadId = 'thread-000';
      
      //act
      const result = await replyRepositoryPostgres.getRepliesByThreadId(threadId);

      //assert
      expect(result).toBeDefined();
      expect(result[0].id).toEqual('reply-123');
      expect(result[1].id).toEqual('reply-000');
      expect(result[0].content).toEqual('ini balasan');
      expect(result[1].content).toEqual('ini balasan kedua');
      expect(typeof result[0].date).toEqual('object');
      expect(typeof result[1].date).toEqual('object');
      expect(result[0].username).toEqual('bobpants');
      expect(result[1].username).toEqual('bobpants');
      expect(result[0].is_deleted).toEqual(false);
      expect(result[1].is_deleted).toEqual(false);
    });
  });
});