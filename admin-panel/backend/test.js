const express = require('express');
const axios = require('axios');
const session = require('express-session');
const app = express();
const PORT = 3000;

// app.use(session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true
// }));

// LinkedIn OAuth Configuration
const clientID = 'your_linkedin_client_id';
const clientSecret = 'your_linkedin_client_secret';
const redirectUri = 'http://localhost:3000/auth/linkedin/callback';
const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=773a18kvzjii8v&redirect_uri=${redirectUri}&scope=openid%20profile`;

app.get('/auth/linkedin', (req, res) => {
    res.redirect(linkedinAuthUrl);
});

app.get('/auth/linkedin/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(401).send('Authorization code not provided.');
    } else {
        return res.status(200).send('Authorization Done.');

    }

    // try {
    //     // Exchange the authorization code for an access token
    //     const { data } = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
    //         params: {
    //             grant_type: 'authorization_code',
    //             code,
    //             redirect_uri: redirectUri,
    //             client_id: clientID,
    //             client_secret: clientSecret,
    //         }
    //     });

    //     const accessToken = data.access_token;

    //     // Use the access token to make API requests on behalf of the user
    //     // For example, fetch the user's profile
    //     const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`
    //         }
    //     });

    //     const userProfile = profileResponse.data;
    //     // Do something with the user profile data

    //     res.send(userProfile);
    // } catch (error) {
    //     console.error('Error:', error.message);
    //     res.status(500).send('Error');
    // }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
