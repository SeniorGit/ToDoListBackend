const supabase = require('../utils/supabaseclient')

// show all to do list 
exports.getAllTask = async (req, res) => {
  try {
    const {data, error} = await supabase
    .from('task')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', {ascending:false})

    if(error) throw error

    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    console.error("Error in getAllTask", err);
    res.status(500).json({ 
      success: false,
      message: "We're experiencing technical issues. Please try again later." 
    });
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

  try {
    const taskData ={  
    user_id: req.user.id,
    title,
    category,
    priority,
    note: note||null, 
    due_date: due_date ||  null,
    reminder: reminder || null
  }
    const {data, error} = await supabase
    .from('task')
    .insert([taskData])
    .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data[0],
      message: "Task created successfully"
    });
  } catch (err) {
    console.error("Error in createTask",err);
    res.status(500).json({ message: "We're experiencing technical issues. Please try again later." });
  }
};

// Update to do list
exports.updateTask = async (req, res) => {
  const id = req.params.id;
  const { 
    title, 
    is_completed,
    category,
    priority,
    note, 
    due_date,
    reminder
  } = req.body;

  try {
    const updates = {
      title,
      is_completed,
      category,
      priority,
      note,
      due_date: due_date || null,
      reminder: reminder || null,
      update_at: new Date().toISOString()
    };
    const {data, error} = await supabase
    .from('task')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()

    if (error) throw error 

    res.json({
      success: true,
      data: data[0],
      message: "Task updated successfully"
    });

  } catch (err) {
    console.error("Error in UpdateTask",err);
    res.status(500).json({ 
      success: false,
      message: "We're experiencing technical issues. Please try again later." 
    });
  }
};

// delete task 
exports.deleteTask = async (req, res) => {
  const id = req.params.id;

  try {
    const {data, error} = await supabase
      .from('task')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    if (data.lenght === 0){
      return res.status(404).json({
        success: false,
        message: "Task not found"
      })
    }

    res.json({ 
      success: true,
      message: "Task deleted successfully" 
    });

  } catch (err) {
   console.error("Error in DeleteTask", err);
    res.status(500).json({ 
      success: false,
      message: "We're experiencing technical issues. Please try again later." 
    });
  }
};