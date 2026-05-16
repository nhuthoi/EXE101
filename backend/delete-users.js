const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

const username = 'AdminFPTU_EXE';

db.run(
  `DELETE FROM users WHERE username = ?`,
  [username],
  function (err) {

    if (err) {
      console.log('ERROR:', err.message);
    } else {
      console.log('Deleted users:', this.changes);
    }

    db.close();
  }
);