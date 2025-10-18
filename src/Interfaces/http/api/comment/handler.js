const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentOnThreadUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommenthandler = this.postCommenthandler.bind(this);
    this.deleteCommenthandler = this.deleteCommenthandler.bind(this);
  }

  async postCommenthandler(req, h) {
    const { id: userId } = req.auth.credentials;
    const { threadId } = req.params;
    const { content } = req.payload;
    const useCasePayload = {
      userId,
      content,
      threadId,
    };
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
      data : { 
        addedComment,
      }
    }).code(201);
  }

  async deleteCommenthandler(req, h) {
    const { id: userId } = req.auth.credentials;
    const { threadId, commentId } = req.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentOnThreadUseCase.name);
    await deleteCommentUseCase.execute({ threadId, commentId, userId });

    return h.response({
      status: 'success',
      message: 'Berhasil menghapus komentar',
    }).code(200);
  }

}

module.exports = CommentsHandler;
