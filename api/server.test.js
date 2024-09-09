const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');
const knex = require('knex');
const knexConfig = require('../knexfile');

beforeAll(async () => {
  await db.migrate.latest();
});

afterAll(async () => {
  await db.migrate.rollback();
  await db.destroy();
});

// Write your tests here
test('sanity', () => {
  expect(true).not.toBe(false);
});

describe('server.js', () => {
  describe('[POST] to /api/auth/register', () => {
    it('[1] the API responds with the correct status on successful registration', async () => {
      const user = { username: 'Max', password: 'ChonkyBoy1$'}
      const response = await request(server).post('/api/auth/register').send(user)
      expect(response.status).toBe(201)
    })
    it('[2] the API responds with the correct username after successful registration', async () => {
      const user = { username: 'Jynx', password: 'ImAdogMaybe3'}
      const response = await request(server).post('/api/auth/register').send(user)
      expect(response.body).toEqual(expect.objectContaining({ username: 'Jynx' }))
    })
  })
  describe('[POST] to /api/auth/login', () => {
    it('[3] the API responds with the correct message when provided with valid credentials', async () => {
      const user = { username: 'Max', password: 'ChonkyBoy1$'}
      const response = await request(server).post('/api/auth/login').send(user)
      expect(response.body.message).toMatch(/Welcome, Max/i)
    });
    it('[4] the API responds with the correct status when invalid credentials are sent', async () => {
      let response = await request(server).post('/api/auth/login').send({ username: 'Jynx', password: 'isThisThePass?'})
      expect(response.status).toBe(401)
      response = await request(server).post('/api/auth/login').send({ username: 'Jynxy-boy', password: 'ImAdogMaybe3'})
      expect(response.status).toBe(401)
    })
  });
  describe('[GET] to /api/jokes', () => {
    it('[5] the API responds with the correct status and message when no token is present', async () => {
      const response = await request(server).get('/api/jokes')
      expect(response.status).toBe(401)
      expect(response.body.message).toMatch(/token required/i)
    })
    it('[6] the API responds with the correct status and message if the token is invalid', async () => {
      const response = await request(server).get('/api/jokes').set('Authorization', 'thisIsSneaky')
      expect(response.status).toBe(401)
      expect(response.body.message).toMatch(/token invalid/i)
    })
  })
});
