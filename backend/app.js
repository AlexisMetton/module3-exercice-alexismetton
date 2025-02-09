require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const db = require('./config/db');
const characterRoutes = require("./routes/charactersRoute");
const classRoutes = require("./routes/classRoute");
const roleRoutes = require("./routes/roleRoute");
const teamRoutes = require("./routes/teamRoute");

// Routes
app.use('/characters', characterRoutes);
app.use("/teams", teamRoutes);
app.use("/classes", classRoutes);
app.use("/roles", roleRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;