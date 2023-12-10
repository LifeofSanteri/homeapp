const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'homeapp',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected');
    }
});

app.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Bcrypt error:', err);
            return res.status(500).json("Error");
        }

        const sql = 'INSERT INTO login (name, email, password) VALUES (?, ?, ?)';
        const values = [req.body.name, req.body.email, hash];

        db.query(sql, values, (err, data) => {
            if (err) {
                console.error('Database query error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.json("EmailInUse");
                } else {
                    return res.json("Error");
                }
            }
            return res.json(data);
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const userEmail = email[0];
    const userPassword = password[0];

    const emailSql = 'SELECT * FROM login WHERE email = ?';

    db.query(emailSql, [userEmail], (err, emailData) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Error' });
        }

        if (emailData.length === 0) {
            return res.json({ status: "NoUser" });
        }

        const userId = emailData[0].id;

        const storedPasswordHash = emailData[0].password;

        bcrypt.compare(userPassword, storedPasswordHash, (bcryptErr, result) => {
            if (bcryptErr) {
                console.error('Bcrypt error:', bcryptErr);
                return res.status(500).json({ error: 'Error' });
            }

            if (result) {
                const homeSql = 'SELECT * FROM home WHERE user_id = ?';

                db.query(homeSql, [userId], (err, homeData) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return res.status(500).json({ error: 'Error' });
                    }

                    if (homeData.length > 0) {
                        return res.json({ status: "Success", userId: userId });
                    } else {
                        return res.json({ status: "NoHome", userId: userId });
                    }
                });
            } else {
                return res.json({ status: "Failure" });
            }
        });
    });
});

app.post('/create-home', (req, res) => {
    const userId = req.body.userId;
    const homeName = req.body.name;

    // Function to generate a random 4-digit number
    const generateRandomTag = () => Math.floor(1000 + Math.random() * 9000);

    // Initial attempt to generate a unique home tag
    let homeTag = generateRandomTag();

    // Function to recursively check and generate a unique home tag
    const insertHomeWithUniqueTag = () => {
        const createHomeSql = 'INSERT INTO home (user_id, name, tag) VALUES (?, ?, ?)';
        const values = [userId, homeName, homeTag];

        db.query(createHomeSql, values, (err, data) => {
            if (err) {
                // If the error is due to a non-unique tag, generate a new one and try again
                if (err.code === 'ER_DUP_ENTRY' && err.errno === 1062) {
                    homeTag = generateRandomTag();
                    insertHomeWithUniqueTag(); // Retry with the new tag
                } else {
                    console.error('Create home query error:', err);
                    return res.status(500).json({ error: 'Error' });
                }
            } else {
                return res.json({ status: 'HomeCreated', homeId: data.insertId, homeTag });
            }
        });
    };

    // Initial attempt to insert with a unique tag
    insertHomeWithUniqueTag();
});

app.post('/fetch-home', (req, res) => {
    const userId = req.body.userId;

    const homeSql = 'SELECT * FROM home WHERE user_id = ?';

    db.query(homeSql, [userId], (err, homeData) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ status: 'Error' });
        }

        if (homeData.length > 0) {
            const { id: homeId, name: homeName } = homeData[0];
            return res.json({ status: 'Success', homeId, homeName });
        } else {
            return res.json({ status: 'NoHome' });
        }
    });
});

app.post('/add-todo', (req, res) => {
    const userId = req.body.userId;
    const homeId = req.body.homeId;
    const task = req.body.task;

    const addTodoSql = 'INSERT INTO todos (home_id, task) VALUES (?, ?)';
    db.query(addTodoSql, [homeId, task], (err, result) => {
        if (err) {
            console.error('Error adding todo:', err);
            return res.status(500).json({ status: 'Error' });
        }

        const insertedTodoId = result.insertId;
        return res.json({ status: 'TodoAdded', todoId: insertedTodoId, homeId });
    });
});


app.post('/fetch-todos', (req, res) => {
    const homeId = req.body.homeId;

    const fetchTodosSql = 'SELECT * FROM todos WHERE home_id = ?';
    db.query(fetchTodosSql, [homeId], (err, todos) => {
        if (err) {
            console.error('Error fetching todos:', err);
            return res.status(500).json({ status: 'Error' });
        }

        return res.json({ status: 'Success', todos });
    });
});

// Add this route to handle todo deletion
app.post('/delete-todo', (req, res) => {
    const todoId = req.body.todoId;

    const deleteTodoSql = 'DELETE FROM todos WHERE id = ?';
    db.query(deleteTodoSql, [todoId], (err, result) => {
        if (err) {
            console.error('Error deleting todo:', err);
            return res.status(500).json({ status: 'Error' });
        }

        return res.json({ status: 'TodoDeleted' });
    });
});

app.post('/add-note', (req, res) => {
    const { homeId, note } = req.body;
  
    // Insert the note into the database
    const sql = 'INSERT INTO notes (home_id, note_text) VALUES (?, ?)';
    db.query(sql, [homeId, note], (err, result) => {
      if (err) {
        console.error('Error inserting note:', err);
        res.status(500).json({ status: 'ErrorAddingNote' });
      } else {
        const noteId = result.insertId;
        console.log('Note added successfully with ID:', noteId);
        res.json({ status: 'NoteAdded', noteId });
      }
    });
  });

  app.post('/fetch-notes', (req, res) => {
    const { homeId } = req.body;
  
    // Fetch notes from the database based on homeId
    const sql = 'SELECT id, note_text, checked FROM notes WHERE home_id = ?';
    db.query(sql, [homeId], (err, results) => {
        if (err) {
            console.error('Error fetching notes:', err);
            return res.status(500).json({ status: 'ErrorFetchingNotes' });
        } else {
            // Convert the checked property to a boolean
            const notes = results.map((row) => ({ id: row.id, text: row.note_text, checked: row.checked === 1 }));
            res.json({ status: 'NotesFetched', notes });
        }
    });
});

  app.post('/update-note-checked-state', (req, res) => {
    const { noteId, checked } = req.body;

    // Update the checked state in the database
    const updateNoteSql = 'UPDATE notes SET checked = ? WHERE id = ?';
    db.query(updateNoteSql, [checked, noteId], (err, result) => {
        if (err) {
            console.error('Error updating note checked state:', err);
            res.status(500).json({ status: 'ErrorUpdatingNoteCheckedState' });
        } else {
            res.json({ status: 'NoteCheckedStateUpdated' });
        }
    });
});

app.post('/clear-notes', (req, res) => {
    const homeId = req.body.homeId;

    const clearNotesSql = 'DELETE FROM notes WHERE home_id = ?';
    db.query(clearNotesSql, [homeId], (err, result) => {
        if (err) {
            console.error('Error clearing notes:', err);
            return res.status(500).json({ status: 'ErrorClearingNotes' });
        }

        return res.json({ status: 'NotesCleared' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


