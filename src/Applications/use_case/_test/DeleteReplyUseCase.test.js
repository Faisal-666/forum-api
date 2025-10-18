const CommentRepository = require('../../../Domains/comment/CommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('orchestrating DeleteReplyUseCase correctly', async () => {
    //arrange
    const requestPayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };
    const username = 'bobpants';


    //dependencies
    const mockThereadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();
    const mockReplyRepository = new ReplyRepository();

    //mock
    mockUserRepository.getUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(username));
    mockThereadRepository.checkThreadWithId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentWithId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyWithId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    //use case instances
    const deleteCommentOnThreadUseCase = new DeleteReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThereadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    //act & assert
    await expect(deleteCommentOnThreadUseCase.execute(requestPayload)).resolves.not.toThrow();
    expect(mockUserRepository.getUsername).toHaveBeenCalledWith(requestPayload.userId);
    expect(mockThereadRepository.checkThreadWithId).toHaveBeenCalledWith(requestPayload.threadId);
    expect(mockCommentRepository.checkCommentWithId).toHaveBeenCalledWith(requestPayload.commentId);
    expect(mockReplyRepository.checkReplyWithId).toHaveBeenCalledWith(requestPayload.replyId);
    expect(mockReplyRepository.verifyAccess).toHaveBeenCalledWith(username, requestPayload.replyId);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(requestPayload.replyId);
  });
});