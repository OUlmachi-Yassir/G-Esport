const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Event = require('../model/event');
const User = require('../model/User');

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

describe('Event Controller', () => {
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

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const res = await request(app).post('/api/events').send({
        name: 'Test Event',
        date: '2024-12-01',
        location: 'Test Location',
        description: 'Test Description',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Événement créé avec succès');
      expect(res.body.event).toHaveProperty('name', 'Test Event');
    });
  });

  describe('getAllEvents', () => {
    it('should retrieve all events', async () => {
      const res = await request(app).get('/api/events');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('getEventById', () => {
    it('should retrieve a specific event by ID', async () => {
      const event = await Event.create({
        name: 'Event by ID',
        date: '2024-12-01',
        location: 'Test Location',
        description: 'Test Description',
      });

      const res = await request(app).get(`/api/events/${event._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Event by ID');
    });

    it('should return 404 if event is not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/events/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Événement non trouvé');
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', async () => {
      const event = await Event.create({
        name: 'Event to Update',
        date: '2024-12-01',
        location: 'Test Location',
        description: 'Test Description',
      });

      const res = await request(app).put(`/api/events/${event._id}`).send({
        name: 'Updated Event',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.updatedEvent).toHaveProperty('name', 'Updated Event');
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const event = await Event.create({
        name: 'Event to Delete',
        date: '2024-12-01',
        location: 'Test Location',
        description: 'Test Description',
      });

      const res = await request(app).delete(`/api/events/${event._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Événement supprimé avec succès');
    });
  });

//   describe('addParticipantToEvent', () => {
//     it('should add a participant to an event and send an email', async () => {
//       const event = await Event.create({
//         name: 'Event with Participant',
//         date: '2024-12-01',
//         location: 'Test Location',
//         description: 'Test Description',
//       });

//       const user = await User.findOne({ email: "testuser@example.com" });
//         if (!user) {
//             await User.create({
//             email: "testuser@example.com",
//             name: "Test User",
//             password: "securepassword123",
//             });
//         }

//       const res = await request(app).post('/api/events/participant').send({
//         eventId: event._id,
//         participantId: user._id,
//       });

//       console.log(res);


//       expect(res.statusCode).toBe(200);
//       expect(res.body.event.participants).toContain(user._id.toString());
//       expect(res.body).toHaveProperty(
//         'message',
//         "Participant ajouté à l'événement et email envoyé"
//       );
//     });
//   });

//   describe('removeParticipantFromEvent', () => {
//     it('should remove a participant from an event', async () => {
//         const user = await User.findOne({ email: "testuser@example.com" });
//         if (!user) {
//             await User.create({
//             email: "testuser@example.com",
//             name: "Test User",
//             password: "securepassword123",
//             });
//         }
//       const event = await Event.create({
//         name: 'Event to Remove Participant',
//         date: '2024-12-01',
//         location: 'Test Location',
//         description: 'Test Description',
//         participants: [user._id],
//       });

//       const res = await request(app).delete('/api/events/participant').send({
//         eventId: event._id,
//         participantId: user._id,
//       });

//       console.log(res);

//       expect(res.statusCode).toBe(200);
//       expect(res.body.event.participants).not.toContain(user._id.toString());
//       expect(res.body).toHaveProperty('message', "Participant retiré de l'événement");
//     });
//   });
});
