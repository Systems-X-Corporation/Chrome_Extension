const express = require('express');
const crypto = require('crypto');
// const PCN = require('../models/pcn');
const router = express.Router();
// generate-pcn route
const now = new Date();
const formattedDate = now.toISOString();

// Reset pin by pcn number
router.post('/reset-pin', async (req, res) => {
  try {
    const { Plexus_Customer_No, Pin } = req.body.data;
    // console.log("PCNN", req.body);

    if (Plexus_Customer_No.length === 0) {
      return res.status(400).json({ error: 'PCN can not be empty' });
    }

    if (Pin.length === 0) {
      return res.status(400).json({ error: 'pin can not be empty' });
    }

    if (Pin.length !== 4) {
      return res.status(400).json({ error: '4 digits pin is required' });
    }

    const data = `UPDATE PCN_Token SET Pin = '${Pin}' WHERE Plexus_Customer_No = ${Plexus_Customer_No}`
    console.log("data =>", data);
    await connection.query(data, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (Pin.length !== 4) {
        return res.status(404).json({ error: '4 digits pin is required' });
      }

      res.json({ status: 200, message: "Field is updated successfully" });
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//To varify pin from frontend is correct or not
router.post('/verify-pin', async (req, res) => {
  try {
    const { Pcn_No, Pin } = req.body;
    // console.log("PCNN", req.body);

    const data = `SELECT Pin FROM PCN_Token WHERE Plexus_Customer_No = ${Pcn_No}`
    await connection.query(data, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (Pcn_No.length === 0) {
        return res.status(400).json({ error: 'PCN can not be empty' });
      }

      if (Pin.length === 0) {
        return res.status(400).json({ error: 'pin can not be empty' });
      }

      if (Pin.length !== 4) {
        return res.status(400).json({ error: '4 digits pin is required' });
      }

      if (results.recordset[0].Pin === Pin) {
        res.status(200).json({ message: "You are authorized" });
      } else {
        res.status(400).json({ message: "You are Unauthorized" });
      }

    
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/generate-pcn', async (req, res) => {
  try {
    const { Plexus_Customer_No } = req.body;
    const { Email } = req.body;
    const { Password } = req.body;
    const { Pin } = req.body;
    const { Plexus_Customer_Name } = req.body;

    console.log("PCNN", req.body);
    const existingPCN = `SELECT * FROM PCN_Token WHERE Plexus_Customer_No = '${Plexus_Customer_No}'`;
    const existingWSLogin = `SELECT * FROM PCN_WS_Login WHERE Plexus_Customer_No = '${Plexus_Customer_No}' OR Email = '${Email}'`;
    // console.log(existingPCN);
    console.log(existingWSLogin);

    connection.query(existingWSLogin, (error, results) => {
      console.log("RES", results.recordset);
      console.log("results.recordset.length", results.recordset.length);
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.recordset.length > 0) {
        return res.status(400).json({ error: 'Pcn already exist with this Email' });
      }
      if (Plexus_Customer_No.length === 0) {
        return res.status(400).json({ error: 'PCN can not be empty' });
      }
      if (Pin.length === 0) {
        return res.status(400).json({ error: 'pin can not be empty' });
      }

      if (Pin.length !== 4) {
        return res.status(400).json({ error: '4 digits pin is required' });
      }

      if (Plexus_Customer_Name.length >= 50) {
        return res.status(400).json({ error: 'Only 50 characters in PCN Name is not allowed' });
      }

      if (Plexus_Customer_Name.length <= 3) {
        return res.status(400).json({ error: 'Less than 3 characters in PCN Name is not allowed' });
      }

      console.log("PLX", Plexus_Customer_No);
      const Token = crypto.randomBytes(32).toString('hex');
      const query = `INSERT INTO PCN_Token (Plexus_Customer_No, Token,Update_Date, Pin, Plexus_Customer_Name) VALUES ('${Plexus_Customer_No}','${Token}','${formattedDate}','${Pin}','${Plexus_Customer_Name}')`;
      const PCN_WS_Login = `INSERT INTO PCN_WS_Login (Plexus_Customer_No, Email, Password, Update_Date) VALUES ('${Plexus_Customer_No}','${Email}','${Password}','${formattedDate}')`;
      console.log(query);
      console.log("PCN_WS_Login", PCN_WS_Login);
      connection.query(query, (error, results) => {
        console.log("REUSLT", results);
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal server error' });
        }

      });
      connection.query(PCN_WS_Login, (error, results) => {
        console.log("REUSLT11", results);
        if (error) {
          console.error(error);

        }

      });
      res.json({ Token });
    })

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Receive all the generated PCNs
router.get('/get-all-pcn', async (req, res) => {
  try {
    const pcns = await connection.query(`SELECT * FROM PCN_Token`, (err, rows) => {
      res.json(rows);
      console.log("pcns", rows);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Recieve PCN_WS_LOGIN DAta
router.get('/get-Ws', async (req, res) => {
  try {
    const PcnWs = await connection.query(`SELECT * FROM PCN_WS_Login`, (err, rows) => {
      res.json(rows);
      console.log("pcns", rows);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// // Verify PCN route
router.post('/verify-pcn', async (req, res) => {
  const { Plexus_Customer_No, Token } = req.body;
  try {
    const query = `SELECT * FROM PCN_Token WHERE Plexus_Customer_No = '${Plexus_Customer_No}' AND Token = '${Token}'`;
    connection.query(query, (error, rows, fields) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      console.log(res);
      // If a row is returned, the PCN and token combination exists
      if (rows.recordset.length > 0) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// //remove-pcn route
router.get('/remove-pcn', async (req, res) => {
  const { Plexus_Customer_No } = req.query;
  try {
    const rows = `SELECT * FROM PCN_Token WHERE Plexus_Customer_No = '${Plexus_Customer_No}'`;
    connection.query(rows, (error, results) => {
      console.log(results);
      if (results.recordset.length > 0) {
        connection.query(`DELETE FROM PCN_Token WHERE Plexus_Customer_No = '${Plexus_Customer_No}'`);
        connection.query(`DELETE FROM PCN_WS_Login WHERE Plexus_Customer_No = '${Plexus_Customer_No}'`);

        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    })

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;