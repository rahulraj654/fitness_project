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
        secure: process.env.NODE_ENV === 'production', // true for HTTPS
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

// Placeholder for future Fitness API
app.get('/api/stats', (req, res) => {
    res.json({
        workouts: 12,
        caloriesBurned: 5400,
        streak: 5
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
