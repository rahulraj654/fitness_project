import React, { useState, useEffect } from 'react';
import { getUserData, updateNutrition, logWorkout } from './api/api';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import { Activity, LayoutDashboard, Settings } from 'lucide-react';

const App = () => {
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getUserData();
            setData(res);
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg text-neon-green">
            <div className="animate-pulse text-2xl font-bold tracking-widest">LOADING TITAN...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg pb-24">
            {/* Header */}
            <header className="p-6 flex justify-between items-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-black italic tracking-tighter text-white">
                    TITAN <span className="text-neon-green">GAINZ</span>
                </h1>
                <div className="flex items-center gap-2 text-sm font-semibold bg-dark-card px-3 py-1 rounded-full border border-white/10">
                    <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                    STREAK: {data.user.streak} DAYS
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-6">
                {activeTab === 'dashboard' ? (
                    <Dashboard
                        user={data.user}
                        todayStats={data.dailyLogs.find(l => l.date === new Date().toISOString().split('T')[0]) || { calories: 0, protein: 0 }}
                        onUpdateNutrition={handleUpdateNutrition}
                    />
                ) : (
                    <WorkoutTracker
                        workoutHistory={data.workoutHistory}
                        onLogWorkout={handleLogWorkout}
                    />
                )}
            </main>

            {/* Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-dark-card/80 backdrop-blur-md border-t border-white/10 p-4">
                <div className="max-w-md mx-auto flex justify-around items-center">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-neon-green' : 'text-gray-500'}`}
                    >
                        <LayoutDashboard size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Stats</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('workout')}
                        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'workout' ? 'text-neon-green' : 'text-gray-500'}`}
                    >
                        <Activity size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Train</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-gray-500 opacity-50 cursor-not-allowed">
                        <Settings size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default App;
