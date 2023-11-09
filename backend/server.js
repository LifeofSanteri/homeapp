const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'homeapp'
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
            return res.json("NoUser"); // User not found
        }

        const userId = emailData[0].id; // Assuming 'id' is the primary key of the 'login' table

        const storedPasswordHash = emailData[0].password;

        bcrypt.compare(userPassword, storedPasswordHash, (bcryptErr, result) => {
            if (bcryptErr) {
                console.error('Bcrypt error:', bcryptErr);
                return res.status(500).json({ error: 'Error' });
            }

            if (result) {
                // Passwords match, check if the user is associated with any homes
                const homeSql = 'SELECT * FROM home WHERE user_id = ?';

                db.query(homeSql, [userId], (err, homeData) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return res.status(500).json({ error: 'Error' });
                    }

                    if (homeData.length > 0) {
                        return res.json("Success"); // Passwords match, login successful, and user is associated with at least one home
                    } else {
                        return res.json("NoHome"); // User is not associated with any homes
                    }
                });
            } else {
                return res.json("Failure"); // Passwords do not match, login failed
            }
        });
    });
});

app.listen(3307, () => {
    console.log('Server is running on port 3307');
});
