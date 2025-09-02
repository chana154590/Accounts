const mongoose = require('mongoose');

// הגדרת סכימה עם שדה ייחודי (לדוג' email)
const itemSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  // ניתן להוסיף שדות נוספים
});

const Item = mongoose.model('Item', itemSchema);

// פונקציה לשמירה ללא כפילות
async function saveUniqueItem(data) {
  try {
    // בדיקה אם קיים כבר פריט עם אותו email
    const exists = await Item.findOne({ email: data.email });
    if (exists) {
      console.log('פריט כבר קיים');
      return exists;
    }
    // שמירה אם לא קיים
    const item = new Item(data);
    await item.save();
    console.log('נשמר בהצלחה');
    return item;
  } catch (err) {
    console.error('שגיאה בשמירה:', err);
  }
}

module.exports = { Item, saveUniqueItem };
