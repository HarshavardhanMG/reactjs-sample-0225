const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your XAMPP MySQL password
  database: 'tasksboard'
});
db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});
module.exports = db;
