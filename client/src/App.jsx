import React, { useState, useEffect } from 'react';
import { getUserData, updateFoodLog, logWorkout, updateUser } from './api/api';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import { Settings } from 'lucide-react';

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
            todayLog = { date: date, calories: 0, protein: 0, foodLog: "", workoutCompleted: false };
            newData.dailyLogs.push(todayLog);
        }

        todayLog.foodLog = foodLog;
        setData(newData);

        await updateFoodLog(foodLog);
    };

    const handleLogWorkout = async (exercise, reps, weight, date) => {
        if (!data) return;

        // Optimistic Update
        const newData = { ...data };
        newData.workoutHistory[exercise] = { lastReps: reps, lastWeight: weight };

        let todayLog = newData.dailyLogs.find(log => log.date === date);
        if (!todayLog) {
            todayLog = { date: date, calories: 0, protein: 0, foodLog: "", workoutCompleted: true };
            newData.dailyLogs.push(todayLog);
        } else {
            todayLog.workoutCompleted = true;
        }

        setData(newData);
        await logWorkout(exercise, reps, weight);
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-950 font-black italic tracking-widest text-2xl uppercase">
            <div className="animate-pulse">Loading Titan...</div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 px-6 text-center">
            <div className="glass-card p-8 border-slate-200">
                <h2 className="text-2xl font-black italic text-slate-900 mb-4 uppercase">Sync Failure</h2>
                <p className="text-slate-500 mb-6">Unable to connect to Titan server. Please check your network.</p>
                <button onClick={() => window.location.reload()} className="btn-primary w-full">RETRY SYNC</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Navbar Minimal */}
            <nav className="p-6 pb-2 max-w-2xl mx-auto flex justify-between items-center bg-slate-50 sticky top-0 z-50">
                <h1 className="text-2xl font-black italic tracking-tighter text-slate-950">
                    TITAN <span className="text-neon-green neon-text-glow">GAINZ</span>
                </h1>
                <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <Settings size={20} />
                </button>
            </nav>

            {/* Unified Dashboard */}
            <main className="max-w-2xl mx-auto px-6">
                <Dashboard
                    user={data.user}
                    workoutHistory={data.workoutHistory}
                    dailyLogs={data.dailyLogs}
                    onUpdateFoodLog={handleUpdateFoodLog}
                    onLogWorkout={handleLogWorkout}
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
