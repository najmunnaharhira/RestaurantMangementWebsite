const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());

// mongodb configuration using mongoose
const mongoUri = process.env.DB_URI ||
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@domo-foodi-client.eqs1v9d.mongodb.net/demo-foodi-client?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

// jwt authentication
app.post('/jwt', async (req, res) => {
  try {
    const user = req.body;
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Server misconfiguration: ACCESS_TOKEN_SECRET not set" });
    }
    if (!user || typeof user !== 'object') {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const token = jwt.sign(user, secret, { expiresIn: '1hr' });
    res.send({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//   import routes here
const menuRoutes = require('./api/routes/menuRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const userRoutes = require('./api/routes/userRoutes')
app.use('/menu', menuRoutes)
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);

app.get("/", (req, res) => {
  res.send("Hello Foodi Client Server!");
});

const server = app.listen(port, () => {
  console.log(`Foodi server listening on port ${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other process or set PORT to a different value.`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});
