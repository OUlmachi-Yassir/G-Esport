const request = require('supertest');
const app = require('../../server'); 
const User = require('../model/User');

jest.mock('../model/User');

describe('User Routes', () => {
  describe('GET /api/users', () => {

    it('should return all users and status 200', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1' },
        { _id: '2', name: 'User 2' },
      ];
      User.find.mockResolvedValue(mockUsers);

      const res = await request(app).get('/api/users/someValue'); 

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
    });

    it('should return 500 if there is an error fetching users', async () => {
      User.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/api/users/someValue');  

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'Error fetching users');
      expect(res.body).toHaveProperty('error');
    });

  });
});
