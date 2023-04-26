const express = require('express');
const crypto = require('crypto');
const PCN = require('../models/pcn');
const router = express.Router();

// generate-pcn route
router.post('/generate-pcn', async (req, res) => {
  try {
    const { Pcn } = req.body;

    // Check if the PCN already exists
    const existingPCN = await PCN.findOne({ Pcn });
    if (existingPCN) {
      return res.status(400).json({ error: 'PCN already exists' });
    }

    else if(req.body.Pcn.length === 0) {
      return res.status(400).json({ error: 'PCN can not be empty' });
    }

    // Generate a random token
    const Token = crypto.randomBytes(32).toString('hex');

    // Create a new PCN document
    const newPCN = new PCN({
      Pcn,
      Token,
      createdAt: new Date()
    });

    // Save the PCN document
    await newPCN.save();

    res.json({ Token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Receive all the generated PCNs
router.get('/get-all-pcn', async (req, res) => {
  try {
    const pcns = await PCN.find();
    res.json(pcns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify PCN route
router.post('/verify-pcn', async (req, res) => {
  const { Pcn, Token } = req.body;
  console.log(Pcn, Token);
  try {
    const pcnDoc = await PCN.findOne({ Pcn, Token });

    if (pcnDoc) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//remove-pcn route
router.get('/remove-pcn', async (req, res) => {
  const { Pcn } = req.query;

  try {
    const pcnDoc = await PCN.findOne({ Pcn });
    if (pcnDoc) {
      await pcnDoc.deleteOne();
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;