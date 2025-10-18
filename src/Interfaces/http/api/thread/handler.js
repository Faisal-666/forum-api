const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadhandler = this.postThreadhandler.bind(this);
    this.getDetailThreadhandler = this.getDetailThreadhandler.bind(this);
  }

  async postThreadhandler(req, h) {
    const { id: userId } = req.auth.credentials;
    const { title, body } = req.payload;
    const useCasePayload = {
      userId,
      title,
      body,
    };
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
      data : { 
        addedThread,
      }
    }).code(201);
  }

  async getDetailThreadhandler(req, h) {
    const { threadId } = req.params;
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const { thread, comments } = await getDetailThreadUseCase.execute(threadId);

    return h.response({
      status: 'success',
      data: {
        thread: {
          ...thread,
          comments
        },
      },
    }).code(200);
  }
}

module.exports = ThreadsHandler;
