const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const jwt = require('jsonwebtoken');

// Middleware - admin kontrolü
const isAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: 'Yetkisiz erişim' });
  }
};

router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch {
    res.status(500).json({ msg: 'Sunucu hatası' });
  }
});

router.post('/', isAdmin, async (req, res) => {
  try {
    const video = new Video(req.body);
    await video.save();
    res.json(video);
  } catch {
    res.status(500).json({ msg: 'Sunucu hatası' });
  }
});

router.put('/:id', isAdmin, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(video);
  } catch {
    res.status(500).json({ msg: 'Sunucu hatası' });
  }
});

router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Video silindi' });
  } catch {
    res.status(500).json({ msg: 'Sunucu hatası' });
  }
});

module.exports = router;