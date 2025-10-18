const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const threadRepository = new ThreadRepository();

    //act & arrange
    await expect(threadRepository.addThread({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const threadRepository = new ThreadRepository();

    //act & arrange
    await expect(threadRepository.checkThreadWithId('thread-097')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const threadRepository = new ThreadRepository();

    //act & arrange
    await expect(threadRepository.getDetailThread('thread-097')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});