const pool = require('../configs/db');

exports.getUserById = async (id) => {

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?;',[id]);

    return rows[0];
};

exports.updateAvatar = async (id, avatar) => {
    await pool.query('UPDATE users SET avatar = ? WHERE id = ?;',[avatar, id]);
};

exports.changeName = async (id,name) =>{
    await pool.query('UPDATE users SET name = ? WHERE id = ?;', [name, id]);
}