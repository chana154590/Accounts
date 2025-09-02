const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
 
});

const Item = mongoose.model('Item', itemSchema);


async function saveUniqueItem(data) {
  try {
    const exists = await Item.findOne({ email: data.email });
    if (exists) {
      console.log('פריט כבר קיים');
      return exists;
    }
   
    const item = new Item(data);
    await item.save();
    console.log('נשמר בהצלחה');
    return item;
  } catch (err) {
    console.error('שגיאה בשמירה:', err);
  }
}

module.exports = { Item, saveUniqueItem };
