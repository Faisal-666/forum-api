const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const Thread = require('../../../Domains/thread/entities/thread');
const Comments = require('../../../Domains/comment/entities/Comments');
const Reply = require('../../../Domains/reply/entities/Reply');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrate GetDetailThreadUseCase correctly', async () => {
    //arrange
    const threadId = 'thread-123';
    const rawThread = {
      id: threadId,
      title: 'judul thread',
      body: 'isi thread',
      date: new Date('2021-08-08T07:22:33.555Z'),
      username: 'bobpants',
    };
    const rawComments = [
      {
        id: 'comment-001',
        content: 'komentar pertama',
        date: new Date('2021-08-08T07:22:33.555Z'),
        username: 'bobpants',
        is_deleted: false,
      },
      {
        id: 'comment-002',
        content: 'komentar kedua',
        date: new Date('2021-08-08T07:22:33.555Z'),
        username: 'spongeSquare',
        is_deleted: false,
      },
    ];

    //mock 
    const mockThread = new Thread({
      ...rawThread,
      date: rawThread.date.toISOString(),
    });
    const mockComments = rawComments.map((comment) => new Comments({
      ...comment,
      date: comment.date.toISOString(),
      replies: [],
    }));

    //dependencs 
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    //mock
    mockThreadRepository.checkThreadWithId = jest.fn().mockResolvedValue();
    mockThreadRepository.getDetailThread = jest.fn().mockResolvedValue(rawThread);
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(rawComments);
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockResolvedValue(undefined);

    //usecase instances
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    //act
    const result = await getDetailThreadUseCase.execute(threadId);

    //result
    expect(mockThreadRepository.checkThreadWithId).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getDetailThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(threadId);
    expect(result.thread).toStrictEqual(mockThread);
    expect(result.comments).toStrictEqual(mockComments);
  });

  it('should map replies to correct comments', async () => {
    //arragne
    const threadId = 'thread-123';
    const rawThread = {
      id: threadId,
      title: 'judul thread',
      body: 'isi thread',
      date: new Date('2021-08-08T07:22:33.555Z'),
      username: 'bobpants',
    };
    const rawComments = [
      {
        id: 'comment-001',
        content: 'komentar pertama',
        date: new Date('2021-08-08T07:22:33.555Z'),
        username: 'bobpants',
        is_deleted: false,
      },
    ];
    const rawReplies = [
      {
        id: 'reply-001',
        content: 'balasan pertama',
        date: new Date('2021-08-08T07:23:00.000Z'),
        username: 'patrick',
        comment_id: 'comment-001',
        is_deleted: false,
      },
      {
        id: 'reply-002',
        content: 'balasan kedua',
        date: new Date('2021-08-08T07:24:00.000Z'),
        username: 'bobpants',
        comment_id: 'comment-001',
        is_deleted: false,
      },
    ];

    // dependencies
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    //mock
    mockThreadRepository.checkThreadWithId = jest.fn().mockResolvedValue();
    mockThreadRepository.getDetailThread = jest.fn().mockResolvedValue(rawThread);
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(rawComments);
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockResolvedValue(rawReplies);

    //usecase instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    //act
    const result = await getDetailThreadUseCase.execute(threadId);

    //assert
    expect(mockThreadRepository.checkThreadWithId).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getDetailThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(threadId);
    expect(result.comments).toHaveLength(1);
    expect(result.comments[0].replies).toHaveLength(2);
    expect(result.comments[0].replies[0]).toBeInstanceOf(Reply);
    expect(result.comments[0].replies[0].id).toEqual('reply-001');
    expect(result.comments[0].replies[1].id).toEqual('reply-002');
  });
});
