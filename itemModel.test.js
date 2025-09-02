const mongoose = require('mongoose');
const { Item, saveUniqueItem } = require('./Accounts/packages/itemModel');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/accountsDBTest', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('saveUniqueItem', () => {
  it('should save a new item', async () => {
    const data = { name: 'Test', email: 'test@email.com' };
    const item = await saveUniqueItem(data);
    expect(item.name).toBe('Test');
    expect(item.email).toBe('test@email.com');
  });

  it('should not save duplicate item', async () => {
    const data = { name: 'Test', email: 'test@email.com' };
    const item1 = await saveUniqueItem(data);
    const item2 = await saveUniqueItem(data);
    expect(item2._id.toString()).toBe(item1._id.toString());
  });
});