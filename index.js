const nodemailer = require('nodemailer');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const MAIL = process.env.MAIL_ADDRESS;
const USERNAME = process.env.USER;
const PASSWORD = process.env.PASS;
const CHECK_INTERVAL = 1000;

const web = express();
const apiPath = '/api/v1';
const webPath = __dirname + '/public';

const EMAIL_RECIPIENTS = [
    'cooper@fuzemedia.com.au'
];

const MAIL_TRANSPORT = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: MAIL,
        pass: process.env.MAIL_PASSWORD,
    },
});

web.use('/', express.static(webPath));
web.use(cors());

checkStatus();


//? ---------------------------------------------------------------------------
//?         CHECK STATUS
//? ---------------------------------------------------------------------------
async function checkStatus() {
    const { data:token } = await axios({
        method: 'POST',
        data: {
            userName: USERNAME,
            password: PASSWORD,
        },
        url: `http://${HOST}/local/rest/v1/login/verify`,
    });

    let previousState = null;

    setInterval(async () => {
        const { data:status } = await axios({
            method: 'GET',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/ups/status`,
        });

        const { input, output, battery, system } = status;

        if (input.stateText === 'Blackout' && previousState === input.stateText) {
            console.log('BLACKOUT');
        } else if (input.stateText === 'Normal' && previousState === 'Blackout') {
            console.log('POWER HAS RETURNED');
        }
    }, CHECK_INTERVAL);
}

//? ---------------------------------------------------------------------------
//?         SEND EMAIL
//? ---------------------------------------------------------------------------
async function sendEmail(subject, html) {
    await MAIL_TRANSPORT.sendMail({
        from: `OpenUPS <${MAIL}>`,
        to: EMAIL_RECIPIENTS,
        subject: subject,
        html: html
    });
}


//? ---------------------------------------------------------------------------
//?         GET SESSION TOKEN
//? ---------------------------------------------------------------------------
web.get(apiPath + '/session', async (req, res) => {
    const user = req.query.username;
    const pass = req.query.password;
    
    if (!user || !pass) {
        return res.status(200).send('ERROR: Invalid credentials');
    }
    
    res.setHeader('Cache-Control', 'no-cache');

    try {
        const { data } = await axios({
            method: 'POST',
            data: {
                userName: user,
                password: pass,
            },
            url: `http://${HOST}/local/rest/v1/login/verify`,
        });

        res.status(200).send(data);
    } catch (error) {
        if (error.message === "Request failed with status code 500") {
            res.status(200).send('ERROR: Invalid credentials');
        } else {
            res.status(200).send(error.message);
        }
    }
});


//? ---------------------------------------------------------------------------
//?         GET UPS STATUS
//? ---------------------------------------------------------------------------
web.get(apiPath + '/ups/status', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    res.setHeader('Cache-Control', 'no-cache');

    try {
        const { data } = await axios({
            method: 'GET',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/ups/status`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         GET UPS HOST MACHINE
//? ---------------------------------------------------------------------------
web.get(apiPath + '/ups/host', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    try {
        const { data } = await axios({
            method: 'GET',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/header/data`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         GET UPS SPECIFICATIONS
//? ---------------------------------------------------------------------------
web.get(apiPath + '/ups/specifications', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    try {
        const { data } = await axios({
            method: 'GET',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/ups/spec`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         GET UPS SUMMARY
//? ---------------------------------------------------------------------------
web.get(apiPath + '/ups/summary', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    res.setHeader('Cache-Control', 'no-cache');

    try {
        const { data } = await axios({
            method: 'GET',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/ups/summary`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         GET RECENT UPS LOGS
//? ---------------------------------------------------------------------------
web.get(apiPath + '/logs/recent', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    try {
        const { data } = await axios({
            method: 'GET',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/eventlogs/report/recent`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         GET UPS DIAGNOSTIC STATE
//? ---------------------------------------------------------------------------
web.get(apiPath + '/diagnostic/state', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    try {
        const { data } = await axios({
            method: 'GET',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/diagnostic/state`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         GET UPS DIAGNOSTIC BATTERY TEST
//? ---------------------------------------------------------------------------
web.get(apiPath + '/diagnostic/battery', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    try {
        const { data } = await axios({
            method: 'GET',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/diagnostic/battery_test`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         POST UPS DIAGNOSTIC BATTERY TEST
//? ---------------------------------------------------------------------------
web.post(apiPath + '/diagnostic/battery', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    try {
        const { data } = await axios({
            method: 'POST',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/diagnostic/battery_test`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         GET UPS DIAGNOSTIC ALARM TEST
//? ---------------------------------------------------------------------------
web.get(apiPath + '/diagnostic/alarm', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    try {
        const { data } = await axios({
            method: 'GET',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/diagnostic/alarm_test`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         POST UPS DIAGNOSTIC ALARM TEST
//? ---------------------------------------------------------------------------
web.post(apiPath + '/diagnostic/alarm', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    try {
        const { data } = await axios({
            method: 'POST',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/diagnostic/alarm_test`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         GET UPS DIAGNOSTIC INDICATOR TEST
//? ---------------------------------------------------------------------------
web.get(apiPath + '/diagnostic/indicator', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    try {
        const { data } = await axios({
            method: 'GET',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/diagnostic/indicator_test`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});


//? ---------------------------------------------------------------------------
//?         POST UPS DIAGNOSTIC INDICATOR TEST
//? ---------------------------------------------------------------------------
web.post(apiPath + '/diagnostic/indicator', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(200).send('ERROR: Authentication failed');
    }
    
    try {
        const { data } = await axios({
            method: 'POST',
            headers: {
                Authorization: token,
            },
            url: `http://${HOST}/local/rest/v1/diagnostic/indicator_test`,
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(200).send(error.message);
    }
});



//? ---------------------------------------------------------------------------
//?         DASHBOARD WEBSITE
//? ---------------------------------------------------------------------------
web.get('/', (req, res) => {
    res.status(200).sendFile(webPath + '/assets/pages/dashboard.html');
});

web.listen(PORT, () => {
    console.clear();
	console.log('\x1b[33m%s\x1b[0m', `LISTENING ON PORT ${PORT}`);
});