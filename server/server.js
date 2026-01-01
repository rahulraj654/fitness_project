const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_PATH = path.join(__dirname, 'data.json');

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
const csrfProtection = csrf({ cookie: true });

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
    // If already logged in, redirect to dashboard
    if (req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, '../public/login.html'));
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

// GET /api/csrf-token - To get token for frontend (if needed mainly for SPA, but here we bake it into forms usually or fetch it)
// We will set cookie 'XSRF-TOKEN' which script.js reads. 
// csurf middleware automatically checks X-XSRF-Token header.
app.use(csrfProtection);
app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
});


// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // TODO: Replace with Real Database Check
    // Demo Credentials: admin / password
    if (username === 'admin' && password === 'password') {
        req.session.user = { username: 'admin', role: 'admin' };

        // Return JSON success or Redirect? 
        // original WFO login was form submit, let's keep it handled via form or JS.
        // If JS handles it:
        // res.json({ success: true, redirect: '/' });

        // If standardized form submit:
        res.redirect('/');
    } else {
        // Redirect back with error
        res.redirect('/login.html?error=invalid_credentials');
    }
});

// Logout Endpoint
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.clearCookie('connect.sid'); // clear session cookie
        res.status(200).json({ message: 'Logged out' }); // Client handles redirect
    });
});

// --- API Routes (Protected) ---
app.use('/api', requireAuth);

app.get('/api/user', (req, res) => {
    res.json({ user: req.session.user });
});

// Helper to read data (Titan Gainz Structure)
const readData = () => {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            const initialData = {
                user: { weight: 67, streak: 0, startDate: new Date().toISOString().split('T')[0] },
                dailyLogs: [],
                workoutHistory: {}
            };
            fs.writeFileSync(DATA_PATH, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const data = fs.readFileSync(DATA_PATH, 'utf8');
        let parsed = JSON.parse(data);

        // Migration/Migration logic if it's the old structure
        if (parsed.stats || parsed.activities) {
            parsed = {
                user: { weight: 67, streak: parsed.stats ? parsed.stats.streak : 0, startDate: new Date().toISOString().split('T')[0] },
                dailyLogs: [],
                workoutHistory: {}
            };
            saveData(parsed);
        }

        // Migration: Add foodLog to existing dailyLogs if missing
        parsed.dailyLogs = (parsed.dailyLogs || []).map(log => ({
            ...log,
            foodLog: log.foodLog || ""
        }));

        return parsed;
    } catch (err) {
        console.error('Error reading data:', err);
        return { user: { weight: 67, streak: 0, startDate: new Date().toISOString().split('T')[0] }, dailyLogs: [], workoutHistory: {} };
    }
};

// Helper to save data
const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error saving data:', err);
    }
};

// --- NEW TITAN GAINZ API ---

app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

app.post('/api/update-food-log', (req, res) => {
    const { foodLog, date } = req.body;
    const data = readData();

    let log = data.dailyLogs.find(l => l.date === date);
    if (!log) {
        log = { date, calories: 0, protein: 0, foodLog: "", workoutCompleted: false };
        data.dailyLogs.push(log);
    }

    log.foodLog = foodLog;

    saveData(data);
    res.json({ success: true, log });
});

app.post('/api/update-nutrition', (req, res) => {
    const { calories, protein, date } = req.body;
    const data = readData();

    let log = data.dailyLogs.find(l => l.date === date);
    if (!log) {
        log = { date, calories: 0, protein: 0, foodLog: "", workoutCompleted: false };
        data.dailyLogs.push(log);
    }

    log.calories = calories;
    log.protein = protein;

    saveData(data);
    res.json({ success: true, log });
});

app.post('/api/log-workout', (req, res) => {
    const { exercise, reps, weight, date } = req.body;
    const data = readData();

    // Update workout history
    data.workoutHistory[exercise] = { lastReps: reps, lastWeight: weight };

    // Mark today's workout as completed
    let log = data.dailyLogs.find(l => l.date === date);
    if (!log) {
        log = { date, calories: 0, protein: 0, workoutCompleted: true };
        data.dailyLogs.push(log);
    } else {
        log.workoutCompleted = true;
    }

    // Increment streak if not already counted today
    // (Simplistic logic: if no workout was completed yesterday, streak resets? 
    // For now, let's just keep it simple as a total count or manual)

    saveData(data);
    res.json({ success: true, workoutHistory: data.workoutHistory });
});

// Deprecated routes (for compatibility if needed)
app.get('/api/stats', (req, res) => {
    const data = readData();
    res.json(data.user);
});

// Start Server
// Binding to '127.0.0.1' ensures the server is ONLY accessible locally (or via SSH tunnel)
// and NOT exposed to the public internet directly.
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
