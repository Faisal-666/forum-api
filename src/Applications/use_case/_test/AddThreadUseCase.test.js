const AddThreadUseCase = require('../AddThreadUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const AddedThread = require('../../../Domains/thread/entities/addedThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread correctly', async () => {
    //arrange
    const requestPayload = {
      userId: 'user-123',
      title: 'ini title thread',
      body: 'ini body thread',
    };
    const username = 'bobpants';

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: requestPayload.title,
      owner: requestPayload.userId,
    });

    //dependencies
    const mockUserRepository = new UserRepository();
    const mockThereadRepository = new ThreadRepository();

    //mock
    mockUserRepository.getUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(username));
    mockThereadRepository.addThread = jest.fn()
      .mockResolvedValue({
        id: mockAddedThread.id,
        title: mockAddedThread.title,
      });
    
    //usecase instance
    const getAddedThreadUseCase = new AddThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThereadRepository,
    });

    //act
    const addedThread = await getAddedThreadUseCase.execute(requestPayload);

    //assert
    expect(addedThread).toStrictEqual(mockAddedThread);
    expect(mockUserRepository.getUsername).toHaveBeenCalledWith(requestPayload.userId);
    expect(mockThereadRepository.addThread).toHaveBeenCalledWith({
      title: requestPayload.title,
      body: requestPayload.body,
      username,
    });
  });
});