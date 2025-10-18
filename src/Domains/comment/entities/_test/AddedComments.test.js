const AddedComment = require('../AddedComments');

describe('a AddedComment entities', () => {
  it('should throw error when payload not cotain needed property', () => {
    //arrange
    const payload = {
      id: 'comment-123',
      owner: 'bobpants',
    };

    //act & assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meed data spec', () => {
    //arrange
    const payload = {
      id: 123,
      content: 'ini komen',
      owner: ['bobpants'],
    };

    //act & assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment obj correctly', () => {
    //arrange
    const payload = {
      id: 'comment-123',
      content: 'ini komen',
      owner: 'bobpants',
    };

    //act
    const addedComment = new AddedComment(payload);
     
    // assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});