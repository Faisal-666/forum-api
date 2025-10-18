const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const commentRepository = new CommentRepository();

    //act & arrange
    await expect(commentRepository.addComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const commentRepository = new CommentRepository();

    //act & arrange
    await expect(commentRepository.checkCommentWithId({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const commentRepository = new CommentRepository();

    //act & arrange
    await expect(commentRepository.verifyAccess({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const commentRepository = new CommentRepository();

    //act & arrange
    await expect(commentRepository.deleteComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });


  it('should throw error when invoke abstract beahvior', async () => {
    //arrange
    const commentRepository = new CommentRepository();

    //act & arrange
    await expect(commentRepository.getCommentsByThreadId({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});