const express = require('express');
const jwt = require('jsonwebtoken');
// const Admin = require('../models/admin');
const router = express.Router();
let token;
// Signup route
const now = new Date();
const formattedDate = now.toISOString();
router.post('/signup', async (req, res) => {
  try {
    const { name,lastName, email, password } = req.body;
    console.log(req.body);

    // Check if admin already exists with same email
    const checkQuery = `SELECT * FROM Admin_Portal_Users WHERE Email	= '${email}'`;
    console.log("checkQuery",checkQuery);
connection.query(checkQuery,(error,results,fields)=>{
  if(error){
    console.error("Admin already exists with this email");
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
  if(results.recordset.length>0){
    return res.status(400).json({ error: 'Admin already exists with this email' });
  
  }
  const inserQuery = `INSERT INTO Admin_Portal_Users (Name, Last_Name	, Email,Password,Update_Date) VALUES ('${name}', '${lastName}','${email}', '${password}','${formattedDate}')`;
  connection.query(inserQuery,(error,results,fields)=>{
    if(error){
      console.error('Error creating admin:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(201).json({ message: 'Admin created successfully' });
  })
})

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;
    console.log("req.body",req.body);
const query = `SELECT * FROM Admin_Portal_Users WHERE Email = '${email}'`;
console.log(query);
connection.query(query,(error,results)=>{
console.log("result.RowDataPacket1",results.recordset);
// console.log("result.RowDataPacket2",results[0].Admin_User_Email);

  if(error){
    console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
  if(results.recordset.length===0){
    return res.status(400).json({ error: 'Invalid credentials1' });
  }
  const user = results.recordset[0].Password;
  if (user !== password) {
    return res.status(400).json({ error: 'Invalid credentials2' });
  }

    token = jwt.sign({ userId: query._id }, process.env.JWT_TOKEN, { expiresIn: '1h' });

    res.json({ token });
})

    // Generate a JWT token
   

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware function to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.body.token;
  console.log("TOKENN",token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.decoded = decoded;
    next();
  });
};

// Endpoint to verify the JWT token
router.post('/api/auth/verify', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token verified' });
});

module.exports = router;
