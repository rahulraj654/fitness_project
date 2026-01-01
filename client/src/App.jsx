import React, { useState, useEffect } from 'react';
import { getUserData, updateNutrition, logWorkout, updateUser } from './api/api';
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

    const handleUpdateNutrition = async (calDiff, protDiff) => {
        if (!data) return;

        // Optimistic Update
        const today = new Date().toISOString().split('T')[0];
        const newData = { ...data };
        let todayLog = newData.dailyLogs.find(log => log.date === today);

        if (!todayLog) {
            todayLog = { date: today, calories: 0, protein: 0, workoutCompleted: false };
            newData.dailyLogs.push(todayLog);
        }

        todayLog.calories += calDiff;
        todayLog.protein += protDiff;
        setData(newData);

        await updateNutrition(todayLog.calories, todayLog.protein);
    };

    const handleLogWorkout = async (exercise, reps, weight) => {
        if (!data) return;

        // Optimistic Update
        const newData = { ...data };
        newData.workoutHistory[exercise] = { lastReps: reps, lastWeight: weight };

        const today = new Date().toISOString().split('T')[0];
        let todayLog = newData.dailyLogs.find(log => log.date === today);
        if (!todayLog) {
            todayLog = { date: today, calories: 0, protein: 0, workoutCompleted: true };
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
        <div className="min-h-screen flex items-center justify-center bg-dark-bg text-neon-green font-black italic tracking-widest text-2xl">
            <div className="animate-pulse">LOADING TITAN...</div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white px-6 text-center">
            <div className="glass-card p-8">
                <h2 className="text-2xl font-black italic text-neon-green mb-4">CONNECTION LOST</h2>
                <p className="text-gray-400 mb-6">Unable to sync with Titan server. Please check your network.</p>
                <button onClick={() => window.location.reload()} className="btn-primary w-full">RETRY SYNC</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            {/* Navbar Minimal */}
            <nav className="p-6 pb-2 max-w-2xl mx-auto flex justify-between items-center bg-dark-bg sticky top-0 z-50">
                <h1 className="text-2xl font-black italic tracking-tighter">
                    TITAN <span className="text-neon-green">GAINZ</span>
                </h1>
                <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                    <Settings size={20} />
                </button>
            </nav>

            {/* Unified Dashboard */}
            <main className="max-w-2xl mx-auto px-6">
                <Dashboard
                    user={data.user}
                    workoutHistory={data.workoutHistory}
                    todayStats={data.dailyLogs.find(l => l.date === new Date().toISOString().split('T')[0]) || { calories: 0, protein: 0 }}
                    onUpdateNutrition={handleUpdateNutrition}
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
