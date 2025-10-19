const Comment = require('../Comments');

describe('COment entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    //arrange
    const payload = {
      id: 'comment-123',
      content: 'bobpants',
    };

    //act & expect
    expect(() => new Comment(payload)).toThrow('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    //arrange
    const payload = {
      id: {},
      content: ['ini komen'],
      date: 9999,
      username: 123,
      is_deleted: 'false',
      likeCount: '5',
    };

    //act & expect
    expect(() => new Comment(payload)).toThrow('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when replies is not an array', () => {
    //arrange
    const payload = {
      id: 'comment-123',
      content: 'komentar aktif',
      date: '2022-10-14T08:00:00.000Z',
      username: 'bobpants',
      is_deleted: false,
      replies: 123,
      likeCount: 5,
    };

    //act & expect
    expect(() => new Comment(payload)).toThrow('COMMENT.REPLIES_NOT_ARRAY');
  });

  it('should create Comment object correctly when not deleted and replies is empty', () => {
    //arrange
    const payload = {
      id: 'comment-999',
      content: 'komentar aktif',
      date: '2022-10-14T08:00:00.000Z',
      username: 'bobpants',
      is_deleted: false,
      likeCount: 5,
    };

    //act
    const comment = new Comment(payload);

    //assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
    expect(comment.replies).toEqual([]);
    expect(comment.likeCount).toEqual(5);
  });

  it('should throw error when likeCount is not a number', () => {
    //arrange
    const payload = {
      id: 'comment-123',
      content: 'komentar aktif',
      date: '2022-10-14T08:00:00.000Z',
      username: 'bobpants',
      is_deleted: false,
      likeCount: ['2131'],
    };

    //act & assert
    expect(() => new Comment(payload)).toThrow('COMMENT.LIKECOUNT_NOT_NUMBER');
  });


  it('should mask content when commnent is deleted', () => {
    //arrange
    const payload = {
      id: 'comment-123',
      content: 'komentar yang dihapus',
      date: '2022-10-14T08:00:00.000Z',
      username: 'bobpants',
      is_deleted: true,
      likeCount: 5,
    };

    //act
    const comment = new Comment(payload);
    
    //assert
    expect(comment.content).toEqual('**komentar telah dihapus**');
  });

  it('should create replies correctly', () => {
    //arrange
    const payload = {
      id: 'comment-123',
      content: 'komentar aktif',
      date: '2022-10-14T08:00:00.000Z',
      username: 'bobpants',
      is_deleted: false,
      likeCount: 5,
      replies: [
        {
          id: 'reply-001',
          content: 'ini balsan',
          date: '2022-10-14T08:01:00.000Z',
          username: 'patrick',
          comment_id: 'comment-123',
          is_deleted: false,
        },
      ],
    };

    //act
    const comment = new Comment(payload);

    //assert
    expect(comment.replies).toHaveLength(1);
    expect(comment.replies[0].id).toEqual('reply-001');
    expect(comment.replies[0].content).toEqual('ini balsan');
  });

  it('should set likeCount to 0 by default if not provided', () => {
    //arrange
    const payload = {
      id: 'comment-001',
      content: 'komentar aktif',
      date: '2022-10-14T08:00:00.000Z',
      username: 'bobpants',
      is_deleted: false,
    };

    //act
    const comment = new Comment(payload);

    //assert
    expect(comment.likeCount).toEqual(0);
  });

});
