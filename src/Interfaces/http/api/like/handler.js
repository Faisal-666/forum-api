const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikeHandler {
  constructor(container) {
    this._container = container;

    this.putLikehandler = this.putLikehandler.bind(this);
  }

  async putLikehandler(req, h) {
    const { id: userId } = req.auth.credentials;
    const { threadId, commentId } = req.params;
    const useCasePayload = {
      userId,
      commentId,
      threadId,
    };
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    const data = await likeCommentUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
      data,
    }).code(200);
  }
}

module.exports = LikeHandler;
