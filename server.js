// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const whitelist = ['http://localhost:3000', 'http://localhost:5500'];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use(cors(corsOptions));

const fs = require('fs');
const budget = JSON.parse(fs.readFileSync('budget_data.json', 'utf8'));

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});
