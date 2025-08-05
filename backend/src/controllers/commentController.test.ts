import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import app from '../app'; // Import the app directly

const prisma = new PrismaClient();

// Custom matcher for toBeArrayOfSize
expect.extend({
  toBeArrayOfSize(received: any[], expected: number) {
    const pass = Array.isArray(received) && received.length === expected;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be an array of size ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be an array of size ${expected} but got ${received.length}`,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeArrayOfSize(expected: number): R;
    }
  }
}

describe('Comment API', () => {
  beforeAll(async () => {
    // Clear the database before tests
    await prisma.comment.deleteMany();
    await prisma.like.deleteMany(); // Delete likes before posts
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let authToken: string;
  let postId: number;
  let parentCommentId: number;

  it('should register a user and get an auth token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('token');
    authToken = loginRes.body.token;
  });

  it('should create a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('image', './uploads/test-image.png')
      .field('caption', 'This is a test post');
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    postId = res.body.id;
  });

  it('should create a top-level comment', async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'This is a top-level comment' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.content).toEqual('This is a top-level comment');
    expect(res.body.parentId).toBeNull();
    parentCommentId = res.body.id;
  });

  it('should create a reply to a comment', async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'This is a reply', parentId: parentCommentId });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.content).toEqual('This is a reply');
    expect(res.body.parentId).toEqual(parentCommentId);
  });

  it('should get comments for a post including replies', async () => {
    const res = await request(app)
      .get(`/api/posts/${postId}/comments`)
      .expect(200);

    expect(res.body).toBeArrayOfSize(1); // Only top-level comment
    expect(res.body[0]).toHaveProperty('replies');
    expect(res.body[0].replies).toBeArrayOfSize(1);
    expect(res.body[0].replies[0].content).toEqual('This is a reply');
  });
});