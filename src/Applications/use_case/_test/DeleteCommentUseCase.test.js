const CommentRepository = require('../../../Domains/comment/CommentRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const DeleteCommentOnThreadUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentOnThreadUseCase', () => {
  it('orchestrating DeleteCommentOnThreadUseCase correctly', async () => {
    //arrange
    const requestPayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const username = 'bobpants';


    //dependencies
    const mockThereadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    //mock
    mockUserRepository.getUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(username));
    mockThereadRepository.checkThreadWithId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    //use case instances
    const deleteCommentOnThreadUseCase = new DeleteCommentOnThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThereadRepository,
      commentRepository: mockCommentRepository,
    });

    //act & assert
    await expect(deleteCommentOnThreadUseCase.execute(requestPayload)).resolves.not.toThrow();
    expect(mockUserRepository.getUsername).toHaveBeenCalledWith(requestPayload.userId);
    expect(mockThereadRepository.checkThreadWithId).toHaveBeenCalledWith(requestPayload.threadId);
    expect(mockCommentRepository.verifyAccess).toHaveBeenCalledWith(username, requestPayload.commentId);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(requestPayload.commentId);
  });
});