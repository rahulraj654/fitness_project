import React, { useState } from 'react';
import {
    CheckCircle2,
    History,
    Dumbbell,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Award,
    Info,
    X,
    MessageSquare
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

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullMonthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Dashboard = ({ user, dailyLogs, workoutHistory, onUpdateFoodLog, onLogWorkout }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);

    // Calendar view state
    const [viewDate, setViewDate] = useState(new Date());
    const [inputs, setInputs] = useState({});
    const [foodLogInput, setFoodLogInput] = useState("");
    const [isSavingFoodLog, setIsSavingFoodLog] = useState(false);

    const selDateObj = new Date(selectedDate);
    const dayOfWeek = selDateObj.getDay();
    const routine = routines[dayOfWeek];
    const isRestDay = !routine;
    const isSelectedToday = selectedDate === todayStr;

    // Daily log for selected date
    const selectedDayLog = dailyLogs.find(l => l.date === selectedDate) || { foodLog: "", workoutCompleted: false };

    // Sync food log input when selected date changes
    React.useEffect(() => {
        setFoodLogInput(selectedDayLog.foodLog || "");
    }, [selectedDate, selectedDayLog.foodLog]);

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
        setInputs({});
    };

    const handleInputChange = (id, val) => {
        setInputs(prev => ({ ...prev, [id]: val }));
    };

    const handleLog = (exercise) => {
        const val = inputs[exercise.id];
        if (!val) return;
        onLogWorkout(exercise.name, parseInt(val), exercise.weight || 0, selectedDate);
    };

    const handleSaveFoodLog = async () => {
        setIsSavingFoodLog(true);
        await onUpdateFoodLog(foodLogInput, selectedDate);
        setIsSavingFoodLog(false);
    };

    // Calendar generation
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    const calendarDays = [];
    // Padding for start of month
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }
    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        calendarDays.push(dateStr);
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] animate-in fade-in duration-500 pb-32">
            {/* Header */}
            <header className="mb-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isSelectedToday ? 'text-slate-400' : 'text-neon-green'}`}>
                            {isSelectedToday ? 'TODAY' : 'VIEWING'} — {selDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <h2 className="text-3xl font-black text-slate-950 italic tracking-tighter uppercase">
                            {isRestDay ? "Rest & Recover" : routine.name}
                        </h2>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                        <span className="text-slate-500 uppercase tracking-wider">Streak:</span>
                        <span className="text-slate-950 font-black">{user.streak}</span>
                    </div>
                </div>
            </header>

            {/* Monthly Calendar View */}
            <section className="mb-8">
                <div className="glass-card p-5 border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                            {fullMonthNames[viewMonth]} <span className="text-slate-400">{viewYear}</span>
                        </h3>
                        <div className="flex gap-1">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="calendar-grid mb-1">
                        {dayNames.map(d => (
                            <div key={d} className="text-[10px] font-black uppercase text-slate-400 text-center py-2">
                                {d}
                            </div>
                        ))}
                    </div>
                    <div className="calendar-grid">
                        {calendarDays.map((dateStr, idx) => {
                            if (!dateStr) return <div key={`empty-${idx}`} />;

                            const isSelected = dateStr === selectedDate;
                            const isToday = dateStr === todayStr;
                            const d = dateStr.split('-')[2];
                            const log = dailyLogs.find(l => l.date === dateStr);
                            const hasWorkout = log?.workoutCompleted;

                            return (
                                <button
                                    key={dateStr}
                                    onClick={() => handleDateClick(dateStr)}
                                    className={`
                                        aspect-square flex flex-col items-center justify-center rounded-xl transition-all relative border
                                        ${isSelected
                                            ? 'bg-slate-950 text-white border-slate-950 shadow-lg scale-105 z-10'
                                            : isToday
                                                ? 'bg-neon-green/10 border-neon-green text-slate-950'
                                                : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'
                                        }
                                    `}
                                >
                                    <span className="text-xs font-black">{parseInt(d)}</span>
                                    {hasWorkout && (
                                        <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-neon-green' : 'bg-neon-green'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="space-y-6">
                {/* Food Log Section */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare size={16} className="text-slate-400" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Food Log</h3>
                    </div>
                    <div className="glass-card p-4 border-slate-200">
                        <textarea
                            placeholder="What did you eat today? (e.g. 3 eggs, chicken breast, protein shake...)"
                            value={foodLogInput}
                            onChange={(e) => setFoodLogInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-950 text-sm focus:outline-none focus:border-neon-green transition-colors min-h-[100px] resize-none mb-3"
                        />
                        <button
                            onClick={handleSaveFoodLog}
                            disabled={isSavingFoodLog}
                            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isSavingFoodLog ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {isSavingFoodLog ? 'Saving...' : 'Save Food Log'}
                        </button>
                    </div>
                </section>

                {/* Workout Section */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <Dumbbell size={16} className="text-slate-400" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Training</h3>
                    </div>

                    {isRestDay ? (
                        <div className="glass-card p-8 border-slate-200 text-center">
                            <Award size={48} className="mx-auto text-slate-200 mb-4" />
                            <h4 className="text-lg font-black text-slate-400 italic mb-1 uppercase">Active Recovery</h4>
                            <p className="text-slate-400 text-xs">No specific session scheduled for this day.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {routine.exercises.map((ex) => {
                                const history = workoutHistory[ex.name] || { lastReps: 0, lastWeight: 0 };
                                const guideText = EXERCISE_GUIDE[ex.name];

                                return (
                                    <div key={ex.id} className="glass-card border-slate-200 overflow-hidden shadow-sm">
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-black italic text-slate-950 uppercase">{ex.name}</h3>
                                                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{ex.target}</div>
                                                </div>
                                                <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-[9px] font-black uppercase flex items-center gap-2">
                                                    <History size={11} className="text-slate-400" />
                                                    <span className="text-slate-500">Last:</span>
                                                    <span className="text-slate-950">{history.lastReps} {history.lastWeight > 0 ? `@${history.lastWeight}kg` : 'REPS'}</span>
                                                </div>
                                            </div>

                                            {/* Prominent Exercise Guide */}
                                            {guideText && (
                                                <div className="mb-5 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Info size={14} className="text-slate-400" />
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Form Guide</span>
                                                    </div>
                                                    <p className="text-slate-600 text-[11px] leading-relaxed italic">{guideText}</p>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="REPS"
                                                    value={inputs[ex.id] || ''}
                                                    onChange={(e) => handleInputChange(ex.id, e.target.value)}
                                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-950 font-black text-sm focus:outline-none focus:border-neon-green transition-colors"
                                                />
                                                <button
                                                    onClick={() => handleLog(ex)}
                                                    className="aspect-square bg-neon-green text-black flex items-center justify-center rounded-xl hover:scale-105 active:scale-95 transition-all px-4 shadow-md"
                                                >
                                                    <CheckCircle2 size={22} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
