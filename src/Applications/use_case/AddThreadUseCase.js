const AddedThread = require('../../Domains/thread/entities/addedThread');

class AddThreadUseCase {
  constructor({ userRepository, threadRepository }) {
    this._userRepository  = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { userId, title, body, } = useCasePayload;
    const username = await this._userRepository.getUsername(userId);
    const payload = {
      title,
      body,
      username,
    };
    const { id, title: threadTitle } = await this._threadRepository.addThread(payload);

    return new AddedThread({
      id: id,
      title: threadTitle,
      owner: userId,
    });
  }

}

module.exports = AddThreadUseCase;