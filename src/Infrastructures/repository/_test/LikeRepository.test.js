const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UserTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const pool = require('../../database/postgres/pool');
const TruncateTableHelper = require('../../../../tests/TruncateTable');
const LikesRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('Like repositori postgres', () => {
  afterEach(async () => {
    await TruncateTableHelper.cleanTable();
  });
  
  afterAll(async () => {
    await pool.end();
  });

  describe('like func', () => {
    it('should return state:"liked" when given payload', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-000', username: 'bobpants' });
      await ThreadTableTestHelper.addthread({ id:'thread-000', username:'bobpants' });
      await CommentsTableTestHelper.addComment({ thread_id: 'thread-000', username: 'bobpants' });
      const fakeIdGen = () => '123';
      const likeRepository = new LikesRepositoryPostgres(pool, fakeIdGen);
      const payload = {
        userId: 'user-000',
        commentId: 'comment-123',
        threadId: 'thread-000',
      };

      //act
      const result = await likeRepository.like(payload);
      const likeResult = await LikesTableTestHelper.countLikes(payload.threadId);

      //assert
      expect(result.state).toEqual('liked');
      expect(likeResult[0].like_count).toEqual('1');
    });
  });

  describe('dislike func', () => {
    it('should return state:"unliked" when given payload', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-000', username: 'bobpants' });
      await UserTableTestHelper.addUser({ id: 'user-001', username: 'patrick' });
      await ThreadTableTestHelper.addthread({ id:'thread-000', username:'bobpants' });
      await CommentsTableTestHelper.addComment({ thread_id: 'thread-000', username: 'bobpants' });
      await LikesTableTestHelper.addLike({ id:'like-123', threadId: 'thread-000', commentId:'comment-123', userId:'user-000' });
      await LikesTableTestHelper.addLike({ id:'like-223', threadId: 'thread-000', commentId:'comment-123', userId:'user-001' });
      const fakeIdGen = () => '123';
      const likeRepository = new LikesRepositoryPostgres(pool, fakeIdGen);
      const payload = {
        userId: 'user-000',
        commentId: 'comment-123',
      };

      //act
      const result = await likeRepository.dislike(payload);
      const likeResult = await LikesTableTestHelper.countLikes('thread-000');

      //assert
      expect(result.state).toEqual('unliked');
      expect(likeResult[0].like_count).toEqual('1');
    });
  });

  describe('getLikes func', () => {
    it('should return liked Count/comment when given threadId', async () => {
      //arrange
      await UserTableTestHelper.addUser({ id: 'user-000', username: 'bobpants' });
      await UserTableTestHelper.addUser({ id: 'user-001', username: 'patrick' });
      await ThreadTableTestHelper.addthread({ id:'thread-000', username:'bobpants' });
      await CommentsTableTestHelper.addComment({ thread_id: 'thread-000', username: 'bobpants' });
      await LikesTableTestHelper.addLike({ id:'like-123', threadId: 'thread-000', commentId:'comment-123', userId:'user-000' });
      await LikesTableTestHelper.addLike({ id:'like-223', threadId: 'thread-000', commentId:'comment-123', userId:'user-001' });
      const fakeIdGen = () => '123';
      const likeRepository = new LikesRepositoryPostgres(pool, fakeIdGen);

      //act
      const result = await likeRepository.getLikes('thread-000');

      //assert
      expect(result[0].like_count).toEqual('2');
    });
  });
});