const Thread = require('../../Domains/thread/entities/thread');
const Comment = require('../../Domains/comment/entities/Comments');
const Reply = require('../../Domains/reply/entities/Reply');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkThreadWithId(threadId);
    
    const rawThread = await this._threadRepository.getDetailThread(threadId); 
    const rawComments = await this._commentRepository.getCommentsByThreadId(threadId);
    const rawReplies = await this._replyRepository.getRepliesByThreadId(threadId);
    const rawLikes = await this._likeRepository.getLikes(threadId);

    const thread = new Thread({
      ...rawThread,
      date: rawThread.date.toISOString(),
    });

    const groupedReplies = {};
    const temp = Array.isArray(rawReplies) ? rawReplies : [];
    temp.forEach((reply) => {
      const commentId = reply.comment_id;
      if (!groupedReplies[commentId]) {
        groupedReplies[commentId] = [];
      }
      groupedReplies[commentId].push(new Reply({
        ...reply,
        date: reply.date.toISOString(),
      }));
    });

    const likeMap = {};
    rawLikes.forEach(({ comment_id, like_count }) => {
      likeMap[comment_id] = Number(like_count);
    });

    const comments = rawComments.map((comment) => {
      return new Comment({
        ...comment,
        date: comment.date.toISOString(),
        replies: groupedReplies[comment.id] || [],
        likeCount: likeMap[comment.id] || 0,
      });
    });

    return { thread, comments };
  }
}

module.exports = GetDetailThreadUseCase;
