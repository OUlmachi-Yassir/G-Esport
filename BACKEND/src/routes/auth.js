const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Accès non autorisé.' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accès interdit.' });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token invalide.' });
    }
  };
};

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });

    const finalRole = role === 'organisateur' ? 'participant' : role;

    const user = new User({ name, email, password, role: finalRole });
    await user.save();
    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l’enregistrement.' });
  }
});

router.post('/assign-organisateur', authMiddleware(['organisateur']), async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    user.role = 'organisateur';
    await user.save();
    res.status(200).json({ message: 'Utilisateur promu organisateur avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la promotion de l’utilisateur.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect.' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
});

module.exports = router;
