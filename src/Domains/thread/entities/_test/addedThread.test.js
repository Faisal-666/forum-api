const AddedThread = require('../addedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload not cotain needed property', () => {
    //arrange
    const payload = {
      id: 'thread-123',
      owner: 'bobpants',
    };

    //act & assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meed data spec', () => {
    //arrange
    const payload = {
      id: 123,
      title: 'thread test',
      owner: ['bobpants'],
    };

    //act & assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread obj correctly', () => {
    //arrange
    const payload = {
      id: 'thread-123',
      title: 'thread test',
      owner: 'bobpants',
    };

    //act
    const addedThread = new AddedThread(payload);
     
    // assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});