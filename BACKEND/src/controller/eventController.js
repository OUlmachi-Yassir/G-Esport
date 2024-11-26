const Event = require('../model/event');

exports.createEvent = async (req, res) => {
  try {
    const { name, date, location, description } = req.body;
    const event = new Event({ name, date, location, description });
    await event.save();
    res.status(201).json({ message: 'Événement créé avec succès', event });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'événement', error });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des événements', error });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'événement', error });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    res.status(200).json({ message: 'Événement mis à jour avec succès', updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'événement', error });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    res.status(200).json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'événement', error });
  }
};


const User = require('../model/User');
const nodemailer = require('nodemailer');

exports.addParticipantToEvent = async (req, res) => {
  try {
    const { eventId, participantId } = req.body;

    // Vérifiez si l'utilisateur existe
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: 'Participant non trouvé' });
    }

    // Ajoutez le participant à l'événement
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { participants: participantId } }, // $addToSet évite les doublons
      { new: true }
    ).populate('participants');

    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    // Envoyer un email au participant
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ytoop66@gmail.com',
        pass: 'xfmz cgue hxkv doho', // Votre mot de passe d'application
      },
    });

    const mailOptions = {
      from: 'ytoop66@gmail.com',
      to: participant.email,
      subject: 'Confirmation d\'inscription',
      text: `Bonjour ${participant.name},\n\nVous êtes inscrit à l'événement : ${event.name}.\n\nMerci !`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Participant ajouté à l\'événement et email envoyé', event });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du participant à l\'événement', error });
  }
};

