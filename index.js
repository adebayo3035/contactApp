const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/contactDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api', contactRoutes);

app.get('/', (req, res) => {
    res.send('Contact Management System');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
