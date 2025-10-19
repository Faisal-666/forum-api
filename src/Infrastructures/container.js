/* istanbul ignore file */
const { createContainer } = require('instances-container');

//external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const pool = require('./database/postgres/pool');
const Jwt = require('@hapi/jwt');
const config = require('../Commons/config');

//service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthRepositoryPostgres = require('./repository/AuthRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./token/JwtTokenManager');
const ThreadRepositoryPostgres = require('../Infrastructures/repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../Infrastructures/repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../Infrastructures/repository/ReplyRepositoryPostgres');
const LikesRepositoryPostgres = require('../Infrastructures/repository/LikeRepositoryPostgres');

//usecase
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const UserRepository = require('../Domains/users/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const AuthRepository = require('../Domains/auth/AuthRepository');
const Tokenize = require('../Applications/tokenize/Tokenize');
const UserLoginUseCase = require('../Applications/use_case/UserLoginUseCase');
const RefreshTokenUseCase = require('../Applications/use_case/RefreshTokenUseCase');
const UserLogoutUseCase = require('../Applications/use_case/UserLogoutUseCase');
const ThreadRepository = require('../Domains/thread/ThreadRepository');
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const CommentRepository = require('../Domains/comment/CommentRepository');
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase');
const DeleteCommentOnThreadUseCase = require('../Applications/use_case/DeleteCommentUseCase');
const GetDetailThreadUseCase = require('../Applications/use_case/GetDetailThreadUseCase');
const AddRepliesUseCase = require('../Applications/use_case/AddRepliesUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/DeleteReplyUseCase');
const ReplyRepository = require('../Domains/reply/ReplyRepository');
const LikeCommentUseCase = require('../Applications/use_case/LikeCommentUseCase');
const LikesRepository = require('../Domains/like/LikeRepository');

//creating container
const container = createContainer();

//registering services & repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: Tokenize.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt,
        },
        {
          concrete: config,
        },
      ],
    },
  },
  {
    key: AuthRepository.name,
    Class: AuthRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: LikesRepository.name,
    Class: LikesRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
]);

//registering usecase
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: UserLoginUseCase.name,
    Class: UserLoginUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authRepository',
          internal: AuthRepository.name,
        },
        {
          name: 'tokenize',
          internal: Tokenize.name,
        },
      ],
    },
  },
  {
    key: RefreshTokenUseCase.name,
    Class: RefreshTokenUseCase,
    parameter:  {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authRepository',
          internal: AuthRepository.name,
        },
        {
          name: 'tokenize',
          internal: Tokenize.name,
        },
      ],
    },
  },
  {
    key: UserLogoutUseCase.name,
    Class: UserLogoutUseCase,
    parameter:  {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authRepository',
          internal: AuthRepository.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter:  {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter:  {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
      ],
    },    
  },
  {
    key: DeleteCommentOnThreadUseCase.name,
    Class: DeleteCommentOnThreadUseCase,
    parameter:  {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
      ],
    },
  },
  {
    key: GetDetailThreadUseCase.name,
    Class: GetDetailThreadUseCase,
    parameter:  {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name,
        },
        {
          name: 'likeRepository',
          internal: LikesRepository.name,
        },
      ],
    },
  },
  {
    key: AddRepliesUseCase.name,
    Class: AddRepliesUseCase,
    parameter:  {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name,
        },
      ],
    },    
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter:  {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name,
        },
      ],
    },
  },
  {
    key: LikeCommentUseCase.name,
    Class: LikeCommentUseCase,
    parameter:  {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'likeRepository',
          internal: LikesRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
