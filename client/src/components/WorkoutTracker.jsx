import React, { useState } from 'react';
import { CheckCircle2, History, Dumbbell, Award } from 'lucide-react';

const routines = {
    0: { name: "Rest & Eat", exercises: [] }, // Sunday
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
    3: { name: "Active Recovery", exercises: [] }, // Wednesday
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
    6: { name: "Rest & Eat", exercises: [] }, // Saturday
};

const WorkoutTracker = ({ workoutHistory, onLogWorkout }) => {
    const day = new Date().getDay();
    const routine = routines[day];
    const [inputs, setInputs] = useState({});

    const handleInputChange = (id, val) => {
        setInputs(prev => ({ ...prev, [id]: val }));
    };

    const handleLog = (exercise) => {
        const val = inputs[exercise.id];
        if (!val) return;
        onLogWorkout(exercise.name, parseInt(val), exercise.weight || 0);
        // Visual feedback could be added here
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="text-center py-4">
                <h2 className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mb-1">Daily Mission</h2>
                <div className="text-4xl font-black text-white italic">
                    {routine.name.toUpperCase()}
                </div>
            </header>

            {routine.exercises.length === 0 ? (
                <div className="glass-card p-12 text-center space-y-4">
                    <div className="inline-block p-4 bg-white/5 rounded-full text-neon-green">
                        <Award size={48} />
                    </div>
                    <p className="text-gray-400 font-medium">Recovery is where the gains happen. Eat big and rest well today.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {routine.exercises.map((ex) => {
                        const history = workoutHistory[ex.name] || { lastReps: 0, lastWeight: 0 };
                        return (
                            <div key={ex.id} className="glass-card p-5 group transition-all duration-300 hover:border-white/20">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-black italic group-hover:text-neon-green transition-colors">{ex.name}</h3>
                                        <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{ex.target}</div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter bg-white/5 px-2 py-1 rounded border border-white/5">
                                        <History size={12} className="text-gray-500" />
                                        Last: <span className="text-white">{history.lastReps} reps {history.lastWeight > 0 ? `@ ${history.lastWeight}kg` : ''}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            placeholder="Reps"
                                            value={inputs[ex.id] || ''}
                                            onChange={(e) => handleInputChange(ex.id, e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white font-black placeholder:text-gray-700 focus:outline-none focus:border-neon-green/50 transition-colors"
                                        />
                                        <Dumbbell className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
                                    </div>
                                    <button
                                        onClick={() => handleLog(ex)}
                                        className="aspect-square bg-neon-green text-black flex items-center justify-center rounded-lg hover:scale-105 active:scale-95 transition-transform"
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
    );
};

export default WorkoutTracker;
