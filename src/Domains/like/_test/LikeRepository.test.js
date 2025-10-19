const LikesRepository = require('../LikeRepository');

describe('LikesRepository interface', () => {
  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const likesRepository = new LikesRepository();

    //act & arrange
    await expect(likesRepository.like({})).rejects.toThrow('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const likesRepository = new LikesRepository();

    //act & arrange
    await expect(likesRepository.dislike({})).rejects.toThrow('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const likesRepository = new LikesRepository();

    //act & arrange
    await expect(likesRepository.getLikes({})).rejects.toThrow('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

});