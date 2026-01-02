const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const morgan = require('morgan');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Setup
// In production, use a persistent store like connect-redis or connect-mongo
app.use(session({
    secret: process.env.SESSION_SECRET || 'super_secret_fitness_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Set to false to allow session cookies over HTTP/SSH tunnel
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// CSRF Protection
const csrfProtection = csrf({ cookie: false });

// --- Auth Middleware ---
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    // If API request, return 401
    if (req.path.startsWith('/api')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // Otherwise redirect to login
    return res.redirect('/login.html');
};

// --- Routes ---

// Serve Login Page
app.get('/login.html', csrfProtection, (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// GET /api/csrf-token - Allow frontend to fetch a fresh token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Login Endpoint (Exempt from global CSRF check below)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        req.session.user = { username: 'admin', role: 'admin' };
        res.redirect('/');
    } else {
        res.redirect('/login.html?error=invalid_credentials');
    }
});

// Logout Endpoint (Exempt from global CSRF check below)
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.clearCookie('XSRF-TOKEN');
        res.status(200).json({ message: 'Logged out' });
    });
});

// Apply Global CSRF Protection to all routes below this point
app.use(csrfProtection);

// Set XSRF-TOKEN cookie for the frontend on every request
app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false });
    next();
});

// Since we are serving static files, we might need a specific route for root
// to enforce auth check
app.get('/', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    next();
});

// Serve Static Files (Public)
app.use(express.static(path.join(__dirname, '../public')));

// --- API Routes (Protected) ---
app.use('/api', requireAuth);

app.get('/api/user', (req, res) => {
    res.json({ user: req.session.user });
});


// --- NEW TITAN GAINZ API (SQLite) ---

app.get('/api/data', async (req, res) => {
    try {
        // Fetch all daily logs
        const dailyLogs = await db.all("SELECT * FROM daily_logs");

        // Fetch all workout sets
        const workoutSets = await db.all("SELECT * FROM workout_sets ORDER BY created_at ASC");

        // Construct the response structure expected by frontend
        // We need to attach 'sets' to each dailyLog or the frontend needs to parse it.
        // Let's modify the frontend to accept 'sets' as a flat list or nested.
        // For backwards compatibility/simplicity, let's nest them in the relevant dailyLog if possible, 
        // OR just send them back and let the frontend map them. 
        // Better: let's conform to the existing structure BUT add a `sets` array to each daily log.

        // 1. Process Logs
        const logsMap = {};
        dailyLogs.forEach(log => {
            logsMap[log.date] = {
                date: log.date,
                calories: log.calories,
                protein: log.protein,
                foodLog: log.food_log,
                workoutCompleted: false, // will calculate below
                exercises: [],
                sets: []
            };
        });

        // 2. Process Sets
        const workoutHistory = {}; // { ExerciseName: { lastReps, lastWeight } }

        workoutSets.forEach(set => {
            // Update History
            workoutHistory[set.exercise_name] = { lastReps: set.reps, lastWeight: set.weight };

            // Ensure log exists for this date (if set exists but no daily_log entry yet - rare but possible if logic changes)
            if (!logsMap[set.date]) {
                logsMap[set.date] = {
                    date: set.date,
                    calories: 0,
                    protein: 0,
                    foodLog: "",
                    workoutCompleted: false,
                    exercises: [],
                    sets: []
                };
            }

            const log = logsMap[set.date];
            log.sets.push(set);

            // Mark exercise as present
            if (!log.exercises.includes(set.exercise_name)) {
                log.exercises.push(set.exercise_name);
            }
            log.workoutCompleted = true; // If there are sets, it's completed (or at least started)
        });

        const finalLogs = Object.values(logsMap);

        res.json({
            user: { weight: 67, streak: 0, startDate: new Date().toISOString().split('T')[0] }, // Mock user stats for now
            dailyLogs: finalLogs,
            workoutHistory: workoutHistory
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post('/api/update-food-log', async (req, res) => {
    const { foodLog, date } = req.body;
    try {
        // Upsert logic
        const existing = await db.get("SELECT * FROM daily_logs WHERE date = ?", [date]);
        if (existing) {
            await db.run("UPDATE daily_logs SET food_log = ? WHERE date = ?", [foodLog, date]);
        } else {
            await db.run("INSERT INTO daily_logs (date, food_log) VALUES (?, ?)", [date, foodLog]);
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post('/api/update-nutrition', async (req, res) => {
    const { calories, protein, date } = req.body;
    try {
        const existing = await db.get("SELECT * FROM daily_logs WHERE date = ?", [date]);
        if (existing) {
            await db.run("UPDATE daily_logs SET calories = ?, protein = ? WHERE date = ?", [calories, protein, date]);
        } else {
            await db.run("INSERT INTO daily_logs (date, calories, protein) VALUES (?, ?, ?)", [date, calories, protein]);
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post('/api/log-workout', async (req, res) => {
    const { exercise, reps, weight, date } = req.body;
    try {
        // Insert set
        const result = await db.run(
            "INSERT INTO workout_sets (date, exercise_name, reps, weight) VALUES (?, ?, ?, ?)",
            [date, exercise, reps, weight]
        );

        // Also ensure a daily_log entry exists so the day shows up in the list
        const existing = await db.get("SELECT * FROM daily_logs WHERE date = ?", [date]);
        if (!existing) {
            await db.run("INSERT INTO daily_logs (date) VALUES (?)", [date]);
        }

        res.json({ success: true, id: result.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.delete('/api/sets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.run("DELETE FROM workout_sets WHERE id = ?", [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Start Server
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
    console.log(`To access via SSH tunnel, use: ssh -L ${PORT}:127.0.0.1:${PORT} user@host`);
});

