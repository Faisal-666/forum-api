class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, is_deleted, replies = [], likeCount = 0 } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.likeCount = likeCount;

    this.content = is_deleted
      ? '**komentar telah dihapus**'
      : content;
  }

  _verifyPayload({ id, content, date, username, is_deleted, replies, likeCount }) {
    if (
      id === undefined ||
    content === undefined ||
    date === undefined ||
    username === undefined ||
    is_deleted === undefined
    ) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
    typeof content !== 'string' ||
    typeof date !== 'string' ||
    typeof username !== 'string' ||
    typeof is_deleted !== 'boolean'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (replies !== undefined && !Array.isArray(replies)) {
      throw new Error('COMMENT.REPLIES_NOT_ARRAY');
    }

    if (likeCount !== undefined && typeof likeCount !== 'number') {
      throw new Error('COMMENT.LIKECOUNT_NOT_NUMBER');
    }
  }
}

module.exports = Comment;
