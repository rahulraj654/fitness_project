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
    Award,
    Info,
    X
} from 'lucide-react';

const EXERCISE_GUIDE = {
    "Pushups": "Hands shoulder-width apart. Keep body in a straight line (plank). Lower chest to floor.",
    "Door Rows": "Wrap towel around doorknob or hold frame. Lean back. Pull chest to door. Squeeze back muscles.",
    "DB Lateral Raises": "Stand tall. Lift 2kg DBs out to sides until shoulder height. Pour the pitcher motion.",
    "DB Bicep Curls": "Elbows pinned to side. Curl weight up. Lower SLOWLY (3 seconds down).",
    "Bulgarian Split Squats": "One foot on chair behind you. Hop front foot forward. Lower hips until front thigh is parallel.",
    "Bodyweight Squats": "Feet shoulder-width. Sit back like sitting in a chair. Keep chest up.",
    "DB Calf Raises": "Stand on edge of step (optional). Lift heels as high as possible. Squeeze at top.",
    "Pike Pushups": "Downward dog position (V-shape). Lower top of head to floor. Press back up.",
    "Diamond Pushups": "Hands together in diamond shape. Lower chest to hands. Keep elbows tucked.",
    "Glute Bridges": "Lie on back, knees bent. Drive hips to ceiling. Squeeze glutes hard at top.",
    "Plank": "Forearms on floor. Body straight. Tighten abs like someone is about to punch you."
};

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
    const currentDayOfWeek = now.getDay();

    // Interactive calendar state - user can click any day to view its routine
    const [selectedDay, setSelectedDay] = useState(currentDayOfWeek);
    const [expandedExercise, setExpandedExercise] = useState(null);
    const [inputs, setInputs] = useState({});

    const routine = routines[selectedDay];
    const isRestDay = !routine;
    const isSelectedToday = selectedDay === currentDayOfWeek;

    const handleDayClick = (dayIndex) => {
        setSelectedDay(dayIndex);
        setInputs({});
        setExpandedExercise(null);
    };

    const handleInputChange = (id, val) => {
        setInputs(prev => ({ ...prev, [id]: val }));
    };

    const handleLog = (exercise) => {
        const val = inputs[exercise.id];
        if (!val) return;
        onLogWorkout(exercise.name, parseInt(val), exercise.weight || 0);
    };

    const toggleGuide = (exerciseId) => {
        setExpandedExercise(prev => prev === exerciseId ? null : exerciseId);
    };

    // Format selected date for display
    const getSelectedDateText = () => {
        const selectedDate = new Date(now);
        selectedDate.setDate(now.getDate() + (selectedDay - currentDayOfWeek));
        return `${dayNames[selectedDay]}, ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}`;
    };

    const calTarget = 2800;
    const protTarget = 140;
    const calPercent = Math.min((todayStats.calories / calTarget) * 100, 100);
    const protPercent = Math.min((todayStats.protein / protTarget) * 100, 100);

    const handleDecreaseCalories = (amount) => {
        const newCal = Math.max(0, todayStats.calories - amount);
        const diff = newCal - todayStats.calories;
        onUpdateNutrition(diff, 0);
    };

    const handleDecreaseProtein = (amount) => {
        const newProt = Math.max(0, todayStats.protein - amount);
        const diff = newProt - todayStats.protein;
        onUpdateNutrition(0, diff);
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] animate-in fade-in duration-500 pb-32">
            {/* Date Header */}
            <header className="mb-6">
                <div className={`text-xs font-black uppercase tracking-[0.2em] mb-1 ${isSelectedToday ? 'text-gray-400' : 'text-neon-green'}`}>
                    {isSelectedToday ? 'TODAY' : 'VIEWING'} - {getSelectedDateText()}
                    {!isSelectedToday && <span className="ml-2 text-[9px] bg-neon-green/20 text-neon-green px-2 py-0.5 rounded">PLAN AHEAD</span>}
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

            {/* Always Visible Weekly Calendar */}
            <div className="mb-6">
                <div className="glass-card p-4 border-white/10">
                    <div className="grid grid-cols-7 gap-1.5">
                        {dayNames.map((name, index) => {
                            const dayRoutine = routines[index];
                            const isToday = index === currentDayOfWeek;
                            const isSelected = index === selectedDay;

                            return (
                                <button
                                    key={name}
                                    onClick={() => handleDayClick(index)}
                                    className={`flex flex-col items-center py-3 rounded-xl border transition-all ${isSelected
                                            ? 'bg-neon-green text-black border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.5)] scale-105 z-10'
                                            : isToday
                                                ? 'bg-white/10 border-white/20 text-white hover:border-white/40'
                                                : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                                        }`}
                                >
                                    <span className="text-[8px] font-black uppercase mb-1">{name.substring(0, 3)}</span>
                                    {dayRoutine ? (
                                        <Dumbbell size={14} className={isSelected ? 'text-black' : 'text-gray-600'} />
                                    ) : (
                                        <Award size={14} className={isSelected ? 'text-black' : 'text-gray-600'} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 space-y-4">
                {isRestDay ? (
                    /* Rest Day View */
                    <div className="glass-card p-6 border-white/10">
                        <div className="text-center py-8">
                            <Award size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-black text-gray-500 italic mb-2">NO SCHEDULED WORKOUT</h3>
                            <p className="text-gray-600 text-sm">Use this day for active recovery or click another day to plan ahead.</p>
                        </div>
                    </div>
                ) : (
                    /* Workout List for Training Days */
                    <div className="space-y-3">
                        {routine.exercises.map((ex) => {
                            const history = workoutHistory[ex.name] || { lastReps: 0, lastWeight: 0 };
                            const isExpanded = expandedExercise === ex.id;
                            const guideText = EXERCISE_GUIDE[ex.name];

                            return (
                                <div key={ex.id} className={`glass-card overflow-hidden group transition-all ${isExpanded ? 'border-neon-green/40' : 'hover:border-white/20'}`}>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-black italic group-hover:text-neon-green transition-colors">{ex.name}</h3>
                                                    {guideText && (
                                                        <button
                                                            onClick={() => toggleGuide(ex.id)}
                                                            className={`p-1.5 rounded-lg transition-all ${isExpanded ? 'bg-neon-green/20 text-neon-green' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                                                        >
                                                            {isExpanded ? <X size={14} /> : <Info size={14} />}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{ex.target}</div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase bg-white/5 px-2 py-1 rounded border border-white/5">
                                                <History size={10} className="text-gray-500" />
                                                Last: <span className="text-white">{history.lastReps} {history.lastWeight > 0 ? `@${history.lastWeight}kg` : 'REPS'}</span>
                                            </div>
                                        </div>

                                        {/* Exercise Guide - Expandable */}
                                        {isExpanded && guideText && (
                                            <div className="mb-4 p-3 bg-neon-green/5 border border-neon-green/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Info size={14} className="text-neon-green" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-neon-green">How To Perform</span>
                                                </div>
                                                <p className="text-gray-300 text-xs leading-relaxed">{guideText}</p>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="REPS"
                                                value={inputs[ex.id] || ''}
                                                onChange={(e) => handleInputChange(ex.id, e.target.value)}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white font-black text-sm focus:outline-none focus:border-neon-green/50 transition-colors"
                                            />
                                            <button
                                                onClick={() => handleLog(ex)}
                                                className="aspect-square bg-neon-green text-black flex items-center justify-center rounded-lg hover:scale-105 active:scale-95 transition-transform px-3"
                                            >
                                                <CheckCircle2 size={20} strokeWidth={3} />
                                            </button>
                                        </div>
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
                                {todayStats.calories > 0 && (
                                    <>
                                        <button
                                            onClick={() => handleDecreaseCalories(200)}
                                            className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-black hover:bg-red-500/30"
                                        >-200</button>
                                        <button
                                            onClick={() => handleDecreaseCalories(500)}
                                            className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-black hover:bg-red-500/30"
                                        >-500</button>
                                    </>
                                )}
                                <button
                                    onClick={() => onUpdateNutrition(200, 0)}
                                    className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-black hover:bg-white/10"
                                >+200</button>
                                <button
                                    onClick={() => onUpdateNutrition(500, 0)}
                                    className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-black hover:bg-white/10"
                                >+500</button>
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
                                {todayStats.protein > 0 && (
                                    <>
                                        <button
                                            onClick={() => handleDecreaseProtein(10)}
                                            className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-black hover:bg-red-500/30"
                                        >-10G</button>
                                        <button
                                            onClick={() => handleDecreaseProtein(25)}
                                            className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-black hover:bg-red-500/30"
                                        >-25G</button>
                                    </>
                                )}
                                <button
                                    onClick={() => onUpdateNutrition(0, 10)}
                                    className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-black hover:bg-white/10"
                                >+10G</button>
                                <button
                                    onClick={() => onUpdateNutrition(0, 25)}
                                    className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-black hover:bg-white/10"
                                >+25G</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
