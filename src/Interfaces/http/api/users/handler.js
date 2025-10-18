const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');

class UsersHandler {
  constructor(container) {
    this._container = container;

    this.postUserhandler = this.postUserhandler.bind(this);
  }

  async postUserhandler(req, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(req.payload);

    return h.response({
      status: 'success',
      data: {
        addedUser,
      },
    }).code(201);
  }
}

module.exports = UsersHandler;
