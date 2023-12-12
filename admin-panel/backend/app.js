const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const cors = require("cors");
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
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  options: {
    encrypt: true // use encrypted connection
  }
};
global.connection = mssql.connect(config, function (err) {

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
const workcenterRoutes = require('./routes/workcenterRoutes');

const { error } = require('console');
const app = express();
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/', pcnRoutes);
app.use('/', workcenterRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
app.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on port ${process.env.PORT || 8000}...`);
});
module.exports = connection