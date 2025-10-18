const AddRepliesUseCase = require('../../../../Applications/use_case/AddRepliesUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyhandler = this.postReplyhandler.bind(this);
    this.deleteReplyhandler = this.deleteReplyhandler.bind(this);
  }

  async postReplyhandler(req, h) {
    const { id: userId } = req.auth.credentials;
    const { threadId, commentId } = req.params;
    const { content } = req.payload;
    const useCasePayload = {
      userId,
      content,
      threadId,
      commentId,
    };
    const addReplyUseCase = this._container.getInstance(AddRepliesUseCase.name);
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
      data : { 
        addedReply,
      }
    }).code(201);
  }


  async deleteReplyhandler(req, h) {
    const { id: userId } = req.auth.credentials;
    const { threadId, commentId, replyId } = req.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteCommentUseCase.execute({ threadId, commentId, userId, replyId });

    return h.response({
      status: 'success',
      message: 'Berhasil menghapus komentar',
    }).code(200);
  }
}

module.exports = RepliesHandler;
