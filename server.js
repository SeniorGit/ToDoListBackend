const express = require('express');
const cors = require('cors');
const taskRoutes = require("./routes/taskRouter");
const authRouter = require("./routes/authRouter")

require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://to-do-list-rho-ashen.vercel.app',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// allow all from origin 
app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(express.json()); 

// Routes
app.use('/tasks', taskRoutes);
app.use('/api/auth',  authRouter);

const PORT =  3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
