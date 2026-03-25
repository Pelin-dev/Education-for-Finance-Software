const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Tüm kapıları sonuna kadar açan CORS
app.use(cors({ origin: '*' }));
app.use(express.json());

// 🟢 CAN DAMARI TESTİ: Bu rotaya girince sunucunun yaşayıp yaşamadığını göreceğiz
app.get('/', (req, res) => {
    res.send('Tebrikler Pelin! Backend tıkır tıkır çalışıyor 🚀');
});

// Rotalar
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));

// MongoDB Bağlantısı (Hata verse bile sunucuyu çökertmemesi için özel ayarlandı)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => console.log('MongoDB bağlandı ✅'))
  .catch(err => console.error('MongoDB BAĞLANTI HATASI:', err));

// Port Dinleme (Railway için 0.0.0.0 zorunluluğu)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda başarıyla ayağa kalktı 🚀`);
});