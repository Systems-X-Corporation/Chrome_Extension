const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const cors = require("cors");
// const mysql = require('mysql');
const mssql = require('mssql');
require('dotenv').config();

// global.connection= mysql.createConnection({
//   host:"localhost",
//   user:"root",
//   password:"",
//   database:"test2"
// })

// connection.connect((err)=>{
//   if(err){
//     console.log(err)
//     return
//   }
//   console.log("DATABASE CONNECTED");
// })

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server:process.env.DB_SERVER,
  database:process.env.DB_NAME,
  options: {
    encrypt: true // use encrypted connection
  }
};
global.connection = mssql.connect(config,function(err){
 
  if (err) console.log(err);
  console.log("DATABASE CONNECTED");
  // create Request object
     
  // query to the database and get the records
  connection.query('select * from Admin_Portal_Users', function (err, result) {
      
      if (err) console.log(err)
      // send records as a response
  })
})  
const authRoutes = require('./routes/authRoutes');
const pcnRoutes = require('./routes/pcnRoutes');
const { error } = require('console');
const app = express();
//app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.json());

app.use('/', authRoutes);
// app.use('/pcn', pcnRoutes);
app.use('/', pcnRoutes);

//app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
//});
app.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on port ${process.env.PORT || 8000}...`);
});
module.exports = connection
