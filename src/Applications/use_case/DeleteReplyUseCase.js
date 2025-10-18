class DeleteReplyUseCase {
  constructor({ userRepository, threadRepository, commentRepository, replyRepository }) {
    this._userRepository  = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload) {
    const { threadId, commentId, userId, replyId } = payload;
    const username = await this._userRepository.getUsername(userId);
    await this._threadRepository.checkThreadWithId(threadId);
    await this._commentRepository.checkCommentWithId(commentId);
    await this._replyRepository.checkReplyWithId(replyId);
    await this._replyRepository.verifyAccess(username, replyId);
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
