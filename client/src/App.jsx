import React, { useState, useEffect } from 'react';
import { getUserData, updateFoodLog, logWorkout, updateUser, logout } from './api/api';
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
                setData(res);
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
            todayLog = { date: date, foodLog: "", workoutCompleted: false };
            newData.dailyLogs.push(todayLog);
        }

        todayLog.foodLog = foodLog;
        setData(newData);

        await updateFoodLog(foodLog, date);
    };

    const handleLogWorkout = async (exercise, reps, weight, date) => {
        if (!data) return;

        // Optimistic Update
        const newData = { ...data };
        newData.workoutHistory[exercise] = { lastReps: reps, lastWeight: weight };

        let todayLog = newData.dailyLogs.find(log => log.date === date);
        if (!todayLog) {
            todayLog = { date: date, foodLog: "", workoutCompleted: true, exercises: [exercise] };
            newData.dailyLogs.push(todayLog);
        } else {
            todayLog.workoutCompleted = true;
            if (!todayLog.exercises) todayLog.exercises = [];
            if (!todayLog.exercises.includes(exercise)) todayLog.exercises.push(exercise);
        }

        setData(newData);
        await logWorkout(exercise, reps, weight, date);
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
