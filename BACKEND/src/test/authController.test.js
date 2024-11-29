const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../model/User');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake-token'),
  verify: jest.fn().mockImplementation(() => ({ id: 'user-id', role: 'participant' })),
}));


beforeEach(async () => {
    await User.deleteMany({}); // Supprimer tous les utilisateurs avant chaque test
  });

describe('Auth Controller', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'participant',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Utilisateur enregistré avec succès.');
    });

    it('should return 400 if user already exists', async () => {
      await User.create({
        name: 'Existing User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'participant',
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'participant',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Cet utilisateur existe déjà.');
    });
  });

//   describe('POST /assign-organisateur', () => {
//     it('should promote user to organisateur', async () => {
//       const user = await User.create({
//         name: 'Test User',
//         email: 'testuser@example.com',
//         password: 'password123',
//         role: 'participant',
//       });

//       const res = await request(app)
//         .post('/api/auth/assign-organisateur')
//         .set('Authorization', `Bearer fake-token`)
//         .send({ email: 'testuser@example.com' });

//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('message', 'Utilisateur promu organisateur avec succès.');
//       const updatedUser = await User.findById(user._id);
//       expect(updatedUser.role).toBe('organisateur');
//     });

//     it('should return 404 if user not found', async () => {
//       const res = await request(app)
//         .post('/api/auth/assign-organisateur')
//         .set('Authorization', `Bearer fake-token`)
//         .send({ email: 'nonexistentuser@example.com' });

//       expect(res.statusCode).toBe(404);
//       expect(res.body).toHaveProperty('message', "Utilisateur introuvable.");
//     });
//   });

  describe('POST /login', () => {
    it('should login a user and return a token', async () => {
      await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'participant',
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'testuser@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.role).toBe('participant');
    });

    it('should return 404 if user is not found', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistentuser@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', "Utilisateur introuvable.");
    });

    it('should return 400 if password is incorrect', async () => {
      await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'participant',
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Mot de passe incorrect.');
    });
  });
});
