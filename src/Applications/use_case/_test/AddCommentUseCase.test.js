const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const AddedComment = require('../../../Domains/comment/entities/AddedComments');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment on thread correctly', async () => {
    //arrange
    const requestPayload = {
      userId: 'user-123',
      content: 'ini komentar',
      threadId: 'thread-123'
    };
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: requestPayload.content,
      owner: requestPayload.userId,
    });
    const username = 'bobpants';

    const useCasePayload = {
      userId: requestPayload.userId,
      threadId: requestPayload.threadId,
      content: requestPayload.content,
      username,
    };

    //dependenciews
    const mockThereadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    //mock
    mockThereadRepository.checkThreadWithId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(username));
    mockCommentRepository.addComment = jest.fn()
      .mockResolvedValue({
        id: mockAddedComment.id,
        content: mockAddedComment.content,
      });

    //usecase instances
    const getAddedCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThereadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    //act
    const addedComment = await getAddedCommentUseCase.execute(requestPayload);

    //assert
    expect(addedComment).toStrictEqual(mockAddedComment);
    expect(mockUserRepository.getUsername).toHaveBeenCalledWith(requestPayload.userId);
    expect(mockThereadRepository.checkThreadWithId).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith({
      threadId: requestPayload.threadId,
      content: requestPayload.content,
      username,
    });
  });
});