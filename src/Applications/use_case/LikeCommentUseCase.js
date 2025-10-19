class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(payload) {
    const { userId, commentId, threadId } = payload;
    
    try {
      await this._threadRepository.checkThreadWithId(threadId);
      await this._commentRepository.checkCommentWithId(commentId);
      const data = await this._likeRepository.like(payload);

      return data;
    } catch (err) {
      if (err.code === '23505') {
        payload = { userId, commentId };
        const result = await this._likeRepository.dislike(payload);

        return result;
      }
      
      throw err;
    }
  }

}

module.exports = LikeCommentUseCase;
