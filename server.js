const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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
app.use(express.json());
app.use('/', express.static('public'));

const url = 'mongodb://localhost:27017/personal_budget';
mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const budgetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    budget: { type: Number, required: true },
    color: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^#[0-9A-Fa-f]{6,}$/.test(v);
            },
            message: props => `${props.value} Not correct format. Use format #RRGGBB`
        }
    }
});

const Budget = mongoose.model('Budget', budgetSchema);

app.get('/budget', async (req, res) => {
    try {
        const budgets = await Budget.find({});
        res.json({ myBudget: budgets });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching budget data ' });
    }
});

app.post('/budget', async (req, res) => {
    try {
        const { title, budget, color } = req.body;
        const newBudget = new Budget({ title, budget, color });
        await newBudget.save();
        res.status(201).json(newBudget);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`API at http://localhost:${port}`);
});
