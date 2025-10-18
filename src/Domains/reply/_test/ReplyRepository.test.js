const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const replyRepository = new ReplyRepository();

    //act & arrange
    await expect(replyRepository.addReply({})).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const replyRepository = new ReplyRepository();

    //act & arrange
    await expect(replyRepository.checkReplyWithId({})).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const replyRepository = new ReplyRepository();

    //act & arrange
    await expect(replyRepository.verifyAccess({})).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const replyRepository = new ReplyRepository();

    //act & arrange
    await expect(replyRepository.deleteReply({})).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const replyRepository = new ReplyRepository();

    //act & arrange
    await expect(replyRepository.getRepliesByThreadId({})).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
