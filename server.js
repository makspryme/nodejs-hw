import app from './app.js';
import mongoose from 'mongoose';

const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log('Database connection successful');
    });
  })
  .catch((error) => {
    process.exit(1);
  });
