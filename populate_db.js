const mongoose = require('mongoose');
const fs = require('fs');

const url = 'mongodb://localhost:27017/personal_budget';

const budgetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    budget: { type: Number, required: true }
});

const Budget = mongoose.model('Budget', budgetSchema);

mongoose.connect(url)
    .then(async () => {
        console.log('connected to mongodb');

        await Budget.deleteMany({});
        console.log('deleted data');

        const data = JSON.parse(fs.readFileSync('budget_data.json', 'utf8'));

        await Budget.insertMany(data.myBudget);
        console.log('inserted data');

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
        mongoose.connection.close();
    });
