const AddedReply = require('../../Domains/reply/entities/AddedReply');

class AddRepliesUseCase {
  constructor({ threadRepository, userRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository  = userRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { userId, content, threadId, commentId } = useCasePayload;
    await this._threadRepository.checkThreadWithId(threadId);
    await this._commentRepository.checkCommentWithId(commentId);
    const username = await this._userRepository.getUsername(userId);
    const payload = {
      commentId,
      content,
      username,
    };
    const { id, content: replyContent } = await this._replyRepository.addReply(payload);

    return new AddedReply({
      id,
      content: replyContent,
      owner: userId,
    });
  }
}

module.exports = AddRepliesUseCase;