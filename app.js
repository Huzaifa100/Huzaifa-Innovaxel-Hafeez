const express = require('express');
const app = express();
const urlRoutes = require('./routes/urlRoutes');
require('dotenv').config();

app.use(express.json());
app.use('/', urlRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));