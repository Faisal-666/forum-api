class DeleteCommentOnThreadUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository  = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const { threadId, commentId, userId } = payload;
    const username = await this._userRepository.getUsername(userId);
    await this._threadRepository.checkThreadWithId(threadId);
    await this._commentRepository.verifyAccess(username, commentId);
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentOnThreadUseCase;
