const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// KAYIT OL
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email var mı kontrol et
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Bu email zaten kayıtlı' });

    // Şifreyi şifrele
    const hashed = await bcrypt.hash(password, 10);

    // Kullanıcı oluştur
    const user = new User({ name, email, password: hashed });
    await user.save();

    // Token oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Sunucu hatası' });
  }
});

// GİRİŞ YAP
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcı var mı
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Email veya şifre hatalı' });

    // Şifre doğru mu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Email veya şifre hatalı' });

    // Token oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Sunucu hatası' });
  }
});

module.exports = router;