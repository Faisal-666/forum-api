const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload not cotain needed property', () => {
    //arrange
    const payload = {
      id: 'reply-123',
      owner: 'bobpants',
    };

    //act & assert
    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meed data spec', () => {
    //arrange
    const payload = {
      id: 123,
      content: 'ini komen',
      owner: ['bobpants'],
    };

    //act & assert
    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply obj correctly', () => {
    //arrange
    const payload = {
      id: 'reply-123',
      content: 'ini balasan',
      owner: 'bobpants',
    };

    //act
    const addedComment = new AddedReply(payload);
     
    // assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});