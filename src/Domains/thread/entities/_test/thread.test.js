const Thread = require('../thread');

describe('a thread entities', () => {
  it('should throw error when payload not cotain needed property', () => {
    //arrange
    const payload = {
      id: 'thread-123',
      title: 'bobpants',
    };

    //act & assert
    expect(() => new Thread(payload)).toThrow('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data spec', () => {
    //arrange
    const payload = {
      id: 123,
      title: {},
      body: ['bobpants'],
      date: 12092211,
      username: [{}],
    };

    //act & assert
    expect(() => new Thread(payload)).toThrow('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread correctly', () => {
    //arrange
    const payload = {
      id: 'thread-123',
      title: 'ini judul thread',
      body: 'ini isi thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'bobpants',
    };

    //act
    const thread = new Thread(payload);

    //assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
  });
});