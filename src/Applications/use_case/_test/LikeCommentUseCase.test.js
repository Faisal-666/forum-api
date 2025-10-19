const CommentRepository = require('../../../Domains/comment/CommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const LikesRepository = require('../../../Domains/like/LikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');
const NotFoundError = require('../../../Commons/execptions/NotFoundError');

describe('LikeCommentUseCase' , () => {
  it('should return state:liked if the user Havent given a like comment yet ', async () => {
    //arrange
    const payload = {
      userId: 'user-000',
      commentId: 'comment-123',
      threadId: 'thread-000',
    };
    
    //dependencies
    const mockThereadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikesRepository();

    //mock
    mockThereadRepository.checkThreadWithId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentWithId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.like = jest.fn()
      .mockResolvedValue({ state: 'liked' });
  
    //usecase instances
    const getLikeUseCase = new LikeCommentUseCase({
      threadRepository: mockThereadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    //act
    const data = await getLikeUseCase.execute(payload);

    //assert
    expect(data.state).toEqual('liked');
    expect(mockThereadRepository.checkThreadWithId).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.checkCommentWithId).toHaveBeenCalledWith(payload.commentId);
    expect(mockLikeRepository.like).toHaveBeenCalledWith(payload);
  });

  it('should return state:unliked if user already liked comment', async () => {
  //arrange
    const payload = {
      userId: 'user-000',
      commentId: 'comment-123',
      threadId: 'thread-000',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikesRepository();

    // mock
    mockThreadRepository.checkThreadWithId = jest.fn()
      .mockResolvedValue();
    mockCommentRepository.checkCommentWithId = jest.fn()
      .mockResolvedValue();
    mockLikeRepository.like = jest.fn()
      .mockImplementation(() => {
        const error = new Error('duplicate key constraint');
        error.code = '23505';
        throw error;
      });
    mockLikeRepository.dislike = jest.fn()
      .mockResolvedValue({ state: 'unliked' });

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // act
    const result = await likeCommentUseCase.execute(payload);

    // assert
    expect(result.state).toEqual('unliked');
    expect(mockThreadRepository.checkThreadWithId).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.checkCommentWithId).toHaveBeenCalledWith(payload.commentId);
    expect(mockLikeRepository.like).toHaveBeenCalledWith(payload);
    expect(mockLikeRepository.dislike).toHaveBeenCalledWith({ userId: payload.userId, commentId: payload.commentId});
  });

  it('should throw NotFoundError if thread is not found', async () => {
    //arrange
    const payload = {
      userId: 'user-000',
      commentId: 'comment-123',
      threadId: 'thread-xxx',
    };

    //dependencies
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikesRepository();

    //mock
    mockThreadRepository.checkThreadWithId = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('Thread tidak ditemukan')));
    mockCommentRepository.checkCommentWithId = jest.fn();
    mockLikeRepository.like = jest.fn();

    //usecase instances
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    //act & assert
    try {
      await likeCommentUseCase.execute(payload);
      throw new Error('Expected NotFoundError but none was thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
      expect(err.message).toBe('Thread tidak ditemukan');
    }
    expect(mockThreadRepository.checkThreadWithId).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.checkCommentWithId).not.toHaveBeenCalled();
    expect(mockLikeRepository.like).not.toHaveBeenCalled();
  });


});