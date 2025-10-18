const AddedComment = require('../../Domains/comment/entities/AddedComments');

class AddCommentUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository  = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { userId, content, threadId } = useCasePayload;
    await this._threadRepository.checkThreadWithId(threadId);
    const username = await this._userRepository.getUsername(userId);
    const payload = {
      threadId,
      content,
      username
    };
    const {id, content: addedContent } = await this._commentRepository.addComment(payload);

    return new AddedComment({
      id,
      content: addedContent,
      owner: userId,
    });
  }
}

module.exports = AddCommentUseCase;