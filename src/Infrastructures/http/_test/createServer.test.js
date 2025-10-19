const UserTableTestHelper = require('../../../../tests/UserTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const Jwt = require('@hapi/jwt');
const config = require('../../../Commons/config');
const JwtTokenManager = require('../../token/JwtTokenManager');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthTableTestHelper');
const AddedThread = require('../../../Domains/thread/entities/addedThread');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const TruncateTableHelper = require('../../../../tests/TruncateTable');

describe('http server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await TruncateTableHelper.cleanTable();
  });

  describe('when GET / endpoint',  () => {
    it('should should return 200 and hello world', async () => {
    //arrange
      const server = await createServer({});

      //act
      const response = await server.inject({
        method: 'GET',
        url: '/',
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.value).toEqual('Hello world!');
    });
  });

  describe('JWT auth', () => {
    it('should return 200 adn validate token corectly for authentication', async () => {
      //arrange
      const server = await createServer({});
      const token = Jwt.token.generate(
        {
          id: 'user-123',
        },
        {
          key: config.token.acc_key,
        },);
  
      server.route({
        method: 'GET',
        path: '/dummy',
        options: {
          auth: 'jwt_auth',
          handler: () => 'ok',
        },
      });

      //act
      const response = await server.inject({
        method: 'GET',
        url: '/dummy',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      //assert
      expect(response.statusCode).toBe(200);
    });
  });

  it('should response 404 when request unrigestered route', async () => {
    //arrange
    const server = await createServer({});

    //act
    const response = await server.inject({
      method: 'GET',
      url: '/unregRoute',
    });

    //assert
    expect(response.statusCode).toEqual(404);
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      //arrange
      const requestPayload = {
        username: 'awikwok',
        password: 'secret',
        fullname: 'let me in',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should response 400 when req payload not contain needed property', async () => {
      //arrange
      const requestPayload = {
        fullname: 'bobpants spongesquare',
        password: 'secret',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when req payload not meet data type spec', async () => {
      //arrange
      const requestPayload = {
        username: 'bobpants',
        password: 'secret',
        fullname: ['bobpantsSpongesquare'],
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      //arrange
      const requestPayload = {
        username: 'bobpantsSpongesquarebobpantsSpongesquarebobpantsSpongesquarebobpantsSpongesquarebobpantsSpongesquare',
        password: 'secret',
        fullname: 'bobpantsSpongesquare',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    it('should response 400 when username contained restricted char', async () => {
      //arrange
      const requestPayload = {
        username: 'Bobpants Spongesquare',
        password: 'secret',
        fullname: 'bobpantsSpongesquare',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    it('should response 400 when username unavailable', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'Bobpants' });
      const requestPayload = {
        username: 'Bobpants',
        password: 'secret',
        fullname: 'Bobpants Spongesquare',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak tersedia');
    });
  });

  it('should handle server correctly', async () => {
    //arrange
    await UserTableTestHelper.addUser({ username: 'Bobpants' });
    const requestPayload = {
      username: 'Bobpants',
      password: 'secret',
      fullname: 'Bobpants Spongesquare',
    };
    const server = await createServer({});

    //act
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    //assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  describe('/Auth endpoint', () => {
    it('should response 400 when POST empty username', async () => {
      //arrange
      const requestPayload = {
        username: '',
        password: 'secret',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Username tidak boleh kosong');
    });

    it('should response 400 when POST empty username', async () => {
      //arrange
      const requestPayload = {
        username: 'bobpants',
        password: '',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Password tidak boleh kosong');
    });

    it('should response 400 when POST invalid username', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'Bobpants' });
      const requestPayload = {
        username: 'xxx',
        password: 'secret',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Username salah');
    });

    it('should response 401 when POST invalid password', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'Bobpants' });
      const requestPayload = {
        username: 'Bobpants',
        password: 'xxx',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Password salah');
    });

    it('should response 201, and return accessToken & refreshToken', async () => {
      //arrange
      await UserTableTestHelper.addUser({ username: 'Bobpants' });
      const requestPayload = {
        username: 'Bobpants',
        password: 'teamSecret',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it('should response 200 when PUT valid refreshToken and return accessToken', async () => {
      //arrange
      const jwtTokenManager = new JwtTokenManager(Jwt, config);
      const refreshToken = jwtTokenManager.generateRefreshToken({ id: 'user-123' });
      await AuthenticationsTableTestHelper.addToken(refreshToken);
      const requestPayload = {
        refreshToken,
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it('should response 400 when PUT invalid refreshToken', async () => {
      //arrange
      const jwtTokenManager = new JwtTokenManager(Jwt, config);
      const refreshToken = jwtTokenManager.generateRefreshToken({ id: 'user-123' });
      await AuthenticationsTableTestHelper.addToken(refreshToken);
      const requestPayload = {
        refreshToken: 'invalid_token',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when PUT with empty req.payload ', async () => {
      //arrange
      const requestPayload = {
        refreshToken: ' ',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token kosong');
    });

    it('should response 200 when DELETE valid refreshToken', async () => {
      //arrange
      const jwtTokenManager = new JwtTokenManager(Jwt, config);
      const refreshToken = jwtTokenManager.generateRefreshToken({ id: 'user-123' });
      await AuthenticationsTableTestHelper.addToken(refreshToken);
      const requestPayload = {
        refreshToken,
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 when DELETE invalid refreshToken', async () => {
      //arrange
      const jwtTokenManager = new JwtTokenManager(Jwt, config);
      const refreshToken = jwtTokenManager.generateRefreshToken({ id: 'user-123' });
      const invalidToken = jwtTokenManager.generateRefreshToken({ id: 'user-666' });
      await AuthenticationsTableTestHelper.addToken(refreshToken);
      const requestPayload = {
        refreshToken: invalidToken,
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 when DELETE with empty req.payload ', async () => {
      //arrange
      const requestPayload = {
        refreshToken: ' ',
      };
      const server = await createServer(container);

      //act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token kosong');
    });
  });

  describe('/threads endpoint', () => {
    it('should return 401 when authentication missing', async () => {
      //arrange
      const server = await createServer({});
      
      //act
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'ini title',
          body: 'ini body',
        },
      });

      //assert
      expect(response.statusCode).toBe(401);
    });

    it('should return 400 when given bad payload', async () => {
      //arrange
      const server = await createServer({});
      const token = Jwt.token.generate(
        {
          id: 'user-123',
        },
        {
          key: config.token.acc_key,
        },);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          title: 123,
          body: true,
        },
      });

      //assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(responseJson.status).toBe('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should return 201 when addedThread', async () => {
      //arrange
      const server = await createServer({
        getInstance: () => ({
          execute: jest.fn().mockResolvedValue( new AddedThread({
            id: 'thread-123',
            title: 'judul thread',
            owner: 'user-123',
          })),
        }),
      });

      const token = Jwt.token.generate(
        {
          id: 'user-123',
        },
        {
          key: config.token.acc_key,
        },);

      //act
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        payload: {
          title: 'judul thread',
          body: 'isi thread',
        },
      });

      //assert
      expect(response.statusCode).toBe(201);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    describe('POST /threads/{threadId}/comments endpoint', () => {
      it('should return 400 when given bad payload', async () => {
        //arrange
        const server = await createServer({});
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);

        //act
        const response = await server.inject({
          method: 'POST',
          url: '/threads/threadd-1231/comments',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          payload: {
            content: 124,
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(400);
        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBeDefined();
      });

      it('should return 404 when given invalid threadId', async () => {
        //arrange
        await UserTableTestHelper.addUser({ username: 'bobpants'});
        await ThreadTableTestHelper.addthread({ title: 'ini judul thread', body:'ini isi thread' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);

        //act
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-000/comments', //thread-123 default dari helper, inject 000 buat invalid Thread
          headers: {
            Authorization: `Bearer ${token}`,
          },
          payload: {
            content: 'ini komentar',
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(404);
        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBeDefined();
      });

      it('should return 201 and return addedComment', async () => {
        //arrange
        await UserTableTestHelper.addUser({ username:'bobpants' });
        await ThreadTableTestHelper.addthread({ title: 'ini judul thread', body:'ini isi thread', username: 'bobpants' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);

        //act
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-123/comments', //default dari helper thread-123
          headers: {
            Authorization: `Bearer ${token}`,
          },
          payload: {
            content: 'ini komentar',
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(201);
        expect(responseJson.status).toBe('success');
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data.addedComment.content).toEqual('ini komentar');
        expect(responseJson.data.addedComment.owner).toEqual('user-123');
      });
    });

    describe('DELETE /threads/{threadId}/comments/{commentId} endpoint', () => {
      it('should response 403 when unauthorized user trying to delete comment', async () => {
        //arrange
        await UserTableTestHelper.addUser({ username:'bobpants' });
        await UserTableTestHelper.addUser({ id: 'user-000' ,username:'spongeSquare' });
        await ThreadTableTestHelper.addthread({ title: 'ini judul thread', body:'ini isi thread' });
        await CommentsTableTestHelper.addComment({ username:'bobpants' });
        const server = await createServer(container);
        const tokenReferensi = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);
        await AuthenticationsTableTestHelper.addToken(tokenReferensi);
        const token = Jwt.token.generate(
          {
            id: 'user-000',
          },
          {
            key: config.token.acc_key,
          },);
        await AuthenticationsTableTestHelper.addToken(token);
        //act
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123', //default dari helper thread-123 & comment-123
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(403);
        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBeDefined();
      });

      it('should response 404 when givem invalid thread/commend id', async () => {
        //arrange
        await UserTableTestHelper.addUser({ username:'bobpants' });
        await ThreadTableTestHelper.addthread({ title: 'ini judul thread', body:'ini isi thread' });
        await CommentsTableTestHelper.addComment({ username:'bobpants' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);
        //act
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-000/comments/comment-123', //default dari helper thread-123 & comment-123
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response2 = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-000', //default dari helper thread-123 & comment-123
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        const responseJson2 = JSON.parse(response2.payload);
        expect(response.statusCode).toBe(404);
        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBeDefined();
        expect(response2.statusCode).toBe(404);
        expect(responseJson2.status).toBe('fail');
        expect(responseJson2.message).toBeDefined();
      });

      it('should response 200 when delete comment correctly', async () => {
        //arrange
        await UserTableTestHelper.addUser({ username:'bobpants' });
        await ThreadTableTestHelper.addthread({ title: 'ini judul thread', body:'ini isi thread' });
        await CommentsTableTestHelper.addComment({ username:'bobpants' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);
        await AuthenticationsTableTestHelper.addToken(token);
        //act
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123', //default dari helper thread-123 & comment-123
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const findResult = await CommentsTableTestHelper.findComment('comment-123');

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(200);
        expect(responseJson.status).toBe('success');
        expect(responseJson.message).toBeDefined();
        expect(findResult[0].is_deleted).toBe(true);
      });
    });

    describe('GET /threads/{threadId} endpoint', () => {
      it('should throw 404 when givem invalid threadId', async () => {
        //arrange
        await UserTableTestHelper.addUser({ username: 'bobpants' });
        await ThreadTableTestHelper.addthread({ title: 'ini judul thread', body:'ini isi thread', username:'bobpants' });
        const server = await createServer(container);

        //act
        const response = await server.inject({
          method: 'GET',
          url: '/threads/thread-000', //default dari helper thread-123
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(404);
        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBeDefined();
      });

      it('should response 200 and return detailThread', async () => {
        //arrange
        await UserTableTestHelper.addUser({ username: 'bobpants' });
        await UserTableTestHelper.addUser({ username: 'spongeSquare', id: 'user-111' });
        await ThreadTableTestHelper.addthread({ title: 'judul thread', body: 'ini isi thread' });
        await CommentsTableTestHelper.addComment({thread_id: 'thread-123', content: 'ini komentar', id: 'comment-001', username: 'bobpants'});
        await CommentsTableTestHelper.addComment({thread_id: 'thread-123', content: 'ini komentar kedua', id: 'comment-002', username: 'spongeSquare', is_deleted: true});
        const server = await createServer(container);

        //act
        const response = await server.inject({
          method: 'GET',
          url: '/threads/thread-123', //default dari helper thread-123
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(200);
        expect(responseJson.status).toBe('success');
        expect(responseJson.data.thread.comments).toHaveLength(2);
        expect(responseJson.data.thread.id).toEqual('thread-123');
        expect(responseJson.data.thread.comments[0].id).toEqual('comment-001');
        expect(responseJson.data.thread.comments[1].id).toEqual('comment-002');
        expect(responseJson.data.thread.comments[0].content).toEqual('ini komentar');
        expect(responseJson.data.thread.comments[1].content).toEqual('**komentar telah dihapus**');
      });
    });

    describe('POST /threads/{threadId}/comments/{commentId}/replies endpoint', () => {
      it('should return 400 when given bad payload', async () => {
        //arrange
        await UserTableTestHelper.addUser({ id:'user-123', username: 'bobpants' });
        await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants' });
        await CommentsTableTestHelper.addComment({ thread_id: 'thread-000', username: 'bobpants' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);

        //act
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-000/comments/comment-123/replies', //default helper comment-123
          headers: {
            Authorization: `Bearer ${token}`,
          },
          payload: {
            content: 124,
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(400);
        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBeDefined();
      });

      it('should return 404 when given invalid threadId or commentId', async () => {
        //arrange
        await UserTableTestHelper.addUser({ id:'user-123', username: 'bobpants' });
        await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants' });
        await CommentsTableTestHelper.addComment({ thread_id: 'thread-000', username: 'bobpants' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);

        //act
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-111111/comments/comment-123/replies', //thread-123 default dari helper, inject 111111 buat invalid Thread
          headers: {
            Authorization: `Bearer ${token}`,
          },
          payload: {
            content: 'ini komentar',
          },
        });
        const response2 = await server.inject({
          method: 'POST',
          url: '/threads/thread-000/comments/comment-000/replies', //comment-123 default dari helper, inject 000 buat invalid comment
          headers: {
            Authorization: `Bearer ${token}`,
          },
          payload: {
            content: 'ini komentar',
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        const responseJson2 = JSON.parse(response2.payload);
        expect(response.statusCode).toBe(404);
        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBeDefined();
        expect(response2.statusCode).toBe(404);
        expect(responseJson2.status).toBe('fail');
        expect(responseJson2.message).toBeDefined();
      });

      it('should return 201 and return addedreply', async () => {
        //arrange
        await UserTableTestHelper.addUser({ id:'user-123', username: 'bobpants' });
        await ThreadTableTestHelper.addthread({ id: 'thread-000', username: 'bobpants' });
        await CommentsTableTestHelper.addComment({ thread_id: 'thread-000', username: 'bobpants' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);

        //act
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-000/comments/comment-123/replies', //default dari helper thread-123
          headers: {
            Authorization: `Bearer ${token}`,
          },
          payload: {
            content: 'ini balasan untuk komentar',
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(201);
        expect(responseJson.status).toBe('success');
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data.addedReply.content).toEqual('ini balasan untuk komentar');
        expect(responseJson.data.addedReply.owner).toEqual('user-123');
      });
    });
  
    describe('DELETE  /threads/{threadId}/comments/{commentId}/replies/{replyId} endpoint', () => {
      it('should response 403 when unauthorized user trying to delete reply', async () => {
        //arrange
        await UserTableTestHelper.addUser({ id: 'user-123', username:'bobpants' });
        await UserTableTestHelper.addUser({ id: 'user-000', username:'spongeSquare' });
        await ThreadTableTestHelper.addthread({ id: 'thread-123', title: 'ini judul thread', body:'ini isi thread' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', username:'bobpants' });
        await ReplyTableTestHelper.addReply({ comment_id: 'comment-123' });
        const server = await createServer(container);
        const tokenReferensi = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);
        await AuthenticationsTableTestHelper.addToken(tokenReferensi);
        const token = Jwt.token.generate(
          {
            id: 'user-000',
          },
          {
            key: config.token.acc_key,
          },);
        await AuthenticationsTableTestHelper.addToken(token);
        //act
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123/replies/reply-123',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(403);
        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBeDefined();
      });

      it('should response 404 when given invalid thread, comment and reply id', async () => {
        //arrange
        await UserTableTestHelper.addUser({ id: 'user-123', username:'bobpants' });
        await UserTableTestHelper.addUser({ id: 'user-000', username:'spongeSquare' });
        await ThreadTableTestHelper.addthread({ id: 'thread-123', title: 'ini judul thread', body:'ini isi thread' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', username:'bobpants' });
        await ReplyTableTestHelper.addReply({ comment_id: 'comment-123' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);
        //act
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-000/comments/comment-123/replies/reply-123',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const response2 = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-000/replies/reply-123',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const response3 = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123/replies/reply-000',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        const responseJson2 = JSON.parse(response2.payload);
        const responseJson3 = JSON.parse(response3.payload);
        expect(response.statusCode).toBe(404);
        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBeDefined();
        expect(response2.statusCode).toBe(404);
        expect(responseJson2.status).toBe('fail');
        expect(responseJson2.message).toBeDefined();
        expect(response3.statusCode).toBe(404);
        expect(responseJson3.status).toBe('fail');
        expect(responseJson3.message).toBeDefined();
      });

      it('should response 200 when delete reply correctly', async () => {
        //arrange
        await UserTableTestHelper.addUser({ id: 'user-123', username:'bobpants' });
        await UserTableTestHelper.addUser({ id: 'user-000', username:'spongeSquare' });
        await ThreadTableTestHelper.addthread({ id: 'thread-123', title: 'ini judul thread', body:'ini isi thread' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', username:'bobpants' });
        await ReplyTableTestHelper.addReply({ comment_id: 'comment-123' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);
        await AuthenticationsTableTestHelper.addToken(token);
        //act
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123/replies/reply-123',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const findResult = await ReplyTableTestHelper.findReply('reply-123');

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toBe(200);
        expect(responseJson.status).toBe('success');
        expect(responseJson.message).toBeDefined();
        expect(findResult[0].is_deleted).toBe(true);
      });
    });

    describe('PUT  /threads/{threadId}/comments/{commentId}/likes endpoint', () => {
      it('should response 401 when PUT with missing authentications', async () => {
        //arrange
        const server = await createServer({});

        //act
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-123/comments/comment-123/likes',
        });

        //assert
        expect(response.statusCode).toEqual(401);
      });

      it('should response 404 when PUT with invalid thread|commentid', async () => {
        //arrange
        await UserTableTestHelper.addUser({ id: 'user-123', username:'bobpants' });
        await UserTableTestHelper.addUser({ id: 'user-000', username:'spongeSquare' });
        await ThreadTableTestHelper.addthread({ id: 'thread-123', title: 'ini judul thread', body:'ini isi thread' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', username:'bobpants' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);

        //act
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-xxx/comments/comment-123/likes',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
      });

      it('should response 200 when PUT with valid payload', async () => {
        //arrange
        await UserTableTestHelper.addUser({ id: 'user-123', username:'bobpants' });
        await UserTableTestHelper.addUser({ id: 'user-000', username:'spongeSquare' });
        await ThreadTableTestHelper.addthread({ id: 'thread-123', title: 'ini judul thread', body:'ini isi thread' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', username:'bobpants' });
        const server = await createServer(container);
        const token = Jwt.token.generate(
          {
            id: 'user-123',
          },
          {
            key: config.token.acc_key,
          },);

        //act
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-123/comments/comment-123/likes',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data).toBeDefined();
      });
    });
  });
});

