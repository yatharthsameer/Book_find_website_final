const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD); //replaces <PASSWORD> with our password

//write the following stuff without thinking every time you want to connect it to a mongoose database.
mongoose.connect(DB, {
  useNewUrlParser:true,
  useCreateIndex: true,
  useFindAndModify:false
}).then(() =>
  console.log('DB connection successful!'));


  //READ JSON FILE
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

  //IMPORT DATA INTO DB
  const importData = async () => {
    try{
      await Tour.create(tours);
      console.log('Data successfully loaded!');
      
    } catch(err) {
      console.log(err);
    }
    process.exit(); //stops the server after data is imported
  };

  //DELETE ALL DATA FROM DB
  const deleteData = async () => {
    try{
      await Tour.deleteMany();
      console.log('Data successfully deleted!');
      
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };

  //Run the following command in the terminal in the natours folder to import the data: node dev-data/data/import-dev-data.js --import
  if(process.argv[2] === '--import') {
    importData();
  } else if(process.argv[2] === '--delete') {
    deleteData();
  }

  console.log(process.argv);//tells about the processes running