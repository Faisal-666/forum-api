const Reply = require('../Reply');

describe('Reply entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    const payload = {
      id: 'comment-123',
      content: 'bobpants',
    };

    expect(() => new Reply(payload)).toThrow('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      id: {},
      content: ['ini komen'],
      date: 9999,
      username: 123,
      comment_id: {},
      is_deleted: 'false',
    };

    expect(() => new Reply(payload)).toThrow('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply object correctly when not deleted', () => {
    const payload = {
      id: 'comment-999',
      content: 'balasan aktif',
      date: '2022-10-14T08:00:00.000Z',
      username: 'bobpants',
      comment_id: 'comment-123',
      is_deleted: false,
    };

    const comment = new Reply(payload);

    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
    expect(comment.comment_id).toEqual(payload.comment_id);
  });

  it('should mask content when reply is deleted', () => {
    const payload = {
      id: 'comment-999',
      content: 'balasan aktif',
      date: '2022-10-14T08:00:00.000Z',
      username: 'bobpants',
      comment_id: 'comment-123',
      is_deleted: true,
    };

    const comment = new Reply(payload);

    expect(comment.content).toEqual('**balasan telah dihapus**');
  });
});
