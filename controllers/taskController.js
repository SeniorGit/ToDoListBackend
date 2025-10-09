const taskModel = require("../model/taskModel");

// show all to do list 
exports.getAllTask = async (req, res) => {
  try {
    const tasks = await taskModel.getAllTasks(req.user.id);
    res.json(tasks);
  } catch (err) {
    console.error("Error in getAllTask", err);
    res.status(500).json({ message: "We're experiencing technical issues. Please try again later." });
  }
};

// creating to do list
exports.createTask = async (req, res) => {
  const { 
    title,
    category = 'General',
    priority = 'medium',
    note, 
    due_date,
    reminder
  } = req.body;
  const processedDueDate = due_date === '' ? null : due_date;
  const processedReminder = reminder === '' ? null : reminder;
  try {
    const taskData ={  
    title,
    category,
    priority,
    note: note||null, 
    due_date: processedDueDate,
    reminder: processedReminder
  }
    const result = await taskModel.create(taskData, req.user.id);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error in createTask",err);
    res.status(500).json({ message: "We're experiencing technical issues. Please try again later." });
  }
};

// Update to do list
exports.updateTask = async (req, res) => {
  const id = parseInt(req.params.id);
  const { 
    title, 
    is_completed,
    category,
    priority,
    note, 
    due_date,
    reminder
  } = req.body;
  const processedDueDate = due_date === '' ? null : due_date;
  const processedReminder = reminder === '' ? null : reminder;
  try {
    const updates = {
      title,
      is_completed,
      category,
      priority,
      note,
      due_date: processedDueDate,
      reminder: processedReminder
    };
    const result = await taskModel.update(id, updates, req.user.id);

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(result);
  } catch (err) {
    console.error("Error in UpdateTask",err);
    res.status(500).json({ message: "We're experiencing technical issues. Please try again later." });
  }
};

// delete task 
exports.deleteTask = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await taskModel.delete(id, req.user.id);

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error in DeleteTask",err);
    res.status(500).json({ message: "We're experiencing technical issues. Please try again later." });
  }
};