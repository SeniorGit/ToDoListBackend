const express = require('express');
const cors = require('cors');
const taskRoutes = require("./routes/taskRouter");
const authRouter = require("./routes/authRouter")

require('dotenv').config();

const app = express();

// Middleware
app.use(cors({origin:['https://to-do-list-rho-ashen.vercel.app/']})); 
app.use(express.json()); 

// Routes
app.use('/tasks', taskRoutes);
app.use('/api/auth',  authRouter);

const PORT =  process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
