const AddRepliesUseCase = require('../AddRepliesUseCase');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const AddedReply = require('../../../Domains/reply/entities/AddedReply');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('AddRepliesUseCase', () => {
  it('should orchestrating the AddReplies correctly' , async () => {
    //arrange
    const requestPayload = {
      userId: 'user-123',
      content: 'ini balasan',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: requestPayload.content,
      owner: requestPayload.userId,
    });
    const username = 'bobpants';
    const useCasePayload = {
      commentId: requestPayload.commentId,
      content: requestPayload.content,
      username,
    };

    //dependenciews
    const mockThereadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();
    const mockReplyRepository = new ReplyRepository();

    //mock
    mockThereadRepository.checkThreadWithId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentWithId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(username));
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    //usecase instances
    const getAddRepliesUseCase = new AddRepliesUseCase({
      threadRepository: mockThereadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    //act
    const addedReply = await getAddRepliesUseCase.execute(requestPayload);

    //assert
    expect(mockThereadRepository.checkThreadWithId).toHaveBeenCalledWith(requestPayload.threadId);
    expect(mockCommentRepository.checkCommentWithId).toHaveBeenCalledWith(requestPayload.commentId);
    expect(mockUserRepository.getUsername).toHaveBeenCalledWith(requestPayload.userId)
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(useCasePayload);
    expect(addedReply).toStrictEqual(mockAddedReply);
  });
});