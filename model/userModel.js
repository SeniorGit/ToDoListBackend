const pool = require('../db')

class User {
    // find email for login
    static async findByEmail(email){
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email.toLowerCase()]
        )
        return result.rows[0];
    }

    // find by id
    static async findById(id){
        const result = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        )
        return result.rows[0];
    }

    // creating account new users
    static async create(userData){
        const {email, password_hash, username} = userData;
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, username)
            VALUES ($1, $2, $3) RETURNING id, email, username`,
            [email.toLowerCase(), password_hash, username]
        )
        return result.rows[0]
    }

    // edit user profile
    static async updateProfile(id, updates){
        const {
            email, 
            username,
        } = updates
        const result = await pool.query(
            `UPDATE users SET
            email = COALESCE($1, email),
            username = COALESCE($2, username)
            WHERE id = $3 RETURNING id, email, username`, 
            [email ? email.toLowerCase() : null, username, id]
        )
        return result.rows[0]
    }

    // change password
    static async updatePassword(id, newPasswordHash){
        const result = await pool.query(
            `UPDATE users SET
            password_hash = $1
            WHERE id = $2 RETURNING id, email, username`, 
            [newPasswordHash, id]
        )
        return result.rows[0]
    }

    // delete account
    static async deleteAccount(id){
        const result = await pool.query(
            `DELETE FROM users WHERE id = $1 RETURNING id, email`, 
            [id]
        )
        return result.rows[0]
    }
}
module.exports = User;