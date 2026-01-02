const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database file location
const DB_PATH = path.join(__dirname, 'fitness.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initSchema();
    }
});

function initSchema() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Daily Logs Table (Nutrition & General Stats)
        db.run(`CREATE TABLE IF NOT EXISTS daily_logs (
            date TEXT PRIMARY KEY,
            calories INTEGER DEFAULT 0,
            protein INTEGER DEFAULT 0,
            food_log TEXT DEFAULT "",
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Workout Sets Table (Individual Sets)
        db.run(`CREATE TABLE IF NOT EXISTS workout_sets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            exercise_name TEXT NOT NULL,
            reps INTEGER NOT NULL,
            weight REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed initial user if not exists (Simplified for now)
        db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
            if (!row) {
                db.run("INSERT INTO users (username) VALUES ('admin')");
            }
        });
    });
}

// Helper wrappers for Promisified DB access
const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

module.exports = { db, run, get, all };
