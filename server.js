const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD); //replaces <PASSWORD> with our password

//write the following stuff without thinking every time you want to connect it to a mongoose database.
mongoose.connect(DB, {
  useNewUrlParser:true,
  useCreateIndex: true,
  useFindAndModify:false
}).then(() =>
  console.log('DB connection successful!'));


//TESTING

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997
// })

// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => {
//     console.log('ERROR👺:', err);
//   })

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//for errors related to our database, eg, if the password for mongoose is wrong
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 😈 Shutting Down...');
   console.log(err);
  server.close(() => {
    process.exit(1);
  });
});


// console.log(x);