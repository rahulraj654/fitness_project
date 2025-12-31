// Titan Gainz API Service
const BASE_URL = '/api';

// Mock Initial State
const mockData = {
    user: {
        name: "Hardgainer",
        weight: 67,
        streak: 5,
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
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.warn("Using mock data as backend is not available:", error);
        return mockData;
    }
};

export const updateNutrition = async (calories, protein) => {
    try {
        const response = await fetch(`${BASE_URL}/update-nutrition`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calories, protein, date: new Date().toISOString().split('T')[0] })
        });
        return await response.json();
    } catch (error) {
        console.warn("Mock nutrition update successful");
        return { success: true };
    }
};

export const logWorkout = async (exercise, reps, weight) => {
    try {
        const response = await fetch(`${BASE_URL}/log-workout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exercise, reps, weight, date: new Date().toISOString().split('T')[0] })
        });
        return await response.json();
    } catch (error) {
        console.warn(`Mock workout log for ${exercise} successful: ${reps} reps`);
        return { success: true };
    }
};
