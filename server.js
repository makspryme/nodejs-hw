import app from './app.js';
import mongoose from 'mongoose';

const DB_HOST =
  'mongodb+srv://makspryme17:7luvJSloIjxm8cYO@cluster0.rla1ny9.mongodb.net/NodeJS?retryWrites=true&w=majority';

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running. Use our API on port: 3000');
    });
  })
  .catch((error) => {
    process.exit(1);
  });
