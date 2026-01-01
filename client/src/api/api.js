// Titan Gainz API Service
const BASE_URL = '/api';

// Helper to get CSRF token from cookies
const getCsrfToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// Mock Initial State
const mockData = {
    user: {
        name: "Hardgainer",
        weight: 67,
        streak: 5,
        calorieTarget: 2800,
        proteinTarget: 140,
        startDate: "2023-10-20" // Day 1
    },
    dailyLogs: [
        { date: new Date().toISOString().split('T')[0], calories: 1200, protein: 60, workoutCompleted: false }
    ],
    workoutHistory: {
        "Pushups": { lastReps: 15, lastWeight: 0 },
        "Door Rows": { lastReps: 12, lastWeight: 0 },
        "DB Lateral Raises": { lastReps: 25, lastWeight: 2 },
        "DB Bicep Curls": { lastReps: 25, lastWeight: 2 },
        "Bulgarian Split Squats": { lastReps: 10, lastWeight: 0 },
        "Bodyweight Squats": { lastReps: 30, lastWeight: 0 },
        "DB Calf Raises": { lastReps: 40, lastWeight: 2 },
        "Plank": { lastReps: 60, lastWeight: 0 },
        "Pike Pushups": { lastReps: 8, lastWeight: 0 },
        "Diamond Pushups": { lastReps: 10, lastWeight: 0 },
        "DB Front Raises": { lastReps: 20, lastWeight: 2 },
        "DB Overhead Extensions": { lastReps: 20, lastWeight: 2 },
        "Glute Bridges": { lastReps: 15, lastWeight: 0 },
        "Reverse Lunges": { lastReps: 15, lastWeight: 0 },
        "Side Lunges": { lastReps: 12, lastWeight: 0 },
        "Leg Raises": { lastReps: 15, lastWeight: 0 }
    }
};

export const getUserData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/data`);

        if (response.url && response.url.includes('login.html')) {
            window.location.href = '/login.html';
            return null;
        }

        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.warn("Using mock data as backend is not available:", error);
        return mockData;
    }
};

export const logout = async () => {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'X-XSRF-Token': getCsrfToken()
            }
        });
        window.location.href = '/login.html';
        return await response.json();
    } catch (error) {
        console.error("Logout failed:", error);
        window.location.href = '/login.html';
    }
};

export const updateFoodLog = async (foodLog, date) => {
    try {
        const logDate = date || new Date().toISOString().split('T')[0];
        const response = await fetch(`${BASE_URL}/update-food-log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-Token': getCsrfToken()
            },
            body: JSON.stringify({ foodLog, date: logDate })
        });

        if (response.status === 401 || (response.url && response.url.includes('login.html'))) {
            window.location.href = '/login.html';
            return null;
        }

        if (!response.ok) throw new Error('Update failed');
        return await response.json();
    } catch (error) {
        console.error("Food log update failed:", error);
        return { success: false, error: error.message };
    }
};

export const updateNutrition = async (calories, protein, date) => {
    try {
        const logDate = date || new Date().toISOString().split('T')[0];
        const response = await fetch(`${BASE_URL}/update-nutrition`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-Token': getCsrfToken()
            },
            body: JSON.stringify({ calories, protein, date: logDate })
        });

        if (response.status === 401 || (response.url && response.url.includes('login.html'))) {
            window.location.href = '/login.html';
            return null;
        }

        if (!response.ok) throw new Error('Update failed');
        return await response.json();
    } catch (error) {
        console.error("Nutrition update failed:", error);
        return { success: false, error: error.message };
    }
};

export const logWorkout = async (exercise, reps, weight, date) => {
    try {
        const logDate = date || new Date().toISOString().split('T')[0];
        const response = await fetch(`${BASE_URL}/log-workout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-Token': getCsrfToken()
            },
            body: JSON.stringify({ exercise, reps, weight, date: logDate })
        });

        if (response.status === 401 || (response.url && response.url.includes('login.html'))) {
            window.location.href = '/login.html';
            return null;
        }

        if (!response.ok) throw new Error('Log failed');
        return await response.json();
    } catch (error) {
        console.error("Workout log failed:", error);
        return { success: false, error: error.message };
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/update-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-Token': getCsrfToken()
            },
            body: JSON.stringify(userData)
        });

        if (response.status === 401 || (response.url && response.url.includes('login.html'))) {
            window.location.href = '/login.html';
            return null;
        }

        if (!response.ok) throw new Error('Update failed');
        return await response.json();
    } catch (error) {
        console.warn("User update failed (using mock):", error);
        return { success: true, user: userData };
    }
};

