class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, comment_id, is_deleted } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.comment_id = comment_id;
    this.content = is_deleted
      ? '**balasan telah dihapus**'
      : content;
  }

  _verifyPayload({ id, content, date, username, is_deleted, comment_id }) {
    if (
      id === undefined ||
      content === undefined ||
      date === undefined ||
      username === undefined ||
      comment_id === undefined ||
      is_deleted === undefined
      
    ) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      typeof comment_id !== 'string' ||
      typeof is_deleted !== 'boolean'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;

