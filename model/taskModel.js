const pool = require("../db");

class TaskModel {

    // show all data
    async getAllTasks(userId){
        const result = await pool.query("SELECT * FROM task WHERE user_id = $1 ORDER BY create_at DESC",
            [userId]
        );
        return result.rows;
    }
    
    // creating data
    async create(taskData, userId){
        const {
            title,
            is_completed = false,
            category = 'General',
            priority = 'medium',
            note = null, 
            due_date = null,
            reminder = null
        } = taskData

        const result = await pool.query(
            `INSERT INTO task 
            (title, is_completed, category, priority, note, due_date, reminder, user_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [title, is_completed, category, priority, note , due_date, reminder, userId]
        );
        return result.rows[0];
    }

    // update data
    async update(id, updates, userId){
        const { 
            title, 
            is_completed,
            category,
            priority,
            note, 
            due_date,
            reminder
        } = updates;

        const result = await pool.query(
        `UPDATE task SET 
            title = COALESCE($1, title),
            is_completed = COALESCE($2, is_completed), 
            category = COALESCE($3, category),
            priority = COALESCE($4, priority),
            note = COALESCE($5, note),
            due_date = COALESCE($6, due_date),
            reminder = COALESCE($7, reminder)
        WHERE id = $8 AND user_id = $9 RETURNING *`,
        [title, is_completed, category, priority, note, due_date, reminder, id, userId]
        );
        return result.rows[0];
    }

    async delete(id, userId){
        const result = await pool.query(
            "DELETE FROM task WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        )
        return result.rows[0];
    }
}

module.exports = new TaskModel();