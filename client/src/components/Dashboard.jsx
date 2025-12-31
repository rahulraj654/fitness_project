import React, { useState } from 'react';
import {
    CheckCircle2,
    History,
    Dumbbell,
    Flame,
    Zap,
    Weight,
    ChevronRight,
    Calendar,
    Award
} from 'lucide-react';

const routines = {
    1: {
        name: "Upper Body A",
        exercises: [
            { id: "pushups", name: "Pushups", target: "Failure", type: "BW" },
            { id: "door_rows", name: "Door Rows", target: "3 x 12", type: "BW" },
            { id: "lateral_raises", name: "DB Lateral Raises", target: "4 x 25", type: "DB", weight: 2 },
            { id: "bicep_curls", name: "DB Bicep Curls", target: "3 x 25", type: "DB", weight: 2 },
        ]
    },
    2: {
        name: "Lower Body A",
        exercises: [
            { id: "split_squats", name: "Bulgarian Split Squats", target: "3 x 10/leg", type: "BW" },
            { id: "bw_squats", name: "Bodyweight Squats", target: "3 x 30", type: "BW" },
            { id: "calf_raises", name: "DB Calf Raises", target: "4 x 40", type: "DB", weight: 2 },
            { id: "plank", name: "Plank", target: "3 x 60s", type: "BW" },
        ]
    },
    4: {
        name: "Upper Body B",
        exercises: [
            { id: "pike_pushups", name: "Pike Pushups", target: "3 x 8-12", type: "BW" },
            { id: "diamond_pushups", name: "Diamond Pushups", target: "3 x Failure", type: "BW" },
            { id: "front_raises", name: "DB Front Raises", target: "3 x 20", type: "DB", weight: 2 },
            { id: "overhead_extensions", name: "DB Overhead Extensions", target: "3 x 20", type: "DB", weight: 2 },
        ]
    },
    5: {
        name: "Lower Body B",
        exercises: [
            { id: "glute_bridges", name: "Glute Bridges", target: "3 x 15", type: "BW" },
            { id: "reverse_lunges", name: "Reverse Lunges", target: "3 x 15/leg", type: "BW" },
            { id: "side_lunges", name: "Side Lunges", target: "3 x 12/leg", type: "BW" },
            { id: "leg_raises", name: "Leg Raises", target: "3 x 15", type: "BW" },
        ]
    },
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Dashboard = ({ user, todayStats, workoutHistory, onUpdateNutrition, onLogWorkout }) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const routine = routines[dayOfWeek];
    const isRestDay = !routine;

    const [inputs, setInputs] = useState({});

    const handleInputChange = (id, val) => {
        setInputs(prev => ({ ...prev, [id]: val }));
    };

    const handleLog = (exercise) => {
        const val = inputs[exercise.id];
        if (!val) return;
        onLogWorkout(exercise.name, parseInt(val), exercise.weight || 0);
    };

    const calTarget = 2800;
    const protTarget = 140;
    const calPercent = Math.min((todayStats.calories / calTarget) * 100, 100);
    const protPercent = Math.min((todayStats.protein / protTarget) * 100, 100);

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] animate-in fade-in duration-500 pb-32">
            {/* Date Header */}
            <header className="mb-8">
                <div className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-1">
                    {dayNames[dayOfWeek]}, {monthNames[now.getMonth()]} {now.getDate()}
                </div>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-white italic tracking-tighter">
                        {isRestDay ? "REST & RECOVER" : routine.name.toUpperCase()}
                    </h2>
                    <div className="flex items-center gap-2 bg-dark-card px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_5px_#39FF14]"></span>
                        STREAK: {user.streak}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 space-y-6">
                {isRestDay ? (
                    /* Weekly Calendar View for Rest Days */
                    <div className="space-y-4">
                        <div className="glass-card p-6 border-neon-green/20">
                            <div className="flex items-center gap-3 text-neon-green mb-4">
                                <Calendar size={20} />
                                <h3 className="font-black italic text-lg uppercase tracking-wider">Weekly Schedule</h3>
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {dayNames.map((name, index) => {
                                    const dayRoutine = routines[index];
                                    const isToday = index === dayOfWeek;
                                    const isPast = index < dayOfWeek;

                                    return (
                                        <div
                                            key={name}
                                            className={`flex flex-col items-center py-3 rounded-xl border transition-all ${isToday
                                                    ? 'bg-neon-green text-black border-neon-green scale-110 z-10 shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                                                    : 'bg-white/5 border-white/5 text-gray-400'
                                                }`}
                                        >
                                            <span className="text-[8px] font-black uppercase mb-1">{name.substring(0, 3)}</span>
                                            {dayRoutine ? (
                                                <Dumbbell size={14} className={isToday ? 'text-black' : 'text-gray-600'} />
                                            ) : (
                                                <Award size={14} className={isToday ? 'text-black' : 'text-neon-green/40'} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Upcoming Section */}
                        <div className="glass-card p-5">
                            <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Up Next</h4>
                            {dayOfWeek < 6 ? (
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-black italic text-lg">
                                            {routines[dayOfWeek + 1]?.name || "Rest Day"}
                                        </div>
                                        <div className="text-gray-500 text-xs font-bold uppercase">Tomorrow</div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-700" />
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm">New week starts Monday!</div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Workout List for Training Days */
                    <div className="space-y-4">
                        {routine.exercises.map((ex) => {
                            const history = workoutHistory[ex.name] || { lastReps: 0, lastWeight: 0 };
                            return (
                                <div key={ex.id} className="glass-card p-5 group hover:border-white/20 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-black italic group-hover:text-neon-green transition-colors">{ex.name}</h3>
                                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{ex.target}</div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase bg-white/5 px-2 py-1 rounded border border-white/5">
                                            <History size={10} className="text-gray-500" />
                                            Last: <span className="text-white">{history.lastReps} {history.lastWeight > 0 ? `@${history.lastWeight}kg` : 'REPS'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            placeholder="REPS"
                                            value={inputs[ex.id] || ''}
                                            onChange={(e) => handleInputChange(ex.id, e.target.value)}
                                            className="flex-1 bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white font-black focus:outline-none focus:border-neon-green/50 transition-colors"
                                        />
                                        <button
                                            onClick={() => handleLog(ex)}
                                            className="aspect-square bg-neon-green text-black flex items-center justify-center rounded-lg hover:scale-105 active:scale-95 transition-transform px-4"
                                        >
                                            <CheckCircle2 size={24} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Sticky Nutrition Footer */}
            <div className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto">
                <div className="glass-card p-4 neon-border shadow-2xl backdrop-blur-xl bg-dark-card/90">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Calories Compact */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase italic tracking-tighter">
                                <span className="flex items-center gap-1 text-neon-green"><Flame size={12} /> CALS</span>
                                <span className="text-white">{todayStats.calories} <span className="text-gray-600">/ {calTarget}</span></span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-neon-green shadow-[0_0_10px_#39FF14]"
                                    style={{ width: `${calPercent}%` }}
                                ></div>
                            </div>
                            <div className="flex gap-1 justify-end">
                                <button onClick={() => onUpdateNutrition(200, 0)} className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-black hover:bg-white/10">+200</button>
                                <button onClick={() => onUpdateNutrition(500, 0)} className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-black hover:bg-white/10">+500</button>
                            </div>
                        </div>

                        {/* Protein Compact */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase italic tracking-tighter">
                                <span className="flex items-center gap-1 text-blue-400"><Zap size={12} /> PRO</span>
                                <span className="text-white">{todayStats.protein}G <span className="text-gray-600">/ {protTarget}G</span></span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                                    style={{ width: `${protPercent}%` }}
                                ></div>
                            </div>
                            <div className="flex gap-1 justify-end">
                                <button onClick={() => onUpdateNutrition(0, 10)} className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-black hover:bg-white/10">+10G</button>
                                <button onClick={() => onUpdateNutrition(0, 25)} className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-black hover:bg-white/10">+25G</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
