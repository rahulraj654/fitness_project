const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const morgan = require('morgan');
const path = require('path');

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
const csrfProtection = csrf({ cookie: true });

// Serve Static Files (Public)
app.use(express.static(path.join(__dirname, '../public')));

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

// Mock Fitness Data
let fitnessStats = {
    workouts: 12,
    caloriesBurned: 5420,
    streak: 5,
    activeMinutes: 1450
};

let activities = [
    { id: 1, type: 'Running', duration: '45m', date: 'Today', calories: 450 },
    { id: 2, type: 'Weightlifting', duration: '60m', date: 'Yesterday', calories: 320 },
    { id: 3, type: 'Yoga', duration: '30m', date: 'Monday', calories: 150 }
];

app.get('/api/stats', (req, res) => {
    res.json(fitnessStats);
});

app.get('/api/activities', (req, res) => {
    res.json(activities);
});

app.post('/api/activities', (req, res) => {
    const { type, duration, calories } = req.body;
    if (!type || !duration) {
        return res.status(400).json({ error: 'Type and duration required' });
    }
    const newActivity = {
        id: activities.length + 1,
        type,
        duration,
        calories: calories || 0,
        date: 'Just now'
    };
    activities.unshift(newActivity);
    res.status(201).json(newActivity);
});

// Start Server
// Binding to '127.0.0.1' ensures the server is ONLY accessible locally (or via SSH tunnel)
// and NOT exposed to the public internet directly.
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
