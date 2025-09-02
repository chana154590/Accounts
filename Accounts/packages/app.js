const mongoose = require('mongoose');
const { saveUniqueItem } = require('./itemModel');


mongoose.connect('mongodb://localhost:27017/accountsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

(async () => {
  const data = { name: 'דוגמה', email: 'example@email.com' };
  await saveUniqueItem(data);
  mongoose.connection.close();
})();
