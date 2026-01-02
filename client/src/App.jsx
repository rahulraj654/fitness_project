import React, { useState, useEffect } from 'react';
import { getUserData, updateFoodLog, logWorkout, deleteSet, updateUser, logout } from './api/api';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';

const App = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getUserData();
            if (res) {
                // Ensure sets array exists if backend didn't send it (migration/safety)
                const safeLogs = (res.dailyLogs || []).map(log => ({
                    ...log,
                    sets: log.sets || []
                }));
                setData({ ...res, dailyLogs: safeLogs });
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleUpdateFoodLog = async (foodLog, date) => {
        if (!data) return;

        // Optimistic Update
        const newData = { ...data };
        let todayLog = newData.dailyLogs.find(log => log.date === date);

        if (!todayLog) {
            todayLog = { date: date, foodLog: "", workoutCompleted: false, sets: [], exercises: [] };
            newData.dailyLogs.push(todayLog);
        }

        todayLog.foodLog = foodLog;
        setData(newData);

        await updateFoodLog(foodLog, date);
    };

    const handleLogWorkout = async (exercise, reps, weight, date) => {
        if (!data) return;

        // 1. Call API first to get the ID (slightly less optimistic but ensures ID consistency for deletion)
        // Or we can generate a temp ID, but let's wait for simplicity unless it's slow.
        const res = await logWorkout(exercise, reps, weight, date);

        if (res && res.success) {
            const newData = { ...data };
            newData.workoutHistory[exercise] = { lastReps: reps, lastWeight: weight };

            let todayLog = newData.dailyLogs.find(log => log.date === date);
            if (!todayLog) {
                todayLog = { date: date, foodLog: "", workoutCompleted: true, exercises: [exercise], sets: [] };
                newData.dailyLogs.push(todayLog);
            } else {
                todayLog.workoutCompleted = true;
                if (!todayLog.exercises) todayLog.exercises = [];
                if (!todayLog.exercises.includes(exercise)) todayLog.exercises.push(exercise);
                if (!todayLog.sets) todayLog.sets = [];
            }

            // Add the new set
            todayLog.sets.push({
                id: res.id,
                date: date,
                exercise_name: exercise,
                reps: reps,
                weight: weight,
                created_at: new Date().toISOString()
            });

            setData(newData);
        }
    };

    const handleDeleteSet = async (setId, date) => {
        if (!data) return;

        // Optimistic Update
        const newData = { ...data };
        const todayLog = newData.dailyLogs.find(log => log.date === date);

        if (todayLog && todayLog.sets) {
            todayLog.sets = todayLog.sets.filter(s => s.id !== setId);

            // Recalculate completion status if needed
            // If sets are empty, is workout still "completed"? 
            // Maybe yes if they just deleted everything but still "worked out"? 
            // For now, let's keep it 'true' if the log exists, or strict check:
            if (todayLog.sets.length === 0) {
                todayLog.workoutCompleted = false;
                // Also remove exercise from list if no sets remain for it?
                // That might be complex if we don't know which exercise key to remove easily.
                // Let's leave `exercises` list as is for now, it's just a summary.
            }
        }

        setData(newData);
        await deleteSet(setId);
    };

    const handleLogout = async () => {
        await logout();
    };

    const handleUpdateUser = async (userData) => {
        if (!data) return;

        // Optimistic Update
        const newData = { ...data };
        newData.user = { ...newData.user, ...userData };
        setData(newData);

        await updateUser(userData);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-950 font-bold text-xl">
            <div className="animate-pulse">Loading...</div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 px-6 text-center">
            <div className="glass-card p-8 border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Connection Failed</h2>
                <p className="text-slate-500 mb-6">Unable to connect to server. Please check your network.</p>
                <button onClick={() => window.location.reload()} className="btn-primary w-full">Retry</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Main Dashboard */}
            <main>
                <Dashboard
                    user={data.user}
                    workoutHistory={data.workoutHistory}
                    dailyLogs={data.dailyLogs}
                    onUpdateFoodLog={handleUpdateFoodLog}
                    onLogWorkout={handleLogWorkout}
                    onDeleteSet={handleDeleteSet}
                    onLogout={handleLogout}
                    onOpenSettings={() => setShowSettings(true)}
                />
            </main>

            {/* Settings Modal */}
            <SettingsModal
                user={data.user}
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                onSave={handleUpdateUser}
            />
        </div>
    );
};

export default App;
