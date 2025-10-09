const express = require("express");
const taskRouter = express.Router();
const taskController = require("../controllers/taskController")
const authMiddleware = require("../middleware/auth")

// router + middleware + the controller 
taskRouter.get("/",authMiddleware, taskController.getAllTask);
taskRouter.post("/",authMiddleware, taskController.createTask);
taskRouter.put("/:id",authMiddleware, taskController.updateTask);
taskRouter.delete("/:id",authMiddleware, taskController.deleteTask);

module.exports = taskRouter;