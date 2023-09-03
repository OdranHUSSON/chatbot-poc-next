import request from 'supertest';
import app from '../pages/_app';

describe('Chats API', () => {
  it('should list all chats', async () => {
    const res = await request(app)
      .get('/api/chats')
      .send();

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new chat', async () => {
    const res = await request(app)
      .post('/api/chats')
      .send({
        name: 'Test Chat',
        description: 'This is a test chat',
        isPrivate: false,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should get a chat by id', async () => {
    const chat = await request(app)
      .post('/api/chats')
      .send({
        name: 'Test Chat',
        description: 'This is a test chat',
        isPrivate: false,
      });

    const res = await request(app)
      .get(`/api/chats/${chat.body.id}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(chat.body.id);
  });

  it('should update a chat', async () => {
    const chat = await request(app)
      .post('/api/chats')
      .send({
        name: 'Test Chat',
        description: 'This is a test chat',
        isPrivate: false,
      });

    const res = await request(app)
      .put(`/api/chats/${chat.body.id}`)
      .send({
        name: 'Updated Test Chat',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Chat updated');
  });

  it('should delete a chat', async () => {
    const chat = await request(app)
      .post('/api/chats')
      .send({
        name: 'Test Chat',
        description: 'This is a test chat',
        isPrivate: false,
      });

    const res = await request(app)
      .delete(`/api/chats/${chat.body.id}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Chat deleted');
  });
});
